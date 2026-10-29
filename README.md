# Shop X

A responsive mini storefront built with React, TypeScript, Vite, Tailwind CSS,
React Router, and Lucide icons.

## Getting started

```sh
npm install
npm run dev
```

Run the production checks with `npm run build` and `npm run lint`.

## Foundation files

- `tailwind.config.js` and `postcss.config.js` configure Tailwind utilities,
  responsive breakpoints, and backdrop-filter support.
- `src/index.css` loads Tailwind and sets the global typography and page styles.
- `src/data/products.json` contains the local product catalog.
- `src/context/CartContext.tsx` provides the cart state, LocalStorage persistence,
  and cart totals.
- `src/components/Navbar.tsx` contains responsive Products/Cart navigation, a
  persistent light/dark theme toggle, and the live cart count.
- `src/pages/ProductListing.tsx` provides the image-led hero, name search,
  category filters, and responsive product grid.
- `src/pages/ProductDetails.tsx` provides quantity selection and product detail.
- `src/pages/ShoppingCart.tsx` contains cart controls, totals, and an empty-cart
  state.
- `src/pages/Checkout.tsx` validates delivery details and displays a mock order
  confirmation with a generated tracking ID.
- `src/App.tsx` wires the storefront, details, cart, and checkout routes.
- `src/main.tsx` mounts the router and cart provider.

The storefront reads local mock data synchronously. Product image loading uses a
skeleton state. Checkout is a front-end demonstration and does not process a
payment or create an actual shipment.
