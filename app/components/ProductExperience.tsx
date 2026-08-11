'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import type { StorefrontProduct } from '../modules/commerce/shopify.types'
import ProductPurchaseForm from './ProductPurchaseForm'

function distinctImages(product: StorefrontProduct) {
  const images = [product.featuredImage, ...product.images.nodes, ...product.variants.nodes.map((variant) => variant.image)]
  return images.filter((image, index, list): image is NonNullable<typeof image> => Boolean(image) && list.findIndex((candidate) => candidate?.url === image?.url) === index)
}

export default function ProductExperience({ product }: { product: StorefrontProduct }) {
  const images = useMemo(() => distinctImages(product), [product])
  const [activeImageUrl, setActiveImageUrl] = useState(images[0]?.url ?? '')

  function selectVariantImage(image: StorefrontProduct['variants']['nodes'][number]['image']) {
    if (image) setActiveImageUrl(image.url)
  }

  const activeImage = images.find((image) => image.url === activeImageUrl) ?? images[0]

  return <>
    <div className="product-images" aria-label={`${product.title} images`}>
      {activeImage ? <div className="product-image-main">
        <Image src={activeImage.url} alt={activeImage.altText || product.title} width={activeImage.width || 1200} height={activeImage.height || 1200} sizes="(max-width: 760px) 100vw, 38rem" priority />
      </div> : <div className="shop-product-image-placeholder" aria-hidden="true" />}
      {images.length > 1 && <div className="product-image-thumbnails" aria-label="Product image gallery">
        {images.map((image) => <button className="product-image-thumbnail" type="button" key={image.url} onClick={() => setActiveImageUrl(image.url)} aria-pressed={image.url === activeImage?.url} aria-label={`View ${image.altText || product.title}`}>
          <Image src={image.url} alt="" width={160} height={160} sizes="5rem" />
        </button>)}
      </div>}
    </div>
    <div className="product-details">
      <span className="label">Really Bad Goods</span>
      <h1>{product.title}</h1>
      {product.descriptionHtml ? <div className="product-description" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} /> : product.description && <p className="product-description">{product.description}</p>}
      <ProductPurchaseForm variants={product.variants.nodes} onVariantChange={selectVariantImage} />
      <p className="product-checkout-note">Cart and checkout are securely powered by Shopify.</p>
    </div>
  </>
}
