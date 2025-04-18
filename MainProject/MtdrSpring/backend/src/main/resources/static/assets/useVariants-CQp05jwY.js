import{x as g,b as l,C as m,bj as f,bz as h}from"./index-DP23-ShH.js";var C=`accept acceptCharset accessKey action allowFullScreen allowTransparency
    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge
    charSet checked classID className colSpan cols content contentEditable contextMenu
    controls coords crossOrigin data dateTime default defer dir disabled download draggable
    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder
    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity
    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media
    mediaGroup method min minLength multiple muted name noValidate nonce open
    optimum pattern placeholder poster preload radioGroup readOnly rel required
    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected
    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style
    summary tabIndex target title type useMap value width wmode wrap`,v=`onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown
    onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick
    onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown
    onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel
    onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough
    onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata
    onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad onError`,y="".concat(C," ").concat(v).split(/[\s\n]+/),b="aria-",x="data-";function d(a,e){return a.indexOf(e)===0}function E(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,o;e===!1?o={aria:!0,data:!0,attr:!0}:e===!0?o={aria:!0}:o=g({},e);var t={};return Object.keys(a).forEach(function(n){(o.aria&&(n==="role"||d(n,b))||o.data&&d(n,x)||o.attr&&y.includes(n))&&(t[n]=a[n])}),t}const D=function(a,e){let o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:void 0;var t,n;const{variant:c,[a]:i}=l.useContext(m),s=l.useContext(f),u=i==null?void 0:i.variant;let r;typeof e<"u"?r=e:o===!1?r="borderless":r=(n=(t=s??u)!==null&&t!==void 0?t:c)!==null&&n!==void 0?n:"outlined";const p=h.includes(r);return[r,p]};export{E as p,D as u};
