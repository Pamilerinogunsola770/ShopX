import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowDown, ArrowUp, GripVertical, Search, X } from 'lucide-react'

interface FloatingCatalogControlsProps {
  search: string
  onSearchChange: (value: string) => void
}

type DockSide = 'left' | 'right'

interface DockPosition {
  side: DockSide
  top: number
}

interface DragState {
  pointerId: number
  offsetX: number
  offsetY: number
  width: number
}

const POSITION_STORAGE_KEY = 'shop-x-catalog-dock'
const EDGE_GAP = 8

function clampTop(top: number, height: number) {
  return Math.min(
    Math.max(EDGE_GAP, top),
    Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP),
  )
}

function readSavedPosition(): DockPosition {
  try {
    const saved = window.localStorage.getItem(POSITION_STORAGE_KEY)
    if (saved) {
      const parsed: unknown = JSON.parse(saved)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'side' in parsed &&
        (parsed.side === 'left' || parsed.side === 'right') &&
        'top' in parsed &&
        typeof parsed.top === 'number' &&
        Number.isFinite(parsed.top)
      ) {
        return {
          side: parsed.side,
          top: clampTop(parsed.top, 64),
        }
      }
    }
  } catch (error) {
    console.error('Unable to read the catalog controls position.', error)
  }

  return {
    side: 'right',
    top: Math.max(EDGE_GAP, window.innerHeight - 190),
  }
}

export default function FloatingCatalogControls({
  search,
  onSearchChange,
}: FloatingCatalogControlsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [position, setPosition] = useState<DockPosition>(readSavedPosition)
  const [dragLeft, setDragLeft] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dockRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)

  useEffect(() => {
    function updateVisibility() {
      setIsVisible(window.scrollY > 180)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  useEffect(() => {
    function keepDockInBounds() {
      const height = dockRef.current?.getBoundingClientRect().height ?? 64
      setPosition((current) => ({
        ...current,
        top: clampTop(current.top, height),
      }))
    }

    window.addEventListener('resize', keepDockInBounds)
    return () => window.removeEventListener('resize', keepDockInBounds)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    const rect = dockRef.current?.getBoundingClientRect()
    if (!rect) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
    }
    setPosition((current) => ({ ...current, top: rect.top }))
    setDragLeft(rect.left)
    setIsDragging(true)
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const height = dockRef.current?.getBoundingClientRect().height ?? 64
    const left = Math.min(
      Math.max(EDGE_GAP, event.clientX - drag.offsetX),
      Math.max(EDGE_GAP, window.innerWidth - drag.width - EDGE_GAP),
    )
    setDragLeft(left)
    setPosition((current) => ({
      ...current,
      top: clampTop(event.clientY - drag.offsetY, height),
    }))
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const left = Math.min(
      Math.max(EDGE_GAP, event.clientX - drag.offsetX),
      Math.max(EDGE_GAP, window.innerWidth - drag.width - EDGE_GAP),
    )
    const side: DockSide =
      left + drag.width / 2 < window.innerWidth / 2 ? 'left' : 'right'
    const top = clampTop(
      position.top,
      dockRef.current?.getBoundingClientRect().height ?? 64,
    )
    const nextPosition = { side, top }

    dragRef.current = null
    setPosition(nextPosition)
    setDragLeft(null)
    setIsDragging(false)

    try {
      window.localStorage.setItem(
        POSITION_STORAGE_KEY,
        JSON.stringify(nextPosition),
      )
    } catch (error) {
      console.error('Unable to save the catalog controls position.', error)
    }
  }

  if (!isVisible) return null

  const dockStyle =
    dragLeft !== null
      ? { left: `${dragLeft}px`, right: 'auto', top: `${position.top}px` }
      : position.side === 'left'
        ? { left: `${EDGE_GAP}px`, right: 'auto', top: `${position.top}px` }
        : { right: `${EDGE_GAP}px`, left: 'auto', top: `${position.top}px` }

  return (
    <div
      ref={dockRef}
      style={dockStyle}
      className={`fixed z-40 flex flex-col gap-2 ${
        position.side === 'left' && dragLeft === null
          ? 'items-start'
          : 'items-end'
      } ${isDragging ? 'cursor-grabbing select-none' : ''}`}
    >
      {searchOpen && (
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className={`mb-1 flex w-[min(22rem,calc(100vw-1rem))] items-center gap-1.5 rounded-2xl border border-white/50 bg-white/95 p-2 text-neutral-700 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/95 dark:text-white ${
            position.side === 'left' && dragLeft === null
              ? 'self-start'
              : 'self-end'
          }`}
        >
          <Search
            size={18}
            className="ml-1 shrink-0 text-orange-600"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Quick search products"
            aria-label="Quick search products"
            className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base outline-none placeholder:text-neutral-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close quick search"
            className="grid size-10 shrink-0 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-orange-600 dark:hover:bg-white/10"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </form>
      )}
      <div
        className={`flex items-center gap-1 rounded-full border border-white/50 bg-white/90 p-1.5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/90 sm:gap-1.5 ${
          isDragging ? 'shadow-xl ring-2 ring-orange-400/40' : ''
        }`}
      >
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          aria-label="Drag controls to either screen edge"
          title="Drag to either screen edge"
          className="grid size-10 shrink-0 touch-none cursor-grab place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-orange-600 active:cursor-grabbing dark:hover:bg-white/10"
        >
          <GripVertical size={18} aria-hidden="true" />
        </button>
        <span className="h-7 w-px bg-neutral-200 dark:bg-white/10" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setSearchOpen((open) => !open)}
          aria-label={searchOpen ? 'Close quick search' : 'Open quick search'}
          aria-expanded={searchOpen}
          className={`grid size-11 shrink-0 place-items-center rounded-full transition sm:size-10 ${
            searchOpen
              ? 'bg-orange-500 text-white'
              : 'text-neutral-700 hover:bg-orange-50 hover:text-orange-600 dark:text-neutral-200 dark:hover:bg-white/10'
          }`}
        >
          <Search size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollTo('collection')}
          aria-label="Go to the beginning of the products"
          title="Beginning of products"
          className="grid size-11 shrink-0 place-items-center rounded-full text-neutral-700 transition hover:bg-orange-50 hover:text-orange-600 dark:text-neutral-200 dark:hover:bg-white/10 sm:size-10"
        >
          <ArrowUp size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollTo('catalog-end')}
          aria-label="Go to the end of the products"
          title="End of products"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20 transition hover:from-orange-600 hover:to-red-600 sm:size-10"
        >
          <ArrowDown size={19} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
