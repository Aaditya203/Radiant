import Image from "next/image";
import styles from "./ToppersMarquee.module.css";

const studentResults = [
  {
    name: "Vishal Kumar Ray",
    image: "/images/achievements/vishal-kumar-ray.webp",
    percentage: "90%",
    category: "Class 10 · CBSE Board Exam 2026",
    result: "School topper · 450 / 500",
    alt: "Portrait of Class 10 school topper Vishal Kumar Ray",
    featured: true,
  },
  {
    name: "Aditya Raj Singh",
    image: "/images/achievements/aditya-raj-singh.webp",
    percentage: "91.2%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Aditya Raj Singh",
  },
  {
    name: "Anuska Kumari",
    image: "/images/achievements/anuska-kumari.webp",
    percentage: "92.00%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Anuska Kumari",
  },
  {
    name: "Shweta Shaw",
    image: "/images/achievements/shweta-shaw.webp",
    percentage: "87.60%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Shweta Shaw",
  },
  {
    name: "Ravi Kumar",
    image: "/images/achievements/ravi-kumar-photo-v2.webp",
    percentage: "87.20%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Ravi Kumar",
  },
  {
    name: "Rishi Kr. Singh",
    image: "/images/achievements/rishi-kr-singh-photo-v2.webp",
    percentage: "84.00%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Rishi Kumar Singh",
  },
  {
    name: "Shashi Kant Yadav",
    image: "/images/achievements/shashi-kant-yadav.webp",
    percentage: "81.20%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Shashi Kant Yadav",
  },
  {
    name: "Md. Nadim",
    image: "/images/achievements/md-nadim.webp",
    percentage: "81.8%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Md. Nadim",
  },
  {
    name: "Abhinaw Anant",
    image: "/images/achievements/abhinaw-anant.webp",
    percentage: "79.2%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Abhinaw Anant",
  },
  {
    name: "Beauty Kumari",
    image: "/images/achievements/beauty-kumari.webp",
    percentage: "73.6%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Beauty Kumari",
  },
  {
    name: "Raj Gaurav",
    image: "/images/achievements/raj-gaurav.webp",
    percentage: "71.2%",
    category: "Academic achievement",
    result: "",
    alt: "Portrait of student Raj Gaurav",
  },
];

const publicResults = [
  {
    name: "Anshu Raj",
    image: "/images/achievements/science-illustrative.webp",
    category: "Class 8 · Science Talent Search · 2023",
    result: "Saran district rank 5 · 52 marks",
    alt: "Illustrative image of students presenting a science project",
    source: "https://bcst.org.in/wp-content/uploads/2023/02/District-wise-Toppers-Result-Rank-1-to-10-1.pdf",
    sourceLabel: "View Bihar result",
  },
  {
    name: "Ayush Mehta",
    image: "/images/achievements/academic-illustrative.webp",
    category: "Class 9 · Mathematics · 2023",
    result: "Saran district rank 8",
    alt: "Illustrative image of a student studying in a school library",
    source: "https://bcst.org.in/wp-content/uploads/2023/11/District-Topper-Result-Class-09-Mathematics-Rank-1-to-10.pdf",
    sourceLabel: "View Bihar result",
  },
];

export const ToppersMarquee = () => (
  <section className={styles.section} id="achievements" aria-labelledby="achievements-title">
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>EFFORT WORTH CELEBRATING</span>
        <h2 className={styles.title} id="achievements-title">Student achievements</h2>
        <p className={styles.intro}>Recognising academic milestones, public competition results, and the drive to keep growing.</p>
      </header>

      <h3 className={styles.groupTitle}>Academic achievements</h3>
      <div className={styles.studentGrid}>
        {studentResults.map((student) => (
          <article className={`${styles.studentCard} ${student.featured ? styles.featuredCard : ""}`} key={student.name}>
            <div className={styles.portrait}>
              <Image src={student.image} alt={student.alt} width={720} height={960} sizes="(max-width: 700px) 42vw, (max-width: 1100px) 28vw, 15vw" quality={90} />
            </div>
            <div className={styles.studentInfo}>
              <span className={styles.cardEyebrow}>{student.category}</span>
              <h4 className={styles.studentName}>{student.name}</h4>
              <strong className={styles.percentage}>{student.percentage}</strong>
              {student.result && <p className={styles.result}>{student.result}</p>}
            </div>
          </article>
        ))}
      </div>

      <h3 className={styles.groupTitle}>Public competition results</h3>
      <div className={styles.publicGrid}>
        {publicResults.map((result) => (
          <article className={styles.publicCard} key={result.name}>
            <div className={styles.publicImage}>
              <Image src={result.image} alt={result.alt} width={1440} height={1024} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 30vw" quality={88} />
              <span className={styles.illustrativeTag}>Illustrative image</span>
            </div>
            <div className={styles.publicInfo}>
              <span className={styles.cardEyebrow}>{result.category}</span>
              <h4 className={styles.studentName}>{result.name}</h4>
              <p className={styles.result}>{result.result}</p>
              <a className={styles.sourceLink} href={result.source} target="_blank" rel="noreferrer">{result.sourceLabel}<span aria-hidden="true"> ↗</span></a>
            </div>
          </article>
        ))}
        <article className={styles.publicCard}>
          <div className={styles.publicImage}>
            <Image src="/images/achievements/police-week-2022.webp" alt="Radiant Public School students present posters to visitors during Bihar Police Week 2022" width={3840} height={2890} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 30vw" quality={90} />
            <span className={styles.illustrativeTag}>School event · 2022</span>
          </div>
          <div className={styles.publicInfo}>
            <span className={styles.cardEyebrow}>STUDENT SHOWCASE</span>
            <h4 className={styles.studentName}>Poster exhibition</h4>
            <p className={styles.result}>Students share their work during Bihar Police Week 2022.</p>
          </div>
        </article>
        <article className={styles.publicCard}>
          <div className={styles.publicImage}>
            <Image src="/images/achievements/badminton-illustrative.webp" alt="Illustrative image of an Indian student practising badminton in a school gym" width={1440} height={1024} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 30vw" quality={88} />
            <span className={styles.illustrativeTag}>Illustrative image</span>
          </div>
          <div className={styles.publicInfo}>
            <span className={styles.cardEyebrow}>SPORTS · BADMINTON</span>
            <h4 className={styles.studentName}>Inter-school badminton winner</h4>
            <p className={styles.result}>Winner’s name, event, and year can be added when you share those details.</p>
          </div>
        </article>
      </div>
    </div>
  </section>
);
