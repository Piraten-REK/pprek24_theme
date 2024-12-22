<script lang="ts">
  import type Calendar from '../ts/calendar-types';
  import {config, dateFormatters, eventAffectsDate, getRandomId, leftPad} from '../ts/lib/utils'
  import Loader from './Loader.svelte'
  import Icon from './Icon.svelte'

  interface Props {
    year?: number
    month?: number
    id?: string
  }

  const now = new Date()

  const {
    year: yearInit,
    month: monthInit,
    id = getRandomId(6, 'calendar-next-events_')
  } : Props = $props()

  let year = $state(yearInit ?? now.getFullYear())
  let month = $state(monthInit ?? now.getMonth() + 1)
  let wrapper: HTMLDivElement | undefined;
  let longTitles = $state(true)

  const prev = $state(() => {
      month--
      if (month === 0) {
          month = 12
          year--
      }

      const url = window.location.href.split('?')[0]
      const query = new URLSearchParams({
          year: year.toString(),
          month: month.toString()
      })

      window.history.pushState({ year, month }, '', `${url}?${query}`)
  })

  const next = $state(() => {
      month++
      if (month === 13) {
          month = 1
          year++
      }

      const url = window.location.href.split('?')[0]
      const query = new URLSearchParams({
          year: year.toString(),
          month: month.toString()
      })

      window.history.pushState({ year, month }, '', `${url}?${query}`)
  })

  let firstOfMonth = $derived(new Date(year, month - 1, 1, 0, 0, 0, 0))
  let firstVisible = $derived.by(() => {
      const d = new Date(firstOfMonth)
      d.setDate(-1 * ((d.getDay() + 6) % 7) + 1)
      return d
  })

  interface Day {
      dateString: string
      day: number
      label: string
      events: Calendar.Event[]
      eventFul: boolean
      type: 'eventful' | 'eventless'
      position: 'in-month' | 'out-of-month'
  }
  type Week = [Day, Day, Day, Day, Day, Day, Day]
  type Month = [Week, Week, Week, Week, Week, Week]

  let busy = $state(true)
  let req: Promise<Calendar.MonthResponse & { days: Month }> = $derived(
      fetch(` ${config.calendar_api_url}/${year}/${month}`, { cache: 'default' })
          .then(async res => {
              if ((res.status !== 200 && res.status !== 304) && res.headers.get('X-API-Version') !== '2') {
                  throw new Error(await res.json())
              }

              return await res.json() as Calendar.MonthResponse
          })
          .then(res => {
              const days: Month = new Array(6)
                  .fill(null)
                  .map(() =>
                    new Array(7)
                        .fill(null)
                  ) as any

              const date = new Date(firstVisible)

              for (let w = 0; w < 6; w++) {
                  for (let d = 0; d < 7; d++) {
                      const events = res.events.filter(event => eventAffectsDate(event, date))
                      days[w][d] = {
                          dateString: `${date.getFullYear()}-${leftPad(date.getMonth() + 1)}-${leftPad(date.getDate())}`,
                          day: date.getDate(),
                          label: dateFormatters.longDateFormatter.format(date),
                          events: events,
                          eventFul: events.length > 0,
                          type: events.length > 0 ? 'eventful' : 'eventless',
                          position: date.getMonth() + 1 === month ? 'in-month' : 'out-of-month'
                      }
                      date.setHours(24)
                  }
              }

              return Object.assign(res, { days })
          })
          .finally(() => busy = false)
  )

  $effect(() => {
      if (wrapper === undefined) {
          return
      }

      const headerCells = Array.from(wrapper.querySelectorAll('thead tr th')) as HTMLTableCellElement[]
      const padding = getComputedStyle(headerCells[0]).paddingInline.split(' ').reduce((acc, cur) => acc + parseInt(cur), 0)
      const maxWidth = headerCells[0].getBoundingClientRect().width - padding

      for (const cell of headerCells) {
          const longText = cell.querySelector('.pprek-calendar-weekday--long') as HTMLSpanElement
          if (maxWidth < longText.getBoundingClientRect().width) {
              longTitles = false
              return
          }
      }

      longTitles = true
  })
</script>

<div aria-live="off" aria-atomic="true" aria-busy={busy}>
  {#await req}
    <Loader />
  {:then { days }}
    <header class="pprek-calendar-month-title">
      <button class="pprek-calendar-month-prev" onclick={prev}><Icon icon="caretLeftFill" aria-hidden="true" /></button>
      <h2 id="{id}_title">Unsere Termine im {dateFormatters.longMonthFormatter.format(firstOfMonth)}</h2>
      <button class="pprek-calendar-month-next" onclick={next}><Icon icon="caretRightFill" aria-hidden="true" /></button>
    </header>
    <table class="pprek-calendar-month" id={id} role="grid" aria-labelledby="{id}_title" bind:this={wrapper}>
      <thead aria-hidden="true">
        <tr>
          {#snippet th (day: 1 | 2 | 3 | 4 | 5 | 6 | 7)}
            {@const date = new Date(2024, 11, 1 + day, 0, 0, 0, 0)}
            <th>
              <span class="pprek-calendar-weekday--long" class:sr-only={!longTitles}>{dateFormatters.longWeekDayFormatter.format(date)}</span>
              <span class="pprek-calendar-weekday--short" aria-hidden="true" style:display={longTitles ? 'none' : undefined}>{dateFormatters.shortWeekDayFormatter.format(date)}</span>
            </th>
          {/snippet}
          {@render th(1)}
          {@render th(2)}
          {@render th(3)}
          {@render th(4)}
          {@render th(5)}
          {@render th(6)}
          {@render th(7)}
        </tr>
      </thead>
      <tbody>
        {#each days as week}
          <tr>
            {#each week as day}
              <td
                role="gridcell"
                aria-disabled={day.position === 'out-of-month' ? true : undefined}
                aria-label={day.label}
                data-day={day.dateString}
                data-position={day.position}
                data-type={day.type}
              >
                {day.day}
                {#if day.eventFul}
                  <ul>
                    {#each day.events as event}
                      {@const query = new URLSearchParams({ id: event.id, start: event.start, title: event.title })}
                      <li>
                        <a href="{config.calendar_page}?{query.toString()}">
                          {#if !event.allDay && event.start.includes(day.dateString)}
                          <time datetime={event.start}>{dateFormatters.shortTimeFormatter.format(new Date(event.start))}</time>
                          {/if}
                          {event.title}
                        </a>
                      </li>
                    {/each}
                  </ul>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {:catch error}
    <div>Error</div>
    <pre>{error}</pre>
  {/await}
</div>

<style lang="scss">
  .pprek-calendar-month-title {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    h2 {
      grid-column: 2 / 7;
      text-align: center;
    }
  }
  .pprek-calendar-month-prev {
    grid-column: 1 / 2;
  }
  .pprek-calendar-month-next {
    grid-column: 7 / 8;
  }

  .pprek-calendar-month {
    inline-size: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 3rem repeat(6, 8.5rem);
    grid-auto-rows: auto;
    gap: .25rem;

    tbody, thead, tr {
      display: contents;
    }

    th, td {
      padding: .5rem;
      border-radius: .25rem;
    }

    th {
      background-color: var(--clr-accent-400);
      display: grid;
      place-items: center;
      color: var(--clr-header-bg);
    }

    td {
      background-color: var(--clr-txt-100);
      display: block;

      &[data-position="out-of-month"] {
        opacity: .66667;
      }

      ul {
        display: flex;
        flex-direction: column;
        gap: .25rem;
        overflow: auto;
        max-block-size: calc(100% - 1.5rem - .25rem - .25rem);
      }

      li {
        list-style: none;

        a {
          display: block;
          background: var(--clr-accent-400);
          color: var(--clr-header-bg);
          border-radius: .125rem;
          padding: .2em;
          text-decoration: none;

          &:has(> time) {
            display: grid;
            grid-template-columns: min-content auto;
            gap: .25em;
          }

          time {
            font-weight: 300;
          }
        }
      }
    }
  }
</style>
