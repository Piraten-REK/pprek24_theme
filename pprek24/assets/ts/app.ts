import SiteNav from './inc/SiteNav'
import { config, useIf } from "./lib/utils"

import { mount } from 'svelte'
import CalendarNextEvents from '../svelte/CalendarNextEvents.svelte'
import CalendarMonth from '../svelte/CalendarMonth.svelte'

new SiteNav()

const defaultImgs = document.querySelectorAll('.card .card-img.default-img') as NodeListOf<HTMLDivElement>

defaultImgs.forEach(element => {
  const factor = Math.round(Math.random() * 360)
  element.style.backgroundImage = [
    `radial-gradient(at 78% 29%, hsl(${(77 + factor) % 360} 71% 43%) 0px, transparent 50%)`,
    `radial-gradient(at 18% 25%, hsl(${(126 + factor) % 360} 68% 37%) 0px, transparent 50%)`,
    `radial-gradient(at 55% 54%, hsl(${(227 + factor) % 360} 31% 49%) 0px, transparent 50%)`,
    `radial-gradient(at 28% 74%, hsl(${(189 + factor) % 360} 58% 55%) 0px, transparent 50%)`
  ].join()
})

// ----

if (config.calendar_api_url != null && config.calendar_api_url.trim().length >= 0) {
  const calendarElements: NodeListOf<AnyElement> = document.querySelectorAll('[data-pprek-calendar]')

  calendarElements.forEach(element => {
    switch (element.dataset.pprekCalendar) {
      case 'next':
        mount(CalendarNextEvents, { target: element })
        break
      case 'month':
        mount(CalendarMonth, {
          target: element,
          props: {
            // @ts-expect-error
            year: useIf(element.dataset.pprekYear, it => it != null && it.trim() !== '', parseInt, undefined),
            // @ts-expect-error
            month: useIf(element.dataset.pprekMonth, it => it != null && it.trim() !== '', parseInt, undefined)
          }
        })
        break
    }
  })
}

// ----

const btt = document.querySelector('.back-to-top') as HTMLAnchorElement

function showBackToTopButton (): void {
  const isShown = !btt.classList.contains('hidden')
  const scrolled = window.scrollY
  const windowHeight = window.innerHeight
  const minScrolledToShow = Math.max(400, windowHeight * 0.4)

  console.log({isShown, scrolled, windowHeight, minScrolledToShow})
  
  if (scrolled >= minScrolledToShow && !isShown) {
    btt.classList.remove('hidden')
  } else if (scrolled < minScrolledToShow && isShown) {
    btt.classList.add('hidden')
  }
}

window.addEventListener('scroll', showBackToTopButton)
window.addEventListener('resize', showBackToTopButton)
showBackToTopButton()
