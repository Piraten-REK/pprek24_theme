type Uuid = string

namespace Calendar {
  export interface Event {
    id: Uuid
    title: string
    description: string | null
    location: string | null
    start: string
    end: string
    allDay: boolean
  }

  export interface NextResponse {
    date: string
    events: Event[]
    max: number
  }
}

export default Calendar
