import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import ProductPurchaseForm from '../../components/ProductPurchaseForm'
import EditorialShell from '../../components/EditorialShell'
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
  const images = product.images.nodes.length ? product.images.nodes : product.featuredImage ? [product.featuredImage] : []

  return <EditorialShell>
    <section className="section product-page">
      <div className="container">
        <div className="shop-toolbar product-toolbar"><Link className="text-link" href="/shop">← All merch</Link><ShopCart /></div>
        <article className="product-layout">
          <div className="product-images">{images.length ? images.map((image) => <Image key={image.url} src={image.url} alt={image.altText || product.title} width={image.width || 1200} height={image.height || 1200} sizes="(max-width: 760px) 100vw, 50vw" />) : <div className="shop-product-image-placeholder" aria-hidden="true" />}</div>
          <div className="product-details"><span className="label">Really Bad Goods</span><h1>{product.title}</h1>{product.descriptionHtml ? <div className="product-description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} /> : product.description && <p className="product-description">{product.description}</p>}<ProductPurchaseForm variants={product.variants.nodes} /><p className="product-checkout-note">Cart and checkout are securely powered by Shopify.</p></div>
        </article>
      </div>
    </section>
  </EditorialShell>
}
