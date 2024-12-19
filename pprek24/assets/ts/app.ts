import SiteNav from './inc/SiteNav'
import { config } from "./lib/utils";

const siteNav = new SiteNav() // eslint-disable-line @typescript-eslint/no-unused-vars

const defaultImgs = document.querySelectorAll('.card .card-img.default-img') as NodeListOf<HTMLDivElement>

defaultImgs.forEach(element => {
    const factor = Math.round(Math.random() * 360)
    element.style.backgroundImage = [
        `radial-gradient(at 78% 29%, hsl(${(77 + factor) % 360} 71% 43%) 0px, transparent 50%)`,
        `radial-gradient(at 18% 25%, hsl(${(126 + factor) %  360} 68% 37%) 0px, transparent 50%)`,
        `radial-gradient(at 55% 54%, hsl(${(227 + factor) %  360} 31% 49%) 0px, transparent 50%)`,
        `radial-gradient(at 28% 74%, hsl(${(189 + factor) %  360} 58% 55%) 0px, transparent 50%)`
    ].join()
})

// ----


if (config.calendar_api_url != null && config.calendar_api_url.trim().length >= 0) {
    const calendarElements: NodeListOf<AnyElement> = document.querySelectorAll('[data-pprek-calendar]')

    calendarElements.forEach(element => {
        if (element.dataset.pprekCalendar === 'next') {
            fetch(`${config.calendar_api_url}/next`)
                .then(r => r.json())
                .then(r => console.log(r))
        }
    })
}
