import{b as l,g as Ze,aX as et,be as Le,m as tt,r as Te,u as ee,bf as be,aj as ye,aY as Se,X as Q,e as nt,c as ne,bg as rt,bh as ot,aP as lt,am as at,p as it,al as st,bi as ct,bj as ut,bk as dt,bl as mt,bm as He,bn as re,bo as ft,a6 as gt,ak as de,G as Ie,ba as pt,O as ht,aI as bt,aN as Oe,bp as yt,$ as We,s as ze,I as Ct,_ as vt,a8 as xt,T as $t,a$ as wt,ah as St,bq as It,aR as Ot,q as Et,D as Ft,br as De,C as qe,bs as Mt,au as jt,bt as Nt,bu as Pt,bv as Rt,aM as _t,d as Vt,bw as Lt,bx as Tt}from"./index-DP23-ShH.js";import{R as Ht}from"./CheckCircleFilled-DkmpHvXd.js";import{R as Wt}from"./TextArea-BMnG7mQ2.js";const Ee=e=>typeof e=="object"&&e!=null&&e.nodeType===1,Fe=(e,t)=>(!t||e!=="hidden")&&e!=="visible"&&e!=="clip",ce=(e,t)=>{if(e.clientHeight<e.scrollHeight||e.clientWidth<e.scrollWidth){const n=getComputedStyle(e,null);return Fe(n.overflowY,t)||Fe(n.overflowX,t)||(r=>{const o=(a=>{if(!a.ownerDocument||!a.ownerDocument.defaultView)return null;try{return a.ownerDocument.defaultView.frameElement}catch{return null}})(r);return!!o&&(o.clientHeight<r.scrollHeight||o.clientWidth<r.scrollWidth)})(e)}return!1},ue=(e,t,n,r,o,a,i,s)=>a<e&&i>t||a>e&&i<t?0:a<=e&&s<=n||i>=t&&s>=n?a-e-r:i>t&&s<n||a<e&&s>n?i-t+o:0,zt=e=>{const t=e.parentElement;return t??(e.getRootNode().host||null)},Me=(e,t)=>{var n,r,o,a;if(typeof document>"u")return[];const{scrollMode:i,block:s,inline:u,boundary:f,skipOverflowHiddenElements:w}=t,p=typeof f=="function"?f:T=>T!==f;if(!Ee(e))throw new TypeError("Invalid target");const M=document.scrollingElement||document.documentElement,L=[];let h=e;for(;Ee(h)&&p(h);){if(h=zt(h),h===M){L.push(h);break}h!=null&&h===document.body&&ce(h)&&!ce(document.documentElement)||h!=null&&ce(h,w)&&L.push(h)}const v=(r=(n=window.visualViewport)==null?void 0:n.width)!=null?r:innerWidth,b=(a=(o=window.visualViewport)==null?void 0:o.height)!=null?a:innerHeight,{scrollX:y,scrollY:P}=window,{height:c,width:g,top:m,right:x,bottom:R,left:S}=e.getBoundingClientRect(),{top:E,right:j,bottom:z,left:D}=(T=>{const d=window.getComputedStyle(T);return{top:parseFloat(d.scrollMarginTop)||0,right:parseFloat(d.scrollMarginRight)||0,bottom:parseFloat(d.scrollMarginBottom)||0,left:parseFloat(d.scrollMarginLeft)||0}})(e);let N=s==="start"||s==="nearest"?m-E:s==="end"?R+z:m+c/2-E+z,C=u==="center"?S+g/2-D+j:u==="end"?x+j:S-D;const q=[];for(let T=0;T<L.length;T++){const d=L[T],{height:H,width:O,top:B,right:K,bottom:Y,left:J}=d.getBoundingClientRect();if(i==="if-needed"&&m>=0&&S>=0&&R<=b&&x<=v&&(d===M&&!ce(d)||m>=B&&R<=Y&&S>=J&&x<=K))return q;const oe=getComputedStyle(d),X=parseInt(oe.borderLeftWidth,10),k=parseInt(oe.borderTopWidth,10),I=parseInt(oe.borderRightWidth,10),_=parseInt(oe.borderBottomWidth,10);let $=0,W=0;const F="offsetWidth"in d?d.offsetWidth-d.clientWidth-X-I:0,A="offsetHeight"in d?d.offsetHeight-d.clientHeight-k-_:0,G="offsetWidth"in d?d.offsetWidth===0?0:O/d.offsetWidth:0,te="offsetHeight"in d?d.offsetHeight===0?0:H/d.offsetHeight:0;if(M===d)$=s==="start"?N:s==="end"?N-b:s==="nearest"?ue(P,P+b,b,k,_,P+N,P+N+c,c):N-b/2,W=u==="start"?C:u==="center"?C-v/2:u==="end"?C-v:ue(y,y+v,v,X,I,y+C,y+C+g,g),$=Math.max(0,$+P),W=Math.max(0,W+y);else{$=s==="start"?N-B-k:s==="end"?N-Y+_+A:s==="nearest"?ue(B,Y,H,k,_+A,N,N+c,c):N-(B+H/2)+A/2,W=u==="start"?C-J-X:u==="center"?C-(J+O/2)+F/2:u==="end"?C-K+I+F:ue(J,K,O,X,I+F,C,C+g,g);const{scrollLeft:V,scrollTop:Z}=d;$=te===0?0:Math.max(0,Math.min(Z+$/te,d.scrollHeight-H/te+A)),W=G===0?0:Math.max(0,Math.min(V+W/G,d.scrollWidth-O/G+F)),N+=Z-$,C+=V-W}q.push({el:d,top:$,left:W})}return q},Dt=e=>e===!1?{block:"end",inline:"nearest"}:(t=>t===Object(t)&&Object.keys(t).length!==0)(e)?e:{block:"start",inline:"nearest"};function qt(e,t){if(!e.isConnected||!(o=>{let a=o;for(;a&&a.parentNode;){if(a.parentNode===document)return!0;a=a.parentNode instanceof ShadowRoot?a.parentNode.host:a.parentNode}return!1})(e))return;const n=(o=>{const a=window.getComputedStyle(o);return{top:parseFloat(a.scrollMarginTop)||0,right:parseFloat(a.scrollMarginRight)||0,bottom:parseFloat(a.scrollMarginBottom)||0,left:parseFloat(a.scrollMarginLeft)||0}})(e);if((o=>typeof o=="object"&&typeof o.behavior=="function")(t))return t.behavior(Me(e,t));const r=typeof t=="boolean"||t==null?void 0:t.behavior;for(const{el:o,top:a,left:i}of Me(e,Dt(t))){const s=a-n.top+n.bottom,u=i-n.left+n.right;o.scroll({top:s,left:u,behavior:r})}}function me(e){const[t,n]=l.useState(e);return l.useEffect(()=>{const r=setTimeout(()=>{n(e)},e.length?0:10);return()=>{clearTimeout(r)}},[e]),t}const At=e=>{const{componentCls:t}=e,n=`${t}-show-help`,r=`${t}-show-help-item`;return{[n]:{transition:`opacity ${e.motionDurationFast} ${e.motionEaseInOut}`,"&-appear, &-enter":{opacity:0,"&-active":{opacity:1}},"&-leave":{opacity:1,"&-active":{opacity:0}},[r]:{overflow:"hidden",transition:`height ${e.motionDurationFast} ${e.motionEaseInOut},
                     opacity ${e.motionDurationFast} ${e.motionEaseInOut},
                     transform ${e.motionDurationFast} ${e.motionEaseInOut} !important`,[`&${r}-appear, &${r}-enter`]:{transform:"translateY(-5px)",opacity:0,"&-active":{transform:"translateY(0)",opacity:1}},[`&${r}-leave-active`]:{transform:"translateY(-5px)"}}}}},Bt=e=>({legend:{display:"block",width:"100%",marginBottom:e.marginLG,padding:0,color:e.colorTextDescription,fontSize:e.fontSizeLG,lineHeight:"inherit",border:0,borderBottom:`${ee(e.lineWidth)} ${e.lineType} ${e.colorBorder}`},'input[type="search"]':{boxSizing:"border-box"},'input[type="radio"], input[type="checkbox"]':{lineHeight:"normal"},'input[type="file"]':{display:"block"},'input[type="range"]':{display:"block",width:"100%"},"select[multiple], select[size]":{height:"auto"},"input[type='file']:focus,\n  input[type='radio']:focus,\n  input[type='checkbox']:focus":{outline:0,boxShadow:`0 0 0 ${ee(e.controlOutlineWidth)} ${e.controlOutline}`},output:{display:"block",paddingTop:15,color:e.colorText,fontSize:e.fontSize,lineHeight:e.lineHeight}}),je=(e,t)=>{const{formItemCls:n}=e;return{[n]:{[`${n}-label > label`]:{height:t},[`${n}-control-input`]:{minHeight:t}}}},Xt=e=>{const{componentCls:t}=e;return{[e.componentCls]:Object.assign(Object.assign(Object.assign({},Te(e)),Bt(e)),{[`${t}-text`]:{display:"inline-block",paddingInlineEnd:e.paddingSM},"&-small":Object.assign({},je(e,e.controlHeightSM)),"&-large":Object.assign({},je(e,e.controlHeightLG))})}},kt=e=>{const{formItemCls:t,iconCls:n,rootPrefixCls:r,antCls:o,labelRequiredMarkColor:a,labelColor:i,labelFontSize:s,labelHeight:u,labelColonMarginInlineStart:f,labelColonMarginInlineEnd:w,itemMarginBottom:p}=e;return{[t]:Object.assign(Object.assign({},Te(e)),{marginBottom:p,verticalAlign:"top","&-with-help":{transition:"none"},[`&-hidden,
        &-hidden${o}-row`]:{display:"none"},"&-has-warning":{[`${t}-split`]:{color:e.colorError}},"&-has-error":{[`${t}-split`]:{color:e.colorWarning}},[`${t}-label`]:{flexGrow:0,overflow:"hidden",whiteSpace:"nowrap",textAlign:"end",verticalAlign:"middle","&-left":{textAlign:"start"},"&-wrap":{overflow:"unset",lineHeight:e.lineHeight,whiteSpace:"unset"},"> label":{position:"relative",display:"inline-flex",alignItems:"center",maxWidth:"100%",height:u,color:i,fontSize:s,[`> ${n}`]:{fontSize:e.fontSize,verticalAlign:"top"},[`&${t}-required`]:{"&::before":{display:"inline-block",marginInlineEnd:e.marginXXS,color:a,fontSize:e.fontSize,fontFamily:"SimSun, sans-serif",lineHeight:1,content:'"*"'},[`&${t}-required-mark-hidden, &${t}-required-mark-optional`]:{"&::before":{display:"none"}}},[`${t}-optional`]:{display:"inline-block",marginInlineStart:e.marginXXS,color:e.colorTextDescription,[`&${t}-required-mark-hidden`]:{display:"none"}},[`${t}-tooltip`]:{color:e.colorTextDescription,cursor:"help",writingMode:"horizontal-tb",marginInlineStart:e.marginXXS},"&::after":{content:'":"',position:"relative",marginBlock:0,marginInlineStart:f,marginInlineEnd:w},[`&${t}-no-colon::after`]:{content:'"\\a0"'}}},[`${t}-control`]:{"--ant-display":"flex",flexDirection:"column",flexGrow:1,[`&:first-child:not([class^="'${r}-col-'"]):not([class*="' ${r}-col-'"])`]:{width:"100%"},"&-input":{position:"relative",display:"flex",alignItems:"center",minHeight:e.controlHeight,"&-content":{flex:"auto",maxWidth:"100%"}}},[t]:{"&-additional":{display:"flex",flexDirection:"column"},"&-explain, &-extra":{clear:"both",color:e.colorTextDescription,fontSize:e.fontSize,lineHeight:e.lineHeight},"&-explain-connected":{width:"100%"},"&-extra":{minHeight:e.controlHeightSM,transition:`color ${e.motionDurationMid} ${e.motionEaseOut}`},"&-explain":{"&-error":{color:e.colorError},"&-warning":{color:e.colorWarning}}},[`&-with-help ${t}-explain`]:{height:"auto",opacity:1},[`${t}-feedback-icon`]:{fontSize:e.fontSize,textAlign:"center",visibility:"visible",animationName:Le,animationDuration:e.motionDurationMid,animationTimingFunction:e.motionEaseOutBack,pointerEvents:"none","&-success":{color:e.colorSuccess},"&-error":{color:e.colorError},"&-warning":{color:e.colorWarning},"&-validating":{color:e.colorPrimary}}})}},Ne=(e,t)=>{const{formItemCls:n}=e;return{[`${t}-horizontal`]:{[`${n}-label`]:{flexGrow:0},[`${n}-control`]:{flex:"1 1 0",minWidth:0},[`${n}-label[class$='-24'], ${n}-label[class*='-24 ']`]:{[`& + ${n}-control`]:{minWidth:"unset"}}}}},Gt=e=>{const{componentCls:t,formItemCls:n,inlineItemMarginBottom:r}=e;return{[`${t}-inline`]:{display:"flex",flexWrap:"wrap",[n]:{flex:"none",marginInlineEnd:e.margin,marginBottom:r,"&-row":{flexWrap:"nowrap"},[`> ${n}-label,
        > ${n}-control`]:{display:"inline-block",verticalAlign:"top"},[`> ${n}-label`]:{flex:"none"},[`${t}-text`]:{display:"inline-block"},[`${n}-has-feedback`]:{display:"inline-block"}}}}},U=e=>({padding:e.verticalLabelPadding,margin:e.verticalLabelMargin,whiteSpace:"initial",textAlign:"start","> label":{margin:0,"&::after":{visibility:"hidden"}}}),Ae=e=>{const{componentCls:t,formItemCls:n,rootPrefixCls:r}=e;return{[`${n} ${n}-label`]:U(e),[`${t}:not(${t}-inline)`]:{[n]:{flexWrap:"wrap",[`${n}-label, ${n}-control`]:{[`&:not([class*=" ${r}-col-xs"])`]:{flex:"0 0 100%",maxWidth:"100%"}}}}}},Kt=e=>{const{componentCls:t,formItemCls:n,antCls:r}=e;return{[`${t}-vertical`]:{[`${n}:not(${n}-horizontal)`]:{[`${n}-row`]:{flexDirection:"column"},[`${n}-label > label`]:{height:"auto"},[`${n}-control`]:{width:"100%"},[`${n}-label,
        ${r}-col-24${n}-label,
        ${r}-col-xl-24${n}-label`]:U(e)}},[`@media (max-width: ${ee(e.screenXSMax)})`]:[Ae(e),{[t]:{[`${n}:not(${n}-horizontal)`]:{[`${r}-col-xs-24${n}-label`]:U(e)}}}],[`@media (max-width: ${ee(e.screenSMMax)})`]:{[t]:{[`${n}:not(${n}-horizontal)`]:{[`${r}-col-sm-24${n}-label`]:U(e)}}},[`@media (max-width: ${ee(e.screenMDMax)})`]:{[t]:{[`${n}:not(${n}-horizontal)`]:{[`${r}-col-md-24${n}-label`]:U(e)}}},[`@media (max-width: ${ee(e.screenLGMax)})`]:{[t]:{[`${n}:not(${n}-horizontal)`]:{[`${r}-col-lg-24${n}-label`]:U(e)}}}}},Yt=e=>{const{formItemCls:t,antCls:n}=e;return{[`${t}-vertical`]:{[`${t}-row`]:{flexDirection:"column"},[`${t}-label > label`]:{height:"auto"},[`${t}-control`]:{width:"100%"}},[`${t}-vertical ${t}-label,
      ${n}-col-24${t}-label,
      ${n}-col-xl-24${t}-label`]:U(e),[`@media (max-width: ${ee(e.screenXSMax)})`]:[Ae(e),{[t]:{[`${n}-col-xs-24${t}-label`]:U(e)}}],[`@media (max-width: ${ee(e.screenSMMax)})`]:{[t]:{[`${n}-col-sm-24${t}-label`]:U(e)}},[`@media (max-width: ${ee(e.screenMDMax)})`]:{[t]:{[`${n}-col-md-24${t}-label`]:U(e)}},[`@media (max-width: ${ee(e.screenLGMax)})`]:{[t]:{[`${n}-col-lg-24${t}-label`]:U(e)}}}},Qt=e=>({labelRequiredMarkColor:e.colorError,labelColor:e.colorTextHeading,labelFontSize:e.fontSize,labelHeight:e.controlHeight,labelColonMarginInlineStart:e.marginXXS/2,labelColonMarginInlineEnd:e.marginXS,itemMarginBottom:e.marginLG,verticalLabelPadding:`0 0 ${e.paddingXS}px`,verticalLabelMargin:0,inlineItemMarginBottom:0}),Be=(e,t)=>tt(e,{formItemCls:`${e.componentCls}-item`,rootPrefixCls:t}),Ce=Ze("Form",(e,t)=>{let{rootPrefixCls:n}=t;const r=Be(e,n);return[Xt(r),kt(r),At(r),Ne(r,r.componentCls),Ne(r,r.formItemCls),Gt(r),Kt(r),Yt(r),et(r),Le]},Qt,{order:-1e3}),Pe=[];function he(e,t,n){let r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:0;return{key:typeof e=="string"?e:`${t}-${r}`,error:e,errorStatus:n}}const Xe=e=>{let{help:t,helpStatus:n,errors:r=Pe,warnings:o=Pe,className:a,fieldId:i,onVisibleChanged:s}=e;const{prefixCls:u}=l.useContext(be),f=`${u}-item-explain`,w=ye(u),[p,M,L]=Ce(u,w),h=l.useMemo(()=>Se(u),[u]),v=me(r),b=me(o),y=l.useMemo(()=>t!=null?[he(t,"help",n)]:[].concat(Q(v.map((g,m)=>he(g,"error","error",m))),Q(b.map((g,m)=>he(g,"warning","warning",m)))),[t,n,v,b]),P=l.useMemo(()=>{const g={};return y.forEach(m=>{let{key:x}=m;g[x]=(g[x]||0)+1}),y.map((m,x)=>Object.assign(Object.assign({},m),{key:g[m.key]>1?`${m.key}-fallback-${x}`:m.key}))},[y]),c={};return i&&(c.id=`${i}_help`),p(l.createElement(nt,{motionDeadline:h.motionDeadline,motionName:`${u}-show-help`,visible:!!P.length,onVisibleChanged:s},g=>{const{className:m,style:x}=g;return l.createElement("div",Object.assign({},c,{className:ne(f,m,L,w,a,M),style:x}),l.createElement(rt,Object.assign({keys:P},Se(u),{motionName:`${u}-show-help-item`,component:!1}),R=>{const{key:S,error:E,errorStatus:j,className:z,style:D}=R;return l.createElement("div",{key:S,className:ne(z,{[`${f}-${j}`]:j}),style:D},E)}))}))},Ut=["parentNode"],Jt="form_item";function ie(e){return e===void 0||e===!1?[]:Array.isArray(e)?e:[e]}function ke(e,t){if(!e.length)return;const n=e.join("_");return t?`${t}_${n}`:Ut.includes(n)?`${Jt}_${n}`:n}function Ge(e,t,n,r,o,a){let i=r;return a!==void 0?i=a:n.validating?i="validating":e.length?i="error":t.length?i="warning":(n.touched||o&&n.validated)&&(i="success"),i}var Zt=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n};function Re(e){return ie(e).join("_")}function _e(e,t){const n=t.getFieldInstance(e),r=lt(n);if(r)return r;const o=ke(ie(e),t.__INTERNAL__.name);if(o)return document.getElementById(o)}function Ke(e){const[t]=ot(),n=l.useRef({}),r=l.useMemo(()=>e??Object.assign(Object.assign({},t),{__INTERNAL__:{itemRef:o=>a=>{const i=Re(o);a?n.current[i]=a:delete n.current[i]}},scrollToField:function(o){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{focus:i}=a,s=Zt(a,["focus"]),u=_e(o,r);u&&(qt(u,Object.assign({scrollMode:"if-needed",block:"nearest"},s)),i&&r.focusField(o))},focusField:o=>{var a,i;const s=r.getFieldInstance(o);typeof(s==null?void 0:s.focus)=="function"?s.focus():(i=(a=_e(o,r))===null||a===void 0?void 0:a.focus)===null||i===void 0||i.call(a)},getFieldInstance:o=>{const a=Re(o);return n.current[a]}}),[e,t]);return[r]}var en=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n};const tn=(e,t)=>{const n=l.useContext(at),{getPrefixCls:r,direction:o,requiredMark:a,colon:i,scrollToFirstError:s,className:u,style:f}=it("form"),{prefixCls:w,className:p,rootClassName:M,size:L,disabled:h=n,form:v,colon:b,labelAlign:y,labelWrap:P,labelCol:c,wrapperCol:g,hideRequiredMark:m,layout:x="horizontal",scrollToFirstError:R,requiredMark:S,onFinishFailed:E,name:j,style:z,feedbackIcons:D,variant:N}=e,C=en(e,["prefixCls","className","rootClassName","size","disabled","form","colon","labelAlign","labelWrap","labelCol","wrapperCol","hideRequiredMark","layout","scrollToFirstError","requiredMark","onFinishFailed","name","style","feedbackIcons","variant"]),q=st(L),T=l.useContext(ct),d=l.useMemo(()=>S!==void 0?S:m?!1:a!==void 0?a:!0,[m,S,a]),H=b??i,O=r("form",w),B=ye(O),[K,Y,J]=Ce(O,B),oe=ne(O,`${O}-${x}`,{[`${O}-hide-required-mark`]:d===!1,[`${O}-rtl`]:o==="rtl",[`${O}-${q}`]:q},J,B,Y,u,p,M),[X]=Ke(v),{__INTERNAL__:k}=X;k.name=j;const I=l.useMemo(()=>({name:j,labelAlign:y,labelCol:c,labelWrap:P,wrapperCol:g,vertical:x==="vertical",colon:H,requiredMark:d,itemRef:k.itemRef,form:X,feedbackIcons:D}),[j,y,c,g,x,H,d,X,D]),_=l.useRef(null);l.useImperativeHandle(t,()=>{var F;return Object.assign(Object.assign({},X),{nativeElement:(F=_.current)===null||F===void 0?void 0:F.nativeElement})});const $=(F,A)=>{if(F){let G={block:"nearest"};typeof F=="object"&&(G=Object.assign(Object.assign({},G),F)),X.scrollToField(A,G)}},W=F=>{if(E==null||E(F),F.errorFields.length){const A=F.errorFields[0].name;if(R!==void 0){$(R,A);return}s!==void 0&&$(s,A)}};return K(l.createElement(ut.Provider,{value:N},l.createElement(dt,{disabled:h},l.createElement(mt.Provider,{value:q},l.createElement(He,{validateMessages:T},l.createElement(re.Provider,{value:I},l.createElement(ft,Object.assign({id:j},C,{name:j,onFinishFailed:W,form:X,ref:_,style:Object.assign(Object.assign({},f),z),className:oe}))))))))},nn=l.forwardRef(tn);function rn(e){if(typeof e=="function")return e;const t=gt(e);return t.length<=1?t[0]:t}const Ye=()=>{const{status:e,errors:t=[],warnings:n=[]}=l.useContext(de);return{status:e,errors:t,warnings:n}};Ye.Context=de;function on(e){const[t,n]=l.useState(e),r=l.useRef(null),o=l.useRef([]),a=l.useRef(!1);l.useEffect(()=>(a.current=!1,()=>{a.current=!0,Ie.cancel(r.current),r.current=null}),[]);function i(s){a.current||(r.current===null&&(o.current=[],r.current=Ie(()=>{r.current=null,n(u=>{let f=u;return o.current.forEach(w=>{f=w(f)}),f})})),o.current.push(s))}return[t,i]}function ln(){const{itemRef:e}=l.useContext(re),t=l.useRef({});function n(r,o){const a=o&&typeof o=="object"&&pt(o),i=r.join("_");return(t.current.name!==i||t.current.originRef!==a)&&(t.current.name=i,t.current.originRef=a,t.current.ref=ht(e(r),a)),t.current.ref}return n}const an=e=>{const{formItemCls:t}=e;return{"@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)":{[`${t}-control`]:{display:"flex"}}}},sn=bt(["Form","item-item"],(e,t)=>{let{rootPrefixCls:n}=t;const r=Be(e,n);return[an(r)]});var cn=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n};const un=24,dn=e=>{const{prefixCls:t,status:n,labelCol:r,wrapperCol:o,children:a,errors:i,warnings:s,_internalItemRender:u,extra:f,help:w,fieldId:p,marginBottom:M,onErrorVisibleChanged:L,label:h}=e,v=`${t}-item`,b=l.useContext(re),y=l.useMemo(()=>{let C=Object.assign({},o||b.wrapperCol||{});return h===null&&!r&&!o&&b.labelCol&&[void 0,"xs","sm","md","lg","xl","xxl"].forEach(T=>{const d=T?[T]:[],H=Oe(b.labelCol,d),O=typeof H=="object"?H:{},B=Oe(C,d),K=typeof B=="object"?B:{};"span"in O&&!("offset"in K)&&O.span<un&&(C=yt(C,[].concat(d,["offset"]),O.span))}),C},[o,b]),P=ne(`${v}-control`,y.className),c=l.useMemo(()=>{const{labelCol:C,wrapperCol:q}=b;return cn(b,["labelCol","wrapperCol"])},[b]),g=l.useRef(null),[m,x]=l.useState(0);We(()=>{f&&g.current?x(g.current.clientHeight):x(0)},[f]);const R=l.createElement("div",{className:`${v}-control-input`},l.createElement("div",{className:`${v}-control-input-content`},a)),S=l.useMemo(()=>({prefixCls:t,status:n}),[t,n]),E=M!==null||i.length||s.length?l.createElement(be.Provider,{value:S},l.createElement(Xe,{fieldId:p,errors:i,warnings:s,help:w,helpStatus:n,className:`${v}-explain-connected`,onVisibleChanged:L})):null,j={};p&&(j.id=`${p}_extra`);const z=f?l.createElement("div",Object.assign({},j,{className:`${v}-extra`,ref:g}),f):null,D=E||z?l.createElement("div",{className:`${v}-additional`,style:M?{minHeight:M+m}:{}},E,z):null,N=u&&u.mark==="pro_table_render"&&u.render?u.render(e,{input:R,errorList:E,extra:z}):l.createElement(l.Fragment,null,R,D);return l.createElement(re.Provider,{value:c},l.createElement(ze,Object.assign({},y,{className:P}),N),l.createElement(sn,{prefixCls:t}))};var mn={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"}},{tag:"path",attrs:{d:"M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"question-circle",theme:"outlined"},fn=function(t,n){return l.createElement(Ct,vt({},t,{ref:n,icon:mn}))},gn=l.forwardRef(fn),pn=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n};function hn(e){return e?typeof e=="object"&&!l.isValidElement(e)?e:{title:e}:null}const bn=e=>{let{prefixCls:t,label:n,htmlFor:r,labelCol:o,labelAlign:a,colon:i,required:s,requiredMark:u,tooltip:f,vertical:w}=e;var p;const[M]=xt("Form"),{labelAlign:L,labelCol:h,labelWrap:v,colon:b}=l.useContext(re);if(!n)return null;const y=o||h||{},P=a||L,c=`${t}-item-label`,g=ne(c,P==="left"&&`${c}-left`,y.className,{[`${c}-wrap`]:!!v});let m=n;const x=i===!0||b!==!1&&i!==!1;x&&!w&&typeof n=="string"&&n.trim()&&(m=n.replace(/[:|：]\s*$/,""));const S=hn(f);if(S){const{icon:C=l.createElement(gn,null)}=S,q=pn(S,["icon"]),T=l.createElement($t,Object.assign({},q),l.cloneElement(C,{className:`${t}-item-tooltip`,title:"",onClick:d=>{d.preventDefault()},tabIndex:null}));m=l.createElement(l.Fragment,null,m,T)}const E=u==="optional",j=typeof u=="function",z=u===!1;j?m=u(m,{required:!!s}):E&&!s&&(m=l.createElement(l.Fragment,null,m,l.createElement("span",{className:`${t}-item-optional`,title:""},(M==null?void 0:M.optional)||((p=wt.Form)===null||p===void 0?void 0:p.optional))));let D;z?D="hidden":(E||j)&&(D="optional");const N=ne({[`${t}-item-required`]:s,[`${t}-item-required-mark-${D}`]:D,[`${t}-item-no-colon`]:!x});return l.createElement(ze,Object.assign({},y,{className:g}),l.createElement("label",{htmlFor:r,className:N,title:typeof n=="string"?n:""},m))},yn={success:Ht,warning:It,error:Wt,validating:St};function Qe(e){let{children:t,errors:n,warnings:r,hasFeedback:o,validateStatus:a,prefixCls:i,meta:s,noStyle:u}=e;const f=`${i}-item`,{feedbackIcons:w}=l.useContext(re),p=Ge(n,r,s,null,!!o,a),{isFormItemInput:M,status:L,hasFeedback:h,feedbackIcon:v}=l.useContext(de),b=l.useMemo(()=>{var y;let P;if(o){const g=o!==!0&&o.icons||w,m=p&&((y=g==null?void 0:g({status:p,errors:n,warnings:r}))===null||y===void 0?void 0:y[p]),x=p&&yn[p];P=m!==!1&&x?l.createElement("span",{className:ne(`${f}-feedback-icon`,`${f}-feedback-icon-${p}`)},m||l.createElement(x,null)):null}const c={status:p||"",errors:n,warnings:r,hasFeedback:!!o,feedbackIcon:P,isFormItemInput:!0};return u&&(c.status=(p??L)||"",c.isFormItemInput=M,c.hasFeedback=!!(o??h),c.feedbackIcon=o!==void 0?c.feedbackIcon:v),c},[p,o,u,M,L]);return l.createElement(de.Provider,{value:b},t)}var Cn=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n};function vn(e){const{prefixCls:t,className:n,rootClassName:r,style:o,help:a,errors:i,warnings:s,validateStatus:u,meta:f,hasFeedback:w,hidden:p,children:M,fieldId:L,required:h,isRequired:v,onSubItemMetaChange:b,layout:y}=e,P=Cn(e,["prefixCls","className","rootClassName","style","help","errors","warnings","validateStatus","meta","hasFeedback","hidden","children","fieldId","required","isRequired","onSubItemMetaChange","layout"]),c=`${t}-item`,{requiredMark:g,vertical:m}=l.useContext(re),x=m||y==="vertical",R=l.useRef(null),S=me(i),E=me(s),j=a!=null,z=!!(j||i.length||s.length),D=!!R.current&&Ot(R.current),[N,C]=l.useState(null);We(()=>{if(z&&R.current){const O=getComputedStyle(R.current);C(parseInt(O.marginBottom,10))}},[z,D]);const q=O=>{O||C(null)},d=function(){let O=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1;const B=O?S:f.errors,K=O?E:f.warnings;return Ge(B,K,f,"",!!w,u)}(),H=ne(c,n,r,{[`${c}-with-help`]:j||S.length||E.length,[`${c}-has-feedback`]:d&&w,[`${c}-has-success`]:d==="success",[`${c}-has-warning`]:d==="warning",[`${c}-has-error`]:d==="error",[`${c}-is-validating`]:d==="validating",[`${c}-hidden`]:p,[`${c}-${y}`]:y});return l.createElement("div",{className:H,style:o,ref:R},l.createElement(Et,Object.assign({className:`${c}-row`},Ft(P,["_internalItemRender","colon","dependencies","extra","fieldKey","getValueFromEvent","getValueProps","htmlFor","id","initialValue","isListField","label","labelAlign","labelCol","labelWrap","messageVariables","name","normalize","noStyle","preserve","requiredMark","rules","shouldUpdate","trigger","tooltip","validateFirst","validateTrigger","valuePropName","wrapperCol","validateDebounce"])),l.createElement(bn,Object.assign({htmlFor:L},e,{requiredMark:g,required:h??v,prefixCls:t,vertical:x})),l.createElement(dn,Object.assign({},e,f,{errors:S,warnings:E,prefixCls:t,status:d,help:a,marginBottom:N,onErrorVisibleChanged:q}),l.createElement(De.Provider,{value:b},l.createElement(Qe,{prefixCls:t,meta:f,errors:f.errors,warnings:f.warnings,hasFeedback:w,validateStatus:d},M)))),!!N&&l.createElement("div",{className:`${c}-margin-offset`,style:{marginBottom:-N}}))}const xn="__SPLIT__";function $n(e,t){const n=Object.keys(e),r=Object.keys(t);return n.length===r.length&&n.every(o=>{const a=e[o],i=t[o];return a===i||typeof a=="function"||typeof i=="function"})}const wn=l.memo(e=>{let{children:t}=e;return t},(e,t)=>$n(e.control,t.control)&&e.update===t.update&&e.childProps.length===t.childProps.length&&e.childProps.every((n,r)=>n===t.childProps[r]));function Ve(){return{errors:[],warnings:[],touched:!1,validating:!1,name:[],validated:!1}}function Sn(e){const{name:t,noStyle:n,className:r,dependencies:o,prefixCls:a,shouldUpdate:i,rules:s,children:u,required:f,label:w,messageVariables:p,trigger:M="onChange",validateTrigger:L,hidden:h,help:v,layout:b}=e,{getPrefixCls:y}=l.useContext(qe),{name:P}=l.useContext(re),c=rn(u),g=typeof c=="function",m=l.useContext(De),{validateTrigger:x}=l.useContext(Mt),R=L!==void 0?L:x,S=t!=null,E=y("form",a),j=ye(E),[z,D,N]=Ce(E,j);jt();const C=l.useContext(Nt),q=l.useRef(null),[T,d]=on({}),[H,O]=Pt(()=>Ve()),B=I=>{const _=C==null?void 0:C.getKey(I.name);if(O(I.destroy?Ve():I,!0),n&&v!==!1&&m){let $=I.name;if(I.destroy)$=q.current||$;else if(_!==void 0){const[W,F]=_;$=[W].concat(Q(F)),q.current=$}m(I,$)}},K=(I,_)=>{d($=>{const W=Object.assign({},$),A=[].concat(Q(I.name.slice(0,-1)),Q(_)).join(xn);return I.destroy?delete W[A]:W[A]=I,W})},[Y,J]=l.useMemo(()=>{const I=Q(H.errors),_=Q(H.warnings);return Object.values(T).forEach($=>{I.push.apply(I,Q($.errors||[])),_.push.apply(_,Q($.warnings||[]))}),[I,_]},[T,H.errors,H.warnings]),oe=ln();function X(I,_,$){return n&&!h?l.createElement(Qe,{prefixCls:E,hasFeedback:e.hasFeedback,validateStatus:e.validateStatus,meta:H,errors:Y,warnings:J,noStyle:!0},I):l.createElement(vn,Object.assign({key:"row"},e,{className:ne(r,N,j,D),prefixCls:E,fieldId:_,isRequired:$,errors:Y,warnings:J,meta:H,onSubItemMetaChange:K,layout:b}),I)}if(!S&&!g&&!o)return z(X(c));let k={};return typeof w=="string"?k.label=w:t&&(k.label=String(t)),p&&(k=Object.assign(Object.assign({},k),p)),z(l.createElement(Rt,Object.assign({},e,{messageVariables:k,trigger:M,validateTrigger:R,onMetaChange:B}),(I,_,$)=>{const W=ie(t).length&&_?_.name:[],F=ke(W,P),A=f!==void 0?f:!!(s!=null&&s.some(V=>{if(V&&typeof V=="object"&&V.required&&!V.warningOnly)return!0;if(typeof V=="function"){const Z=V($);return(Z==null?void 0:Z.required)&&!(Z!=null&&Z.warningOnly)}return!1})),G=Object.assign({},I);let te=null;if(Array.isArray(c)&&S)te=c;else if(!(g&&(!(i||o)||S))){if(!(o&&!g&&!S))if(l.isValidElement(c)){const V=Object.assign(Object.assign({},c.props),G);if(V.id||(V.id=F),v||Y.length>0||J.length>0||e.extra){const ae=[];(v||Y.length>0)&&ae.push(`${F}_help`),e.extra&&ae.push(`${F}_extra`),V["aria-describedby"]=ae.join(" ")}Y.length>0&&(V["aria-invalid"]="true"),A&&(V["aria-required"]="true"),_t(c)&&(V.ref=oe(W,c)),new Set([].concat(Q(ie(M)),Q(ie(R)))).forEach(ae=>{V[ae]=function(){for(var ve,xe,fe,$e,ge,we=arguments.length,pe=new Array(we),se=0;se<we;se++)pe[se]=arguments[se];(fe=G[ae])===null||fe===void 0||(ve=fe).call.apply(ve,[G].concat(pe)),(ge=($e=c.props)[ae])===null||ge===void 0||(xe=ge).call.apply(xe,[$e].concat(pe))}});const Je=[V["aria-required"],V["aria-invalid"],V["aria-describedby"]];te=l.createElement(wn,{control:G,update:c,childProps:Je},Vt(c,V))}else g&&(i||o)&&!S?te=c($):te=c}return X(te,F,A)}))}const Ue=Sn;Ue.useStatus=Ye;var In=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n};const On=e=>{var{prefixCls:t,children:n}=e,r=In(e,["prefixCls","children"]);const{getPrefixCls:o}=l.useContext(qe),a=o("form",t),i=l.useMemo(()=>({prefixCls:a,status:"error"}),[a]);return l.createElement(Lt,Object.assign({},r),(s,u,f)=>l.createElement(be.Provider,{value:i},n(s.map(w=>Object.assign(Object.assign({},w),{fieldKey:w.key})),u,{errors:f.errors,warnings:f.warnings})))};function En(){const{form:e}=l.useContext(re);return e}const le=nn;le.Item=Ue;le.List=On;le.ErrorList=Xe;le.useForm=Ke;le.useFormInstance=En;le.useWatch=Tt;le.Provider=He;le.create=()=>{};export{le as F};
