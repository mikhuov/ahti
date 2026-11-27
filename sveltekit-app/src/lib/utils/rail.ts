export function stepRail(rail: HTMLElement | undefined, direction: 1 | -1) {
  if (!rail) return
  const first = rail.firstElementChild as HTMLElement | null
  const gap = parseFloat(getComputedStyle(rail).columnGap) || 0
  const step = first ? first.getBoundingClientRect().width + gap : rail.clientWidth * 0.8
  rail.scrollBy({left: direction * step, behavior: 'smooth'})
}

export function railEnds(rail: HTMLElement | undefined) {
  if (!rail) return {atStart: true, atEnd: false}
  return {
    atStart: rail.scrollLeft <= 2,
    atEnd: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2,
  }
}
