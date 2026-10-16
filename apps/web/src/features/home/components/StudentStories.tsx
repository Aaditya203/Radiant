"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./StudentStories.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stories = [
  { name: "Aarav", grade: "Grade 7", quote: "Building my first robot changed the way I looked at science.", note: "robotics club, Room 12", tone: "cream", image: "/images/portrait_aarav.png" },
  { name: "Meher", grade: "Grade 4", quote: "I started a school garden because I wanted to see how tomatoes grow.", note: "eco club, Greenhouse", tone: "peach", image: "/images/portrait_meher.png" },
  { name: "Ishaan", grade: "Grade 5", quote: "Our teacher let us argue with her about the planets, and she loved it.", note: "science debate, Room 9", tone: "yellow", image: "/images/portrait_ishaan.png" },
  { name: "Zoya", grade: "Grade 2", quote: "I read my first whole book here, and then I read it again.", note: "library reading nook", tone: "teal", image: "/images/portrait_zoya.png" },
];

const backgrounds = ["#FFF8EC", "#FDE6D8", "#FFF1C9", "#E8F5E9"];

export const StudentStories = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const quotesRef = useRef<(HTMLElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const activeTl = useRef<gsap.core.Timeline | null>(null);

  const [navHeight, setNavHeight] = useState(80);

  useEffect(() => {
    const navbar = document.querySelector('nav') || document.querySelector('header');
    if (navbar) {
      setNavHeight(navbar.getBoundingClientRect().height);
    }
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const deck = deckRef.current;
    if (!section || !deck) return;

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(wrappersRef.current, { clearProps: "all", autoAlpha: 1 });
        wrappersRef.current.forEach(wrapper => wrapper?.setAttribute("aria-hidden", "false"));
        if (progressRef.current) progressRef.current.style.width = "25%";
      });

      media.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 600px)", () => {
        const wrappers = wrappersRef.current.filter(Boolean) as HTMLDivElement[];
        const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
        const quotes = quotesRef.current.filter(Boolean) as HTMLElement[];

        gsap.set(wrappers, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(cards, { rotate: -12, scale: 0.94, x: -40 });
        gsap.set(quotes, { y: 24 });
        quotes.forEach(q => gsap.set(q.querySelectorAll(`.${styles.quoteWord}`), { opacity: 0.45 }));
        
        gsap.set(wrappers[0]!, { autoAlpha: 1, pointerEvents: "auto" });
        gsap.set(cards[0]!, { rotate: -2, scale: 1, x: 0 });
        gsap.set(quotes[0]!, { y: 0 });

        let activeIndex = 0;

        ScrollTrigger.create({
          trigger: section,
          start: `top top+=${navHeight}`,
          end: () => `+=${window.innerHeight * stories.length}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / stories.length, duration: { min: 0.2, max: 0.5 }, ease: "power1.inOut" },
          onUpdate: (self) => {
            const newIndex = Math.min(stories.length - 1, Math.floor(self.progress * stories.length));
            const localProgress = self.progress * stories.length - newIndex;
            
            const activeWords = quotes[newIndex]?.querySelectorAll(`.${styles.quoteWord}`);
            if (activeWords && activeWords.length > 0) {
               const litWordsCount = Math.floor(localProgress * activeWords.length * 1.5);
               activeWords.forEach((word, i) => {
                  gsap.to(word, { opacity: i <= litWordsCount ? 1 : 0.45, duration: 0.15, overwrite: "auto" });
               });
            }

            if (newIndex !== activeIndex) {
              const oldIndex = activeIndex;
              activeIndex = newIndex;
              wrappers.forEach((wrapper, index) => wrapper.setAttribute("aria-hidden", index === newIndex ? "false" : "true"));

              if (activeTl.current) {
                activeTl.current.kill();
              }

              wrappers.forEach((w, i) => {
                if (i !== oldIndex && i !== newIndex) {
                   gsap.set(w, { autoAlpha: 0, pointerEvents: "none", overwrite: "auto" });
                   gsap.set(cards[i]!, { rotate: -12, scale: 0.94, x: -40, overwrite: "auto" });
                   gsap.set(quotes[i]!, { y: 24, overwrite: "auto" });
                   gsap.set(quotes[i]!.querySelectorAll(`.${styles.quoteWord}`), { opacity: 0.45, overwrite: "auto" });
                }
              });

              if (counterRef.current) counterRef.current.textContent = `0${activeIndex + 1} / 0${stories.length}`;
              dotsRef.current.forEach((dot, dotIndex) => dot?.setAttribute("aria-current", dotIndex === activeIndex ? "step" : "false"));
              gsap.to(section, { backgroundColor: backgrounds[activeIndex], duration: 0.3 });

              activeTl.current = gsap.timeline();
              
              activeTl.current.to(wrappers[oldIndex]!, { autoAlpha: 0, pointerEvents: "none", duration: 0.3, ease: "power2.inOut" }, 0);
              activeTl.current.to(cards[oldIndex]!, { rotate: -12, x: -40, duration: 0.3, ease: "power2.inOut" }, 0);
              activeTl.current.to(quotes[oldIndex]!, { y: -24, duration: 0.3, ease: "power2.inOut" }, 0);
              activeTl.current.set(quotes[oldIndex]!.querySelectorAll(`.${styles.quoteWord}`), { opacity: 0.45 });

              activeTl.current.to(wrappers[newIndex]!, { autoAlpha: 1, pointerEvents: "auto", duration: 0.45, ease: "power2.out" }, 0.3);
              activeTl.current.to(cards[newIndex]!, { rotate: newIndex % 2 ? 2 : -2, scale: 1, x: 0, duration: 0.45, ease: "power2.out" }, 0.3);
              activeTl.current.to(quotes[newIndex]!, { y: 0, duration: 0.45, ease: "power2.out" }, 0.3);
            }

            if (progressRef.current) progressRef.current.style.width = `${self.progress * 100}%`;
          }
        });
      });

      media.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px), (prefers-reduced-motion: no-preference) and (max-height: 599px)", () => {
        gsap.set(wrappersRef.current, { clearProps: "all" });
        wrappersRef.current.forEach(wrapper => wrapper?.setAttribute("aria-hidden", "false"));
        gsap.from(wrappersRef.current, { autoAlpha: 0, y: 24, duration: 0.45, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 82%", once: true } });
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);
      window.addEventListener("font-change", refresh);
      const observer = new MutationObserver(refresh);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-font"] });
      const images = section.querySelectorAll("img");
      images.forEach((img) => img.addEventListener("load", refresh));
      ScrollTrigger.refresh();

      return () => {
        media.revert();
        observer.disconnect();
        window.removeEventListener("load", refresh);
        window.removeEventListener("font-change", refresh);
        images.forEach((img) => img.removeEventListener("load", refresh));
      };
    }, section);

    return () => ctx.revert();
  }, [navHeight]);

  const goToStory = (index: number) => {
    const trigger = ScrollTrigger.getAll().find((item) => item.trigger === sectionRef.current);
    if (!trigger) return;
    const top = trigger.start + (trigger.end - trigger.start) * (index / stories.length);
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section 
      ref={sectionRef} 
      id="stories" 
      className={styles.section}
      style={{
        paddingTop: `calc(${navHeight}px + 16px)`,
        height: "100svh"
      }}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <div className={styles.eyebrow}>06 — Student Stories</div>
            <h2>Small voices. <em>Big</em> stories.</h2>
          </div>
          <div className={styles.intro}>
            <p>Real moments from our classrooms, in our students&apos; own words.</p>
            <div className={styles.controls}>
              <span ref={counterRef} className={styles.counter}>01 / 04</span>
              <div className={styles.progress} aria-label="Story progress">
                <span ref={progressRef} className={styles.progressFill} />
                {stories.map((story, index) => <button ref={(el) => { dotsRef.current[index] = el; }} key={story.name} type="button" aria-label={`Go to ${story.name}'s story`} aria-current={index === 0 ? "step" : "false"} onClick={() => goToStory(index)} />)}
              </div>
            </div>
          </div>
        </header>

        <div ref={deckRef} className={styles.deck}>
          {stories.map((story, index) => (
            <div key={story.name} ref={(el) => { wrappersRef.current[index] = el; }} className={styles.storyWrapper} aria-hidden={index !== 0}>
              <div className={styles.photoColumn}>
                <article ref={(el) => { cardsRef.current[index] = el; }} className={`${styles.photoCard} ${styles[story.tone]}`}>
                  <span className={styles.tape} aria-hidden="true" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.image}
                    alt={`Illustrated portrait of ${story.name}`}
                    className={styles.portraitImg}
                  />
                  <div className={styles.archive}><span>Student Archive</span><small>2025</small></div>
                </article>
              </div>
              
              <div className={styles.quoteColumn}>
                <article ref={(el) => { quotesRef.current[index] = el; }} className={styles.quoteCard}>
                  <span className={styles.quoteMark} aria-hidden="true">“</span>
                  <p>{story.quote.split(" ").map((word, wordIndex) => <span className={styles.quoteWord} key={`${story.name}-${wordIndex}`}>{word} </span>)}</p>
                  <h3>{story.name} — {story.grade}</h3>
                  <div className={styles.note}><span aria-hidden="true">→</span>{story.note}</div>
                </article>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
