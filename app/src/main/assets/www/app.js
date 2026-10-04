/**
 * D&D 5e Combat Tracker - Mobile-Identical Web Engine
 * Matches Android Mobile UI pixel-for-pixel with full feature parity
 */

// ==========================================
// 5E CONSTANTS & STARTER DATA (Matching Screenshots)
// ==========================================

const OFFICIAL_5E_CLASSES = [
  "Barbarian", "Bard", "Cleric", "Druid", "Fighter",
  "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer",
  "Warlock", "Wizard", "Artificer"
];

const MONSTER_PRESETS = [
  { name: "Bandit", cr: "CR 1/8", type: "Humanoid", maxHp: 11, ac: 12, initMod: 1, speed: 30, perception: 10, spellDc: null, notes: "Scimitar +3 (1d6+1), Light Crossbow" },
  { name: "Cultist", cr: "CR 1/8", type: "Humanoid", maxHp: 9, ac: 12, initMod: 1, speed: 30, perception: 10, spellDc: null, notes: "Dark Devotion (adv vs charm/fright)" },
  { name: "Goblin", cr: "CR 1/4", type: "Humanoid", maxHp: 7, ac: 15, initMod: 2, speed: 30, perception: 9, spellDc: null, notes: "Nimble Escape: Disengage or Hide as bonus action" },
  { name: "Skeleton", cr: "CR 1/4", type: "Undead", maxHp: 13, ac: 13, initMod: 2, speed: 30, perception: 9, spellDc: null, notes: "Vulnerable to bludgeoning, immune to poison" },
  { name: "Zombie", cr: "CR 1/4", type: "Undead", maxHp: 22, ac: 8, initMod: -2, speed: 20, perception: 8, spellDc: null, notes: "Undead Fortitude (Con save to drop to 1 HP)" },
  { name: "Wolf", cr: "CR 1/4", type: "Beast", maxHp: 11, ac: 13, initMod: 2, speed: 40, perception: 13, spellDc: null, notes: "Pack Tactics (adv if ally within 5ft), Keen Hearing/Smell" },
  { name: "Orc", cr: "CR 1/2", type: "Humanoid", maxHp: 15, ac: 13, initMod: 1, speed: 30, perception: 10, spellDc: null, notes: "Aggressive: Bonus action move up to speed toward enemy" },
  { name: "Hobgoblin", cr: "CR 1/2", type: "Humanoid", maxHp: 11, ac: 18, initMod: 1, speed: 30, perception: 10, spellDc: null, notes: "Martial Advantage (+2d6 damage if ally within 5ft)" },
  { name: "Bugbear", cr: "CR 1", type: "Humanoid", maxHp: 27, ac: 16, initMod: 2, speed: 30, perception: 10, spellDc: null, notes: "Surprise Attack (+2d6), Brute (+1 die melee)" },
  { name: "Ghoul", cr: "CR 1", type: "Undead", maxHp: 22, ac: 12, initMod: 2, speed: 30, perception: 10, spellDc: null, notes: "Claws: DC 10 Con save or paralyzed for 1 min" },
  { name: "Bandit Captain", cr: "CR 2", type: "Humanoid", maxHp: 65, ac: 15, initMod: 3, speed: 30, perception: 14, spellDc: null, notes: "Multiattack (3 melee), Parry reaction (+2 AC)" },
  { name: "Cult Fanatic", cr: "CR 2", type: "Humanoid", maxHp: 33, ac: 13, initMod: 2, speed: 30, perception: 11, spellDc: 11, notes: "Spellcaster: Hold Person, Spiritual Weapon" },
  { name: "Ogre", cr: "CR 2", type: "Giant", maxHp: 59, ac: 11, initMod: -1, speed: 40, perception: 8, spellDc: null, notes: "Greatclub +6 (2d8+4)" },
  { name: "Wight", cr: "CR 3", type: "Undead", maxHp: 45, ac: 14, initMod: 2, speed: 30, perception: 13, spellDc: null, notes: "Life Drain (reduces max HP on failed Con save)" },
  { name: "Troll", cr: "CR 5", type: "Giant", maxHp: 84, ac: 15, initMod: 1, speed: 30, perception: 12, spellDc: null, notes: "Regeneration 10 HP per turn unless fire/acid damage" },
  { name: "Vampire Spawn", cr: "CR 5", type: "Undead", maxHp: 82, ac: 15, initMod: 3, speed: 30, perception: 13, spellDc: null, notes: "Regeneration 10 HP, Spider Climb, Bite attack" },
  { name: "Mage", cr: "CR 6", type: "Humanoid", maxHp: 40, ac: 15, initMod: 2, speed: 30, perception: 11, spellDc: 14, notes: "Spells: Fireball, Greater Invisibility, Shield" },
  { name: "Young Red Dragon", cr: "CR 10", type: "Dragon", maxHp: 178, ac: 18, initMod: 0, speed: 40, perception: 18, spellDc: 17, notes: "Fire Breath (16d6 fire, DC 17 Dex), Fly 80ft" },
  { name: "Beholder", cr: "CR 13", type: "Aberration", maxHp: 180, ac: 18, initMod: 2, speed: 20, perception: 22, spellDc: 16, notes: "Antimagic Cone, 3 random Eye Rays per turn" },
  { name: "Mind Flayer", cr: "CR 7", type: "Aberration", maxHp: 71, ac: 15, initMod: 1, speed: 30, perception: 17, spellDc: 15, notes: "Mind Blast (DC 15 Int save stun), Tentacles, Extract Brain" },
  { name: "Brown Bear", cr: "CR 1", type: "Beast", maxHp: 34, ac: 11, initMod: 0, speed: 40, perception: 13, spellDc: null, notes: "Multiattack (Bite + Claws), Keen Smell" },
  { name: "Giant Spider", cr: "CR 1", type: "Beast", maxHp: 26, ac: 14, initMod: 3, speed: 30, perception: 10, spellDc: null, notes: "Spider Climb, Web (restrains target), Poison Bite" },
  { name: "Hill Giant", cr: "CR 5", type: "Giant", maxHp: 105, ac: 13, initMod: -1, speed: 40, perception: 12, spellDc: null, notes: "Greatclub +8 (3d8+5), Rock throw 60ft" },
  { name: "Green Dragon Wyrmling", cr: "CR 2", type: "Dragon", maxHp: 38, ac: 17, initMod: 1, speed: 30, perception: 14, spellDc: 11, notes: "Poison Breath (DC 11 Con save, 6d6 poison), Fly 60ft" },
  { name: "Owlbear", cr: "CR 3", type: "Monstrosity", maxHp: 59, ac: 13, initMod: 1, speed: 40, perception: 13, spellDc: null, notes: "Keen Sight and Smell, Multiattack (Beak + Claws)" },
  { name: "Minotaur", cr: "CR 3", type: "Monstrosity", maxHp: 76, ac: 14, initMod: 0, speed: 40, perception: 17, spellDc: null, notes: "Charge (+2d8 gore), Reckless, Labyrinthine Recall" },
  { name: "Imp", cr: "CR 1", type: "Fiend", maxHp: 10, ac: 13, initMod: 3, speed: 20, perception: 11, spellDc: null, notes: "Invisibility, Sting with poison, Shapechanger, Magic Resistance" },
  { name: "Hell Hound", cr: "CR 3", type: "Fiend", maxHp: 45, ac: 15, initMod: 1, speed: 50, perception: 15, spellDc: 12, notes: "Fire Breath (DC 12 Dex, 6d6 fire), Pack Tactics" },
  { name: "Animated Armor", cr: "CR 1", type: "Construct", maxHp: 33, ac: 18, initMod: 0, speed: 25, perception: 6, spellDc: null, notes: "Antimagic Susceptibility, False Appearance, Blind beyond 60ft" },
  { name: "Lich", cr: "CR 21", type: "Undead", maxHp: 135, ac: 17, initMod: 3, speed: 30, perception: 19, spellDc: 20, notes: "Legendary Actions, Power Word Kill, Disrupt Life" }
];

const CONDITIONS = [
  { id: "bardic_inspiration", name: "Bardic Inspiration", color: "#F59E0B", desc: "Roll an Inspiration Die (1d6-1d12) and add it to one ability check, attack roll, or saving throw." },
  { id: "inspiration", name: "Inspiration", color: "#EC4899", desc: "Heroic Inspiration: Spend to reroll any d20 or gain advantage on an attack roll, save, or check." },
  { id: "blinded", name: "Blinded", color: "#64748B", desc: "Can't see and automatically fails checks requiring sight. Attacks against have advantage, attack rolls have disadvantage." },
  { id: "charmed", name: "Charmed", color: "#EC4899", desc: "Can't attack the charmer. Charmer has advantage on social ability checks." },
  { id: "concentrating", name: "Concentrating", color: "#A855F7", desc: "Must make Con save (DC 10 or half damage taken) when taking damage to maintain spell." },
  { id: "deafened", name: "Deafened", color: "#94A3B8", desc: "Can't hear and automatically fails checks requiring hearing." },
  { id: "exhaustion", name: "Exhaustion", color: "#F97316", desc: "Suffers penalties ranging from disadvantage to speed halving or death." },
  { id: "frightened", name: "Frightened", color: "#8B5CF6", desc: "Disadvantage on ability checks and attack rolls while source of fear is in sight. Can't willingly move closer." },
  { id: "grappled", name: "Grappled", color: "#EAB308", desc: "Speed becomes 0 and can't benefit from any bonuses to speed." },
  { id: "haste", name: "Haste", color: "#06B6D4", desc: "Double speed, +2 AC, advantage on Dex saves, and an additional action each turn." },
  { id: "incapacitated", name: "Incapacitated", color: "#EF4444", desc: "Can't take actions or reactions." },
  { id: "invisible", name: "Invisible", color: "#38BDF8", desc: "Impossible to see without magic or special senses. Attacks against have disadvantage, attack rolls have advantage." },
  { id: "paralyzed", name: "Paralyzed", color: "#DC2626", desc: "Incapacitated, can't move or speak. Auto-fails Str/Dex saves. Attacks against have advantage; melee attacks within 5ft are auto-crits." },
  { id: "petrified", name: "Petrified", color: "#78716C", desc: "Transformed into solid stone. Incapacitated, unaware of surroundings, resistance to all damage." },
  { id: "poisoned", name: "Poisoned", color: "#10B981", desc: "Disadvantage on attack rolls and ability checks." },
  { id: "prone", name: "Prone", color: "#D97706", desc: "Only movement is crawling. Disadvantage on attack rolls. Attacks against within 5ft have advantage; ranged attacks have disadvantage." },
  { id: "restrained", name: "Restrained", color: "#B45309", desc: "Speed becomes 0. Attacks against have advantage, attack rolls have disadvantage. Disadvantage on Dex saves." },
  { id: "stunned", name: "Stunned", color: "#F59E0B", desc: "Incapacitated, can't move, speaks falteringly. Auto-fails Str/Dex saves. Attacks against have advantage." },
  { id: "unconscious", name: "Unconscious", color: "#991B1B", desc: "Incapacitated, can't move/speak, unaware. Drops held items, falls prone. Auto-fails Str/Dex saves. Attacks against have advantage and melee is auto-crit." },
  { id: "dead", name: "Dead", color: "#475569", desc: "Character has died. Skipped in combat turn order until revived." },
  { id: "blessed", name: "Blessed", color: "#FACC15", desc: "Add 1d4 to attack rolls and saving throws." },
  { id: "bane", name: "Bane", color: "#7C3AED", desc: "Subtract 1d4 from attack rolls and saving throws." },
  { id: "difficult_terrain", name: "Difficult Terrain", color: "#D97706", desc: "Moving through difficult terrain costs 1 extra foot per foot moved (halves movement speed)." },
  { id: "half_cover", name: "Half Cover", color: "#3B82F6", desc: "+2 bonus to AC and Dexterity saving throws." },
  { id: "three_quarters_cover", name: "3/4 Cover", color: "#6366F1", desc: "+5 bonus to AC and Dexterity saving throws." },
  { id: "total_cover", name: "Total Cover", color: "#8B5CF6", desc: "Completely concealed by an obstacle. Can't be targeted directly by attacks or spells." }
];

// Exact Starter Party from Screenshots (Theron Stormwind & Vesper Stonefist)
const DEFAULT_PARTY = [
  {
    id: "pc-vesper",
    name: "Vesper Stonefist",
    playerName: "Player 1",
    characterClass: "Fighter",
    level: 1,
    maxHp: 12,
    currentHp: 12,
    tempHp: 0,
    armorClass: 18,
    initiativeModifier: 3,
    passivePerception: 12,
    speed: 30,
    spellDc: null,
    notes: "Heavy armor vanguard shielding the party in combat.",
    abilities: [
      { id: "ab-1", name: "Second Wind", type: "Bonus Action", description: "Bonus Action • Regain 1d10 + level HP once per short rest." },
      { id: "ab-2", name: "Action Surge", type: "Action", description: "Action • Take 1 additional action on your turn. 1/short rest." }
    ]
  },
  {
    id: "pc-theron",
    name: "Theron Stormwind",
    playerName: "Player 2",
    characterClass: "Rogue",
    level: 1,
    maxHp: 10,
    currentHp: 10,
    tempHp: 5,
    armorClass: 14,
    initiativeModifier: 3,
    passivePerception: 14,
    speed: 30,
    spellDc: null,
    notes: "Stealthy skirmisher dealing precision Sneak Attacks and navigating danger.",
    abilities: [
      { id: "ab-3", name: "Sneak Attack", type: "Feat / Trait", description: "Feat / Trait • +1d6 damage when you hit with advantage or ally within 5ft." },
      { id: "ab-4", name: "Cunning Action", type: "Bonus Action", description: "Bonus Action • Take Dash, Disengage, or Hide as a bonus action." }
    ]
  }
];

// Initial Encounter matching Screenshots (Vesper, Theron, Bandit #1, Bandit #2)
function getInitialEncounter() {
  return {
    round: 1,
    currentTurnIndex: 0,
    isCombatStarted: true,
    combatants: [
      {
        id: "c-vesper",
        characterId: "pc-vesper",
        name: "Vesper Stonefist",
        isPlayer: true,
        characterClassOrType: "Fighter (Lvl 1)",
        maxHp: 12,
        currentHp: 12,
        tempHp: 0,
        armorClass: 18,
        baseArmorClass: 18,
        coverType: "NONE",
        initiativeModifier: 3,
        initiativeRoll: 18,
        speed: 30,
        baseSpeed: 30,
        isDifficultTerrain: false,
        spellDc: null,
        notes: "Heavy armor vanguard shielding the party in combat.",
        abilities: [
          { id: "ab-1", name: "Second Wind", type: "Bonus Action", description: "Bonus Action • Regain 1d10 + level HP once per short rest." },
          { id: "ab-2", name: "Action Surge", type: "Action", description: "Action • Take 1 additional action on your turn. 1/short rest." }
        ],
        conditions: [],
        deathSavesSuccess: 0,
        deathSavesFailure: 0,
        isStabilized: false,
        isDead: false
      },
      {
        id: "c-bandit-2",
        name: "Bandit #2",
        isPlayer: false,
        characterClassOrType: "Enemy (CR 1/8)",
        maxHp: 11,
        currentHp: 11,
        tempHp: 0,
        armorClass: 12,
        baseArmorClass: 12,
        coverType: "NONE",
        initiativeModifier: 1,
        initiativeRoll: 16,
        speed: 30,
        baseSpeed: 30,
        isDifficultTerrain: false,
        spellDc: null,
        notes: "Scimitar +3 (1d6+1). Light Crossbow",
        abilities: [],
        conditions: [],
        deathSavesSuccess: 0,
        deathSavesFailure: 0,
        isStabilized: false,
        isDead: false
      },
      {
        id: "c-theron",
        characterId: "pc-theron",
        name: "Theron Stormwind",
        isPlayer: true,
        characterClassOrType: "Rogue (Lvl 1)",
        maxHp: 10,
        currentHp: 10,
        tempHp: 5,
        armorClass: 16,
        baseArmorClass: 14,
        coverType: "HALF",
        initiativeModifier: 3,
        initiativeRoll: 15,
        speed: 15,
        baseSpeed: 30,
        isDifficultTerrain: true,
        spellDc: null,
        notes: "Stealthy skirmisher dealing precision Sneak Attacks and navigating danger.",
        abilities: [
          { id: "ab-3", name: "Sneak Attack", type: "Feat / Trait", description: "Feat / Trait • +1d6 damage when you hit with advantage or ally within 5ft." },
          { id: "ab-4", name: "Cunning Action", type: "Bonus Action", description: "Bonus Action • Take Dash, Disengage, or Hide as a bonus action." }
        ],
        conditions: ["half_cover", "difficult_terrain"],
        deathSavesSuccess: 0,
        deathSavesFailure: 0,
        isStabilized: false,
        isDead: false
      },
      {
        id: "c-bandit-1",
        name: "Bandit #1",
        isPlayer: false,
        characterClassOrType: "Enemy (CR 1/8)",
        maxHp: 11,
        currentHp: 11,
        tempHp: 0,
        armorClass: 12,
        baseArmorClass: 12,
        coverType: "NONE",
        initiativeModifier: 1,
        initiativeRoll: 10,
        speed: 30,
        baseSpeed: 30,
        isDifficultTerrain: false,
        spellDc: null,
        notes: "Scimitar +3 (1d6+1). Light Crossbow",
        abilities: [],
        conditions: [],
        deathSavesSuccess: 0,
        deathSavesFailure: 0,
        isStabilized: false,
        isDead: false
      }
    ],
    log: [
      { id: "log-1", round: 1, time: "10:50 AM", text: "⚔️ Combat Started! Round 1 begins. Vesper Stonefist's turn.", type: "turn" }
    ]
  };
}

// ==========================================
// STORE & PERSISTENCE
// ==========================================

class DndStore {
  constructor() {
    this.currentTab = "combat"; // "combat", "party", "bestiary", "dice"
    this.party = this.load("dnd_party_v2", DEFAULT_PARTY);
    this.encounter = this.load("dnd_encounter_v2", getInitialEncounter());
    this.diceHistory = this.load("dnd_dice_hist_v2", []);
    this.lastRoll = null;

    // Active edit targets for dialogs
    this.activeCombatantId = null;
    this.characterEditTargetId = null;
    this.characterAbilitiesEditing = [];

    // Temporary values for open dialogs
    this.dialogSpeedBase = 30;
    this.dialogSpeedDiff = false;
    this.dialogAcBase = 14;
    this.dialogAcCover = "NONE";

    // Dice Roller State (Multi-dice & Modifiers)
    this.diceSelectedSides = 20;
    this.diceCount = 1;
    this.diceModifier = 0;
    this.diceRollMode = "NORMAL"; // "NORMAL", "ADVANTAGE", "DISADVANTAGE"
    this.diceTray = { 4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0 };
    this.diceSubTab = "roller"; // "roller", "conditions", "rules"
    this.diceInputMode = "standard"; // "standard", "tray"

    // Bestiary Filtering & Multi-select State (Matching Screenshot)
    this.bestiarySearchQuery = "";
    this.bestiarySelectedType = "All";
    this.bestiarySortBy = "type";
    this.bestiaryQuantities = {};
    this.bestiarySelectedMonsters = {};

    // Condition Duration Picker State
    this.activeConditionDuration = "permanent";
    this.activeConditionRounds = 1;

    // Custom Monsters Library (Saved by user to Bestiary)
    this.customMonsters = this.load("dnd_custom_monsters_v2", []);

    // Custom Dice Presets (Saved by user)
    this.customDicePresets = this.load("dnd_custom_presets_v2", [
      { id: "p-d20", name: "1d20 Check", formula: "1d20", isDefault: true },
      { id: "p-d20adv", name: "1d20 (Adv)", formula: "1d20 (Advantage)", isDefault: true },
      { id: "p-greatsword", name: "2d6+3 Greatsword", formula: "2d6 + 3", isDefault: true },
      { id: "p-longsword", name: "1d8+3 Longsword", formula: "1d8 + 3", isDefault: true },
      { id: "p-greataxe", name: "1d12+3 Greataxe", formula: "1d12 + 3", isDefault: true },
      { id: "p-fireball", name: "8d6 Fireball", formula: "8d6", isDefault: true },
      { id: "p-stats", name: "4d6 Drop Lowest", formula: "4d6 drop lowest", isDefault: true },
      { id: "p-cantrip", name: "1d10 Cantrip", formula: "1d10", isDefault: true }
    ]);
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save() {
    try {
      localStorage.setItem("dnd_party_v2", JSON.stringify(this.party));
      localStorage.setItem("dnd_encounter_v2", JSON.stringify(this.encounter));
      localStorage.setItem("dnd_dice_hist_v2", JSON.stringify(this.diceHistory));
      localStorage.setItem("dnd_custom_presets_v2", JSON.stringify(this.customDicePresets));
      localStorage.setItem("dnd_custom_monsters_v2", JSON.stringify(this.customMonsters || []));
    } catch (e) {}
  }

  logEvent(text, type = "info") {
    const entry = {
      id: "log-" + Date.now(),
      round: this.encounter.round,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: text,
      type: type
    };
    this.encounter.log = [entry, ...this.encounter.log].slice(0, 50);
    this.save();
  }
}

const store = new DndStore();

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function showToast(text) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const t = document.createElement("div");
  t.className = "toast-item";
  t.textContent = text;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 250);
  }, 2200);
}

function sortCombatants(list) {
  return [...list].sort((a, b) => {
    if (b.initiativeRoll !== a.initiativeRoll) {
      return b.initiativeRoll - a.initiativeRoll;
    }
    if (b.initiativeModifier !== a.initiativeModifier) {
      return b.initiativeModifier - a.initiativeModifier;
    }
    return a.name.localeCompare(b.name);
  });
}

// ==========================================
// COMBAT & TURN PROGRESSION
// ==========================================

function nextTurn() {
  const total = store.encounter.combatants.length;
  if (total === 0) return;
  const previousActor = store.encounter.combatants[store.encounter.currentTurnIndex];
  let nextIdx = store.encounter.currentTurnIndex;
  let nextRound = store.encounter.round;
  let attempts = 0;
  let isNewRound = false;

  do {
    nextIdx++;
    if (nextIdx >= total) {
      nextIdx = 0;
      nextRound++;
      isNewRound = true;
      store.logEvent(`🛡️ Round ${nextRound} begins!`, "turn");
    }
    attempts++;
  } while (store.encounter.combatants[nextIdx]?.isDead && attempts < total);

  store.encounter.currentTurnIndex = nextIdx;
  store.encounter.round = nextRound;

  const currentActor = store.encounter.combatants[nextIdx];
  if (currentActor && !currentActor.isDead) {
    store.logEvent(`Turn passed to ${currentActor.name}`, "turn");
  }

  // Check Condition Timers
  checkConditionExpirations(previousActor, currentActor, isNewRound);

  store.save();
  renderApp();
}

function prevTurn() {
  const total = store.encounter.combatants.length;
  if (total === 0) return;
  let prevIdx = store.encounter.currentTurnIndex;
  let prevRound = store.encounter.round;
  let attempts = 0;

  do {
    prevIdx--;
    if (prevIdx < 0) {
      if (prevRound > 1) {
        prevRound--;
        prevIdx = total - 1;
      } else {
        prevIdx = 0;
        break;
      }
    }
    attempts++;
  } while (store.encounter.combatants[prevIdx]?.isDead && attempts < total);

  store.encounter.currentTurnIndex = prevIdx;
  store.encounter.round = prevRound;
  store.save();
  renderApp();
}

// ------------------------------------------
// CONDITION TIMERS & HELPERS
// ------------------------------------------

function findMonsterByName(name) {
  return (store.customMonsters || []).find(x => x.name === name) || MONSTER_PRESETS.find(x => x.name === name);
}

function getConditionName(id) {
  const cond = CONDITIONS.find(c => c.id === id);
  return cond ? cond.name : id;
}

function getConditionInfo(cItem) {
  if (!cItem) return null;
  const id = typeof cItem === "string" ? cItem : cItem.id;
  const condDef = CONDITIONS.find(x => x.id === id);
  const def = condDef || {
    id: id,
    name: id.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    color: "#f59e0b",
    desc: "Condition status"
  };

  let timerLabel = "";
  let roundsCount = null;
  const isObj = typeof cItem === "object";
  const duration = isObj ? (cItem.duration || "permanent") : "permanent";
  const isPermanent = duration === "permanent";

  if (isObj) {
    if (duration === "rounds") {
      roundsCount = cItem.roundsRemaining != null ? cItem.roundsRemaining : 1;
      timerLabel = `(${roundsCount} rnd${roundsCount === 1 ? '' : 's'})`;
    } else if (duration === "start_next_turn") {
      roundsCount = 1;
      timerLabel = `(start next turn)`;
    } else if (duration === "end_next_turn") {
      roundsCount = 1;
      timerLabel = `(end next turn)`;
    } else if (duration === "end_current_turn") {
      roundsCount = 1;
      timerLabel = `(end of turn)`;
    }
  }

  return {
    ...def,
    duration,
    roundsRemaining: roundsCount,
    timerLabel: timerLabel,
    isPermanent: isPermanent
  };
}

// ------------------------------------------
// SYNCHRONIZED AC & SPEED RECALCULATION
// ------------------------------------------
function recalculateCombatantStats(c) {
  if (!c) return;
  c.baseSpeed = c.baseSpeed != null ? c.baseSpeed : (c.speed || 30);
  c.baseArmorClass = c.baseArmorClass != null ? c.baseArmorClass : (c.armorClass || 10);
  c.conditions = c.conditions || [];

  // 1. Difficult Terrain synchronization
  const hasDiff = c.conditions.some(cn => (typeof cn === 'string' ? cn : cn.id) === "difficult_terrain");
  c.isDifficultTerrain = hasDiff;
  c.speed = hasDiff ? Math.floor(c.baseSpeed / 2) : c.baseSpeed;

  // 2. Cover synchronization (mutually exclusive)
  const hasTotal = c.conditions.some(cn => (typeof cn === 'string' ? cn : cn.id) === "total_cover");
  const hasThreeFourths = c.conditions.some(cn => (typeof cn === 'string' ? cn : cn.id) === "three_quarters_cover");
  const hasHalf = c.conditions.some(cn => (typeof cn === 'string' ? cn : cn.id) === "half_cover");

  if (hasTotal) {
    c.coverType = "TOTAL";
    c.armorClass = c.baseArmorClass + 10;
  } else if (hasThreeFourths) {
    c.coverType = "THREE_QUARTERS";
    c.armorClass = c.baseArmorClass + 5;
  } else if (hasHalf) {
    c.coverType = "HALF";
    c.armorClass = c.baseArmorClass + 2;
  } else {
    c.coverType = "NONE";
    c.armorClass = c.baseArmorClass;
  }
}

function checkConditionExpirations(prevActor, currActor, isNewRound) {
  if (prevActor && prevActor.conditions) {
    prevActor.conditions = prevActor.conditions.filter(cn => {
      const isObj = typeof cn === 'object';
      const duration = isObj ? cn.duration : 'permanent';
      if (duration === 'end_current_turn') {
        store.logEvent(`⏳ ${getConditionName(cn.id)} ended for ${prevActor.name}.`, "info");
        return false;
      }
      if (duration === 'end_next_turn') {
        if ((cn.turnsPassed || 0) >= 1) {
          store.logEvent(`⏳ ${getConditionName(cn.id)} expired on ${prevActor.name}.`, "info");
          return false;
        }
        cn.turnsPassed = (cn.turnsPassed || 0) + 1;
      }
      return true;
    });
    recalculateCombatantStats(prevActor);
  }

  if (currActor && currActor.conditions) {
    currActor.conditions = currActor.conditions.filter(cn => {
      const isObj = typeof cn === 'object';
      const duration = isObj ? cn.duration : 'permanent';
      if (duration === 'start_next_turn') {
        store.logEvent(`⏳ ${getConditionName(cn.id)} expired on ${currActor.name}.`, "info");
        return false;
      }
      return true;
    });
    recalculateCombatantStats(currActor);
  }

  if (isNewRound) {
    store.encounter.combatants.forEach(c => {
      if (c.conditions) {
        c.conditions = c.conditions.filter(cn => {
          if (typeof cn === 'object' && cn.duration === 'rounds') {
            cn.roundsRemaining = (cn.roundsRemaining || 1) - 1;
            if (cn.roundsRemaining <= 0) {
              store.logEvent(`⏳ ${getConditionName(cn.id)} expired on ${c.name}.`, "info");
              return false;
            }
          }
          return true;
        });
        recalculateCombatantStats(c);
      }
    });
  }
}

// ------------------------------------------
// DEATH SAVING THROWS LOGIC
// ------------------------------------------

function rollDeathSave(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c || c.currentHp > 0 || c.isDead) return;

  const roll = rollD20();
  let logText = "";

  if (roll === 20) {
    c.currentHp = 1;
    c.deathSavesSuccess = 0;
    c.deathSavesFailure = 0;
    c.isStabilized = false;
    c.conditions = (c.conditions || []).filter(cn => (typeof cn === 'string' ? cn : cn.id) !== "unconscious");
    logText = `🌟 NATURAL 20! ${c.name} regains 1 HP and wakes up!`;
    showToast(`🌟 Natural 20! ${c.name} revived with 1 HP!`);
  } else if (roll === 1) {
    c.deathSavesFailure = Math.min(3, (c.deathSavesFailure || 0) + 2);
    logText = `💀 NATURAL 1! ${c.name} suffers 2 Death Save Failures! (${c.deathSavesFailure}/3)`;
    showToast(`💀 Natural 1! 2 Failures on ${c.name}!`);
    if (c.deathSavesFailure >= 3) {
      c.isDead = true;
      logText += ` 💀 ${c.name} has succumbed to their wounds and died.`;
      showToast(`💀 ${c.name} has died.`);
    }
  } else if (roll >= 10) {
    c.deathSavesSuccess = Math.min(3, (c.deathSavesSuccess || 0) + 1);
    logText = `🛡️ Death Save Success (Rolled ${roll}) for ${c.name}. (${c.deathSavesSuccess}/3)`;
    showToast(`Death Save Success (${roll}) for ${c.name}`);
    if (c.deathSavesSuccess >= 3) {
      c.isStabilized = true;
      logText += ` 🛡️ ${c.name} has STABILIZED!`;
      showToast(`🛡️ ${c.name} stabilized!`);
    }
  } else {
    c.deathSavesFailure = Math.min(3, (c.deathSavesFailure || 0) + 1);
    logText = `⚠️ Death Save Failure (Rolled ${roll}) for ${c.name}. (${c.deathSavesFailure}/3)`;
    showToast(`Death Save Failure (${roll}) for ${c.name}`);
    if (c.deathSavesFailure >= 3) {
      c.isDead = true;
      logText += ` 💀 ${c.name} has died.`;
      showToast(`💀 ${c.name} has died.`);
    }
  }

  store.logEvent(logText, roll >= 10 ? "heal" : "damage");
  store.save();
  renderApp();
}

function toggleDeathSaveSuccess(combatantId, num) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  c.deathSavesSuccess = (c.deathSavesSuccess === num) ? num - 1 : num;
  if (c.deathSavesSuccess >= 3) {
    c.isStabilized = true;
    showToast(`${c.name} is stabilized`);
  } else {
    c.isStabilized = false;
  }
  store.save();
  renderApp();
}

function toggleDeathSaveFailure(combatantId, num) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  c.deathSavesFailure = (c.deathSavesFailure === num) ? num - 1 : num;
  if (c.deathSavesFailure >= 3) {
    c.isDead = true;
    showToast(`${c.name} has died`);
  } else {
    c.isDead = false;
  }
  store.save();
  renderApp();
}

function stabilizeCombatant(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  c.isStabilized = !c.isStabilized;
  if (c.isStabilized) {
    c.deathSavesFailure = 0;
    store.logEvent(`🛡️ ${c.name} was stabilized.`, "info");
    showToast(`${c.name} stabilized`);
  } else {
    store.logEvent(`${c.name} is no longer stabilized.`, "info");
  }
  store.save();
  renderApp();
}

function reviveCombatant(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  c.currentHp = 1;
  c.isDead = false;
  c.isStabilized = false;
  c.deathSavesSuccess = 0;
  c.deathSavesFailure = 0;
  c.conditions = (c.conditions || []).filter(cn => (typeof cn === 'string' ? cn : cn.id) !== "unconscious" && (typeof cn === 'string' ? cn : cn.id) !== "dead");
  store.logEvent(`✨ ${c.name} was revived with 1 HP!`, "heal");
  showToast(`${c.name} revived with 1 HP!`);
  store.save();
  renderApp();
}

function resetDeathSaves(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  c.deathSavesSuccess = 0;
  c.deathSavesFailure = 0;
  c.isStabilized = false;
  c.isDead = false;
  store.save();
  renderApp();
}

function startCombat(autoRollMonsters = true) {
  if (store.encounter.combatants.length === 0) {
    showToast("No combatants in arena");
    return;
  }
  // Automatically roll initiative for monsters, keeping player rolls intact
  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (!c.isPlayer && autoRollMonsters) {
      return { ...c, initiativeRoll: rollD20() + c.initiativeModifier };
    }
    return c;
  });
  store.encounter.combatants = sortCombatants(store.encounter.combatants);
  const firstLivingIdx = store.encounter.combatants.findIndex(c => !c.isDead);
  store.encounter.currentTurnIndex = firstLivingIdx >= 0 ? firstLivingIdx : 0;
  store.encounter.round = 1;
  store.encounter.isCombatStarted = true;

  const firstActor = store.encounter.combatants[store.encounter.currentTurnIndex]?.name || "Unknown";
  store.logEvent(`⚔️ Combat Started! Round 1 begins: ${firstActor}'s turn.`, "turn");
  store.save();
  renderApp();
  showToast(`Combat Started! ${firstActor}'s turn.`);
}

function openEndCombatModal() {
  openModal("modal-end-combat-dialog");
}

function confirmEndCombat(mode = "keep") {
  store.encounter.isCombatStarted = false;
  store.encounter.round = 1;
  store.encounter.currentTurnIndex = 0;

  if (mode === "clear_enemies") {
    store.encounter.combatants = store.encounter.combatants.filter(c => c.isPlayer);
    store.logEvent("🏁 Combat ended. Monsters cleared from encounter.", "info");
    showToast("Combat ended • Monsters cleared");
  } else if (mode === "reset_all") {
    store.encounter = getInitialEncounter();
    store.encounter.isCombatStarted = false;
    store.logEvent("🔄 Encounter reset to preparation mode.", "info");
    showToast("Encounter reset");
  } else {
    store.logEvent("🏁 Combat ended • Entered Preparation Mode.", "info");
    showToast("Combat ended • Preparation Mode");
  }

  store.save();
  closeModal("modal-end-combat-dialog");
  renderApp();
}

function endCombat() {
  openEndCombatModal();
}

function removeCombatant(id) {
  const c = store.encounter.combatants.find(x => x.id === id);
  store.encounter.combatants = store.encounter.combatants.filter(x => x.id !== id);
  if (store.encounter.currentTurnIndex >= store.encounter.combatants.length) {
    store.encounter.currentTurnIndex = Math.max(0, store.encounter.combatants.length - 1);
  }
  if (c) store.logEvent(`Removed ${c.name} from combat`, "info");
  store.save();
  renderApp();
}

function rollMonstersInitiative() {
  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (!c.isPlayer) {
      return { ...c, initiativeRoll: rollD20() + c.initiativeModifier };
    }
    return c;
  });
  if (store.encounter.isCombatStarted) {
    const activeId = store.encounter.combatants[store.encounter.currentTurnIndex]?.id;
    store.encounter.combatants = sortCombatants(store.encounter.combatants);
    if (activeId) {
      const idx = store.encounter.combatants.findIndex(c => c.id === activeId);
      if (idx >= 0) store.encounter.currentTurnIndex = idx;
    }
  }
  store.logEvent("Rolled initiative for all monsters", "info");
  store.save();
  renderApp();
  showToast("Rolled monsters initiative");
}

// ==========================================
// HP, DAMAGE & HEALING
// ==========================================

function applyDamage(combatantId, amount) {
  if (amount <= 0) return;
  let targetName = "";
  let finalHp = 0;

  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id !== combatantId) return c;
    targetName = c.name;
    let damageRemaining = amount;
    let currentTemp = c.tempHp || 0;

    if (currentTemp > 0) {
      if (damageRemaining <= currentTemp) {
        currentTemp -= damageRemaining;
        damageRemaining = 0;
      } else {
        damageRemaining -= currentTemp;
        currentTemp = 0;
      }
    }

    const wasAtZero = c.currentHp === 0;
    const afterHp = Math.max(0, c.currentHp - damageRemaining);
    finalHp = afterHp;
    let conditions = [...(c.conditions || [])];

    let savesFail = c.deathSavesFailure || 0;
    let isDead = c.isDead || false;
    let isStab = c.isStabilized || false;

    if (afterHp === 0) {
      isStab = false;
      if (!conditions.some(cn => (typeof cn === 'string' ? cn : cn.id) === "unconscious")) {
        conditions.push("unconscious");
      }
      if (wasAtZero && damageRemaining > 0) {
        savesFail = Math.min(3, savesFail + 1);
        if (savesFail >= 3) {
          isDead = true;
          conditions.push("dead");
        }
      }
    }

    return {
      ...c,
      currentHp: afterHp,
      tempHp: currentTemp,
      deathSavesFailure: savesFail,
      isStabilized: isStab,
      isDead: isDead,
      conditions: conditions
    };
  });

  store.logEvent(`${targetName} took ${amount} damage! (HP: ${finalHp})`, "damage");
  store.save();
  renderApp();
}

function applyHealing(combatantId, amount) {
  if (amount <= 0) return;
  let targetName = "";
  let finalHp = 0;

  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id !== combatantId) return c;
    targetName = c.name;
    const healed = Math.min(c.maxHp, c.currentHp + amount);
    finalHp = healed;
    let conditions = [...(c.conditions || [])];

    if (c.currentHp === 0 && healed > 0) {
      conditions = conditions.filter(cn => {
        const id = typeof cn === 'string' ? cn : cn.id;
        return id !== "unconscious" && id !== "dead";
      });
    }

    return {
      ...c,
      currentHp: healed,
      deathSavesSuccess: (c.currentHp === 0 && healed > 0) ? 0 : (c.deathSavesSuccess || 0),
      deathSavesFailure: (c.currentHp === 0 && healed > 0) ? 0 : (c.deathSavesFailure || 0),
      isStabilized: false,
      isDead: false,
      conditions: conditions
    };
  });

  store.logEvent(`✨ ${targetName} healed ${amount} HP! (HP: ${finalHp})`, "heal");
  store.save();
  renderApp();
}

// ==========================================
// RENDERING VIEWS
// ==========================================

function renderApp() {
  const container = document.getElementById("main-container");
  if (!container) return;

  switch (store.currentTab) {
    case "combat":
      container.innerHTML = renderCombatScreen();
      break;
    case "party":
      container.innerHTML = renderPartyScreen();
      break;
    case "bestiary":
      container.innerHTML = renderBestiaryScreen();
      break;
    case "dice":
      container.innerHTML = renderDiceScreen();
      break;
  }

  // Update Desktop Tab active state
  document.querySelectorAll(".desktop-tab-btn").forEach(item => {
    item.classList.toggle("active", item.dataset.tab === store.currentTab);
  });

  // Update Bottom Nav active state
  document.querySelectorAll(".nav-tab-item").forEach(item => {
    item.classList.toggle("active", item.dataset.tab === store.currentTab);
  });
}

// Global Tab Setter
function setAppTab(tab) {
  store.currentTab = tab;
  renderApp();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ------------------------------------------
// COMBAT SCREEN (Screenshots 1 & 6)
// ------------------------------------------
function renderCombatScreen() {
  const enc = store.encounter;
  enc.combatants.forEach(c => recalculateCombatantStats(c));
  const combatants = enc.combatants;
  const active = combatants[enc.currentTurnIndex] || null;
  const onDeck = combatants.length > 1 ? combatants[(enc.currentTurnIndex + 1) % combatants.length] : null;

  const playerCount = combatants.filter(c => c.isPlayer).length;
  const enemyCount = combatants.filter(c => !c.isPlayer).length;

  return `
    <div class="desktop-combat-grid">
      <!-- LEFT COLUMN ON PC (Sticky Dashboard) -->
      <div class="desktop-combat-left">
        <!-- Top Header Card (Screenshot: Round 1, 2 PCs • 2 Foes, Dice, Clock, Add) -->
        <div class="arena-header-card">
          <div class="arena-header-top-row">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="round-indicator-pill ${enc.isCombatStarted ? "active" : "prep"}">
                <span>⚔️</span>
                <span>${enc.isCombatStarted ? `Round ${enc.round}` : "Preparation"}</span>
              </div>
              <span class="arena-counts-text">${playerCount} PCs • ${enemyCount} Foes</span>
            </div>

            <div class="arena-top-actions">
              <button class="icon-btn-header gold" onclick="store.currentTab = 'dice'; renderApp();" title="Dice Roller">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
              </button>
              <button class="icon-btn-header" onclick="openLogModal()" title="Combat Log">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
              </button>
              <button class="icon-btn-header crimson" onclick="openAddEnemyModal()" title="Add Enemy">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              </button>
            </div>
          </div>

          ${enc.isCombatStarted ? `
            <!-- Turn Controls Row (Prev, Next Turn, Stop) -->
            <div class="turn-controls-row">
              <button class="btn-prev-turn" onclick="prevTurn()">
                <span>|◀</span>
                <span>Prev</span>
              </button>
              <button class="btn-next-turn" onclick="nextTurn()">
                <span>Next Turn</span>
                <span>▶|</span>
              </button>
              <button class="btn-stop-combat" onclick="openEndCombatModal()" title="End Combat">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
              </button>
            </div>
          ` : `
            <!-- Preparation Mode Controls -->
            <div class="prep-controls-col">
              ${playerCount > 0 ? `
                <button class="btn-prep-action outline-gold" onclick="openPartyInitiativesModal()">
                  <span>🎲</span>
                  <span>Input Player Initiatives</span>
                </button>
              ` : ""}
              <button class="btn-prep-action solid-gold" onclick="startCombat(true)" ${combatants.length === 0 ? "disabled" : ""}>
                <span>⚔️</span>
                <span>${enemyCount > 0 ? "Start Combat (Auto-Rolls Monsters)" : "Start Combat"}</span>
              </button>
            </div>
          `}
        </div>

        <!-- CURRENT TURN SPOTLIGHT CARD OR PREPARATION BANNER -->
        ${(enc.isCombatStarted && active) ? `
          <div class="current-turn-card">
            <!-- Top row: CURRENT TURN, Player/Monster, On Deck -->
            <div class="current-turn-top-row">
              <div class="current-turn-badges">
                <span class="badge-current-turn">CURRENT TURN</span>
                <span class="badge-player-indicator ${active.isPlayer ? "" : "monster"}">
                  ${active.isPlayer ? "🛡️ Player" : "👹 Monster"}
                </span>
              </div>
              ${onDeck ? `<span class="on-deck-text">On Deck: ${onDeck.name}</span>` : ""}
            </div>

            <!-- Name & Squircles for AC, INIT, SPD -->
            <div class="turn-name-and-stats">
              <div class="turn-name-group">
                <span class="turn-name-title">${active.name}</span>
                <span class="turn-name-class">${active.characterClassOrType}</span>
              </div>

              <div class="turn-stats-squircles">
                <div class="stat-squircle" onclick="openAcModal('${active.id}')" title="Edit AC">
                  <span class="stat-squircle-label">AC</span>
                  <span class="stat-squircle-val">${active.armorClass}</span>
                </div>
                <div class="stat-squircle" onclick="openInitModal('${active.id}')" title="Edit Initiative">
                  <span class="stat-squircle-label">INIT</span>
                  <span class="stat-squircle-val">${active.initiativeRoll}</span>
                </div>
                <div class="stat-squircle" onclick="openSpeedModal('${active.id}')" title="Edit Speed">
                  <span class="stat-squircle-label">SPD</span>
                  <span class="stat-squircle-val">${active.speed}ft</span>
                </div>
              </div>
            </div>

            <!-- HP Row & Quick Chips (-5, -1, +1, +5) -->
            <div class="turn-hp-row">
              <div class="hp-main-label" onclick="openDamageHealModal('${active.id}')">
                <span>HP:</span>
                <span class="hp-current-num ${active.currentHp <= 0 ? "red" : active.currentHp <= 3 ? "red" : active.currentHp <= 6 ? "low" : ""}">${active.currentHp}</span>
                <span>/ ${active.maxHp}</span>
                ${active.tempHp > 0 ? `
                  <span class="temp-hp-pill-tag">🛡️ +${active.tempHp} Temp HP</span>
                ` : ""}
              </div>

              <div class="quick-hp-chips-group">
                <button class="chip-quick-hp dmg" onclick="applyDamage('${active.id}', 5)">-5</button>
                <button class="chip-quick-hp dmg" onclick="applyDamage('${active.id}', 1)">-1</button>
                <button class="chip-quick-hp heal" onclick="applyHealing('${active.id}', 1)">+1</button>
                <button class="chip-quick-hp heal" onclick="applyHealing('${active.id}', 5)">+5</button>
              </div>
            </div>

            <!-- HP Bar with Temp HP overlay -->
            <div class="unified-hp-bar" onclick="openDamageHealModal('${active.id}')">
              <div class="unified-hp-fill ${active.currentHp <= 0 ? "red" : active.currentHp <= 3 ? "red" : active.currentHp <= 6 ? "amber" : ""}" style="width: ${Math.min(100, Math.max(0, (active.currentHp / (active.maxHp || 1)) * 100))}%;"></div>
              ${active.tempHp > 0 ? `
                <div class="unified-hp-temp" style="width: ${Math.min(100, (active.tempHp / (active.maxHp || 1)) * 100)}%;"></div>
              ` : ""}
            </div>

            <!-- 3 Big Action Buttons (💥 Damage, 💚 Heal, ✨ Condition) -->
            <div class="turn-action-buttons-row">
              <button class="btn-turn-action damage" onclick="openDamageHealModal('${active.id}')">
                <span>💥 Damage</span>
              </button>
              <button class="btn-turn-action heal" onclick="openDamageHealModal('${active.id}')">
                <span>💚 Heal</span>
              </button>
              <button class="btn-turn-action condition" onclick="openConditionsModal('${active.id}')">
                <span>✨ Condition</span>
              </button>
            </div>

            <!-- ACTIVE CONDITIONS IN CURRENT TURN BOX (With rounds remaining badge for non-permanent) -->
            <div class="turn-conditions-section">
              <div class="turn-conditions-header">
                <div class="turn-conditions-title">
                  <span>✨</span>
                  <span>Active Conditions</span>
                </div>
              </div>

              <div class="turn-conditions-chips-row">
                ${active.coverType && active.coverType !== "NONE" ? `
                  <span class="pill-turn-condition" style="border-color:#38bdf8; color:#38bdf8;" onclick="openAcModal('${active.id}')" title="5e Cover Bonus">
                    <span>🛡️ ${active.coverType === "HALF" ? "Half Cover (+2 AC)" : active.coverType === "THREE_QUARTERS" ? "3/4 Cover (+5 AC)" : "Total Cover"}</span>
                  </span>
                ` : ""}

                ${active.isDifficultTerrain ? `
                  <span class="pill-turn-condition" style="border-color:#d97706; color:#fdba74;" onclick="openSpeedModal('${active.id}')" title="Difficult Terrain (Speed Halved)">
                    <span>🪵 Difficult Terrain (½ Spd)</span>
                  </span>
                ` : ""}

                ${(active.conditions || []).filter(cn => {
                  const cid = typeof cn === 'string' ? cn : cn.id;
                  return cid !== "half_cover" && cid !== "three_quarters_cover" && cid !== "total_cover" && cid !== "difficult_terrain";
                }).map(cn => {
                  const info = getConditionInfo(cn);
                  if (!info) return "";
                  const roundsLeft = (!info.isPermanent && info.roundsRemaining !== null) ? info.roundsRemaining : null;
                  return `
                    <span class="pill-turn-condition" style="border-color:${info.color}; color:${info.color};" onclick="openConditionsModal('${active.id}')" title="${info.desc}">
                      <span>${info.name}</span>
                      ${roundsLeft !== null ? `<span class="cond-rounds-left-badge" title="${roundsLeft} round(s) remaining">${roundsLeft}</span>` : ""}
                    </span>
                  `;
                }).join("")}

                ${(!active.conditions || active.conditions.length === 0) && (!active.coverType || active.coverType === "NONE") && !active.isDifficultTerrain ? `
                  <span style="font-size:11.5px; color:var(--text-subtle); font-style:italic;">No active conditions.</span>
                ` : ""}
              </div>
            </div>

            <!-- DEATH SAVING THROWS SECTION (Appears when HP <= 0 or in dying/stabilized state) -->
            ${(active.currentHp <= 0 || active.isDead || active.isStabilized || active.deathSavesSuccess > 0 || active.deathSavesFailure > 0) ? `
              <div class="death-saves-container">
                <div class="death-saves-header">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:16px;">💀</span>
                    <span style="font-size:13px; font-weight:800; color:#f87171; letter-spacing:0.5px;">DEATH SAVING THROWS</span>
                  </div>
                  <span class="death-saves-status-badge ${active.isDead ? 'dead' : active.isStabilized ? 'stabilized' : 'dying'}">
                    ${active.isDead ? 'DEAD' : active.isStabilized ? 'STABILIZED' : 'DYING'}
                  </span>
                </div>

                <div class="death-saves-rows">
                  <div class="death-save-row">
                    <span class="death-save-row-label" style="color:#34d399;">SUCCESSES</span>
                    <div class="death-save-bubbles">
                      <button class="death-bubble-btn ${active.deathSavesSuccess >= 1 ? 'checked-success' : ''}" onclick="toggleDeathSaveSuccess('${active.id}', 1)" title="Success 1">✓</button>
                      <button class="death-bubble-btn ${active.deathSavesSuccess >= 2 ? 'checked-success' : ''}" onclick="toggleDeathSaveSuccess('${active.id}', 2)" title="Success 2">✓</button>
                      <button class="death-bubble-btn ${active.deathSavesSuccess >= 3 ? 'checked-success' : ''}" onclick="toggleDeathSaveSuccess('${active.id}', 3)" title="Success 3">✓</button>
                    </div>
                  </div>

                  <div class="death-save-row">
                    <span class="death-save-row-label" style="color:#f87171;">FAILURES</span>
                    <div class="death-save-bubbles">
                      <button class="death-bubble-btn ${active.deathSavesFailure >= 1 ? 'checked-failure' : ''}" onclick="toggleDeathSaveFailure('${active.id}', 1)" title="Failure 1">✕</button>
                      <button class="death-bubble-btn ${active.deathSavesFailure >= 2 ? 'checked-failure' : ''}" onclick="toggleDeathSaveFailure('${active.id}', 2)" title="Failure 2">✕</button>
                      <button class="death-bubble-btn ${active.deathSavesFailure >= 3 ? 'checked-failure' : ''}" onclick="toggleDeathSaveFailure('${active.id}', 3)" title="Failure 3">✕</button>
                    </div>
                  </div>
                </div>

                <div class="death-save-actions-row">
                  <button class="btn-death-action roll" onclick="rollDeathSave('${active.id}')" ${active.isDead || active.isStabilized ? 'disabled' : ''}>
                    🎲 Roll Save
                  </button>
                  <button class="btn-death-action stabilize" onclick="stabilizeCombatant('${active.id}')">
                    ${active.isStabilized ? 'Unstabilize' : '💚 Stabilize'}
                  </button>
                  <button class="btn-death-action revive" onclick="reviveCombatant('${active.id}')">
                    ✨ Revive (1 HP)
                  </button>
                  <button class="btn-death-action" onclick="resetDeathSaves('${active.id}')">
                    🔄 Reset
                  </button>
                </div>
              </div>
            ` : ""}

            <!-- ABILITIES & ACTIONS SECTION -->
            <div class="abilities-section-card">
              <div class="abilities-section-header">
                <span>⚡</span>
                <span>ABILITIES & ACTIONS</span>
              </div>

              <!-- Dynamic character ability rows -->
              ${(active.abilities && active.abilities.length > 0) ? active.abilities.map(ab => `
                <div class="ability-item-row">
                  <div class="ability-title-line">
                    <span class="ability-type-badge ${ab.type.toLowerCase().includes('bonus') ? 'bonus' : ab.type.toLowerCase().includes('feat') ? 'feat' : ab.type.toLowerCase().includes('reaction') ? 'reaction' : 'action'}">
                      ${ab.type.toUpperCase()}
                    </span>
                    <span class="ability-name-bold">⚡ ${ab.name}</span>
                  </div>
                  <span class="ability-desc-text">${ab.description}</span>
                </div>
              `).join("") : (active.notes ? `
                <div class="ability-item-row">
                  <span class="ability-desc-text">📜 ${active.notes}</span>
                </div>
              ` : `
                <div class="ability-item-row">
                  <span class="ability-desc-text" style="color: var(--text-subtle);">No custom abilities specified for this character.</span>
                </div>
              `)}

              <!-- 4 Equal Action Economy Boxes -->
              <div class="action-economy-grid">
                <div class="action-economy-box">
                  <div class="action-economy-title" style="color: var(--color-gold);">
                    <span>⚔️</span> Action
                  </div>
                  <span class="action-economy-desc">Attack, Cast, Dash, Disengage, Dodge, Help, Hide</span>
                </div>
                <div class="action-economy-box">
                  <div class="action-economy-title" style="color: #34d399;">
                    <span>⚡</span> Bonus
                  </div>
                  <span class="action-economy-desc">Bonus Spells, Offhand, Class feats</span>
                </div>
                <div class="action-economy-box">
                  <div class="action-economy-title" style="color: #60a5fa;">
                    <span>🛡️</span> Reaction
                  </div>
                  <span class="action-economy-desc">Opportunity Attack, Shield, Counter</span>
                </div>
                <div class="action-economy-box">
                  <div class="action-economy-title" style="color: #f1f5f9;">
                    <span>👟</span> Move
                  </div>
                  <span class="action-economy-desc">${active ? active.speed : 30}ft Speed (Walk, climb, swim)</span>
                </div>
              </div>
            </div>
          </div>
        ` : `
          <div class="prep-status-banner">
            <span style="font-size: 20px;">🛡️</span>
            <div>
              <strong style="color: var(--color-gold-light); display: block; margin-bottom: 2px;">Encounter in Preparation</strong>
              <span>Adjust combatant stats, initiatives, or HP below. Press <strong>Start Combat</strong> above when ready to begin Round 1.</span>
            </div>
          </div>
        `}
      </div>

      <!-- RIGHT COLUMN ON PC (Initiative Order & Combatants) -->
      <div class="desktop-combat-right">
        ${combatants.length === 0 ? `
          <div class="dialog-inner-card" style="margin: 0 0 14px 0; text-align: center; padding: 24px 16px; align-items: center;">
            <span style="font-size: 32px;">⚔️</span>
            <span style="font-size: 16px; font-weight: 800; color: var(--color-gold); margin-top: 6px;">No Combatants in Arena</span>
            <p style="font-size: 12px; color: var(--text-muted); max-width: 320px; margin: 6px 0 16px 0;">Add your party members or spawn monsters from the SRD bestiary to assemble the encounter.</p>
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 280px;">
              <button class="btn-prep-action solid-gold" onclick="addAllPartyToEncounter()">Add Entire Party</button>
              <button class="btn-prep-action outline-gold" onclick="store.currentTab = 'bestiary'; renderApp();">Browse Bestiary</button>
              <button class="btn-prev-turn" style="height: 42px; width: 100%; border-radius: 12px;" onclick="openAddEnemyModal()">+ Add Custom Monster</button>
            </div>
          </div>
        ` : ""}

        <!-- INITIATIVE ORDER SECTION -->
        <div class="initiative-section-header">
          <span class="initiative-title">INITIATIVE ORDER (${combatants.length})</span>
          <div class="initiative-header-actions">
            <button class="btn-header-link gold" onclick="openPartyInitiativesModal()">
              <span>🎲 Party Inits</span>
            </button>
            <button class="btn-header-link crimson" onclick="rollMonstersInitiative()">
              <span>🔄 Roll Monsters</span>
            </button>
          </div>
        </div>

        <!-- Combatant List Cards -->
        <div class="combatants-list-container">
          ${combatants.map((c, index) => {
            const isActiveCard = enc.isCombatStarted && index === enc.currentTurnIndex;
            const isOnDeckCard = enc.isCombatStarted && combatants.length > 1 && index === ((enc.currentTurnIndex + 1) % combatants.length);
            const hpPercent = Math.min(100, Math.max(0, (c.currentHp / (c.maxHp || 1)) * 100));

            return `
              <div class="combatant-list-card ${isActiveCard ? "active-turn" : ""} ${c.isDead ? "is-dead" : ""}" id="c-card-${c.id}">
                <!-- Top Row: Circular Init, Name, Sub, AC Shield, Boot Speed, Remove X -->
                <div class="combatant-card-top-row">
                  <div class="circular-init-badge" onclick="openInitModal('${c.id}')" title="Edit Initiative">
                    <span class="circular-init-num">${c.initiativeRoll}</span>
                    <span class="circular-init-label">INIT</span>
                  </div>

                  <div class="combatant-info-group">
                    <div class="combatant-name-and-badges">
                      <span class="combatant-list-name">${c.name}</span>
                      ${isOnDeckCard ? `<span class="badge-on-deck">ON DECK</span>` : ""}
                    </div>
                    <span class="combatant-list-sub">${c.characterClassOrType}</span>
                  </div>

                  <div class="combatant-right-pills">
                    <div class="pill-shield-ac" onclick="openAcModal('${c.id}')" title="Edit AC">
                      <span>🛡️</span>
                      <span>${c.armorClass}</span>
                    </div>
                    <div class="pill-boot-speed" onclick="openSpeedModal('${c.id}')" title="Edit Speed">
                      <span>🥾</span>
                      <span>${c.speed}ft</span>
                    </div>
                    <button class="btn-card-close" onclick="removeCombatant('${c.id}')" title="Remove">✕</button>
                  </div>
                </div>

                <!-- HP Row & Quick Chips (-5, -1, +1, +5) -->
                <div class="turn-hp-row" style="margin-bottom: 4px;">
                  <div class="hp-main-label" onclick="openDamageHealModal('${c.id}')">
                    <span>HP:</span>
                    <span class="hp-current-num ${c.currentHp <= 0 ? "red" : c.currentHp <= 3 ? "red" : c.currentHp <= 6 ? "low" : ""}">${c.currentHp}</span>
                    <span>/ ${c.maxHp}</span>
                    ${c.tempHp > 0 ? `<span class="temp-hp-pill-tag">🛡️ +${c.tempHp} Temp</span>` : ""}
                  </div>

                  <div class="quick-hp-chips-group">
                    <button class="chip-quick-hp dmg" onclick="applyDamage('${c.id}', 5)">-5</button>
                    <button class="chip-quick-hp dmg" onclick="applyDamage('${c.id}', 1)">-1</button>
                    <button class="chip-quick-hp heal" onclick="applyHealing('${c.id}', 1)">+1</button>
                    <button class="chip-quick-hp heal" onclick="applyHealing('${c.id}', 5)">+5</button>
                  </div>
                </div>

                <!-- HP Bar -->
                <div class="unified-hp-bar" style="margin-bottom: 6px;" onclick="openDamageHealModal('${c.id}')">
                  <div class="unified-hp-fill ${c.currentHp <= 0 ? "red" : c.currentHp <= 3 ? "red" : c.currentHp <= 6 ? "amber" : ""}" style="width: ${hpPercent}%;"></div>
                  ${c.tempHp > 0 ? `
                    <div class="unified-hp-temp" style="width: ${Math.min(100, (c.tempHp / (c.maxHp || 1)) * 100)}%;"></div>
                  ` : ""}
                </div>

                <!-- Death Saves Mini Row (If HP <= 0) -->
                ${(c.currentHp <= 0 || c.isDead || c.isStabilized || c.deathSavesSuccess > 0 || c.deathSavesFailure > 0) ? `
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; padding:6px 10px; background:rgba(220,38,38,0.12); border-radius:8px; border:1px solid rgba(239,68,68,0.35);">
                    <span class="death-saves-status-badge ${c.isDead ? 'dead' : c.isStabilized ? 'stabilized' : 'dying'}">
                      ${c.isDead ? '💀 DEAD' : c.isStabilized ? '💚 STABILIZED' : `💀 DYING (${c.deathSavesSuccess || 0}S / ${c.deathSavesFailure || 0}F)`}
                    </span>
                    <div style="display:flex; gap:4px;">
                      ${(!c.isDead && !c.isStabilized) ? `
                        <button class="btn-death-action roll" style="height:26px; font-size:10.5px; padding:0 8px;" onclick="rollDeathSave('${c.id}')">🎲 Roll Save</button>
                      ` : ""}
                      <button class="btn-death-action revive" style="height:26px; font-size:10.5px; padding:0 8px;" onclick="reviveCombatant('${c.id}')">✨ Revive</button>
                    </div>
                  </div>
                ` : ""}

                <!-- Condition Badges & Chips -->
                <div class="combatant-chips-row">
                  ${c.coverType && c.coverType !== "NONE" ? `
                    <span class="pill-cover-badge" onclick="openAcModal('${c.id}')">
                      ${c.coverType === "HALF" ? "Half Cover" : c.coverType === "THREE_QUARTERS" ? "3/4 Cover" : "Total Cover"}
                    </span>
                  ` : ""}
                  ${c.isDifficultTerrain ? `
                    <span class="pill-terrain-badge" onclick="openSpeedModal('${c.id}')">
                      Difficult Terrain
                    </span>
                  ` : ""}
                  ${(c.conditions || []).filter(cn => {
                    const cid = typeof cn === 'string' ? cn : cn.id;
                    return cid !== "half_cover" && cid !== "three_quarters_cover" && cid !== "total_cover" && cid !== "difficult_terrain";
                  }).map(cn => {
                    const info = getConditionInfo(cn);
                    if (!info) return "";
                    const roundsLeft = (!info.isPermanent && info.roundsRemaining !== null) ? info.roundsRemaining : null;
                    const tag = roundsLeft !== null ? ` <span class="cond-rounds-left-badge" title="${roundsLeft} round(s) remaining">${roundsLeft}</span>` : "";
                    return `<span class="pill-cover-badge" style="border-color:${info.color};" onclick="openConditionsModal('${c.id}')">${info.name}${tag}</span>`;
                  }).join("")}
                  <button class="btn-add-condition-chip" onclick="openConditionsModal('${c.id}')">+ Condition</button>
                </div>

                <!-- Scroll Note Snippet (if available) -->
                ${c.notes ? `
                  <div class="scroll-note-snippet">
                    <span>📜</span>
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.notes}</span>
                  </div>
                ` : ""}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------
// PARTY ROSTER SCREEN (Screenshot 4 & 5)
// ------------------------------------------
function renderPartyScreen() {
  const party = store.party;

  return `
    <div style="padding: 14px 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <h2 style="font-size: 19px; font-weight: 800; color: var(--color-gold);">PARTY ROSTER</h2>
          <span style="font-size: 12px; color: var(--text-muted);">Persistent heroes saved for repeated encounters (${party.length})</span>
        </div>
        <button class="btn-dialog-save" style="padding: 8px 16px; font-size: 13px;" onclick="addAllPartyToEncounter()">
          Send All ➔
        </button>
      </div>

      <div class="party-grid">
        ${party.map(p => `
          <div class="combatant-list-card" style="margin: 0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <span style="font-size: 17px; font-weight: 800; color: #fff;">${p.name}</span>
                <div style="font-size: 12px; color: var(--color-gold);">${p.characterClass} (Lvl ${p.level}) ${p.playerName ? `&bull; ${p.playerName}` : ""}</div>
              </div>
              <div style="display: flex; gap: 4px;">
                <button class="icon-btn-header" onclick="openCharacterModal('${p.id}')" title="Edit">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button class="icon-btn-header crimson" onclick="deletePartyMember('${p.id}')" title="Delete">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
            </div>

            <!-- Stats Bar -->
            <div style="display: flex; gap: 6px; margin: 8px 0; flex-wrap: wrap;">
              <span class="stat-squircle" style="width: auto; height: 32px; padding: 0 10px; flex-direction: row; gap: 4px;">
                <span class="stat-squircle-label">HP</span>
                <strong style="color:#fff; font-size:13px;">${p.maxHp}</strong>
              </span>
              <span class="stat-squircle" style="width: auto; height: 32px; padding: 0 10px; flex-direction: row; gap: 4px;">
                <span class="stat-squircle-label">AC</span>
                <strong style="color:#fff; font-size:13px;">${p.armorClass}</strong>
              </span>
              <span class="stat-squircle" style="width: auto; height: 32px; padding: 0 10px; flex-direction: row; gap: 4px;">
                <span class="stat-squircle-label">INIT</span>
                <strong style="color:#fff; font-size:13px;">+${p.initiativeModifier}</strong>
              </span>
              <span class="stat-squircle" style="width: auto; height: 32px; padding: 0 10px; flex-direction: row; gap: 4px;">
                <span class="stat-squircle-label">SPD</span>
                <strong style="color:#fff; font-size:13px;">${p.speed}ft</strong>
              </span>
            </div>

            ${p.notes ? `
              <div class="scroll-note-snippet" style="margin-bottom: 8px;">
                <span>📜</span> <span>${p.notes}</span>
              </div>
            ` : ""}

            <button class="btn-prev-turn" style="height: 38px; width: 100%; border-radius: 8px;" onclick="addSinglePlayerToArena('${p.id}')">
              + Add to Active Combat
            </button>
          </div>
        `).join("")}
      </div>

      <button class="btn-next-turn" style="width: 100%; max-width: 400px; margin: 20px auto 0 auto; display: flex;" onclick="openCharacterModal(null)">
        + Add New Player Character
      </button>
    </div>
  `;
}

// ------------------------------------------
// BESTIARY SCREEN (SRD & Custom, Multi-Select, Sorting & Squircles)
// ------------------------------------------
function renderBestiaryScreen() {
  const query = (store.bestiarySearchQuery || "").toLowerCase().trim();
  const selectedType = store.bestiarySelectedType || "All";
  const sortBy = store.bestiarySortBy || "name";

  const types = ["All", "Custom", "Humanoid", "Undead", "Beast", "Giant", "Dragon", "Aberration", "Monstrosity", "Fiend", "Construct", "Celestial", "Elemental", "Fey", "Ooze", "Plant"];

  const customList = (store.customMonsters || []).map(m => ({ ...m, isCustom: true }));
  const allMonsters = [...customList, ...MONSTER_PRESETS];

  // Filter
  let filtered = allMonsters.filter(m => {
    let matchesType = false;
    if (selectedType === "All") {
      matchesType = true;
    } else if (selectedType === "Custom") {
      matchesType = !!m.isCustom;
    } else {
      matchesType = (m.type.toLowerCase() === selectedType.toLowerCase());
    }
    const matchesQuery = !query || 
      m.name.toLowerCase().includes(query) || 
      m.type.toLowerCase().includes(query) || 
      m.cr.toLowerCase().includes(query) || 
      (m.notes && m.notes.toLowerCase().includes(query));
    return matchesType && matchesQuery;
  });

  // Helper for CR value
  function parseCr(crStr) {
    if (!crStr) return 0;
    if (crStr.includes("1/8")) return 0.125;
    if (crStr.includes("1/4")) return 0.25;
    if (crStr.includes("1/2")) return 0.5;
    const num = parseInt(crStr.replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  }

  // Sort by Monster Type, CR, Name, or HP
  filtered.sort((a, b) => {
    if (sortBy === "type") return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "cr_asc") return parseCr(a.cr) - parseCr(b.cr) || a.name.localeCompare(b.name);
    if (sortBy === "cr_desc") return parseCr(b.cr) - parseCr(a.cr) || a.name.localeCompare(b.name);
    if (sortBy === "hp") return b.maxHp - a.maxHp;
    return 0;
  });

  // Selected totals
  const selectedNames = Object.keys(store.bestiarySelectedMonsters || {}).filter(k => store.bestiarySelectedMonsters[k]);
  const totalSelectedFoes = selectedNames.reduce((sum, name) => sum + ((store.bestiaryQuantities && store.bestiaryQuantities[name]) || 1), 0);

  return `
    <div class="bestiary-screen-container">
      <!-- Top Header -->
      <div class="bestiary-top-header">
        <div class="bestiary-title-group">
          <div class="bestiary-main-title">
            <span>🐉</span>
            <span>5E BESTIARY</span>
          </div>
          <span class="bestiary-subtitle">SRD Monsters & Custom Library • Multi-select & quantity deployment (${filtered.length} shown)</span>
        </div>
        <button class="btn-custom-monster" onclick="openCreateCustomMonsterModal()">
          + Custom Monster
        </button>
      </div>

      <!-- Batch Deployment Bar (Shown when multiple selected) -->
      ${selectedNames.length > 0 ? `
        <div class="bestiary-batch-bar">
          <div class="bestiary-batch-info">
            <span style="font-size: 20px;">⚔️</span>
            <div>
              <div><strong>${selectedNames.length} Monster Type${selectedNames.length > 1 ? 's' : ''} Selected</strong></div>
              <span style="font-size: 11.5px; opacity: 0.9;">Total ${totalSelectedFoes} foes ready for combat</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-dialog-cancel" style="padding: 6px 12px; font-size: 12px;" onclick="clearBestiarySelections()">Clear</button>
            <button class="btn-deploy-combat" style="height: 38px; padding: 0 16px;" onclick="deploySelectedBestiaryMonsters()">
              Deploy All (${totalSelectedFoes}) ➔
            </button>
          </div>
        </div>
      ` : ""}

      <!-- Search & Controls Bar -->
      <div class="bestiary-controls-bar">
        <div class="bestiary-search-container" style="flex: 1; min-width: 200px;">
          <span class="bestiary-search-icon">🔍</span>
          <input type="text" class="bestiary-search-input" placeholder="Search by monster name, type, CR, or traits..." value="${store.bestiarySearchQuery || ""}" oninput="setBestiarySearch(this.value)">
        </div>
        <select class="bestiary-sort-select" onchange="setBestiarySort(this.value)">
          <option value="type" ${sortBy === 'type' ? 'selected' : ''}>Sort by: Monster Type</option>
          <option value="name" ${sortBy === 'name' ? 'selected' : ''}>Sort by: Name (A-Z)</option>
          <option value="cr_asc" ${sortBy === 'cr_asc' ? 'selected' : ''}>Sort by: CR (Low to High)</option>
          <option value="cr_desc" ${sortBy === 'cr_desc' ? 'selected' : ''}>Sort by: CR (High to Low)</option>
          <option value="hp" ${sortBy === 'hp' ? 'selected' : ''}>Sort by: Max HP</option>
        </select>
      </div>

      <!-- Monster Type Filter Chips (Horizontal scrollable) -->
      <div class="monster-type-chips-row">
        ${types.map(t => `
          <button class="monster-type-chip ${selectedType === t ? 'active' : ''}" onclick="setBestiaryTypeFilter('${t}')">
            ${t === 'All' ? 'All Types' : t === 'Custom' ? '⭐ Custom' : t}
          </button>
        `).join("")}
      </div>

      <!-- Monster Cards Grid (Responsive 1-col on mobile, multi-col on PC) -->
      <div class="bestiary-cards-grid">
        ${filtered.map(m => {
          const qty = (store.bestiaryQuantities && store.bestiaryQuantities[m.name]) || 1;
          const isSelected = !!(store.bestiarySelectedMonsters && store.bestiarySelectedMonsters[m.name]);

          return `
            <div class="bestiary-monster-card" style="${isSelected ? 'border-color: #f43f5e; box-shadow: 0 0 16px rgba(244, 63, 94, 0.35);' : ''}">
              <!-- Top Row: Checkbox, Name, Type, CR Badge, Edit/Delete for Custom -->
              <div class="bestiary-card-top-row">
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                  <label class="bestiary-card-select-box" title="Select for multi-enemy deployment">
                    <input type="checkbox" class="bestiary-checkbox" ${isSelected ? 'checked' : ''} onchange="toggleBestiaryMonsterSelected('${m.name}')">
                  </label>
                  <div>
                    <span class="bestiary-card-name">${m.name}</span>
                    <div class="bestiary-card-type">${m.type} • ${m.isCustom ? "Custom Monster" : "5e SRD"}</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  ${m.isCustom ? `<span class="bestiary-cr-badge" style="border-color:#f59e0b; background:rgba(245,158,11,0.18); color:#fbbf24;">CUSTOM</span>` : ""}
                  <span class="bestiary-cr-badge">${m.cr}</span>
                  ${m.isCustom ? `
                    <button class="icon-btn-header gold" style="width:28px; height:28px; font-size:12px;" onclick="openCreateCustomMonsterModal('${m.id}')" title="Edit Monster">✏️</button>
                    <button class="icon-btn-header crimson" style="width:28px; height:28px; font-size:12px;" onclick="deleteCustomMonster('${m.id}')" title="Delete from Library">🗑️</button>
                  ` : ""}
                </div>
              </div>

              <!-- 5 Squircles Row (AC, HP, INIT, SPD, PERC) -->
              <div class="bestiary-squircles-row">
                <div class="bestiary-squircle">
                  <span class="bestiary-squircle-label">AC</span>
                  <span class="bestiary-squircle-val">${m.ac}</span>
                </div>
                <div class="bestiary-squircle">
                  <span class="bestiary-squircle-label">HP</span>
                  <span class="bestiary-squircle-val">${m.maxHp}</span>
                </div>
                <div class="bestiary-squircle">
                  <span class="bestiary-squircle-label">INIT</span>
                  <span class="bestiary-squircle-val" style="color: #fcd34d;">${m.initMod >= 0 ? `+${m.initMod}` : m.initMod}</span>
                </div>
                <div class="bestiary-squircle">
                  <span class="bestiary-squircle-label">SPD</span>
                  <span class="bestiary-squircle-val">${m.speed}ft</span>
                </div>
                <div class="bestiary-squircle">
                  <span class="bestiary-squircle-label">PERC</span>
                  <span class="bestiary-squircle-val">${m.perception}</span>
                </div>
              </div>

              <!-- Traits & Attacks Note -->
              ${m.notes ? `
                <div class="bestiary-notes-text">
                  <span>⚔️ ${m.notes}</span>
                </div>
              ` : ""}

              <!-- Bottom Row: Quantity Stepper & Deploy Button -->
              <div class="bestiary-card-bottom-row">
                <div class="bestiary-qty-control">
                  <span>Qty:</span>
                  <button class="bestiary-stepper-btn" onclick="adjustBestiaryQuantity('${m.name}', -1)">−</button>
                  <span class="bestiary-qty-num">${qty}</span>
                  <button class="bestiary-stepper-btn" onclick="adjustBestiaryQuantity('${m.name}', 1)">+</button>
                </div>
                <button class="btn-deploy-combat" onclick="spawnMonsterWithQty('${m.name}', ${qty})">
                  Deploy ${qty > 1 ? `(${qty}) ` : ""}to Combat
                </button>
              </div>
            </div>
          `;
        }).join("")}
        ${filtered.length === 0 ? `
          <div class="dialog-inner-card" style="text-align: center; padding: 32px 16px; align-items: center; grid-column: 1 / -1;">
            <span style="font-size: 32px;">🔍</span>
            <strong style="color: var(--color-gold); font-size: 16px; margin-top: 6px;">No Monsters Found</strong>
            <p style="font-size: 12px; color: var(--text-muted); max-width: 320px; margin-top: 4px;">No monsters matched your current search or type filter. Try adjusting your query or tap "+ Custom Monster" to add one.</p>
            <button class="btn-prep-action solid-gold" style="max-width: 220px; height: 42px; margin-top: 12px;" onclick="openCreateCustomMonsterModal()">+ Create Custom Monster</button>
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

// ------------------------------------------
// DICE & RULES SCREEN (Enhanced Multi-Dice & Modifiers)
// ------------------------------------------
function renderDiceScreen() {
  const last = store.lastRoll;
  const subTab = store.diceSubTab || "roller";
  const inputMode = store.diceInputMode || "standard";
  const sides = store.diceSelectedSides || 20;
  const count = store.diceCount || 1;
  const mod = store.diceModifier || 0;
  const mode = store.diceRollMode || "NORMAL";

  const modStr = mod !== 0 ? (mod > 0 ? `+${mod}` : `${mod}`) : "";
  const diceOptions = [4, 6, 8, 10, 12, 20, 100];

  // Calculate mixed tray formula
  const trayEntries = Object.entries(store.diceTray || {}).filter(([_, qty]) => qty > 0);
  const trayFormula = trayEntries.length > 0 
    ? trayEntries.map(([s, qty]) => `${qty}d${s === "100" ? "%" : s}`).join(" + ") + (mod !== 0 ? ` ${mod > 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`}` : "")
    : "Empty Tray";
  const trayTotalDiceCount = trayEntries.reduce((acc, [_, qty]) => acc + qty, 0);

  return `
    <div class="dice-screen-container">
      <!-- Top Sub-Tabs (Dice Roller, 5e Conditions, Rules Reference) -->
      <div class="dice-mode-segmented">
        <button class="dice-mode-tab ${subTab === 'roller' ? 'active' : ''}" onclick="switchDiceSubTab('roller')">
          🎲 Dice Roller
        </button>
        <button class="dice-mode-tab ${subTab === 'conditions' ? 'active' : ''}" onclick="switchDiceSubTab('conditions')">
          📜 Conditions Guide
        </button>
        <button class="dice-mode-tab ${subTab === 'rules' ? 'active' : ''}" onclick="switchDiceSubTab('rules')">
          ⚔️ Combat Rules
        </button>
      </div>

      ${subTab === "roller" ? `
        <div class="desktop-dice-layout">
          <!-- LEFT COLUMN: ROLL RESULT SPOTLIGHT & CONTROLS -->
          <div class="desktop-dice-left">
            <!-- ACTIVE ROLL RESULT SPOTLIGHT CARD (At the top above dice selector) -->
            ${last ? `
              <div class="roll-result-card ${last.isNat20 ? 'nat20' : last.isNat1 ? 'nat1' : ''}" style="margin-bottom: 6px;">
                <span style="font-size: 12px; font-weight: 800; letter-spacing: 1px; color: ${last.isNat20 ? '#34d399' : last.isNat1 ? '#ef4444' : 'var(--color-gold)'}; text-transform: uppercase;">
                  ${last.isNat20 ? '🌟 NATURAL 20! CRITICAL HIT!' : last.isNat1 ? '💀 NATURAL 1! CRITICAL FUMBLE!' : 'ROLL RESULT'}
                </span>

                <div class="roll-total-num ${last.isNat20 ? 'green' : last.isNat1 ? 'red' : ''}">
                  ${last.total}
                </div>

                <div style="font-size: 14px; font-weight: 800; color: var(--text-white);">
                  ${last.formula}
                </div>

                <!-- Dice Individual Badges -->
                ${last.rolls && last.rolls.length > 0 ? `
                  <div class="dice-breakdown-chips-row">
                    ${last.rolls.map((r, idx) => `
                      <span class="die-result-pill ${r.dropped ? 'dropped' : ''} ${r.value === 20 && last.sides === 20 ? 'crit' : r.value === 1 && last.sides === 20 ? 'fumble' : ''}">
                        ${r.label || `Die ${idx+1}`}: ${r.value}${r.dropped ? ' (dropped)' : ''}
                      </span>
                    `).join("")}
                    ${last.modifier !== 0 ? `
                      <span class="die-result-pill" style="border-color: var(--color-gold); color: var(--color-gold-light);">
                        Mod: ${last.modifier > 0 ? `+${last.modifier}` : last.modifier}
                      </span>
                    ` : ""}
                  </div>
                ` : ""}

                <div class="roll-breakdown-details">
                  ${last.calculation || `Total: ${last.total}`} • Rolled at ${last.timestamp || "Just now"}
                </div>
              </div>
            ` : `
              <div class="dialog-inner-card" style="text-align: center; padding: 20px 14px; align-items: center; margin-bottom: 6px; border-style: dashed;">
                <span style="font-size: 26px;">🎲</span>
                <strong style="color: var(--color-gold); font-size: 15px; margin-top: 4px;">Ready to Roll</strong>
                <p style="font-size: 11.5px; color: var(--text-muted); max-width: 280px; margin-top: 2px;">Select dice below and tap Roll, or pick a quick preset.</p>
              </div>
            `}

            <!-- Roller View Mode Switcher: Single Die vs Mixed Pool -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
              <span style="font-size: 11px; font-weight: 800; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.5px;">
                ${inputMode === "standard" ? "Dice Selector & Modifier" : "Multi-Dice Custom Pool Tray"}
              </span>
              <button class="btn-header-link gold" style="font-size: 11.5px;" onclick="store.diceInputMode = store.diceInputMode === 'standard' ? 'tray' : 'standard'; renderApp();">
                ${inputMode === "standard" ? "Switch to Mixed Dice Tray ➔" : "➔ Switch to Standard Die"}
              </button>
            </div>

            ${inputMode === "standard" ? `
              <!-- STANDARD MULTI-DICE MODE -->
              <div class="dialog-inner-card">
                <!-- Polyhedral Dice Grid -->
                <span class="dialog-inner-title">1. Select Die Type</span>
                <div class="dice-selector-grid">
                  ${diceOptions.map(s => `
                    <button class="die-select-btn ${sides === s ? 'selected' : ''}" onclick="selectDieType(${s})">
                      <span class="die-select-name">d${s === 100 ? '%' : s}</span>
                      <span class="die-select-badge">${s === 20 ? 'Standard' : s === 100 ? 'Percent' : `${s}-sided`}</span>
                    </button>
                  `).join("")}
                </div>

                <!-- Dice Count Stepper & Quick Chips -->
                <div style="margin-top: 8px;">
                  <span class="dialog-inner-title">2. Number of Dice (Count)</span>
                  <div class="dice-stepper-row" style="margin-top: 4px;">
                    <div class="dice-stepper-group">
                      <button class="btn-dice-stepper" onclick="adjustDiceCount(-1)">−</button>
                      <input type="number" class="dice-num-box" min="1" max="50" value="${count}" onchange="setDiceCount(parseInt(this.value, 10) || 1)">
                      <button class="btn-dice-stepper" onclick="adjustDiceCount(1)">+</button>
                    </div>
                    <div class="quick-chips-row">
                      ${[1, 2, 3, 4, 6, 8, 10, 12, 20].map(c => `
                        <button class="quick-chip ${count === c ? 'selected' : ''}" onclick="setDiceCount(${c})">${c}x</button>
                      `).join("")}
                    </div>
                  </div>
                </div>

                <!-- Modifier Stepper & Quick Chips -->
                <div style="margin-top: 10px;">
                  <span class="dialog-inner-title">3. Add Modifier (End of Roll)</span>
                  <div class="dice-stepper-row" style="margin-top: 4px;">
                    <div class="dice-stepper-group">
                      <button class="btn-dice-stepper" onclick="adjustDiceModifier(-1)">−</button>
                      <input type="number" class="dice-num-box" value="${mod}" onchange="setDiceModifier(parseInt(this.value, 10) || 0)">
                      <button class="btn-dice-stepper" onclick="adjustDiceModifier(1)">+</button>
                    </div>
                    <div class="quick-chips-row">
                      ${[-5, -2, -1, 0, 1, 2, 3, 4, 5, 7, 10].map(m => `
                        <button class="quick-chip ${mod === m ? 'selected' : ''}" onclick="setDiceModifier(${m})">${m >= 0 ? `+${m}` : m}</button>
                      `).join("")}
                    </div>
                  </div>
                </div>

                <!-- Advantage / Disadvantage (if 1d20) -->
                ${(sides === 20 && count === 1) ? `
                  <div style="margin-top: 10px;">
                    <span class="dialog-inner-title">d20 Advantage / Disadvantage</span>
                    <div style="display: flex; gap: 6px; margin-top: 4px;">
                      <button class="quick-chip ${mode === 'NORMAL' ? 'selected' : ''}" style="flex:1; padding: 7px 0; text-align: center;" onclick="setDiceRollMode('NORMAL')">Normal</button>
                      <button class="quick-chip ${mode === 'ADVANTAGE' ? 'selected' : ''}" style="flex:1; padding: 7px 0; text-align: center;" onclick="setDiceRollMode('ADVANTAGE')">Advantage (Take High)</button>
                      <button class="quick-chip ${mode === 'DISADVANTAGE' ? 'selected' : ''}" style="flex:1; padding: 7px 0; text-align: center;" onclick="setDiceRollMode('DISADVANTAGE')">Disadvantage (Take Low)</button>
                    </div>
                  </div>
                ` : ""}

                <!-- PRIMARY ROLL BUTTON -->
                <button class="btn-prep-action solid-gold" style="margin-top: 14px; height: 52px; font-size: 16px;" onclick="rollConfiguredDice()">
                  <span>🎲</span>
                  <span>ROLL ${count}d${sides === 100 ? '%' : sides} ${modStr ? ` ${modStr}` : ""} ${mode === 'ADVANTAGE' ? '(Adv)' : mode === 'DISADVANTAGE' ? '(Disadv)' : ''}</span>
                </button>
              </div>
            ` : `
              <!-- MIXED DICE POOL TRAY MODE (Mix Multiple Dice Types) -->
              <div class="dialog-inner-card">
                <span class="dialog-inner-title">Custom Multi-Dice Pool Builder</span>
                <p style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 8px;">
                  Add any combination of dice into your tray (e.g. 2d6 + 1d8 + 3). Tap + / − to adjust dice.
                </p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px;">
                  ${diceOptions.map(s => {
                    const qty = (store.diceTray && store.diceTray[s]) || 0;
                    return `
                      <div style="background: var(--bg-card-darker); border: 1.5px solid ${qty > 0 ? 'var(--color-gold)' : 'var(--border-card)'}; border-radius: 10px; padding: 8px; display: flex; flex-direction: column; align-items: center;">
                        <strong style="color: ${qty > 0 ? 'var(--color-gold-light)' : '#fff'}; font-size: 14px;">d${s === 100 ? '%' : s}</strong>
                        <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
                          <button class="btn-dice-stepper" style="width: 26px; height: 26px; font-size: 14px;" onclick="adjustTrayDie(${s}, -1)">−</button>
                          <span style="font-weight: 800; font-size: 14px; min-width: 18px; text-align: center; color: ${qty > 0 ? 'var(--color-gold)' : 'var(--text-muted)'};">${qty}</span>
                          <button class="btn-dice-stepper" style="width: 26px; height: 26px; font-size: 14px;" onclick="adjustTrayDie(${s}, 1)">+</button>
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>

                <!-- Active Tray Preview Bar -->
                <div class="dice-tray-preview-bar" style="margin-top: 12px;">
                  <div>
                    <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block;">Active Tray Formula</span>
                    <span class="dice-tray-formula-text">${trayFormula}</span>
                  </div>
                  <button class="btn-header-link crimson" style="font-size: 12px;" onclick="clearDiceTray()">Clear Tray</button>
                </div>

                <!-- Modifier Stepper for Tray -->
                <div style="margin-top: 10px;">
                  <span class="dialog-inner-title">Add Modifier to Tray Total</span>
                  <div class="dice-stepper-row" style="margin-top: 4px;">
                    <div class="dice-stepper-group">
                      <button class="btn-dice-stepper" onclick="adjustDiceModifier(-1)">−</button>
                      <input type="number" class="dice-num-box" value="${mod}" onchange="setDiceModifier(parseInt(this.value, 10) || 0)">
                      <button class="btn-dice-stepper" onclick="adjustDiceModifier(1)">+</button>
                    </div>
                    <div class="quick-chips-row">
                      ${[-5, -2, -1, 0, 1, 2, 3, 4, 5, 7, 10].map(m => `
                        <button class="quick-chip ${mod === m ? 'selected' : ''}" onclick="setDiceModifier(${m})">${m >= 0 ? `+${m}` : m}</button>
                      `).join("")}
                    </div>
                  </div>
                </div>

                <!-- ROLL TRAY BUTTON & SAVE AS PRESET -->
                <button class="btn-prep-action solid-gold" style="margin-top: 14px; height: 50px; font-size: 15px;" onclick="rollDicePool()" ${trayTotalDiceCount === 0 ? 'disabled' : ''}>
                  <span>🎲</span>
                  <span>ROLL TRAY (${trayFormula})</span>
                </button>
                ${trayTotalDiceCount > 0 ? `
                  <button class="btn-prev-turn" style="height: 38px; width: 100%; border-radius: 8px; margin-top: 6px; font-size: 12.5px;" onclick="openCustomPresetModal('${trayFormula}')">
                    💾 Save Active Tray as Custom Preset
                  </button>
                ` : ""}
              </div>
            `}

            <!-- CUSTOM DICE PRESETS (Condensed Like Quick Presets) -->
            <div class="dialog-inner-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span class="dialog-inner-title">⭐ Custom Presets (${(store.customDicePresets || []).length})</span>
                <button class="btn-header-link gold" style="font-size: 11.5px;" onclick="openCustomPresetModal()">+ Add Preset</button>
              </div>
              <div class="quick-chips-row" style="margin-top: 6px;">
                ${(store.customDicePresets || []).map(p => `
                  <div class="quick-chip custom-preset-condensed" onclick="rollCustomDicePreset('${p.id}')" title="Roll ${p.name}: ${p.formula}">
                    <span class="preset-name">${p.name}</span>
                    <span class="custom-preset-del" onclick="event.stopPropagation(); deleteCustomDicePreset('${p.id}');" title="Delete">✕</span>
                  </div>
                `).join("")}
                ${(!store.customDicePresets || store.customDicePresets.length === 0) ? `
                  <span style="font-size: 11.5px; color: var(--text-muted); padding: 4px 0;">No custom presets yet. Tap "+ Add Preset" to create shortcuts!</span>
                ` : ""}
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN ON PC: ROLL HISTORY & RULES -->
          <div class="desktop-dice-right">
            <!-- RECENT ROLL HISTORY -->
            <div class="dialog-inner-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="dialog-inner-title">📜 Roll History (${(store.diceHistory || []).length})</span>
                ${(store.diceHistory && store.diceHistory.length > 0) ? `
                  <button class="btn-header-link crimson" style="font-size: 11px;" onclick="clearDiceHistory()">Clear</button>
                ` : ""}
              </div>
              ${(!store.diceHistory || store.diceHistory.length === 0) ? `
                <div style="font-size: 12px; color: var(--text-subtle); padding: 16px 0; text-align: center;">
                  No previous rolls yet. Rolled totals and breakdowns will appear here.
                </div>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 6px; max-height: 380px; overflow-y: auto;">
                  ${store.diceHistory.map(h => `
                    <div class="roll-history-item">
                      <div>
                        <strong style="color: #fff;">${h.formula}</strong>
                        <div style="font-size: 11px; color: var(--text-muted);">${h.calculation || ""}</div>
                      </div>
                      <div style="text-align: right;">
                        <span style="font-size: 18px; font-weight: 900; color: ${h.isNat20 ? '#34d399' : h.isNat1 ? '#ef4444' : 'var(--color-gold-light)'};">
                          ${h.total}
                        </span>
                        <div style="font-size: 10px; color: var(--text-subtle);">${h.timestamp || ""}</div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              `}
            </div>

            <!-- 5E RULES REFERENCE CARD -->
            <div class="dialog-inner-card">
              <span class="dialog-inner-title">⚔️ 5e Dice Mechanics</span>
              <div style="font-size: 12px; color: var(--text-muted); line-height: 1.45; display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
                <div><strong style="color: #34d399;">Natural 20:</strong> Critical hit! Roll attack damage dice twice before adding modifiers.</div>
                <div><strong style="color: #ef4444;">Natural 1:</strong> Critical fumble! Attack automatically misses regardless of modifiers.</div>
                <div><strong style="color: var(--color-gold);">Advantage / Disadvantage:</strong> Roll two d20s and take the higher or lower result.</div>
              </div>
            </div>
          </div>
        </div>
      ` : subTab === "conditions" ? `
        <!-- 5E CONDITIONS REFERENCE -->
        <div class="dialog-inner-card">
          <span class="dialog-inner-title">5e Official Conditions Reference</span>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
            Quick reference for condition penalties, advantages, and saving throw impacts.
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 60vh; overflow-y: auto;">
            ${CONDITIONS.map(cond => `
              <div style="background: var(--bg-card-darker); border-left: 4px solid ${cond.color}; border-radius: 8px; padding: 8px 12px;">
                <strong style="color: ${cond.color}; font-size: 13px;">${cond.name}</strong>
                <p style="font-size: 11.5px; color: var(--text-muted); line-height: 1.35; margin-top: 3px;">${cond.desc}</p>
              </div>
            `).join("")}
          </div>
        </div>
      ` : `
        <!-- 5E COMBAT RULES REFERENCE -->
        <div class="dialog-inner-card">
          <span class="dialog-inner-title">⚔️ 5e Combat Rules Reference</span>
          <div style="display: flex; flex-direction: column; gap: 10px; max-height: 60vh; overflow-y: auto;">
            <div style="background: var(--bg-card-darker); border-radius: 8px; padding: 10px 12px;">
              <strong style="color: var(--color-gold); font-size: 13px;">Standard Actions in Combat</strong>
              <div style="font-size: 11.5px; color: var(--text-muted); line-height: 1.4; margin-top: 4px;">
                &bull; <strong>Attack:</strong> Melee or ranged weapon attack.<br>
                &bull; <strong>Cast a Spell:</strong> Cast a spell with casting time of 1 action.<br>
                &bull; <strong>Dash:</strong> Gain extra movement equal to your speed for current turn.<br>
                &bull; <strong>Disengage:</strong> Movement does not provoke opportunity attacks for remainder of turn.<br>
                &bull; <strong>Dodge:</strong> Attacks against you have disadvantage if you can see attacker. Advantage on Dex saves.<br>
                &bull; <strong>Help:</strong> Give an ally advantage on next ability check or attack roll.<br>
                &bull; <strong>Hide:</strong> Make a Dexterity (Stealth) check in an attempt to hide.<br>
                &bull; <strong>Ready:</strong> Wait for a particular trigger before acting with reaction.<br>
                &bull; <strong>Search / Use an Object:</strong> Search area or interact with item.
              </div>
            </div>

            <div style="background: var(--bg-card-darker); border-radius: 8px; padding: 10px 12px;">
              <strong style="color: #60a5fa; font-size: 13px;">🛡️ Cover Rules</strong>
              <div style="font-size: 11.5px; color: var(--text-muted); line-height: 1.4; margin-top: 4px;">
                &bull; <strong>Half Cover (+2 AC & Dex Saves):</strong> Low wall, tree trunk, or creature blocking at least half body.<br>
                &bull; <strong>Three-Quarters Cover (+5 AC & Dex Saves):</strong> Portcullis, arrow slit, or thick tree trunk blocking 3/4 body.<br>
                &bull; <strong>Total Cover:</strong> Completely concealed by obstacle. Cannot be targeted directly by attacks or spells.
              </div>
            </div>

            <div style="background: var(--bg-card-darker); border-radius: 8px; padding: 10px 12px;">
              <strong style="color: #f43f5e; font-size: 13px;">💀 Death Saving Throws & Stabilizing</strong>
              <div style="font-size: 11.5px; color: var(--text-muted); line-height: 1.4; margin-top: 4px;">
                &bull; Roll d20 with no modifiers at start of turn when at 0 HP.<br>
                &bull; <strong>10 or higher:</strong> 1 Success (3 successes = Stabilized).<br>
                &bull; <strong>9 or lower:</strong> 1 Failure (3 failures = Death).<br>
                &bull; <strong>Natural 1:</strong> Counts as 2 Failures.<br>
                &bull; <strong>Natural 20:</strong> Regain 1 HP immediately and wake up.<br>
                &bull; <strong>Damage at 0 HP:</strong> Causes 1 failure (critical hit causes 2 failures).
              </div>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}

// ------------------------------------------
// DICE ROLLER HELPER FUNCTIONS
// ------------------------------------------

function switchDiceSubTab(tab) {
  store.diceSubTab = tab;
  renderApp();
}

function selectDieType(sides) {
  store.diceSelectedSides = sides;
  renderApp();
}

function adjustDiceCount(delta) {
  store.diceCount = Math.max(1, Math.min(50, (store.diceCount || 1) + delta));
  renderApp();
}

function setDiceCount(val) {
  store.diceCount = Math.max(1, Math.min(50, val || 1));
  renderApp();
}

function adjustDiceModifier(delta) {
  store.diceModifier = (store.diceModifier || 0) + delta;
  renderApp();
}

function setDiceModifier(val) {
  store.diceModifier = val || 0;
  renderApp();
}

function setDiceRollMode(mode) {
  store.diceRollMode = mode;
  renderApp();
}

function adjustTrayDie(sides, delta) {
  if (!store.diceTray) store.diceTray = { 4:0, 6:0, 8:0, 10:0, 12:0, 20:0, 100:0 };
  store.diceTray[sides] = Math.max(0, (store.diceTray[sides] || 0) + delta);
  renderApp();
}

function clearDiceTray() {
  store.diceTray = { 4:0, 6:0, 8:0, 10:0, 12:0, 20:0, 100:0 };
  renderApp();
}

function clearDiceHistory() {
  store.diceHistory = [];
  store.save();
  renderApp();
}

function rollConfiguredDice() {
  const sides = store.diceSelectedSides || 20;
  const count = store.diceCount || 1;
  const mod = store.diceModifier || 0;
  const mode = store.diceRollMode || "NORMAL";

  let rolls = [];
  let isNat20 = false;
  let isNat1 = false;
  let total = 0;
  let calculation = "";

  if (sides === 20 && count === 1) {
    if (mode === "ADVANTAGE") {
      const r1 = rollDie(20);
      const r2 = rollDie(20);
      const kept = Math.max(r1, r2);
      const dropped = Math.min(r1, r2);
      rolls = [
        { label: "d20 #1", value: r1, dropped: r1 === dropped && r1 !== r2 },
        { label: "d20 #2", value: r2, dropped: r2 === dropped }
      ];
      isNat20 = kept === 20;
      isNat1 = kept === 1;
      total = kept + mod;
      calculation = `Rolled [${r1}, ${r2}] &bull; Kept ${kept} ${mod !== 0 ? (mod > 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`) : ""} = ${total}`;
    } else if (mode === "DISADVANTAGE") {
      const r1 = rollDie(20);
      const r2 = rollDie(20);
      const kept = Math.min(r1, r2);
      const dropped = Math.max(r1, r2);
      rolls = [
        { label: "d20 #1", value: r1, dropped: r1 === dropped && r1 !== r2 },
        { label: "d20 #2", value: r2, dropped: r2 === dropped }
      ];
      isNat20 = kept === 20;
      isNat1 = kept === 1;
      total = kept + mod;
      calculation = `Rolled [${r1}, ${r2}] &bull; Kept ${kept} ${mod !== 0 ? (mod > 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`) : ""} = ${total}`;
    } else {
      const r = rollDie(20);
      rolls = [{ label: "d20", value: r, dropped: false }];
      isNat20 = r === 20;
      isNat1 = r === 1;
      total = r + mod;
      calculation = `Die ${r} ${mod !== 0 ? (mod > 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`) : ""} = ${total}`;
    }
  } else {
    // Multi-dice
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const r = rollDie(sides);
      rolls.push({ label: `d${sides === 100 ? '%' : sides}`, value: r, dropped: false });
      sum += r;
    }
    total = sum + mod;
    const valuesList = rolls.map(r => r.value).join(" + ");
    calculation = `(${valuesList}) ${mod !== 0 ? (mod > 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`) : ""} = ${total}`;
    if (sides === 20 && count === 1) {
      isNat20 = rolls[0].value === 20;
      isNat1 = rolls[0].value === 1;
    }
  }

  const modLabel = mod !== 0 ? (mod > 0 ? `+${mod}` : `${mod}`) : "";
  const formula = `${count}d${sides === 100 ? '%' : sides}${modLabel ? ` ${modLabel}` : ""}${mode === "ADVANTAGE" ? " (Adv)" : mode === "DISADVANTAGE" ? " (Disadv)" : ""}`;

  const rollResult = {
    id: "roll-" + Date.now(),
    formula: formula,
    total: total,
    rolls: rolls,
    modifier: mod,
    sides: sides,
    count: count,
    isNat20: isNat20,
    isNat1: isNat1,
    calculation: calculation,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };

  store.lastRoll = rollResult;
  store.diceHistory = [rollResult, ...(store.diceHistory || [])].slice(0, 20);
  store.save();
  renderApp();
}

function rollDicePool() {
  const mod = store.diceModifier || 0;
  const tray = store.diceTray || {};
  const entries = Object.entries(tray).filter(([_, qty]) => qty > 0);

  if (entries.length === 0) {
    showToast("Add dice to tray first");
    return;
  }

  let rolls = [];
  let sum = 0;
  let formulaParts = [];

  entries.forEach(([sidesStr, qty]) => {
    const sides = parseInt(sidesStr, 10);
    formulaParts.push(`${qty}d${sides === 100 ? '%' : sides}`);
    for (let i = 0; i < qty; i++) {
      const r = rollDie(sides);
      rolls.push({ label: `d${sides === 100 ? '%' : sides}`, value: r, dropped: false });
      sum += r;
    }
  });

  const total = sum + mod;
  const modLabel = mod !== 0 ? (mod > 0 ? `+${mod}` : `${mod}`) : "";
  const formula = `${formulaParts.join(" + ")}${modLabel ? ` ${modLabel}` : ""}`;
  const valuesList = rolls.map(r => r.value).join(" + ");
  const calculation = `(${valuesList}) ${mod !== 0 ? (mod > 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`) : ""} = ${total}`;

  const rollResult = {
    id: "roll-" + Date.now(),
    formula: formula,
    total: total,
    rolls: rolls,
    modifier: mod,
    sides: null,
    count: rolls.length,
    isNat20: false,
    isNat1: false,
    calculation: calculation,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };

  store.lastRoll = rollResult;
  store.diceHistory = [rollResult, ...(store.diceHistory || [])].slice(0, 20);
  store.save();
  renderApp();
}

function quickRollPreset(presetName) {
  let sides = 20;
  let count = 1;
  let mod = 0;
  let mode = "NORMAL";
  let isSpecialDropLowest = false;

  switch (presetName) {
    case "d20_check":
      sides = 20; count = 1; mod = 0; mode = "NORMAL";
      break;
    case "d20_adv":
      sides = 20; count = 1; mod = 0; mode = "ADVANTAGE";
      break;
    case "greatsword":
      sides = 6; count = 2; mod = 3;
      break;
    case "longsword":
      sides = 8; count = 1; mod = 3;
      break;
    case "greataxe":
      sides = 12; count = 1; mod = 3;
      break;
    case "fireball":
      sides = 6; count = 8; mod = 0;
      break;
    case "cantrip_d10":
      sides = 10; count = 1; mod = 0;
      break;
    case "stats_4d6":
      isSpecialDropLowest = true;
      break;
  }

  if (isSpecialDropLowest) {
    const raw = [rollDie(6), rollDie(6), rollDie(6), rollDie(6)];
    const minVal = Math.min(...raw);
    let minDropped = false;
    const rolls = raw.map(v => {
      if (v === minVal && !minDropped) {
        minDropped = true;
        return { label: "d6", value: v, dropped: true };
      }
      return { label: "d6", value: v, dropped: false };
    });
    const kept = rolls.filter(r => !r.dropped).map(r => r.value);
    const total = kept.reduce((a, b) => a + b, 0);

    const rollResult = {
      id: "roll-" + Date.now(),
      formula: "4d6 Drop Lowest (Ability Score)",
      total: total,
      rolls: rolls,
      modifier: 0,
      sides: 6,
      count: 4,
      isNat20: false,
      isNat1: false,
      calculation: `Kept [${kept.join(", ")}] &bull; Dropped [${minVal}] = ${total}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    store.lastRoll = rollResult;
    store.diceHistory = [rollResult, ...(store.diceHistory || [])].slice(0, 20);
    store.save();
    renderApp();
    return;
  }

  store.diceSelectedSides = sides;
  store.diceCount = count;
  store.diceModifier = mod;
  store.diceRollMode = mode;
  rollConfiguredDice();
}

function rollDieDirect(sides) {
  selectDieType(sides);
  rollConfiguredDice();
}

function spawnMonster(name) {
  const p = MONSTER_PRESETS.find(x => x.name === name);
  if (!p) return;
  const count = store.encounter.combatants.filter(c => c.name.startsWith(p.name)).length + 1;
  const cName = `${p.name} #${count}`;
  const init = rollD20() + p.initMod;

  store.encounter.combatants.push({
    id: "c-" + Date.now(),
    name: cName,
    isPlayer: false,
    characterClassOrType: `Enemy (${p.cr})`,
    maxHp: p.maxHp,
    currentHp: p.maxHp,
    tempHp: 0,
    armorClass: p.ac,
    baseArmorClass: p.ac,
    coverType: "NONE",
    initiativeModifier: p.initMod,
    initiativeRoll: init,
    speed: p.speed,
    baseSpeed: p.speed,
    isDifficultTerrain: false,
    spellDc: p.spellDc,
    notes: p.notes,
    abilities: [],
    conditions: [],
    deathSavesSuccess: 0,
    deathSavesFailure: 0,
    isStabilized: false,
    isDead: false
  });

  store.encounter.combatants = sortCombatants(store.encounter.combatants);
  store.logEvent(`Added ${cName} to encounter`, "info");
  store.save();
  showToast(`Added ${cName}`);
  store.currentTab = "combat";
  renderApp();
}

function addAllPartyToEncounter() {
  store.party.forEach(p => {
    if (!store.encounter.combatants.some(c => c.characterId === p.id)) {
      store.encounter.combatants.push({
        id: "c-" + p.id + "-" + Date.now(),
        characterId: p.id,
        name: p.name,
        isPlayer: true,
        characterClassOrType: `${p.characterClass} (Lvl ${p.level})`,
        maxHp: p.maxHp,
        currentHp: p.currentHp,
        tempHp: p.tempHp || 0,
        armorClass: p.armorClass,
        baseArmorClass: p.armorClass,
        coverType: "NONE",
        initiativeModifier: p.initiativeModifier,
        initiativeRoll: rollD20() + p.initiativeModifier,
        speed: p.speed,
        baseSpeed: p.speed,
        isDifficultTerrain: false,
        spellDc: p.spellDc,
        notes: p.notes,
        abilities: p.abilities || [],
        conditions: [],
        deathSavesSuccess: 0,
        deathSavesFailure: 0,
        isStabilized: false,
        isDead: false
      });
    }
  });

  store.encounter.combatants = sortCombatants(store.encounter.combatants);
  store.save();
  showToast("Party sent to Combat Arena!");
  store.currentTab = "combat";
  renderApp();
}

function addSinglePlayerToArena(partyId) {
  const p = store.party.find(x => x.id === partyId);
  if (!p) return;
  if (!store.encounter.combatants.some(c => c.characterId === p.id)) {
    store.encounter.combatants.push({
      id: "c-" + p.id + "-" + Date.now(),
      characterId: p.id,
      name: p.name,
      isPlayer: true,
      characterClassOrType: `${p.characterClass} (Lvl ${p.level})`,
      maxHp: p.maxHp,
      currentHp: p.currentHp,
      tempHp: p.tempHp || 0,
      armorClass: p.armorClass,
      baseArmorClass: p.armorClass,
      coverType: "NONE",
      initiativeModifier: p.initiativeModifier,
      initiativeRoll: rollD20() + p.initiativeModifier,
      speed: p.speed,
      baseSpeed: p.speed,
      isDifficultTerrain: false,
      spellDc: p.spellDc,
      notes: p.notes,
      abilities: p.abilities || [],
      conditions: [],
      deathSavesSuccess: 0,
      deathSavesFailure: 0,
      isStabilized: false,
      isDead: false
    });
    store.encounter.combatants = sortCombatants(store.encounter.combatants);
    store.save();
    showToast(`Added ${p.name} to Combat`);
  } else {
    showToast(`${p.name} is already in the arena`);
  }
  store.currentTab = "combat";
  renderApp();
}

function deletePartyMember(partyId) {
  if (!confirm("Delete this character from party?")) return;
  store.party = store.party.filter(p => p.id !== partyId);
  store.save();
  renderApp();
}

// ==========================================
// MODAL DIALOGS ENGINE (Matching Screenshots 2-5)
// ==========================================

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("open");
}

// ------------------------------------------
// 1. EDIT MOVEMENT SPEED DIALOG (Screenshot 2)
// ------------------------------------------
function openSpeedModal(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;
  recalculateCombatantStats(c);

  store.dialogSpeedBase = c.baseSpeed != null ? c.baseSpeed : (c.speed || 30);
  store.dialogSpeedDiff = !!c.isDifficultTerrain;

  document.getElementById("modal-speed-combatant-name").textContent = c.name;
  updateSpeedDialogUi();
  openModal("modal-speed-dialog");
}

function updateSpeedDialogUi() {
  const base = store.dialogSpeedBase;
  const isDiff = store.dialogSpeedDiff;
  const effective = isDiff ? Math.floor(base / 2) : base;

  document.getElementById("modal-speed-subtitle").textContent = `${document.getElementById("modal-speed-combatant-name").textContent} • Effective Speed: ${effective}ft`;
  document.getElementById("modal-speed-value").value = base;

  // Toggle switch
  const toggle = document.getElementById("speed-diff-toggle");
  if (toggle) {
    toggle.classList.toggle("on", isDiff);
  }

  // Summary box
  document.getElementById("modal-speed-summary").textContent = isDiff ? `${effective}ft (½ of ${base}ft)` : `${effective}ft`;

  // Presets
  document.querySelectorAll(".chip-speed-preset").forEach(btn => {
    const val = parseInt(btn.dataset.speed, 10);
    btn.classList.toggle("selected", val === base);
  });
}

function adjustSpeedStepper(delta) {
  store.dialogSpeedBase = Math.max(0, store.dialogSpeedBase + delta);
  updateSpeedDialogUi();
}

function setSpeedPreset(val) {
  store.dialogSpeedBase = val;
  updateSpeedDialogUi();
}

function toggleSpeedDifficult() {
  store.dialogSpeedDiff = !store.dialogSpeedDiff;
  updateSpeedDialogUi();
}

function saveSpeedDialog() {
  const c = store.encounter.combatants.find(x => x.id === store.activeCombatantId);
  if (c) {
    const base = store.dialogSpeedBase;
    const isDiff = store.dialogSpeedDiff;

    c.baseSpeed = base;
    c.isDifficultTerrain = isDiff;

    // Filter out existing difficult_terrain condition (string or object)
    c.conditions = (c.conditions || []).filter(cn => {
      const cid = typeof cn === 'string' ? cn : cn.id;
      return cid !== "difficult_terrain";
    });

    if (isDiff) {
      c.conditions.push({
        id: "difficult_terrain",
        duration: "permanent",
        roundsRemaining: null,
        appliedRound: store.encounter.round,
        turnsPassed: 0
      });
    }

    recalculateCombatantStats(c);

    store.logEvent(`Updated ${c.name} Speed to ${c.speed}ft ${isDiff ? "(Difficult Terrain)" : ""}`, "info");
    store.save();
  }
  closeModal("modal-speed-dialog");
  renderApp();
}

// ------------------------------------------
// 2. EDIT ARMOR CLASS (AC) DIALOG (Screenshot 3)
// ------------------------------------------
function openAcModal(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;
  recalculateCombatantStats(c);

  store.dialogAcBase = c.baseArmorClass != null ? c.baseArmorClass : (c.armorClass || 10);
  store.dialogAcCover = c.coverType || "NONE";

  document.getElementById("modal-ac-combatant-name").textContent = c.name;
  updateAcDialogUi();
  openModal("modal-ac-dialog");
}

function updateAcDialogUi() {
  const base = store.dialogAcBase;
  const cover = store.dialogAcCover;
  const bonus = cover === "HALF" ? 2 : cover === "THREE_QUARTERS" ? 5 : cover === "TOTAL" ? 10 : 0;
  const effective = base + bonus;

  document.getElementById("modal-ac-subtitle").textContent = `${document.getElementById("modal-ac-combatant-name").textContent} • Total AC: ${effective}`;
  document.getElementById("modal-ac-value").value = base;

  // Cover buttons
  document.querySelectorAll(".cover-option-btn").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.cover === cover);
  });

  // Cover desc
  const descEl = document.getElementById("modal-ac-cover-desc");
  if (descEl) {
    const descs = {
      NONE: "Standard line of sight. No cover bonuses.",
      HALF: "Half Cover: Obstacle blocks at least half its body. +2 AC and +2 Dex saves.",
      THREE_QUARTERS: "3/4 Cover: Obstacle blocks 3/4 of its body. +5 AC and +5 Dex saves.",
      TOTAL: "Total Cover: Completely concealed by an obstacle. Attacks/spells cannot target directly (+10 AC applied)."
    };
    descEl.textContent = descs[cover] || descs.NONE;
  }

  // Summary box
  const sumEl = document.getElementById("modal-ac-summary");
  if (sumEl) {
    sumEl.innerHTML = `${effective} AC <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">(${base} base + ${bonus} cover)</span>`;
  }
}

function adjustAcStepper(delta) {
  store.dialogAcBase = Math.max(1, store.dialogAcBase + delta);
  updateAcDialogUi();
}

function setCoverType(type) {
  store.dialogAcCover = type;
  updateAcDialogUi();
}

function saveAcDialog() {
  const c = store.encounter.combatants.find(x => x.id === store.activeCombatantId);
  if (c) {
    const base = store.dialogAcBase;
    const cover = store.dialogAcCover;

    c.baseArmorClass = base;
    c.coverType = cover;

    // Filter out existing cover conditions (string or object)
    c.conditions = (c.conditions || []).filter(cn => {
      const cid = typeof cn === 'string' ? cn : cn.id;
      return !["half_cover", "three_quarters_cover", "total_cover"].includes(cid);
    });

    if (cover === "HALF") {
      c.conditions.push({ id: "half_cover", duration: "permanent", roundsRemaining: null, appliedRound: store.encounter.round, turnsPassed: 0 });
    } else if (cover === "THREE_QUARTERS") {
      c.conditions.push({ id: "three_quarters_cover", duration: "permanent", roundsRemaining: null, appliedRound: store.encounter.round, turnsPassed: 0 });
    } else if (cover === "TOTAL") {
      c.conditions.push({ id: "total_cover", duration: "permanent", roundsRemaining: null, appliedRound: store.encounter.round, turnsPassed: 0 });
    }

    recalculateCombatantStats(c);

    store.logEvent(`Updated ${c.name} AC to ${c.armorClass} (${cover})`, "info");
    store.save();
  }
  closeModal("modal-ac-dialog");
  renderApp();
}

// ------------------------------------------
// 3. EDIT CHARACTER DIALOG (Screenshot 4 & 5)
// ------------------------------------------
function openCharacterModal(partyId = null) {
  store.characterEditTargetId = partyId;
  const isEdit = !!partyId;
  const char = isEdit ? store.party.find(p => p.id === partyId) : null;

  document.getElementById("modal-char-title").textContent = isEdit ? `Edit ${char.name}` : "Add Player Character";
  document.getElementById("modal-char-name").value = char ? char.name : "";
  document.getElementById("modal-char-player").value = char ? (char.playerName || "") : "";
  document.getElementById("modal-char-class").value = char ? char.characterClass : "Fighter";
  document.getElementById("modal-char-level").value = char ? char.level : 1;
  document.getElementById("modal-char-hp").value = char ? char.maxHp : 10;
  document.getElementById("modal-char-ac").value = char ? char.armorClass : 14;
  document.getElementById("modal-char-init").value = char ? char.initiativeModifier : 2;
  document.getElementById("modal-char-speed").value = char ? char.speed : 30;
  document.getElementById("modal-char-perc").value = char ? char.passivePerception : 12;
  document.getElementById("modal-char-dc").value = (char && char.spellDc) ? char.spellDc : "";
  document.getElementById("modal-char-notes").value = char ? (char.notes || "") : "";

  store.characterAbilitiesEditing = char && char.abilities ? JSON.parse(JSON.stringify(char.abilities)) : [];
  renderCharacterAbilitiesList();
  openModal("modal-character-dialog");
}

function renderCharacterAbilitiesList() {
  const container = document.getElementById("modal-char-abilities-list");
  if (!container) return;
  document.getElementById("modal-char-abilities-count").textContent = `(${store.characterAbilitiesEditing.length})`;

  container.innerHTML = store.characterAbilitiesEditing.map((ab, idx) => `
    <div class="ability-edit-card">
      <div class="ability-edit-top-row">
        <input type="text" class="form-input-outlined" style="flex:1;" placeholder="Ability Name" value="${ab.name}" oninput="store.characterAbilitiesEditing[${idx}].name = this.value;">
        <select class="form-input-outlined" style="width: 120px;" onchange="store.characterAbilitiesEditing[${idx}].type = this.value;">
          <option value="Action" ${ab.type === "Action" ? "selected" : ""}>Action</option>
          <option value="Bonus Action" ${ab.type === "Bonus Action" ? "selected" : ""}>Bonus Action</option>
          <option value="Reaction" ${ab.type === "Reaction" ? "selected" : ""}>Reaction</option>
          <option value="Feat / Trait" ${ab.type === "Feat / Trait" ? "selected" : ""}>Feat / Trait</option>
          <option value="Spell" ${ab.type === "Spell" ? "selected" : ""}>Spell</option>
        </select>
        <button class="icon-btn-header crimson" onclick="removeCharacterAbility(${idx})">🗑️</button>
      </div>
      <textarea class="form-input-outlined" rows="2" placeholder="Description / mechanics" oninput="store.characterAbilitiesEditing[${idx}].description = this.value;">${ab.description || ""}</textarea>
    </div>
  `).join("");
}

function addCharacterAbility() {
  store.characterAbilitiesEditing.push({
    id: "ab-" + Date.now(),
    name: "New Feature",
    type: "Action",
    description: ""
  });
  renderCharacterAbilitiesList();
}

function removeCharacterAbility(idx) {
  store.characterAbilitiesEditing.splice(idx, 1);
  renderCharacterAbilitiesList();
}

function rollRandom5eCharacter() {
  const names = ["Vesper Stonefist", "Theron Stormwind", "Eldrin Dawnseeker", "Rowan Blackthorn", "Kaela Sunstrider"];
  const classes = ["Fighter", "Rogue", "Wizard", "Cleric", "Barbarian", "Paladin"];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomClass = classes[Math.floor(Math.random() * classes.length)];

  document.getElementById("modal-char-name").value = randomName;
  document.getElementById("modal-char-class").value = randomClass;
  document.getElementById("modal-char-level").value = 1;
  document.getElementById("modal-char-hp").value = Math.floor(Math.random() * 6) + 10;
  document.getElementById("modal-char-ac").value = Math.floor(Math.random() * 5) + 13;
  document.getElementById("modal-char-init").value = Math.floor(Math.random() * 4) + 1;
  document.getElementById("modal-char-speed").value = 30;
  document.getElementById("modal-char-perc").value = Math.floor(Math.random() * 5) + 10;

  store.characterAbilitiesEditing = [
    { id: "ab-r1", name: "Core Feature", type: "Action", description: "Characteristic class feature or weapon maneuver." }
  ];
  renderCharacterAbilitiesList();
  showToast(`Rolled ${randomName}!`);
}

function saveCharacterDialog() {
  const name = document.getElementById("modal-char-name").value.trim();
  const player = document.getElementById("modal-char-player").value.trim();
  const charClass = document.getElementById("modal-char-class").value.trim();
  const level = parseInt(document.getElementById("modal-char-level").value, 10) || 1;
  const hp = parseInt(document.getElementById("modal-char-hp").value, 10) || 10;
  const ac = parseInt(document.getElementById("modal-char-ac").value, 10) || 10;
  const init = parseInt(document.getElementById("modal-char-init").value, 10) || 0;
  const speed = parseInt(document.getElementById("modal-char-speed").value, 10) || 30;
  const perc = parseInt(document.getElementById("modal-char-perc").value, 10) || 10;
  const dcVal = document.getElementById("modal-char-dc").value.trim();
  const spellDc = dcVal ? parseInt(dcVal, 10) : null;
  const notes = document.getElementById("modal-char-notes").value.trim();

  if (!name) {
    showToast("Name is required");
    return;
  }

  if (store.characterEditTargetId) {
    // Edit existing
    store.party = store.party.map(p => {
      if (p.id === store.characterEditTargetId) {
        return {
          ...p,
          name, playerName: player, characterClass: charClass, level,
          maxHp: hp, currentHp: hp, armorClass: ac, initiativeModifier: init,
          speed, passivePerception: perc, spellDc, notes,
          abilities: store.characterAbilitiesEditing
        };
      }
      return p;
    });

    // Also update in arena if present
    store.encounter.combatants = store.encounter.combatants.map(c => {
      if (c.characterId === store.characterEditTargetId) {
        return {
          ...c,
          name, characterClassOrType: `${charClass} (Lvl ${level})`,
          maxHp: hp, armorClass: ac, baseArmorClass: ac,
          initiativeModifier: init, speed, baseSpeed: speed,
          spellDc, notes, abilities: store.characterAbilitiesEditing
        };
      }
      return c;
    });
    showToast(`Updated ${name}`);
  } else {
    // New
    const newPc = {
      id: "pc-" + Date.now(),
      name, playerName: player, characterClass: charClass, level,
      maxHp: hp, currentHp: hp, tempHp: 0, armorClass: ac, initiativeModifier: init,
      speed, passivePerception: perc, spellDc, notes,
      abilities: store.characterAbilitiesEditing
    };
    store.party.push(newPc);
    showToast(`Created ${name}`);
  }

  store.save();
  closeModal("modal-character-dialog");
  renderApp();
}

// ------------------------------------------
// 4. DAMAGE / HEAL MODAL
// ------------------------------------------
function openDamageHealModal(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;

  document.getElementById("modal-dmg-name").textContent = c.name;
  document.getElementById("modal-dmg-hp").textContent = `${c.currentHp} / ${c.maxHp} HP (Temp: ${c.tempHp || 0})`;
  document.getElementById("modal-dmg-input").value = "";
  openModal("modal-damage-dialog");
}

function submitDamageAction(isHeal) {
  const amt = parseInt(document.getElementById("modal-dmg-input").value, 10);
  if (isNaN(amt) || amt <= 0) {
    showToast("Enter a positive number");
    return;
  }
  if (isHeal) {
    applyHealing(store.activeCombatantId, amt);
  } else {
    applyDamage(store.activeCombatantId, amt);
  }
  closeModal("modal-damage-dialog");
}

function submitTempHpAction() {
  const amt = parseInt(document.getElementById("modal-dmg-input").value, 10);
  if (isNaN(amt) || amt < 0) return;
  const c = store.encounter.combatants.find(x => x.id === store.activeCombatantId);
  if (c) {
    c.tempHp = amt;
    store.logEvent(`${c.name} gained ${amt} Temp HP`, "info");
    store.save();
    renderApp();
  }
  closeModal("modal-damage-dialog");
}

// ------------------------------------------
// 5. CONDITIONS MODAL (With Status Timers & Durations)
// ------------------------------------------
function updateConditionDurationUi() {
  const dur = store.activeConditionDuration || "permanent";
  const rounds = store.activeConditionRounds || 1;

  document.querySelectorAll(".cond-duration-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.dur === dur);
  });

  const labelEl = document.getElementById("cond-timer-rounds-label");
  if (labelEl) {
    if (dur === "permanent") labelEl.textContent = "Permanent";
    else if (dur === "start_next_turn") labelEl.textContent = "Until start of next turn";
    else if (dur === "end_next_turn") labelEl.textContent = "Until end of next turn";
    else if (dur === "end_current_turn") labelEl.textContent = "Until end of current turn";
    else if (dur === "rounds") labelEl.textContent = `${rounds} Round${rounds > 1 ? 's' : ''}`;
  }

  const numEl = document.getElementById("cond-custom-rounds-num");
  if (numEl) numEl.textContent = rounds;
}

function setConditionActiveDuration(dur) {
  store.activeConditionDuration = dur;
  updateConditionDurationUi();
}

function adjustConditionCustomRounds(delta) {
  store.activeConditionRounds = Math.max(1, Math.min(20, (store.activeConditionRounds || 1) + delta));
  store.activeConditionDuration = "rounds";
  updateConditionDurationUi();
}

function openConditionsModal(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;
  recalculateCombatantStats(c);

  document.getElementById("modal-cond-title").textContent = `Conditions: ${c.name}`;
  updateConditionDurationUi();

  const grid = document.getElementById("modal-cond-grid");
  grid.innerHTML = CONDITIONS.map(cond => {
    const existing = (c.conditions || []).find(cn => (typeof cn === 'string' ? cn : cn.id) === cond.id);
    const isChecked = !!existing;
    const info = existing ? getConditionInfo(existing) : null;
    const tag = info && info.timerLabel ? ` <span class="cond-timer-tag" style="color:#38bdf8;">${info.timerLabel}</span>` : "";

    return `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 10px; background:var(--bg-card-darker); border:1px solid ${isChecked ? cond.color : "var(--border-subtle)"}; border-radius:8px; cursor:pointer;">
        <input type="checkbox" ${isChecked ? "checked" : ""} onchange="toggleCombatantCondition('${c.id}', '${cond.id}')">
        <span style="font-size:12px; font-weight:700; color:${isChecked ? cond.color : "var(--text-white)"};">${cond.name}${tag}</span>
      </label>
    `;
  }).join("");

  openModal("modal-conditions-dialog");
}

function toggleCombatantCondition(combatantId, condId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  c.conditions = c.conditions || [];
  c.baseSpeed = c.baseSpeed != null ? c.baseSpeed : (c.speed || 30);
  c.baseArmorClass = c.baseArmorClass != null ? c.baseArmorClass : (c.armorClass || 10);

  const existingIdx = c.conditions.findIndex(cn => (typeof cn === 'string' ? cn : cn.id) === condId);

  if (existingIdx >= 0) {
    // Unchecking / removing condition
    c.conditions.splice(existingIdx, 1);
    store.logEvent(`Removed ${getConditionName(condId)} from ${c.name}`, "info");
  } else {
    // If adding a cover type, remove any other active cover conditions first (mutually exclusive)
    if (["half_cover", "three_quarters_cover", "total_cover"].includes(condId)) {
      c.conditions = c.conditions.filter(cn => {
        const cid = typeof cn === 'string' ? cn : cn.id;
        return !["half_cover", "three_quarters_cover", "total_cover"].includes(cid);
      });
    }

    const dur = store.activeConditionDuration || "permanent";
    const rounds = store.activeConditionRounds || 1;
    c.conditions.push({
      id: condId,
      duration: dur,
      roundsRemaining: dur === "rounds" ? rounds : null,
      appliedRound: store.encounter.round,
      turnsPassed: 0
    });
    store.logEvent(`Applied ${getConditionName(condId)} to ${c.name} (${dur === 'rounds' ? `${rounds} rnds` : dur})`, "info");
  }

  // Recalculate Speed and AC immediately so they are fully linked
  recalculateCombatantStats(c);

  store.save();
  openConditionsModal(combatantId); // refresh checkboxes and tags live in modal
  renderApp();
}

// ------------------------------------------
// 6. SINGLE INITIATIVE MODAL
// ------------------------------------------
function openInitModal(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;

  document.getElementById("modal-init-name").textContent = c.name;
  document.getElementById("modal-init-val").value = c.initiativeRoll;
  openModal("modal-init-dialog");
}

function saveSingleInit() {
  const c = store.encounter.combatants.find(x => x.id === store.activeCombatantId);
  if (c) {
    const score = parseInt(document.getElementById("modal-init-val").value, 10);
    if (!isNaN(score)) {
      c.initiativeRoll = score;
      if (store.encounter.isCombatStarted) {
        store.encounter.combatants = sortCombatants(store.encounter.combatants);
      }
      store.save();
      renderApp();
    }
  }
  closeModal("modal-init-dialog");
}

function rollSingleInit() {
  const c = store.encounter.combatants.find(x => x.id === store.activeCombatantId);
  if (c) {
    document.getElementById("modal-init-val").value = rollD20() + c.initiativeModifier;
  }
}

// ------------------------------------------
// 7. PARTY INITIATIVES BATCH MODAL
// ------------------------------------------
function openPartyInitiativesModal() {
  const pcs = store.encounter.combatants.filter(c => c.isPlayer);
  if (pcs.length === 0) {
    showToast("No party members in combat");
    return;
  }
  const list = document.getElementById("modal-party-init-items");
  list.innerHTML = pcs.map(c => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--border-subtle);">
      <div>
        <strong style="color:#fff; font-size:14px;">${c.name}</strong>
        <div style="font-size:11px; color:var(--text-muted);">Modifier: +${c.initiativeModifier}</div>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <input type="number" class="stepper-value-box party-init-input" data-id="${c.id}" value="${c.initiativeRoll}" style="width:60px; height:38px; font-size:16px;">
        <button class="btn-prev-turn" style="height:38px; padding:0 12px; border-radius:8px;" onclick="this.previousElementSibling.value = rollD20() + ${c.initiativeModifier};">Roll</button>
      </div>
    </div>
  `).join("");

  openModal("modal-party-inits-dialog");
}

function savePartyInits() {
  document.querySelectorAll(".party-init-input").forEach(inp => {
    const id = inp.dataset.id;
    const val = parseInt(inp.value, 10);
    if (!isNaN(val)) {
      const c = store.encounter.combatants.find(x => x.id === id);
      if (c) c.initiativeRoll = val;
    }
  });

  if (store.encounter.isCombatStarted) {
    store.encounter.combatants = sortCombatants(store.encounter.combatants);
  }
  store.save();
  closeModal("modal-party-inits-dialog");
  renderApp();
  showToast("Party initiatives applied!");
}

function rollAllPartyInits() {
  document.querySelectorAll(".party-init-input").forEach(inp => {
    const id = inp.dataset.id;
    const c = store.encounter.combatants.find(x => x.id === id);
    if (c) inp.value = rollD20() + c.initiativeModifier;
  });
}

// ------------------------------------------
// 8. ADD ENEMY MODAL
// ------------------------------------------
function openAddEnemyModal() {
  document.getElementById("modal-enemy-name").value = "";
  document.getElementById("modal-enemy-hp").value = 11;
  document.getElementById("modal-enemy-ac").value = 12;
  document.getElementById("modal-enemy-init").value = 1;
  document.getElementById("modal-enemy-speed").value = 30;
  document.getElementById("modal-enemy-notes").value = "";
  openModal("modal-enemy-dialog");
}

function saveCustomEnemy() {
  const name = document.getElementById("modal-enemy-name").value.trim() || "Goblin";
  const hp = parseInt(document.getElementById("modal-enemy-hp").value, 10) || 10;
  const ac = parseInt(document.getElementById("modal-enemy-ac").value, 10) || 12;
  const initMod = parseInt(document.getElementById("modal-enemy-init").value, 10) || 0;
  const speed = parseInt(document.getElementById("modal-enemy-speed").value, 10) || 30;
  const notes = document.getElementById("modal-enemy-notes").value.trim();

  store.encounter.combatants.push({
    id: "enemy-" + Date.now(),
    name: name,
    isPlayer: false,
    characterClassOrType: "Enemy",
    maxHp: hp,
    currentHp: hp,
    tempHp: 0,
    armorClass: ac,
    baseArmorClass: ac,
    coverType: "NONE",
    initiativeModifier: initMod,
    initiativeRoll: rollD20() + initMod,
    speed: speed,
    baseSpeed: speed,
    isDifficultTerrain: false,
    spellDc: null,
    notes: notes,
    abilities: [],
    conditions: [],
    deathSavesSuccess: 0,
    deathSavesFailure: 0,
    isStabilized: false,
    isDead: false
  });

  store.encounter.combatants = sortCombatants(store.encounter.combatants);
  store.logEvent(`Added ${name} to combat`, "info");
  store.save();
  closeModal("modal-enemy-dialog");
  renderApp();
  showToast(`Added ${name}!`);
}

// ------------------------------------------
// BESTIARY HANDLERS (Multi-select, Quantities, Sorting, Spawning)
// ------------------------------------------
function setBestiarySearch(q) {
  store.bestiarySearchQuery = q;
  renderApp();
}

function setBestiaryTypeFilter(t) {
  store.bestiarySelectedType = t;
  renderApp();
}

function setBestiarySort(s) {
  store.bestiarySortBy = s;
  renderApp();
}

function adjustBestiaryQuantity(name, delta) {
  store.bestiaryQuantities = store.bestiaryQuantities || {};
  store.bestiaryQuantities[name] = Math.max(1, Math.min(50, (store.bestiaryQuantities[name] || 1) + delta));
  renderApp();
}

function toggleBestiaryMonsterSelected(name) {
  store.bestiarySelectedMonsters = store.bestiarySelectedMonsters || {};
  store.bestiarySelectedMonsters[name] = !store.bestiarySelectedMonsters[name];
  renderApp();
}

function clearBestiarySelections() {
  store.bestiarySelectedMonsters = {};
  renderApp();
}

function spawnMonsterWithQty(monsterName, qty = 1) {
  const m = findMonsterByName(monsterName);
  if (!m) return;
  const count = Math.max(1, parseInt(qty, 10) || 1);

  // Determine existing count in encounter to number uniquely
  const existingCount = store.encounter.combatants.filter(c => c.name.startsWith(m.name)).length;

  for (let i = 0; i < count; i++) {
    const num = existingCount + i + 1;
    const displayName = (count > 1 || existingCount > 0) ? `${m.name} #${num}` : m.name;
    const initRoll = rollD20() + m.initMod;

    store.encounter.combatants.push({
      id: "enemy-" + Date.now() + "-" + i,
      name: displayName,
      isPlayer: false,
      characterClassOrType: `${m.type} (${m.cr})`,
      maxHp: m.maxHp,
      currentHp: m.maxHp,
      tempHp: 0,
      armorClass: m.ac,
      baseArmorClass: m.ac,
      coverType: "NONE",
      initiativeModifier: m.initMod,
      initiativeRoll: initRoll,
      speed: m.speed,
      baseSpeed: m.speed,
      isDifficultTerrain: false,
      spellDc: m.spellDc,
      notes: m.notes,
      abilities: [],
      conditions: [],
      deathSavesSuccess: 0,
      deathSavesFailure: 0,
      isStabilized: false,
      isDead: false
    });
  }

  if (store.encounter.isCombatStarted) {
    store.encounter.combatants = sortCombatants(store.encounter.combatants);
  }
  store.logEvent(`Deployed ${count}x ${m.name} to combat`, "info");
  store.save();
  renderApp();
  showToast(`Deployed ${count}x ${m.name} to combat!`);
}

// ------------------------------------------
// CUSTOM MONSTER LIBRARY HANDLERS
// ------------------------------------------
function openCreateCustomMonsterModal(monsterId = null) {
  const isEdit = !!monsterId;
  const existing = isEdit ? (store.customMonsters || []).find(m => m.id === monsterId) : null;

  const titleEl = document.getElementById("modal-cm-title");
  if (titleEl) titleEl.textContent = isEdit ? `Edit ${existing.name}` : "Create Custom Monster";

  const idEl = document.getElementById("modal-cm-id");
  if (idEl) idEl.value = isEdit ? existing.id : "";

  const nameEl = document.getElementById("modal-cm-name");
  if (nameEl) nameEl.value = existing ? existing.name : "";

  const typeEl = document.getElementById("modal-cm-type");
  if (typeEl) typeEl.value = existing ? existing.type : "Humanoid";

  const crEl = document.getElementById("modal-cm-cr");
  if (crEl) crEl.value = existing ? existing.cr : "CR 1";

  const hpEl = document.getElementById("modal-cm-hp");
  if (hpEl) hpEl.value = existing ? existing.maxHp : 22;

  const acEl = document.getElementById("modal-cm-ac");
  if (acEl) acEl.value = existing ? existing.ac : 13;

  const initEl = document.getElementById("modal-cm-init");
  if (initEl) initEl.value = existing ? existing.initMod : 1;

  const spdEl = document.getElementById("modal-cm-speed");
  if (spdEl) spdEl.value = existing ? existing.speed : 30;

  const percEl = document.getElementById("modal-cm-perc");
  if (percEl) percEl.value = existing ? existing.perception : 11;

  const dcEl = document.getElementById("modal-cm-dc");
  if (dcEl) dcEl.value = (existing && existing.spellDc != null) ? existing.spellDc : "";

  const notesEl = document.getElementById("modal-cm-notes");
  if (notesEl) notesEl.value = existing ? (existing.notes || "") : "";

  openModal("modal-custom-monster-dialog");
}

function saveCustomMonsterToLibrary() {
  const id = document.getElementById("modal-cm-id").value;
  const name = document.getElementById("modal-cm-name").value.trim();
  if (!name) {
    showToast("Please enter a monster name");
    return;
  }
  const type = document.getElementById("modal-cm-type").value;
  const cr = document.getElementById("modal-cm-cr").value;
  const hp = parseInt(document.getElementById("modal-cm-hp").value, 10) || 10;
  const ac = parseInt(document.getElementById("modal-cm-ac").value, 10) || 10;
  const initMod = parseInt(document.getElementById("modal-cm-init").value, 10) || 0;
  const speed = parseInt(document.getElementById("modal-cm-speed").value, 10) || 30;
  const perc = parseInt(document.getElementById("modal-cm-perc").value, 10) || 10;
  const dcRaw = document.getElementById("modal-cm-dc").value.trim();
  const spellDc = dcRaw ? parseInt(dcRaw, 10) : null;
  const notes = document.getElementById("modal-cm-notes").value.trim();

  store.customMonsters = store.customMonsters || [];

  if (id) {
    // Edit existing
    store.customMonsters = store.customMonsters.map(m => {
      if (m.id === id) {
        return { ...m, name, type, cr, maxHp: hp, ac, initMod, speed, perception: perc, spellDc, notes, isCustom: true };
      }
      return m;
    });
    showToast(`Updated ${name} in Bestiary!`);
  } else {
    // Add new
    const newMonster = {
      id: "cm-" + Date.now(),
      name,
      type,
      cr,
      maxHp: hp,
      ac,
      initMod,
      speed,
      perception: perc,
      spellDc,
      notes,
      isCustom: true
    };
    store.customMonsters.unshift(newMonster);
    showToast(`Added ${name} to Bestiary Library!`);
  }

  store.save();
  closeModal("modal-custom-monster-dialog");
  renderApp();
}

function deleteCustomMonster(id) {
  const monster = (store.customMonsters || []).find(m => m.id === id);
  if (!monster) return;
  const name = monster.name;

  store.customMonsters = (store.customMonsters || []).filter(m => m.id !== id);
  if (store.bestiarySelectedMonsters) {
    delete store.bestiarySelectedMonsters[name];
  }
  store.save();
  renderApp();
  showToast(`Deleted ${name} from library`);
}

function deploySelectedBestiaryMonsters() {
  const selectedNames = Object.keys(store.bestiarySelectedMonsters || {}).filter(k => store.bestiarySelectedMonsters[k]);
  if (selectedNames.length === 0) {
    showToast("No monsters selected");
    return;
  }

  let totalDeployed = 0;
  selectedNames.forEach(name => {
    const qty = (store.bestiaryQuantities && store.bestiaryQuantities[name]) || 1;
    spawnMonsterWithQty(name, qty);
    totalDeployed += qty;
  });

  store.bestiarySelectedMonsters = {};
  store.currentTab = "combat";
  store.save();
  renderApp();
  showToast(`Deployed ${totalDeployed} foes to Combat Arena!`);
}

// ------------------------------------------
// CUSTOM DICE PRESETS HANDLERS
// ------------------------------------------
function openCustomPresetModal(prefillFormula = "") {
  document.getElementById("modal-preset-name").value = "";
  document.getElementById("modal-preset-formula").value = prefillFormula || "";
  openModal("modal-preset-dialog");
}

function saveCustomDicePreset() {
  const name = document.getElementById("modal-preset-name").value.trim();
  const formula = document.getElementById("modal-preset-formula").value.trim();

  if (!name) {
    showToast("Preset name is required");
    return;
  }
  if (!formula) {
    showToast("Dice formula is required");
    return;
  }

  store.customDicePresets = store.customDicePresets || [];
  store.customDicePresets.push({
    id: "preset-" + Date.now(),
    name: name,
    formula: formula,
    isDefault: false
  });

  store.save();
  closeModal("modal-preset-dialog");
  renderApp();
  showToast(`Saved preset "${name}"!`);
}

function deleteCustomDicePreset(id) {
  store.customDicePresets = (store.customDicePresets || []).filter(p => p.id !== id);
  store.save();
  renderApp();
  showToast("Preset deleted");
}

function rollCustomDicePreset(id) {
  const preset = (store.customDicePresets || []).find(p => p.id === id);
  if (!preset) return;
  executeDiceFormula(preset.formula, preset.name);
}

function executeDiceFormula(formula, label = "Custom Roll") {
  const lower = formula.toLowerCase();
  if (lower.includes("drop lowest") && lower.includes("4d6")) {
    quickRollPreset("stats_4d6");
    return;
  }
  if (lower.includes("adv") && lower.includes("d20")) {
    quickRollPreset("d20_adv");
    return;
  }

  const tokens = formula.replace(/\s+/g, "").match(/([+-]?[0-9]*d[0-9]+|[+-]?[0-9]+)/gi);
  if (!tokens || tokens.length === 0) {
    showToast("Invalid formula");
    return;
  }

  let total = 0;
  let rolls = [];
  let modifier = 0;
  let calculationParts = [];

  tokens.forEach(tok => {
    if (tok.toLowerCase().includes("d")) {
      const parts = tok.toLowerCase().split("d");
      const sign = parts[0].startsWith("-") ? -1 : 1;
      const countStr = parts[0].replace(/[+-]/g, "");
      const count = countStr ? parseInt(countStr, 10) : 1;
      const sides = parseInt(parts[1], 10) || 6;

      let subTotal = 0;
      let dieRolls = [];
      for (let i = 0; i < count; i++) {
        const val = Math.floor(Math.random() * sides) + 1;
        dieRolls.push(val);
        rolls.push({ value: val, label: `d${sides}` });
        subTotal += val;
      }
      total += sign * subTotal;
      calculationParts.push(`${count}d${sides} [${dieRolls.join(", ")}]`);
    } else {
      const modVal = parseInt(tok, 10);
      if (!isNaN(modVal)) {
        modifier += modVal;
        total += modVal;
      }
    }
  });

  const isNat20 = rolls.length === 1 && rolls[0].label === "d20" && rolls[0].value === 20;
  const isNat1 = rolls.length === 1 && rolls[0].label === "d20" && rolls[0].value === 1;

  if (modifier !== 0) {
    calculationParts.push(modifier > 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`);
  }

  const rollResult = {
    formula: `${label} (${formula})`,
    total: total,
    rolls: rolls,
    modifier: modifier,
    isNat20: isNat20,
    isNat1: isNat1,
    calculation: calculationParts.join(" ") + ` = ${total}`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  };

  store.lastRoll = rollResult;
  store.diceHistory.unshift(rollResult);
  if (store.diceHistory.length > 50) store.diceHistory.pop();
  store.save();
  renderApp();
  showToast(`Rolled ${label}: ${total}!`);
}

// ------------------------------------------
// 9. LOG MODAL
// ------------------------------------------
function openLogModal() {
  const list = document.getElementById("modal-log-items");
  list.innerHTML = store.encounter.log.map(item => `
    <div style="padding:6px 8px; background:var(--bg-card-darker); border-radius:6px; font-size:12px; border-left:3px solid ${item.type === 'turn' ? 'var(--color-gold)' : item.type === 'damage' ? '#ef4444' : item.type === 'heal' ? '#10b981' : 'var(--border-card)'};">
      <span style="color:var(--text-subtle); font-size:11px;">[R${item.round} ${item.time}]</span> ${item.text}
    </div>
  `).join("") || "<span style='color:var(--text-muted);'>No log entries yet.</span>";
  openModal("modal-log-dialog");
}

// ==========================================
// APP INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Bottom Navigation tabs click
  document.querySelectorAll(".nav-tab-item").forEach(item => {
    item.addEventListener("click", () => {
      store.currentTab = item.dataset.tab;
      renderApp();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Modal Backdrop click to close
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("open");
      }
    });
  });

  // Initial render
  renderApp();
});
