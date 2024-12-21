<script lang="ts">
  import type Calendar from '../ts/calendar-types';
  import { dateFormatters, eventAffectsDate, leftPad } from '../ts/lib/utils'

  interface Props {
    year?: number
    month?: number
  }

  const now = new Date()

  const {
    year = now.getFullYear(),
    month =  now.getMonth() + 1
  } : Props = $props()

  const firstOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0)
  const firstVisible = new Date(firstOfMonth)
  firstVisible.setDate(-1 * ((firstVisible.getDay() + 6) % 7) + 1)

  const events: Calendar.Event[] = $state([])

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

  const days: Month = $derived.by(() => {
    // @ts-expect-error
    const res: Month = new Array(6)
      .fill(null)
      .map(() =>
        new Array(7)
          .fill(null)
      )
    const date = new Date(firstVisible)

    for (let w = 0; w < 6; w++) {
      for (let d = 0; d < 7; d++) {
        const events_ = events.filter(event => eventAffectsDate(event, date))
        res[w][d] = {
          dateString: `${date.getFullYear()}-${leftPad(date.getMonth() + 1)}-${leftPad(date.getDate())}`,
          day: date.getDate(),
          label: dateFormatters.longDateFormatter.format(date),
          events: events_,
          eventFul: events_.length > 0,
          type: events_.length > 0 ? 'eventful' : 'eventless',
          position: date.getMonth() + 1 === date.getMonth() ? 'in-month' : 'out-of-month'
        }
        date.setHours(24)
      }
    }

    return res
  })

</script>

<table>
  <caption>Unsere Termine im {dateFormatters.longMonthFormatter.format(firstOfMonth)}</caption>
  <thead>
    <tr>
      {#snippet th (day: 1 | 2 | 3 | 4 | 5 | 6 | 7)}
        {@const date = new Date(2024, 11, 1 + day, 0, 0, 0, 0)}
        <th
          title={dateFormatters.longWeekDayFormatter.format(date)}
        >{dateFormatters.shortWeekDayFormatter.format(date)}</th>
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
            aria-label={day.label}
            data-day={day.dateString}
            data-position={day.position}
            data-type={day.type}
          >{day.day}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
