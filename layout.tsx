import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Modular Lamp Studio", description: "Configure your own modular 3D printed lamp" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
