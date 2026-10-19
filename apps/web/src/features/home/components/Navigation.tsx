"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/home.module.css";
import Image from "next/image";
import { FontSwitcher } from "./FontSwitcher";

export const Navigation = ({ hero = "light" }: { hero?: "dark" | "light" }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const next = scrolledRef.current ? window.scrollY > 8 : window.scrollY >= 24;
        if (next !== scrolledRef.current) {
          scrolledRef.current = next;
          setScrolled(next);
        }
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <div className={styles.navWrapper}>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : styles.navTransparent}`} data-hero={hero} data-scrolled={scrolled}>
        <div className={styles.navContent}>
          <div className={styles.navBackground} />
          <div className={styles.navBrand}>
            <div className={styles.logoMark}>
              <span className={styles.logoBadge}>
                <Image src="/assets/logo.jfif" alt="Radiant Public Logo" width={32} height={32} className={styles.logoImg} />
              </span>
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>Radiant Public</span>
                <span className={styles.logoSubtitle}>School</span>
              </div>
            </div>
          </div>
          <div className={`${styles.navLinks} ${mobileOpen ? styles.navLinksOpen : ""}`}>
            <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
            <a href="#academics" onClick={() => setMobileOpen(false)}>Academics</a>
            <a href="#student-life" onClick={() => setMobileOpen(false)}>Student Life</a>
            <a href="#campus" onClick={() => setMobileOpen(false)}>Campus</a>
            <a href="#admissions" onClick={() => setMobileOpen(false)}>Admissions</a>
            <a href="#events" onClick={() => setMobileOpen(false)}>News & Events</a>
          </div>
          <div className={styles.navAction}>
            <div className={styles.langSwitch}>
              <span>EN</span> | <span>HI</span>
            </div>
            <FontSwitcher onSelect={() => setMobileOpen(false)} />
            <button className={styles.primaryBtn}>Book a Visit</button>
          </div>
          <button className={styles.mobileMenuBtn} aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
};
