// Building the toggle component

import React from 'react'
import { useCallback, useState, useEffect, useRef } from 'react';

import {Switch} from '../switch';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

const useToggle = (onToggle) => {
  const [state, setState] = useState(false);
  const preState = usePrevious(state);

  const toggle = useCallback(() => setState(state => !state), []);

  useEffect(() => { 
    if (preState !== undefined && preState !== state) {
      onToggle(state);
    }
  }, [state]);

  return [state, toggle];
}

function Toggle(props) {
  const [on, setToggle] = useToggle(props.onToggle);

  return <Switch on={on} onClick={setToggle}  /> 
}

function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return <Toggle onToggle={onToggle} />
}
Usage.title = 'Build Toggle'

export {Toggle, Usage as default}
