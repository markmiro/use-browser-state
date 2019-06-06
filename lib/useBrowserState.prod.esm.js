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
 */import{useState as n,useEffect as e,useCallback as t}from"react";function r(n,e,t){var r,l,o,u,i;function a(){var c=Date.now()-u;c<e&&c>=0?r=setTimeout(a,e-c):(r=null,t||(i=n.apply(o,l),o=l=null))}null==e&&(e=100);var c=function(){o=this,l=arguments,u=Date.now();var c=t&&!r;return r||(r=setTimeout(a,e)),c&&(i=n.apply(o,l),o=l=null),i};return c.clear=function(){r&&(clearTimeout(r),r=null)},c.flush=function(){r&&(i=n.apply(o,l),o=l=null,clearTimeout(r),r=null)},c}r.debounce=r;var l=r;let o=1e3;function u(n){o=n}let i=0;function a(){localStorage.clear(),window.location.reload()}let c=()=>{},f=()=>{};function s(){const[t,r]=n([]),l=t.length>0;return e(()=>{c=n=>r(e=>e.includes(n)?e:[...e,n]),f=n=>r(e=>e.filter(e=>e!==n))},[]),e(()=>{const n=n=>{if(l)return n.preventDefault(),"We're still saving..."};return window.addEventListener("beforeunload",n),()=>window.removeEventListener("beforeunload",n)},[l]),l}function d(r,{at:u}={}){const[a]=n(()=>`${`useBrowserState_${i++}`}_${btoa(JSON.stringify(r).slice(500))}`),s=u||a,[d,p]=n(()=>{const n=localStorage.getItem(s),e=JSON.parse("undefined"===n?null:n);return n===JSON.stringify(r)?r:null!==e?e:r}),v=t(function(n,e){const t=l((...e)=>{f(n),n(...e)},e);return(...e)=>{c(n),t(...e)}}((n,e)=>{localStorage.setItem(n,JSON.stringify(e))},o),[]);return e(()=>{v(s,d)},[v,s,d]),[d,function(n){p(n)}]}export{a as reset,u as setSaveWait,d as useBrowserState,s as useIsBrowserStateSaving};
