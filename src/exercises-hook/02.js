// Compound Components

import React from 'react'
import {Switch} from '../switch'

/// const ToggleContext = React.createContext()

function useEffectAfterMount(cb, dependencies) {
  const justMounted = React.useRef(true)

  React.useEffect(() => {
    if (!justMounted.current) {
      return cb()
    }
    justMounted.current = false
  }, dependencies)
}

function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = React.useCallback(() => setOn(oldOn => !oldOn), [])

  useEffectAfterMount(() => {
    props.onToggle(on)
  }, [on])
  
  return (
    React.Children.map(props.children, childElement => {
      return React.cloneElement(childElement, {
        on: on,
        toggle: toggle,
      });
    })
  )
}

const On = (props) => {
  return props.on ? props.children : null
}
const Off = (props) => {
  return props.on ? null : props.children
}
const Button = (props) => {
  return <Switch on={props.on} onClick={props.toggle} />
}

Toggle.On = On
Toggle.Off = Off
Toggle.Button = Button

function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
      <Toggle.Button />
    </Toggle>
  )
}
Usage.title = 'Compound Components'

export {Toggle, Usage as default}
