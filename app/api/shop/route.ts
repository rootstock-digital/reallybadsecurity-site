interface Product {
  id: string
  title: string
  handle: string
  priceRange: { minVariantPrice: { amount: string } }
  images: { edges: { node: { url: string; altText: string } }[] }
}

const PRODUCTS_QUERY = `{
  products(first: 4) {
    edges {
      node {
        id title handle
        priceRange { minVariantPrice { amount } }
        images(first: 1) { edges { node { url altText } } }
      }
    }
  }
}`

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN

  if (!domain || !token) {
    return Response.json({ error: 'Shop is not configured' }, { status: 500 })
  }

  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
    // Cache at the edge so we don't hit Shopify on every page load.
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    return Response.json({ error: 'Failed to load products' }, { status: 502 })
  }

  const data = await res.json()
  const products: Product[] = data.data.products.edges.map((e: { node: Product }) => e.node)
  return Response.json({ products })
}
