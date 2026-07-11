import{j as e}from"./jsx-runtime-BO8uF4Og.js";import{r as c}from"./index-D4H_InIO.js";import{B as d}from"./Tag-CpkKkHYO.js";const z={title:"Components/Button",component:d,args:{kind:"Primary",size:"MD",state:"Default",label:"Button"}},S=["Primary","Secondary","Tertiary"],m=["SM","MD","LG"],$=["Default","Pressed","Disabled"],r={},n={render:t=>{const[s,a]=c.useState(!1),[k,l]=c.useState(!1),M=t.state==="Disabled"?"Disabled":s?"Pressed":"Default";return e.jsx(d,{...t,focusVisible:k,state:M,onBlur:()=>l(!1),onFocus:()=>l(!0),onMouseDown:()=>a(!0),onMouseLeave:()=>a(!1),onMouseUp:()=>a(!1)})}},o={render:()=>e.jsx("div",{className:"story-page stack",children:S.map(t=>e.jsxs("section",{className:"section-card",children:[e.jsx("h2",{children:t}),e.jsx("p",{children:"Kind x size x state matrix from the Figma button board."}),e.jsxs("div",{className:"matrix matrix--buttons",children:[e.jsx("div",{}),m.map(s=>e.jsx("div",{className:"matrix-header",children:s},s)),$.map(s=>e.jsxs(c.Fragment,{children:[e.jsx("div",{className:"matrix-row-label",children:s},`${t}-${s}-label`),m.map(a=>e.jsx("div",{className:"matrix-cell",children:e.jsx(d,{kind:t,size:a,state:s})},`${t}-${s}-${a}`))]},`${t}-${s}`))]})]},t))})},i={args:{kind:"Primary",size:"MD",state:"Default",showLeftIcon:!0,showRightIcon:!0}};var u,p,x;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:"{}",...(x=(p=r.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var f,h,g;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => {
    const [pressed, setPressed] = useState(false);
    const [focused, setFocused] = useState(false);
    const state: ButtonState = args.state === "Disabled" ? "Disabled" : pressed ? "Pressed" : "Default";
    return <Button {...args} focusVisible={focused} state={state} onBlur={() => setFocused(false)} onFocus={() => setFocused(true)} onMouseDown={() => setPressed(true)} onMouseLeave={() => setPressed(false)} onMouseUp={() => setPressed(false)} />;
  }
}`,...(g=(h=n.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var v,b,y;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="story-page stack">
      {kinds.map(kind => <section className="section-card" key={kind}>
          <h2>{kind}</h2>
          <p>Kind x size x state matrix from the Figma button board.</p>
          <div className="matrix matrix--buttons">
            <div />
            {sizes.map(size => <div className="matrix-header" key={size}>
                {size}
              </div>)}
            {states.map(state => <Fragment key={\`\${kind}-\${state}\`}>
                <div className="matrix-row-label" key={\`\${kind}-\${state}-label\`}>
                  {state}
                </div>
                {sizes.map(size => <div className="matrix-cell" key={\`\${kind}-\${state}-\${size}\`}>
                    <Button kind={kind} size={size} state={state} />
                  </div>)}
              </Fragment>)}
          </div>
        </section>)}
    </div>
}`,...(y=(b=o.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var D,j,P;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    kind: "Primary",
    size: "MD",
    state: "Default",
    showLeftIcon: true,
    showRightIcon: true
  }
}`,...(P=(j=i.parameters)==null?void 0:j.docs)==null?void 0:P.source}}};const N=["Playground","Interactive","Matrix","WithIcons"],w=Object.freeze(Object.defineProperty({__proto__:null,Interactive:n,Matrix:o,Playground:r,WithIcons:i,__namedExportsOrder:N,default:z},Symbol.toStringTag,{value:"Module"}));export{w as B,n as I,o as M,r as P};
