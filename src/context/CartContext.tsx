import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
}

export interface CartItem extends Product {
  quantity: number
}

interface CartContextValue {
  cart: CartItem[]
  cartCount: number
  cartSubtotal: number
  addToCart: (product: Product, qty?: number) => void
  updateQuantity: (id: string, changeAmount: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
}

const STORAGE_KEY = 'shop-x-cart'
const CartContext = createContext<CartContextValue | undefined>(undefined)

function parseCart(value: string | null): CartItem[] {
  if (!value) return []

  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) {
      throw new TypeError('Saved cart data must be an array.')
    }

    return parsed.filter((item): item is CartItem => {
      const valid =
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        Number.isFinite(item.price) &&
        typeof item.category === 'string' &&
        typeof item.image === 'string' &&
        typeof item.description === 'string' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0

      if (!valid) console.error('Ignoring an invalid item in the saved cart.')
      return valid
    })
  } catch (error) {
    console.error('Unable to read the saved cart from LocalStorage.', error)
    return []
  }
}

function loadCart(): CartItem[] {
  try {
    return parseCart(window.localStorage.getItem(STORAGE_KEY))
  } catch (error) {
    console.error('Unable to access the saved cart in LocalStorage.', error)
    return []
  }
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error('Unable to save the cart to LocalStorage.', error)
    }
  }, [cart])

  useEffect(() => {
    function syncCart(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setCart(parseCart(event.newValue))
      }
    }

    window.addEventListener('storage', syncCart)
    return () => window.removeEventListener('storage', syncCart)
  }, [])

  const addToCart = useCallback((product: Product, qty = 1) => {
    if (!Number.isInteger(qty) || qty < 1) {
      throw new RangeError('Quantity must be a positive whole number.')
    }

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id)
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        )
      }

      return [...currentCart, { ...product, quantity: qty }]
    })
  }, [])

  const updateQuantity = useCallback((id: string, changeAmount: number) => {
    if (!Number.isInteger(changeAmount)) {
      throw new RangeError('Quantity changes must be whole numbers.')
    }

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + changeAmount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0),
      cartSubtotal: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [addToCart, cart, clearCart, removeFromCart, updateQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// The provider and its context hook are intentionally colocated.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider.')
  }
  return context
}
