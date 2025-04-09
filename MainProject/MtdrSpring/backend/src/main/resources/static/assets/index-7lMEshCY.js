import{g as te,m as ne,r as re,u as p,p as ie,b as s,c as ae,I as S,_ as I,n as i,q as h,R as k,A as H,o as e,s as oe,P as N,B as j,T as le}from"./index-DP23-ShH.js";import{R as V}from"./UserOutlined-BZPcMu80.js";import{R as se}from"./CheckCircleFilled-DkmpHvXd.js";import{T as de,g as ce,s as pe}from"./utils-CRxaWtae.js";import{R as W,I as g,a as xe}from"./elements-CxsWTszO.js";import{a as he,C as ge,b as me,R as P}from"./index-DDCoMNaG.js";import"./useVariants-CQp05jwY.js";const fe=t=>{const{componentCls:n,sizePaddingEdgeHorizontal:r,colorSplit:a,lineWidth:o,textPaddingInline:y,orientationMargin:c,verticalMarginInline:x}=t;return{[n]:Object.assign(Object.assign({},re(t)),{borderBlockStart:`${p(o)} solid ${a}`,"&-vertical":{position:"relative",top:"-0.06em",display:"inline-block",height:"0.9em",marginInline:x,marginBlock:0,verticalAlign:"middle",borderTop:0,borderInlineStart:`${p(o)} solid ${a}`},"&-horizontal":{display:"flex",clear:"both",width:"100%",minWidth:"100%",margin:`${p(t.dividerHorizontalGutterMargin)} 0`},[`&-horizontal${n}-with-text`]:{display:"flex",alignItems:"center",margin:`${p(t.dividerHorizontalWithTextGutterMargin)} 0`,color:t.colorTextHeading,fontWeight:500,fontSize:t.fontSizeLG,whiteSpace:"nowrap",textAlign:"center",borderBlockStart:`0 ${a}`,"&::before, &::after":{position:"relative",width:"50%",borderBlockStart:`${p(o)} solid transparent`,borderBlockStartColor:"inherit",borderBlockEnd:0,transform:"translateY(50%)",content:"''"}},[`&-horizontal${n}-with-text-start`]:{"&::before":{width:`calc(${c} * 100%)`},"&::after":{width:`calc(100% - ${c} * 100%)`}},[`&-horizontal${n}-with-text-end`]:{"&::before":{width:`calc(100% - ${c} * 100%)`},"&::after":{width:`calc(${c} * 100%)`}},[`${n}-inner-text`]:{display:"inline-block",paddingBlock:0,paddingInline:y},"&-dashed":{background:"none",borderColor:a,borderStyle:"dashed",borderWidth:`${p(o)} 0 0`},[`&-horizontal${n}-with-text${n}-dashed`]:{"&::before, &::after":{borderStyle:"dashed none none"}},[`&-vertical${n}-dashed`]:{borderInlineStartWidth:o,borderInlineEnd:0,borderBlockStart:0,borderBlockEnd:0},"&-dotted":{background:"none",borderColor:a,borderStyle:"dotted",borderWidth:`${p(o)} 0 0`},[`&-horizontal${n}-with-text${n}-dotted`]:{"&::before, &::after":{borderStyle:"dotted none none"}},[`&-vertical${n}-dotted`]:{borderInlineStartWidth:o,borderInlineEnd:0,borderBlockStart:0,borderBlockEnd:0},[`&-plain${n}-with-text`]:{color:t.colorText,fontWeight:"normal",fontSize:t.fontSize},[`&-horizontal${n}-with-text-start${n}-no-default-orientation-margin-start`]:{"&::before":{width:0},"&::after":{width:"100%"},[`${n}-inner-text`]:{paddingInlineStart:r}},[`&-horizontal${n}-with-text-end${n}-no-default-orientation-margin-end`]:{"&::before":{width:"100%"},"&::after":{width:0},[`${n}-inner-text`]:{paddingInlineEnd:r}}})}},be=t=>({textPaddingInline:"1em",orientationMargin:.05,verticalMarginInline:t.marginXS}),ue=te("Divider",t=>{const n=ne(t,{dividerHorizontalWithTextGutterMargin:t.margin,dividerHorizontalGutterMargin:t.marginLG,sizePaddingEdgeHorizontal:0});return[fe(n)]},be,{unitless:{orientationMargin:!0}});var je=function(t,n){var r={};for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&n.indexOf(a)<0&&(r[a]=t[a]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,a=Object.getOwnPropertySymbols(t);o<a.length;o++)n.indexOf(a[o])<0&&Object.prototype.propertyIsEnumerable.call(t,a[o])&&(r[a[o]]=t[a[o]]);return r};const ye=t=>{const{getPrefixCls:n,direction:r,className:a,style:o}=ie("divider"),{prefixCls:y,type:c="horizontal",orientation:x="center",orientationMargin:d,className:L,rootClassName:J,children:v,dashed:_,variant:D="solid",plain:U,style:q}=t,X=je(t,["prefixCls","type","orientation","orientationMargin","className","rootClassName","children","dashed","variant","plain","style"]),l=n("divider",y),[Y,K,Q]=ue(l),z=!!v,w=s.useMemo(()=>x==="left"?r==="rtl"?"end":"start":x==="right"?r==="rtl"?"start":"end":x,[r,x]),E=w==="start"&&d!=null,F=w==="end"&&d!=null,Z=ae(l,a,K,Q,`${l}-${c}`,{[`${l}-with-text`]:z,[`${l}-with-text-${w}`]:z,[`${l}-dashed`]:!!_,[`${l}-${D}`]:D!=="solid",[`${l}-plain`]:!!U,[`${l}-rtl`]:r==="rtl",[`${l}-no-default-orientation-margin-start`]:E,[`${l}-no-default-orientation-margin-end`]:F},L,J),R=s.useMemo(()=>typeof d=="number"?d:/^\d+$/.test(d)?Number(d):d,[d]),ee={marginInlineStart:E?R:void 0,marginInlineEnd:F?R:void 0};return Y(s.createElement("div",Object.assign({className:Z,style:Object.assign(Object.assign({},o),q)},X,{role:"separator"}),v&&c!=="vertical"&&s.createElement("span",{className:`${l}-inner-text`,style:ee},v)))};var ve={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M834.1 469.2A347.49 347.49 0 00751.2 354l-29.1-26.7a8.09 8.09 0 00-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 01-47.5 46.1 352.6 352.6 0 00-100.3 121.5A347.75 347.75 0 00160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0075.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 00760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0027.7-136c0-48.8-10-96.2-29.9-140.9z"}}]},name:"fire",theme:"filled"},we=function(n,r){return s.createElement(S,I({},n,{ref:r,icon:ve}))},Ce=s.forwardRef(we),$e={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 00-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zm-180 0H238c-13 0-24.8 7.9-29.7 20L136 643.2V256h188.5l119.6 114.4H748V444z"}}]},name:"folder-open",theme:"filled"},Se=function(n,r){return s.createElement(S,I({},n,{ref:r,icon:$e}))},Ie=s.forwardRef(Se),ke={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm192 472c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48z"}}]},name:"plus-circle",theme:"filled"},De=function(n,r){return s.createElement(S,I({},n,{ref:r,icon:ke}))},ze=s.forwardRef(De);const Ee=i.div`
  height: 100%;
  width: 100%;
  padding: 20px;
`,T=i(h)`
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
`,Fe=i.div`
  flex: 1;
  margin-right: 20px;

  h1 {
    margin-bottom: 5px;
    font-size: 24px;
    color: #1f2937;
  }

  p {
    margin: 0;
    color: #4b5563;
    font-size: 16px;
    word-break: break-word;
  }
  @media only screen and (max-width: 600px) {
    p {
      display: none;
    }
  }
`,Re=i.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-top: auto;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`,Pe=i.div`
  padding: 40px 40px 20px;

  @media (max-width: 768px) {
    padding: 20px 10px 0px;
  }
`,Te=i.div`
  display: flex;
  width: 70%;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`,Be=i.div`
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
`,Ae=i.h3`
  margin-bottom: 16px;
`,C=i.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`,$=i.span`
  color: #6b7280;
  font-size: 12px;
`,B=i.span``,A=i.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,Me=i(H).attrs({icon:k.createElement(V)})`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-bottom: 12px;
  background-color: #c74634;
`,M=i.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({bgColor:t})=>t||"#e6ffed"};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
`,Oe=[{title:"Project Details",rows:[{label:"Start Date",value:"Feb 1, 2025"},{label:"End Date",value:"Apr 30, 2025"},{label:"Project Lead",value:"Sarah Johnson",image:"https://via.placeholder.com/32",alt:"Sarah Johnson"}]},{title:"Team Members",rows:[{value:"Alex Thompson",label:"UI Designer",image:"https://via.placeholder.com/32",alt:"Alex Thompson"},{value:"Maria Garcia",label:"Frontend Dev",image:"https://via.placeholder.com/32",alt:"Maria Garcia"},{value:"John Baker",label:"Backend Dev",image:"https://via.placeholder.com/32",alt:"John Baker"}]},{title:"Recent Activity",rows:[{type:"Completed",value:"Task completed: Homepage Design",secondValue:"2 hours ago"},{type:"New",value:"New task added to Sprint 2",secondValue:"4 hours ago"}]}],He=t=>{switch(t){case"Completed":return e.jsx(M,{bgColor:"#DBEAFE",children:e.jsx(se,{style:{color:"#2563EB",fontSize:"18px"}})});case"New":return e.jsx(M,{bgColor:"#D1FAE5",children:e.jsx(ze,{style:{color:"#059669",fontSize:"18px"}})});default:return null}},Ne=()=>e.jsx(Be,{children:Oe.map((t,n)=>e.jsxs(k.Fragment,{children:[e.jsx(Ae,{children:t.title}),t.rows.map((r,a)=>e.jsxs(C,{children:[r.label&&!r.image&&e.jsx($,{children:r.label}),r.image?e.jsxs(A,{children:[e.jsx(Me,{src:r.image,alt:r.alt||r.value}),e.jsxs(C,{children:[e.jsx(B,{children:r.value}),r.label&&e.jsx($,{children:r.label})]})]}):e.jsx(e.Fragment,{children:e.jsxs(A,{children:[r.type&&He(r.type),e.jsxs(C,{children:[e.jsx(B,{children:r.value}),r.secondValue&&e.jsx($,{children:r.secondValue})]})]})})]},a))]},n))}),Ve=i.div`
  width: 100%;
  height: fit-content;
  background-color: rgb(255, 255, 255);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 13px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`,We=i(h)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,O=i(H).attrs({icon:k.createElement(V)})`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #c74634;
`,Ge=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 12px 0px 12px 12px;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    background-color: #f3f4f6;
  }
`,Le=i(de)`
  border-radius: 4px;
  border: none;
  padding: 5px 14px;
  height: fit-content;

  @media (max-width: 600px) {
    display: none;
  }
`,Je=i.p`
  margin: 0;
  color: #6b7280;

  @media (max-width: 600px) {
    display: none;
  }
`,_e=i.p`
  margin-top: 0;
  margin-right: 10px;

  color: #6b7280;

  @media (min-width: 601px) {
    display: none;
  }
`,Ue=window.innerWidth<=600,G=e.jsxs("div",{children:[e.jsx("p",{children:"Content"}),e.jsx("p",{children:"Content"})]}),qe=t=>{let n,r="black";switch(t){case"Design":n="#DBEAFE",r="#1E40AF";break;case"Development":n="#EDE9FE",r="#5B21B6";break;case"Backend":n="#D1FAE5",r="#065F46";break;case"Database":n="#FFEDD5",r="#9A3412";break;default:n="gray"}return e.jsx(Le,{color:n,children:e.jsx("p",{style:{color:r,fontSize:"12px",margin:0},children:t})})},Xe=({title:t,category:n,picture:r})=>e.jsxs(Ge,{children:[e.jsxs(h,{style:{display:"flex",gap:"10px"},children:[e.jsx(he,{}),e.jsx(le,{title:t,placement:"topLeft",children:e.jsx("h4",{style:{margin:0},children:pe(t,Ue?3:9)})})]}),e.jsxs(h,{style:{display:"flex",alignItems:"center",gap:"5px"},children:[qe(n),r?e.jsx(O,{src:r}):e.jsx(O,{}),e.jsx(N,{placement:"right",title:null,content:G,arrow:!1,trigger:"click",children:e.jsx(j,{style:{fontSize:"20px",color:"#9CA3AF"},type:"link",icon:e.jsx(W,{})})})]})]}),Ye=({sprint:t})=>e.jsxs(Ve,{children:[e.jsxs(We,{children:[e.jsxs(oe,{children:[e.jsx("h3",{style:{margin:0},children:t.name}),e.jsx(Je,{children:t.dateRange})]}),e.jsxs(h,{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx(_e,{children:t.dateRange}),ce("In Progress"),e.jsx(N,{placement:"right",title:null,content:G,arrow:!1,trigger:"click",children:e.jsx(j,{style:{fontSize:"24px",color:"#9CA3AF"},type:"link",icon:e.jsx(W,{})})})]})]}),e.jsx(ye,{style:{margin:"15px 0"}}),t.tasks.map((n,r)=>e.jsx(Xe,{title:n.title,category:n.category,picture:n.picture},r))]}),Ke=i.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en móviles */
    grid-gap: 10px;
  }
`,m=i(ge)`
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  height: 100px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 150px;
    height: 50px;
  }
`,f=i.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`,b=i.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 120px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: -10px;
  }
`,u=i.p`
  margin: 0;
  font-size: 24px;
  @media (max-width: 768px) {
    font-size: 16px;
    text-align: center;
    color: ${({color:t})=>t};
  }
`,Qe=()=>e.jsxs(Ke,{children:[e.jsx(m,{children:e.jsxs(f,{children:[e.jsx(g,{bgColor:"#ffe5e5",children:e.jsx(Ce,{style:{color:"#C74634",fontSize:"20px"}})}),e.jsxs(b,{children:[e.jsx("p",{style:{margin:0},children:"Active Sprints"}),e.jsx(u,{color:"#C74634",children:"3"})]})]})}),e.jsx(m,{children:e.jsxs(f,{children:[e.jsx(g,{bgColor:"#EDE9FE",children:e.jsx(Ie,{style:{color:"#7C3AED",fontSize:"20px"}})}),e.jsxs(b,{children:[e.jsx("p",{style:{margin:0},children:"Total Tasks"}),e.jsx(u,{color:"#7C3AED",children:"24"})]})]})}),e.jsx(m,{children:e.jsxs(f,{children:[e.jsx(g,{bgColor:"#D1FAE5",children:e.jsx(me,{style:{color:"#059669",fontSize:"20px"}})}),e.jsxs(b,{children:[e.jsx("p",{style:{margin:0},children:"Completed"}),e.jsx(u,{color:"#059669",children:"12"})]})]})}),e.jsx(m,{children:e.jsxs(f,{children:[e.jsx(g,{bgColor:"#FEF3C7",children:e.jsx(xe,{style:{color:"#D97706",fontSize:"20px"}})}),e.jsxs(b,{children:[e.jsx("p",{style:{margin:0},children:"In Progress"}),e.jsx(u,{color:"#D97706",children:"8"})]})]})})]}),Ze=[{name:"Sprint 1 - UI Implementation",dateRange:"Feb 1 - Feb 14, 2025",status:"In Progress",tasks:[{title:"Design Login Page lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",category:"Design",picture:"https://via.placeholder.com/32"},{title:"Develop API Endpoints",category:"Backend"}]},{name:"Sprint 2 - Feature Enhancement",dateRange:"Feb 15 - Mar 1, 2025",status:"To Do",tasks:[{title:"Improve Dashboard UI",category:"Development"},{title:"Database Schema Design",category:"Database",picture:"https://via.placeholder.com/32"}]}],lt=()=>e.jsxs(Ee,{children:[e.jsx(h,{children:e.jsx("a",{href:"projects",children:" Go Back"})}),e.jsxs(T,{children:[e.jsxs(Fe,{children:[e.jsx("h1",{children:"Project Dashboard"}),e.jsx("p",{children:"Sprint Planning and Task Management"})]}),e.jsxs(Re,{children:[e.jsx(j,{icon:e.jsx(P,{}),type:"primary",children:"New Sprint"}),e.jsx(j,{icon:e.jsx(P,{}),type:"primary",children:"New Task"})]})]}),e.jsx(Pe,{children:e.jsx(Qe,{})}),e.jsxs(T,{children:[e.jsx(Te,{children:Ze.map((t,n)=>e.jsx(Ye,{sprint:t},n))}),e.jsx(Ne,{})]})]});export{lt as default};
