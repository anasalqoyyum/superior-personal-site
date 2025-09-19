const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const imgs = Array.from(document.querySelectorAll('.comp-img'))
for (const img of imgs) {
  const light = img.nextElementSibling
  const card = img.closest('figure')
  if (!(light instanceof HTMLElement) || !(card instanceof HTMLElement)) continue

  const reset = () => {
    light.style.opacity = '0'
    if (!prefersReduced) {
      // @ts-expect-error
      img.style.transform = ''
      card.style.transform = ''
    }
  }

  img.addEventListener('pointerenter', () => {
    light.style.opacity = '1'
  })
  img.addEventListener('pointerleave', reset)
  img.addEventListener('pointermove', e => {
    const rect = img.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // @ts-expect-error
    const dx = (e.clientX - cx) / rect.width
    // @ts-expect-error
    const dy = (e.clientY - cy) / rect.height

    // light position
    // @ts-expect-error
    const x = ((e.clientX - rect.left) / rect.width) * 100
    // @ts-expect-error
    const y = ((e.clientY - rect.top) / rect.height) * 100
    light.style.setProperty('--mx', `${x}%`)
    light.style.setProperty('--my', `${y}%`)

    if (!prefersReduced) {
      const maxTilt = 8 // degrees
      const rx = (-dy * maxTilt).toFixed(2)
      const ry = (dx * maxTilt).toFixed(2)
      // tilt card for depth, keep image slightly more pronounced
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`
      // @ts-expect-error
      img.style.transform = `translateZ(0)`
    }
  })
}
