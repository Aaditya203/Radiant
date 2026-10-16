import React from "react";
import Image from "next/image";
import styles from "../../../styles/home.module.css";

const learningData = [
  {
    word: "Explore",
    desc: "Why is the sky that color? We'll find out together.",
    img: "/images/school/plantation.webp",
    alt: "Students and teachers planting saplings in the school grounds"
  },
  {
    word: "Create",
    desc: "Mixing paints until we find the perfect shade of green.",
    img: "/images/school/rangoli.webp",
    alt: "Students creating a colourful rangoli together"
  },
  {
    word: "Question",
    desc: "There are no wrong questions. Only new paths.",
    img: "/images/school/main3.webp",
    alt: "A student taking part in a school community ceremony"
  },
  {
    word: "Build",
    desc: "Blocks, ideas, friendships. We build them all.",
    img: "/images/school/science-model.webp",
    alt: "Students presenting a science model they built together"
  },
  {
    word: "Collaborate",
    desc: "Learning is better when we do it together.",
    img: "/images/school/mehendi.webp",
    alt: "Students gathered around a mehendi art activity"
  }
];

export const Learning = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div style={{ marginBottom: "20px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>02 — Philosophy</div>
        <div className={styles.learningList}>
          {learningData.map((item, index) => (
            <div key={item.word} className={styles.learningItem}>
              <div>
                <h3 className={styles.learningWord}>{item.word}</h3>
                <p className={styles.learningDesc}>{item.desc}</p>
              </div>
              <div className={styles.learningImgWrapper} style={{ transform: `translateY(${index % 2 === 0 ? '0' : '40px'})`}}>
                <Image src={item.img} alt={item.alt} width={2048} height={1152} sizes="(max-width: 768px) 90vw, 40vw" quality={85} loading="lazy" className={styles.learningImg} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
