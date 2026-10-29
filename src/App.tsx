import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Checkout from './pages/Checkout'
import ProductDetails from './pages/ProductDetails'
import ProductListing from './pages/ProductListing'
import ShoppingCart from './pages/ShoppingCart'

function getInitialTheme(): boolean {
  try {
    const savedTheme = window.localStorage.getItem('shop-x-theme')
    if (savedTheme === 'dark') return true
    if (savedTheme === 'light') return false
  } catch (error) {
    console.error('Unable to read the saved theme preference.', error)
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function App() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try {
      window.localStorage.setItem('shop-x-theme', isDark ? 'dark' : 'light')
    } catch (error) {
      console.error('Unable to save the theme preference.', error)
    }

    function syncTheme(event: StorageEvent) {
      if (event.key === 'shop-x-theme') {
        setIsDark(event.newValue === 'dark')
      }
    }

    window.addEventListener('storage', syncTheme)
    return () => window.removeEventListener('storage', syncTheme)
  }, [isDark])

  return (
    <div className="min-h-screen bg-[#f7f6f4] text-neutral-900 selection:bg-orange-200 dark:bg-[#101010] dark:text-white">
      <Navbar
        isDark={isDark}
        onToggleTheme={() => setIsDark((current) => !current)}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
    </div>
  )
}
