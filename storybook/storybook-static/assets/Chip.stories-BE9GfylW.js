import{j as t}from"./jsx-runtime-BO8uF4Og.js";import{r as i}from"./index-D4H_InIO.js";import{C as c}from"./Tag-CpkKkHYO.js";const N={title:"Components/Chip",component:c,args:{type:"Assist",tone:"Neutral",state:"Default",label:"Chip"}},j=["Assist","Filter","Input"],C=["Neutral","Info","Positive","Warning","Negative"],d=["Default","Selected","Pressed","Disabled"],a={},r={args:{type:"Filter",tone:"Neutral",state:"Default",label:"Chip"},render:e=>{const[s,o]=i.useState(e.state==="Selected"),[y,l]=i.useState(!1),D=e.state==="Disabled"?"Disabled":y?"Pressed":s?"Selected":"Default";return t.jsx(c,{...e,role:"button",state:D,style:{cursor:e.state==="Disabled"?"not-allowed":"pointer"},tabIndex:e.state==="Disabled"?-1:0,onClick:()=>{e.state!=="Disabled"&&o(S=>!S)},onMouseDown:()=>e.state!=="Disabled"&&l(!0),onMouseLeave:()=>l(!1),onMouseUp:()=>l(!1)})}},n={render:()=>t.jsx("div",{className:"story-page stack",children:j.map(e=>t.jsxs("section",{className:"section-card",children:[t.jsx("h2",{children:e}),t.jsx("p",{children:"Tone x state matrix matching the chip component board."}),t.jsxs("div",{className:"matrix matrix--chip-tag",children:[t.jsx("div",{}),d.map(s=>t.jsx("div",{className:"matrix-header",children:s},s)),C.map(s=>t.jsxs(i.Fragment,{children:[t.jsx("div",{className:"matrix-row-label",children:s},`${e}-${s}-label`),d.map(o=>t.jsx("div",{className:"matrix-cell",children:t.jsx(c,{type:e,tone:s,state:o})},`${e}-${s}-${o}`))]},`${e}-${s}`))]})]},e))})};var p,m,u;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:"{}",...(u=(m=a.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var x,h,b;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    type: "Filter",
    tone: "Neutral",
    state: "Default",
    label: "Chip"
  },
  render: args => {
    const [selected, setSelected] = useState(args.state === "Selected");
    const [pressed, setPressed] = useState(false);
    const state: ChipState = args.state === "Disabled" ? "Disabled" : pressed ? "Pressed" : selected ? "Selected" : "Default";
    return <Chip {...args} role="button" state={state} style={{
      cursor: args.state === "Disabled" ? "not-allowed" : "pointer"
    }} tabIndex={args.state === "Disabled" ? -1 : 0} onClick={() => {
      if (args.state !== "Disabled") {
        setSelected(value => !value);
      }
    }} onMouseDown={() => args.state !== "Disabled" && setPressed(true)} onMouseLeave={() => setPressed(false)} onMouseUp={() => setPressed(false)} />;
  }
}`,...(b=(h=r.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var v,g,f;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="story-page stack">
      {types.map(type => <section className="section-card" key={type}>
          <h2>{type}</h2>
          <p>Tone x state matrix matching the chip component board.</p>
          <div className="matrix matrix--chip-tag">
            <div />
            {states.map(state => <div className="matrix-header" key={state}>
                {state}
              </div>)}
            {tones.map(tone => <Fragment key={\`\${type}-\${tone}\`}>
                <div className="matrix-row-label" key={\`\${type}-\${tone}-label\`}>
                  {tone}
                </div>
                {states.map(state => <div className="matrix-cell" key={\`\${type}-\${tone}-\${state}\`}>
                    <Chip type={type} tone={tone} state={state} />
                  </div>)}
              </Fragment>)}
          </div>
        </section>)}
    </div>
}`,...(f=(g=n.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};const $=["Playground","Interactive","Matrix"],I=Object.freeze(Object.defineProperty({__proto__:null,Interactive:r,Matrix:n,Playground:a,__namedExportsOrder:$,default:N},Symbol.toStringTag,{value:"Module"}));export{I as C,r as I,n as M,a as P};
