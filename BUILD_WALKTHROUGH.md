# Shop X: Build and Code Walkthrough

This guide explains how Shop X was created, how its main pieces fit together,
and how to make a small change confidently during a code walkthrough. It is
written for the current TypeScript + React project.

## 1. What the application does

Shop X is a client-side mini storefront. Visitors can:

1. Browse a local catalog of products.
2. Search by product name and filter by category.
3. Open an individual product page and select a quantity.
4. Add items to a cart, adjust quantities, or remove items.
5. View the subtotal and enter a mock checkout flow.
6. See front-end validation errors or a mock order confirmation.
7. Change light/dark theme and USD/NGN price display.

The app does not use a server, database, payment provider, or shipping
integration. Product data is static JSON, and browser LocalStorage is used for
the cart and user display preferences.

## 2. Tools and concepts used

- **Node.js and npm** run the development tools and install dependencies.
- **Vite** serves the app while developing and creates the production bundle.
- **React** builds the UI as reusable components.
- **TypeScript** adds types to components, product data, and shared state.
- **React Router** maps browser paths to pages without full-page navigation.
- **Tailwind CSS** supplies responsive styling and glass effects through
  utility classes.
- **Lucide React** supplies interface icons.
- **React Context** shares the cart and currency across unrelated pages.
- **LocalStorage** keeps selected state after a reload in the same browser.

## 3. Create a React TypeScript project from scratch

These are the steps to create a fresh Vite project with the same foundation:

```sh
npm create vite@latest shop-x -- --template react-ts
cd shop-x
npm install
```

Install the libraries used by the app:

```sh
npm install react-router-dom lucide-react
npm install -D tailwindcss@^3.4.17 postcss autoprefixer
npx tailwindcss init -p
```

If Vite asks whether to install the `create-vite` package, confirm. Choose the
React TypeScript template when running the interactive setup instead of the
command above.

### Configure Tailwind

In `tailwind.config.js`, tell Tailwind where to look for class names and use
class-based dark mode:

```js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [],
}
```

In `src/index.css`, include the Tailwind layers:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Vite's React TypeScript template already has an HTML entry point, a `src/main`
file, and a working build setup. Keep those, replacing the starter UI as the
application is added.

## 4. Install and run this submitted project

From the folder containing `package.json`:

```sh
npm install
npm run dev
```

Open the local address printed by Vite, normally `http://localhost:5173/`.
Leave the development command running in its terminal while using the app.

Other useful commands:

```sh
npm run lint
npm run build
npm run preview
```

- `lint` checks the source with ESLint.
- `build` runs the TypeScript project checks and creates optimized files under
  `dist/`.
- `preview` serves the production build locally after `build` has completed.

## 5. Understand the folder structure

```text
public/
  shopx-logo.svg                  Logo and browser-tab icon
src/
  components/
    CurrencyToggle.tsx            Shared USD/NGN switch
    FloatingCatalogControls.tsx   Draggable search and catalog jump dock
    Footer.tsx                    Store footer
    Navbar.tsx                    Navigation, cart count, theme toggle
    ProductCard.tsx               Reusable product tile
  context/
    CartContext.tsx                Shared cart state and calculations
    CurrencyContext.tsx            Shared currency and price formatting
  data/
    products.json                  Local mock catalog
  pages/
    Checkout.tsx                   Checkout form and mock confirmation
    ProductDetails.tsx             One product's details
    ProductListing.tsx             Searchable, filterable catalog
    ShoppingCart.tsx               Cart rows and subtotal
  App.tsx                           Theme and route composition
  index.css                         Tailwind layers and global styles
  main.tsx                          Application entry point/providers
index.html                          Browser document, title, favicon
tailwind.config.js                  Tailwind scan paths/theme
postcss.config.js                   Tailwind and Autoprefixer
vite.config.ts                      Vite configuration
```

Some older starter components may remain in `src/components/Ui`, or other
files may not currently be used by a route. The files listed above describe the
active Shop X flow.

## 6. How the app starts

The browser loads `index.html`, which contains the root `<div>` and points to
`src/main.tsx`. The entry point then renders the app:

1. `StrictMode` helps surface some development-time React mistakes.
2. `BrowserRouter` enables URL-based routes.
3. `CartProvider` makes cart state available throughout the app.
4. `CurrencyProvider` makes currency settings available throughout the app.
5. `App` renders the navigation, current page, and footer.

Providers are placed above the components that need their values. For example,
the product card can call `useCart()` even though it is nested inside the
listing page.

## 7. Routes and page navigation

Routes are declared in `src/App.tsx`:

| Path | Page | Purpose |
| --- | --- | --- |
| `/` | Redirect | Sends the visitor to `/shop`. |
| `/shop` | Product listing | Browse, search, and filter products. |
| `/products/:id` | Product details | Find a product by its ID. |
| `/cart` | Shopping cart | Edit quantities and inspect subtotal. |
| `/checkout` | Checkout | Validate delivery fields and confirm a mock order. |

`Link` and `NavLink` from React Router navigate without reloading the document.
The `:id` portion of `/products/:id` is a route parameter. ProductDetails reads
it with `useParams()` and finds the matching object in the local catalog.

## 8. Product data, listing, and reusable cards

### Product records

`src/data/products.json` is the source of catalog data. Each record has:

```json
{
  "id": "sample-product-01",
  "name": "Sample Product",
  "price": 49,
  "category": "Accessories",
  "image": "https://images.unsplash.com/...",
  "description": "A concise product description."
}
```

The price is a number in USD, not a string with a currency symbol. That lets
currency formatting happen in one shared place instead of baking symbols into
the data.

`ProductListing.tsx` imports the JSON, derives its category pills from the
actual products, and filters by the product's name and selected category.
Search and category are kept in URL query parameters, so a URL such as
`/shop?category=Apparel&search=shirt` can be reloaded or shared.

`ProductCard.tsx` is used once per visible product. It shows the image, category,
name, formatted price, and Add to Cart button. Product image state drives a
loading placeholder and a fallback message if an image cannot load. Clicking
the card's image or name opens the product detail route.

### Product details

`ProductDetails.tsx`:

1. Gets the `id` route parameter.
2. Finds that product in `products.json`.
3. Displays the full description and product metadata.
4. Keeps a local quantity in React state.
5. Calls `addToCart(product, quantity)` when the visitor adds it.

The quantity is local to this page because it is an in-progress selection, not
the shared cart quantity yet.

## 9. Cart state and LocalStorage

`src/context/CartContext.tsx` defines the product and cart item types and
provides:

- `cart`: array of products with a `quantity`.
- `addToCart(product, qty)`: adds a new product or increments an existing one.
- `updateQuantity(id, changeAmount)`: adds/subtracts a quantity; quantity zero
  removes the row.
- `removeFromCart(id)`: removes the row directly.
- `clearCart()`: empties the cart.
- `cartCount`: sum of all item quantities.
- `cartSubtotal`: sum of `price * quantity` for every item.

The state flow is:

```text
User clicks Add to Cart
  -> ProductCard/ProductDetails calls a context function
  -> CartContext updates cart state
  -> React rerenders consumers (navbar count, cart, checkout)
  -> an effect writes the latest cart to LocalStorage
```

On startup, the provider reads saved cart data and validates its basic shape
before using it. A browser `storage` event also updates the cart when another
tab changes it. Cart values are stored in the same USD base prices as the
catalog; the display currency does not modify cart data.

## 10. Currency and theme settings

### Currency

`CurrencyContext.tsx` stores the display currency (`USD` or `NGN`) and exposes
`formatPrice(usdPrice)`. Product cards, details, cart rows, summaries, and
checkout all use this formatter, so prices stay consistent when the visitor
switches currency.

The catalog's USD value is the source price. NGN is calculated using the fixed
reference rate defined in `CurrencyContext.tsx`, currently **₦1,346.24 per
USD (dated October 29, 2026)**. It is not a live rate or a claim about a
retailer's actual Nigerian price.

### Theme

`App.tsx` keeps the selected theme in React state, applies or removes the `dark`
class on the root HTML element, and stores the preference in LocalStorage.
Tailwind's `dark:` variants respond to that class. The navbar button toggles the
state; React then updates the page and the stored preference.

## 11. Cart and checkout pages

### Shopping cart

`ShoppingCart.tsx` reads cart state and actions from `useCart()`.

- If the cart is empty, it shows an empty state and a link back to products.
- Otherwise, it renders one row per item with quantity buttons and removal.
- The order summary uses the shared `cartSubtotal` and currency formatter.
- The checkout link navigates to `/checkout`.

### Checkout

`Checkout.tsx` keeps form values and field errors as component state. Submitting
the form runs `validateFields()`:

- Name and delivery address must not be blank.
- Email must match the front-end email pattern.
- Phone must contain 7 to 15 digits.

If validation fails, each field displays its own error and accessible invalid
state. If validation succeeds, checkout snapshots the order for the success
dialog, generates a mock tracking ID, and clears the shared cart. No payment or
network request is made.

## 12. Styling and responsive behavior

Tailwind utility classes are written in the JSX/TSX `className` values.
Examples:

- `sm:grid-cols-2` and `xl:grid-cols-4` adjust catalog columns by viewport.
- `backdrop-blur-md`, translucent backgrounds, borders, and shadows form the
  glass effect.
- `dark:` classes define the dark appearance.
- `fixed`, `z-*`, and responsive width utilities position the navbar and
  floating catalog controls.

`src/index.css` loads Tailwind and sets a small set of global styles. The
floating catalog controls use a portal to render at the document body level,
making them independent from some page stacking contexts. Their position is
clamped to the viewport and saved to LocalStorage; pointer events support
mouse, pen, and touch dragging.

## 13. A useful small live-change exercise

Adding a catalog product is a good demonstration because it touches the data
model but does not require a new page or component.

1. Open `src/data/products.json`.
2. Copy an existing product object.
3. Give it a unique `id`.
4. Set a name, numeric USD price, existing category, working image URL, and
   description.
5. Save the file.
6. Confirm Vite refreshes the page and the new card appears.
7. Search for the new name and click its category filter.
8. Open its details, add it to the cart, and confirm the cart count/subtotal.
9. Run `npm run build` and `npm run lint`.

For example, the new record should follow this shape (replace the sample image
with a verified image URL):

```json
{
  "id": "canvas-cap-02",
  "name": "Canvas Weekend Cap",
  "price": 36,
  "category": "Accessories",
  "image": "https://images.unsplash.com/...",
  "description": "A lightweight cap with an adjustable fit for everyday wear."
}
```

The ID must be unique because it is used as the React list key, product detail
route lookup, and cart identity.

## 14. How to explain the project in a live walkthrough

One possible concise introduction:

> “Shop X is a client-side React and TypeScript storefront. Vite builds and
> serves it, React Router handles the pages, and Tailwind handles responsive
> styling. The catalog is local JSON. Cart and currency are shared through
> context, with browser LocalStorage for persistence. Checkout is intentionally
> a validated mock flow; there is no backend or payment processing.”

Then trace one feature end to end:

1. Find a product in `products.json`.
2. Show how `ProductListing.tsx` filters and maps the records.
3. Open `ProductCard.tsx` and show how Add to Cart calls `useCart()`.
4. Show how `CartContext.tsx` changes the state and derives totals.
5. Show the same state consumed by the navbar and shopping cart.

When asked to make a change, state the expected behavior first, make the
smallest relevant edit, save, and verify in the browser. Run the build or lint
command if time allows.

## 15. Git submission checklist

From the project directory, confirm the expected files are present and inspect
what will be submitted:

```sh
git status
git add README.md BUILD_WALKTHROUGH.md index.html package.json package-lock.json public src tailwind.config.js postcss.config.js vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js
git diff --cached --stat
git commit -m "Document Shop X build walkthrough"
```

If the directory is not yet a Git repository, initialize it before using the
commands above:

```sh
git init
git branch -M main
```

Do not add generated `node_modules/` or `dist/` folders to the repository.
Check `.gitignore` before staging files. To publish to a remote repository, add
the repository URL and push the branch:

```sh
git remote add origin <repository-url>
git push -u origin main
```

## 16. Known assumptions and limitations

- Product records and images are sample storefront content, not a live
  inventory feed.
- Product and hero images are remote Unsplash URLs and require internet access.
- Currency conversion is static and illustrative; it does not fetch current
  rates.
- Browser LocalStorage is specific to the browser profile and device.
- Checkout only validates the form and demonstrates an order confirmation.
- No account, authentication, payment, stock management, or server-side order
  storage is implemented.


  git commands 
# 🛠️ Git Workflow History Log — Shop X

This log documents the sequential version control commands used to initialize, develop, structure, and deploy **Shop X** to GitHub for the SkillsForge Frontend Internship selection process.

---

## 🏗️ Phase 1: Repository Initialization & Base Commit

```bash
# Initialize a brand-new local Git repository
git init

# Stage all starting workspace configuration files and folders
git add .

# Save the primary architectural snapshot
git commit -m "initial commit: first set up structure"

# Rename the default branch to 'main' for production alignment
git branch -M main
```

---

## 🎨 Phase 2: Feature Implementation & Iterative Design

```bash
# Stage the core application layouts
git add .
git commit -m "designed structure"

# Add the multi-category dataset additions
git add .
git commit -m "dark theme and more data added"

# Implement the light/dark responsive theme switchers
git add .
git commit -m "creating theme toggle and beautifying"

# Refine global glassmorphism effects and clean layout boundaries
git add .
git commit -m "I've merged the themes and added esthetics"

# Expand the mock storage to include 60 high-fidelity catalog items
git add .
git commit -m "data added successfully"

# Introduce global context modules for automated USD/NGN price switching
git add .
git commit -m "added currency toggle and some items"
```

---

## 🚀 Phase 3: Remote Synchronization & Live GitHub Deployment

```bash
# Establish a remote upstream connection to the public GitHub repository
git remote add origin https://github.com

# Safely force-push the complete development history log to resolve empty placeholder README conflicts
git push origin main --force
```

---

## 💡 Quick Cheat-Sheet for Future Updates

Whenever you make any changes before the **October 31st deadline**, use this quick 3-step cycle to push updates to GitHub:

```bash
git add .
git commit -m "Brief description of changes made"
git push origin main
```
