import React from "react";
import Image from "next/image";
import styles from "../../../styles/home.module.css";

export const SchoolIntro = () => {
  return (
    <section className={`${styles.section} ${styles.sectionSand}`} id="about">
      <div className={styles.container}>
        <div style={{ marginBottom: "40px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>01 — Who we are</div>
        <div className={styles.introContent}>
          <div className={styles.introText}>
            <h2 className={styles.introTitle}>
              At Radiant Public School in <strong>Bheldi, Saran</strong>, learning is shaped by curiosity, care, and the confidence to explore new ideas.
            </h2>
          </div>
          <div className={styles.introImages}>
            <Image
              src="/images/school/main.webp"
              alt="Radiant Public School students and staff gathered for a school celebration"
              width={2048}
              height={1536}
              sizes="(max-width: 768px) 90vw, 42vw"
              quality={85}
              className={styles.introImg1}
            />
            <Image
              src="/images/school/ground.webp"
              alt="Students exercising together on the school ground"
              width={2048}
              height={1152}
              sizes="(max-width: 768px) 90vw, 48vw"
              quality={85}
              className={styles.introImg2}
            />
            <div className={styles.introCaption}>
              The courtyard, 8:15 a.m. Always the best part of the day.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
