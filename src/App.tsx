import { useState } from 'react'
import { Link, Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, Plus } from 'lucide-react'
import productsData from './data/products.json'
import { useCart, type Product } from './context/CartContext'
import Navbar from './components/Navbar'
import ShoppingCart from './pages/ShoppingCart'

const products: Product[] = productsData
const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

function ProductCard({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { addToCart } = useCart()

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/50 bg-white/55 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-glass dark:border-white/10 dark:bg-white/[0.06]">
      <div className="relative aspect-[4/4.2] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
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
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug text-neutral-900 dark:text-white">
            {product.name}
          </h3>
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
          className="mt-5 flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          Add to bag
          <span className="grid size-7 place-items-center rounded-full bg-neutral-950 text-white transition group-hover:bg-orange-500">
            <Plus size={15} aria-hidden="true" />
          </span>
        </button>
      </div>
    </article>
  )
}

function Storefront() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search')?.toLowerCase().trim() ?? ''
  const category = searchParams.get('category') ?? ''
  const visibleProducts = products.filter((product) => {
    const matchesSearch =
      !search ||
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(search)
    const matchesCategory = !category || product.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/30 bg-neutral-950 px-6 py-12 text-white shadow-glass sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="absolute -right-20 -top-32 -z-10 size-96 rounded-full bg-orange-500/30 blur-[100px]" />
        <div className="absolute -bottom-48 right-1/4 -z-10 size-80 rounded-full bg-red-500/20 blur-[100px]" />
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200 backdrop-blur-md">
            Considered goods. Everyday better.
          </p>
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            Find your
            <span className="block bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
              next favorite.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/65 sm:text-lg">
            A thoughtful edit of useful, well-made pieces for work, weekends,
            and everywhere in between.
          </p>
          <a
            href="#collection"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400"
          >
            Explore the collection
            <ArrowDownRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="absolute bottom-8 right-10 hidden max-w-56 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/75 shadow-glass backdrop-blur-md lg:block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">
            Shop X edit
          </span>
          Pieces made to keep, chosen to use.
        </div>
      </section>

      <section id="collection" className="scroll-mt-28 pt-16 sm:pt-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
              The collection
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-neutral-950 sm:text-4xl dark:text-white">
              {category || search ? 'Your selection' : 'Good things, picked well'}
            </h2>
          </div>
          {(category || search) && (
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-orange-600 dark:text-neutral-300"
            >
              Clear filters
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/50 bg-white/50 px-6 py-16 text-center shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              No products match that selection.
            </p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Try a different search or browse the full collection.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Browse all products
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f6f4] text-neutral-900 selection:bg-orange-200 dark:bg-[#101010] dark:text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<Storefront />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
    </div>
  )
}
