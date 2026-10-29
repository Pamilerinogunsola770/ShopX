import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CurrencyCode = 'USD' | 'NGN'

interface CurrencyContextValue {
  currency: CurrencyCode
  toggleCurrency: () => void
  formatPrice: (usdPrice: number) => string
  rateDescription: string
}

interface CurrencyProviderProps {
  children: ReactNode
}

const STORAGE_KEY = 'shop-x-currency'
const USD_TO_NGN_RATE = 1346.24
const RATE_UPDATED = 'October 29, 2026'
const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
)

function getInitialCurrency(): CurrencyCode {
  try {
    const storedCurrency = window.localStorage.getItem(STORAGE_KEY)
    if (storedCurrency === 'USD' || storedCurrency === 'NGN') {
      return storedCurrency
    }
  } catch (error) {
    console.error('Unable to read the saved currency preference.', error)
  }
  return 'USD'
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<CurrencyCode>(getInitialCurrency)

  const toggleCurrency = useCallback(() => {
    setCurrency((current) => (current === 'USD' ? 'NGN' : 'USD'))
  }, [])

  const formatPrice = useCallback(
    (usdPrice: number) => {
      const amount = currency === 'NGN' ? usdPrice * USD_TO_NGN_RATE : usdPrice
      return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'NGN' ? 0 : 2,
      }).format(amount)
    },
    [currency],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, currency)
    } catch (error) {
      console.error('Unable to save the currency preference.', error)
    }

    function syncCurrency(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setCurrency(event.newValue === 'NGN' ? 'NGN' : 'USD')
      }
    }

    window.addEventListener('storage', syncCurrency)
    return () => window.removeEventListener('storage', syncCurrency)
  }, [currency])

  const value = useMemo(
    () => ({
      currency,
      toggleCurrency,
      formatPrice,
      rateDescription: `NGN prices use a reference rate of ₦${USD_TO_NGN_RATE.toLocaleString('en-NG')} per USD, dated ${RATE_UPDATED}.`,
    }),
    [currency, formatPrice, toggleCurrency],
  )

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

// The provider and its context hook are intentionally colocated.
// eslint-disable-next-line react-refresh/only-export-components
export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider.')
  }
  return context
}
