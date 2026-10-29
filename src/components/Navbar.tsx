import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowRight, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const categories = ['Electronics', 'Accessories', 'Apparel']

export default function Navbar() {
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop')
    setMenuOpen(false)
  }

  function categoryLink(category: string) {
    return `/shop?category=${encodeURIComponent(category)}`
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/70 shadow-sm backdrop-blur-md dark:bg-black/40">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          to="/shop"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2 text-xl font-black tracking-[-0.06em] text-neutral-950 dark:text-white"
          aria-label="Shop X home"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/25">
            X
          </span>
          <span>SHOP<span className="text-orange-500">X</span></span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${isActive ? 'text-orange-600' : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white'}`
            }
          >
            Discover
          </NavLink>
          {categories.map((category) => (
            <Link
              key={category}
              to={categoryLink(category)}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300"
            >
              {category}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          role="search"
          className="ml-auto hidden w-full max-w-xs items-center gap-2 rounded-full border border-white/50 bg-white/55 px-4 py-2 text-neutral-500 shadow-inner shadow-black/[0.03] backdrop-blur-md focus-within:border-orange-400 sm:flex dark:border-white/10 dark:bg-white/10 dark:text-neutral-300"
        >
          <Search size={17} aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the collection"
            aria-label="Search products"
            className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-white"
          />
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
          <Link
            to="/cart"
            className="relative grid size-11 place-items-center rounded-full border border-white/50 bg-white/60 text-neutral-800 shadow-sm transition hover:border-orange-300 hover:text-orange-600 dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag size={19} strokeWidth={1.8} aria-hidden="true" />
            <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white">
              {cartCount}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-11 place-items-center rounded-full border border-white/50 bg-white/60 text-neutral-800 sm:hidden dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/20 bg-white/85 px-4 pb-5 pt-4 backdrop-blur-md sm:hidden dark:bg-neutral-950/90"
        >
          <form
            onSubmit={submitSearch}
            role="search"
            className="mb-4 flex items-center gap-2 rounded-xl border border-white/30 bg-white/70 px-4 py-3 dark:bg-white/10"
          >
            <Search size={17} aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the collection"
              aria-label="Search products"
              className="w-full bg-transparent text-sm outline-none"
            />
            <button type="submit" aria-label="Submit search">
              <ArrowRight size={17} />
            </button>
          </form>
          <nav className="grid gap-1" aria-label="Mobile navigation">
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-orange-50 dark:text-white dark:hover:bg-white/10"
            >
              Discover
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                to={categoryLink(category)}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-orange-50 dark:text-neutral-200 dark:hover:bg-white/10"
              >
                {category}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:hover:bg-white/10"
            >
              Your bag ({cartCount})
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
