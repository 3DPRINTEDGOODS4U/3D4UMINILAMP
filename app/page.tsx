
"use client";

import { useState } from "react";
import LampViewer from "../components/LampViewer";

const COLORS = [
  { name: "Ivory", hex: "#F2EEDF" },
  { name: "Sand", hex: "#C8A783" },
  { name: "Terracotta", hex: "#BC806E" },
  { name: "Sage", hex: "#A4B39B" },
  { name: "Charcoal", hex: "#41464B" },
];

const BASES = [
  { name: "Base 01" },
  { name: "Base 02" },
  { name: "Base 03" },
];

const SHADES = [
  { name: "Shade 01" },
  { name: "Shade 02" },
  { name: "Shade 03" },
  { name: "Shade 04" },
  { name: "Shade 05" },
];

export default function Home() {
  const [base, setBase] = useState(0);
  const [shade, setShade] = useState(0);

  const [baseColor, setBaseColor] = useState(1);
  const [shadeColor, setShadeColor] = useState(0);

  const [lit, setLit] = useState(true);

  function copyConfiguration() {
    const summary = [
      "3D4U Printed Goods",
      "My Custom Lamp",
      `Shade: ${SHADES[shade].name}`,
      `Shade Color: ${COLORS[shadeColor].name}`,
      `Base: ${BASES[base].name}`,
      `Base Color: ${COLORS[baseColor].name}`,
      `Light: ${lit ? "ON" : "OFF"}`,
    ].join("\n");

    navigator.clipboard.writeText(summary);
  }

  return (
    <main>
      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <img
            src="/3d4u-logo.png"
            alt="3D4U Printed Goods"
            style={{
              display: "block",
              width: "110px",
              height: "55px",
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
        </div>

        <div className="headerRight">
          DESIGN YOUR LIGHT
        </div>
      </header>

      <div className="workspace">
        {/* LEFT SIDE — 3D VIEWER */}
        <section className="visual">
          <div className="visualLabel eyebrow">
            01 / INTERACTIVE VIEW
          </div>

          <div className="canvas">
            <LampViewer
              base={base}
              shade={shade}
              baseColor={COLORS[baseColor].hex}
              shadeColor={COLORS[shadeColor].hex}
              lit={lit}
            />
          </div>

          <div className="visualBottom">
            <span>
              DRAG TO ROTATE · SCROLL TO ZOOM
            </span>

            <button
              className="textButton"
              onClick={() => setLit(!lit)}
            >
              LIGHT {lit ? "ON ●" : "OFF ○"}
            </button>
          </div>
        </section>

        {/* RIGHT SIDE — CONFIGURATOR */}
        <section className="panel">
          <div className="eyebrow">
            3D4U PRINTED GOODS
          </div>

          <h1>Make it yours.</h1>

          <p className="intro">
            Mix shapes, combine colors, and create
            a lamp that feels like you.
          </p>

          {/* 01 — SHADE SELECTION */}
          <div className="section">
            <div className="sectionHeader">
              <b>01 / CHOOSE YOUR SHADE</b>
              <span>{SHADES[shade].name}</span>
            </div>

            <div className="optionGrid">
              {SHADES.map((item, index) => (
                <button
                  key={item.name}
                  className={
                    "option" +
                    (shade === index ? " active" : "")
                  }
                  onClick={() => setShade(index)}
                >
                  <span className="optionNum">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 02 — SHADE COLOR */}
          <div className="section">
            <div className="sectionHeader">
              <b>02 / SHADE COLOR</b>
              <span>{COLORS[shadeColor].name}</span>
            </div>

            <div className="swatches">
              {COLORS.map((color, index) => (
                <button
                  key={color.name}
                  className={
                    "swatch" +
                    (shadeColor === index ? " active" : "")
                  }
                  onClick={() => setShadeColor(index)}
                  title={color.name}
                  aria-label={
                    `Shade color ${color.name}`
                  }
                >
                  <span
                    style={{
                      backgroundColor: color.hex,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 03 — BASE SELECTION */}
          <div className="section">
            <div className="sectionHeader">
              <b>03 / CHOOSE YOUR BASE</b>
              <span>{BASES[base].name}</span>
            </div>

            <div className="optionGrid">
              {BASES.map((item, index) => (
                <button
                  key={item.name}
                  className={
                    "option" +
                    (base === index ? " active" : "")
                  }
                  onClick={() => setBase(index)}
                >
                  <span className="optionNum">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 04 — BASE COLOR */}
          <div className="section">
            <div className="sectionHeader">
              <b>04 / BASE COLOR</b>
              <span>{COLORS[baseColor].name}</span>
            </div>

            <div className="swatches">
              {COLORS.map((color, index) => (
                <button
                  key={color.name}
                  className={
                    "swatch" +
                    (baseColor === index ? " active" : "")
                  }
                  onClick={() => setBaseColor(index)}
                  title={color.name}
                  aria-label={
                    `Base color ${color.name}`
                  }
                >
                  <span
                    style={{
                      backgroundColor: color.hex,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* CONFIGURATION SUMMARY */}
          <div className="section">
            <div className="sectionHeader">
              <b>YOUR CREATION</b>
              <span>3D4U</span>
            </div>

            <div className="summary">
              <strong>
                {SHADES[shade].name} + {BASES[base].name}
              </strong>

              <small>
                Shade: {COLORS[shadeColor].name}
                {" · "}
                Base: {COLORS[baseColor].name}
              </small>
            </div>

            <button
              className="primary"
              onClick={copyConfiguration}
            >
              COPY MY CONFIGURATION
            </button>

            <p className="fineprint">
              Designed by you. Made by 3D4U.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
