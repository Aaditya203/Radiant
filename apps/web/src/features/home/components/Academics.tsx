"use client";

import React from "react";
import styles from "../../../styles/home.module.css";

const subjects = [
  { name: "Mathematics", desc: "Finding patterns in the chaos.", image: "/images/academics/math.svg", color: "#E05228", text: "#FFF8EC" },
  { name: "Science", desc: "Hypothesize, test, explode (safely), repeat.", image: "/images/academics/science.svg", color: "#F2B632", text: "#1f1f1f" },
  { name: "Languages", desc: "The keys to other worlds.", image: "/images/academics/languages.svg", color: "#2A9D8F", text: "#FFF8EC" },
  { name: "Arts", desc: "Because expression is essential.", image: "/images/academics/arts.svg", color: "#FDE6D8", text: "#1f1f1f" },
  { name: "Technology", desc: "Building the future, literally.", image: "/images/academics/technology.svg", color: "#1f1f1f", text: "#FFF8EC" },
  { name: "Humanities", desc: "Understanding who we are.", image: "/images/academics/humanities.svg", color: "#E05228", text: "#FFF8EC" },
];

export const Academics = () => {
  return (
    <section className={`${styles.section} ${styles.sectionSand}`} id="academics">
      <div className={styles.container}>
        <div style={{ marginBottom: "20px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>03 — Academics</div>
        <h2 style={{ fontSize: "56px", fontFamily: "var(--font-serif)", marginBottom: "40px" }}>
          Learning isn't just subjects. It's <em style={{ color: "var(--color-persimmon)", fontStyle: "italic" }}>curiosity</em> with a timetable.
        </h2>
        <div className={styles.academicsIndex}>
          {subjects.map((s, i) => (
            <div key={s.name} className={styles.academicRow} style={{ "--row-color": s.color, "--row-text": s.text } as React.CSSProperties} tabIndex={0}>
              <span className={styles.academicNum}>0{i + 1}</span>
              <span className={styles.academicSubject}>
                {s.name === "Science" ? (
                   <span style={{ position: "relative" }}>
                     <span style={{ position: "absolute", bottom: "4px", left: "-5px", right: "-5px", height: "16px", backgroundColor: "var(--color-sunflower)", zIndex: -1, transform: "rotate(-1deg)" }}></span>
                     {s.name}
                   </span>
                ) : s.name}
              </span>
              <span className={styles.academicDesc}>{s.desc}</span>
              <span className={styles.academicArrow} aria-hidden="true">→</span>
              <img src={s.image} alt={`${s.name} illustration`} className={styles.academicHoverImg} onError={(event) => { event.currentTarget.style.display = "none"; }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
