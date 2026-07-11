import{j as e}from"./jsx-runtime-BO8uF4Og.js";import{r as j}from"./index-D4H_InIO.js";import{T as c}from"./Tag-CpkKkHYO.js";const D={title:"Components/Tag",component:c,args:{kind:"Neutral",variant:"Solid",state:"Default",label:"NEW"}},S=["Neutral","Primary","Positive","Warning","Negative","Info"],$=["Solid","Light","Outlined"],l=["Default","Disabled"],r={},s={args:{kind:"Primary",variant:"Solid",state:"Default",label:"NEW",showAction:!0},render:a=>{const[t,o]=j.useState(!0);return e.jsx(c,{...a,label:t?a.label:"DONE",role:"button",style:{cursor:a.state==="Disabled"?"not-allowed":"pointer"},tabIndex:a.state==="Disabled"?-1:0,onClick:()=>{a.state!=="Disabled"&&o(f=>!f)}})}},n={render:()=>e.jsx("div",{className:"story-page stack",children:S.map(a=>e.jsxs("section",{className:"section-card",children:[e.jsx("h2",{children:a}),e.jsx("p",{children:"Variant x state matrix matching the tag board."}),e.jsxs("div",{className:"matrix matrix--chip-tag",children:[e.jsx("div",{}),l.map(t=>e.jsx("div",{className:"matrix-header",children:t},t)),$.map(t=>e.jsxs(j.Fragment,{children:[e.jsx("div",{className:"matrix-row-label",children:t},`${a}-${t}-label`),l.map(o=>e.jsx("div",{className:"matrix-cell",children:e.jsx(c,{kind:a,variant:t,state:o})},`${a}-${t}-${o}`))]},`${a}-${t}`))]})]},a))})},i={args:{kind:"Primary",variant:"Solid",state:"Default",showAction:!0}};var d,m,p;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:"{}",...(p=(m=r.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,v,x;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    kind: "Primary",
    variant: "Solid",
    state: "Default",
    label: "NEW",
    showAction: true
  },
  render: args => {
    const [active, setActive] = useState(true);
    return <Tag {...args} label={active ? args.label : "DONE"} role="button" style={{
      cursor: args.state === "Disabled" ? "not-allowed" : "pointer"
    }} tabIndex={args.state === "Disabled" ? -1 : 0} onClick={() => {
      if (args.state !== "Disabled") {
        setActive(value => !value);
      }
    }} />;
  }
}`,...(x=(v=s.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var g,b,h;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="story-page stack">
      {kinds.map(kind => <section className="section-card" key={kind}>
          <h2>{kind}</h2>
          <p>Variant x state matrix matching the tag board.</p>
          <div className="matrix matrix--chip-tag">
            <div />
            {states.map(state => <div className="matrix-header" key={state}>
                {state}
              </div>)}
            {variants.map(variant => <Fragment key={\`\${kind}-\${variant}\`}>
                <div className="matrix-row-label" key={\`\${kind}-\${variant}-label\`}>
                  {variant}
                </div>
                {states.map(state => <div className="matrix-cell" key={\`\${kind}-\${variant}-\${state}\`}>
                    <Tag kind={kind} variant={variant} state={state} />
                  </div>)}
              </Fragment>)}
          </div>
        </section>)}
    </div>
}`,...(h=(b=n.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var N,k,y;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    kind: "Primary",
    variant: "Solid",
    state: "Default",
    showAction: true
  }
}`,...(y=(k=i.parameters)==null?void 0:k.docs)==null?void 0:y.source}}};const P=["Playground","Interactive","Matrix","WithAction"],T=Object.freeze(Object.defineProperty({__proto__:null,Interactive:s,Matrix:n,Playground:r,WithAction:i,__namedExportsOrder:P,default:D},Symbol.toStringTag,{value:"Module"}));export{s as I,n as M,r as P,T};
