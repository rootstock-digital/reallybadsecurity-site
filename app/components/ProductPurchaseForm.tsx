'use client'

import { useMemo, useState } from 'react'

import type { ProductVariant } from '../modules/commerce/shopify.types'
import { AddToCartButton } from './ShopCart'

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(Number(amount))
}

export default function ProductPurchaseForm({ variants, onVariantChange }: { variants: ProductVariant[]; onVariantChange?: (image: ProductVariant['image']) => void }) {
  const [variantId, setVariantId] = useState(variants[0]?.id ?? '')
  const variant = useMemo(() => variants.find((item) => item.id === variantId) ?? variants[0], [variantId, variants])
  if (!variant) return null

  const optionNames = [...new Set(variants.flatMap((item) => item.selectedOptions.map((option) => option.name)))]
  const selectedOptions = new Map(variant.selectedOptions.map((option) => [option.name, option.value]))

  function selectOption(optionName: string, optionValue: string) {
    const selected = variants.filter((item) => item.selectedOptions.some((option) => option.name === optionName && option.value === optionValue))
    const next = selected.find((item) => item.selectedOptions.every((option) => option.name === optionName || option.value === selectedOptions.get(option.name)))
      ?? selected.find((item) => item.availableForSale)
      ?? selected[0]
    if (!next) return
    setVariantId(next.id)
    onVariantChange?.(next.image)
  }

  return <div className="product-purchase">
    {variants.length > 1 && <div className="product-options">
      {optionNames.map((optionName) => {
        const values = [...new Set(variants.flatMap((item) => item.selectedOptions.filter((option) => option.name === optionName).map((option) => option.value)))]
        return <fieldset className="product-option" key={optionName}>
          <legend>{optionName}: <strong>{selectedOptions.get(optionName)}</strong></legend>
          <div className="product-option-values">
            {values.map((optionValue) => {
              const available = variants.some((item) => item.availableForSale && item.selectedOptions.some((option) => option.name === optionName && option.value === optionValue))
              const selected = selectedOptions.get(optionName) === optionValue
              return <button type="button" key={optionValue} className="product-option-button" disabled={!available} aria-pressed={selected} onClick={() => selectOption(optionName, optionValue)}>{optionValue}</button>
            })}
          </div>
        </fieldset>
      })}
    </div>}
    <p className="product-price">{formatMoney(variant.price.amount, variant.price.currencyCode)}</p>
    <AddToCartButton variantId={variant.id} availableForSale={variant.availableForSale} />
  </div>
}
