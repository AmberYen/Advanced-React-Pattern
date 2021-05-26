// State Initializers

import React from 'react'
import {Switch} from '../switch'
import {useStateWithCallback}  from './utils';

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
  const initialState = {
    on: props.initialOn
  }

  const [{ on }, setState] = useStateWithCallback(initialState);

  const internalSetState = React.useCallback(
    (changes, callback) => {
      setState(prevState => {
        return [changes]
          .map(c => typeof c === 'function' ? c(prevState): c)
          .map(c => props.stateReducer(prevState, c) || {})
          .map(c => Object.keys(c).length ? c : null)[0];
      }, callback);
    }, 
    [props.stateReducer]
  )

  const reset = React.useCallback(
    () => {
      internalSetState(
        initialState, 
        (prevState, state) => {
          props.onReset(state.on)
        }
      )
    },
    [initialState, props.onReset, internalSetState]
  )

  const toggle = React.useCallback(
    () => {
      internalSetState(prevState => ({ 
        ...prevState,
        on: !on
      }), 
      (prevState, state) => props.onToggle(state.on))
    },
    [on, internalSetState, props.onToggle],
  )

  const getTogglerProps = React.useCallback(
    ({ onClick, ...props } = {}) => ({
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }), 
    [on, toggle]
  );

  const getStateAndProps = React.useCallback(
    () => ({
      on,
      reset,
      toggle,
      getTogglerProps,
    }), 
    [on, reset, toggle, getTogglerProps],
  )

  return props.children(getStateAndProps())
}

function Usage({
  initialOn = false,
  onToggle = (...args) => console.log('onToggle', ...args),
  onReset = (...args) => console.log('onReset', ...args),
}) {
  const [timesClicked, setTimesClicked] = React.useState(0);
  
  const handleToggle = (...args) => {
    setTimesClicked(old => old + 1);
    onToggle(...args)
  }
  const handleReset = (...args) => {
    setTimesClicked(initialOn)
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