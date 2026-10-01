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
  { name: "Lich", cr: "CR 21", type: "Undead", maxHp: 135, ac: 17, initMod: 3, speed: 30, perception: 19, spellDc: 20, notes: "Legendary Actions, Power Word Kill, Disrupt Life" }
];

const CONDITIONS = [
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

function startCombat() {
  if (store.encounter.combatants.length === 0) {
    showToast("Add combatants to start combat");
    return;
  }
  // Auto-roll monsters initiative
  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (!c.isPlayer) {
      return { ...c, initiativeRoll: rollD20() + c.initiativeModifier };
    }
    return c;
  });
  store.encounter.combatants = sortCombatants(store.encounter.combatants);
  store.encounter.round = 1;
  store.encounter.currentTurnIndex = 0;
  store.encounter.isCombatStarted = true;

  const actor = store.encounter.combatants[0]?.name || "";
  store.logEvent(`⚔️ Combat Started! Round 1 begins. ${actor}'s turn.`, "turn");
  store.save();
  renderApp();
  showToast("⚔️ Combat Started!");
}

function nextTurn() {
  const total = store.encounter.combatants.length;
  if (total === 0) return;
  let nextIdx = store.encounter.currentTurnIndex;
  let nextRound = store.encounter.round;
  let attempts = 0;

  do {
    nextIdx++;
    if (nextIdx >= total) {
      nextIdx = 0;
      nextRound++;
      store.logEvent(`🛡️ Round ${nextRound} begins!`, "turn");
    }
    attempts++;
  } while (store.encounter.combatants[nextIdx]?.isDead && attempts < total);

  store.encounter.currentTurnIndex = nextIdx;
  store.encounter.round = nextRound;

  const actor = store.encounter.combatants[nextIdx];
  if (actor && !actor.isDead) {
    store.logEvent(`Turn passed to ${actor.name}`, "turn");
  }
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

function endCombat() {
  store.encounter.isCombatStarted = false;
  store.logEvent("🏁 Combat ended.", "info");
  store.save();
  renderApp();
  showToast("Combat ended");
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

    const afterHp = Math.max(0, c.currentHp - damageRemaining);
    finalHp = afterHp;
    let conditions = [...(c.conditions || [])];

    return {
      ...c,
      currentHp: afterHp,
      tempHp: currentTemp,
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
    return {
      ...c,
      currentHp: healed
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

  // Update Bottom Nav active state
  document.querySelectorAll(".nav-tab-item").forEach(item => {
    item.classList.toggle("active", item.dataset.tab === store.currentTab);
  });
}

// ------------------------------------------
// COMBAT SCREEN (Screenshots 1 & 6)
// ------------------------------------------
function renderCombatScreen() {
  const enc = store.encounter;
  const combatants = enc.combatants;
  const active = combatants[enc.currentTurnIndex] || null;
  const onDeck = combatants.length > 1 ? combatants[(enc.currentTurnIndex + 1) % combatants.length] : null;

  const playerCount = combatants.filter(c => c.isPlayer).length;
  const enemyCount = combatants.filter(c => !c.isPlayer).length;

  return `
    <!-- Top Header Card (Screenshot: Round 1, 2 PCs • 2 Foes, Dice, Clock, Add) -->
    <div class="arena-header-card">
      <div class="arena-header-top-row">
        <div style="display: flex; align-items: center;">
          <div class="round-indicator-pill">
            <span>⚔️</span>
            <span>Round ${enc.round}</span>
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
        <button class="btn-stop-combat" onclick="endCombat()" title="End Combat">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
        </button>
      </div>
    </div>

    <!-- CURRENT TURN SPOTLIGHT CARD (Screenshot 1 & 6) -->
    ${active ? `
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
            <span class="hp-current-num ${active.currentHp <= 3 ? "red" : active.currentHp <= 6 ? "low" : ""}">${active.currentHp}</span>
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
          <div class="unified-hp-fill ${active.currentHp <= 3 ? "red" : active.currentHp <= 6 ? "amber" : ""}" style="width: ${Math.min(100, Math.max(0, (active.currentHp / (active.maxHp || 1)) * 100))}%;"></div>
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
              <span class="action-economy-desc">${active.speed}ft Speed (Walk, climb, swim)</span>
            </div>
          </div>
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
                <span class="hp-current-num ${c.currentHp <= 3 ? "red" : c.currentHp <= 6 ? "low" : ""}">${c.currentHp}</span>
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
              <div class="unified-hp-fill ${c.currentHp <= 3 ? "red" : c.currentHp <= 6 ? "amber" : ""}" style="width: ${hpPercent}%;"></div>
              ${c.tempHp > 0 ? `
                <div class="unified-hp-temp" style="width: ${Math.min(100, (c.tempHp / (c.maxHp || 1)) * 100)}%;"></div>
              ` : ""}
            </div>

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
              ${(c.conditions || []).filter(cn => cn !== "half_cover" && cn !== "three_quarters_cover" && cn !== "total_cover" && cn !== "difficult_terrain").map(cn => {
                const condObj = CONDITIONS.find(x => x.id === cn);
                return condObj ? `<span class="pill-cover-badge" style="border-color:${condObj.color};" onclick="openConditionsModal('${c.id}')">${condObj.name}</span>` : "";
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
  `;
}

// ------------------------------------------
// PARTY ROSTER SCREEN (Screenshot 4 & 5)
// ------------------------------------------
function renderPartyScreen() {
  const party = store.party;

  return `
    <div style="padding: 12px 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <h2 style="font-size: 18px; font-weight: 800; color: var(--color-gold);">PARTY ROSTER</h2>
          <span style="font-size: 12px; color: var(--text-muted);">Persistent heroes saved for repeated encounters (${party.length})</span>
        </div>
        <button class="btn-dialog-save" style="padding: 8px 16px; font-size: 13px;" onclick="addAllPartyToEncounter()">
          Send All ➔
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
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

      <button class="btn-next-turn" style="width: 100%; margin-top: 14px;" onclick="openCharacterModal(null)">
        + Add New Player Character
      </button>
    </div>
  `;
}

// ------------------------------------------
// BESTIARY SCREEN
// ------------------------------------------
function renderBestiaryScreen() {
  return `
    <div style="padding: 12px 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 style="font-size: 18px; font-weight: 800; color: var(--color-gold);">BESTIARY (SRD)</h2>
        <button class="btn-dialog-save" style="padding: 6px 14px; font-size: 12px;" onclick="openAddEnemyModal()">
          + Custom Monster
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${MONSTER_PRESETS.map(m => `
          <div class="combatant-list-card" style="margin: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 16px; font-weight: 800; color: #fff;">${m.name}</span>
                <div style="font-size: 12px; color: var(--text-muted);">${m.cr} &bull; ${m.type}</div>
              </div>
              <button class="btn-prev-turn" style="height: 34px; padding: 0 12px; border-radius: 8px;" onclick="spawnMonster('${m.name}')">
                + Spawn
              </button>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 6px;">
              <span class="pill-shield-ac">AC ${m.ac}</span>
              <span class="pill-boot-speed">${m.maxHp} HP</span>
              <span class="pill-shield-ac" style="color:#fcd34d;">Init +${m.initMod}</span>
              <span class="pill-boot-speed">${m.speed}ft</span>
            </div>
            ${m.notes ? `<div class="scroll-note-snippet" style="margin-top:6px;"><span>⚔️</span> <span>${m.notes}</span></div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// ------------------------------------------
// DICE & RULES SCREEN
// ------------------------------------------
function renderDiceScreen() {
  const last = store.lastRoll;

  return `
    <div style="padding: 12px 14px; display: flex; flex-direction: column; gap: 12px;">
      <h2 style="font-size: 18px; font-weight: 800; color: var(--color-gold);">DICE & 5E RULES</h2>

      <!-- Dice Roller -->
      <div class="dialog-inner-card">
        <span class="dialog-inner-title">Polyhedral Dice</span>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin: 8px 0;">
          <button class="btn-stepper" style="width: 100%; height: 44px; font-size: 14px;" onclick="rollDieDirect(4)">d4</button>
          <button class="btn-stepper" style="width: 100%; height: 44px; font-size: 14px;" onclick="rollDieDirect(6)">d6</button>
          <button class="btn-stepper" style="width: 100%; height: 44px; font-size: 14px;" onclick="rollDieDirect(8)">d8</button>
          <button class="btn-stepper" style="width: 100%; height: 44px; font-size: 14px;" onclick="rollDieDirect(10)">d10</button>
          <button class="btn-stepper" style="width: 100%; height: 44px; font-size: 14px;" onclick="rollDieDirect(12)">d12</button>
          <button class="btn-stepper" style="width: 100%; height: 44px; font-size: 14px; border-color: var(--color-gold); color: var(--color-gold-light);" onclick="rollDieDirect(20)">d20</button>
          <button class="btn-stepper" style="width: 100%; height: 44px; font-size: 13px;" onclick="rollDieDirect(100)">%</button>
        </div>

        ${last ? `
          <div class="effective-highlight-banner" style="justify-content: center; flex-direction: column; padding: 14px;">
            <span style="font-size: 32px; font-weight: 900; color: ${last.isNat20 ? "#34d399" : last.isNat1 ? "#ef4444" : "var(--color-gold-light)"};">
              ${last.total}
            </span>
            <span style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
              ${last.dice} Roll ${last.isNat20 ? "🌟 NATURAL 20!" : last.isNat1 ? "💀 NATURAL 1 FUMBLE" : ""}
            </span>
          </div>
        ` : ""}
      </div>

      <!-- Conditions Reference -->
      <div class="dialog-inner-card">
        <span class="dialog-inner-title">5e Conditions Guide</span>
        <div style="display: flex; flex-direction: column; gap: 6px; max-height: 380px; overflow-y: auto; margin-top: 6px;">
          ${CONDITIONS.map(cond => `
            <div style="background: var(--bg-card-darker); border-left: 3px solid ${cond.color}; border-radius: 6px; padding: 6px 10px;">
              <strong style="color: ${cond.color}; font-size: 12px;">${cond.name}</strong>
              <p style="font-size: 11px; color: var(--text-muted); line-height: 1.3; margin-top: 2px;">${cond.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function rollDieDirect(sides) {
  const result = rollDie(sides);
  store.lastRoll = {
    dice: `1d${sides}`,
    total: result,
    isNat20: sides === 20 && result === 20,
    isNat1: sides === 20 && result === 1
  };
  renderApp();
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
  store.dialogSpeedBase = c.baseSpeed || c.speed || 30;
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
    const effective = isDiff ? Math.floor(base / 2) : base;

    let conditions = (c.conditions || []).filter(cn => cn !== "difficult_terrain");
    if (isDiff) conditions.push("difficult_terrain");

    c.baseSpeed = base;
    c.speed = effective;
    c.isDifficultTerrain = isDiff;
    c.conditions = conditions;

    store.logEvent(`Updated ${c.name} Speed to ${effective}ft ${isDiff ? "(Difficult Terrain)" : ""}`, "info");
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
  store.dialogAcBase = c.baseArmorClass || c.armorClass || 10;
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
    const bonus = cover === "HALF" ? 2 : cover === "THREE_QUARTERS" ? 5 : cover === "TOTAL" ? 10 : 0;
    const effective = base + bonus;

    let conditions = (c.conditions || []).filter(cn => !["half_cover", "three_quarters_cover", "total_cover"].includes(cn));
    if (cover === "HALF") conditions.push("half_cover");
    if (cover === "THREE_QUARTERS") conditions.push("three_quarters_cover");
    if (cover === "TOTAL") conditions.push("total_cover");

    c.baseArmorClass = base;
    c.armorClass = effective;
    c.coverType = cover;
    c.conditions = conditions;

    store.logEvent(`Updated ${c.name} AC to ${effective} (${cover})`, "info");
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
// 5. CONDITIONS MODAL
// ------------------------------------------
function openConditionsModal(combatantId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;

  document.getElementById("modal-cond-title").textContent = `Conditions: ${c.name}`;
  const grid = document.getElementById("modal-cond-grid");
  grid.innerHTML = CONDITIONS.map(cond => {
    const isChecked = (c.conditions || []).includes(cond.id);
    return `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 10px; background:var(--bg-card-darker); border:1px solid ${isChecked ? cond.color : "var(--border-subtle)"}; border-radius:8px; cursor:pointer;">
        <input type="checkbox" ${isChecked ? "checked" : ""} onchange="toggleCombatantCondition('${c.id}', '${cond.id}')">
        <span style="font-size:12px; font-weight:700; color:${isChecked ? cond.color : "var(--text-white)"};">${cond.name}</span>
      </label>
    `;
  }).join("");

  openModal("modal-conditions-dialog");
}

function toggleCombatantCondition(combatantId, condId) {
  const c = store.encounter.combatants.find(x => x.id === combatantId);
  if (!c) return;
  const conds = c.conditions || [];
  c.conditions = conds.includes(condId) ? conds.filter(x => x !== condId) : [...conds, condId];
  store.save();
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
