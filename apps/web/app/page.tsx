import React from "react";
import { Navigation } from "../src/features/home/components/Navigation";
import { Hero } from "../src/features/home/components/Hero";
import { ToppersMarquee } from "../src/features/home/components/ToppersMarquee";
import { SchoolIntro } from "../src/features/home/components/SchoolIntro";
import { Learning } from "../src/features/home/components/Learning";
import { Academics } from "../src/features/home/components/Academics";
import { StudentLife } from "../src/features/home/components/StudentLife";
import { Campus } from "../src/features/home/components/Campus";
import { ReviewsMarquee } from "../src/features/home/components/ReviewsMarquee";
import { Events } from "../src/features/home/components/StoriesTeachersEvents";
import { StudentStories } from "../src/features/home/components/StudentStories";
import { Admissions, Footer } from "../src/features/home/components/Footer";
import { ChatWidget } from "../src/features/home/components/ChatWidget";
import styles from "../src/styles/home.module.css";

export default function Home() {
  return (
    <>
      <Navigation hero="dark" />
      <main>
        <Hero />
        <ToppersMarquee />
        <SchoolIntro />
        <Learning />
        <Academics />
        <StudentLife />
        <Campus />
        <ReviewsMarquee />
        <StudentStories />
        <Events />
        <Admissions />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
