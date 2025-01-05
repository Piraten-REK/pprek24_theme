import type { FC, ComponentType } from 'react'
import { createHigherOrderComponent } from '@wordpress/compose'

const extendFeaturedImage = createHigherOrderComponent(
  (OriginalComponent: ComponentType): FC => {
    

    return (props) => (
      <>
        <OriginalComponent {...props} />
        <p>HELLO WORLD</p>
      </>
    )
  },
  'withFeaturedImageExtension'
)

wp.hooks.addFilter(
  'editor.PostFeaturedImage',
  'pprek24/extend-featured-image',
  extendFeaturedImage
)