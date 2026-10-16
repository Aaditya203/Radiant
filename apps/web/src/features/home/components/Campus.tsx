"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowLeft, ArrowRight, BookOpen, Leaf, ShieldCheck, Wifi } from "lucide-react";
import styles from "./Campus.module.css";

const facilities = [
  { name: "Library", image: "/images/campus/library.webp", description: "A quiet corner for big ideas and good stories.", alt: "Indian students reading together in the school library" },
  { name: "Science Lab", image: "/images/school/science-model.webp", description: "Hands-on discovery, one experiment at a time.", alt: "Radiant Public School students presenting a science model" },
  { name: "Sports Field", image: "/images/school/ground.webp", description: "Room to run, play, and grow as a team.", alt: "Students taking part in group exercise on the school ground" },
  { name: "Computer Lab", image: "/images/campus/computer-lab.webp", description: "Curiosity meets making, coding, and creating.", alt: "Students building and testing a classroom robotics project" },
  { name: "Art Studio", image: "/images/school/rangoli.webp", description: "A bright place to try new ways of seeing.", alt: "Students creating a colourful rangoli at school" },
  { name: "Music Room", image: "/images/campus/music-room.webp", description: "Finding a rhythm, together.", alt: "Students making music together at school" },
];

const CampusPhoto = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`${styles.photoFrame} ${className ?? ""}`}>
      {failed ? (
        <div className={styles.photoFallback} aria-label={`${alt} image unavailable`}>
          <BookOpen size={32} strokeWidth={1.5} aria-hidden="true" />
        </div>
      ) : (
        <Image src={src} alt={alt} fill sizes="(max-width: 834px) 78vw, 30vw" quality={85} loading="lazy" style={{ objectFit: "cover", objectPosition: "center 58%", filter: "saturate(1.04) contrast(1.04)" }} onError={() => setFailed(true)} />
      )}
    </div>
  );
};

export const Campus = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect && heroRef.current) {
        const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
        heroRef.current.style.setProperty("--parallax-y", `${(progress - 0.5) * 48}px`);
      }
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [visible]);

  const updateCarousel = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const max = carousel.scrollWidth - carousel.clientWidth;
    const nextProgress = max > 0 ? carousel.scrollLeft / max : 0;
    setProgress(nextProgress);
    const cards = Array.from(carousel.children) as HTMLElement[];
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    const nearest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    setActive(nearest.index);
  };

  const scrollToCard = (index: number) => {
    const carousel = carouselRef.current;
    const target = carousel?.children[index] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <section ref={sectionRef} className={styles.campusSection} id="campus" aria-labelledby="campus-title">
      <div className={styles.campusTopWave} aria-hidden="true" />
      <div className={styles.campusGrain} aria-hidden="true" />
      <div className={styles.campusPattern} aria-hidden="true" />
      <div className={styles.campusInner}>
        <header className={`${styles.campusHeader} ${visible ? styles.isRevealed : ""}`}>
          <div className={styles.campusHeadingBlock}>
            <div className={styles.campusEyebrow}>05 — Campus</div>
            <h2 id="campus-title" className={styles.campusTitle}>Our <em>Campus.</em></h2>
          </div>
          <div className={styles.campusIntro}>
            <p>A place to learn, play, and grow—together.</p>
            <a href="#facilities" className={styles.ghostLink}>Explore all facilities <ArrowDownRight size={17} aria-hidden="true" /></a>
          </div>
        </header>

        <div ref={heroRef} className={`${styles.campusHero} ${visible ? styles.heroRevealed : ""}`}>
          <div className={styles.heroParallax}>
          <CampusPhoto src="/images/school/ground.webp" alt="Students taking part in a group exercise on the Radiant Public School ground" className={styles.heroPhoto} />
          </div>
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroChips}>
            <div className={`${styles.heroChip} ${styles.chipCctv}`}><ShieldCheck size={16} aria-hidden="true" /> Learning through inquiry</div>
            <div className={`${styles.heroChip} ${styles.chipWifi}`}><Wifi size={16} aria-hidden="true" /> Room to explore</div>
            <div className={`${styles.heroChip} ${styles.chipGreen}`}><Leaf size={16} aria-hidden="true" /> Growing together</div>
          </div>
        </div>

        <section className={styles.facilitiesSection} id="facilities" aria-label="Campus facilities">
          <div className={styles.facilitiesHeader}>
            <p>Spaces for every kind of curiosity.</p>
            <div className={styles.carouselControls}>
              <button type="button" aria-label="Previous facility" onClick={() => scrollToCard(Math.max(0, active - 1))}><ArrowLeft size={18} /></button>
              <button type="button" aria-label="Next facility" onClick={() => scrollToCard(Math.min(facilities.length - 1, active + 1))}><ArrowRight size={18} /></button>
            </div>
          </div>
          <div ref={carouselRef} className={`${styles.facilitiesTrack} ${visible ? styles.panelsRevealed : ""}`} onScroll={updateCarousel}>
            {facilities.map((place, index) => (
              <article
                key={place.name}
                className={`${styles.facilityPanel} ${active === index ? styles.facilityActive : ""}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                tabIndex={0}
                aria-label={`${place.name}: ${place.description}`}
                style={{ "--panel-index": index } as React.CSSProperties}
              >
                <CampusPhoto src={place.image} alt={place.alt} className={styles.facilityPhoto} />
                <div className={styles.facilityShade} />
                <span className={styles.facilityNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.facilityContent}>
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  <a href="#admissions" tabIndex={active === index ? 0 : -1} className={styles.facilityExplore}>Explore <ArrowRight size={16} /></a>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.carouselProgress} aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
        </section>

        <div className={styles.campusCtaWrap}>
          <p>See it in person, bookings take 2 minutes.</p>
          <a href="#admissions" className={styles.campusCta}>Take the campus tour <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
      <div className={styles.campusBottomWave} aria-hidden="true" />
    </section>
  );
};
