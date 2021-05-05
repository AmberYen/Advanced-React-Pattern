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
  const toggle = React.useCallback(() => internalSetState(oldOn => !oldOn, setOn), [])

  const internalSetState = (changes, callback) => {
    callback(state => {
      const changesObject =
        typeof changes === 'function' ? changes(state) : changes
      // apply state reducer
      const reducedChanges =
        props.stateReducer({}, changesObject) || {}

      // return null if there are no changes to be made
      // (to avoid an unecessary rerender)
      console.log('reducedChanges', reducedChanges);
      return reducedChanges;
    });
  }

  const getTogglerProps = ({onClick, ...props} = {}) => ({
    onClick: callAll(onClick, toggle),
    'aria-pressed': on,
    ...props,
  })

  const reset = () =>
    internalSetState({on: initialOn}, setOn);
    props.onReset(initialOn)

  useEffectAfterMount(() => {
    props.onToggle(on);
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
  const initialState = 0
  const [timesClicked, setTimesClicked] = React.useState(0);
  
  const handleToggle = (...args) => {
    setTimesClicked(old => old + 1);
    onToggle(...args)
  }
  const handleReset = (...args) => {
    setTimesClicked(initialState)
    onReset(...args)
  }
  const toggleStateReducer = (state, changes) => {
    if (timesClicked >= 4) {
      return {...changes, on: false}
    }
    return changes
  }
  
  return (
    <Toggle
      stateReducer={toggleStateReducer}
      onToggle={handleToggle}
      onReset={handleReset}
    >
      {toggle => (
        <div>
          <Switch
            {...toggle.getTogglerProps({
              on: toggle.on,
            })}
          />
          {timesClicked > 4 ? (
            <div data-testid="notice">
              Whoa, you clicked too much!
              <br />
            </div>
          ) : timesClicked > 0 ? (
            <div data-testid="click-count">
              Click count: {timesClicked}
            </div>
          ) : null}
          <button onClick={toggle.reset}>Reset</button>
        </div>
      )}
    </Toggle>
  )
}
Usage.title = 'State Reducers'

export {Toggle, Usage as default}

/* eslint
"no-unused-vars": [
  "warn",
  {
    "argsIgnorePattern": "^_.+|^ignore.+",
    "varsIgnorePattern": "^_.+|^ignore.+",
    "args": "after-used"
  }
]
 */