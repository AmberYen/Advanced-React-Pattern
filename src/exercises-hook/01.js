// Building the toggle component

import React from 'react'
import { useCallback, useState, useEffect, useRef } from 'react';

import {Switch} from '../switch';

const useToggle = (onToggle) => {
  const [state, setState] = useState(false);
  const justMounted = useRef(true);

  const toggle = useCallback(() => setState(state => !state), []);

  useEffect(() => { 
    if (!justMounted.current) {
      onToggle(state);
    }
    justMounted.current = false
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
