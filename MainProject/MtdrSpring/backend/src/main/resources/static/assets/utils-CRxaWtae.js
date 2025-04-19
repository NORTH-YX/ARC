import{R as p,g as ee,F as oe,m as re,u as D,r as ne,b as c,C as A,c as E,aI as V,a as te,D as le,i as se,b2 as ae,b3 as ce,aC as ie,o as R}from"./index-DP23-ShH.js";import{c as de}from"./index-DDCoMNaG.js";import{p as ue}from"./useVariants-CQp05jwY.js";function k(e){if(e)return{closable:e.closable,closeIcon:e.closeIcon}}function H(e){const{closable:r,closeIcon:n}=e||{};return p.useMemo(()=>{if(!r&&(r===!1||n===!1||n===null))return!1;if(r===void 0&&n===void 0)return null;let o={closeIcon:typeof n!="boolean"&&n!==null?n:void 0};return r&&typeof r=="object"&&(o=Object.assign(Object.assign({},o),r)),o},[r,n])}function M(){const e={};for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return n.forEach(t=>{t&&Object.keys(t).forEach(s=>{t[s]!==void 0&&(e[s]=t[s])})}),e}const ge={};function fe(e,r){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ge;const o=H(e),t=H(r),s=typeof o!="boolean"?!!(o!=null&&o.disabled):!1,l=p.useMemo(()=>Object.assign({closeIcon:p.createElement(de,null)},n),[n]),i=p.useMemo(()=>o===!1?!1:o?M(l,t,o):t===!1?!1:t?M(l,t):l.closable?l:!1,[o,t,l]);return p.useMemo(()=>{if(i===!1)return[!1,null,s];const{closeIconRender:d}=l,{closeIcon:C}=i;let a=C;if(a!=null){d&&(a=d(C));const g=ue(i,!0);Object.keys(g).length&&(a=p.isValidElement(a)?p.cloneElement(a,g):p.createElement("span",Object.assign({},g),a))}return[!0,a,s]},[i,l])}const Ce=e=>{const{paddingXXS:r,lineWidth:n,tagPaddingHorizontal:o,componentCls:t,calc:s}=e,l=s(o).sub(n).equal(),i=s(r).sub(n).equal();return{[t]:Object.assign(Object.assign({},ne(e)),{display:"inline-block",height:"auto",marginInlineEnd:e.marginXS,paddingInline:l,fontSize:e.tagFontSize,lineHeight:e.tagLineHeight,whiteSpace:"nowrap",background:e.defaultBg,border:`${D(e.lineWidth)} ${e.lineType} ${e.colorBorder}`,borderRadius:e.borderRadiusSM,opacity:1,transition:`all ${e.motionDurationMid}`,textAlign:"start",position:"relative",[`&${t}-rtl`]:{direction:"rtl"},"&, a, a:hover":{color:e.defaultColor},[`${t}-close-icon`]:{marginInlineStart:i,fontSize:e.tagIconSize,color:e.colorTextDescription,cursor:"pointer",transition:`all ${e.motionDurationMid}`,"&:hover":{color:e.colorTextHeading}},[`&${t}-has-color`]:{borderColor:"transparent",[`&, a, a:hover, ${e.iconCls}-close, ${e.iconCls}-close:hover`]:{color:e.colorTextLightSolid}},"&-checkable":{backgroundColor:"transparent",borderColor:"transparent",cursor:"pointer",[`&:not(${t}-checkable-checked):hover`]:{color:e.colorPrimary,backgroundColor:e.colorFillSecondary},"&:active, &-checked":{color:e.colorTextLightSolid},"&-checked":{backgroundColor:e.colorPrimary,"&:hover":{backgroundColor:e.colorPrimaryHover}},"&:active":{backgroundColor:e.colorPrimaryActive}},"&-hidden":{display:"none"},[`> ${e.iconCls} + span, > span + ${e.iconCls}`]:{marginInlineStart:l}}),[`${t}-borderless`]:{borderColor:"transparent",background:e.tagBorderlessBg}}},T=e=>{const{lineWidth:r,fontSizeIcon:n,calc:o}=e,t=e.fontSizeSM;return re(e,{tagFontSize:t,tagLineHeight:D(o(e.lineHeightSM).mul(t).equal()),tagIconSize:o(n).sub(o(r).mul(2)).equal(),tagPaddingHorizontal:8,tagBorderlessBg:e.defaultBg})},j=e=>({defaultBg:new oe(e.colorFillQuaternary).onBackground(e.colorBgContainer).toHexString(),defaultColor:e.colorText}),W=ee("Tag",e=>{const r=T(e);return Ce(r)},j);var pe=function(e,r){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&r.indexOf(o)<0&&(n[o]=e[o]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,o=Object.getOwnPropertySymbols(e);t<o.length;t++)r.indexOf(o[t])<0&&Object.prototype.propertyIsEnumerable.call(e,o[t])&&(n[o[t]]=e[o[t]]);return n};const be=c.forwardRef((e,r)=>{const{prefixCls:n,style:o,className:t,checked:s,onChange:l,onClick:i}=e,d=pe(e,["prefixCls","style","className","checked","onChange","onClick"]),{getPrefixCls:C,tag:a}=c.useContext(A),g=y=>{l==null||l(!s),i==null||i(y)},b=C("tag",n),[S,x,f]=W(b),$=E(b,`${b}-checkable`,{[`${b}-checkable-checked`]:s},a==null?void 0:a.className,t,x,f);return S(c.createElement("span",Object.assign({},d,{ref:r,style:Object.assign(Object.assign({},o),a==null?void 0:a.style),className:$,onClick:g})))}),me=e=>te(e,(r,n)=>{let{textColor:o,lightBorderColor:t,lightColor:s,darkColor:l}=n;return{[`${e.componentCls}${e.componentCls}-${r}`]:{color:o,background:s,borderColor:t,"&-inverse":{color:e.colorTextLightSolid,background:l,borderColor:l},[`&${e.componentCls}-borderless`]:{borderColor:"transparent"}}}}),he=V(["Tag","preset"],e=>{const r=T(e);return me(r)},j);function ye(e){return typeof e!="string"?e:e.charAt(0).toUpperCase()+e.slice(1)}const v=(e,r,n)=>{const o=ye(n);return{[`${e.componentCls}${e.componentCls}-${r}`]:{color:e[`color${n}`],background:e[`color${o}Bg`],borderColor:e[`color${o}Border`],[`&${e.componentCls}-borderless`]:{borderColor:"transparent"}}}},ve=V(["Tag","status"],e=>{const r=T(e);return[v(r,"success","Success"),v(r,"processing","Info"),v(r,"error","Error"),v(r,"warning","Warning")]},j);var Se=function(e,r){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&r.indexOf(o)<0&&(n[o]=e[o]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,o=Object.getOwnPropertySymbols(e);t<o.length;t++)r.indexOf(o[t])<0&&Object.prototype.propertyIsEnumerable.call(e,o[t])&&(n[o[t]]=e[o[t]]);return n};const xe=c.forwardRef((e,r)=>{const{prefixCls:n,className:o,rootClassName:t,style:s,children:l,icon:i,color:d,onClose:C,bordered:a=!0,visible:g}=e,b=Se(e,["prefixCls","className","rootClassName","style","children","icon","color","onClose","bordered","visible"]),{getPrefixCls:S,direction:x,tag:f}=c.useContext(A),[$,y]=c.useState(!0),L=le(b,["closeIcon","closable"]);c.useEffect(()=>{g!==void 0&&y(g)},[g]);const P=se(d),w=ae(d),O=P||w,X=Object.assign(Object.assign({backgroundColor:d&&!O?d:void 0},f==null?void 0:f.style),s),u=S("tag",n),[_,U,Q]=W(u),G=E(u,f==null?void 0:f.className,{[`${u}-${d}`]:O,[`${u}-has-color`]:d&&!O,[`${u}-hidden`]:!$,[`${u}-rtl`]:x==="rtl",[`${u}-borderless`]:!a},o,t,U,Q),B=h=>{h.stopPropagation(),C==null||C(h),!h.defaultPrevented&&y(!1)},[,J]=fe(k(e),k(f),{closable:!1,closeIconRender:h=>{const Z=c.createElement("span",{className:`${u}-close-icon`,onClick:B},h);return ce(h,Z,m=>({onClick:F=>{var I;(I=m==null?void 0:m.onClick)===null||I===void 0||I.call(m,F),B(F)},className:E(m==null?void 0:m.className,`${u}-close-icon`)}))}}),K=typeof b.onClick=="function"||l&&l.type==="a",N=i||null,Y=N?c.createElement(c.Fragment,null,N,l&&c.createElement("span",null,l)):l,z=c.createElement("span",Object.assign({},L,{ref:r,className:G,style:X}),Y,J,P&&c.createElement(he,{key:"preset",prefixCls:u}),w&&c.createElement(ve,{key:"status",prefixCls:u}));return _(K?c.createElement(ie,{component:"Tag"},z):z)}),q=xe;q.CheckableTag=be;const Ee=e=>{let r,n="black";switch(e){case"To Do":r="#DBEAFE",n="#2563EB";break;case"In Progress":r="#FEF3C7",n="#92400E";break;case"Completed":r="#D1FAE5",n="#065F46";break;default:r="gray"}return R.jsx(q,{style:{borderRadius:"15px",border:"none",padding:"7px 15px"},color:r,children:R.jsx("p",{style:{color:n,fontSize:"14px",margin:0},children:e})})},Te=(e,r)=>{const n=e.split(" ");return n.length>r?n.slice(0,r).join(" ")+"...":e};export{q as T,Ee as g,Te as s};
