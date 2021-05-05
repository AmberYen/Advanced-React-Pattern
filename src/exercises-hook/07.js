// State Initializers

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) =>
  fns.forEach(fn => fn && fn(...args))


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
  const initialOn = false;
  const [on, setOn] = React.useState(false)
  const toggle = React.useCallback(() => setOn(oldOn => !oldOn), [])

  const getTogglerProps = ({onClick, ...props} = {}) => ({
    onClick: callAll(onClick, toggle),
    'aria-pressed': on,
    ...props,
  })

  const reset = () =>
    setOn(initialOn)
    props.onReset(initialOn)

  useEffectAfterMount(() => {
    props.onToggle(on)
  }, [on])
  
  const getStateAndHelpers = () => {
    return {
      on,
      toggle,
      reset,
      getTogglerProps,
    }
  }

  return props.children(getStateAndHelpers())
}

function Usage({
  initialOn = false,
  onToggle = (...args) => console.log('onToggle', ...args),
  onReset = (...args) => console.log('onReset', ...args),
}) {
  return (
    <Toggle
      initialOn={initialOn}
      onToggle={onToggle}
      onReset={onReset}
    >
      {({getTogglerProps, on, reset}) => (
        <div>
          <Switch {...getTogglerProps({on})} />
          <hr />
          <button onClick={() => reset()}>Reset</button>
        </div>
      )}
    </Toggle>
  )
}
Usage.title = 'State Initializers'

export {Toggle, Usage as default}
