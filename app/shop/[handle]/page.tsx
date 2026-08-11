import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import EditorialShell from '../../components/EditorialShell'
import ProductExperience from '../../components/ProductExperience'
import ShopCart from '../../components/ShopCart'
import { getShopProduct, isShopifyConfigured } from '../../modules/commerce/shopify.server'

export const dynamic = 'force-dynamic'

type ShopProductPageProps = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ShopProductPageProps): Promise<Metadata> {
  const { handle } = await params
  if (!isShopifyConfigured()) return { title: 'RBS Merch' }
  const product = await getShopProduct(handle).catch(() => null)
  return product ? {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description.slice(0, 160) || `Shop ${product.title} from Really Bad Security.`,
    alternates: { canonical: `/shop/${product.handle}` },
  } : { title: 'RBS Merch' }
}

export default async function ProductPage({ params }: ShopProductPageProps) {
  const { handle } = await params
  if (!isShopifyConfigured()) notFound()
  const product = await getShopProduct(handle).catch(() => null)
  if (!product) notFound()
  return <EditorialShell>
    <section className="section product-page">
      <div className="container">
        <div className="shop-toolbar product-toolbar"><Link className="text-link" href="/shop">← All merch</Link><ShopCart /></div>
        <article className="product-layout">
          <ProductExperience product={product} />
        </article>
      </div>
    </section>
  </EditorialShell>
}
