import type { Metadata } from "next";
import {
  Fraunces, Figtree, Caveat,
  Playfair_Display, Inter, DM_Serif_Display, DM_Sans, Lora, Nunito,
  Merriweather, Source_Sans_3, Cormorant_Garamond, Montserrat,
  Libre_Baskerville, Lato, Space_Grotesk, Work_Sans, Bricolage_Grotesque,
  Manrope, Baloo_2, Quicksand, Young_Serif, Outfit,
  Noto_Serif_Devanagari, Noto_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";
import { SmoothScrolling } from "../src/components/SmoothScrolling";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--f-fraunces", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--f-figtree", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--f-caveat", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--f-playfair", display: "swap", preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap", preload: false });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], variable: "--f-dm-serif", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--f-dm-sans", display: "swap", preload: false });
const lora = Lora({ subsets: ["latin"], variable: "--f-lora", display: "swap", preload: false });
const nunito = Nunito({ subsets: ["latin"], variable: "--f-nunito", display: "swap", preload: false });
const merriweather = Merriweather({ subsets: ["latin"], variable: "--f-merriweather", display: "swap", preload: false });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--f-source-sans", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--f-cormorant", display: "swap", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--f-montserrat", display: "swap", preload: false });
const libre = Libre_Baskerville({ subsets: ["latin"], variable: "--f-libre", display: "swap", preload: false });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-lato", display: "swap", preload: false });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--f-space", display: "swap", preload: false });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--f-work-sans", display: "swap", preload: false });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bricolage", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--f-manrope", display: "swap", preload: false });
const baloo = Baloo_2({ subsets: ["latin"], variable: "--f-baloo", display: "swap", preload: false });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--f-quicksand", display: "swap", preload: false });
const youngSerif = Young_Serif({ subsets: ["latin"], weight: ["400"], variable: "--f-young-serif", display: "swap", preload: false });
const outfit = Outfit({ subsets: ["latin"], variable: "--f-outfit", display: "swap", preload: false });
const notoSerifDevanagari = Noto_Serif_Devanagari({ subsets: ["devanagari"], variable: "--f-noto-serif-devanagari", display: "swap", preload: false });
const notoSansDevanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--f-noto-sans-devanagari", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Radiant Public School, Bheldi | A school for curious people.",
  description: "Welcome to Radiant Public School in Bheldi, Saran, Bihar.",
};

const fontVariables = [
  fraunces, figtree, caveat, playfair, inter, dmSerif, dmSans, lora, nunito,
  merriweather, sourceSans, cormorant, montserrat, libre, lato, space, workSans,
  bricolage, manrope, baloo, quicksand, youngSerif, outfit, notoSerifDevanagari,
  notoSansDevanagari,
].map((font) => font.variable).join(" ");

const fontPreferenceScript = `try { var savedFont = localStorage.getItem('rps-font'); if (savedFont) document.documentElement.dataset.font = savedFont; } catch (_) {}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-font="default" className={fontVariables} suppressHydrationWarning>
      <head>
        <script id="font-preference" dangerouslySetInnerHTML={{ __html: fontPreferenceScript }} />
      </head>
      <body>
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
