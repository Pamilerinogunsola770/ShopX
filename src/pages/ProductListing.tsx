import { useSearchParams } from 'react-router-dom'
import { ArrowDownRight, Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import productsData from '../data/products.json'
import type { Product } from '../context/CartContext'

const products: Product[] = productsData
const categories = ['All', ...new Set(products.map((product) => product.category))]
const heroImage =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=90'

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const activeCategory = searchParams.get('category') ?? 'All'

  function updateSearch(value: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set('search', value)
        else next.delete('search')
        return next
      },
      { replace: true },
    )
  }

  function updateCategory(category: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (category === 'All') next.delete('category')
        else next.set('category', category)
        return next
      },
      { replace: true },
    )
  }

  const visibleProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase())
    const matchesCategory =
      activeCategory === 'All' || product.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <section
        className="relative isolate overflow-hidden rounded-[2rem] border border-white/30 bg-neutral-950 bg-cover bg-center px-6 py-12 text-white shadow-glass sm:px-10 sm:py-16 lg:px-16 lg:py-20"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(10, 10, 10, .88) 0%, rgba(10, 10, 10, .68) 52%, rgba(10, 10, 10, .2) 100%), url("${heroImage}")`,
        }}
      >
        <div className="absolute -right-20 -top-32 -z-10 size-96 rounded-full bg-orange-500/25 blur-[100px]" />
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
          <p className="mt-6 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
            A thoughtful edit of useful, well-made pieces for work, weekends,
            and everywhere in between.
          </p>
          <a
            href="#collection"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:from-orange-400 hover:to-red-400"
          >
            Explore the collection
            <ArrowDownRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section id="collection" className="scroll-mt-28 pt-12 sm:pt-16">
        <div className="rounded-3xl border border-white/50 bg-white/60 p-4 shadow-glass backdrop-blur-md sm:p-5 dark:border-white/10 dark:bg-white/[0.06]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/75 px-4 text-neutral-500 transition focus-within:border-orange-400 dark:border-white/10 dark:bg-black/20 dark:text-neutral-400">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search products by name"
                aria-label="Search products by name"
                className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-white"
              />
            </label>
            <div className="flex flex-wrap gap-2" aria-label="Filter by category">
              {categories.map((category) => {
                const isSelected = activeCategory === category
                return (
                  <button
                    type="button"
                    key={category}
                    onClick={() => updateCategory(category)}
                    aria-pressed={isSelected}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                      isSelected
                        ? 'border-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                        : 'border-neutral-200 bg-white/60 text-neutral-600 hover:border-orange-300 hover:text-orange-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mb-6 mt-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
              The collection
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-neutral-950 sm:text-4xl dark:text-white">
              {search || activeCategory !== 'All'
                ? 'Your selection'
                : 'Good things, picked well'}
            </h2>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {visibleProducts.length} {visibleProducts.length === 1 ? 'piece' : 'pieces'}
          </p>
        </div>

        {visibleProducts.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/50 bg-white/55 px-6 py-16 text-center shadow-glass backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              No products match that search.
            </p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Try a different name or clear the selected category.
            </p>
            <button
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
              className="mt-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-red-600"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
