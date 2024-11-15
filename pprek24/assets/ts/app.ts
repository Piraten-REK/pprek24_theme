import SiteNav from './inc/SiteNav'

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
