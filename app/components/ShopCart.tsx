'use client'

import { useEffect, useState } from 'react'

import type { PublicStorefrontCart } from '../modules/commerce/shopify.types'

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(Number(amount))
}

async function cartRequest(body?: unknown): Promise<PublicStorefrontCart | null> {
  const response = await fetch('/api/cart', body ? {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  } : undefined)
  const payload = await response.json() as { cart?: PublicStorefrontCart | null; error?: string }
  if (!response.ok) throw new Error(payload.error || 'The cart could not be updated.')
  return payload.cart ?? null
}

export function AddToCartButton({ variantId, availableForSale }: { variantId: string; availableForSale: boolean }) {
  const [status, setStatus] = useState<'idle' | 'working' | 'added' | 'error'>('idle')

  async function addItem() {
    setStatus('working')
    try {
      await cartRequest({ action: 'add', variantId })
      window.dispatchEvent(new Event('rbs-cart-updated'))
      setStatus('added')
    } catch {
      setStatus('error')
    }
  }

  if (!availableForSale) return <span className="shop-sold-out">Sold out</span>
  return <button className="shop-button" type="button" onClick={addItem} disabled={status === 'working'}>{status === 'working' ? 'Adding…' : status === 'added' ? 'Added to cart' : 'Add to cart'}</button>
}

export default function ShopCart() {
  const [cart, setCart] = useState<PublicStorefrontCart | null>(null)
  const [open, setOpen] = useState(false)
  const [busyLine, setBusyLine] = useState<string | null>(null)

  async function refreshCart() {
    try { setCart(await cartRequest()) } catch { setCart(null) }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => { void refreshCart() }, 0)
    window.addEventListener('rbs-cart-updated', refreshCart)
    return () => {
      window.clearTimeout(initialLoad)
      window.removeEventListener('rbs-cart-updated', refreshCart)
    }
  }, [])

  async function changeLine(lineId: string, quantity: number) {
    setBusyLine(lineId)
    try {
      setCart(await cartRequest(quantity ? { action: 'update', lineId, quantity } : { action: 'remove', lineId }))
    } finally {
      setBusyLine(null)
    }
  }

  return <div className="shop-cart">
    <button className="shop-cart-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="rbs-shop-cart">Cart{cart?.totalQuantity ? ` (${cart.totalQuantity})` : ''}</button>
    {open && <aside id="rbs-shop-cart" className="shop-cart-panel" aria-label="Shopping cart">
      <div className="shop-cart-heading"><span className="label">Your cart</span><button type="button" onClick={() => setOpen(false)} aria-label="Close cart">×</button></div>
      {!cart?.lines.nodes.length ? <p>Your cart is empty.</p> : <>
        <ul className="shop-cart-lines">
          {cart.lines.nodes.map((line) => <li key={line.id}>
            <div><strong>{line.merchandise.product.title}</strong><span>{line.merchandise.title !== 'Default Title' ? line.merchandise.title : ''}</span><small>{formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}</small></div>
            <div className="shop-quantity"><button type="button" onClick={() => void changeLine(line.id, line.quantity - 1)} disabled={busyLine === line.id} aria-label={`Remove one ${line.merchandise.product.title}`}>−</button><span>{line.quantity}</span><button type="button" onClick={() => void changeLine(line.id, line.quantity + 1)} disabled={busyLine === line.id} aria-label={`Add one ${line.merchandise.product.title}`}>+</button></div>
          </li>)}
        </ul>
        <div className="shop-cart-total"><span>Total</span><strong>{formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</strong></div>
        <a className="shop-button" href={cart.checkoutUrl}>Secure checkout <span aria-hidden="true">↗</span></a>
      </>}
    </aside>}
  </div>
}
