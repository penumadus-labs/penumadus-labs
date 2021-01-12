import { useEffect } from 'react'

export default function ActivateLinks() {
  useEffect(() => {
    const contentLinks = document.querySelectorAll('.content-link')
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

      contentLinks.forEach(elm => {
        if (elm.innerText === title) elm.classList.add('active')
        else elm.classList.remove('active')
      })
    }

    setActiveLink()

    window.onscroll = setActiveLink
  })
  return null
}
