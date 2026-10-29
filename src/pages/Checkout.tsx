import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, PackageCheck } from 'lucide-react'
import { useCart, type CartItem } from '../context/CartContext'

interface CheckoutFields {
  fullName: string
  email: string
  address: string
  phone: string
}

type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>

interface ConfirmedOrder {
  items: CartItem[]
  subtotal: number
  trackingId: string
}

const initialFields: CheckoutFields = {
  fullName: '',
  email: '',
  address: '',
  phone: '',
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

function validateFields(fields: CheckoutFields): CheckoutErrors {
  const errors: CheckoutErrors = {}
  if (!fields.fullName.trim()) errors.fullName = 'Enter your full name.'
  if (!fields.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!fields.address.trim()) errors.address = 'Enter your delivery address.'
  if (!fields.phone.trim()) {
    errors.phone = 'Enter your phone number.'
  } else if (!/^\d{7,15}$/.test(fields.phone.trim())) {
    errors.phone = 'Use 7 to 15 digits, with no spaces or symbols.'
  }
  return errors
}

export default function Checkout() {
  const { cart, cartSubtotal, clearCart } = useCart()
  const [fields, setFields] = useState(initialFields)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null)
  const navigate = useNavigate()

  const summaryItems = confirmedOrder?.items ?? cart
  const summarySubtotal = confirmedOrder?.subtotal ?? cartSubtotal

  function updateField(field: keyof CheckoutFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validateFields(fields)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0 || cart.length === 0) return

    const trackingId = `SX-${crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()}`
    setConfirmedOrder({
      items: [...cart],
      subtotal: cartSubtotal,
      trackingId,
    })
    clearCart()
  }

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/50 bg-white/55 px-6 py-16 text-center shadow-glass backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
            <PackageCheck size={26} aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-neutral-950 dark:text-white">
            Your bag is empty.
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Add an item before heading to checkout.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-bold text-white"
          >
            Continue shopping
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-orange-600 dark:text-neutral-400"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to bag
      </Link>
      <div className="mb-9 mt-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
          Secure checkout
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-neutral-950 sm:text-5xl dark:text-white">
          Delivery details
        </h1>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-[2rem] border border-white/50 bg-white/60 p-5 shadow-glass backdrop-blur-md sm:p-8 dark:border-white/10 dark:bg-white/[0.06]">
          <form
            noValidate
            onSubmit={submitOrder}
            className="space-y-5"
            aria-label="Checkout form"
          >
            <Field
              id="fullName"
              label="Full name"
              value={fields.fullName}
              error={errors.fullName}
              autoComplete="name"
              onChange={(value) => updateField('fullName', value)}
            />
            <Field
              id="email"
              label="Email address"
              type="email"
              value={fields.email}
              error={errors.email}
              autoComplete="email"
              onChange={(value) => updateField('email', value)}
            />
            <Field
              id="address"
              label="Delivery address"
              value={fields.address}
              error={errors.address}
              autoComplete="street-address"
              onChange={(value) => updateField('address', value)}
            />
            <Field
              id="phone"
              label="Phone number"
              type="tel"
              inputMode="numeric"
              value={fields.phone}
              error={errors.phone}
              autoComplete="tel"
              onChange={(value) => updateField('phone', value)}
            />
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-red-600"
            >
              Place order
            </button>
          </form>
        </section>

        <aside className="rounded-[2rem] border border-white/50 bg-white/60 p-6 shadow-glass backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
          <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">
            Order summary
          </h2>
          <ul className="mt-5 space-y-4">
            {summaryItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="size-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-neutral-200/80 pt-5 text-sm dark:border-white/10">
            <span className="text-neutral-500 dark:text-neutral-400">
              Subtotal
            </span>
            <span className="font-bold text-neutral-950 dark:text-white">
              {formatPrice(summarySubtotal)}
            </span>
          </div>
          <p className="mt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            Shipping and taxes are not included in this demo checkout.
          </p>
        </aside>
      </div>

      {confirmedOrder && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-neutral-950/60 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-confirmed-title"
            className="w-full max-w-lg rounded-[2rem] border border-white/30 bg-white/85 p-7 text-center shadow-2xl backdrop-blur-xl sm:p-10 dark:bg-neutral-900/90"
          >
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25">
              <Check size={30} aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
              Order placed
            </p>
            <h2
              id="order-confirmed-title"
              className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-neutral-950 dark:text-white"
            >
              Order Confirmed!
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Thanks for your order. Your items are being prepared.
            </p>
            <div className="mt-6 rounded-2xl border border-white/50 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Mock tracking ID
              </p>
              <p className="mt-1 font-mono text-lg font-bold tracking-wider text-neutral-950 dark:text-white">
                {confirmedOrder.trackingId}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-7 w-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3.5 text-sm font-bold text-white transition hover:from-orange-600 hover:to-red-600"
            >
              Continue shopping
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

interface FieldProps {
  id: keyof CheckoutFields
  label: string
  value: string
  error?: string
  type?: string
  inputMode?: 'numeric' | 'text'
  autoComplete: string
  onChange: (value: string) => void
}

function Field({
  id,
  label,
  value,
  error,
  type = 'text',
  inputMode,
  autoComplete,
  onChange,
}: FieldProps) {
  const errorId = `${id}-error`
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-12 w-full rounded-2xl border bg-white/70 px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:bg-black/20 dark:text-white ${
          error
            ? 'border-red-500'
            : 'border-neutral-200 dark:border-white/10'
        }`}
      />
      {error && (
        <p id={errorId} className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
