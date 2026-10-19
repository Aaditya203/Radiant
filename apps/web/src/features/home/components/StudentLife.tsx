"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "../../../styles/home.module.css";

const MOVE_MS = 1400;
const HOLD_MS = 1600;
const CARD_GAP = 12;
const DESKTOP_CARD_WIDTHS = [420, 300, 360, 280] as const;
const TABLET_CARD_WIDTHS = [340, 260, 300, 240] as const;

type Category = "Sports" | "Music" | "Art" | "Clubs" | "Trips" | "Performances";
type Photo = { id: string; image: string; caption: string; alt: string; sizeStep: number };

const categories: Category[] = ["Sports", "Music", "Art", "Clubs", "Trips", "Performances"];
const photos: Photo[] = [
  { id: "relay", image: "/images/school/ground.webp", caption: "Morning exercise on the school ground", alt: "Students exercising together on the school ground", sizeStep: 0 },
  { id: "football", image: "/images/school/pt.webp", caption: "Warm-up before class", alt: "Students practising a group warm-up outdoors", sizeStep: 1 },
  { id: "basketball", image: "/images/school/pt1.webp", caption: "Stretching together", alt: "Students stretching together during morning exercise", sizeStep: 2 },
  { id: "yoga", image: "/images/student-life/sports-4.webp", caption: "A little morning yoga", alt: "Students taking part in a morning yoga activity", sizeStep: 3 },
  { id: "tabla", image: "/images/student-life/music-1.webp", caption: "Music room", alt: "Students taking part in a school music activity", sizeStep: 0 },
  { id: "keyboard", image: "/images/student-life/music-2.webp", caption: "Music room melodies", alt: "Students practising music together", sizeStep: 1 },
  { id: "choir", image: "/images/student-life/music-3.webp", caption: "Finding our chorus", alt: "Students singing together at school", sizeStep: 2 },
  { id: "dance", image: "/images/student-life/music-4.webp", caption: "Classical dance practice", alt: "Students practising a classical dance", sizeStep: 3 },
  { id: "exhibition", image: "/images/school/rangoli.webp", caption: "Rangoli made by our students", alt: "Students gathered around their colourful rangoli artwork", sizeStep: 0 },
  { id: "painting", image: "/images/school/mehendi.webp", caption: "Mehendi art in the making", alt: "A student creating mehendi designs on a classmate's hand", sizeStep: 1 },
  { id: "robotics", image: "/images/school/science-model.webp", caption: "Sharing a science model", alt: "Students presenting their science model together", sizeStep: 2 },
  { id: "science", image: "/images/school/plantation.webp", caption: "Our school planting drive", alt: "Students and teachers planting saplings at school", sizeStep: 3 },
  { id: "bus", image: "/images/school/image1.webp", caption: "A learning visit with local police", alt: "Students visiting a local police station with an officer", sizeStep: 0 },
  { id: "nature", image: "/images/student-life/trips-3.webp", caption: "Looking closer outdoors", alt: "Students exploring the outdoors on a school trip", sizeStep: 2 },
  { id: "performance", image: "/images/school/janmashtmi.webp", caption: "Janmashtami celebration", alt: "Students performing in traditional dress during a Janmashtami celebration", sizeStep: 3 },
  { id: "library", image: "/images/student-life/library-time.webp", caption: "Library time", alt: "Students spending time reading together", sizeStep: 0 },
];

const categoryPriority: Record<Category, string[]> = {
  Sports: ["relay", "football", "basketball", "yoga", "nature", "bus", "dance", "performance"],
  Music: ["tabla", "keyboard", "choir", "dance", "performance", "relay", "painting", "nature"],
  Art: ["exhibition", "painting", "dance", "performance", "keyboard", "library", "robotics", "choir"],
  Clubs: ["robotics", "science", "painting", "tabla", "keyboard", "choir", "yoga", "nature"],
  Trips: ["bus", "nature", "relay", "football", "basketball", "exhibition", "science", "library"],
  Performances: ["performance", "dance", "choir", "tabla", "keyboard", "relay", "painting", "exhibition"],
};

const getCategoryPhotos = (category: Category) => {
  const priority = categoryPriority[category];
  const ordered = [...priority, ...photos.map((photo) => photo.id).filter((id) => !priority.includes(id))];
  return ordered.map((id, index) => ({ ...photos.find((photo) => photo.id === id)!, sizeStep: index % 4 }));
};

const cardWidth = (photo: Photo) => {
  if (typeof window === "undefined") return DESKTOP_CARD_WIDTHS[photo.sizeStep]!;
  if (window.innerWidth <= 767) return photo.sizeStep % 2 === 0 ? 240 : 180;
  if (window.innerWidth <= 1024) return TABLET_CARD_WIDTHS[photo.sizeStep]!;
  return DESKTOP_CARD_WIDTHS[photo.sizeStep]!;
};

export const StudentLife = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("Sports");
  const categoryPhotos = useMemo(() => getCategoryPhotos(activeCategory), [activeCategory]);
  const [rowOne, setRowOne] = useState(() => categoryPhotos.slice(0, 8));
  const [rowTwo, setRowTwo] = useState(() => categoryPhotos.slice(8, 16));
  const [offsetOne, setOffsetOne] = useState(0);
  const [offsetTwo, setOffsetTwo] = useState(() => -(DESKTOP_CARD_WIDTHS[categoryPhotos[categoryPhotos.length - 1]!.sizeStep]! + CARD_GAP));
  const [moving, setMoving] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const activeCategoryRef = useRef(activeCategory);
  const rowOneRef = useRef(rowOne);
  const rowTwoRef = useRef(rowTwo);
  rowOneRef.current = rowOne;
  rowTwoRef.current = rowTwo;
  activeCategoryRef.current = activeCategory;

  useEffect(() => {
    const nextRowOne = categoryPhotos.slice(0, 8);
    const nextRowTwo = categoryPhotos.slice(8, 16);
    rowOneRef.current = nextRowOne;
    rowTwoRef.current = nextRowTwo;
    setRowOne(nextRowOne);
    setRowTwo(nextRowTwo);
    setOffsetOne(0);
    setOffsetTwo(-(cardWidth(nextRowTwo[nextRowTwo.length - 1]!) + CARD_GAP));
    setMoving(false);
  }, [categoryPhotos]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updateVisibility = () => setTabVisible(document.visibilityState === "visible");
    updateMotion();
    updateVisibility();
    motionQuery.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  const paused = pointerPaused || focusPaused || !visible || !tabVisible || reducedMotion;

  useEffect(() => {
    if (paused) return;
    let cancelled = false;
    let inMotion = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cycle = () => {
      if (cancelled) return;
      inMotion = true;
      setMoving(true);
      setOffsetOne(-(cardWidth(rowOneRef.current[0]!) + CARD_GAP));
      setOffsetTwo(0);
      timer = setTimeout(() => {
        if (activeCategoryRef.current !== activeCategory) {
          setMoving(false);
          return;
        }
        const nextRowOne = [...rowOneRef.current.slice(1), rowOneRef.current[0]!];
        const nextRowTwo = [rowTwoRef.current[rowTwoRef.current.length - 1]!, ...rowTwoRef.current.slice(0, -1)];
        rowOneRef.current = nextRowOne;
        rowTwoRef.current = nextRowTwo;
        setRowOne(nextRowOne);
        setRowTwo(nextRowTwo);
        setOffsetOne(0);
        setOffsetTwo(-(cardWidth(nextRowTwo[nextRowTwo.length - 1]!) + CARD_GAP));
        setMoving(false);
        inMotion = false;
        if (!cancelled) timer = setTimeout(cycle, HOLD_MS);
      }, MOVE_MS);
    };

    timer = setTimeout(cycle, 0);
    return () => {
      cancelled = true;
      if (!inMotion && timer) clearTimeout(timer);
    };
    // The row order is captured for a single synchronized step, then the loop restarts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, activeCategory]);

  const displayedRowTwo = reducedMotion ? rowTwo : [rowTwo[rowTwo.length - 1]!, ...rowTwo];
  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="student-life"
    >
      <div className={styles.container}>
        <div className={styles.introEyebrow} style={{ marginBottom: "20px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>04 — Student Life</div>
        <h2 style={{ fontSize: "64px", fontFamily: "var(--font-serif)", marginBottom: "20px" }}>
          Life beyond the <em style={{ color: "var(--color-persimmon)", fontStyle: "italic" }}>classroom</em>.
        </h2>
        <div className={styles.lifeTabs} role="tablist" aria-label="Student life categories" onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]"));
          const current = tabs.indexOf(event.target as HTMLButtonElement);
          const next = (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
          tabs[next]!.focus();
          tabs[next]!.click();
        }}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              tabIndex={activeCategory === category ? 0 : -1}
              aria-selected={activeCategory === category}
              className={`${styles.lifeTab} ${activeCategory === category ? styles.lifeTabActive : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div key={activeCategory} className={`${styles.lifeGallery} ${styles.lifeGalleryFade} ${reducedMotion ? styles.lifeGalleryReduced : ""}`} aria-label={`${activeCategory} student life photos`} onMouseEnter={() => setPointerPaused(true)} onMouseLeave={() => setPointerPaused(false)}>
        <div className={styles.lifeGalleryRow}>
          <div className={styles.lifeTrack} style={{ transform: `translate3d(${offsetOne}px, 0, 0)`, transitionDuration: moving ? `${MOVE_MS}ms` : "0ms" }}>
            {rowOne.map((photo) => (
              <div key={photo.id} tabIndex={0} onFocus={() => setFocusPaused(true)} onBlur={() => setFocusPaused(false)} className={styles.lifeGridItem} data-size-step={photo.sizeStep} style={{ "--card-width": `${DESKTOP_CARD_WIDTHS[photo.sizeStep]}px` } as React.CSSProperties}>
                {failedImages.has(photo.id) ? <div className={styles.lifeImageFallback} aria-label={`${photo.caption} photo unavailable`}><span aria-hidden="true">✦</span></div> : <Image src={photo.image} alt={photo.alt} fill sizes="(max-width: 767px) 240px, (max-width: 1024px) 340px, 420px" quality={85} loading="lazy" className={styles.lifeGridImg} onError={() => setFailedImages((current) => new Set(current).add(photo.id))} />}
                <div className={styles.lifeCaption}>{photo.caption}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.lifeGalleryRow}>
          <div className={styles.lifeTrack} style={{ transform: `translate3d(${offsetTwo}px, 0, 0)`, transitionDuration: moving ? `${MOVE_MS}ms` : "0ms" }}>
            {displayedRowTwo.map((photo, index) => {
              const leadingClone = !reducedMotion && index === 0;
              return (
              <div key={leadingClone ? `${photo.id}-leading` : photo.id} tabIndex={leadingClone ? -1 : 0} aria-hidden={leadingClone || undefined} onFocus={() => setFocusPaused(true)} onBlur={() => setFocusPaused(false)} className={styles.lifeGridItem} data-size-step={photo.sizeStep} style={{ "--card-width": `${DESKTOP_CARD_WIDTHS[photo.sizeStep]}px` } as React.CSSProperties}>
                {failedImages.has(photo.id) ? <div className={styles.lifeImageFallback} aria-label={`${photo.caption} photo unavailable`}><span aria-hidden="true">✦</span></div> : <Image src={photo.image} alt={leadingClone ? "" : photo.alt} fill sizes="(max-width: 767px) 240px, (max-width: 1024px) 340px, 420px" quality={85} loading="lazy" className={styles.lifeGridImg} onError={() => setFailedImages((current) => new Set(current).add(photo.id))} />}
                <div className={styles.lifeCaption}>{photo.caption}</div>
              </div>
            );})}
          </div>
        </div>
      </div>
    </section>
  );
};
