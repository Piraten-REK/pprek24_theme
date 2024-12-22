<script lang="ts">
  interface Props {
      icon: string
      class?: string
      [key: string]: unknown
  }

  const { icon, class: additionalClassName, ...rest }: Props = $props()
  const classes = ['bi']
  classes.push(`bi-${icon.replace(/([A-Z])/g, '-$1').toLowerCase()}`)
  if (additionalClassName != null) {
      classes.push(additionalClassName)
  }
  const className = $state(classes.join(' '))
</script>

<i
  class={className}
  role="img"
  {...rest}
></i>