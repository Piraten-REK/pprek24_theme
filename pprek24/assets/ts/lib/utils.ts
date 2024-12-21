export function use <T, R> (it: T, callback: (it: T) => R): R {
  return callback(it)
}

type UseIfExistsReturn<T, R, D> = T extends null | undefined ? D : R
export function useIfExists <T, R, D = R> (it: T, callback: (it: NonNullable<T>) => R, defaultValue: D = null as D): UseIfExistsReturn<T, R, D> {
  if (it == null) {
    return defaultValue as UseIfExistsReturn<T, R, D>
  }

  return callback(it) as UseIfExistsReturn<T, R, D>
}

type UseIfReturn<P extends boolean, R, D> = P extends true ? R : D
export function useIf <T, R, P extends boolean, D = null> (it: T, predicate: (it: T) => P, callback: (it: T) => R, defaultValue: D = null as D): UseIfReturn<P, R, D> {
  if (predicate(it)) {
    return callback(it) as UseIfReturn<P, R, D>
  }

  return defaultValue as UseIfReturn<P, R, D>
}

interface JsConfig {
  calendar_api_url: string
}
export const config = useIfExists<HTMLScriptElement | null, Partial<JsConfig>>(document.querySelector('#pprek_js_conf'), it => JSON.parse(it.textContent ?? '{}'), {})

export const dateFormatters = {
  twoDigitDayFormatter: new Intl.DateTimeFormat(undefined, { day: '2-digit' }),
  shortMonthFormatter: new Intl.DateTimeFormat(undefined, { month: 'short' }),
  shortTimeFormatter: new Intl.DateTimeFormat(undefined, { hour12: false, timeStyle: 'short' }),
  longDateFormatter: new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }),
  longMonthFormatter: new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }),
  shortWeekDayFormatter: new Intl.DateTimeFormat(undefined, { weekday: 'short' }),
  longWeekDayFormatter: new Intl.DateTimeFormat(undefined, { weekday: 'long' })
}

export const randomCharPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' as const

export function getRandomId (length: number = 6, prefix: string = '', postfix: string = '', attempt = 0): string {
  if (attempt == 100) {
    throw new Error('Unable to create random id')
  }

  let str = prefix
  for (let i = 0; i < Math.max(1, Math.floor(length)); i++) {
    const char = randomCharPool[Math.round(Math.random() * randomCharPool.length)]
    str += char
  }
  str += postfix

  return (document.getElementById(str) != null)
      ? getRandomId(length, prefix, postfix, ++attempt)
      : str
}