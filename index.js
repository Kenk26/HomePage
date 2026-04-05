// ─── TRIE DATA STRUCTURE ───────────────────────────────────────────────────

class TrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
        this.frequency = 0; // higher = more relevant suggestion
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word, frequency = 1) {
        let node = this.root;
        for (const ch of word.toLowerCase()) {
            if (!node.children[ch]) node.children[ch] = new TrieNode();
            node = node.children[ch];
        }
        node.isEnd = true;
        node.frequency = frequency;
    }

    // Returns up to `limit` suggestions for a given prefix, sorted by frequency
    suggest(prefix, limit = 8) {
        let node = this.root;
        for (const ch of prefix.toLowerCase()) {
            if (!node.children[ch]) return [];
            node = node.children[ch];
        }
        const results = [];
        this._dfs(node, prefix.toLowerCase(), results);
        results.sort((a, b) => b.freq - a.freq);
        return results.slice(0, limit).map(r => r.word);
    }

    _dfs(node, current, results) {
        if (node.isEnd) results.push({ word: current, freq: node.frequency });
        for (const ch in node.children) {
            this._dfs(node.children[ch], current + ch, results);
        }
    }
}

// ─── PERSISTENCE: load / save custom searches via localStorage ──────────────

const STORAGE_KEY = 'trieCustomSearches';

function loadCustomSearches() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
}

function saveCustomSearch(term) {
    const clean = term.trim().toLowerCase();
    if (!clean || clean.length < 2) return;
    const store = loadCustomSearches();
    store[clean] = (store[clean] || 0) + 1; // track how many times searched
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch {}
}

// Inserts all previously searched terms back into the Trie on load
function seedCustomSearches(trie) {
    const store = loadCustomSearches();
    for (const [term, count] of Object.entries(store)) {
        // Base 60 + bonus up to 30 so personal terms float near top
        trie.insert(term, 60 + Math.min(count * 5, 30));
    }
}

// ─── SEED THE TRIE WITH POPULAR SEARCHES ───────────────────────────────────

const searchTrie = new Trie();

const popularSearches = [
    // ── Anime (titles) ───────────────────────────────────────────────────────
    ["anime", 95], ["anime news", 80], ["anime episodes", 75], ["anime streaming", 70],
    ["anime 2025", 78], ["anime recommendations", 74], ["anime list", 72], ["anime dubbed", 71],
    ["anime subbed", 70], ["anime wallpaper", 68], ["anime characters", 67], ["anime openings", 66],
    ["attack on titan", 90], ["attack on titan final season", 84], ["attack on titan ending", 80],
    ["one piece", 92], ["one piece episodes", 85], ["one piece manga", 82], ["one piece latest episode", 80],
    ["naruto", 88], ["naruto shippuden", 85], ["naruto episodes", 80], ["naruto characters", 75],
    ["demon slayer", 85], ["demon slayer season 4", 82], ["demon slayer characters", 78],
    ["jujutsu kaisen", 87], ["jujutsu kaisen season 2", 83], ["jujutsu kaisen manga", 80],
    ["my hero academia", 84], ["my hero academia season 7", 80], ["my hero academia ending", 76],
    ["dragon ball super", 82], ["dragon ball z", 80], ["dragon ball daima", 78],
    ["sword art online", 78], ["fullmetal alchemist brotherhood", 82], ["fullmetal alchemist", 80],
    ["death note", 83], ["death note watch order", 76], ["death note characters", 74],
    ["bleach", 79], ["bleach thousand year blood war", 83], ["bleach episodes", 76],
    ["hunter x hunter", 81], ["hunter x hunter manga", 78], ["hunter x hunter hiatus", 72],
    ["tokyo ghoul", 77], ["chainsaw man", 86], ["chainsaw man manga", 82],
    ["spy x family", 83], ["spy x family season 3", 79], ["vinland saga", 76],
    ["re zero", 79], ["re zero season 3", 75], ["overlord", 74], ["overlord season 5", 70],
    ["black clover", 77], ["black clover movie", 73], ["fairy tail", 76], ["fairy tail 100 years quest", 72],
    ["solo leveling", 85], ["solo leveling anime", 81], ["solo leveling manga", 79],
    ["mushoku tensei", 76], ["that time i got reincarnated as a slime", 74],
    ["frieren beyond journeys end", 80], ["frieren anime", 77],
    ["oshi no ko", 78], ["oshi no ko season 2", 74],
    ["blue lock", 79], ["blue lock season 2", 75], ["blue lock manga", 72],
    ["dandadan", 76], ["dandadan anime", 73], ["kaiju no 8", 77], ["kaiju no 8 anime", 74],
    ["hell's paradise", 73], ["heavens official blessing", 72], ["the rising of the shield hero", 71],
    ["made in abyss", 74], ["violet evergarden", 73], ["your name anime", 75],
    ["spirited away", 74], ["princess mononoke", 72], ["howls moving castle", 73],
    ["neon genesis evangelion", 78], ["cowboy bebop", 76], ["trigun stampede", 70],
    ["isekai anime", 75], ["shonen anime", 74], ["seinen anime", 72], ["romance anime", 73],
    ["best anime 2025", 78], ["top anime of all time", 76], ["anime schedule 2025", 72],

    // ── Manga / Manhwa / Manhua ───────────────────────────────────────────────
    ["manga", 88], ["manga online", 73], ["read manga", 70], ["manga raw", 68],
    ["manga plus", 75], ["manga updates", 72], ["manga recommendations", 70],
    ["manhwa", 80], ["manhwa recommendations", 74], ["read manhwa", 71],
    ["solo leveling manhwa", 80], ["tower of god", 76], ["god of high school", 73],
    ["omniscient reader", 78], ["omniscient reader manhwa", 75],
    ["return of the demon king", 72], ["nano machine", 71], ["reincarnator manhwa", 70],
    ["one piece manga chapter", 82], ["chainsaw man chapter", 79], ["jjk manga chapter", 78],
    ["black clover manga", 74], ["my hero academia manga", 75], ["boruto manga", 73],

    // ── Tech / Programming ────────────────────────────────────────────────────
    ["chatgpt", 93], ["chatgpt login", 85], ["chatgpt 4", 80], ["chatgpt o1", 78],
    ["chatgpt alternatives", 72], ["chatgpt api", 76], ["chatgpt prompt", 73],
    ["artificial intelligence", 88], ["ai image generator", 79], ["ai art generator", 76],
    ["ai video generator", 74], ["ai music generator", 72], ["ai tools 2025", 75],
    ["midjourney", 75], ["midjourney prompts", 72], ["stable diffusion", 73],
    ["google gemini", 80], ["google gemini ai", 77], ["openai", 82], ["openai api", 78],
    ["claude ai", 79], ["anthropic", 75], ["perplexity ai", 74], ["copilot ai", 73],
    ["github", 86], ["github copilot", 80], ["github actions", 74], ["github desktop", 72],
    ["stackoverflow", 80], ["stackoverflow questions", 74],
    ["python", 85], ["python tutorial", 78], ["python for beginners", 75],
    ["python projects", 73], ["python libraries", 72], ["python pandas", 71],
    ["javascript", 77], ["javascript tutorial", 74], ["javascript projects", 72],
    ["typescript", 75], ["typescript tutorial", 72], ["react js", 76],
    ["react tutorial", 73], ["react hooks", 71], ["nextjs", 76], ["nextjs tutorial", 73],
    ["nodejs", 74], ["nodejs tutorial", 71], ["express js", 72], ["vue js", 73],
    ["html css", 76], ["html tutorial", 73], ["css tutorial", 72], ["css animations", 70],
    ["tailwind css", 78], ["tailwind tutorial", 74], ["bootstrap", 75],
    ["machine learning", 79], ["machine learning tutorial", 75], ["deep learning", 75],
    ["neural network", 73], ["tensorflow", 70], ["pytorch", 72], ["scikit learn", 70],
    ["data science", 78], ["data science course", 74], ["data analytics", 73],
    ["sql tutorial", 74], ["mysql", 73], ["postgresql", 71], ["mongodb", 72],
    ["vs code", 81], ["vs code extensions", 76], ["vs code shortcuts", 73],
    ["linux tutorial", 73], ["linux commands", 71], ["ubuntu", 72], ["kali linux", 74],
    ["docker tutorial", 71], ["docker compose", 70], ["kubernetes", 72],
    ["git tutorial", 75], ["git commands", 73], ["git merge", 70],
    ["c++ tutorial", 72], ["c programming", 73], ["java tutorial", 74],
    ["kotlin", 72], ["flutter", 76], ["flutter tutorial", 73], ["dart programming", 70],
    ["swift programming", 72], ["android development", 74], ["ios development", 73],
    ["web development", 79], ["web development roadmap", 75], ["full stack developer", 76],
    ["api tutorial", 73], ["rest api", 74], ["graphql", 72], ["microservices", 71],
    ["cloud computing", 74], ["aws tutorial", 73], ["google cloud", 72], ["azure", 71],
    ["cybersecurity", 76], ["ethical hacking", 74], ["penetration testing", 72],

    // ── Entertainment / Streaming ─────────────────────────────────────────────
    ["youtube", 97], ["youtube music", 88], ["youtube shorts", 85], ["youtube premium", 72],
    ["youtube studio", 77], ["youtube kids", 70], ["youtube vanced", 69],
    ["netflix", 94], ["netflix movies", 85], ["netflix series", 82], ["netflix new releases", 79],
    ["netflix anime", 78], ["netflix originals", 76], ["netflix password sharing", 72],
    ["prime video", 80], ["prime video movies", 76], ["amazon prime series", 74],
    ["disney plus", 80], ["disney plus movies", 76], ["disney plus anime", 73],
    ["hbo max", 78], ["hulu", 76], ["apple tv plus", 74], ["jio cinema", 79],
    ["hotstar", 82], ["hotstar ipl", 85], ["hotstar movies", 78], ["hotstar series", 76],
    ["sony liv", 76], ["zee5", 74], ["crunchyroll", 82], ["crunchyroll anime", 79],
    ["funimation", 74], ["hianime", 80], ["gogoanime", 78], ["9anime", 75],
    ["spotify", 89], ["spotify premium", 78], ["spotify playlist", 76],
    ["spotify download", 72], ["spotify wrapped", 74], ["spotify stats", 71],
    ["apple music", 78], ["youtube music download", 72], ["soundcloud", 73],
    ["instagram", 93], ["instagram reels", 82], ["instagram stories", 78],
    ["instagram download", 74], ["instagram login", 79], ["instagram dm", 73],
    ["whatsapp web", 91], ["whatsapp status", 79], ["whatsapp download", 77],
    ["whatsapp business", 74], ["whatsapp new features", 71],
    ["telegram", 87], ["telegram web", 83], ["telegram channels", 79],
    ["telegram bots", 75], ["telegram download", 76],
    ["discord", 86], ["discord server", 80], ["discord nitro", 77], ["discord bots", 75],
    ["twitch", 83], ["twitch streamers", 78], ["twitch clips", 74],
    ["reddit", 88], ["reddit r anime", 80], ["reddit frontpage", 75],
    ["twitter", 87], ["twitter trending", 82], ["twitter login", 79],
    ["facebook", 90], ["facebook login", 85], ["facebook marketplace", 79],
    ["tiktok", 89], ["tiktok download", 84], ["tiktok trending", 80],
    ["snapchat", 82], ["pinterest", 80], ["linkedin", 83], ["linkedin jobs", 78],
    ["tumblr", 72], ["quora", 79], ["medium", 75],

    // ── Gaming ────────────────────────────────────────────────────────────────
    ["epic games", 84], ["epic games free games", 79], ["epic games store", 76],
    ["fortnite", 86], ["fortnite update", 81], ["fortnite chapter 5", 78], ["fortnite skins", 76],
    ["valorant", 85], ["valorant agents", 80], ["valorant ranks", 77], ["valorant tips", 74],
    ["minecraft", 88], ["minecraft download", 84], ["minecraft seeds", 78],
    ["minecraft mods", 80], ["minecraft java edition", 77], ["minecraft bedrock", 75],
    ["gta 5", 84], ["gta 6", 92], ["gta 6 release date", 90], ["gta online", 80],
    ["pubg", 80], ["pubg mobile", 83], ["pubg new update", 78],
    ["call of duty", 83], ["call of duty warzone", 80], ["cod mobile", 79],
    ["elden ring", 82], ["elden ring dlc", 79], ["elden ring shadow of the erdtree", 83],
    ["steam", 87], ["steam sale", 83], ["steam games", 80], ["steam deck", 79],
    ["roblox", 81], ["roblox codes", 78], ["roblox games", 76],
    ["league of legends", 82], ["lol patch notes", 78], ["lol tier list", 76],
    ["game pass", 78], ["xbox game pass", 76], ["ps5 games", 76], ["ps5 exclusives", 73],
    ["xbox games", 74], ["nintendo switch games", 77], ["switch oled", 73],
    ["cyberpunk 2077", 80], ["cyberpunk phantom liberty", 77],
    ["baldurs gate 3", 84], ["bg3 guide", 78], ["bg3 builds", 76],
    ["hogwarts legacy", 79], ["spider man 2 ps5", 80], ["god of war ragnarok", 81],
    ["zelda tears of the kingdom", 82], ["pokemon", 84], ["pokemon scarlet violet", 79],
    ["diablo 4", 78], ["diablo 4 builds", 75], ["overwatch 2", 77],
    ["apex legends", 80], ["apex legends season", 76],
    ["counter strike 2", 82], ["cs2", 80], ["cs2 settings", 76],
    ["free fire", 82], ["free fire max", 79], ["clash royale", 78], ["clash of clans", 79],
    ["mobile legends", 80], ["mlbb", 77], ["genshin impact", 83],
    ["genshin impact characters", 79], ["genshin impact codes", 76],
    ["honkai star rail", 80], ["hsr characters", 76], ["hsr codes", 74],
    ["wuthering waves", 76], ["zelda", 82], ["mario", 79], ["sonic", 75],
    ["gaming pc build", 78], ["best gaming laptop 2025", 76], ["rtx 4090", 75],
    ["gaming chair", 73], ["gaming monitor", 74], ["gaming headset", 72],

    // ── Google Services ───────────────────────────────────────────────────────
    ["google translate", 89], ["google maps", 91], ["google drive", 87], ["gmail", 92],
    ["gmail login", 88], ["gmail compose", 80], ["gmail settings", 76],
    ["google photos", 83], ["google photos backup", 79],
    ["google meet", 81], ["google meet link", 77],
    ["google docs", 85], ["google docs templates", 78],
    ["google sheets", 80], ["google sheets formulas", 76],
    ["google slides", 79], ["google forms", 76], ["google calendar", 82],
    ["google classroom", 78], ["google classroom login", 74],
    ["google chrome", 84], ["chrome extensions", 76], ["chrome web store", 74],
    ["chrome flags", 72], ["google news", 80], ["google finance", 76],
    ["google earth", 78], ["google lens", 79], ["google assistant", 77],
    ["google pay", 82], ["google one", 74], ["google pixel 9", 78],
    ["youtube studio", 77], ["google adsense", 74], ["google analytics", 75],
    ["google search console", 72], ["google ads", 76],

    // ── Movies / TV Shows ─────────────────────────────────────────────────────
    ["movies 2025", 85], ["movies 2024", 82], ["new movies", 83], ["movies online", 80],
    ["bollywood movies", 79], ["bollywood movies 2025", 76], ["bollywood songs", 74],
    ["hollywood movies", 80], ["hollywood movies 2025", 77],
    ["south indian movies", 78], ["tamil movies", 76], ["telugu movies", 75],
    ["kannada movies", 73], ["malayalam movies", 74],
    ["avengers", 82], ["marvel movies", 80], ["marvel phase 5", 77],
    ["dc movies", 79], ["batman", 80], ["superman", 78], ["aquaman 2", 74],
    ["fast and furious", 78], ["john wick 4", 77], ["oppenheimer", 80],
    ["barbie movie", 79], ["dune part 2", 81], ["deadpool wolverine", 80],
    ["inside out 2", 78], ["kingdom of the planet of the apes", 75],
    ["web series 2025", 81], ["best web series", 79], ["imdb top movies", 78],
    ["imdb rating", 76], ["rotten tomatoes", 77], ["letterboxd", 74],
    ["breaking bad", 80], ["game of thrones", 82], ["house of the dragon", 80],
    ["the boys", 81], ["stranger things", 83], ["stranger things season 5", 80],
    ["wednesday series", 78], ["squid game", 84], ["squid game season 2", 81],
    ["money heist", 80], ["money heist korea", 76], ["dark series", 78],
    ["peaky blinders", 79], ["the witcher", 78], ["rings of power", 76],
    ["mandalorian", 79], ["ahsoka series", 74], ["loki season 2", 76],
    ["one piece live action", 78], ["avatar last airbender netflix", 76],

    // ── Music ─────────────────────────────────────────────────────────────────
    ["songs", 87], ["new songs 2025", 82], ["top songs", 80], ["hindi songs", 79],
    ["english songs", 78], ["lo fi music", 77], ["lofi hip hop", 75],
    ["punjabi songs", 78], ["tamil songs", 76], ["telugu songs", 75],
    ["arijit singh songs", 80], ["ap dhillon songs", 78], ["diljit dosanjh", 79],
    ["taylor swift", 88], ["taylor swift eras tour", 83], ["taylor swift songs", 82],
    ["the weeknd", 85], ["the weeknd songs", 82], ["bad bunny", 82],
    ["drake songs", 80], ["drake new album", 78], ["kendrick lamar", 83],
    ["billie eilish", 81], ["olivia rodrigo", 80], ["harry styles", 79],
    ["bts", 86], ["bts songs", 83], ["bts comeback 2025", 79],
    ["blackpink", 84], ["blackpink songs", 81], ["stray kids", 80],
    ["ed sheeran", 82], ["ed sheeran songs", 79], ["post malone", 79],
    ["ariana grande", 83], ["ariana grande songs", 80],
    ["music download", 79], ["mp3 download", 76], ["ringtones download", 73],
    ["gaana", 77], ["jiosaavn", 79], ["wynk music", 72], ["resso", 70],

    // ── Sports ────────────────────────────────────────────────────────────────
    ["cricket", 88], ["cricket score", 86], ["cricket live", 83],
    ["ipl 2025", 90], ["ipl schedule 2025", 86], ["ipl points table", 83],
    ["ipl live score", 85], ["ipl auction", 80], ["ipl tickets", 78],
    ["india vs pakistan", 88], ["india vs australia", 82], ["india vs england", 80],
    ["virat kohli", 86], ["ms dhoni", 85], ["rohit sharma", 84],
    ["t20 world cup", 85], ["t20 world cup 2026", 82], ["odi world cup", 80],
    ["football", 86], ["football live score", 82], ["football news", 80],
    ["fifa world cup", 84], ["champions league", 83], ["premier league", 82],
    ["la liga", 80], ["bundesliga", 78], ["serie a", 77], ["ligue 1", 76],
    ["messi", 87], ["cristiano ronaldo", 88], ["neymar", 80], ["mbappe", 84],
    ["real madrid", 83], ["barcelona", 82], ["manchester united", 81],
    ["manchester city", 82], ["arsenal", 80], ["liverpool", 81], ["chelsea", 79],
    ["nba", 83], ["nba scores", 80], ["nba standings", 78], ["nba draft 2025", 76],
    ["lakers", 81], ["celtics", 80], ["warriors", 79], ["lebron james", 84],
    ["stephen curry", 82], ["formula 1", 83], ["f1 2025 season", 80],
    ["f1 standings", 78], ["max verstappen", 82], ["lewis hamilton ferrari", 83],
    ["tennis", 79], ["wimbledon 2025", 77], ["us open tennis", 76],
    ["us open 2025", 75], ["australian open", 74], ["french open", 73],
    ["badminton", 76], ["kabaddi", 74], ["pro kabaddi 2025", 72],
    ["wrestling", 78], ["wwe", 80], ["wwe raw", 77], ["wwe smackdown", 76],

    // ── Shopping / E-commerce ─────────────────────────────────────────────────
    ["amazon", 93], ["amazon sale", 88], ["amazon prime", 84], ["amazon shopping", 82],
    ["amazon great indian sale", 82], ["amazon deals", 79],
    ["flipkart", 85], ["flipkart sale", 81], ["flipkart big billion days", 79],
    ["myntra", 80], ["myntra sale", 76], ["nykaa", 76], ["meesho", 78],
    ["ajio", 74], ["tata cliq", 72], ["croma", 73], ["reliance digital", 72],
    ["swiggy", 82], ["swiggy instamart", 78], ["zomato", 83], ["zomato gold", 77],
    ["blinkit", 79], ["zepto", 76], ["dunzo", 72], ["bigbasket", 75],
    ["iphone 16", 88], ["iphone 16 pro", 85], ["iphone 16 price", 83],
    ["samsung galaxy s25", 83], ["oneplus 13", 80], ["pixel 9", 78],
    ["redmi note 14", 77], ["realme 13", 74], ["vivo v30", 73],
    ["laptop under 50000", 78], ["best laptop 2025", 76], ["gaming laptop", 77],
    ["airpods", 82], ["airpods pro 2", 79], ["samsung buds", 77], ["nothing ear", 75],
    ["smartwatch", 78], ["apple watch ultra 2", 76], ["samsung galaxy watch", 74],

    // ── Finance / Banking ─────────────────────────────────────────────────────
    ["stock market", 82], ["stock market today", 79], ["nse", 80], ["bse", 78],
    ["sensex", 80], ["nifty 50", 79], ["nifty bank", 76], ["zerodha", 78],
    ["groww", 80], ["groww app", 77], ["upstox", 76], ["angel one", 74],
    ["mutual funds", 79], ["sip investment", 76], ["index funds", 74],
    ["crypto", 79], ["bitcoin", 81], ["bitcoin price", 79], ["ethereum", 76],
    ["ethereum price", 74], ["solana", 75], ["doge coin", 73], ["binance", 77],
    ["coinbase", 75], ["wazirx", 73], ["coindcx", 72],
    ["paytm", 78], ["phonepe", 82], ["gpay", 83], ["upi payment", 75],
    ["upi apps", 72], ["net banking", 77], ["sbi net banking", 74],
    ["hdfc net banking", 73], ["icici net banking", 72], ["axis bank", 71],
    ["income tax return", 80], ["itr filing 2025", 78], ["gst", 76],
    ["pan card apply", 74], ["aadhar card", 76], ["voter id", 73],
    ["passport apply", 76], ["emi calculator", 78], ["loan calculator", 76],
    ["home loan", 78], ["personal loan", 76], ["car loan", 74], ["credit card", 77],

    // ── Education ─────────────────────────────────────────────────────────────
    ["neet 2025", 84], ["neet result", 81], ["neet answer key", 79],
    ["jee main 2025", 83], ["jee advanced 2025", 80], ["jee result", 78],
    ["upsc", 82], ["upsc syllabus", 79], ["upsc current affairs", 77],
    ["ssc", 78], ["ssc cgl", 76], ["ssc chsl", 74],
    ["gate 2025", 76], ["cat exam", 77], ["cat result", 74],
    ["cbse result", 80], ["cbse board exam", 78], ["cbse syllabus", 75],
    ["12th result 2025", 78], ["10th result 2025", 77],
    ["coursera", 80], ["udemy", 82], ["udemy courses", 78], ["edx", 76],
    ["khan academy", 78], ["byjus", 79], ["unacademy", 78], ["vedantu", 76],
    ["nptel", 74], ["mit opencourseware", 73],
    ["free courses", 78], ["online courses 2025", 76], ["free certification", 74],
    ["google certificates", 76], ["ibm data science certificate", 73],
    ["english speaking", 77], ["spoken english", 75], ["ielts", 79],
    ["ielts preparation", 76], ["toefl", 74], ["gre exam", 76], ["gmat", 74],
    ["study abroad", 76], ["usa universities", 74], ["canada visa", 75],
    ["student visa", 74], ["scholarship 2025", 73],

    // ── Travel ────────────────────────────────────────────────────────────────
    ["irctc", 88], ["irctc login", 84], ["irctc train booking", 82],
    ["pnr status", 80], ["train running status", 78], ["train time table", 76],
    ["flight booking", 82], ["makemytrip", 80], ["goibibo", 78], ["ixigo", 76],
    ["yatra", 74], ["cleartrip", 73], ["skyscanner", 75], ["kayak flights", 72],
    ["hotels near me", 80], ["oyo rooms", 78], ["oyo booking", 75],
    ["airbnb", 79], ["booking.com", 77], ["trivago", 74],
    ["places to visit in india", 78], ["goa travel guide", 76], ["manali trip", 75],
    ["kerala tourism", 76], ["rajasthan tourism", 74], ["himachal pradesh", 75],
    ["uttarakhand tourism", 76], ["mussoorie", 74], ["rishikesh", 77],
    ["varanasi", 75], ["agra taj mahal", 77], ["jaipur", 75],
    ["dubai travel", 76], ["singapore travel", 75], ["thailand travel", 77],
    ["japan travel guide", 78], ["europe trip", 76], ["us visa", 77],
    ["canada travel", 75], ["australia immigration", 74],
    ["passport renewal", 76], ["visa apply online", 75],
    ["best places to visit 2025", 74], ["travel vlog", 72],

    // ── Health / Fitness ──────────────────────────────────────────────────────
    ["symptoms checker", 76], ["headache causes", 74], ["fever treatment", 73],
    ["covid symptoms", 75], ["covid vaccine", 73], ["health tips", 77],
    ["yoga for beginners", 78], ["yoga poses", 75], ["meditation guide", 76],
    ["workout plan", 79], ["gym workout", 77], ["home workout", 78],
    ["weight loss tips", 80], ["how to lose belly fat", 78], ["keto diet", 76],
    ["intermittent fasting", 75], ["calorie calculator", 74], ["bmi calculator", 76],
    ["protein foods", 74], ["high protein diet", 73], ["vegan diet", 72],
    ["mental health", 78], ["anxiety relief", 75], ["stress management", 74],
    ["sleep tips", 74], ["insomnia treatment", 73], ["melatonin", 70],
    ["doctor near me", 79], ["hospital near me", 78], ["pharmacy near me", 77],
    ["1mg", 78], ["netmeds", 77], ["practo", 79], ["apollo pharmacy", 76],

    // ── News / Current Affairs ────────────────────────────────────────────────
    ["news today", 90], ["india news", 87], ["world news", 85], ["breaking news", 88],
    ["cricket news", 83], ["bollywood news", 81], ["technology news", 79],
    ["business news", 78], ["sports news", 82], ["political news", 80],
    ["times of india", 82], ["hindustan times", 80], ["ndtv", 81], ["the hindu", 79],
    ["bbc news", 82], ["cnn news", 80], ["reuters", 78], ["al jazeera", 76],
    ["weather today", 92], ["weather tomorrow", 88], ["weather forecast", 85],
    ["air quality index", 78], ["aqi today", 76],

    // ── Utilities / Tools ─────────────────────────────────────────────────────
    ["wikipedia", 89], ["how to", 88], ["what is", 86], ["dictionary", 84],
    ["thesaurus", 78], ["calculator", 86], ["unit converter", 79],
    ["currency converter", 80], ["usd to inr", 82], ["inr to usd", 79],
    ["time zone converter", 77], ["world clock", 75],
    ["pdf to word", 78], ["word to pdf", 77], ["image compressor", 76],
    ["image converter", 74], ["video converter", 75], ["video downloader", 76],
    ["youtube to mp3", 79], ["youtube downloader", 78], ["instagram downloader", 76],
    ["url shortener", 74], ["qr code generator", 78], ["barcode scanner", 73],
    ["resume builder", 77], ["cover letter generator", 74],
    ["paraphrasing tool", 76], ["plagiarism checker", 78], ["grammar checker", 79],
    ["grammarly", 82], ["notion", 80], ["notion templates", 76],
    ["trello", 76], ["asana", 75], ["slack", 79], ["zoom", 84], ["zoom meeting", 81],
    ["google meet free", 78], ["microsoft teams", 79],
    ["canva", 83], ["canva templates", 79], ["adobe express", 76],
    ["figma", 80], ["figma tutorial", 76], ["photoshop online", 74],
    ["remove bg", 79], ["background remover", 76], ["image to text", 73],
    ["compress pdf", 76], ["merge pdf", 75], ["split pdf", 73],
    ["vpn free", 78], ["best vpn 2025", 76], ["nordvpn", 77], ["expressvpn", 75],
    ["protonvpn", 73], ["warp vpn", 72],
    ["chatting app", 75], ["video calling app", 76], ["dating apps india", 73],
    ["tinder", 78], ["bumble", 76], ["hinge", 74],
];

popularSearches.forEach(([term, freq]) => searchTrie.insert(term, freq));

// Re-insert any terms the user has personally searched before
seedCustomSearches(searchTrie);

// ─── AUTOCOMPLETE UI ────────────────────────────────────────────────────────

function setupSearchAutocomplete() {
    const input = document.querySelector('.search-bar input');
    const form  = document.querySelector('.search-bar');
    if (!input || !form) return;

    // Create dropdown container
    const dropdown = document.createElement('ul');
    dropdown.id = 'autocomplete-list';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(10, 10, 10, 0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,0.12);
        border-top: none;
        border-radius: 0 0 10px 10px;
        list-style: none;
        margin: 0;
        padding: 4px 0;
        z-index: 9999;
        display: none;
        box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        max-height: 320px;
        overflow-y: auto;
    `;

    // Make form relatively positioned for dropdown alignment
    form.style.position = 'relative';
    form.style.flexWrap = 'wrap';
    form.appendChild(dropdown);

    let activeIndex = -1;

    function renderSuggestions(suggestions) {
        dropdown.innerHTML = '';
        activeIndex = -1;

        if (!suggestions.length) {
            dropdown.style.display = 'none';
            return;
        }

        suggestions.forEach((suggestion, idx) => {
            const li = document.createElement('li');
            li.dataset.index = idx;

            const inputVal = input.value.toLowerCase();
            const matchStart = suggestion.indexOf(inputVal);
            let displayHTML = suggestion;
            if (matchStart !== -1 && inputVal.length > 0) {
                displayHTML =
                    suggestion.slice(0, matchStart) +
                    `<strong style="color:#fff;font-weight:600">${suggestion.slice(matchStart, matchStart + inputVal.length)}</strong>` +
                    suggestion.slice(matchStart + inputVal.length);
            }

            li.innerHTML = `
                <span style="color:#aaa;font-size:15px;margin-right:10px;vertical-align:middle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                </span>
                <span style="color:rgba(220,220,220,0.9);font-size:15px;letter-spacing:0.02em">${displayHTML}</span>
            `;
            li.style.cssText = `
                padding: 10px 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: background 0.15s;
                border-radius: 6px;
                margin: 2px 4px;
            `;

            li.addEventListener('mouseenter', () => {
                clearActive();
                li.style.background = 'rgba(255,255,255,0.08)';
                activeIndex = idx;
            });
            li.addEventListener('mouseleave', () => {
                li.style.background = 'transparent';
            });
            li.addEventListener('mousedown', (e) => {
                e.preventDefault(); // prevent blur before click
                input.value = suggestion;
                saveCustomSearch(suggestion);
                hideDropdown();
                form.submit();
            });

            dropdown.appendChild(li);
        });

        dropdown.style.display = 'block';
    }

    function clearActive() {
        [...dropdown.querySelectorAll('li')].forEach(li => {
            li.style.background = 'transparent';
        });
    }

    function setActive(idx) {
        const items = [...dropdown.querySelectorAll('li')];
        clearActive();
        if (idx >= 0 && idx < items.length) {
            items[idx].style.background = 'rgba(255,255,255,0.08)';
            input.value = items[idx].textContent.trim().replace(/^\S+\s+/, '');
            // Actually get clean text:
            input.value = popularSearches
                .map(p => p[0])
                .concat([]) // fallback
                .find(t => items[idx].querySelector('span:last-child').textContent.trim() === t)
                || items[idx].querySelector('span:last-child').textContent.trim();
        }
    }

    function hideDropdown() {
        dropdown.style.display = 'none';
        activeIndex = -1;
    }

    // Input handler — query the Trie
    input.addEventListener('input', () => {
        const val = input.value.trim();
        if (!val) { hideDropdown(); return; }
        const suggestions = searchTrie.suggest(val, 8);
        renderSuggestions(suggestions);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('li');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
            setActive(activeIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            setActive(activeIndex);
        } else if (e.key === 'Escape') {
            hideDropdown();
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0) {
                e.preventDefault();
                input.value = items[activeIndex].querySelector('span:last-child').textContent.trim();
                saveCustomSearch(input.value);
                hideDropdown();
                form.submit();
            }
        }
    });

    // Hide on outside click
    document.addEventListener('click', (e) => {
        if (!form.contains(e.target)) hideDropdown();
    });

    // Save & learn any search submitted directly (typed + Enter, or search button click)
    form.addEventListener('submit', () => {
        const val = input.value.trim();
        if (val) saveCustomSearch(val);
    });

    // Show again on focus if there's a value
    input.addEventListener('focus', () => {
        const val = input.value.trim();
        if (val) {
            const suggestions = searchTrie.suggest(val, 8);
            renderSuggestions(suggestions);
        }
    });
}

// ─── CLOCK ──────────────────────────────────────────────────────────────────

function updateClock() {
    var now = new Date();
    var dname = now.getDay(),
        mo = now.getMonth(),
        dnum = now.getDate(),
        yr = now.getFullYear(),
        hou = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds();

    Number.prototype.pad = function (digits) {
        for (var n = this.toString(); n.length < digits; n = 0 + n);
        return n;
    };

    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var week   = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
    var ids    = ["day","month","date","year","hour","min","sec"];
    var values = [week[dname],months[mo],dnum.pad(2),yr,hou.pad(2),min.pad(2),sec.pad(2)];

    for (var i = 0; i < ids.length; i++)
        document.getElementById(ids[i]).firstChild.nodeValue = values[i];
}

function initClock() {
    updateClock();
    window.setInterval(updateClock, 1000);
    setupSearchAutocomplete(); // initialise Trie autocomplete
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

const toggleSidebar = () => document.body.classList.toggle("open");
const toggleMenu   = () => document.body.classList.toggle("open");
const off          = () => document.body.classList.remove("open");