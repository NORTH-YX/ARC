import{R as e,j as n,B as i}from"./index-D-SPx7bG.js";import{d as o}from"./styled-components.browser.esm-UHWD35HB.js";import{R as a}from"./PlusOutlined-DizKficu.js";const d=o.div`
  height: 100%;
  width: 100%;
  padding: 20px;
`,s=o(e)`
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
`,c=o.div`
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
`,p=o.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-top: auto;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`,h=({user:t})=>{const r=(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="project_manager";return n.jsxs(d,{children:[n.jsx(e,{children:n.jsx("a",{href:"projects",children:" Go Back"})}),n.jsxs(s,{children:[n.jsxs(c,{children:[n.jsx("h1",{children:"Project Dashboard"}),n.jsxs("p",{children:["Sprint Planning and Task Management for ",(t==null?void 0:t.name)||"your"," projects"]})]}),r&&n.jsxs(p,{children:[n.jsx(i,{icon:n.jsx(a,{}),type:"primary",children:"New Sprint"}),n.jsx(i,{icon:n.jsx(a,{}),type:"primary",children:"New Task"})]})]})]})};export{h as default};
