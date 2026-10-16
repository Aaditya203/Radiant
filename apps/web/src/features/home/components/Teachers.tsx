"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const teachers = [
  {
    id: "rao",
    name: "Ms. Rao",
    subject: "Science",
    color: "#2A9D8F",
    quote: "I never answer a why with a because.",
    fun: "Favorite thing in her bag: a magnifying glass",
    img: "/images/teachers/rao.webp",
  },
  {
    id: "patel",
    name: "Mr. Patel",
    subject: "Mathematics",
    color: "#E05228",
    quote: "Mistakes are just data points.",
    fun: "Can juggle 5 tennis balls",
    img: "/images/teachers/patel.webp",
  },
  {
    id: "sharma",
    name: "Mrs. Sharma",
    subject: "Arts",
    color: "#F2B632",
    quote: "Every child is an artist.",
    fun: "Has 12 different shades of blue paint",
    img: "/images/teachers/sharma.webp",
  },
  {
    id: "khan",
    name: "Mr. Khan",
    subject: "Sports",
    color: "#2E5C48",
    quote: "Teamwork makes the dream work.",
    fun: "Can run a mile in 5 minutes",
    img: "/images/teachers/khan.webp",
  },
  {
    id: "iyer",
    name: "Mrs. Iyer",
    subject: "Languages",
    color: "#F4A261",
    quote: "A new language is a new life.",
    fun: "Speaks 6 languages fluently",
    img: "/images/teachers/iyer.webp",
  },
  {
    id: "dsouza",
    name: "Ms. D'Souza",
    subject: "Music",
    color: "#1E1B16",
    quote: "Where words fail, music speaks.",
    fun: "Plays 4 instruments",
    img: "/images/teachers/dsouza.webp",
  }
];

const DRIFT_SPEED_DESKTOP = 40;
const DRIFT_SPEED_MOBILE = 28;

const TeacherImage = ({ src, alt, color, name }: { src: string, alt: string, color: string, name: string }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
    return (
      <div style={{ width: "100%", height: "100%", backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: "48px", color: "#FFF8EC" }}>
        {initials}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4/4.4", overflow: "hidden", borderBottom: "1.5px solid var(--color-ink, #1f1f1f)" }}>
      <Image 
        src={src} 
        alt={alt} 
        fill 
        sizes="(max-width: 768px) 70vw, 340px"
        style={{ objectFit: "cover", objectPosition: "center 20%" }} 
        onError={() => setError(true)}
      />
    </div>
  );
};

const splitHeaderWords = (text: string) => {
  return text.split(" ").map((word, i) => (
    <span key={i} className="header-word" style={{ display: "inline-block", marginRight: "0.25em", paddingBottom: "0.15em" }}>
      {word}
    </span>
  ));
};

export const Teachers = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const goToIndexRef = useRef<((i: number) => void) | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      const handleFontChange = () => ScrollTrigger.refresh();
      window.addEventListener('font-change', handleFontChange);

      const mm = gsap.matchMedia();

      // Header entrance animation (shared)
      gsap.set(".header-word", { opacity: 0, y: 40 });
      gsap.to(".header-word", {
        opacity: 1, y: 0, stagger: 0.06, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".teachers-header", start: "top 85%", once: true }
      });

      mm.add({
        reduceMotion: "(prefers-reduced-motion: reduce)",
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)"
      }, (context) => {
        const { reduceMotion, isMobile } = context.conditions as { reduceMotion: boolean, isMobile: boolean };

        if (reduceMotion) {
          gsap.set(".teacher-card", { scale: 1, opacity: 1, y: 0 });
          return;
        }

        const baseSpeed = isMobile ? DRIFT_SPEED_MOBILE : DRIFT_SPEED_DESKTOP;
        
        let currentX = 0;
        let speed = baseSpeed;
        let targetSpeed = baseSpeed;
        let trackWidth = 0;
        let wrapperCenter = 0;
        let trackBaseX = 0;
        let localCenters: number[] = [];
        let maxDist = 0;
        let currentCenterIndex = -1;

        let isDragging = false;
        let isAnimatingToCenter = false;
        let dragStartX = 0;
        let dragStartCurrentX = 0;
        let resumeTimeout: NodeJS.Timeout;

        const track = trackRef.current;
        if (!track) return;

        const cardsWrap = gsap.utils.toArray('.teacher-card-wrap') as HTMLElement[];
        const cards = gsap.utils.toArray('.teacher-card') as HTMLElement[];
        const pills = gsap.utils.toArray('.subject-pill') as HTMLElement[];
        const N = teachers.length;

        const scaleSetters = cards.map(c => gsap.quickSetter(c, "scale"));
        const opacitySetters = cards.map(c => gsap.quickSetter(c, "opacity"));
        const ySetters = cards.map(c => gsap.quickSetter(c, "y", "px"));
        const trackXSetter = gsap.quickSetter(track, "x", "px");

        const measure = () => {
          const prevX = currentX;
          gsap.set(track, { x: 0 });
          
          if (cardsWrap[N] && cardsWrap[0]) {
            trackWidth = cardsWrap[N].offsetLeft - cardsWrap[0].offsetLeft;
          }
          trackBaseX = track.getBoundingClientRect().left;
          wrapperCenter = window.innerWidth / 2;
          
          localCenters = cardsWrap.map(c => c.offsetLeft + c.offsetWidth / 2);
          maxDist = (cardsWrap[0]?.offsetWidth || 300) * 1.2;

          gsap.set(track, { x: prevX });
        };

        measure();
        window.addEventListener('resize', measure);
        const refreshObs = new MutationObserver(measure);
        refreshObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-font"] });

        const updateFocus = () => {
          let closestIndex = 0;
          let minDistance = Infinity;

          cardsWrap.forEach((c, i) => {
            const globalCenter = trackBaseX + currentX + localCenters[i]!;
            const dist = Math.abs(globalCenter - wrapperCenter);
            
            if (dist < minDistance) {
               minDistance = dist;
               closestIndex = i;
            }

            const normDist = Math.min(1, dist / maxDist);
            const easeDist = gsap.parseEase("power2.out")(normDist); 
            
            const cardScale = isMobile ? 0.9 : 0.84;
            scaleSetters[i]?.(1 - (1 - cardScale) * easeDist);
            opacitySetters[i]?.(1 - 0.45 * easeDist);
            ySetters[i]?.(-16 * (1 - easeDist));
            
            const card = cards[i];
            if (card) {
               card.style.setProperty('--lift', (1 - easeDist).toString());
               card.style.zIndex = Math.round((1 - easeDist) * 100).toString();
            }
          });

          if (closestIndex !== currentCenterIndex) {
             currentCenterIndex = closestIndex;
             const realIndex = closestIndex % N;
             dotsRef.current.forEach((dot, idx) => dot?.setAttribute("aria-current", idx === realIndex ? "true" : "false"));
             const pill = pills[closestIndex];
             if (pill) {
               gsap.fromTo(pill, { scale: 1 }, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, overwrite: "auto" });
             }
          }
        };

        const tick = (time: number, deltaTime: number) => {
          if (!isDragging && !isAnimatingToCenter) {
             speed += (targetSpeed - speed) * 0.05;
             currentX -= speed * (deltaTime / 1000);
             currentX = gsap.utils.wrap(-trackWidth, 0, currentX);
          }
          trackXSetter(currentX);
          updateFocus();
        };

        gsap.ticker.add(tick);

        const io = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            targetSpeed = (entry.isIntersecting && !document.hidden) ? baseSpeed : 0;
          });
        });
        if (sectionRef.current) io.observe(sectionRef.current);

        const handleVis = () => { targetSpeed = document.hidden ? 0 : baseSpeed; };
        document.addEventListener('visibilitychange', handleVis);

        const handleEnter = () => { if (!isDragging) targetSpeed = 0; };
        const handleLeave = () => { if (!isDragging && !isAnimatingToCenter) targetSpeed = baseSpeed; };
        track.addEventListener('mouseenter', handleEnter);
        track.addEventListener('mouseleave', handleLeave);
        track.addEventListener('focusin', handleEnter);
        track.addEventListener('focusout', handleLeave);

        const onPointerDown = (e: PointerEvent) => {
          isDragging = true;
          dragStartX = e.clientX;
          dragStartCurrentX = currentX;
          targetSpeed = 0;
          clearTimeout(resumeTimeout);
          track.setPointerCapture(e.pointerId);
        };
        const onPointerMove = (e: PointerEvent) => {
          if (!isDragging) return;
          const dx = e.clientX - dragStartX;
          currentX = gsap.utils.wrap(-trackWidth, 0, dragStartCurrentX + dx);
        };
        const onPointerUp = (e: PointerEvent) => {
          if (!isDragging) return;
          isDragging = false;
          track.releasePointerCapture(e.pointerId);
          resumeTimeout = setTimeout(() => { targetSpeed = baseSpeed; }, 2000);
        };
        track.addEventListener('pointerdown', onPointerDown);
        track.addEventListener('pointermove', onPointerMove);
        track.addEventListener('pointerup', onPointerUp);
        track.addEventListener('pointercancel', onPointerUp);

        const proxyObj = { x: 0 };
        goToIndexRef.current = (idx: number) => {
          const c1 = idx;
          const c2 = idx + N;
          const g1 = trackBaseX + currentX + localCenters[c1]!;
          const g2 = trackBaseX + currentX + localCenters[c2]!;
          const targetIdx = Math.abs(g1 - wrapperCenter) < Math.abs(g2 - wrapperCenter) ? c1 : c2;
          
          const targetGlobal = trackBaseX + currentX + localCenters[targetIdx]!;
          const delta = targetGlobal - wrapperCenter;
          const targetCurrentX = currentX - delta;
          
          isAnimatingToCenter = true;
          targetSpeed = 0;
          clearTimeout(resumeTimeout);
          proxyObj.x = currentX;
          
          gsap.to(proxyObj, {
            x: targetCurrentX,
            duration: 0.6,
            ease: "power3.out",
            onUpdate: () => {
              currentX = gsap.utils.wrap(-trackWidth, 0, proxyObj.x);
            },
            onComplete: () => {
              isAnimatingToCenter = false;
              resumeTimeout = setTimeout(() => { targetSpeed = baseSpeed; }, 2000);
            }
          });
        };

        return () => {
          gsap.ticker.remove(tick);
          io.disconnect();
          window.removeEventListener('resize', measure);
          document.removeEventListener('visibilitychange', handleVis);
          refreshObs.disconnect();
        };
      });

      return () => {
        window.removeEventListener('font-change', handleFontChange);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="teachers"
      aria-labelledby="teachers-title"
      style={{ 
        width: "100%", 
        paddingTop: "clamp(120px, 12vw, 160px)",
        paddingBottom: "clamp(80px, 9vw, 140px)",
        backgroundColor: "var(--color-cream, #FFF8EC)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .teacher-card {
          box-shadow: var(--shadow-offset, 6px) var(--shadow-offset, 6px) 0 #1f1f1f;
          transition: box-shadow 0.1s linear;
        }
        .teacher-card {
          --shadow-offset: calc(6px + 6px * var(--lift, 0));
        }
        @media (prefers-reduced-motion: reduce) {
          .track-viewport { overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
          .track-viewport::-webkit-scrollbar { display: none; }
          .teacher-card-wrap { scroll-snap-align: center; }
        }
      `}} />

      {/* Doodles */}
      <svg className="doodle-1" style={{ position: "absolute", top: "10%", right: "15%", opacity: 0.05, pointerEvents: "none" }} width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" fill="#1f1f1f" />
      </svg>

      <div style={{ width: "100%", maxWidth: "1680px", marginInline: "auto", paddingInline: "clamp(24px, 5vw, 96px)" }}>
        {/* Header */}
        <div className="teachers-header" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", marginBottom: "60px" }}>
          <div style={{ maxWidth: "800px" }}>
            <div style={{ color: "#E05228", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, marginBottom: "24px" }}>
              <span className="header-word" style={{ display: "inline-block" }}>07</span>
              <span className="header-word" style={{ display: "inline-block", marginInline: "8px" }}>—</span>
              <span className="header-word" style={{ display: "inline-block" }}>TEACHERS</span>
            </div>
            <h2 id="teachers-title" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.75rem, 5.5vw, 5rem)", lineHeight: 1.1, margin: 0, color: "var(--color-ink, #1E1B16)" }}>
              {splitHeaderWords("The people who ")}
              <span className="header-word" style={{ display: "inline-block", position: "relative", paddingBottom: "0.15em" }}>
                <em style={{ fontStyle: "italic", color: "#E05228", fontWeight: 400 }}>light the spark.</em>
                <svg width="100%" height="12" viewBox="0 0 100 12" preserveAspectRatio="none" style={{ position: "absolute", bottom: "0.1em", left: 0, zIndex: -1 }}>
                  <path d="M0,6 Q25,0 50,6 T100,6" fill="none" stroke="#F2B632" strokeWidth="3" />
                </svg>
              </span>
            </h2>
          </div>
          
          <div style={{ maxWidth: "380px" }}>
            <p className="header-word" style={{ fontFamily: "var(--font-body)", fontSize: "18px", lineHeight: 1.5, color: "rgba(30, 27, 22, 0.8)", margin: "0 0 16px 0" }}>
              Meet the teachers who turn "why?" into "wow!"
            </p>
            <a href="#" className="header-word" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "14px", color: "var(--color-ink, #1E1B16)", textDecoration: "none" }}>
              View all faculty <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Row Track */}
      <div className="track-viewport" style={{ width: "100vw", marginInline: "calc(-50vw + 50%)", overflow: "hidden", paddingBlock: "48px" }}>
        <ul 
          ref={trackRef} 
          style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", margin: 0, padding: 0, listStyle: "none", touchAction: "pan-y", width: "max-content", gap: "clamp(16px, 2vw, 32px)", paddingLeft: "clamp(16px, 2vw, 32px)" }}
        >
          {[...teachers, ...teachers].map((t, i) => (
            <li 
              key={`${t.id}-${i}`} 
              className="teacher-card-wrap"
              style={{ flexShrink: 0, width: "clamp(260px, 70vw, 340px)", willChange: "transform" }}
            >
              <article 
                className="teacher-card"
                role="button"
                tabIndex={i >= teachers.length ? -1 : 0}
                aria-hidden={i >= teachers.length}
                onClick={() => goToIndexRef.current?.(i)}
                onKeyDown={(e) => e.key === 'Enter' && goToIndexRef.current?.(i)}
                style={{
                  backgroundColor: "var(--color-cream, #FFF8EC)",
                  border: "1.5px solid var(--color-ink, #1f1f1f)",
                  borderRadius: "24px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  willChange: "transform, opacity",
                  transformOrigin: "center center"
                }}
              >
                <figure style={{ margin: 0, padding: 0, width: "100%" }}>
                  <TeacherImage src={t.img} alt={`${t.name}, ${t.subject} teacher`} color={t.color} name={t.name} />
                  <figcaption style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "180px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: 0, fontWeight: 700, color: "var(--color-ink, #1E1B16)" }}>{t.name}</h3>
                      <span className="subject-pill" style={{ backgroundColor: t.color, color: "#FFF8EC", padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-body)", willChange: "transform" }}>
                        {t.subject}
                      </span>
                    </div>
                    <div style={{ position: "relative", marginBottom: "20px" }}>
                      <p style={{ fontFamily: "var(--font-accent)", fontSize: "22px", color: "#E05228", margin: 0, lineHeight: 1.3 }}>
                        "{t.quote}"
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "auto" }}>
                      <Sparkles size={14} color="#F2B632" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(30,27,22,0.6)", margin: 0, lineHeight: 1.4 }}>
                        {t.fun}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </article>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Dots Indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
        {teachers.map((_, i) => (
          <button 
            key={i} 
            ref={el => { dotsRef.current[i] = el; }}
            onClick={() => goToIndexRef.current?.(i)}
            aria-label={`Focus teacher ${i + 1}`}
            aria-current={i === 0 ? "true" : "false"}
            style={{ 
              width: "8px", height: "8px", borderRadius: "50%", padding: 0, border: "none", 
              backgroundColor: "#1f1f1f", opacity: 0.2, cursor: "pointer", transition: "opacity 0.2s" 
            }}
          />
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `button[aria-current="true"] { opacity: 1 !important; }`}} />
    </section>
  );
};
