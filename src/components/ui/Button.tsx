import type { Component, JSX } from 'solid-js'

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (e: Event) => void
}

export const Button: Component<ButtonProps> = props => {
  return (
    <button
      class={
        'rounded border border-black p-2 transition-all duration-100 ' +
        'hover:shadow active:scale-95' +
        (props.class ? ' ' + props.class : '')
      }
      onClick={props.onClick}
    >
      Add user
    </button>
  )
}
