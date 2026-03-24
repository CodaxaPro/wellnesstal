/**
 * Tailwind JIT only emits class names that appear as complete strings in source.
 * Dynamic `grid-cols-${n}` is stripped in production — use these maps instead.
 */

const MD_COLS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
}

const LG_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
}

function clampInt(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)))
}

/** Features / generic: mobile (1–2), tablet & desktop (1–6). */
export function gridColsThreeBreakpoints(mobile: number, tablet: number, desktop: number): string {
  const m = clampInt(mobile, 1, 2) >= 2 ? 'grid-cols-2' : 'grid-cols-1'
  const t = MD_COLS[clampInt(tablet, 1, 6)]
  const d = LG_COLS[clampInt(desktop, 1, 6)]
  return `${m} ${t} ${d}`
}

/** FAQ / card grids: single column on mobile. */
export function gridColsFaqTabletDesktop(tablet: number, desktop: number): string {
  const t = MD_COLS[clampInt(tablet, 1, 3)]
  const d = LG_COLS[clampInt(desktop, 1, 4)]
  return `grid-cols-1 ${t} ${d}`
}

/** Stats row: 2 cols on small screens, up to 4 on md+. */
export function gridColsStatsItemCount(count: number): string {
  const c = clampInt(count, 1, 4)
  return `grid-cols-2 ${MD_COLS[c]}`
}
