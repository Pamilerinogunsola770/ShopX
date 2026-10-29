import { ArrowLeftRight } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'

interface CurrencyToggleProps {
  compact?: boolean
}

export default function CurrencyToggle({
  compact = false,
}: CurrencyToggleProps) {
  const { currency, toggleCurrency, rateDescription } = useCurrency()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleCurrency}
        title={`${rateDescription} Select to switch currency.`}
        aria-label={`Price currency is ${currency}. Switch to ${currency === 'USD' ? 'Nigerian naira' : 'US dollars'}.`}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-white/60 bg-white/70 p-1 text-xs font-bold text-neutral-700 shadow-sm backdrop-blur-md transition hover:border-orange-300 dark:border-white/10 dark:bg-white/10 dark:text-neutral-200 ${
          compact ? 'min-h-9' : 'min-h-11'
        }`}
      >
        <span
          className={`rounded-full px-2.5 py-1.5 transition ${
            currency === 'USD'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'text-neutral-500 dark:text-neutral-300'
          }`}
        >
          USD
        </span>
        <ArrowLeftRight size={14} aria-hidden="true" className="text-orange-600" />
        <span
          className={`rounded-full px-2.5 py-1.5 transition ${
            currency === 'NGN'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'text-neutral-500 dark:text-neutral-300'
          }`}
        >
          NGN
        </span>
      </button>
      {!compact && (
        <span className="hidden max-w-48 text-[11px] leading-4 text-neutral-500 xl:block dark:text-neutral-400">
          NGN conversion at reference rate
        </span>
      )}
    </div>
  )
}
