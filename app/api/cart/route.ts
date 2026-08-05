import { cookies } from 'next/headers'

import { addCartLine, createCart, getCart, removeCartLine, updateCartLine } from '../../modules/commerce/shopify.server'
import type { PublicStorefrontCart, StorefrontCart } from '../../modules/commerce/shopify.types'

const cartCookie = 'rbs_shop_cart'
const cartCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 14,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}

type CartRequest =
  | { action: 'add'; variantId: string }
  | { action: 'update'; lineId: string; quantity: number }
  | { action: 'remove'; lineId: string }

export async function GET() {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(cartCookie)?.value
  if (!cartId) return Response.json({ cart: null })

  try {
    const cart = await getCart(cartId)
    if (!cart) {
      cookieStore.delete(cartCookie)
      return Response.json({ cart: null })
    }
    return Response.json({ cart: publicCart(cart) })
  } catch {
    cookieStore.delete(cartCookie)
    return Response.json({ cart: null })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CartRequest
    const cookieStore = await cookies()
    const cartId = cookieStore.get(cartCookie)?.value

    if (body.action === 'add' && typeof body.variantId === 'string') {
      const cart = cartId ? await addCartLine(cartId, body.variantId) : await createCart(body.variantId)
      cookieStore.set(cartCookie, cart.id, cartCookieOptions)
      return Response.json({ cart: publicCart(cart) })
    }

    if (body.action === 'update' && typeof body.lineId === 'string' && Number.isInteger(body.quantity) && body.quantity > 0 && cartId) {
      return Response.json({ cart: publicCart(await updateCartLine(cartId, body.lineId, body.quantity)) })
    }

    if (body.action === 'remove' && typeof body.lineId === 'string' && cartId) {
      return Response.json({ cart: publicCart(await removeCartLine(cartId, body.lineId)) })
    }

    return Response.json({ error: 'The cart request is invalid.' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The cart could not be updated.'
    return Response.json({ error: message }, { status: 502 })
  }
}

function publicCart(cart: StorefrontCart): PublicStorefrontCart {
  return {
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: cart.cost,
    lines: cart.lines,
  }
}
