export interface Money {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

export interface ProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: Money
  selectedOptions: Array<{ name: string; value: string }>
  image: ShopifyImage | null
}

export interface StorefrontProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  seo: { title: string | null; description: string | null }
  featuredImage: ShopifyImage | null
  images: { nodes: ShopifyImage[] }
  variants: { nodes: ProductVariant[] }
}

export interface StorefrontCollection {
  id: string
  title: string
  handle: string
  description: string
  products: { nodes: StorefrontProduct[] }
}

export interface CartLine {
  id: string
  quantity: number
  cost: { totalAmount: Money }
  merchandise: ProductVariant & {
    product: Pick<StorefrontProduct, 'title' | 'handle'>
  }
}

export interface StorefrontCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: Money
    totalAmount: Money
  }
  lines: { nodes: CartLine[] }
}

export type PublicStorefrontCart = Omit<StorefrontCart, 'id'>
