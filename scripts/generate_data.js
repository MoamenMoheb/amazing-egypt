const fs = require('fs');
const path = require('path');

const srcImagesDir = path.join(__dirname, '../images');
const destImagesDir = path.join(__dirname, '../frontend/public/images/artifacts');
const frontendDataDir = path.join(__dirname, '../frontend/src/data');

// Create destination dirs if not exist
if (!fs.existsSync(destImagesDir)) {
    fs.mkdirSync(destImagesDir, { recursive: true });
}

function toId(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getEmojiForHall(hallName) {
    if (hallName.toLowerCase().includes('tutankhamun')) return '👑';
    if (hallName.toLowerCase().includes('khufu')) return '⛵';
    if (hallName.toLowerCase().includes('obelisk')) return '🗼';
    if (hallName.toLowerCase().includes('stairs')) return '🪜';
    if (hallName.toLowerCase().includes('galleries')) return '🏛️';
    return '🏺';
}

function getEmojiForArtifact(artifactName) {
    if (artifactName.toLowerCase().includes('mask')) return '😶‍🌫️';
    if (artifactName.toLowerCase().includes('throne')) return '🪑';
    if (artifactName.toLowerCase().includes('coffin')) return '⚰️';
    if (artifactName.toLowerCase().includes('statue')) return '🗿';
    if (artifactName.toLowerCase().includes('box')) return '📦';
    return '🏺';
}

// Prepare data arrays
const hallsData = [];
const artifactsData = [];

// Hall Layout Data for 6 Halls
const hallLayouts = [
    { color: '#FFD700', gradient: 'from-yellow-400 to-amber-500', x: 10, y: 10, w: 40, h: 40 },
    { color: '#1E90FF', gradient: 'from-blue-500 to-indigo-600', x: 60, y: 10, w: 30, h: 40 },
    { color: '#E91E63', gradient: 'from-pink-500 to-rose-600', x: 10, y: 60, w: 30, h: 30 },
    { color: '#8B4513', gradient: 'from-amber-700 to-yellow-900', x: 50, y: 60, w: 40, h: 30 },
    { color: '#4CAF50', gradient: 'from-emerald-500 to-green-600', x: 15, y: 100, w: 70, h: 20 },
    { color: '#9C27B0', gradient: 'from-purple-500 to-fuchsia-600', x: 30, y: 130, w: 40, h: 20 },
];

const halls = fs.readdirSync(srcImagesDir).filter(f => fs.statSync(path.join(srcImagesDir, f)).isDirectory());

halls.forEach((hallName, hIndex) => {
    const hallId = toId(hallName);
    const hallLayout = hallLayouts[hIndex % hallLayouts.length];

    // Create hall object
    const hallObj = {
        id: hallId,
        name: hallName,
        nameAr: `${hallName} قاعة`,
        description: `Explore the amazing artifacts of ${hallName}.`,
        descriptionAr: `اكتشف القطع الأثرية المذهلة في ${hallName}.`,
        color: hallLayout.color,
        gradient: hallLayout.gradient,
        icon: getEmojiForHall(hallName),
        x: hallLayout.x,
        y: hallLayout.y,
        width: hallLayout.w,
        height: hallLayout.h,
        artifactIds: [],
        quizQuestion: {
            question: `What can you find in ${hallName}?`,
            questionAr: `ماذا تجد في ${hallName}؟`,
            options: ['Artifacts', 'Nothing', 'Cars', 'Animals'],
            optionsAr: ['قطع أثرية', 'لا شيء', 'سيارات', 'حيوانات'],
            correctIndex: 0
        },
        badge: {
            id: `badge-${hallId}`,
            name: `${hallName} Explorer`,
            nameAr: `مستكشف ${hallName}`,
            icon: '🎖️'
        }
    };

    const destHallDir = path.join(destImagesDir, hallId);
    if (!fs.existsSync(destHallDir)) fs.mkdirSync(destHallDir, { recursive: true });

    const artifacts = fs.readdirSync(path.join(srcImagesDir, hallName)).filter(f => f.match(/\.(jpeg|jpg|png|gif|webp)$/i));

    artifacts.forEach((artifactFileName) => {
        const artifactName = artifactFileName.replace(/\.[^/.]+$/, "");
        const artifactId = toId(artifactName);

        // Copy image
        const srcFile = path.join(srcImagesDir, hallName, artifactFileName);
        const destFile = path.join(destHallDir, artifactFileName);
        fs.copyFileSync(srcFile, destFile);

        // Create artifact object
        hallObj.artifactIds.push(artifactId);
        artifactsData.push({
            id: artifactId,
            hallId: hallId,
            name: artifactName,
            nameAr: `${artifactName} (عربي)`,
            description: `This is the beautiful ${artifactName} located in ${hallName}.`,
            descriptionAr: `هذا هو ${artifactName} الجميل الموجود في ${hallName}.`,
            story: `Once upon a time, the ${artifactName} was used in ancient Egypt. It is a masterpiece of art.`,
            storyAr: `في قديم الزمان، استخدم ${artifactName} في مصر القديمة. إنه تحفة فنية.`,
            funFact: `The ${artifactName} is over 3000 years old!`,
            funFactAr: `عمر ${artifactName} أكثر من 3000 سنة!`,
            didYouKnow: `People come from all over the world to see the ${artifactName}.`,
            didYouKnowAr: `يأتي الناس من جميع أنحاء العالم لرؤية ${artifactName}.`,
            image: `/images/artifacts/${hallId}/${encodeURIComponent(artifactFileName)}`,
            icon: getEmojiForArtifact(artifactName)
        });
    });

    hallsData.push(hallObj);
});


// GENERATE halls.ts
const hallsTsContent = `export interface Hall {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  gradient: string;
  icon: string;
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

export const hallsData: Hall[] = ${JSON.stringify(hallsData, null, 2)};
`;

fs.writeFileSync(path.join(frontendDataDir, 'halls.ts'), hallsTsContent);

// GENERATE artifacts.ts
const artifactsTsContent = `export interface Artifact {
  id: string;
  hallId: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  story: string;
  storyAr: string;
  funFact: string;
  funFactAr: string;
  didYouKnow: string;
  didYouKnowAr: string;
  image: string;
  icon: string;
}

export const artifactsData: Artifact[] = ${JSON.stringify(artifactsData, null, 2)};
`;

fs.writeFileSync(path.join(frontendDataDir, 'artifacts.ts'), artifactsTsContent);

console.log('Successfully generated halls.ts and artifacts.ts!');
