/** 
 * use-browser-state v1.0.0 (MIT license)
 * By: Mark Miro <contact@markmiro.com> (https://markmiro.com)
 * undefined
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */
function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  }
  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
// Adds compatibility for ES modules
debounce.debounce = debounce;

var debounce_1 = debounce;

let SAVE_WAIT = 1000;
function setSaveWait(wait) {
  SAVE_WAIT = wait;
}
let counter = 0;

function increment() {
  return `useBrowserState_${counter++}`;
}

function reset() {
  localStorage.clear();
  window.location.reload();
}

let incrementUnsaved = () => {};

let decrementUnsaved = () => {};

function useIsBrowserStateSaving() {
  const [keys, setKeys] = useState([]);
  const isSaving = keys.length > 0;
  useEffect(() => {
    incrementUnsaved = key => setKeys(keys => keys.includes(key) ? keys : [...keys, key]);

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
  const debounced = debounce_1((...args) => {
    decrementUnsaved(fn);
    fn(...args);
  }, delay);
  return (...args) => {
    incrementUnsaved(fn);
    debounced(...args);
  };
}

function useBrowserState(defaultValue, {
  at
} = {}) {
  const [defaultKey] = useState( // Need to slice since keys can get really big
  () => `${increment()}_${btoa(JSON.stringify(defaultValue).slice(500))}`);
  const key = at || defaultKey;
  const [value, setValue] = useState(() => {
    const storedString = localStorage.getItem(key);
    const storedValue = JSON.parse(storedString === "undefined" ? null : storedString); // Allow reference equality check to work by returning the default value rather than localStorage stuff

    if (storedString === JSON.stringify(defaultValue)) return defaultValue;
    return storedValue !== null ? storedValue : defaultValue;
  });
  const debounceSaveToLocalStorage = useCallback(countedDebounce((key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, SAVE_WAIT), []);
  useEffect(() => {
    debounceSaveToLocalStorage(key, value);
  }, [debounceSaveToLocalStorage, key, value]);

  function setValueAndStorage(newValueOrFunc) {
    setValue(newValueOrFunc);
  }

  return [value, setValueAndStorage];
}

export { reset, setSaveWait, useBrowserState, useIsBrowserStateSaving };
