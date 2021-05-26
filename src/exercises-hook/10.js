// control props

import React from 'react'
import {Switch} from '../switch'

function useEffectAfterMount(cb, dependencies) {
  const justMounted = React.useRef(true)
  
  React.useEffect(() => {
    if (!justMounted.current) {
      return cb()
    }
    justMounted.current = false
  }, dependencies)
}

const Toggle = function(props) {
  const [on, setOn] = React.useState(false)
  const isControlled = (prop) =>
    props[prop] !== undefined
  const getState = (prop, state) =>
    isControlled(prop) ? props[prop] : state

  useEffectAfterMount(() => {
    props.onToggle(on)
  }, [on])
  
  const toggle = () => {
    isControlled('on') ? 
      props.onToggle(!getState('on'))
      :
      setOn(!on)
  }
  
  return <Switch on={getState('on', on)} onClick={toggle} />
}

const Usage = function (props) {
  const [bothOn, setButton] = React.useState(false);
  const {toggle1Ref, toggle2Ref} = props
  
  const handleToggle = on => {
    setButton(on)
  }

  return (
    <div>
      <Toggle
        on={bothOn}
        onToggle={handleToggle}
        ref={toggle1Ref}
      />
      <Toggle
        on={bothOn}
        onToggle={handleToggle}
        ref={toggle2Ref}
      />
    </div>
  )
}
Usage.title = 'Control Props'

export {Toggle, Usage as default}
