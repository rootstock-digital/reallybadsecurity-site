import type { StorefrontCart, StorefrontProduct } from './shopify.types'

const STOREFRONT_API_VERSION = '2026-01'

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  descriptionHtml
  seo { title description }
  featuredImage { url altText width height }
  images(first: 8) { nodes { url altText width height } }
  variants(first: 100) {
    nodes {
      id
      title
      availableForSale
      price { amount currencyCode }
      selectedOptions { name value }
      image { url altText width height }
    }
  }
`

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 100) {
    nodes {
      id
      quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id
          title
          availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
          product { title handle }
        }
      }
    }
  }
`

type ShopifyResponse<T> = { data?: T; errors?: Array<{ message: string }> }

export function isShopifyConfigured() {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN)
}

export async function getShopProducts(): Promise<StorefrontProduct[]> {
  const data = await storefrontRequest<{ products: { nodes: StorefrontProduct[] } }>(`
    query ShopProducts {
      products(first: 100, sortKey: BEST_SELLING) { nodes { ${PRODUCT_FIELDS} } }
    }
  `)
  return data.products.nodes
}

export async function getShopProduct(handle: string): Promise<StorefrontProduct | null> {
  const data = await storefrontRequest<{ product: StorefrontProduct | null }>(`
    query ShopProduct($handle: String!) {
      product(handle: $handle) { ${PRODUCT_FIELDS} }
    }
  `, { handle })
  return data.product
}

export async function getCart(id: string): Promise<StorefrontCart | null> {
  const data = await storefrontRequest<{ cart: StorefrontCart | null }>(`
    query GetCart($id: ID!) {
      cart(id: $id) { ${CART_FIELDS} }
    }
  `, { id })
  return data.cart
}

export async function createCart(variantId: string): Promise<StorefrontCart> {
  const data = await storefrontRequest<{ cartCreate: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> } }>(`
    mutation CreateCart($variantId: ID!) {
      cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: 1 }] }) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { variantId })
  return cartResult(data.cartCreate)
}

export async function addCartLine(cartId: string, variantId: string): Promise<StorefrontCart> {
  const data = await storefrontRequest<{ cartLinesAdd: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> } }>(`
    mutation AddCartLine($cartId: ID!, $variantId: ID!) {
      cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $variantId, quantity: 1 }]) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { cartId, variantId })
  return cartResult(data.cartLinesAdd)
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<StorefrontCart> {
  const data = await storefrontRequest<{ cartLinesUpdate: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> } }>(`
    mutation UpdateCartLine($cartId: ID!, $lineId: ID!, $quantity: Int!) {
      cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { cartId, lineId, quantity })
  return cartResult(data.cartLinesUpdate)
}

export async function removeCartLine(cartId: string, lineId: string): Promise<StorefrontCart> {
  const data = await storefrontRequest<{ cartLinesRemove: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> } }>(`
    mutation RemoveCartLine($cartId: ID!, $lineId: ID!) {
      cartLinesRemove(cartId: $cartId, lineIds: [$lineId]) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { cartId, lineId })
  return cartResult(data.cartLinesRemove)
}

function cartResult(result: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> }): StorefrontCart {
  const message = result.userErrors[0]?.message
  if (!result.cart || message) throw new Error(message || 'Shopify could not update the cart.')
  return result.cart
}

async function storefrontRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN
  if (!domain || !token) throw new Error('Shopify is not configured.')

  const response = await fetch(`https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Shopify is unavailable right now.')

  const payload = await response.json() as ShopifyResponse<T>
  if (payload.errors?.[0]?.message || !payload.data) throw new Error(payload.errors?.[0]?.message || 'Shopify returned an invalid response.')
  return payload.data
}
