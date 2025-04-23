import{b as i,I as r,_ as o,n as e,b1 as c}from"./index-DP23-ShH.js";import{C as l}from"./index-DDCoMNaG.js";var s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm176.5 585.7l-28.6 39a7.99 7.99 0 01-11.2 1.7L483.3 569.8a7.92 7.92 0 01-3.3-6.5V288c0-4.4 3.6-8 8-8h48.1c4.4 0 8 3.6 8 8v247.5l142.6 103.1c3.6 2.5 4.4 7.5 1.8 11.1z"}}]},name:"clock-circle",theme:"filled"},d=function(t,n){return i.createElement(r,o({},t,{ref:n,icon:s}))},h=i.forwardRef(d),p={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z"}}]},name:"more",theme:"outlined"},x=function(t,n){return i.createElement(r,o({},t,{ref:n,icon:p}))},u=i.forwardRef(x);const m=c`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`,w=e.div`
  background-color: ${({bgColor:a})=>a};
  padding: 8px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;

  /* Shine animation */
  background-image: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 70%,
    transparent 100%
  );
  background-size: 200% auto;
  animation: ${m} 2s linear infinite;

  @media (max-width: 768px) {
    display: none;
  }
`,b=e.div`
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
`,v=e(l)`
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  height: 100px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 150px;
    height: 50px;
  }
`,C=e.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`,y=e.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 120px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: -10px;
  }
`,k=e.p`
  margin: 0;
  font-size: 24px;
  @media (max-width: 768px) {
    font-size: 16px;
    text-align: center;
    color: ${({color:a})=>a};
  }
`;export{y as C,w as I,u as R,v as S,k as V,h as a,b,C as c};
