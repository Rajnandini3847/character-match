// Curated character DB. Each entry: stable id, display name, source title,
// source category, region (helps weight relevance), and vibe tags (used by
// the matcher prompt). wikiQuery = the title to query for an image via
// Wikipedia REST API; defaults to `name` if omitted.

export interface Character {
  id: string;
  name: string;
  source: string;
  sourceType:
    | "anime"
    | "cartoon"
    | "movie"
    | "tv"
    | "game"
    | "book"
    | "comic"
    | "bollywood";
  region: "india" | "japan" | "us" | "uk" | "global" | "korea" | "europe";
  vibeTags: string[];
  wikiQuery?: string;
}

export const CHARACTERS: Character[] = [
  // ─── INDIAN ─────────────────────────────────────────────────────────────
  { id: "chota-bheem", name: "Chota Bheem", source: "Chhota Bheem", sourceType: "cartoon", region: "india", vibeTags: ["strong", "kind", "energetic", "snack-loving", "round-faced", "warm-skinned", "young hero"], wikiQuery: "Chhota Bheem" },
  { id: "mighty-raju", name: "Mighty Raju", source: "Mighty Raju", sourceType: "cartoon", region: "india", vibeTags: ["small", "brave", "bright eyes", "spunky", "kid superhero"], wikiQuery: "Mighty Raju" },
  { id: "krishna-cartoon", name: "Krishna", source: "Krishna Balram", sourceType: "cartoon", region: "india", vibeTags: ["mischievous", "blue-tinted", "playful", "flute-carrying", "divine kid"], wikiQuery: "Krishna" },
  { id: "hanuman-cartoon", name: "Bal Hanuman", source: "Bal Hanuman", sourceType: "cartoon", region: "india", vibeTags: ["strong", "loyal", "monkey-like", "earnest", "warrior kid"], wikiQuery: "Bal Hanuman" },
  { id: "motu", name: "Motu", source: "Motu Patlu", sourceType: "cartoon", region: "india", vibeTags: ["round", "samosa-loving", "lazy-charming", "moustached", "cheerful"], wikiQuery: "Motu Patlu" },
  { id: "patlu", name: "Patlu", source: "Motu Patlu", sourceType: "cartoon", region: "india", vibeTags: ["thin", "tall", "bespectacled", "brainy", "calm"], wikiQuery: "Motu Patlu" },
  { id: "shinchan-india", name: "Shinchan", source: "Crayon Shin-chan", sourceType: "anime", region: "japan", vibeTags: ["mischievous", "round face", "bowl haircut", "cheeky", "wild kid"], wikiQuery: "Crayon Shin-chan" },
  { id: "doraemon-india", name: "Nobita", source: "Doraemon", sourceType: "anime", region: "japan", vibeTags: ["clumsy", "bespectacled", "soft", "dreamy", "underdog"], wikiQuery: "Nobita Nobi" },
  { id: "geet", name: "Geet", source: "Jab We Met", sourceType: "bollywood", region: "india", vibeTags: ["bubbly", "talkative", "long-haired", "punjabi", "free-spirit", "smiling"], wikiQuery: "Jab We Met" },
  { id: "munna-bhai", name: "Munna Bhai", source: "Munna Bhai MBBS", sourceType: "bollywood", region: "india", vibeTags: ["big-hearted", "rough", "warm", "moustached", "moral gangster"], wikiQuery: "Munna Bhai M.B.B.S." },
  { id: "phunsukh-wangdu", name: "Phunsukh Wangdu (Rancho)", source: "3 Idiots", sourceType: "bollywood", region: "india", vibeTags: ["brilliant", "curious", "playful", "long hair", "anti-establishment"], wikiQuery: "3 Idiots" },
  { id: "kabir-singh", name: "Kabir Singh", source: "Kabir Singh", sourceType: "bollywood", region: "india", vibeTags: ["intense", "brooding", "stubble", "messy hair", "moody"], wikiQuery: "Kabir Singh" },
  { id: "piku", name: "Piku", source: "Piku", sourceType: "bollywood", region: "india", vibeTags: ["independent", "curly hair", "kurta-clad", "no-nonsense", "modern Indian woman"], wikiQuery: "Piku" },
  { id: "kalki-pp", name: "Naina", source: "Yeh Jawaani Hai Deewani", sourceType: "bollywood", region: "india", vibeTags: ["studious", "bespectacled", "quiet", "transforming", "earnest"], wikiQuery: "Yeh Jawaani Hai Deewani" },
  { id: "bhuvi", name: "Bhuvan", source: "Lagaan", sourceType: "bollywood", region: "india", vibeTags: ["villager", "determined", "barefoot-energy", "earthy", "leader"], wikiQuery: "Lagaan" },

  // ─── ANIME ──────────────────────────────────────────────────────────────
  { id: "goku", name: "Son Goku", source: "Dragon Ball", sourceType: "anime", region: "japan", vibeTags: ["spiky hair", "happy", "muscular", "fight-loving", "innocent", "orange gi"], wikiQuery: "Goku" },
  { id: "naruto", name: "Naruto Uzumaki", source: "Naruto", sourceType: "anime", region: "japan", vibeTags: ["blond spikes", "whisker marks", "loud", "determined", "orange clothes", "underdog"], wikiQuery: "Naruto Uzumaki" },
  { id: "sasuke", name: "Sasuke Uchiha", source: "Naruto", sourceType: "anime", region: "japan", vibeTags: ["black hair", "brooding", "cool", "edgy", "intense eyes"], wikiQuery: "Sasuke Uchiha" },
  { id: "luffy", name: "Monkey D. Luffy", source: "One Piece", sourceType: "anime", region: "japan", vibeTags: ["straw hat", "carefree", "wide smile", "rubbery", "scar on cheek", "adventurer"], wikiQuery: "Monkey D. Luffy" },
  { id: "levi", name: "Levi Ackerman", source: "Attack on Titan", sourceType: "anime", region: "japan", vibeTags: ["undercut", "short", "deadpan", "neat", "intense stare", "all-black"], wikiQuery: "Levi Ackerman" },
  { id: "mikasa", name: "Mikasa Ackerman", source: "Attack on Titan", sourceType: "anime", region: "japan", vibeTags: ["black hair", "red scarf", "stoic", "athletic", "fierce"], wikiQuery: "Mikasa Ackerman" },
  { id: "eren", name: "Eren Yeager", source: "Attack on Titan", sourceType: "anime", region: "japan", vibeTags: ["brown hair", "green eyes", "angry", "intense", "messy", "rebel"], wikiQuery: "Eren Yeager" },
  { id: "light", name: "Light Yagami", source: "Death Note", sourceType: "anime", region: "japan", vibeTags: ["neat hair", "polished", "intelligent", "calculating", "studious"], wikiQuery: "Light Yagami" },
  { id: "lelouch", name: "Lelouch Lamperouge", source: "Code Geass", sourceType: "anime", region: "japan", vibeTags: ["pale", "violet eyes", "tactical", "lanky", "noble look"], wikiQuery: "Lelouch Lamperouge" },
  { id: "spike", name: "Spike Spiegel", source: "Cowboy Bebop", sourceType: "anime", region: "japan", vibeTags: ["lanky", "lazy-cool", "messy green-tinted hair", "smoker", "bounty hunter"], wikiQuery: "Spike Spiegel" },
  { id: "edward-elric", name: "Edward Elric", source: "Fullmetal Alchemist", sourceType: "anime", region: "japan", vibeTags: ["short", "blond braid", "fiery", "red coat", "stubborn"], wikiQuery: "Edward Elric" },
  { id: "sailor-moon", name: "Sailor Moon (Usagi)", source: "Sailor Moon", sourceType: "anime", region: "japan", vibeTags: ["twin buns", "blond", "crybaby", "magical girl", "pink-and-blue"], wikiQuery: "Sailor Moon" },
  { id: "chihiro", name: "Chihiro", source: "Spirited Away", sourceType: "anime", region: "japan", vibeTags: ["timid", "pink shirt", "ponytail", "growing brave", "wide-eyed"], wikiQuery: "Chihiro Ogino" },
  { id: "totoro", name: "Totoro", source: "My Neighbor Totoro", sourceType: "anime", region: "japan", vibeTags: ["round", "soft", "huge", "gentle", "sleepy", "grey"], wikiQuery: "Totoro" },
  { id: "howl", name: "Howl", source: "Howl's Moving Castle", sourceType: "anime", region: "japan", vibeTags: ["vain", "blond", "flamboyant", "dramatic", "beautiful"], wikiQuery: "Howl Jenkins Pendragon" },
  { id: "sophie", name: "Sophie Hatter", source: "Howl's Moving Castle", sourceType: "anime", region: "japan", vibeTags: ["quiet", "kind", "long braid", "humble", "transforming"], wikiQuery: "Howl's Moving Castle" },
  { id: "kiki", name: "Kiki", source: "Kiki's Delivery Service", sourceType: "anime", region: "japan", vibeTags: ["young witch", "red bow", "bobbed black hair", "independent", "navy-dressed"], wikiQuery: "Kiki's Delivery Service" },
  { id: "asuka", name: "Asuka Langley", source: "Neon Genesis Evangelion", sourceType: "anime", region: "japan", vibeTags: ["red hair", "fiery", "pilot", "proud", "twin clips"], wikiQuery: "Asuka Langley Soryu" },
  { id: "rei", name: "Rei Ayanami", source: "Neon Genesis Evangelion", sourceType: "anime", region: "japan", vibeTags: ["pale", "blue hair", "red eyes", "quiet", "mysterious"], wikiQuery: "Rei Ayanami" },
  { id: "sakura-ccs", name: "Sakura Kinomoto", source: "Cardcaptor Sakura", sourceType: "anime", region: "japan", vibeTags: ["short brown hair", "green eyes", "cheerful", "athletic", "magical girl"], wikiQuery: "Sakura Kinomoto" },
  { id: "yor", name: "Yor Forger", source: "Spy x Family", sourceType: "anime", region: "japan", vibeTags: ["long black hair", "red eyes", "elegant", "deadly", "polite"], wikiQuery: "Spy × Family" },

  // ─── WESTERN ANIMATION ──────────────────────────────────────────────────
  { id: "spongebob", name: "SpongeBob SquarePants", source: "SpongeBob SquarePants", sourceType: "cartoon", region: "us", vibeTags: ["yellow", "buck teeth", "endlessly cheerful", "square", "optimistic"], wikiQuery: "SpongeBob SquarePants" },
  { id: "bart", name: "Bart Simpson", source: "The Simpsons", sourceType: "cartoon", region: "us", vibeTags: ["spiky hair", "mischievous", "skater", "smartass", "yellow-skinned"], wikiQuery: "Bart Simpson" },
  { id: "lisa", name: "Lisa Simpson", source: "The Simpsons", sourceType: "cartoon", region: "us", vibeTags: ["smart", "earnest", "yellow", "spiky-rays hair", "saxophone player"], wikiQuery: "Lisa Simpson" },
  { id: "bluey", name: "Bluey", source: "Bluey", sourceType: "cartoon", region: "global", vibeTags: ["blue heeler pup", "playful", "imaginative", "warm family", "energetic kid"], wikiQuery: "Bluey (2018 TV series)" },
  { id: "joy", name: "Joy", source: "Inside Out", sourceType: "movie", region: "us", vibeTags: ["yellow glow", "blue pixie hair", "huge smile", "optimistic", "green dress"], wikiQuery: "Inside Out (2015 film)" },
  { id: "anger", name: "Anger", source: "Inside Out", sourceType: "movie", region: "us", vibeTags: ["red", "fiery temper", "small", "sharp suit", "loud"], wikiQuery: "Inside Out (2015 film)" },
  { id: "merida", name: "Merida", source: "Brave", sourceType: "movie", region: "us", vibeTags: ["red curly hair", "fierce", "archer", "freckled", "untameable"], wikiQuery: "Merida (Brave)" },
  { id: "moana", name: "Moana", source: "Moana", sourceType: "movie", region: "us", vibeTags: ["wavy brown hair", "brave", "ocean-loving", "earthy", "warm"], wikiQuery: "Moana (character)" },
  { id: "elsa", name: "Elsa", source: "Frozen", sourceType: "movie", region: "us", vibeTags: ["platinum braid", "ice-blue", "regal", "introverted", "powerful"], wikiQuery: "Elsa (Frozen)" },
  { id: "rapunzel", name: "Rapunzel", source: "Tangled", sourceType: "movie", region: "us", vibeTags: ["very long blond hair", "wide green eyes", "curious", "barefoot", "creative"], wikiQuery: "Rapunzel (Tangled)" },
  { id: "mulan", name: "Mulan", source: "Mulan", sourceType: "movie", region: "us", vibeTags: ["determined", "black hair", "brave", "soft-faced", "warrior"], wikiQuery: "Fa Mulan" },
  { id: "kim-possible", name: "Kim Possible", source: "Kim Possible", sourceType: "cartoon", region: "us", vibeTags: ["red hair", "athletic", "confident", "green-eyed", "spy energy"], wikiQuery: "Kim Possible (character)" },
  { id: "ron-stoppable", name: "Ron Stoppable", source: "Kim Possible", sourceType: "cartoon", region: "us", vibeTags: ["blond floppy hair", "goofy", "tall", "loyal", "easygoing"], wikiQuery: "Ron Stoppable" },
  { id: "pinkie-pie", name: "Pinkie Pie", source: "My Little Pony", sourceType: "cartoon", region: "us", vibeTags: ["pink", "bouncy curls", "hyper happy", "party-loving", "warm"], wikiQuery: "Pinkie Pie" },
  { id: "spirited-away-no-face", name: "No-Face", source: "Spirited Away", sourceType: "anime", region: "japan", vibeTags: ["mask", "tall", "quiet", "lonely", "mysterious"], wikiQuery: "No-Face" },

  // ─── LIVE-ACTION TV / MOVIES ────────────────────────────────────────────
  { id: "harry", name: "Harry Potter", source: "Harry Potter", sourceType: "movie", region: "uk", vibeTags: ["round glasses", "messy black hair", "scar", "earnest", "modest"], wikiQuery: "Harry Potter (character)" },
  { id: "hermione", name: "Hermione Granger", source: "Harry Potter", sourceType: "movie", region: "uk", vibeTags: ["bushy brown hair", "brainy", "fierce", "studious", "warm-eyed"], wikiQuery: "Hermione Granger" },
  { id: "ron-weasley", name: "Ron Weasley", source: "Harry Potter", sourceType: "movie", region: "uk", vibeTags: ["red hair", "freckles", "tall", "loyal", "goofy"], wikiQuery: "Ron Weasley" },
  { id: "luna", name: "Luna Lovegood", source: "Harry Potter", sourceType: "movie", region: "uk", vibeTags: ["dreamy", "long blond hair", "quirky accessories", "ethereal", "kind"], wikiQuery: "Luna Lovegood" },
  { id: "eleven", name: "Eleven", source: "Stranger Things", sourceType: "tv", region: "us", vibeTags: ["shaved head turned bob", "quiet intensity", "wide eyes", "powerful", "soft"], wikiQuery: "Eleven (Stranger Things)" },
  { id: "wednesday", name: "Wednesday Addams", source: "Wednesday", sourceType: "tv", region: "us", vibeTags: ["black braids", "pale", "deadpan", "gothic", "sharp"], wikiQuery: "Wednesday Addams" },
  { id: "tony-stark", name: "Iron Man (Tony Stark)", source: "Marvel", sourceType: "movie", region: "us", vibeTags: ["goatee", "smart-casual", "sharp", "witty", "engineer"], wikiQuery: "Iron Man" },
  { id: "cap", name: "Captain America (Steve Rogers)", source: "Marvel", sourceType: "movie", region: "us", vibeTags: ["blond", "square jaw", "earnest", "muscular", "boy-scout"], wikiQuery: "Captain America" },
  { id: "thor", name: "Thor", source: "Marvel", sourceType: "movie", region: "us", vibeTags: ["long blond hair", "muscular", "warm-eyed", "royal", "thunderous"], wikiQuery: "Thor (Marvel Cinematic Universe)" },
  { id: "loki", name: "Loki", source: "Marvel", sourceType: "movie", region: "us", vibeTags: ["long black hair", "pale", "sly", "clever", "trickster", "green-and-gold"], wikiQuery: "Loki (Marvel Cinematic Universe)" },
  { id: "natasha", name: "Black Widow", source: "Marvel", sourceType: "movie", region: "us", vibeTags: ["red hair", "athletic", "spy", "calm", "deadly"], wikiQuery: "Black Widow (Natasha Romanoff)" },
  { id: "peter-parker", name: "Spider-Man (Peter Parker)", source: "Marvel", sourceType: "movie", region: "us", vibeTags: ["brown messy hair", "nerdy", "lanky", "good-natured", "teen"], wikiQuery: "Spider-Man" },
  { id: "wonder-woman", name: "Wonder Woman (Diana)", source: "DC", sourceType: "movie", region: "us", vibeTags: ["dark wavy hair", "regal", "muscular", "tall", "warrior"], wikiQuery: "Wonder Woman (2017 film)" },
  { id: "katniss", name: "Katniss Everdeen", source: "The Hunger Games", sourceType: "movie", region: "us", vibeTags: ["long braid", "fierce", "archer", "stoic", "earthy"], wikiQuery: "Katniss Everdeen" },
  { id: "rey", name: "Rey", source: "Star Wars", sourceType: "movie", region: "us", vibeTags: ["triple buns", "scrappy", "scavenger", "earnest", "powerful"], wikiQuery: "Rey (Star Wars)" },
  { id: "padme", name: "Padmé Amidala", source: "Star Wars", sourceType: "movie", region: "us", vibeTags: ["elaborate hairstyles", "regal", "calm", "diplomat", "elegant"], wikiQuery: "Padmé Amidala" },
  { id: "leia", name: "Princess Leia", source: "Star Wars", sourceType: "movie", region: "us", vibeTags: ["side buns", "white robe", "fierce", "commanding", "iconic"], wikiQuery: "Princess Leia" },
  { id: "indiana", name: "Indiana Jones", source: "Indiana Jones", sourceType: "movie", region: "us", vibeTags: ["fedora", "leather jacket", "rugged", "adventurer", "stubble"], wikiQuery: "Indiana Jones" },
  { id: "walter-white", name: "Walter White", source: "Breaking Bad", sourceType: "tv", region: "us", vibeTags: ["bald", "goatee", "intense", "transformed teacher", "glasses"], wikiQuery: "Walter White (Breaking Bad)" },
  { id: "rachel", name: "Rachel Green", source: "Friends", sourceType: "tv", region: "us", vibeTags: ["the rachel cut", "stylish", "warm", "trendy", "smiling"], wikiQuery: "Rachel Green" },
  { id: "phoebe", name: "Phoebe Buffay", source: "Friends", sourceType: "tv", region: "us", vibeTags: ["long blond hair", "free-spirit", "quirky", "musician", "warm"], wikiQuery: "Phoebe Buffay" },
  { id: "wadu", name: "Daenerys", source: "Game of Thrones", sourceType: "tv", region: "us", vibeTags: ["platinum hair", "regal", "intense violet eyes", "queenly"], wikiQuery: "Daenerys Targaryen" },
  { id: "arya", name: "Arya Stark", source: "Game of Thrones", sourceType: "tv", region: "us", vibeTags: ["short brown hair", "tomboy", "small", "deadly", "fierce"], wikiQuery: "Arya Stark" },

  // ─── GAMES ──────────────────────────────────────────────────────────────
  { id: "mario", name: "Mario", source: "Super Mario", sourceType: "game", region: "japan", vibeTags: ["moustache", "red cap", "round", "cheerful", "blue overalls"], wikiQuery: "Mario" },
  { id: "peach", name: "Princess Peach", source: "Super Mario", sourceType: "game", region: "japan", vibeTags: ["blond", "pink dress", "kind", "regal", "long-haired"], wikiQuery: "Princess Peach" },
  { id: "link", name: "Link", source: "The Legend of Zelda", sourceType: "game", region: "japan", vibeTags: ["green tunic", "blond", "blue eyes", "silent", "hero"], wikiQuery: "Link (The Legend of Zelda)" },
  { id: "zelda", name: "Princess Zelda", source: "The Legend of Zelda", sourceType: "game", region: "japan", vibeTags: ["blond", "elegant", "regal", "wise", "pointed ears"], wikiQuery: "Princess Zelda" },
  { id: "lara", name: "Lara Croft", source: "Tomb Raider", sourceType: "game", region: "uk", vibeTags: ["brunette braid", "athletic", "adventurer", "intelligent", "tan"], wikiQuery: "Lara Croft" },
  { id: "aloy", name: "Aloy", source: "Horizon Zero Dawn", sourceType: "game", region: "us", vibeTags: ["red braids", "freckled", "fierce", "tribal warrior", "green eyes"], wikiQuery: "Aloy" },
  { id: "geralt", name: "Geralt of Rivia", source: "The Witcher", sourceType: "game", region: "europe", vibeTags: ["white hair", "scars", "gruff", "yellow eyes", "stoic"], wikiQuery: "Geralt of Rivia" },
  { id: "cloud", name: "Cloud Strife", source: "Final Fantasy VII", sourceType: "game", region: "japan", vibeTags: ["blond spiky hair", "blue eyes", "brooding", "huge sword", "quiet"], wikiQuery: "Cloud Strife" },
  { id: "tifa", name: "Tifa Lockhart", source: "Final Fantasy VII", sourceType: "game", region: "japan", vibeTags: ["long black hair", "fighter", "warm", "white tank", "athletic"], wikiQuery: "Tifa Lockhart" },
  { id: "master-chief", name: "Master Chief", source: "Halo", sourceType: "game", region: "us", vibeTags: ["green armor", "tall", "stoic", "soldier", "helmet"], wikiQuery: "Master Chief (Halo)" },

  // ─── BOOKS / LITERATURE ─────────────────────────────────────────────────
  { id: "sherlock", name: "Sherlock Holmes", source: "Sherlock Holmes", sourceType: "book", region: "uk", vibeTags: ["sharp", "deerstalker", "lanky", "deductive", "intense"], wikiQuery: "Sherlock Holmes" },
  { id: "bilbo", name: "Bilbo Baggins", source: "The Hobbit", sourceType: "book", region: "uk", vibeTags: ["short", "curly hair", "cozy", "hobbit feet", "warm-eyed"], wikiQuery: "Bilbo Baggins" },
  { id: "frodo", name: "Frodo Baggins", source: "The Lord of the Rings", sourceType: "book", region: "uk", vibeTags: ["small", "blue eyes", "earnest", "soft", "burdened"], wikiQuery: "Frodo Baggins" },
  { id: "aragorn", name: "Aragorn", source: "The Lord of the Rings", sourceType: "book", region: "uk", vibeTags: ["ranger", "long dark hair", "stubble", "noble", "weathered"], wikiQuery: "Aragorn" },
  { id: "gandalf", name: "Gandalf", source: "The Lord of the Rings", sourceType: "book", region: "uk", vibeTags: ["long white beard", "wise", "tall", "wizard hat", "twinkly eyes"], wikiQuery: "Gandalf" },
  { id: "tyrion", name: "Tyrion Lannister", source: "Game of Thrones", sourceType: "book", region: "us", vibeTags: ["short", "blond", "witty", "scarred", "clever"], wikiQuery: "Tyrion Lannister" },
  { id: "matilda", name: "Matilda", source: "Matilda", sourceType: "book", region: "uk", vibeTags: ["bookish", "bow in hair", "small", "brilliant", "quiet"], wikiQuery: "Matilda (novel)" },
  { id: "atticus", name: "Atticus Finch", source: "To Kill a Mockingbird", sourceType: "book", region: "us", vibeTags: ["round glasses", "quiet dignity", "lawyer", "kind", "soft-spoken"], wikiQuery: "Atticus Finch" },
  { id: "holden", name: "Holden Caulfield", source: "The Catcher in the Rye", sourceType: "book", region: "us", vibeTags: ["red hunting hat", "moody teen", "tall", "wandering", "wistful"], wikiQuery: "Holden Caulfield" },
  { id: "hercule", name: "Hercule Poirot", source: "Hercule Poirot novels", sourceType: "book", region: "europe", vibeTags: ["waxed moustache", "neat", "round", "fastidious", "tiny detective"], wikiQuery: "Hercule Poirot" },

  // ─── KOREAN / GLOBAL POP ────────────────────────────────────────────────
  { id: "squid-player", name: "Gi-hun", source: "Squid Game", sourceType: "tv", region: "korea", vibeTags: ["green tracksuit", "messy hair", "weathered", "soft-eyed", "everyman"], wikiQuery: "Gi-hun" },
  { id: "kang-sae", name: "Kang Sae-byeok", source: "Squid Game", sourceType: "tv", region: "korea", vibeTags: ["sharp", "short hair", "quiet", "intense", "stoic"], wikiQuery: "Squid Game" },
];

export const CHARACTER_BY_ID: Record<string, Character> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c])
);
