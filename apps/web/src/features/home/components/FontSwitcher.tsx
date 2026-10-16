"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import styles from "./FontSwitcher.module.css";

const choices = [
  { id: "default", name: "Default", heading: "var(--f-fraunces), serif", body: "var(--f-figtree), sans-serif" },
  { id: "playfair-inter", name: "Classic Scholar", heading: "var(--f-playfair), serif", body: "var(--f-inter), sans-serif" },
  { id: "dm-serif-dm-sans", name: "Warm Editorial", heading: "var(--f-dm-serif), serif", body: "var(--f-dm-sans), sans-serif" },
  { id: "lora-nunito", name: "Friendly Storybook", heading: "var(--f-lora), serif", body: "var(--f-nunito), sans-serif" },
  { id: "merriweather-source-sans", name: "Trusted Heritage", heading: "var(--f-merriweather), serif", body: "var(--f-source-sans), sans-serif" },
  { id: "cormorant-montserrat", name: "Elegant", heading: "var(--f-cormorant), serif", body: "var(--f-montserrat), sans-serif" },
  { id: "libre-lato", name: "Academic", heading: "var(--f-libre), serif", body: "var(--f-lato), sans-serif" },
  { id: "space-work", name: "Modern Sans", heading: "var(--f-space), sans-serif", body: "var(--f-work-sans), sans-serif" },
  { id: "bricolage-manrope", name: "Bold Contemporary", heading: "var(--f-bricolage), sans-serif", body: "var(--f-manrope), sans-serif" },
  { id: "baloo-quicksand", name: "Playful Kids", heading: "var(--f-baloo), sans-serif", body: "var(--f-quicksand), sans-serif" },
  { id: "young-serif-outfit", name: "Soft Rounded", heading: "var(--f-young-serif), serif", body: "var(--f-outfit), sans-serif" },
];

export const FontSwitcher = ({ mobile = false, onSelect }: { mobile?: boolean; onSelect?: () => void }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("default");
  const [rovingIndex, setRovingIndex] = useState(0);

  const applyFont = (id: string, commit = false) => {
    document.documentElement.dataset.font = id;
    document.body.classList.add("fontChanging");
    document.body.classList.remove("fontChanged");
    window.setTimeout(() => {
      document.body.classList.remove("fontChanging");
      document.body.classList.add("fontChanged");
    }, 150);
    if (commit) {
      setSelected(id);
      try { window.localStorage.setItem("rps-font", id); } catch { /* Storage can be disabled. */ }
      onSelect?.();
    }
  };

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("rps-font");
      if (stored && choices.some(({ id }) => id === stored)) {
        setSelected(stored);
        document.documentElement.dataset.font = stored;
      }
    } catch { /* Storage can be disabled. */ }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        applyFont(selected);
        setOpen(false);
        onSelect?.();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, selected, onSelect]);

  const closeOnEscape = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      applyFont(selected);
      setOpen(false);
      onSelect?.();
      triggerRef.current?.focus();
    }
  };

  const moveOptionFocus = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const columns = window.innerWidth < 520 ? 2 : 3;
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % choices.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + choices.length) % choices.length;
    else if (event.key === "ArrowDown") next = (index + columns) % choices.length;
    else if (event.key === "ArrowUp") next = (index - columns + choices.length) % choices.length;
    else return;
    event.preventDefault();
    setRovingIndex(next);
    optionRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className={`${styles.switcher} ${mobile ? styles.mobileSwitcher : ""}`}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        aria-label="Change font style"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => {
          const next = !value;
          if (next) {
            const index = Math.max(0, choices.findIndex(({ id }) => id === selected));
            setRovingIndex(index);
            window.requestAnimationFrame(() => optionRefs.current[index]?.focus());
          } else {
            applyFont(selected);
          }
          return next;
        })}
      >Aa</button>
      {open && (
        <div className={styles.popover} role="dialog" aria-label="Choose a font combination" onKeyDown={closeOnEscape}>
          <div className={styles.popoverHeader}>
            <div><span className={styles.eyebrow}>Make it yours</span><h2>Choose a font style</h2></div>
            <button className={styles.closeButton} type="button" aria-label="Close font style picker" onClick={() => { applyFont(selected); setOpen(false); triggerRef.current?.focus(); }}><X size={18} /></button>
          </div>
          <div className={styles.choiceGrid} role="group" aria-label="Font combinations">
            {choices.map((choice, index) => (
              <button
                key={choice.id}
                ref={(node) => { optionRefs.current[index] = node; }}
                type="button"
                className={`${styles.choice} ${selected === choice.id ? styles.selected : ""}`}
                aria-pressed={selected === choice.id}
                tabIndex={rovingIndex === index ? 0 : -1}
                onFocus={() => { setRovingIndex(index); applyFont(choice.id); }}
                onPointerEnter={() => applyFont(choice.id)}
                onPointerLeave={() => applyFont(selected)}
                onClick={() => { applyFont(choice.id, true); setOpen(false); triggerRef.current?.focus(); }}
                onKeyDown={(event) => moveOptionFocus(event, index)}
              >
                <span className={styles.choiceName}>{choice.name}</span>
                <span className={styles.aa} style={{ fontFamily: choice.heading }}>Aa</span>
                <span className={styles.sampleHeading} style={{ fontFamily: choice.heading }}>Every question is welcome here.</span>
                <span className={styles.sampleBody} style={{ fontFamily: choice.body }}>Learning is messy, noisy, joyful.</span>
                {selected === choice.id && <Check className={styles.check} size={15} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <button className={styles.reset} type="button" onClick={() => { applyFont("default", true); setOpen(false); triggerRef.current?.focus(); }}><RotateCcw size={14} /> Reset to default</button>
        </div>
      )}
    </div>
  );
};
