/** 
 * use-browser-state v1.0.0 (MIT license)
 * By: Mark Miro <contact@markmiro.com> (https://markmiro.com)
 * undefined
 */
/*!
 * @package debounce
 * @version 1.2.0
 * @license MIT
 * @author undefined
 * @url https://github.com/component/debounce
 */"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var react=require("react");function debounce(e,t,n){var r,u,a,o,s;function c(){var i=Date.now()-o;i<t&&i>=0?r=setTimeout(c,t-i):(r=null,n||(s=e.apply(a,u),a=u=null))}null==t&&(t=100);var i=function(){a=this,u=arguments,o=Date.now();var i=n&&!r;return r||(r=setTimeout(c,t)),i&&(s=e.apply(a,u),a=u=null),s};return i.clear=function(){r&&(clearTimeout(r),r=null)},i.flush=function(){r&&(s=e.apply(a,u),a=u=null,clearTimeout(r),r=null)},i}debounce.debounce=debounce;var debounce_1=debounce;let SAVE_WAIT=1e3;function setSaveWait(e){SAVE_WAIT=e}let counter=0;function increment(){return`useBrowserState_${counter++}`}function reset(){localStorage.clear(),window.location.reload()}let incrementUnsaved=()=>{},decrementUnsaved=()=>{};function useIsBrowserStateSaving(){const[e,t]=react.useState([]),n=e.length>0;return react.useEffect(()=>{incrementUnsaved=e=>t(t=>t.includes(e)?t:[...t,e]),decrementUnsaved=e=>t(t=>t.filter(t=>t!==e))},[]),react.useEffect(()=>{const e=e=>{if(n)return e.preventDefault(),"We're still saving..."};return window.addEventListener("beforeunload",e),()=>window.removeEventListener("beforeunload",e)},[n]),n}function countedDebounce(e,t){const n=debounce_1((...t)=>{decrementUnsaved(e),e(...t)},t);return(...t)=>{incrementUnsaved(e),n(...t)}}function useBrowserState(e,{at:t}={}){const[n]=react.useState(()=>`${increment()}_${btoa(JSON.stringify(e).slice(500))}`),r=t||n,[u,a]=react.useState(()=>{const t=localStorage.getItem(r),n=JSON.parse("undefined"===t?null:t);return t===JSON.stringify(e)?e:null!==n?n:e}),o=react.useCallback(countedDebounce((e,t)=>{localStorage.setItem(e,JSON.stringify(t))},SAVE_WAIT),[]);return react.useEffect(()=>{o(r,u)},[o,r,u]),[u,function(e){a(e)}]}exports.reset=reset,exports.setSaveWait=setSaveWait,exports.useBrowserState=useBrowserState,exports.useIsBrowserStateSaving=useIsBrowserStateSaving;
