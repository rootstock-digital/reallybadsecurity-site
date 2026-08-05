import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import EditorialShell from '../components/EditorialShell'
import ShopCart from '../components/ShopCart'
import { getShopProducts, isShopifyConfigured } from '../modules/commerce/shopify.server'
import type { StorefrontProduct } from '../modules/commerce/shopify.types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'RBS Merch',
  description: 'Really Bad Security goods, powered by Shopify.',
  alternates: { canonical: '/shop' },
}

export default async function ShopPage() {
  const configured = isShopifyConfigured()
  const products = configured ? await getShopProducts().catch(() => null) : null
  const productGroups = products ? groupProductsByMeaning(products) : []

  return <EditorialShell>
    <header className="read-page-header">
      <div className="container">
        <span className="eyebrow">Shop</span>
        <h1>The Merch</h1>
        <p>Security culture for people who have survived the breach, the budget meeting, and the “quick question” in Slack.</p>
      </div>
    </header>

    <section className="section shop-section">
      <div className="container">
        <div className="shop-cart-row"><ShopCart /></div>
        {!configured ? <ShopMessage title="The shop is being connected." /> : !products ? <ShopMessage title="The shop is temporarily unavailable." /> : !productGroups.length ? <ShopMessage title="The first collection is on its way." /> : <div className="shop-collections">
          {productGroups.map((group) => <section className="shop-collection" key={group.title} aria-labelledby={`collection-${group.slug}`}>
            <div className="shop-collection-heading"><h2 id={`collection-${group.slug}`}>{group.title}</h2><p>Choose your format: tee, hoodie, or mug.</p></div>
            <div className="shop-grid">
              {group.products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>)}
        </div>}
      </div>
    </section>
  </EditorialShell>
}

function ProductCard({ product }: { product: StorefrontProduct }) {
  const image = product.featuredImage ?? product.images.nodes[0]
  const price = product.variants.nodes[0]?.price
  return <Link className="shop-product-card" href={`/shop/${product.handle}`}>
    {image ? <Image src={image.url} alt={image.altText || product.title} width={image.width || 1200} height={image.height || 1200} sizes="(max-width: 760px) 100vw, (max-width: 980px) 50vw, 25vw" /> : <div className="shop-product-image-placeholder" aria-hidden="true" />}
    <div><h4>{product.title}</h4>{price && <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: price.currencyCode }).format(Number(price.amount))}</p>}<span>View product →</span></div>
  </Link>
}

function groupProductsByMeaning(products: readonly StorefrontProduct[]) {
  const groups = new Map<string, StorefrontProduct[]>()

  for (const product of products) {
    const title = productMeaning(product.title)
    const group = groups.get(title) ?? []
    group.push(product)
    groups.set(title, group)
  }

  return [...groups].map(([title, groupedProducts]) => ({
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/(^-|-$)/gu, ''),
    products: groupedProducts.sort((left, right) => productFormatRank(left.title) - productFormatRank(right.title)),
  }))
}

function productMeaning(title: string) {
  return title.replace(/\s+(?:Tee|Hoodie|Mug)$/u, '')
}

function productFormatRank(title: string) {
  if (title.endsWith('Tee')) return 0
  if (title.endsWith('Hoodie')) return 1
  if (title.endsWith('Mug')) return 2
  return 3
}

function ShopMessage({ title }: { title: string }) {
  return <div className="shop-message"><h2>{title}</h2><p>Check back shortly. Product availability and checkout are managed securely through Shopify.</p></div>
}
