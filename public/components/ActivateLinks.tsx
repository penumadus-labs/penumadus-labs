import { useEffect, FC, ReactNode } from 'react'

interface Elm extends Element {
  innerText: string
}

export default function ActivateLinks() {
  useEffect(() => {
    const contentLinks = document.querySelectorAll(
      '.qs-link'
    ) as NodeListOf<Elm>
    const contentAreas = document.querySelectorAll('.content-area')

    const setActiveLink = () => {
      let title: string | null = 'Home'
      let max = -Infinity
      contentAreas.forEach(elm => {
        const { top } = elm.getBoundingClientRect()

        if (top - 200 <= 0 && top > max) {
          max = top
          title = elm.getAttribute('id')
        }
      })

      contentLinks.forEach(({ innerText, classList }) => {
        if (innerText.toUpperCase() === title?.toUpperCase())
          classList.add('active')
        else classList.remove('active')
      })
    }

    setActiveLink()

    let timeout: NodeJS.Timeout | null

    const throttleInterval = 100

    window.onscroll = () => {
      if (!timeout)
        timeout = setTimeout(() => {
          setActiveLink()
          timeout = null
        }, throttleInterval)
    }
  })
  return null
}
