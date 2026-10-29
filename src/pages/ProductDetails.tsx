import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCart, type Product } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import productsData from '../data/products.json'

const products: Product[] = productsData

export default function ProductDetails() {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()

  if (!product) return <Navigate to="/shop" replace />
  const selectedProduct = product

  function addProduct() {
    addToCart(selectedProduct, quantity)
    setAdded(true)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-orange-600 dark:text-neutral-400"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to products
      </Link>

      <section className="mt-7 grid items-start gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/50 p-3 shadow-glass backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full rounded-[1.5rem] bg-neutral-100 object-cover dark:bg-neutral-900"
          />
        </div>
        <div className="rounded-[2rem] border border-white/50 bg-white/60 p-6 shadow-glass backdrop-blur-md sm:p-9 dark:border-white/10 dark:bg-white/[0.06]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            {product.category}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.06em] text-neutral-950 sm:text-5xl dark:text-white">
            {product.name}
          </h1>
          <p className="mt-5 text-2xl font-bold text-neutral-900 dark:text-white">
            {formatPrice(product.price)}
          </p>
          <div className="my-7 h-px bg-neutral-200/80 dark:bg-white/10" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Product details
          </h2>
          <p className="mt-3 text-base leading-7 text-neutral-600 dark:text-neutral-300">
            {product.description}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/50 bg-white/50 p-4 dark:border-white/10 dark:bg-black/15">
              <dt className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Category
              </dt>
              <dd className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                {product.category}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/50 bg-white/50 p-4 dark:border-white/10 dark:bg-black/15">
              <dt className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Item number
              </dt>
              <dd className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                {product.id}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center rounded-full border border-neutral-200 bg-white/70 p-1 dark:border-white/10 dark:bg-black/20">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                aria-label="Decrease quantity"
                className="grid size-10 place-items-center rounded-full text-neutral-700 transition hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10"
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span className="min-w-10 text-center text-sm font-bold" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                aria-label="Increase quantity"
                className="grid size-10 place-items-center rounded-full text-neutral-700 transition hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10"
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={addProduct}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-red-600"
            >
              <ShoppingCart size={17} aria-hidden="true" />
              {added ? 'Added to Cart' : 'Add to Cart'}
            </button>
          </div>
          {added && (
            <p className="mt-4 text-sm font-medium text-orange-700 dark:text-orange-300" role="status">
              {quantity} {quantity === 1 ? 'item' : 'items'} added to your cart.
              {' '}
              <Link to="/cart" className="underline underline-offset-2">
                View cart
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
