"use client";
import React, { useEffect, useRef } from "react";
import styles from "../../../styles/home.module.css";
import gsap from "gsap";

const reviews = [
  { text: "My daughter wakes up excited for school every single day. The teachers here really understand how children learn.", author: "Sunita Sharma, Parent" },
  { text: "It's not just about marks. Radiant Public School focuses on building character and curiosity. Best decision we made.", author: "Rajeev Verma, Parent" },
  { text: "The balance between academics and extracurricular activities is perfect. My son has found his passion for science here.", author: "Priya Das, Parent" },
  { text: "A truly inclusive and warm environment. The faculty is exceptional and always supportive.", author: "Amit Gupta, Parent" },
];

export const ReviewsMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // GSAP Marquee
    gsap.to(containerRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 30,
      repeat: -1
    });
  }, []);

  return (
    <div className={styles.reviewsMarquee}>
      <div 
        ref={containerRef} 
        style={{ display: "flex", gap: "24px", width: "fit-content", paddingLeft: "24px" }}
      >
        {[...reviews, ...reviews].map((r, i) => (
          <div key={i} className={styles.reviewCard}>
            <p className={styles.reviewText}>"{r.text}"</p>
            <p className={styles.reviewAuthor}>— {r.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
