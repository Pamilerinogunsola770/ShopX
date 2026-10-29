import { Link, NavLink } from 'react-router-dom'
import { Menu, Moon, ShoppingCart, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import CurrencyToggle from './CurrencyToggle'

interface NavbarProps {
  isDark: boolean
  onToggleTheme: () => void
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
        : 'text-neutral-600 hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-300'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/70 shadow-sm backdrop-blur-md dark:bg-black/40">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/shop"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2 text-xl font-black tracking-[-0.06em] text-neutral-950 dark:text-white"
          aria-label="Shop X home"
        >
          <img
            src="/shopx-logo.svg"
            alt=""
            className="size-10 rounded-xl shadow-md shadow-orange-500/20"
            width="40"
            height="40"
          />
          <span className="flex items-baseline gap-1">
            <span>Shop</span>
            <span className="text-orange-500">X</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-2 sm:flex" aria-label="Main navigation">
          <NavLink to="/shop" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-3">
          <div className="hidden md:block">
            <CurrencyToggle compact />
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid size-10 place-items-center rounded-full border border-white/50 bg-white/60 text-neutral-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600 dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          >
            {isDark ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>
          <Link
            to="/cart"
            className="relative grid size-10 place-items-center rounded-full border border-white/50 bg-white/60 text-neutral-800 shadow-sm transition hover:border-orange-300 hover:text-orange-600 dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingCart size={18} strokeWidth={1.8} aria-hidden="true" />
            <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-1 text-[10px] font-bold leading-none text-white">
              {cartCount}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-full border border-white/50 bg-white/60 text-neutral-800 sm:hidden dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="grid gap-1 border-t border-white/20 bg-white/85 px-4 py-3 backdrop-blur-md sm:hidden dark:bg-neutral-950/90"
          aria-label="Mobile navigation"
        >
          <NavLink
            to="/shop"
            onClick={() => setMenuOpen(false)}
            className={linkClass}
          >
            Products
          </NavLink>
          <NavLink
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className={linkClass}
          >
            Cart ({cartCount})
          </NavLink>
        </nav>
      )}
    </header>
  )
}
