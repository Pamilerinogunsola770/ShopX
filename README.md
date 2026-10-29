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
- `src/components/Navbar.tsx` contains responsive navigation, catalog search,
  category links, and the live cart count.
- `src/App.tsx` wires the storefront and shopping-cart routes.
- `src/pages/ShoppingCart.tsx` contains cart controls and an empty-cart state.
- `src/main.tsx` mounts the router and cart provider.

The storefront reads local mock data synchronously. Product image loading uses a
skeleton state; checkout and its form validation are intended for a later step.
