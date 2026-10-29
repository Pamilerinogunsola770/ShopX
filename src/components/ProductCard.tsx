import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCart, type Product } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/50 bg-white/55 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-glass dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-orange-400/40">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-[4/4.2] overflow-hidden bg-neutral-100 dark:bg-neutral-900"
        aria-label={`View ${product.name}`}
      >
        {!imageLoaded && !imageError && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-200 via-neutral-100 to-orange-100 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800"
          />
        )}
        {imageError && (
          <div className="absolute inset-0 grid place-items-center bg-neutral-100 text-sm text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            Image unavailable
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`relative size-full object-cover transition duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-700 backdrop-blur-md">
          {product.category}
        </span>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/products/${product.id}`}
            className="font-semibold leading-snug text-neutral-900 hover:text-orange-600 dark:text-white"
          >
            {product.name}
          </Link>
          <span className="shrink-0 text-sm font-bold text-neutral-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
          {product.description}
        </p>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="mt-5 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/15 transition hover:from-orange-600 hover:to-red-600"
        >
          Add to Cart
          <span className="grid size-7 place-items-center rounded-full bg-white/20">
            <Plus size={15} aria-hidden="true" />
          </span>
        </button>
      </div>
    </article>
  )
}
