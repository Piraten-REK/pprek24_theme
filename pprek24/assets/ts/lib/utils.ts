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
