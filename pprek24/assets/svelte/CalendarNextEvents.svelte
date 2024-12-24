<script lang="ts">
  import Loader from './Loader.svelte'
  import type Calendar from '../ts/calendar-types';
  import { config, dateFormatters, getRandomId } from '../ts/lib/utils'

  interface Props {
    id?: string
  }

  const { id = getRandomId(6, 'calendar-next-events_') }: Props = $props()
  let busy = $state(true)
  let events: Promise<Calendar.Event[]> = $state(
    fetch(` ${config.calendar_api_url}/next`, { cache: 'default' })
      .then(async res => {
        if ((res.status !== 200 && res.status !== 304) && res.headers.get('X-API-Version') !== '2') {
          throw new Error(await res.json())
        }

        return await res.json() as Calendar.NextResponse
      })
      .then(res => res.events)
      .finally(() => busy = false)
    )
</script>

<div aria-live="off" aria-atomic="true" aria-busy={busy}>
  {#await events}
    <Loader />
  {:then events} 
    <ul class='event-list' id={id}>
      {#each events as event, index}
        {@const query = new URLSearchParams({ start: event.start, id: event.id, title: event.title })}
        {@const startDate = new Date(event.start)}
        {@const endDate = new Date(event.end)}
        <li
          class="event"
          aria-labelledby="{id}_${index}_title"
          aria-describedby="{id}_{index}_date {id}_{index}_time"
          aria-posinset={index + 1}
          aria-setsize={events.length}
        >
          <div class="event-title" id="{id}_{index}_title">
            <a href="{config.calendar_page}?{query.toString()}">{event.title}</a>
          </div>
          <time
            class="event-date"
            id="{id}_{index}_date"
            datetime={event.start.split('T')[0]}
          >
            <span>{dateFormatters.twoDigitDayFormatter.format(startDate)}</span>
            <span>{dateFormatters.shortMonthFormatter.format(startDate)}</span>
          </time>
          <span class="event-time" id="{id}_{index}_time">
            {#if event.allDay && event.start.split('T')[0] === event.end.split('T')[0]}
              <!-- one day, all day -->
              ganztägig
            {:else if event.allDay}
              <!-- all day -->
              ganztägig bis <time datetime={event.end}>{dateFormatters.longDateFormatter.format(endDate)}</time>
            {:else}
              <time datetime={event.start}>{dateFormatters.shortTimeFormatter.format(startDate)} Uhr</time> bis
              <time datetime={event.end}>
                {#if event.start.split('T')[0] !== event.end.split('T')[0]}
                  {dateFormatters.longDateFormatter.format(endDate)}{' '}
                {/if}
                {dateFormatters.shortTimeFormatter.format(endDate)} Uhr
              </time>
            {/if}
          </span>
        </li>
      {/each}
    </ul>
  {:catch error}
    <div>Error</div>
    <pre>{error}</pre>
  {/await}
</div>

<style lang="scss">
  .event-list {
    display: grid;
    grid-template-columns: auto;
    grid-auto-rows: auto;
    gap: 1.5rem;
  }

  .event {
    --_block-size: 3.5rem;
    background-color: var(--clr-header-bg);
    filter: drop-shadow(0 .25rem 1rem hsl(0 0% 0% / 20%));
    display: grid;
    block-size: var(--_block-size);
    grid-template:
      "date title" 1.875rem
      "date time" 1.625rem
      / var(--_block-size) auto;
    position: relative;
    isolation: isolate;
    border-radius: .25rem;
    overflow: hidden;
    list-style-type: none;
  }

  .event-date {
    grid-area: date;
    background-color: var(--clr-accent-400);
    color: var(--clr-header-bg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-weight: 600;
    line-height: 1;
    gap: .25rem;

    span:nth-child(1) {
      font-size: 1.25rem;
    }
  }

  .event-title {
    grid-area: title;
    padding-inline: .75rem;
    align-self: end;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    a {
      color: inherit;
      text-decoration: none;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: transparent;
        z-index: 0;
      }
    }
  }

  .event-time {
    grid-area: time;
    padding-inline: .75rem;
    align-self: start;
    font-size: .75rem;
    line-height: 1.66667;
    vertical-align: top;
  }
</style>
