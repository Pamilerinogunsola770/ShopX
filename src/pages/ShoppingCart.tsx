import { Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

export default function ShoppingCart() {
  const { cart, cartSubtotal, updateQuantity, removeFromCart, clearCart } =
    useCart()

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-orange-600 dark:text-neutral-400"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Continue shopping
      </Link>

      <div className="mb-9 mt-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            Your selection
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-neutral-950 sm:text-5xl dark:text-white">
            Shopping bag
          </h1>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-neutral-600 transition hover:border-red-200 hover:text-red-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
          >
            <Trash2 size={15} aria-hidden="true" />
            Clear bag
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <section className="rounded-[2rem] border border-white/50 bg-white/55 px-6 py-20 text-center shadow-glass backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
            <ShoppingBag size={26} strokeWidth={1.6} aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
            Your bag is taking a breather.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            There is nothing here just yet. Explore the collection and add
            something you love.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex items-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Explore the collection
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-[2rem] border border-white/50 bg-white/55 p-4 shadow-glass backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/[0.05]">
            <ul className="divide-y divide-neutral-200/70 dark:divide-white/10">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 py-5 first:pt-1 last:pb-1 sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-24 rounded-2xl bg-neutral-100 object-cover sm:size-28"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                      {item.category}
                    </p>
                    <h2 className="mt-1 font-semibold text-neutral-900 dark:text-white">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {formatPrice(item.price)} each
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 sm:justify-start">
                      <div className="flex items-center rounded-full border border-neutral-200 bg-white/70 p-1 dark:border-white/10 dark:bg-white/5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="grid size-8 place-items-center rounded-full text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10"
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="grid size-8 place-items-center rounded-full text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10"
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-semibold text-neutral-500 transition hover:text-red-600 dark:text-neutral-400"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-right font-bold text-neutral-900 dark:text-white sm:min-w-20">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <aside className="rounded-[2rem] border border-white/50 bg-white/55 p-6 shadow-glass backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
            <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">
              Order summary
            </h2>
            <div className="mt-6 flex justify-between border-b border-neutral-200/70 pb-4 text-sm dark:border-white/10">
              <span className="text-neutral-500 dark:text-neutral-400">
                Subtotal
              </span>
              <span className="font-semibold">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="mt-4 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              Shipping and taxes are calculated at checkout.
            </p>
            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-red-600"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  )
}
