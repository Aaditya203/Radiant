import React from "react";
import styles from "../../../styles/home.module.css";
import { Calendar } from "lucide-react";


export const Events = () => {
  return (
    <section className={`${styles.section} ${styles.sectionSand}`} id="events">
      <div className={styles.container}>
        <div className={styles.introEyebrow} style={{ marginBottom: "60px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>08 — Upcoming Events</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "24px" }}>
          
          <div style={{ background: "var(--color-persimmon)", color: "var(--color-cream)", padding: "40px", borderRadius: "8px", gridRow: "span 2" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "80px", margin: "0 0 24px 0", lineHeight: 1 }}>14 <span style={{ fontSize: "32px", display: "block" }}>Nov</span></h3>
            <h4 style={{ fontSize: "32px", marginBottom: "16px" }}>Science Fair</h4>
            <p style={{ marginBottom: "40px", opacity: 0.9 }}>Join us for an explosive day of experiments and discovery by our middle schoolers.</p>
            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "underline" }}><Calendar size={16} /> Add to calendar</a>
          </div>

          {[
            { date: "22", month: "Nov", title: "Sports Day", time: "8:00 AM" },
            { date: "05", month: "Dec", title: "Annual Exhibition", time: "10:00 AM" },
            { date: "12", month: "Dec", title: "School Play", time: "5:00 PM" },
            { date: "18", month: "Dec", title: "Parent Meet", time: "9:00 AM" },
          ].map((e, i) => (
            <div key={i} style={{ border: "1px solid var(--color-ink)", padding: "24px", borderRadius: "8px" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "40px", color: "var(--color-sunflower)", margin: "0 0 16px 0", lineHeight: 1 }}>{e.date} <span style={{ fontSize: "18px", color: "var(--color-ink)" }}>{e.month}</span></h3>
              <h4 style={{ fontSize: "20px", marginBottom: "8px" }}>{e.title}</h4>
              <p style={{ fontSize: "14px", opacity: 0.7, marginBottom: "16px" }}>{e.time}</p>
              <a href="#" style={{ fontSize: "14px", textDecoration: "underline" }}>Add to calendar</a>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};
