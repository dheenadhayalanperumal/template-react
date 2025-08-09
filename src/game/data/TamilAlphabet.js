export const TamilAlphabet = {
    // Stage 1: Uyir Ezhuthukkal (Vowels) - 12 letters
    uyir: [
        { letter: 'அ', transliteration: 'a', pronunciation: 'ah', stage: 1, difficulty: 1 },
        { letter: 'ஆ', transliteration: 'aa', pronunciation: 'aah', stage: 1, difficulty: 1 },
        { letter: 'இ', transliteration: 'i', pronunciation: 'i', stage: 1, difficulty: 1 },
        { letter: 'ஈ', transliteration: 'ii', pronunciation: 'ee', stage: 1, difficulty: 1 },
        { letter: 'உ', transliteration: 'u', pronunciation: 'u', stage: 1, difficulty: 1 },
        { letter: 'ஊ', transliteration: 'uu', pronunciation: 'oo', stage: 1, difficulty: 1 },
        { letter: 'எ', transliteration: 'e', pronunciation: 'e', stage: 1, difficulty: 2 },
        { letter: 'ஏ', transliteration: 'ee', pronunciation: 'ey', stage: 1, difficulty: 2 },
        { letter: 'ஐ', transliteration: 'ai', pronunciation: 'ai', stage: 1, difficulty: 2 },
        { letter: 'ஒ', transliteration: 'o', pronunciation: 'o', stage: 1, difficulty: 2 },
        { letter: 'ஓ', transliteration: 'oo', pronunciation: 'oh', stage: 1, difficulty: 2 },
        { letter: 'ஔ', transliteration: 'au', pronunciation: 'au', stage: 1, difficulty: 3 }
    ],

    // Stage 2: Mei Ezhuthukkal (Consonants) - 18 letters
    mei: [
        { letter: 'க்', transliteration: 'k', pronunciation: 'k', stage: 2, difficulty: 2 },
        { letter: 'ங்', transliteration: 'ng', pronunciation: 'ng', stage: 2, difficulty: 3 },
        { letter: 'ச்', transliteration: 'ch', pronunciation: 'ch', stage: 2, difficulty: 2 },
        { letter: 'ஞ்', transliteration: 'nj', pronunciation: 'nj', stage: 2, difficulty: 3 },
        { letter: 'ட்', transliteration: 't', pronunciation: 't', stage: 2, difficulty: 2 },
        { letter: 'ண்', transliteration: 'n', pronunciation: 'n', stage: 2, difficulty: 2 },
        { letter: 'த்', transliteration: 'th', pronunciation: 'th', stage: 2, difficulty: 2 },
        { letter: 'ந்', transliteration: 'n', pronunciation: 'n', stage: 2, difficulty: 2 },
        { letter: 'ப்', transliteration: 'p', pronunciation: 'p', stage: 2, difficulty: 2 },
        { letter: 'ம்', transliteration: 'm', pronunciation: 'm', stage: 2, difficulty: 2 },
        { letter: 'ய்', transliteration: 'y', pronunciation: 'y', stage: 2, difficulty: 2 },
        { letter: 'ர்', transliteration: 'r', pronunciation: 'r', stage: 2, difficulty: 2 },
        { letter: 'ல்', transliteration: 'l', pronunciation: 'l', stage: 2, difficulty: 2 },
        { letter: 'வ்', transliteration: 'v', pronunciation: 'v', stage: 2, difficulty: 2 },
        { letter: 'ழ்', transliteration: 'zh', pronunciation: 'zh', stage: 2, difficulty: 3 },
        { letter: 'ள்', transliteration: 'l', pronunciation: 'l', stage: 2, difficulty: 3 },
        { letter: 'ற்', transliteration: 'r', pronunciation: 'r', stage: 2, difficulty: 3 },
        { letter: 'ன்', transliteration: 'n', pronunciation: 'n', stage: 2, difficulty: 2 }
    ],

    // Stage 3: Uyirmei Ezhuthukkal (Consonant-Vowel combinations) - First set (க combinations)
    uyirmei_ka: [
        { letter: 'க', transliteration: 'ka', pronunciation: 'ka', stage: 3, difficulty: 2 },
        { letter: 'கா', transliteration: 'kaa', pronunciation: 'kaa', stage: 3, difficulty: 2 },
        { letter: 'கி', transliteration: 'ki', pronunciation: 'ki', stage: 3, difficulty: 2 },
        { letter: 'கீ', transliteration: 'kii', pronunciation: 'kee', stage: 3, difficulty: 2 },
        { letter: 'கு', transliteration: 'ku', pronunciation: 'ku', stage: 3, difficulty: 2 },
        { letter: 'கூ', transliteration: 'kuu', pronunciation: 'koo', stage: 3, difficulty: 2 },
        { letter: 'கெ', transliteration: 'ke', pronunciation: 'ke', stage: 3, difficulty: 3 },
        { letter: 'கே', transliteration: 'kee', pronunciation: 'key', stage: 3, difficulty: 3 },
        { letter: 'கை', transliteration: 'kai', pronunciation: 'kai', stage: 3, difficulty: 3 },
        { letter: 'கொ', transliteration: 'ko', pronunciation: 'ko', stage: 3, difficulty: 3 },
        { letter: 'கோ', transliteration: 'koo', pronunciation: 'koh', stage: 3, difficulty: 3 },
        { letter: 'கௌ', transliteration: 'kau', pronunciation: 'kau', stage: 3, difficulty: 3 }
    ]
};

// Helper function to get all letters by stage
export const getLettersByStage = (stage) => {
    const allLetters = [];
    
    if (stage === 1) {
        allLetters.push(...TamilAlphabet.uyir);
    } else if (stage === 2) {
        allLetters.push(...TamilAlphabet.mei);
    } else if (stage === 3) {
        allLetters.push(...TamilAlphabet.uyirmei_ka);
    }
    
    return allLetters;
};

// Helper function to get letters by difficulty
export const getLettersByDifficulty = (difficulty) => {
    const allLetters = [
        ...TamilAlphabet.uyir,
        ...TamilAlphabet.mei,
        ...TamilAlphabet.uyirmei_ka
    ];
    
    return allLetters.filter(letter => letter.difficulty === difficulty);
};

// Helper function to get all letters
export const getAllLetters = () => {
    return [
        ...TamilAlphabet.uyir,
        ...TamilAlphabet.mei,
        ...TamilAlphabet.uyirmei_ka
    ];
};

// Game configuration
export const GameConfig = {
    ACCURACY_THRESHOLD: 80,
    MAX_ATTEMPTS: 3,
    DRAWING_TOLERANCE: 15,
    STAGES: {
        1: { name: 'Uyir Ezhuthukkal', description: 'Learn Tamil Vowels' },
        2: { name: 'Mei Ezhuthukkal', description: 'Learn Tamil Consonants' },
        3: { name: 'Uyirmei Ezhuthukkal', description: 'Learn Combined Letters' }
    },
    DIFFICULTY_LEVELS: {
        EASY: { 
            name: 'Easy', 
            outlineWidth: 8, 
            showDirectionArrows: true, 
            tolerance: 20 
        },
        MEDIUM: { 
            name: 'Medium', 
            outlineWidth: 4, 
            showDirectionArrows: false, 
            tolerance: 15 
        },
        HARD: { 
            name: 'Hard', 
            outlineWidth: 0, 
            showDirectionArrows: false, 
            tolerance: 10 
        }
    }
};