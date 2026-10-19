"use client";

import { Fragment, useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import styles from "./Hero.module.css";

type HeroSlide = {
  id: string;
  src: string;
  mobileSrc?: string;
  alt: string;
  objectPosition: string;
  eyebrow?: string;
  headline: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

// Use original school photos at native resolution; keep hero sources 2K wide or larger where available.
// Set objectPosition per image to preserve students and activity through the desktop crop.
// Optional mobile crops: 1080x1350. // TODO: replace with real photo (needs parental consent).
const slides: HeroSlide[] = [
  { id: "welcome", src: "/images/school/ground.webp", alt: "Radiant Public School students exercising together on the school ground", objectPosition: "center 68%", eyebrow: "RADIANT PUBLIC SCHOOL · BHELDI", headline: "Every question is welcome here.", subtext: "A place to learn, explore, and grow together in Bheldi, Saran.", ctaLabel: "BOOK A VISIT", ctaHref: "#admissions" },
  { id: "curiosity", src: "/images/school/science-model.webp", alt: "Students presenting a science model at school", objectPosition: "center 60%", eyebrow: "LEARN BY MAKING", headline: "Where curiosity meets craft", subtext: "A place to learn, explore, and grow together in Bheldi, Saran." },
  { id: "belong", src: "/images/school/tiranga.webp", alt: "Students and staff gathered for a flag ceremony at Radiant Public School", objectPosition: "center 65%", eyebrow: "A PLACE TO BELONG", headline: "Play, perform, belong", subtext: "A place to learn, explore, and grow together in Bheldi, Saran." },
  { id: "campus", src: "/images/school/plantation.webp", alt: "Students and teachers planting saplings in the school grounds", objectPosition: "center 58%", eyebrow: "ROOM TO GROW", headline: "A campus built for kids", subtext: "A place to learn, explore, and grow together in Bheldi, Saran." },
  { id: "teachers", src: "/images/school/main.webp", alt: "Radiant Public School students and staff gathered for a school celebration", objectPosition: "center 52%", eyebrow: "RADIANT PUBLIC SCHOOL", headline: "Teachers who care", subtext: "A place to learn, explore, and grow together in Bheldi, Saran." },
];

const AUTO_MS = 6000;

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const pausedRef = useRef(false);
  const visibleRef = useRef(true);
  const pointerStartRef = useRef<number | null>(null);
  const manualPauseRef = useRef(false);
  const changeSlideRef = useRef<(index: number) => void>(() => undefined);
  const reasonsRef = useRef(new Set<string>());
  const timerRef = useRef<gsap.core.Tween | null>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const kenBurnsRef = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const setPauseReason = useCallback((reason: string, paused: boolean) => {
    if (paused) reasonsRef.current.add(reason);
    else reasonsRef.current.delete(reason);
    pausedRef.current = reasonsRef.current.size > 0 || manualPauseRef.current;
    if (pausedRef.current) {
      timerRef.current?.pause();
      progressTweenRef.current?.pause();
    } else {
      timerRef.current?.resume();
      progressTweenRef.current?.resume();
    }
  }, []);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const onMotionChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", onMotionChange);
    const mobileImageScale = window.matchMedia("(max-width: 767px)").matches ? 1.04 : 1.08;

    const ctx = gsap.context(() => {
      const contents = contentRefs.current.filter(Boolean) as HTMLDivElement[];
      const images = imageRefs.current.filter(Boolean) as HTMLImageElement[];
      const slideNodes = slideRefs.current.filter(Boolean) as HTMLElement[];
      const initialIndex = currentRef.current;
      gsap.set(slideNodes, { autoAlpha: 0, zIndex: 0 });
      gsap.set(contents, { autoAlpha: 0, y: 18 });
      if (slideRefs.current[initialIndex]) gsap.set(slideRefs.current[initialIndex], { autoAlpha: 1, zIndex: 1 });
      if (contentRefs.current[initialIndex]) gsap.set(contentRefs.current[initialIndex], { autoAlpha: 1, y: 0 });
      if (images[initialIndex]) gsap.set(images[initialIndex], { scale: mobileImageScale });
      if (reducedMotion) {
        gsap.set(images, { scale: 1 });
        gsap.set(contents, { clearProps: "transform" });
      } else {
        if (images[initialIndex]) kenBurnsRef.current = gsap.to(images[initialIndex], { scale: 1, duration: 7, ease: "none" });
        const firstWords = contents[initialIndex]?.querySelectorAll(`.${styles.headlineWord}`);
        if (firstWords?.length) {
          transitionRef.current = gsap.timeline({ onComplete: () => { gsap.set(firstWords, { clearProps: "transform" }); if (contents[initialIndex]) gsap.set(contents[initialIndex], { clearProps: "transform" }); } })
            .fromTo(firstWords, { y: 28 }, { y: 0, duration: 0.62, stagger: 0.05, ease: "power3.out", overwrite: "auto" });
        }
      }
    }, hero);

    const preloadNext = (index: number) => {
      const next = slides[(index + 1) % slides.length];
      if (next) { const preload = new window.Image(); preload.src = next.src; }
    };

    const setPlayback = () => {
      const shouldPause = reasonsRef.current.size > 0 || manualPauseRef.current || !visibleRef.current;
      pausedRef.current = shouldPause;
      if (shouldPause) {
        timerRef.current?.pause();
        progressTweenRef.current?.pause();
      } else {
        timerRef.current?.resume();
        progressTweenRef.current?.resume();
      }
    };

    const schedule = () => {
      timerRef.current?.kill();
      progressTweenRef.current?.kill();
      if (slides.length < 2) return;
      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
        if (!reducedMotion) progressTweenRef.current = gsap.to(progressRef.current, { scaleX: 1, duration: AUTO_MS / 1000, ease: "none" });
      }
      timerRef.current = gsap.delayedCall(AUTO_MS / 1000, () => changeSlide((currentRef.current + 1) % slides.length));
      setPlayback();
    };

    const changeSlide = (nextIndex: number) => {
      if (nextIndex === currentRef.current || slides.length < 2) return;
      timerRef.current?.kill();
      progressTweenRef.current?.kill();
      const oldIndex = currentRef.current;
      const oldSlide = slideRefs.current[oldIndex];
      const newSlide = slideRefs.current[nextIndex];
      const oldContent = contentRefs.current[oldIndex];
      const newContent = contentRefs.current[nextIndex];
      const newImage = imageRefs.current[nextIndex];
      if (!oldSlide || !newSlide || !oldContent || !newContent) return;
      currentRef.current = nextIndex;
      setActive(nextIndex);
      preloadNext(nextIndex);
      ctx.add(() => {
        kenBurnsRef.current?.kill();
        transitionRef.current?.kill();
        const timeline = gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            gsap.set(newContent, { y: 0, clearProps: "transform" });
            gsap.set(newContent.querySelectorAll("*"), { opacity: 1, clearProps: "transform" });
            schedule();
          },
        });
        transitionRef.current = timeline;
        timeline.to(oldContent, { autoAlpha: 0, y: reducedMotion ? 0 : -16, duration: reducedMotion ? 0 : 0.3, ease: "power2.out", overwrite: "auto" });
        timeline.set(newSlide, { zIndex: 2, autoAlpha: 1 }, "<");
        timeline.set(oldSlide, { zIndex: 1 }, "<");
        timeline.fromTo(newSlide, { autoAlpha: 0 }, { autoAlpha: 1, duration: reducedMotion ? 0.2 : 0.7, ease: "power1.out" }, "<");
        timeline.to(oldSlide, { autoAlpha: 0, duration: reducedMotion ? 0.2 : 0.7, ease: "power1.out" }, "<");
        if (newImage && !reducedMotion) kenBurnsRef.current = gsap.fromTo(newImage, { scale: mobileImageScale }, { scale: 1, duration: 7, ease: "none", overwrite: "auto" });
        timeline.fromTo(newContent, { autoAlpha: 0, y: reducedMotion ? 0 : 20 }, { autoAlpha: 1, y: 0, duration: reducedMotion ? 0.2 : 0.45, ease: reducedMotion ? "power1.out" : "power3.out" }, reducedMotion ? 0 : 0.3);
        const words = newContent.querySelectorAll(`.${styles.headlineWord}`);
        if (words.length && !reducedMotion) timeline.fromTo(words, { y: 24 }, { y: 0, duration: 0.55, stagger: 0.05, ease: "power3.out", overwrite: "auto" }, 0.3);
      });
    };
    changeSlideRef.current = changeSlide;

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = Boolean(entry?.isIntersecting);
      setPlayback();
    }, { threshold: 0.15 });
    observer.observe(hero);
    const refreshLayout = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refreshLayout);
    const fontObserver = new MutationObserver(refreshLayout);
    fontObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-font"] });
    const onVisibility = () => setPauseReason("hidden", document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    setPauseReason("hidden", document.hidden);
    preloadNext(currentRef.current);
    schedule();

    return () => {
      observer.disconnect();
      fontObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", onMotionChange);
      ScrollTrigger.refresh();
      timerRef.current?.kill();
      progressTweenRef.current?.kill();
      transitionRef.current?.kill();
      kenBurnsRef.current?.kill();
      ctx.revert();
    };
  }, [reducedMotion, setPauseReason]);

  const goTo = (index: number) => {
    setPauseReason("interaction", false);
    const target = (index + slides.length) % slides.length;
    if (target === currentRef.current) return;
    changeSlideRef.current(target);
  };

  const renderHeadline = (slide: HeroSlide) => {
    const words = slide.headline.split(/\s+/);
    return words.map((part, partIndex) => {
      const isWelcome = part.toLowerCase().replace(/[.,!?]/g, "") === "welcome";
      return <Fragment key={`${slide.id}-${partIndex}`}><span aria-hidden="true" className={`${styles.headlineWord} ${isWelcome ? styles.welcome : ""}`}>{part}</span>{partIndex < words.length - 1 ? " " : null}</Fragment>;
    });
  };

  const setManualPaused = () => {
    const paused = !manualPauseRef.current;
    manualPauseRef.current = paused;
    setManualPause(paused);
    setPauseReason("manual", paused);
  };

  const onPointerDown = (event: import("react").PointerEvent<HTMLElement>) => { pointerStartRef.current = event.clientX; };
  const onPointerUp = (event: import("react").PointerEvent<HTMLElement>) => {
    const delta = event.clientX - (pointerStartRef.current ?? event.clientX);
    if (Math.abs(delta) > 50) goTo(active + (delta < 0 ? 1 : -1));
    pointerStartRef.current = null;
  };

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      role="region"
      aria-roledescription="carousel"
      aria-label="Radiant Public School highlights"
      tabIndex={0}
      onPointerEnter={(event) => { if (window.matchMedia("(hover: hover)").matches && event.pointerType !== "touch") setPauseReason("hover", true); }}
      onPointerLeave={(event) => { if (window.matchMedia("(hover: hover)").matches && event.pointerType !== "touch") setPauseReason("hover", false); setPauseReason("interaction", false); }}
      onFocusCapture={(event) => { if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) setPauseReason("focus", true); }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPauseReason("focus", false); }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
      }}
    >
      {slides.map((slide, index) => (
        <div key={slide.id} ref={(element) => { slideRefs.current[index] = element; }} className={styles.slide} style={{ zIndex: index === active ? 1 : 0 }} aria-hidden={active !== index} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
          <div className={styles.imageLayer} style={{ backgroundPosition: slide.objectPosition }}>
            <picture>
              {slide.mobileSrc && <source media="(max-width: 1023px)" srcSet={slide.mobileSrc} />}
              <Image ref={(element) => { imageRefs.current[index] = element; }} src={slide.src} alt={slide.alt} fill sizes="100vw" quality={85} priority={index === 0} loading={index === 0 ? "eager" : "lazy"} style={{ objectPosition: slide.objectPosition }} onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
            </picture>
          </div>
        </div>
      ))}

      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.topShade} aria-hidden="true" />
      <div className={styles.bottomShade} aria-hidden="true" />

      {slides.map((slide, index) => (
        <div key={`${slide.id}-content`} className={styles.contentWrap} style={{ zIndex: 5 }} data-active={active === index}>
          <div ref={(element) => { contentRefs.current[index] = element; }} className={styles.content}>
            <div className={styles.badge}><span className={styles.badgeMark}>✳</span>{slide.eyebrow ?? "RADIANT PUBLIC SCHOOL · BHELDI"}</div>
            <h1 aria-label={slide.headline}>{renderHeadline(slide)}</h1>
            <p>{slide.subtext ?? "A place to learn, explore, and grow together in Bheldi, Saran."}</p>
            <div className={styles.actions}>
              <a href={slide.ctaHref ?? "#admissions"} tabIndex={active === index ? 0 : -1} className={styles.primary}>{slide.ctaLabel ?? "BOOK A VISIT"}</a>
              <a href="#student-life" tabIndex={active === index ? 0 : -1} className={styles.secondary}><Play size={15} fill="currentColor" /> SEE A DAY AT SCHOOL</a>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.topShade} aria-hidden="true" />
      <div className={styles.bottomShade} aria-hidden="true" />

      {slides.length > 1 && <>
        <div className={styles.arrows}>
          <button type="button" aria-label="Previous slide" onClick={() => goTo(active - 1)}><ChevronLeft size={20} /></button>
          <button type="button" aria-label="Next slide" onClick={() => goTo(active + 1)}><ChevronRight size={20} /></button>
        </div>
        <div className={styles.controls}>
          <div className={styles.indicators}>{slides.map((slide, index) => <button key={slide.id} type="button" aria-label={`Show slide ${index + 1}`} aria-current={active === index ? "true" : undefined} onClick={() => goTo(index)} />)}</div>
          <span className={styles.counter}>0{active + 1} <i>/</i> 0{slides.length}</span>
          <button className={styles.pause} type="button" aria-label={manualPause ? "Play slides" : "Pause slides"} onClick={setManualPaused}>{manualPause ? <Play size={13} /> : <Pause size={13} />}</button>
        </div>
      </>}
      <div className={styles.progressTrack} aria-hidden="true"><div ref={progressRef} className={styles.progress} /></div>
      <div className={styles.announcement}><span className={styles.announcementLocation}>Radiant Public School<span className={styles.announcementBheldi}> · Bheldi</span><span className={styles.announcementSecondary}><b>|</b> Saran, Bihar</span></span><a href="#admissions">Book a visit <span aria-hidden="true">→</span></a></div>
    </section>
  );
};
