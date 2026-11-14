# Modular Lamp Configurator — Your Actual STL Models

This version contains your **3 real bases** and **5 real shades** converted from STL to GLB, with live model switching, separate base and shade color settings, light toggle, drag-to-rotate, and zoom.

## Start from scratch (Windows or Mac)

1. Install the LTS edition of Node.js from https://nodejs.org/
2. Install VS Code from https://code.visualstudio.com/
3. Extract this ZIP and open the **modular-lamp-configurator-real-models** folder in VS Code (File > Open Folder).
4. In VS Code open Terminal > New Terminal.
5. Run `npm install` and wait for completion.
6. Run `npm run dev`.
7. In a browser open http://localhost:3000
8. To stop the local server, press Ctrl+C in the terminal.

## Your 3D parts

- `public/models/base-01.glb` through `base-03.glb`
- `public/models/shade-01.glb` through `shade-05.glb`

Each STL was normalized to a common horizontal origin, converted from Z-up to Y-up for the browser, and scaled by 1/100 from STL input coordinate values. Each base sits on the virtual ground plane. Shade bottoms are provisionally placed at each base's top. The files were not redesigned; geometry was preserved. STL files have no embedded filament colors, so the displayed swatches are **examples**, not your confirmed product colors.

**Important:** This is a visual alignment assumption, not a verified physical/engineering fit. Inspect the component joints, orientation and electrical clearances before using a customer-facing configurator. The original STL coordinate units are not encoded in STL; dimensions are reported in source coordinate units and treated as millimeters provisionally.

## Change joint alignment

Edit `components/LampViewer.tsx` and change `BASE_HEIGHTS` or the shade group's `position={[0, baseHeight, 0]}`. If a connector is inset or parts overlap, use `baseHeight + offset` (with offset in the GLB's scaled units).

## Customize your lamp and color names

Edit `app/page.tsx`: the `COLORS`, `bases`, and `shades` arrays determine the menu labels and filament colors. Replace them with your actual brand names and filament HEX colors.

## Publish later

Once the live prototype looks correct, deploy via Vercel (https://vercel.com/) and connect a domain. Don't announce orders until the model alignment, electrical components, compatibility, colors and pricing are confirmed.
