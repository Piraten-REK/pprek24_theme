import type * as Data from '@wordpress/data'
import type DomReady from '@wordpress/dom-ready'
import type { Hooks } from '@wordpress/hooks'

declare global {
  const wp: {
    data: typeof Data
    domReady: typeof DomReady
    hooks: Hooks
  } & Record<string, unknown>
}
