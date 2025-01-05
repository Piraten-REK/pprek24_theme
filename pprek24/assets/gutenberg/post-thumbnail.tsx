import type { FC, ComponentType, MouseEvent as ReactMouseEvent } from 'react'
import { createHigherOrderComponent } from '@wordpress/compose'
import {
  Button,
  Modal,
  __experimentalHStack as HStack
} from '@wordpress/components'
import { useState, useId, useRef, useEffect } from '@wordpress/element'
import { useSelect, useDispatch } from '@wordpress/data'
import { store as editorStore } from '@wordpress/editor'
import { __ } from '@wordpress/i18n'

interface FeaturuedImageProps {
  currentPostId: number
	featuredImageId: number
	onUpdateImage: () => void
	onRemoveImage: () => void
	media: {
    _links: {
      [key: string]: Array<{
        href: string
        embeddable?: boolean
        targetHints?: { allow: string[] }
      }>
    }
    alt_text: string
    author: number
    caption: { rendered: string }
    class_list: string[]
    comment_status: 'open' | 'closed'
    date: string
    date_gmt: string
    description: { rendered: string }
    featured_media: number
    guid: { rendered: string }
    id: number
    link: string
    media_details: {
      file: string
      filesize: number
      height: number
      image_meta: Record<string, string>
      sizes: {
        [size in 'full' | 'large' | 'medium' | 'medium_large' | 'thumbnail']: {
          file: string
          filesize: number
          height: number
          mime_type: string
          source_url: string
          width: number
        }
      }
      width: number
    }
    media_type: 'image'
    mime_type: string
    modified: string
    modified_gmt: string
    ping_status: 'open' | 'closed'
    post: number
    slug: string
    source_url: string
    status: string
    template: string
    title: { rendered: string }
    type: 'attachment'
  } | null
	postType: {
    _links: {
      [key: string]: Array<{
        href: string
        embeddable?: boolean
        targetHints?: { allow: string[] }
      }>
    }
    capabilities: {
      [Key in string]: Key
    }
    description: string
    has_archive: boolean
    hierachical: boolean
    icon: string
    labels: Record<string, string>
    name: string
    rest_base: string
    rest_namespace: string
    slug: string
    supports: Record<string, boolean>
    taxonomies: string[]
    template: unknown[]
    template_lock: boolean
    viewable: boolean
    visibility: Record<string, boolean>
  }
	noticeUI: boolean
	noticeOperations: unknown
	isRequestingFeaturedImageMedia: unknown
}

const extendFeaturedImage = createHigherOrderComponent(
  (OriginalComponent: ComponentType): FC<FeaturuedImageProps> =>
    (props) => {
      const [open, setOpen] = useState(false)
      const id = useId()
      const imgRef = useRef<HTMLImageElement>(null)
      const thumbRef = useRef<HTMLDivElement>(null)
      const [thumbSize, setThumbSize] = useState(0)
      const isDragging = useRef(false)

      useEffect(
        () => {
          if (!open || thumbRef.current == null) {
            return
          }
          const thumbStyles = getComputedStyle(thumbRef.current)

          setThumbSize(parseFloat(thumbStyles.blockSize))
        },
        [open]
      )
      
      const focusPoint: [number, number] | null = useSelect(select =>
        props.featuredImageId !== 0
          ? select(editorStore).getEditedPostAttribute('meta')?.pprek24_featured_image_focus_point ?? [50, 50]
          : null,
        [props.featuredImageId]
      )

      const { editPost } = useDispatch(editorStore)

      const updateFocusPoint = (newPoint: [number, number]): void => {
        editPost({
          meta: {
            pprek24_featured_image_focus_point: newPoint
          }
        })
      }

      const [currentCoords, setCurrentCoords] = useState<[number, number]>(focusPoint ?? [50, 50])

      const onSave = (): void => {
        updateFocusPoint(currentCoords)
        setOpen(false)
      }

      const onReset = (): void => {
        updateFocusPoint([50, 50])
        setOpen(false)
      }

      const calculatePosition = (event: MouseEvent): [number, number] => {
        if (imgRef.current == null) return currentCoords

        const rect = imgRef.current.getBoundingClientRect()

        const x = Math.min(Math.max(((event.clientX - rect.left) / rect.width) * 100, 0), 100)
        const y = Math.min(Math.max(((event.clientY - rect.top) / rect.height) * 100, 0), 100)

        return [Math.round(x * 10) / 10, Math.round(y * 10) / 10]
      }

      const onMouseDown = (event: ReactMouseEvent): void => {
        isDragging.current = true
        setCurrentCoords(calculatePosition(event.nativeEvent))
      }

      const onMouseMove = (event: MouseEvent): void => {
        if (!isDragging.current) return
        setCurrentCoords(calculatePosition(event))
      }

      const onMouseUp = (): void => {
        isDragging.current = false
      }

      useEffect(
        () => {
          if (!open) return

          document.addEventListener('mousemove', onMouseMove)
          document.addEventListener('mouseup', onMouseUp)

          return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
          }
        },
        [open]
      )

      const onImageClick = (event: ReactMouseEvent): void => {
        setCurrentCoords(calculatePosition(event.nativeEvent))
      }
      
      return (
        <>
          <OriginalComponent {...props as any} />
          <HStack className='editor-post-panel__row'>
            <div className="editor-post-panel__row-label">{__('Fokuspunkt', 'pprek24')}</div>
            <div className="editor-post-panel__row-control">
              <Button
                variant='tertiary'
                disabled={focusPoint == null}
                onClick={() => setOpen(true)}>
                  {focusPoint?.join(' / ') ?? '–'}
                </Button>
            </div>
          </HStack>
          {
            open ? (
              <Modal
                title={__('Fokuspunkt setzen', 'pprek24')}
                onRequestClose={() => setOpen(false)}
                className='pprek24-feature-image-focus-modal'
              >
                <div role='presentation' className='pprek24-feature-image-focus-img'>
                  <img ref={imgRef} src={props.media?.media_details.sizes.large.source_url} onClick={onImageClick} />
                  <div
                    ref={thumbRef}
                    className='pprek24-feature-image-focus-thumb' aria-labelledby={id}
                    style={{
                      '--x-axis': `${currentCoords[0]}%`,
                      '--y-axis': `${currentCoords[1]}%`
                    } as any}
                    onMouseDown={onMouseDown}
                  />
                </div>
                <footer className='pprek24-feature-image-focus-footer'>
                  <div id={id}>{__('Fokuspunkt', 'pprek24')}: {currentCoords?.join(' / ')}</div>
                  <div className='pprek24-feature-image-focus-actions'>
                    <Button variant='primary' onClick={onSave}>{__('Save')}</Button>
                    <Button variant='secondary' onClick={onReset}>{__('Reset')}</Button>
                  </div>
                </footer>
              </Modal>
            ) : null
          }
        </>
      )
    }
  ,
  'withFeaturedImageExtension'
)

wp.hooks.addFilter(
  'editor.PostFeaturedImage',
  'pprek24/extend-featured-image',
  extendFeaturedImage
)