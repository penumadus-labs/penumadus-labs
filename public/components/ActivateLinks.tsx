import { useEffect } from 'react'

interface Elm extends Element {
  innerText: string
}

export default function ActivateLinks() {
  useEffect(() => {
    const contentLinks = document.querySelectorAll(
      '.content-link'
    ) as NodeListOf<Elm>
    const contentAreas = document.querySelectorAll('.content-area')

    const setActiveLink = () => {
      let title: string | null
      let max = -Infinity
      contentAreas.forEach(elm => {
        const { top } = elm.getBoundingClientRect()

        if (top - 200 <= 0 && top > max) {
          max = top
          title = elm.getAttribute('id')
        }
      })

      contentLinks.forEach(({ innerText, classList }) => {
        if (innerText === title) classList.add('active')
        else classList.remove('active')
      })
    }

    setActiveLink()

    window.onscroll = setActiveLink
  })
  return null
}
