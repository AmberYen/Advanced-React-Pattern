// Compound Components

import React from 'react'
import {Switch} from '../switch'

const ToggleContext = React.createContext()

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
  const value = React.useMemo(() => ({on, toggle}), [on])

  useEffectAfterMount(() => {
    props.onToggle(on)
  }, [on])
  
  return (
    <ToggleContext.Provider value={value}>
      {props.children}
    </ToggleContext.Provider>
  )
}

const On = ({children}) => {
  const {on} = React.useContext(ToggleContext) 
  return on ? children : null
}
const Off = ({children}) => {
  const {on} = React.useContext(ToggleContext) 
  return on ? null : children
}
const Button = (props) => {
  const {on, toggle} = React.useContext(ToggleContext) 
  return <Switch on={on} onClick={toggle} {...props} />
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
