import { config } from '../lib/utils';
import type Calendar from '../calendar-types';

export abstract class CalendarBase <Elem extends AnyElement> {
  element: Elem
  id: string

  protected constructor (element: Elem) {
    this.element = element
    this.id = CalendarBase.getRandomId(6, 'calendar-event-list_')
  }

  static twoDigitDayFormatter = new Intl.DateTimeFormat(undefined, { day: '2-digit' })
  static shortMonthFormatter = new Intl.DateTimeFormat(undefined, { month: 'short' })
  static shortTimeFormatter = new Intl.DateTimeFormat(undefined, { hour12: false, timeStyle: 'short' })
  static longDateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' })
  static longMonthFormatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
  static shortWeekDayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
  static longWeekDayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' })

  static randomCharPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' as const

  static getRandomId (length: number = 6, prefix: string = '', postfix: string = '', attempt = 0): string {
    if (attempt == 100) {
      throw new Error('Unable to create random id')
    }

    let str = prefix
    for (let i = 0; i < Math.max(1, Math.floor(length)); i++) {
      const char = CalendarBase.randomCharPool[Math.round(Math.random() * CalendarBase.randomCharPool.length)]
      str += char
    }
    str += postfix

    return (document.getElementById(str) != null)
        ? CalendarBase.getRandomId(length, prefix, postfix, ++attempt)
        : str
  }
}

export class CalendarEventList <Elem extends AnyElement> extends CalendarBase<Elem> {
  events: Calendar.Event[] = []

  constructor (element: Elem) {
    super(element)
    
    this.#fetchData().then(events => {
      this.events = events
      const feedElem = this.#eventsFeedFactory()
      const eventElems = this.events.map(this.#eventElementFactory.bind(this))
  
      feedElem.append(...eventElems)
      this.element.replaceWith(feedElem)
    }).catch(error => console.error(error))

  }

  async #fetchData (): Promise<Calendar.Event[]> {
    return await fetch(`${config.calendar_api_url}/next` , { cache: 'default' })
      .then(async res => {
        if ((res.status !== 200 && res.status !== 304) && res.headers.get('X-Api-Version') !== '2') {
          throw new Error(await res.json())
        }

        return await res.json() as Calendar.NextResponse
      })
      .then(res => res.events)
  }

  #eventsFeedFactory (): HTMLDivElement {
    const feed = document.createElement('div')
    feed.classList.add('pprek_calendar-event-list')
    feed.id = this.id
    return feed
  }

  #eventElementFactory (event: Calendar.Event, idx: number, { length }: Calendar.Event[]): HTMLElement {
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)

    const article = document.createElement('article')
    article.classList.add('pprek_calendar-event-list_item')
    article.setAttribute('aria-labelledby', `${this.id}_${idx}_title`)
    article.setAttribute('aria-describedby', `${this.id}_${idx}_date ${this.id}_${idx}_time`)
    article.setAttribute('aria-posinset', (idx + 1).toString())
    article.setAttribute('aria-setsize', length.toString())

    const title = document.createElement('div')
    title.classList.add('pprek_calendar-event-list_item_title')
    title.id = `${this.id}_${idx}_title`
    
    const titleLink = document.createElement('a')
    const query = new URLSearchParams({
      start: event.start,
      id: event.id,
      title: event.title
    })
    titleLink.href = `/calendar?${query.toString()}`
    titleLink.textContent = event.title
    title.append(titleLink)

    const date = document.createElement('time')
    date.classList.add('pprek_calendar-event-list_item_date')
    date.id = `${this.id}_${idx}_date`
    date.dateTime = event.start.split('T')[0]

    const dateDay = document.createElement('span')
    dateDay.textContent = CalendarBase.twoDigitDayFormatter.format(startDate)
    const dateMonth = document.createElement('span')
    dateMonth.textContent = CalendarBase.shortMonthFormatter.format(startDate)

    date.append(dateDay, dateMonth)

    const time = document.createElement('span')
    time.classList.add('pprek_calendar-event-list_item_time')
    time.id = `${this.id}_${idx}_time`

    if (event.allDay && event.start.split('T')[0] === event.end.split('T')[0]) {
      // one day, all day
      time.textContent = 'ganztägig'
    } else if (event.allDay) {
      // >1 days, all day
      const timeText = document.createTextNode('ganztägig bis ')
      const timeEnd = document.createElement('time')
      timeEnd.dateTime = event.end
      timeEnd.textContent = CalendarBase.longDateFormatter.format(endDate)
      time.append(timeText, timeEnd)
    } else {
      const timeStart = document.createElement('time')
      timeStart.dateTime = event.start
      timeStart.textContent = `${CalendarBase.shortTimeFormatter.format(startDate)} Uhr`
      const timeText = document.createTextNode(' bis ')
      const timeEnd = document.createElement('time')
      timeEnd.dateTime = event.end
      timeEnd.textContent = `${event.start.split('T')[0] !== event.end.split('T')[0] ? CalendarBase.longDateFormatter.format(endDate) + ' ' : ''}${CalendarBase.shortTimeFormatter.format(endDate)} Uhr`
      time.append(timeStart, timeText, timeEnd)
    }

    article.append(title, date, time)

    return article
  }
}

export class CalendarMonth <Elem extends AnyElement> extends CalendarBase <Elem> {
  year: number
  month: number
  firstOfMonth: Date
  firstVisible: Date
  events: Calendar.Event[] = []

  constructor (element: Elem) {
    super(element)
    this.year = parseInt(element.dataset.pprekYear ?? '')
    this.month = parseInt(element.dataset.pprekMonth ?? '')

    this.firstOfMonth = new Date(this.year, this.month - 1, 1, 0, 0, 0, 0)
    this.firstVisible = new Date(this.firstOfMonth)
    this.firstVisible.setDate(-1 * ((this.firstVisible.getDay() + 6) % 7) + 1)

    console.log(this.firstVisible)

    this.element.replaceWith(this.#tableFactory())
  }

  #tableFactory (): HTMLTableElement {
    const table = document.createElement('table')
    const caption = document.createElement('caption')
    caption.textContent = `Unsere Termine im ${CalendarBase.longMonthFormatter.format(this.firstOfMonth)}`

    const head = document.createElement('thead')
    const hTr = document.createElement('tr')
    const monDate = new Date(2024,11,2, 0, 0, 0, 0)
    for (let d = 3; d < 10; d++) {
      const th = document.createElement('th')
      th.title = CalendarBase.longWeekDayFormatter.format(monDate)
      th.textContent = CalendarBase.shortWeekDayFormatter.format(monDate)
      hTr.append(th)
      monDate.setDate(d)
    }
    head.append(hTr)

    const date = new Date(this.firstVisible)
    const body = document.createElement('tbody')
    for (let w = 0; w < 6; w++) {
      const bTr = document.createElement('tr')
      for (let d = 0; d < 7; d++) {
        const events = this.events.filter(event => CalendarMonth.eventAffectsDate(event, date))
        const td = document.createElement('td')
        td.ariaLabel = CalendarBase.longDateFormatter.format(date)
        td.dataset.day = date.getDate().toString()
        td.dataset.place = date.getMonth() + 1 === this.month ? 'in' : 'out'
        td.dataset.type = events.length > 0 ? 'eventful' : 'eventless'
        bTr.append(td)
        date.setHours(24)
      }
      body.append(bTr)
    }

    table.append(caption, head, body)

    return table
  }

  static eventAffectsDate (event: Calendar.Event, date: Date): boolean {
    const start = new Date(event.start)
    const end = new Date(event.end)
    const startInt = start.getFullYear() * 10000 + (start.getMonth() + 1) * 100 + start.getDate()
    const endInt = end.getFullYear() * 10000 + (end.getMonth() + 1) * 100 + end.getDate()
    const int = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()

    return startInt <= int && endInt >= int
  }
}
