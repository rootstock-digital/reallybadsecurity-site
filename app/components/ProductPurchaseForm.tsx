'use client'

import { useMemo, useState } from 'react'

import type { ProductVariant } from '../modules/commerce/shopify.types'
import { AddToCartButton } from './ShopCart'

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(Number(amount))
}

export default function ProductPurchaseForm({ variants }: { variants: ProductVariant[] }) {
  const [variantId, setVariantId] = useState(variants[0]?.id ?? '')
  const variant = useMemo(() => variants.find((item) => item.id === variantId) ?? variants[0], [variantId, variants])
  if (!variant) return null

  return <div className="product-purchase">
    {variants.length > 1 && <label className="product-variant-select">Choose an option
      <select value={variant.id} onChange={(event) => setVariantId(event.target.value)}>
        {variants.map((item) => <option key={item.id} value={item.id} disabled={!item.availableForSale}>{item.title}{item.availableForSale ? '' : ' — Sold out'}</option>)}
      </select>
    </label>}
    <p className="product-price">{formatMoney(variant.price.amount, variant.price.currencyCode)}</p>
    <AddToCartButton variantId={variant.id} availableForSale={variant.availableForSale} />
  </div>
}
