export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white/50 px-4 py-8 backdrop-blur-md dark:border-white/10 dark:bg-black/20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
          <img
            src="/shopx-logo.svg"
            alt=""
            className="size-8 rounded-lg"
            width="32"
            height="32"
          />
          <span>
            Shop <span className="text-orange-600">X</span>
          </span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Built by Marvelus Pro <span aria-hidden="true">·</span> Copyright 2026
        </p>
      </div>
    </footer>
  )
}
