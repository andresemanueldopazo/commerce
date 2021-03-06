import { Product } from '@vercel/commerce/types/product'
import { Cart } from '@vercel/commerce/types/cart'
import { CartFragment, OrderResumeFragment, SearchResultFragment } from '../../schema'
import { OrderResume } from '@vercel/commerce/types/customer'
import { CustomerAddressTypes } from '@vercel/commerce/types/customer/address'

export function normalizeSearchResult(item: SearchResultFragment): Product {
  return {
    id: item.productId,
    name: item.productName,
    description: item.description,
    slug: item.slug,
    path: item.slug,
    images: [
      {
        url: item.productAsset?.preview
          ? item.productAsset?.preview + '?w=800&mode=crop'
          : '',
      },
    ],
    variants: [],
    price: {
      value: (item.priceWithTax as any).min / 100,
      currencyCode: item.currencyCode,
    },
    options: [],
    sku: item.sku,
  }
}

export function normalizeCart(order: CartFragment): Cart & {
  hasShipping: boolean
  hasPayment: boolean
} {
  return {
    id: order.id.toString(),
    createdAt: order.createdAt,
    taxesIncluded: true,
    lineItemsSubtotalPrice: order.subTotalWithTax / 100,
    currency: { code: order.currencyCode },
    subtotalPrice: order.subTotalWithTax / 100,
    totalPrice: order.totalWithTax / 100,
    customerId: order.customer?.id,
    lineItems: order.lines?.map((l) => ({
      id: l.id,
      name: l.productVariant.name,
      quantity: l.quantity,
      url: l.productVariant.product.slug,
      variantId: l.productVariant.id,
      productId: l.productVariant.productId,
      images: [{ url: l.featuredAsset?.preview + '?preset=thumb' || '' }],
      discounts: l.discounts.map((d) => ({ value: d.amount / 100 })),
      path: '',
      variant: {
        id: l.productVariant.id,
        name: l.productVariant.name,
        sku: l.productVariant.sku,
        price: l.discountedUnitPriceWithTax / 100,
        listPrice: l.unitPriceWithTax / 100,
        image: {
          url: l.featuredAsset?.preview + '?preset=thumb' || '',
        },
        requiresShipping: true,
      },
    })),
    hasShipping: !!order.shippingAddress?.fullName,
    hasPayment: !!order.billingAddress?.fullName,
  }
}

export function normalizeAddress(
  order: CartFragment
): CustomerAddressTypes['address'] {
  return {
    // TODO: Not sure what should return.
    id: '',
    mask: '',
  }
}

export function normalizeOrderResume(order: OrderResumeFragment): OrderResume {
  return {
    code: order.code,
    orderPlacedAt: order.orderPlacedAt,
    shippingWithTax: order.shippingWithTax / 100,
    state: order.state,
    totalPrice: order.totalWithTax / 100,
    currency: { code: order.currencyCode },
    lineItems: order.lines?.map((l) => ({
      id: l.id,
      quantity: l.quantity,
      name: l.productVariant.name,
      variant: {
        price: l.discountedUnitPriceWithTax / 100,
        listPrice: l.unitPriceWithTax / 100,
        image: {
          url: l.featuredAsset?.preview + '?preset=thumb' || '',
        },
      },
      path: '',
    })), 
  }
}
