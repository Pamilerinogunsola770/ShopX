# Shop X

Shop X is a responsive mini e-commerce storefront for browsing a curated product
catalog, viewing product details, managing a shopping cart, and completing a
mock checkout. The interface uses a glass-inspired visual style, adapts to
mobile and desktop screens, and supports light/dark themes and USD/NGN price
display.

> Checkout is a front-end demonstration. The application does not process
> payments, submit customer details to a server, or create actual shipments.

## Features

- Browse a local catalog of 60 products across Electronics, Accessories,
  Apparel, Home & Living, Sports & Outdoors, and Beauty & Care.
- Search products by name and filter by category.
- Open product details, choose a quantity, and add products to the cart.
- Change cart quantities, remove individual products, or clear the cart.
- Keep cart contents and display preferences in browser LocalStorage.
- Toggle between USD and NGN price display.
- Toggle between light and dark themes.
- Use a draggable catalog dock for quick search and jumping to the start or end
  of the catalog.
- Validate checkout fields and show a mock confirmation with a generated
  tracking ID.
- Use responsive layouts, product-image loading placeholders, and an empty-cart
  state.

## Technology

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 3
- React Router DOM 7
- Lucide React
- PostCSS and Autoprefixer

## Requirements

Install the following before setting up the project:

- Node.js 20.19 or newer, or Node.js 22.12 or newer
- npm (included with Node.js)
- Git, if cloning the project from a Git repository

Check your installed versions:

```sh
node --version
npm --version
git --version
```

## Setup and installation

### 1. Get the project

Clone the repository, replacing `<repository-url>` with its Git URL:

```sh
git clone <repository-url>
cd ShopX
```

Alternatively, open the downloaded project directory in a terminal.

### 2. Install dependencies

From the project root (the directory containing `package.json`), run:

```sh
npm install
```

This installs the application and development dependencies defined by the
package manifest and lockfile.

### 3. Start the development server

```sh
npm run dev
```

Vite prints a local URL in the terminal, usually `http://localhost:5173/`. Open
that URL in a browser. Keep the terminal process running while using the
development site. Vite refreshes the browser when source files change.

To make the server available to other devices on your local network, run:

```sh
npm run dev -- --host 0.0.0.0
```

### 4. Build and preview a production version

Run the TypeScript checks and create the optimized production bundle:

```sh
npm run build
```

Vite writes the output to `dist/`. To serve that output locally:

```sh
npm run preview
```

Open the preview URL printed in the terminal. The preview server is for local
verification; deploy the generated `dist/` directory to a static hosting
provider for production.

### 5. Run the linter

```sh
npm run lint
```

For a step-by-step explanation of the project setup, architecture, key user
flows, and a suggested live code-change exercise, see
[BUILD_WALKTHROUGH.md](./BUILD_WALKTHROUGH.md).

## Available npm scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the project and create a production build. |
| `npm run lint` | Run ESLint across the project. |
| `npm run preview` | Preview the production build locally. |

## Application routes

| Route | Page |
| --- | --- |
| `/` | Redirects to the product listing. |
| `/shop` | Product catalog, search, and category filters. |
| `/products/:id` | Product details and quantity selection. |
| `/cart` | Shopping cart and order subtotal. |
| `/checkout` | Validated mock checkout and order confirmation. |

## Project structure

```text
public/
  shopx-logo.svg                  Brand logo and browser favicon
src/
  components/
    CurrencyToggle.tsx            USD/NGN display switch
    FloatingCatalogControls.tsx   Draggable catalog search and jump controls
    Footer.tsx                    Store footer
    Navbar.tsx                    Responsive navigation and theme switch
    ProductCard.tsx               Reusable product card
  context/
    CartContext.tsx                Cart state and LocalStorage persistence
    CurrencyContext.tsx            Currency preference and price formatting
  data/
    products.json                  Local mock product catalog
  pages/
    Checkout.tsx                   Checkout validation and mock confirmation
    ProductDetails.tsx             Dynamic product detail page
    ProductListing.tsx             Catalog, search, and category filtering
    ShoppingCart.tsx               Cart management and order summary
  App.tsx                           Theme preference and route definitions
  index.css                         Tailwind directives and global styles
  main.tsx                          React entry point and context providers
index.html                          HTML entry point and page metadata
tailwind.config.js                  Tailwind theme and dark-mode configuration
postcss.config.js                   Tailwind and Autoprefixer configuration
vite.config.ts                      Vite configuration
```

## Assumptions and implementation notes

- Product data is static and loaded from `src/data/products.json`; no API or
  database is required.
- Product prices in the catalog are stored in USD. NGN display uses a fixed
  reference conversion of **₦1,346.24 per USD**, dated **October 29, 2026**.
  This value is not a live exchange rate or a guaranteed retail price. Update
  the rate in `src/context/CurrencyContext.tsx` when refreshing the reference.
- Cart contents, selected display currency, selected theme, and catalog-dock
  position are saved locally in the current browser. Clearing browser storage
  clears these preferences and the cart.
- Product and hero photography uses Unsplash image URLs, so images require an
  internet connection. Product cards display a loading placeholder while an
  image loads.
- Checkout validation runs in the browser. The form does not transmit or store
  the entered delivery information, and placing an order only displays a mock
  confirmation and tracking ID.
- The checkout phone field accepts 7–15 digits and does not accept formatting
  characters such as spaces, plus signs, or hyphens.
- The project uses TypeScript (`.ts` and `.tsx`) source files. Keep new screens
  and components in the matching TypeScript format.

## Troubleshooting

- If `npm run dev` cannot find a dependency, run `npm install` from the project
  root and retry.
- If the default development port is already in use, Vite will report another
  available port in the terminal.
- If a route or page appears stale after updates, refresh the browser. If the
  problem continues, stop the development server, restart `npm run dev`, and
  reload the page.
- If product images do not load, check the internet connection and confirm the
  associated Unsplash URL in `src/data/products.json` is available.
