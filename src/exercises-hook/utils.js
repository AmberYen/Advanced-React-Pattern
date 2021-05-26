import React from 'react';

export function useStateWithCallback(initialState) {
  const [state, setState] = React.useState(initialState);
  const callbackRef = React.useRef(() => {})
  const prevStateRef = React.useRef(state);
  const setStateWithCallback = React.useCallback(
    (
      newState, 
      callback = () => {}
    ) => {
      (prevStateRef.current = state) &&
      (callbackRef.current = callback) &&
      setState(newState)
    }, [])
  React.useLayoutEffect(() => callbackRef.current(prevStateRef.current, state), [state])
  return [state, setStateWithCallback];
}