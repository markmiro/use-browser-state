import debounce from "debounce";
import { useCallback, useEffect, useState } from "react";

let SAVE_WAIT = 1000;

export function setSaveWait(wait) {
  SAVE_WAIT = wait;
}

let counter = 0;
function increment() {
  return `useBrowserState_${counter++}`;
}

export function reset() {
  localStorage.clear();
  window.location.reload();
}

let incrementUnsaved = () => {};
let decrementUnsaved = () => {};

export function useIsBrowserStateSaving() {
  const [keys, setKeys] = useState([]);
  const isSaving = keys.length > 0;

  useEffect(() => {
    incrementUnsaved = key =>
      setKeys(keys => (keys.includes(key) ? keys : [...keys, key]));
    decrementUnsaved = key => setKeys(keys => keys.filter(k => k !== key));
  }, []);

  useEffect(() => {
    const beforeUnload = e => {
      if (isSaving) {
        e.preventDefault();
        return "We're still saving...";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isSaving]);

  return isSaving;
}

function countedDebounce(fn, delay) {
  const debounced = debounce((...args) => {
    decrementUnsaved(fn);
    fn(...args);
  }, delay);

  return (...args) => {
    incrementUnsaved(fn);
    debounced(...args);
  };
}

export function useBrowserState(defaultValue, { at } = {}) {
  const [defaultKey] = useState(
    // Need to slice since keys can get really big
    () => `${increment()}_${btoa(JSON.stringify(defaultValue).slice(500))}`
  );

  const key = at || defaultKey;

  const [value, setValue] = useState(() => {
    const storedString = localStorage.getItem(key);
    const storedValue = JSON.parse(
      storedString === "undefined" ? null : storedString
    );
    // Allow reference equality check to work by returning the default value rather than localStorage stuff
    if (storedString === JSON.stringify(defaultValue)) return defaultValue;
    return storedValue !== null ? storedValue : defaultValue;
  });

  const debounceSaveToLocalStorage = useCallback(
    countedDebounce((key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    }, SAVE_WAIT),
    []
  );

  useEffect(() => {
    debounceSaveToLocalStorage(key, value);
  }, [debounceSaveToLocalStorage, key, value]);

  function setValueAndStorage(newValueOrFunc) {
    setValue(newValueOrFunc);
  }

  return [value, setValueAndStorage];
}
