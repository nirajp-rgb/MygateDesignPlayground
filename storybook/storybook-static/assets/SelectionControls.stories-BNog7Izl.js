import{j as e}from"./jsx-runtime-BO8uF4Og.js";import{r}from"./index-D4H_InIO.js";import{a as R,R as P,S as U}from"./Tag-CpkKkHYO.js";const E={title:"Components/Selection Controls"},o=["Default","Pressed","Focused","Disabled"],l={render:()=>{const[n,t]=r.useState(!1),[a,s]=r.useState("Default");return e.jsx(R,{checked:n,label:"Email me updates",description:"Click to toggle and tab to inspect focus styling.",state:a,style:{cursor:"pointer"},tabIndex:0,onBlur:()=>s("Default"),onClick:()=>t(p=>!p),onFocus:()=>s("Focused"),onMouseDown:()=>s("Pressed"),onMouseUp:()=>s("Default")})}},c={render:()=>{const[n,t]=r.useState(!0),[a,s]=r.useState("Default");return e.jsx(P,{checked:n,label:"Primary option",description:"Shows click and focus behavior.",state:a,style:{cursor:"pointer"},tabIndex:0,onBlur:()=>s("Default"),onClick:()=>t(!0),onFocus:()=>s("Focused"),onMouseDown:()=>s("Pressed"),onMouseUp:()=>s("Default")})}},i={render:()=>{const[n,t]=r.useState("off"),[a,s]=r.useState("Default");return e.jsx(U,{value:n,label:"Allow notifications",description:"Click to toggle and tab to inspect focus styling.",state:a,style:{cursor:"pointer"},tabIndex:0,onBlur:()=>s("Default"),onClick:()=>t(p=>p==="off"?"on":"off"),onFocus:()=>s("Focused"),onMouseDown:()=>s("Pressed"),onMouseUp:()=>s("Default")})}},d={render:()=>{const n=[{label:"Unchecked",props:{checked:!1,indeterminate:!1,invalid:!1}},{label:"Checked",props:{checked:!0,indeterminate:!1,invalid:!1}},{label:"Indeterminate",props:{checked:!1,indeterminate:!0,invalid:!1}},{label:"Error",props:{checked:!0,indeterminate:!1,invalid:!0}}];return e.jsxs("section",{className:"section-card story-page",children:[e.jsx("h2",{children:"Checkbox"}),e.jsx("p",{children:"Selection state guidance adapted from the checkbox documentation board."}),e.jsxs("div",{className:"matrix matrix--controls",children:[e.jsx("div",{}),o.map(t=>e.jsx("div",{className:"matrix-header",children:t},t)),n.map(t=>e.jsxs(r.Fragment,{children:[e.jsx("div",{className:"matrix-row-label",children:t.label},`${t.label}-label`),o.map(a=>e.jsx("div",{className:"matrix-cell",children:e.jsx(R,{...t.props,state:a,label:"Label"})},`${t.label}-${a}`))]},t.label))]})]})}},u={render:()=>{const n=[{label:"Unselected",props:{checked:!1,invalid:!1}},{label:"Selected",props:{checked:!0,invalid:!1}},{label:"Error",props:{checked:!0,invalid:!0}}];return e.jsxs("section",{className:"section-card story-page",children:[e.jsx("h2",{children:"Radio"}),e.jsx("p",{children:"Selection x state matrix reflecting the radio guidance on the Figma page."}),e.jsxs("div",{className:"matrix matrix--controls",children:[e.jsx("div",{}),o.map(t=>e.jsx("div",{className:"matrix-header",children:t},t)),n.map(t=>e.jsxs(r.Fragment,{children:[e.jsx("div",{className:"matrix-row-label",children:t.label},`${t.label}-label`),o.map(a=>e.jsx("div",{className:"matrix-cell",children:e.jsx(P,{...t.props,state:a,label:"Label"})},`${t.label}-${a}`))]},t.label))]})]})}},m={render:()=>{const n=[{label:"Off",props:{value:"off"}},{label:"On",props:{value:"on"}}];return e.jsxs("section",{className:"section-card story-page",children:[e.jsx("h2",{children:"Switch"}),e.jsx("p",{children:"Value x state matrix based on the switch component documentation."}),e.jsxs("div",{className:"matrix matrix--controls",children:[e.jsx("div",{}),o.map(t=>e.jsx("div",{className:"matrix-header",children:t},t)),n.map(t=>e.jsxs(r.Fragment,{children:[e.jsx("div",{className:"matrix-row-label",children:t.label},`${t.label}-label`),o.map(a=>e.jsx("div",{className:"matrix-cell",children:e.jsx(U,{...t.props,state:a,label:"Switch label"})},`${t.label}-${a}`))]},t.label))]})]})}};var b,h,x;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    const [state, setState] = useState<(typeof controlStates)[number]>("Default");
    return <Checkbox checked={checked} label="Email me updates" description="Click to toggle and tab to inspect focus styling." state={state} style={{
      cursor: "pointer"
    }} tabIndex={0} onBlur={() => setState("Default")} onClick={() => setChecked(value => !value)} onFocus={() => setState("Focused")} onMouseDown={() => setState("Pressed")} onMouseUp={() => setState("Default")} />;
  }
}`,...(x=(h=l.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var f,v,S;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState(true);
    const [state, setState] = useState<(typeof controlStates)[number]>("Default");
    return <Radio checked={selected} label="Primary option" description="Shows click and focus behavior." state={state} style={{
      cursor: "pointer"
    }} tabIndex={0} onBlur={() => setState("Default")} onClick={() => setSelected(true)} onFocus={() => setState("Focused")} onMouseDown={() => setState("Pressed")} onMouseUp={() => setState("Default")} />;
  }
}`,...(S=(v=c.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var k,g,w;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<"off" | "on">("off");
    const [state, setState] = useState<(typeof controlStates)[number]>("Default");
    return <Switch value={value} label="Allow notifications" description="Click to toggle and tab to inspect focus styling." state={state} style={{
      cursor: "pointer"
    }} tabIndex={0} onBlur={() => setState("Default")} onClick={() => setValue(current => current === "off" ? "on" : "off")} onFocus={() => setState("Focused")} onMouseDown={() => setState("Pressed")} onMouseUp={() => setState("Default")} />;
  }
}`,...(w=(g=i.parameters)==null?void 0:g.docs)==null?void 0:w.source}}};var j,y,N;d.parameters={...d.parameters,docs:{...(j=d.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => {
    const rows = [{
      label: "Unchecked",
      props: {
        checked: false,
        indeterminate: false,
        invalid: false
      }
    }, {
      label: "Checked",
      props: {
        checked: true,
        indeterminate: false,
        invalid: false
      }
    }, {
      label: "Indeterminate",
      props: {
        checked: false,
        indeterminate: true,
        invalid: false
      }
    }, {
      label: "Error",
      props: {
        checked: true,
        indeterminate: false,
        invalid: true
      }
    }];
    return <section className="section-card story-page">
        <h2>Checkbox</h2>
        <p>Selection state guidance adapted from the checkbox documentation board.</p>
        <div className="matrix matrix--controls">
          <div />
          {controlStates.map(state => <div className="matrix-header" key={state}>
              {state}
            </div>)}
          {rows.map(row => <Fragment key={row.label}>
              <div className="matrix-row-label" key={\`\${row.label}-label\`}>
                {row.label}
              </div>
              {controlStates.map(state => <div className="matrix-cell" key={\`\${row.label}-\${state}\`}>
                  <Checkbox {...row.props} state={state} label="Label" />
                </div>)}
            </Fragment>)}
        </div>
      </section>;
  }
}`,...(N=(y=d.parameters)==null?void 0:y.docs)==null?void 0:N.source}}};var C,D,F;u.parameters={...u.parameters,docs:{...(C=u.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const rows = [{
      label: "Unselected",
      props: {
        checked: false,
        invalid: false
      }
    }, {
      label: "Selected",
      props: {
        checked: true,
        invalid: false
      }
    }, {
      label: "Error",
      props: {
        checked: true,
        invalid: true
      }
    }];
    return <section className="section-card story-page">
        <h2>Radio</h2>
        <p>Selection x state matrix reflecting the radio guidance on the Figma page.</p>
        <div className="matrix matrix--controls">
          <div />
          {controlStates.map(state => <div className="matrix-header" key={state}>
              {state}
            </div>)}
          {rows.map(row => <Fragment key={row.label}>
              <div className="matrix-row-label" key={\`\${row.label}-label\`}>
                {row.label}
              </div>
              {controlStates.map(state => <div className="matrix-cell" key={\`\${row.label}-\${state}\`}>
                  <Radio {...row.props} state={state} label="Label" />
                </div>)}
            </Fragment>)}
        </div>
      </section>;
  }
}`,...(F=(D=u.parameters)==null?void 0:D.docs)==null?void 0:F.source}}};var M,$,I;m.parameters={...m.parameters,docs:{...(M=m.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    const rows = [{
      label: "Off",
      props: {
        value: "off" as const
      }
    }, {
      label: "On",
      props: {
        value: "on" as const
      }
    }];
    return <section className="section-card story-page">
        <h2>Switch</h2>
        <p>Value x state matrix based on the switch component documentation.</p>
        <div className="matrix matrix--controls">
          <div />
          {controlStates.map(state => <div className="matrix-header" key={state}>
              {state}
            </div>)}
          {rows.map(row => <Fragment key={row.label}>
              <div className="matrix-row-label" key={\`\${row.label}-label\`}>
                {row.label}
              </div>
              {controlStates.map(state => <div className="matrix-cell" key={\`\${row.label}-\${state}\`}>
                  <Switch {...row.props} state={state} label="Switch label" />
                </div>)}
            </Fragment>)}
        </div>
      </section>;
  }
}`,...(I=($=m.parameters)==null?void 0:$.docs)==null?void 0:I.source}}};const O=["CheckboxInteractive","RadioInteractive","SwitchInteractive","CheckboxMatrix","RadioMatrix","SwitchMatrix"],L=Object.freeze(Object.defineProperty({__proto__:null,CheckboxInteractive:l,CheckboxMatrix:d,RadioInteractive:c,RadioMatrix:u,SwitchInteractive:i,SwitchMatrix:m,__namedExportsOrder:O,default:E},Symbol.toStringTag,{value:"Module"}));export{l as C,c as R,L as S,i as a,d as b,u as c,m as d};
