export interface Hall {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  gradient: string;
  icon: string;
  image?: string; // High-quality 3D image logo
  x: number;
  y: number;
  width: number;
  height: number;
  artifactIds: string[];
  quizQuestion: {
    question: string;
    questionAr: string;
    options: string[];
    optionsAr: string[];
    correctIndex: number;
  };
  badge: {
    id: string;
    name: string;
    nameAr: string;
    icon: string;
  };
}

export const hallsData: Hall[] = [
  {
    id: "grand-hall",
    name: "grand hall",
    nameAr: "grand hall قاعة",
    description: "Explore the amazing artifacts of grand hall.",
    descriptionAr: "اكتشف القطع الأثرية المذهلة في grand hall.",
    color: "#FFD700",
    gradient: "from-yellow-400 to-amber-500",
    icon: "🏺",
    image: "/images/halls/grand-hall.webp",
    x: 10,
    y: 10,
    width: 40,
    height: 40,
    artifactIds: [
      "colossal-statue-of-ramesses-ii",
      "colossus-of-a-ptolemaic-king",
      "colossus-of-a-ptolemaic-queen",
      "column-of-king-merenptah",
      "seated-statue-of-senwosert-i",
    ],
    quizQuestion: {
      question: "What can you find in grand hall?",
      questionAr: "ماذا تجد في grand hall؟",
      options: ["Artifacts", "Nothing", "Cars", "Animals"],
      optionsAr: ["قطع أثرية", "لا شيء", "سيارات", "حيوانات"],
      correctIndex: 0,
    },
    badge: {
      id: "badge-grand-hall",
      name: "grand hall Explorer",
      nameAr: "مستكشف grand hall",
      icon: "🎖️",
    },
  },
  {
    id: "grand-stairs",
    name: "grand stairs",
    nameAr: "grand stairs قاعة",
    description: "Explore the amazing artifacts of grand stairs.",
    descriptionAr: "اكتشف القطع الأثرية المذهلة في grand stairs.",
    color: "#1E90FF",
    gradient: "from-blue-500 to-indigo-600",
    icon: "🪜",
    image: "/images/halls/grand-stairs.webp",
    x: 60,
    y: 10,
    width: 30,
    height: 40,
    artifactIds: [
      "colossal-osiride-statue-of-king-senwosret-i",
      "doorway-of-king-amenemhat-i",
      "hathor-capital",
      "king-ramesses-ii-and-a-goddess",
      "pyramidion-of-an-obelisk-of-queen-hatshepsut",
      "sarcophagus-of-djehutymose",
      "sarcophagus-of-nitocris",
      "seated-statue-of-goddess-sekhmet",
      "seated-statue-of-thutmose-iii",
      "sphinx-of-king-amenemhat-iii",
      "sphinx-of-kings-ramesses-ii-and-merenptah",
      "standing-statue-of-king-thutmose-iii",
      "statue-of-god-ptah-king-ramesses-ii-goddess-sekhmet",
      "statue-of-queen-hatshepsut",
    ],
    quizQuestion: {
      question: "What can you find in grand stairs?",
      questionAr: "ماذا تجد في grand stairs؟",
      options: ["Artifacts", "Nothing", "Cars", "Animals"],
      optionsAr: ["قطع أثرية", "لا شيء", "سيارات", "حيوانات"],
      correctIndex: 0,
    },
    badge: {
      id: "badge-grand-stairs",
      name: "grand stairs Explorer",
      nameAr: "مستكشف grand stairs",
      icon: "🎖️",
    },
  },
  {
    id: "hanging-obelisk",
    name: "Hanging Obelisk",
    nameAr: "Hanging Obelisk قاعة",
    description: "Explore the amazing artifacts of Hanging Obelisk.",
    descriptionAr: "اكتشف القطع الأثرية المذهلة في Hanging Obelisk.",
    color: "#E91E63",
    gradient: "from-pink-500 to-rose-600",
    icon: "🗼",
    image: "/images/halls/hanging-obelisk.webp",
    x: 10,
    y: 60,
    width: 30,
    height: 30,
    artifactIds: ["obelisk", "untitled-2"],
    quizQuestion: {
      question: "What can you find in Hanging Obelisk?",
      questionAr: "ماذا تجد في Hanging Obelisk؟",
      options: ["Artifacts", "Nothing", "Cars", "Animals"],
      optionsAr: ["قطع أثرية", "لا شيء", "سيارات", "حيوانات"],
      correctIndex: 0,
    },
    badge: {
      id: "badge-hanging-obelisk",
      name: "Hanging Obelisk Explorer",
      nameAr: "مستكشف Hanging Obelisk",
      icon: "🎖️",
    },
  },
  {
    id: "khufu-s-boats",
    name: "Khufu's Boats",
    nameAr: "Khufu's Boats قاعة",
    description: "Explore the amazing artifacts of Khufu's Boats.",
    descriptionAr: "اكتشف القطع الأثرية المذهلة في Khufu's Boats.",
    color: "#8B4513",
    gradient: "from-amber-700 to-yellow-900",
    icon: "⛵",
    image: "/images/halls/khufu-s-boats.webp",
    x: 50,
    y: 60,
    width: 40,
    height: 30,
    artifactIds: ["khufu-s-boats", "pyramid-area-boats-egyptatours"],
    quizQuestion: {
      question: "What can you find in Khufu's Boats?",
      questionAr: "ماذا تجد في Khufu's Boats؟",
      options: ["Artifacts", "Nothing", "Cars", "Animals"],
      optionsAr: ["قطع أثرية", "لا شيء", "سيارات", "حيوانات"],
      correctIndex: 0,
    },
    badge: {
      id: "badge-khufu-s-boats",
      name: "Khufu's Boats Explorer",
      nameAr: "مستكشف Khufu's Boats",
      icon: "🎖️",
    },
  },
  {
    id: "main-galleries",
    name: "Main Galleries",
    nameAr: "Main Galleries قاعة",
    description: "Explore the amazing artifacts of Main Galleries.",
    descriptionAr: "اكتشف القطع الأثرية المذهلة في Main Galleries.",
    color: "#4CAF50",
    gradient: "from-emerald-500 to-green-600",
    icon: "🏛️",
    image: "/images/halls/main-galleries.webp",
    x: 15,
    y: 100,
    width: 70,
    height: 20,
    artifactIds: [
      "a-cup-treasure-of-tod",
      "a-gilt-hawk-figure-dendera-treasure-hoards",
      "a-statue-of-duaptah-and-his-father",
      "a-string-with-carnelian-beads-treasure-of-tod",
      "amulet-treasure-of-tod",
      "beaker-with-river-nile-scene",
      "block-statue-of-penuuepeqer",
      "block-statue-of-sobeknakht",
      "block-statue-of-wsirwer",
      "bronze-vase-of-mesehti",
      "canopic-chest-of-queen-hetepheres-i",
      "carrying-chair-of-queen-hetepheres-i",
    ],
    quizQuestion: {
      question: "What can you find in Main Galleries?",
      questionAr: "ماذا تجد في Main Galleries؟",
      options: ["Artifacts", "Nothing", "Cars", "Animals"],
      optionsAr: ["قطع أثرية", "لا شيء", "سيارات", "حيوانات"],
      correctIndex: 0,
    },
    badge: {
      id: "badge-main-galleries",
      name: "Main Galleries Explorer",
      nameAr: "مستكشف Main Galleries",
      icon: "🎖️",
    },
  },
  {
    id: "tutankhamun-galleries",
    name: "Tutankhamun Galleries",
    nameAr: "Tutankhamun Galleries قاعة",
    description: "Explore the amazing artifacts of Tutankhamun Galleries.",
    descriptionAr: "اكتشف القطع الأثرية المذهلة في Tutankhamun Galleries.",
    color: "#9C27B0",
    gradient: "from-purple-500 to-fuchsia-600",
    icon: "👑",
    image: "/images/halls/tutankhamun-galleries.webp",
    x: 30,
    y: 130,
    width: 40,
    height: 20,
    artifactIds: [
      "anubis-on-a-chest",
      "canopic-chest",
      "canopic-coffinette-2",
      "canopic-coffinette-3",
      "canopic-coffinette-4",
      "canopic-coffinette",
      "canopic-shrine-on-a-sledge",
      "cow-head",
      "duck-head-earrings",
      "fancy-perfume-vase",
      "festival-earrings",
      "floral-hair-box",
      "golden-throne",
      "guardian-statue-with-khat-headdress",
      "guardian-statue-with-nemes-headcloth",
      "ivory-jewellery-box",
      "lion-shaped-perfume-jar",
      "lions-headrest",
      "lotus-cup",
      "model-of-tutankhamun-on-a-funerary-bed",
      "ostrich-hunt-fan",
      "outer-coffin",
      "ritual-carrying-box",
      "royal-diadem",
      "the-golden-burial-mask-of-tutankhamun",
    ],
    quizQuestion: {
      question: "What can you find in Tutankhamun Galleries?",
      questionAr: "ماذا تجد في Tutankhamun Galleries؟",
      options: ["Artifacts", "Nothing", "Cars", "Animals"],
      optionsAr: ["قطع أثرية", "لا شيء", "سيارات", "حيوانات"],
      correctIndex: 0,
    },
    badge: {
      id: "badge-tutankhamun-galleries",
      name: "Tutankhamun Galleries Explorer",
      nameAr: "مستكشف Tutankhamun Galleries",
      icon: "🎖️",
    },
  },
];
