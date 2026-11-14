"use client";
import dynamic from "next/dynamic";
import {useState} from "react";
const LampViewer=dynamic(()=>import("../components/LampViewer"),{ssr:false});
const COLORS=[{name:"Ivory",hex:"#efeadc"},{name:"Sand",hex:"#c9a986"},{name:"Terracotta",hex:"#bc7562"},{name:"Sage",hex:"#9eab90"},{name:"Charcoal",hex:"#4c5053"}];
const bases=["Base 01", "Base 02", "Base 03"];
const shades=["Shade 01", "Shade 02", "Shade 03", "Shade 04", "Shade 05"];
export default function Home(){
 const [base,setBase]=useState(0),[shade,setShade]=useState(0);
 const [baseColor,setBaseColor]=useState(COLORS[1].hex),[shadeColor,setShadeColor]=useState(COLORS[0].hex),[lit,setLit]=useState(true);
 const selected=(hex:string)=>COLORS.find(c=>c.hex===hex)?.name??hex;
 const summary=`Lamp configuration\nBase: ${bases[base]}\nShade: ${shades[shade]}\nBase color: ${selected(baseColor)}\nShade color: ${selected(shadeColor)}\nLight: ${lit?"On":"Off"}`;
 async function share(){if(navigator.clipboard){await navigator.clipboard.writeText(summary);alert("Configuration copied!")}else alert(summary)}
 return <main>
  <header className="header"><span className="brand">MODULAR <span>STUDIO</span></span><span className="headerRight">DESIGN YOUR LIGHT</span></header>
  <div className="workspace">
   <section className="visual"><div className="eyebrow visualLabel">01 / INTERACTIVE VIEW</div><div className="canvas"><LampViewer base={base} shade={shade} baseColor={baseColor} shadeColor={shadeColor} lit={lit}/></div><div className="visualBottom"><span>DRAG TO ROTATE · SCROLL TO ZOOM</span><button className="textButton" onClick={()=>setLit(!lit)}>{lit?"● LIGHT ON":"○ LIGHT OFF"}</button></div></section>
   <aside className="panel"><span className="eyebrow">MADE BY YOU</span><h1>Make it yours.</h1><p className="intro">Mix shapes, combine colors, and create a lamp that feels like you.</p>
    <div className="section"><div className="sectionHeader"><b>01 / CHOOSE YOUR BASE</b><span>{bases[base]}</span></div><div className="optionGrid">{bases.map((n,i)=><button key={n} className={base===i?"option active":"option"} onClick={()=>setBase(i)}><span className="optionNum">0{i+1}</span>{n}</button>)}</div></div>
    <div className="section"><div className="sectionHeader"><b>02 / CHOOSE YOUR SHADE</b><span>{shades[shade]}</span></div><div className="optionGrid">{shades.map((n,i)=><button key={n} className={shade===i?"option active":"option"} onClick={()=>setShade(i)}><span className="optionNum">0{i+1}</span>{n}</button>)}</div></div>
    <div className="section"><div className="sectionHeader"><b>03 / BASE COLOR</b><span>{selected(baseColor)}</span></div><div className="swatches">{COLORS.map(c=><button key={c.name} title={c.name} aria-label={`Base ${c.name}`} className={baseColor===c.hex?"swatch active":"swatch"} onClick={()=>setBaseColor(c.hex)}><span style={{background:c.hex}}/></button>)}</div></div>
    <div className="section"><div className="sectionHeader"><b>04 / SHADE COLOR</b><span>{selected(shadeColor)}</span></div><div className="swatches">{COLORS.map(c=><button key={c.name} title={c.name} aria-label={`Shade ${c.name}`} className={shadeColor===c.hex?"swatch active":"swatch"} onClick={()=>setShadeColor(c.hex)}><span style={{background:c.hex}}/></button>)}</div></div>
    <div className="summary"><span>YOUR CONFIGURATION</span><strong>{bases[base]} + {shades[shade]}</strong><small>{selected(baseColor)} base / {selected(shadeColor)} shade</small></div>
    <button className="primary" onClick={share}>COPY MY CONFIGURATION ↗</button><p className="fineprint">Your STL models are now included. Lamp joints are provisionally aligned; verify the physical connection before publishing.</p>
   </aside>
  </div>
 </main>
}
