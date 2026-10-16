export interface Action {
  label: string;
  type: 'call' | 'link' | 'scroll';
  value: string;
}

export interface Rule {
  id: string;
  keywords: string[];
  reply: string;
  followUps?: string[];
  action?: Action;
}

export const rules: Rule[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "hii", "namaste", "namaskar", "good morning", "good afternoon", "good evening"],
    reply: "Hello! Welcome to Radiant Public School. How can I help you today?",
    followUps: ["Admissions", "Fees", "School timings", "Contact us", "Book a visit", "Location"]
  },
  {
    id: "how_are_you",
    keywords: ["how are you", "how r u", "kaise ho"],
    reply: "I'm doing great, thank you! I'm here to help you with any questions about Radiant School.",
    followUps: ["Admissions", "Fees", "School timings"]
  },
  {
    id: "contact_number",
    keywords: ["contact", "phone", "number", "call", "mobile", "whatsapp", "helpline", "sampark", "nambar"],
    reply: "You can call Radiant Public School, Bheldi at +91 94308 56662. Please confirm current admissions details directly with the school.",
    action: { label: "Call the school", type: "call", value: "tel:+919430856662" }
  },
  {
    id: "email",
    keywords: ["email", "mail", "write to"],
    reply: "I don't have a verified email address for the Bheldi school. Please call +91 94308 56662.",
    followUps: ["Contact us"]
  },
  {
    id: "admissions",
    keywords: ["admission", "admissions", "apply", "enroll", "enrol", "join", "registration", "form", "process", "pravesh"],
    reply: "Please contact Radiant Public School, Bheldi at +91 94308 56662 to confirm current admissions and class availability.",
    action: { label: "Book a Visit", type: "scroll", value: "#admissions" }
  },
  {
    id: "fees",
    keywords: ["fee", "fees", "cost", "price", "tuition", "charges", "shulk"],
    reply: "Please contact the school directly for its current fee schedule.",
    action: { label: "Call us", type: "call", value: "tel:+919430856662" }
  },
  {
    id: "timings",
    keywords: ["timing", "timings", "time", "hours", "schedule", "open", "close", "start", "school time"],
    reply: "Please call the school to confirm current school and office hours."
  },
  {
    id: "location",
    keywords: ["location", "address", "where", "map", "directions", "reach", "kahan", "pata"],
    reply: "Radiant Public School is at WW6X+676, behind Punjab National Bank, Rewa, Bheldi, Bihar 841402.",
    action: { label: "Open in Maps", type: "link", value: "https://maps.google.com/?q=WW6X%2B676%2C+Bheldi%2C+Bihar+841402" }
  },
  {
    id: "visit",
    keywords: ["visit", "tour", "book", "appointment", "see the campus", "meet"],
    reply: "We'd love to show you around! The best way to experience Radiant is to book a campus tour with our team.",
    action: { label: "Book a tour", type: "scroll", value: "#admissions" }
  },
  {
    id: "grades",
    keywords: ["grade", "class", "classes", "standard", "age", "which classes"],
    reply: "Public Bihar education results list Radiant Public School, Bheldi students in Classes 8, 9, and 10. Please contact the school to confirm its current admission classes."
  },
  {
    id: "curriculum",
    keywords: ["cbse", "board", "curriculum", "syllabus", "affiliation"],
    reply: "I don't have a verified affiliation or board record for Radiant Public School, Bheldi. Please confirm the current board directly with the school."
  },
  {
    id: "facilities",
    keywords: ["facility", "facilities", "library", "lab", "sports", "playground", "campus", "computer", "smart class"],
    reply: "Please contact the school directly for an up-to-date list of campus facilities."
  },
  {
    id: "transport",
    keywords: ["transport", "bus", "van", "pickup", "drop"],
    reply: "Please contact the school to ask whether transport is available on your route."
  },
  {
    id: "safety",
    keywords: ["safe", "safety", "security", "cctv"],
    reply: "Please contact the school for details about its current campus safety arrangements."
  },
  {
    id: "teachers",
    keywords: ["teacher", "teachers", "faculty", "ratio", "staff"],
    reply: "I don't have verified teacher or student-to-teacher figures for this school. Please contact the school for current details."
  },
  {
    id: "results",
    keywords: ["result", "results", "topper", "toppers", "marks", "score", "performance"],
    reply: "Our students consistently perform excellently in academics and extracurriculars. Check out the 'Student Stories' and 'Toppers' sections on our page!"
  },
  {
    id: "activities",
    keywords: ["activity", "activities", "music", "art", "clubs", "trips", "events"],
    reply: "We offer a vibrant mix of activities including music, arts, robotics, eco-club, and regular field trips to make learning joyful."
  },
  {
    id: "scholarship",
    keywords: ["scholarship", "discount", "concession"],
    reply: "We offer merit-based and need-based scholarships. Please contact the admissions office directly to discuss eligibility."
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank you", "thx", "dhanyavad", "shukriya"],
    reply: "You're welcome! Anything else I can help with?"
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "see you", "ok bye", "tata"],
    reply: "Goodbye! Have a great day. Feel free to reach out if you need anything else."
  },
  {
    id: "human",
    keywords: ["human", "agent", "person", "talk to someone", "representative", "complaint"],
    reply: "I am an automated assistant. You can call Radiant Public School, Bheldi at +91 94308 56662.",
    action: { label: "Call now", type: "call", value: "tel:+919430856662" }
  },
  {
    id: "profanity",
    keywords: ["shit", "fuck", "stupid", "idiot", "dumb", "ass"],
    reply: "I'm sorry, I didn't get that. Try asking about admissions, fees, timings, location, or contact details."
  }
];

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let previous = Array.from({ length: a.length + 1 }, (_, index) => index);
  for (let j = 1; j <= b.length; j += 1) {
    const current = Array<number>(a.length + 1).fill(0);
    current[0] = j;
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      current[i] = Math.min(
        (current[i - 1] as number) + 1,
        (previous[i] as number) + 1,
        (previous[i - 1] as number) + indicator
      );
    }
    previous = current;
  }
  return previous[a.length] as number;
}

export function getReply(input: string): Rule | null {
  const normalizedInput = input.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
  if (!normalizedInput) return null;

  const words = normalizedInput.split(' ');

  let bestScore = 0;
  let bestRule: Rule | null = null;

  for (const rule of rules) {
    let score = 0;
    
    for (const kw of rule.keywords) {
      const kwLower = kw.toLowerCase();
      
      if (kwLower.includes(' ')) {
        if (normalizedInput.includes(kwLower)) {
          score += 2;
        }
      } else {
        for (const word of words) {
          if (word === kwLower) {
            score += 1;
          } else if (kwLower.length >= 5 && word.length >= 4) {
            const dist = levenshtein(word, kwLower);
            if (dist === 1) {
              score += 1;
            }
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  return bestRule;
}
