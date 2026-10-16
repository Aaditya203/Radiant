import React from "react";
import styles from "../../../styles/home.module.css";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const Admissions = () => {
  return (
    <section className={styles.section} id="admissions" style={{ padding: 0 }}>
      <div style={{ position: "relative", height: "800px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Image
          src="/images/school/independence.webp"
          alt="Students and staff gathered for a flag ceremony at Radiant Public School"
          fill
          sizes="100vw"
          quality={85}
          style={{ objectFit: "cover", objectPosition: "center 60%", zIndex: 1 }}
        />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to top, rgba(30,27,22,0.8), transparent)", zIndex: 2 }}></div>
        
        <div style={{ position: "relative", zIndex: 3, maxWidth: "800px", padding: "40px" }}>
          <h2 style={{ fontSize: "72px", fontFamily: "var(--font-serif)", color: "var(--color-cream)", marginBottom: "40px", lineHeight: 1.1 }}>
            Come see what learning <em style={{ color: "var(--color-persimmon)", fontStyle: "italic" }}>feels</em> like here.
          </h2>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "60px" }}>
            <button className={styles.primaryBtn} style={{ fontSize: "18px", padding: "16px 32px" }}>Book a School Visit</button>
            <button className={styles.secondaryBtn} style={{ color: "var(--color-cream)", borderColor: "var(--color-cream)", fontSize: "18px", padding: "16px 32px" }}>Explore Admissions</button>
          </div>
          
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", color: "var(--color-cream)", fontSize: "15px", fontWeight: 500 }}>
            <span>Admissions enquiries welcome</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>Contact the school for current class availability</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className={`${styles.section} ${styles.sectionDark}`} style={{ paddingBottom: "40px" }}>
      <div className={styles.container}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "60px", marginBottom: "80px" }}>
          <div>
            <div className={styles.logoMark} style={{ marginBottom: "24px" }}>
              <Image src="/assets/logo.jfif" alt="Logo" width={40} height={40} className={styles.logoImg} />
              <div className={styles.logoText}>
                <span className={styles.logoTitle} style={{ color: "var(--color-cream)" }}>Radiant Public</span>
                <span className={styles.logoSubtitle} style={{ color: "var(--color-sunflower)" }}>School</span>
              </div>
            </div>
            <p style={{ opacity: 0.8, maxWidth: "250px" }}>A school for curious people.</p>
            <p style={{ marginTop: "24px", fontFamily: "var(--font-hand)", color: "var(--color-sunflower)", fontSize: "24px", transform: "rotate(-5deg)" }}>see you soon!</p>
          </div>
          
          <div>
            <h4 style={{ color: "var(--color-cream)", marginBottom: "24px", opacity: 0.5, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Contact</h4>
            <p style={{ opacity: 0.8, marginBottom: "16px" }}>WW6X+676, Road, behind Punjab national bank, Rewa, Bheldi, Bihar 841402</p>
            <p style={{ opacity: 0.8, marginBottom: "8px" }}>094308 56662</p>
            <p style={{ opacity: 0.8 }}>Call the school to enquire about admissions</p>
          </div>

          <div>
            <h4 style={{ color: "var(--color-cream)", marginBottom: "24px", opacity: 0.5, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", opacity: 0.8 }}>
              <a href="#about">About</a>
              <a href="#academics">Academics</a>
              <a href="#student-life">Student Life</a>
              <a href="#campus">Campus</a>
              <a href="#admissions">Admissions</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: "var(--color-cream)", marginBottom: "24px", opacity: 0.5, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>School record</h4>
            <p style={{ opacity: 0.8, marginBottom: "16px" }}>UDISE+ code: 10171703602</p>
            <p style={{ opacity: 0.8, marginBottom: "32px" }}>Listed as Radiant Public School, Bheldi (Saran)</p>
            
            <div style={{ display: "flex", gap: "16px", opacity: 0.8 }}>
              <span>Instagram</span>
              <span>Facebook</span>
              <span>YouTube</span>
            </div>
          </div>
        </div>
        
        <div className={styles.sectionDivider} style={{ borderColor: "rgba(251, 245, 234, 0.1)", paddingTop: "24px", display: "flex", justifyContent: "space-between", fontSize: "14px", opacity: 0.6 }}>
          <p>© {new Date().getFullYear()} Radiant Public School. All rights reserved.</p>
          <p>Bheldi · Saran · Bihar</p>
        </div>
      </div>
    </footer>
  );
};
