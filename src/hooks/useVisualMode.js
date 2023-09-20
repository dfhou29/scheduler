import {useState} from "react";

export default function useVisualMode(initialMode) {

  const [history, setHistory] = useState([initialMode]);

  function transition(newMode, replace =  false) {

    setHistory(prev => {
      if (replace) {
          return [...prev.slice(0, prev.length - 1), newMode]
      }
      return [...prev, newMode]
    });
  }

  function back() {
    if (history.length > 1) {
      setHistory(prev => [...prev.slice(0, prev.length-1)]);
    }
  }

  return (
    {mode : history[history.length - 1], transition, back}
  )
}