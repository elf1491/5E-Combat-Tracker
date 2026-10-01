/**
 * D&D 5e Combat Tracker - Complete Web Application Engine
 * Supports Responsive Desktop, Tablet, and Mobile layouts
 */

// ==========================================
// CONSTANTS & GAME DATA
// ==========================================

const MONSTER_PRESETS = [
  { name: "Bandit", cr: "CR 1/8", type: "Humanoid", maxHp: 11, ac: 12, initMod: 1, speed: 30, perception: 10, spellDc: null, notes: "Scimitar +3 (1d6+1), Light Crossbow +3 (1d8+1)" },
  { name: "Cultist", cr: "CR 1/8", type: "Humanoid", maxHp: 9, ac: 12, initMod: 1, speed: 30, perception: 10, spellDc: null, notes: "Dark Devotion (advantage vs charm/frightened), Scimitar +3 (1d6+1)" },
  { name: "Goblin", cr: "CR 1/4", type: "Humanoid", maxHp: 7, ac: 15, initMod: 2, speed: 30, perception: 9, spellDc: null, notes: "Nimble Escape: Disengage or Hide as bonus action. Scimitar +4 (1d6+2)" },
  { name: "Skeleton", cr: "CR 1/4", type: "Undead", maxHp: 13, ac: 13, initMod: 2, speed: 30, perception: 9, spellDc: null, notes: "Vulnerable to bludgeoning, immune to poison. Shortsword +4 (1d6+2)" },
  { name: "Zombie", cr: "CR 1/4", type: "Undead", maxHp: 22, ac: 8, initMod: -2, speed: 20, perception: 8, spellDc: null, notes: "Undead Fortitude (DC 5+dmg Con save to drop to 1 HP instead of 0)" },
  { name: "Wolf", cr: "CR 1/4", type: "Beast", maxHp: 11, ac: 13, initMod: 2, speed: 40, perception: 13, spellDc: null, notes: "Pack Tactics (advantage if ally within 5ft). Bite +4 (2d4+2, DC 11 Str or prone)" },
  { name: "Orc", cr: "CR 1/2", type: "Humanoid", maxHp: 15, ac: 13, initMod: 1, speed: 30, perception: 10, spellDc: null, notes: "Aggressive: Bonus action move up to speed toward enemy. Greataxe +5 (1d12+3)" },
  { name: "Hobgoblin", cr: "CR 1/2", type: "Humanoid", maxHp: 11, ac: 18, initMod: 1, speed: 30, perception: 10, spellDc: null, notes: "Martial Advantage (+2d6 damage if ally within 5ft). Longsword +3 (1d8+1)" },
  { name: "Bugbear", cr: "CR 1", type: "Humanoid", maxHp: 27, ac: 16, initMod: 2, speed: 30, perception: 10, spellDc: null, notes: "Surprise Attack (+2d6), Brute (+1 die melee damage). Morningstar +4 (2d8+2)" },
  { name: "Ghoul", cr: "CR 1", type: "Undead", maxHp: 22, ac: 12, initMod: 2, speed: 30, perception: 10, spellDc: null, notes: "Claws: DC 10 Con save or paralyzed for 1 min. Immune to poison/charm" },
  { name: "Bandit Captain", cr: "CR 2", type: "Humanoid", maxHp: 65, ac: 15, initMod: 3, speed: 30, perception: 14, spellDc: null, notes: "Multiattack (3 melee), Parry reaction (+2 AC vs one melee attack)" },
  { name: "Cult Fanatic", cr: "CR 2", type: "Humanoid", maxHp: 33, ac: 13, initMod: 2, speed: 30, perception: 11, spellDc: 11, notes: "Spellcaster (DC 11): Hold Person, Spiritual Weapon, Inflict Wounds (3d10)" },
  { name: "Ogre", cr: "CR 2", type: "Giant", maxHp: 59, ac: 11, initMod: -1, speed: 40, perception: 8, spellDc: null, notes: "Greatclub +6 (2d8+4), Javelin +6 (2d6+4)" },
  { name: "Wight", cr: "CR 3", type: "Undead", maxHp: 45, ac: 14, initMod: 2, speed: 30, perception: 13, spellDc: null, notes: "Life Drain (reduces target max HP on DC 13 Con save). Longsword +4 (1d8+2)" },
  { name: "Troll", cr: "CR 5", type: "Giant", maxHp: 84, ac: 15, initMod: 1, speed: 30, perception: 12, spellDc: null, notes: "Regeneration (regains 10 HP at start of turn unless taking fire or acid)" },
  { name: "Vampire Spawn", cr: "CR 5", type: "Undead", maxHp: 82, ac: 15, initMod: 3, speed: 30, perception: 13, spellDc: null, notes: "Regeneration 10 HP, Spider Climb, Bite +6 (reduces max HP by necrotic damage)" },
  { name: "Mage", cr: "CR 6", type: "Humanoid", maxHp: 40, ac: 15, initMod: 2, speed: 30, perception: 11, spellDc: 14, notes: "Spellcaster (DC 14): Fireball (8d6), Greater Invisibility, Shield (+5 AC), Cone of Cold" },
  { name: "Young Red Dragon", cr: "CR 10", type: "Dragon", maxHp: 178, ac: 18, initMod: 0, speed: 40, perception: 18, spellDc: 17, notes: "Fire Breath (16d6 fire, DC 17 Dex for half), Multiattack (Bite +10, 2 Claws +10), Fly 80ft" },
  { name: "Beholder", cr: "CR 13", type: "Aberration", maxHp: 180, ac: 18, initMod: 2, speed: 20, perception: 22, spellDc: 16, notes: "Antimagic Cone (150ft), 3 random Eye Rays per turn (DC 16: Disintegration, Death, Charm, Paralysis)" },
  { name: "Lich", cr: "CR 21", type: "Undead", maxHp: 135, ac: 17, initMod: 3, speed: 30, perception: 19, spellDc: 20, notes: "Legendary Actions, Power Word Kill, Disrupt Life (6d6 necrotic), Globe of Invulnerability" }
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
  { id: "unconscious", name: "Unconscious", color: "#991B1B", desc: "Incapacitated, can't move/speak, unaware. Drops held items, falls prone. Auto-fails Str/Dex saves. Attacks have advantage, 5ft hits are crits." },
  { id: "dead", name: "Dead", color: "#475569", desc: "Character has died. Skipped in combat turn order until revived." },
  { id: "blessed", name: "Blessed", color: "#FACC15", desc: "Add 1d4 to attack rolls and saving throws." },
  { id: "bane", name: "Bane", color: "#7C3AED", desc: "Subtract 1d4 from attack rolls and saving throws." },
  { id: "difficult_terrain", name: "Difficult Terrain", color: "#D97706", desc: "Moving through difficult terrain costs 1 extra foot per foot moved (halves speed)." },
  { id: "half_cover", name: "Half Cover", color: "#3B82F6", desc: "+2 bonus to AC and Dexterity saving throws." },
  { id: "three_quarters_cover", name: "3/4 Cover", color: "#6366F1", desc: "+5 bonus to AC and Dexterity saving throws." },
  { id: "total_cover", name: "Total Cover", color: "#8B5CF6", desc: "Completely concealed by an obstacle. Can't be targeted directly by attacks or spells." }
];

const DEFAULT_PARTY = [
  { id: "pc-1", name: "Thorin Stonehammer", playerName: "Alex", characterClass: "Fighter (Battle Master)", level: 5, maxHp: 44, currentHp: 44, tempHp: 0, armorClass: 18, initiativeModifier: 1, passivePerception: 12, speed: 30, spellDc: null, notes: "Action Surge, Second Wind, Maneuvers: Riposte, Precision Attack", color: "#3B82F6" },
  { id: "pc-2", name: "Lyra Moonwhisper", playerName: "Sam", characterClass: "Wizard (Evocation)", level: 5, maxHp: 28, currentHp: 28, tempHp: 0, armorClass: 13, initiativeModifier: 2, passivePerception: 13, speed: 30, spellDc: 15, notes: "Sculpt Spells, Fireball, Counterspell, Misty Step, Mage Armor", color: "#A855F7" },
  { id: "pc-3", name: "Elidor Shadowfoot", playerName: "Jordan", characterClass: "Rogue (Arcane Trickster)", level: 5, maxHp: 33, currentHp: 33, tempHp: 0, armorClass: 15, initiativeModifier: 4, passivePerception: 16, speed: 30, spellDc: 13, notes: "Sneak Attack (3d6), Cunning Action, Uncanny Dodge, Mage Hand Legerdemain", color: "#10B981" },
  { id: "pc-4", name: "Selene Lightbringer", playerName: "Morgan", characterClass: "Cleric (Life Domain)", level: 5, maxHp: 38, currentHp: 38, tempHp: 0, armorClass: 18, initiativeModifier: 0, passivePerception: 17, speed: 30, spellDc: 15, notes: "Channel Divinity: Preserve Life, Disciple of Life, Spirit Guardians, Spiritual Weapon", color: "#F59E0B" }
];

// ==========================================
// STATE STORE
// ==========================================

class CombatTrackerStore {
  constructor() {
    this.currentTab = "combat";
    this.party = this.loadFromStorage("dnd_party", DEFAULT_PARTY);
    this.encounter = this.loadFromStorage("dnd_encounter", {
      round: 1,
      currentTurnIndex: 0,
      isCombatStarted: false,
      combatants: [],
      log: []
    });
    this.diceHistory = this.loadFromStorage("dnd_dice_history", []);
    this.lastRoll = null;

    // Bestiary UI State
    this.bestiarySearch = "";
    this.bestiaryCategory = "All";

    // Dice State
    this.diceCount = 1;
    this.diceModifier = 0;
    this.d20RollMode = "NORMAL"; // NORMAL, ADVANTAGE, DISADVANTAGE

    // Active Modal Target
    this.activeCombatantId = null;
  }

  loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error("Storage load error:", e);
      return fallback;
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("dnd_party", JSON.stringify(this.party));
      localStorage.setItem("dnd_encounter", JSON.stringify(this.encounter));
      localStorage.setItem("dnd_dice_history", JSON.stringify(this.diceHistory));
    } catch (e) {
      console.error("Storage save error:", e);
    }
  }

  logEvent(text, type = "info") {
    const entry = {
      id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      round: this.encounter.round,
      text: text,
      type: type
    };
    this.encounter.log = [entry, ...this.encounter.log].slice(0, 50);
    this.saveToStorage();
  }
}

const store = new CombatTrackerStore();

// ==========================================
// HELPER UTILITIES
// ==========================================

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 250);
  }, 2400);
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

function getHpBarColor(current, max) {
  if (max <= 0) return "#475569";
  const pct = current / max;
  if (current <= 0) return "#475569";
  if (pct > 0.5) return "var(--color-hp-green)";
  if (pct > 0.25) return "var(--color-hp-amber)";
  return "var(--color-hp-red)";
}

// ==========================================
// ENCOUNTER ACTIONS
// ==========================================

function addPlayerToEncounter(character, rollInit = false, manualInit = 0) {
  const initScore = rollInit ? (rollD20() + character.initiativeModifier) : manualInit;
  const combatant = {
    id: "c-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
    characterId: character.id,
    name: character.name,
    isPlayer: true,
    characterClassOrType: `${character.characterClass} (Lvl ${character.level})`,
    maxHp: character.maxHp,
    currentHp: character.currentHp,
    tempHp: character.tempHp || 0,
    armorClass: character.armorClass,
    baseArmorClass: character.armorClass,
    coverType: "NONE",
    initiativeModifier: character.initiativeModifier,
    initiativeRoll: initScore,
    passivePerception: character.passivePerception,
    speed: character.speed,
    baseSpeed: character.speed,
    isDifficultTerrain: false,
    spellDc: character.spellDc,
    notes: character.notes || "",
    abilitiesAndFeats: character.abilitiesAndFeats || character.notes || "",
    conditions: [],
    deathSavesSuccess: 0,
    deathSavesFailure: 0,
    isStabilized: false,
    isDead: false
  };

  // Prevent duplicate PC
  store.encounter.combatants = store.encounter.combatants.filter(c => c.characterId !== character.id);
  store.encounter.combatants.push(combatant);
  if (store.encounter.isCombatStarted) {
    store.encounter.combatants = sortCombatants(store.encounter.combatants);
  }
  store.logEvent(`Added ${character.name} to encounter`, "info");
  store.saveToStorage();
  renderApp();
  showToast(`Added ${character.name}`);
}

function addAllPartyToEncounter() {
  if (store.party.length === 0) {
    showToast("Party is empty! Add characters first.");
    return;
  }
  store.party.forEach(pc => {
    addPlayerToEncounter(pc, false, 0);
  });
  store.logEvent("Added full party to combat encounter (set initiatives when ready)", "info");
  renderApp();
  showToast("All party members added to arena!");
}

function addEnemyToEncounter(name, hp, ac, initMod, count = 1, rollInit = true, cr = "", notes = "", speed = 30, spellDc = null) {
  const newCombatants = [];
  for (let i = 1; i <= count; i++) {
    const enemyName = count > 1 ? `${name} #${i}` : name;
    const initScore = rollInit ? (rollD20() + initMod) : (10 + initMod);
    newCombatants.push({
      id: "enemy-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5) + "-" + i,
      name: enemyName,
      isPlayer: false,
      characterClassOrType: cr ? `Enemy (${cr})` : "Enemy",
      maxHp: hp,
      currentHp: hp,
      tempHp: 0,
      armorClass: ac,
      baseArmorClass: ac,
      coverType: "NONE",
      initiativeModifier: initMod,
      initiativeRoll: initScore,
      passivePerception: 10,
      speed: speed,
      baseSpeed: speed,
      isDifficultTerrain: false,
      spellDc: spellDc,
      notes: notes,
      abilitiesAndFeats: notes,
      conditions: [],
      deathSavesSuccess: 0,
      deathSavesFailure: 0,
      isStabilized: false,
      isDead: false
    });
  }

  store.encounter.combatants.push(...newCombatants);
  if (store.encounter.isCombatStarted) {
    store.encounter.combatants = sortCombatants(store.encounter.combatants);
  }
  store.logEvent(`Added ${count > 1 ? `${count}x ${name}` : name} to encounter`, "info");
  store.saveToStorage();
  renderApp();
  showToast(`Added ${count > 1 ? `${count}x ${name}` : name}`);
}

function startCombat() {
  if (store.encounter.combatants.length === 0) {
    showToast("Add combatants before starting combat!");
    return;
  }

  // Auto-roll monsters initiative if they are at 0 or unrolled
  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (!c.isPlayer) {
      return { ...c, initiativeRoll: rollD20() + c.initiativeModifier };
    }
    return c;
  });

  store.encounter.combatants = sortCombatants(store.encounter.combatants);
  const firstLiving = store.encounter.combatants.findIndex(c => !c.isDead);
  store.encounter.round = 1;
  store.encounter.currentTurnIndex = firstLiving >= 0 ? firstLiving : 0;
  store.encounter.isCombatStarted = true;

  const actor = store.encounter.combatants[store.encounter.currentTurnIndex]?.name || "Unknown";
  store.logEvent(`⚔️ Combat Started! Round 1 begins. ${actor}'s turn.`, "turn");
  store.saveToStorage();
  renderApp();
  showToast("⚔️ Combat Started!");
}

function nextTurn() {
  const total = store.encounter.combatants.length;
  if (total === 0) return;
  const hasLiving = store.encounter.combatants.some(c => !c.isDead);
  if (!hasLiving) return;

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
  store.saveToStorage();
  renderApp();
}

function previousTurn() {
  const total = store.encounter.combatants.length;
  if (total === 0) return;
  const hasLiving = store.encounter.combatants.some(c => !c.isDead);
  if (!hasLiving) return;

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
  store.saveToStorage();
  renderApp();
}

function endCombat() {
  store.encounter.isCombatStarted = false;
  store.logEvent("🏁 Combat ended.", "info");
  store.saveToStorage();
  renderApp();
  showToast("Combat ended");
}

function clearEncounter() {
  if (!confirm("Reset encounter and clear all combatants from the arena?")) return;
  store.encounter = {
    round: 1,
    currentTurnIndex: 0,
    isCombatStarted: false,
    combatants: [],
    log: []
  };
  store.logEvent("Encounter reset and arena cleared", "info");
  store.saveToStorage();
  renderApp();
  showToast("Encounter reset");
}

function removeCombatant(id) {
  const combatant = store.encounter.combatants.find(c => c.id === id);
  store.encounter.combatants = store.encounter.combatants.filter(c => c.id !== id);
  if (store.encounter.currentTurnIndex >= store.encounter.combatants.length) {
    store.encounter.currentTurnIndex = Math.max(0, store.encounter.combatants.length - 1);
  }
  if (combatant) {
    store.logEvent(`Removed ${combatant.name} from combat`, "info");
  }
  store.saveToStorage();
  renderApp();
}

// ==========================================
// HP, DAMAGE & HEALING ENGINE
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

    let fails = c.deathSavesFailure || 0;
    let isDead = c.isDead;
    let isStabilized = c.isStabilized;
    let conditions = [...(c.conditions || [])];

    // If player takes damage at 0 HP -> automatic failed death save
    if (c.isPlayer && c.currentHp === 0 && afterHp === 0) {
      fails = Math.min(3, fails + 1);
      isStabilized = false;
      if (fails >= 3) {
        isDead = true;
        if (!conditions.includes("dead")) conditions.push("dead");
      }
    }

    // Auto add unconscious if dropped to 0
    if (c.isPlayer && afterHp === 0 && !conditions.includes("unconscious")) {
      conditions.push("unconscious");
    }

    return {
      ...c,
      currentHp: afterHp,
      tempHp: currentTemp,
      deathSavesFailure: fails,
      isStabilized: isStabilized,
      isDead: isDead,
      conditions: conditions
    };
  });

  store.logEvent(`${targetName} took ${amount} damage! (HP: ${finalHp})`, "damage");
  if (finalHp === 0) {
    store.logEvent(`💀 ${targetName} dropped to 0 HP!`, "death");
  }
  store.saveToStorage();
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
    let conditions = (c.conditions || []).filter(cond => cond !== "dead" && cond !== "unconscious");

    return {
      ...c,
      currentHp: healed,
      deathSavesSuccess: healed > 0 ? 0 : c.deathSavesSuccess,
      deathSavesFailure: healed > 0 ? 0 : c.deathSavesFailure,
      isStabilized: healed > 0 ? false : c.isStabilized,
      isDead: healed > 0 ? false : c.isDead,
      conditions: healed > 0 ? conditions : c.conditions
    };
  });

  store.logEvent(`✨ ${targetName} healed ${amount} HP! (HP: ${finalHp})`, "heal");
  store.saveToStorage();
  renderApp();
}

function setTempHp(combatantId, amount) {
  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id === combatantId) {
      store.logEvent(`${c.name} gained ${amount} Temp HP`, "info");
      return { ...c, tempHp: Math.max(0, amount) };
    }
    return c;
  });
  store.saveToStorage();
  renderApp();
}

function setHpDirect(combatantId, newHp) {
  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id === combatantId) {
      const finalHp = Math.max(0, Math.min(c.maxHp, newHp));
      store.logEvent(`Set ${c.name} HP to ${finalHp}`, "info");
      return {
        ...c,
        currentHp: finalHp,
        deathSavesSuccess: finalHp > 0 ? 0 : c.deathSavesSuccess,
        deathSavesFailure: finalHp > 0 ? 0 : c.deathSavesFailure
      };
    }
    return c;
  });
  store.saveToStorage();
  renderApp();
}

function recordDeathSave(combatantId, isSuccess) {
  let targetName = "";
  let succ = 0;
  let fail = 0;
  let stabilized = false;
  let died = false;

  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id !== combatantId) return c;
    targetName = c.name;
    succ = isSuccess ? Math.min(3, (c.deathSavesSuccess || 0) + 1) : (c.deathSavesSuccess || 0);
    fail = !isSuccess ? Math.min(3, (c.deathSavesFailure || 0) + 1) : (c.deathSavesFailure || 0);

    const conditions = [...(c.conditions || [])];
    let isStabilized = c.isStabilized;
    let isDead = c.isDead;

    if (succ >= 3) {
      isStabilized = true;
      stabilized = true;
      if (!conditions.includes("unconscious")) conditions.push("unconscious");
    }
    if (fail >= 3) {
      isDead = true;
      died = true;
      if (!conditions.includes("dead")) conditions.push("dead");
    }

    return {
      ...c,
      deathSavesSuccess: succ,
      deathSavesFailure: fail,
      isStabilized: isStabilized,
      isDead: isDead,
      conditions: conditions
    };
  });

  if (isSuccess) {
    store.logEvent(`💚 ${targetName} passed a Death Save (${succ}/3)`, "info");
    if (stabilized) {
      store.logEvent(`🌟 ${targetName} has STABILIZED at 0 HP (Unconscious)!`, "heal");
    }
  } else {
    store.logEvent(`💔 ${targetName} FAILED a Death Save (${fail}/3)`, "damage");
    if (died) {
      store.logEvent(`💀 ${targetName} has DIED (3 Failed Death Saves) and will be skipped in turns!`, "death");
    }
  }

  store.saveToStorage();
  renderApp();
}

function reviveCombatant(combatantId) {
  let name = "";
  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id === combatantId) {
      name = c.name;
      const conditions = (c.conditions || []).filter(cond => cond !== "dead" && cond !== "unconscious");
      return {
        ...c,
        currentHp: 1,
        isDead: false,
        isStabilized: false,
        deathSavesSuccess: 0,
        deathSavesFailure: 0,
        conditions: conditions
      };
    }
    return c;
  });
  store.logEvent(`✨ ${name} has been REVIVED with 1 HP!`, "heal");
  store.saveToStorage();
  renderApp();
  showToast(`✨ ${name} revived!`);
}

// ==========================================
// AC, COVER & SPEED ENGINE
// ==========================================

function updateArmorClass(combatantId, baseAc, coverType) {
  const bonus = coverType === "HALF" ? 2 : coverType === "THREE_QUARTERS" ? 5 : coverType === "TOTAL" ? 10 : 0;
  const effectiveAc = Math.max(1, baseAc + bonus);

  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id === combatantId) {
      let conditions = (c.conditions || []).filter(cond => !["half_cover", "three_quarters_cover", "total_cover"].includes(cond));
      if (coverType === "HALF") conditions.push("half_cover");
      if (coverType === "THREE_QUARTERS") conditions.push("three_quarters_cover");
      if (coverType === "TOTAL") conditions.push("total_cover");

      store.logEvent(`Updated ${c.name} AC to ${effectiveAc} (${coverType})`, "info");
      return {
        ...c,
        baseArmorClass: baseAc,
        armorClass: effectiveAc,
        coverType: coverType,
        conditions: conditions
      };
    }
    return c;
  });
  store.saveToStorage();
  renderApp();
}

function updateSpeed(combatantId, baseSpeed, isDifficult) {
  const effectiveSpeed = isDifficult ? Math.floor(baseSpeed / 2) : baseSpeed;

  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id === combatantId) {
      let conditions = (c.conditions || []).filter(cond => cond !== "difficult_terrain");
      if (isDifficult) conditions.push("difficult_terrain");

      store.logEvent(`Updated ${c.name} Speed to ${effectiveSpeed}ft ${isDifficult ? "(Difficult Terrain)" : ""}`, "info");
      return {
        ...c,
        baseSpeed: baseSpeed,
        speed: effectiveSpeed,
        isDifficultTerrain: isDifficult,
        conditions: conditions
      };
    }
    return c;
  });
  store.saveToStorage();
  renderApp();
}

function toggleCondition(combatantId, conditionId) {
  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id !== combatantId) return c;
    const condList = [...(c.conditions || [])];
    const exists = condList.includes(conditionId);
    let updated = exists ? condList.filter(id => id !== conditionId) : [...condList, conditionId];

    // Mechanics hook for conditions
    let newAc = c.armorClass;
    let newSpeed = c.speed;
    let newCover = c.coverType;
    let newDiff = c.isDifficultTerrain;

    if (conditionId === "difficult_terrain") {
      newDiff = !exists;
      newSpeed = newDiff ? Math.floor(c.baseSpeed / 2) : c.baseSpeed;
    } else if (conditionId === "half_cover") {
      newCover = !exists ? "HALF" : "NONE";
      newAc = c.baseArmorClass + (!exists ? 2 : 0);
    } else if (conditionId === "three_quarters_cover") {
      newCover = !exists ? "THREE_QUARTERS" : "NONE";
      newAc = c.baseArmorClass + (!exists ? 5 : 0);
    } else if (conditionId === "total_cover") {
      newCover = !exists ? "TOTAL" : "NONE";
      newAc = c.baseArmorClass + (!exists ? 10 : 0);
    }

    const condObj = CONDITIONS.find(cn => cn.id === conditionId);
    store.logEvent(`${exists ? "Removed" : "Applied"} ${condObj ? condObj.name : conditionId} to ${c.name}`, "condition");

    return {
      ...c,
      conditions: updated,
      armorClass: newAc,
      speed: newSpeed,
      coverType: newCover,
      isDifficultTerrain: newDiff
    };
  });
  store.saveToStorage();
  renderApp();
}

function setInitiative(combatantId, score) {
  store.encounter.combatants = store.encounter.combatants.map(c => {
    if (c.id === combatantId) {
      store.logEvent(`Set ${c.name} initiative to ${score}`, "info");
      return { ...c, initiativeRoll: score };
    }
    return c;
  });
  if (store.encounter.isCombatStarted) {
    const activeId = store.encounter.combatants[store.encounter.currentTurnIndex]?.id;
    store.encounter.combatants = sortCombatants(store.encounter.combatants);
    if (activeId) {
      const newIdx = store.encounter.combatants.findIndex(c => c.id === activeId);
      if (newIdx >= 0) store.encounter.currentTurnIndex = newIdx;
    }
  }
  store.saveToStorage();
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
    store.encounter.combatants = sortCombatants(store.encounter.combatants);
  }
  store.logEvent("Rolled initiative for all monsters", "info");
  store.saveToStorage();
  renderApp();
  showToast("Rolled monsters initiative");
}

function rerollAllInitiatives() {
  store.encounter.combatants = store.encounter.combatants.map(c => {
    return { ...c, initiativeRoll: rollD20() + c.initiativeModifier };
  });
  store.encounter.combatants = sortCombatants(store.encounter.combatants);
  store.encounter.currentTurnIndex = 0;
  store.logEvent("Rerolled initiative for all combatants", "info");
  store.saveToStorage();
  renderApp();
  showToast("Rerolled all initiatives");
}

// ==========================================
// DICE ROLLER ENGINE
// ==========================================

function rollDice(sides, count = 1, modifier = 0, mode = "NORMAL") {
  const rolls = [];
  let discarded = null;

  if (sides === 20 && count === 1 && mode !== "NORMAL") {
    const r1 = rollDie(20);
    const r2 = rollDie(20);
    const chosen = mode === "ADVANTAGE" ? Math.max(r1, r2) : Math.min(r1, r2);
    discarded = mode === "ADVANTAGE" ? Math.min(r1, r2) : Math.max(r1, r2);
    rolls.push(chosen);
  } else {
    for (let i = 0; i < count; i++) {
      rolls.push(rollDie(sides));
    }
  }

  const sum = rolls.reduce((a, b) => a + b, 0);
  const total = sum + modifier;
  const isNat20 = sides === 20 && rolls.includes(20);
  const isNat1 = sides === 20 && rolls.includes(1);

  const result = {
    id: "dice-" + Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    dice: `${count}d${sides}`,
    total: total,
    rolls: rolls,
    modifier: modifier,
    mode: mode,
    discarded: discarded,
    isNat20: isNat20,
    isNat1: isNat1
  };

  store.lastRoll = result;
  store.diceHistory = [result, ...store.diceHistory].slice(0, 30);
  store.saveToStorage();
  renderApp();
}

// ==========================================
// HTML RENDERING & VIEW GENERATION
// ==========================================

function renderApp() {
  const container = document.getElementById("main-container");
  if (!container) return;

  switch (store.currentTab) {
    case "combat":
      container.innerHTML = renderCombatArena();
      break;
    case "party":
      container.innerHTML = renderPartyRoster();
      break;
    case "bestiary":
      container.innerHTML = renderBestiary();
      break;
    case "dice":
      container.innerHTML = renderDiceAndRules();
      break;
  }

  // Update active states on nav items
  document.querySelectorAll(".nav-tab-btn, .mobile-nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === store.currentTab);
  });
}

// --- Screen 1: Combat Arena ---
function renderCombatArena() {
  const enc = store.encounter;
  const combatants = enc.combatants;
  const activeCombatant = combatants[enc.currentTurnIndex] || null;

  return `
    <!-- Hero Header / Arena Status -->
    <div class="arena-hero">
      <img src="assets/banner.jpg" class="arena-hero-bg" alt="D&D Arena Banner" onerror="this.style.display='none'">
      <div class="arena-hero-content">
        <div class="arena-round-badge">
          <div class="round-shield">
            <span class="round-shield-label">Round</span>
            <span class="round-shield-num">${enc.round}</span>
          </div>
          <div class="arena-turn-info">
            <span class="arena-turn-label">${enc.isCombatStarted ? "Active Turn" : "Preparation Phase"}</span>
            <span class="arena-turn-name">${enc.isCombatStarted && activeCombatant ? activeCombatant.name : "Combat not started"}</span>
          </div>
        </div>

        <div class="arena-controls">
          ${!enc.isCombatStarted ? `
            <button class="btn btn-primary" onclick="startCombat()">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Start Combat</span>
            </button>
          ` : `
            <button class="btn btn-secondary btn-sm" onclick="previousTurn()" title="Previous Turn">
              <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              <span>Prev</span>
            </button>
            <button class="btn btn-primary" onclick="nextTurn()" title="Next Turn">
              <span>Next Turn</span>
              <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
            <button class="btn btn-danger btn-sm" onclick="endCombat()" title="End Combat">
              <svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
              <span>End</span>
            </button>
          `}
        </div>
      </div>
    </div>

    <!-- Quick Action Bar -->
    <div class="quick-action-bar">
      <div class="quick-action-group">
        <button class="btn btn-secondary btn-sm" onclick="openAddEnemyModal()">
          <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          <span>+ Add Enemy</span>
        </button>
        <button class="btn btn-secondary btn-sm" onclick="addAllPartyToEncounter()">
          <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span>+ Add Party</span>
        </button>
        <button class="btn btn-secondary btn-sm" onclick="openPartyInitiativeModal()">
          <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
          <span>Party Init</span>
        </button>
      </div>

      <div class="quick-action-group">
        <button class="btn btn-ghost btn-sm" onclick="rollMonstersInitiative()" title="Roll initiative for all enemies">
          <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
          <span>Roll Enemies</span>
        </button>
        <button class="btn btn-ghost btn-sm" onclick="clearEncounter()" title="Clear arena">
          <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          <span>Reset</span>
        </button>
      </div>
    </div>

    <!-- Arena Split Grid (Desktop: Cards Left, Spotlight & Log Right) -->
    <div class="arena-grid">
      <!-- Left Column: Combatants List -->
      <div class="combatant-list">
        ${combatants.length === 0 ? `
          <div class="card" style="text-align: center; padding: var(--space-xl) var(--space-md);">
            <h3 style="color: var(--color-gold-light); margin-bottom: var(--space-xs);">Arena is Empty</h3>
            <p style="color: var(--text-muted); font-size: var(--font-sm); margin-bottom: var(--space-md);">
              Add player characters from your party or spawn enemies from the Bestiary to begin tracking combat.
            </p>
            <div style="display: flex; justify-content: center; gap: var(--space-sm); flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="addAllPartyToEncounter()">+ Add Party Members</button>
              <button class="btn btn-secondary" onclick="openAddEnemyModal()">+ Add Monster</button>
            </div>
          </div>
        ` : combatants.map((c, idx) => renderCombatantCard(c, idx === enc.currentTurnIndex && enc.isCombatStarted)).join("")}
      </div>

      <!-- Right Column: Active Spotlight & Combat Log -->
      <div class="arena-sidebar">
        ${activeCombatant && enc.isCombatStarted ? `
          <div class="active-spotlight-card">
            <div class="spotlight-header">
              <span class="spotlight-title">Active Combatant</span>
              <span class="role-tag ${activeCombatant.isPlayer ? "player" : "monster"}">${activeCombatant.isPlayer ? "Player" : "Enemy"}</span>
            </div>
            <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: var(--space-xs);">
              <h2 style="font-size: var(--font-lg); color: var(--color-gold-light);">${activeCombatant.name}</h2>
              <span style="font-size: var(--font-xs); color: var(--text-muted);">${activeCombatant.characterClassOrType}</span>
            </div>
            <p style="font-size: var(--font-xs); color: var(--text-muted); margin-bottom: var(--space-sm);">
              <strong>AC:</strong> ${activeCombatant.armorClass} &nbsp;|&nbsp;
              <strong>Speed:</strong> ${activeCombatant.speed}ft &nbsp;|&nbsp;
              <strong>Init:</strong> ${activeCombatant.initiativeRoll}
            </p>
            ${activeCombatant.notes ? `
              <div style="font-size: var(--font-xs); background: rgba(15, 14, 19, 0.6); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--border-dungeon); margin-bottom: var(--space-sm);">
                <strong>Notes / Abilities:</strong> ${activeCombatant.notes}
              </div>
            ` : ""}
            <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="nextTurn()">Finish Turn &rarr;</button>
              <button class="btn btn-secondary btn-sm" onclick="openDamageHealModal('${activeCombatant.id}')">&plusmn; HP</button>
              <button class="btn btn-secondary btn-sm" onclick="openConditionsModal('${activeCombatant.id}')">Conditions</button>
            </div>
          </div>
        ` : ""}

        <!-- Live Combat Event Log -->
        <div class="combat-log-card">
          <div class="combat-log-header">
            <span style="font-family: var(--font-display); font-size: var(--font-sm); font-weight: 700; color: var(--color-gold-light);">Combat Log</span>
            <button class="btn btn-ghost btn-sm" onclick="store.encounter.log = []; store.saveToStorage(); renderApp();">Clear</button>
          </div>
          <div class="combat-log-stream">
            ${enc.log.length === 0 ? `
              <div style="color: var(--text-subtle); text-align: center; padding: var(--space-md);">No combat actions logged yet.</div>
            ` : enc.log.map(entry => `
              <div class="log-entry ${entry.type}">
                <span style="opacity: 0.6; font-size: 0.7rem;">[R${entry.round} ${entry.time}]</span> ${entry.text}
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCombatantCard(c, isActive) {
  const hpPercent = Math.max(0, Math.min(100, (c.currentHp / (c.maxHp || 1)) * 100));
  const hpColor = getHpBarColor(c.currentHp, c.maxHp);
  const isDown = c.currentHp <= 0;

  return `
    <div class="combatant-card ${isActive ? "active-turn" : ""} ${c.isDead ? "is-dead" : ""}" id="card-${c.id}">
      ${isActive ? `<div class="turn-ribbon">Active Turn</div>` : ""}

      <div class="combatant-header">
        <div class="combatant-identity">
          <div class="init-badge" onclick="openInitiativeEditModal('${c.id}')" title="Click to edit initiative">
            <span class="init-score">${c.initiativeRoll}</span>
            <span class="init-label">Init</span>
          </div>

          <div class="combatant-titles">
            <div class="combatant-name-row">
              <span class="combatant-name">${c.name}</span>
              <span class="role-tag ${c.isPlayer ? "player" : "monster"}">${c.isPlayer ? "PC" : "Monster"}</span>
              ${c.isDead ? `<span class="role-tag" style="background: rgba(100, 116, 139, 0.3); color: #cbd5e1;">Dead</span>` : ""}
            </div>
            <span class="combatant-class">${c.characterClassOrType}</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 4px;">
          <button class="btn btn-ghost btn-sm" onclick="removeCombatant('${c.id}')" title="Remove from arena">
            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
      </div>

      <!-- Stats Bar: AC, Cover, Speed, Terrain, Passive Perception, Spell DC -->
      <div class="combatant-stats-bar">
        <div class="stat-pill pill-ac ${c.coverType !== "NONE" ? "pill-cover" : ""}" onclick="openAcModal('${c.id}')" title="Click to edit AC / Cover">
          <strong>AC ${c.armorClass}</strong> ${c.coverType !== "NONE" ? `(${c.coverType})` : ""}
        </div>
        <div class="stat-pill pill-speed ${c.isDifficultTerrain ? "pill-difficult" : ""}" onclick="openSpeedModal('${c.id}')" title="Click to edit Speed / Difficult Terrain">
          <strong>${c.speed}ft</strong> ${c.isDifficultTerrain ? "(Diff)" : ""}
        </div>
        ${c.passivePerception ? `<div class="stat-pill" title="Passive Perception">Percep: <strong>${c.passivePerception}</strong></div>` : ""}
        ${c.spellDc ? `<div class="stat-pill" title="Spell Save DC">DC: <strong>${c.spellDc}</strong></div>` : ""}
      </div>

      <!-- HP Bar Component -->
      <div class="hp-container">
        <div class="hp-meta">
          <div class="hp-text-group">
            <span class="hp-digits">${c.currentHp} / ${c.maxHp} HP</span>
            ${c.tempHp > 0 ? `<span class="temp-hp-badge">+${c.tempHp} Temp</span>` : ""}
          </div>
          <button class="btn btn-ghost btn-sm" style="padding: 0 4px; height: 22px; font-size: 0.7rem; color: var(--color-gold-light);" onclick="openDamageHealModal('${c.id}')">
            Manage &plusmn;
          </button>
        </div>
        <div class="hp-bar-outer">
          <div class="hp-bar-fill" style="width: ${hpPercent}%; background-color: ${hpColor};"></div>
          ${c.tempHp > 0 ? `<div class="hp-bar-temp" style="width: ${Math.min(100, (c.tempHp / (c.maxHp || 1)) * 100)}%;"></div>` : ""}
        </div>
      </div>

      <!-- HP Quick Step Buttons -->
      <div class="hp-actions-row">
        <div class="hp-stepper-group">
          <button class="btn-step dmg" onclick="applyDamage('${c.id}', 1)">-1</button>
          <button class="btn-step dmg" onclick="applyDamage('${c.id}', 5)">-5</button>
          <button class="btn-step dmg" onclick="applyDamage('${c.id}', 10)">-10</button>
        </div>
        <div class="hp-stepper-group">
          <button class="btn-step heal" onclick="applyHealing('${c.id}', 1)">+1</button>
          <button class="btn-step heal" onclick="applyHealing('${c.id}', 5)">+5</button>
          <button class="btn-step heal" onclick="applyHealing('${c.id}', 10)">+10</button>
        </div>
      </div>

      <!-- Death Saves Box (Downed Players) -->
      ${c.isPlayer && isDown ? `
        <div class="death-saves-box">
          <div class="death-save-group">
            <span class="death-save-label" style="color: var(--color-hp-green);">Succ:</span>
            <span class="death-dot ${c.deathSavesSuccess >= 1 ? "succ-active" : ""}" onclick="recordDeathSave('${c.id}', true)"></span>
            <span class="death-dot ${c.deathSavesSuccess >= 2 ? "succ-active" : ""}" onclick="recordDeathSave('${c.id}', true)"></span>
            <span class="death-dot ${c.deathSavesSuccess >= 3 ? "succ-active" : ""}" onclick="recordDeathSave('${c.id}', true)"></span>
          </div>

          <div class="death-save-group">
            <span class="death-save-label" style="color: var(--color-hp-red);">Fail:</span>
            <span class="death-dot ${c.deathSavesFailure >= 1 ? "fail-active" : ""}" onclick="recordDeathSave('${c.id}', false)"></span>
            <span class="death-dot ${c.deathSavesFailure >= 2 ? "fail-active" : ""}" onclick="recordDeathSave('${c.id}', false)"></span>
            <span class="death-dot ${c.deathSavesFailure >= 3 ? "fail-active" : ""}" onclick="recordDeathSave('${c.id}', false)"></span>
          </div>

          <button class="btn btn-sm btn-outline-gold" style="height: 26px; padding: 0 6px;" onclick="reviveCombatant('${c.id}')">Revive (1 HP)</button>
        </div>
      ` : ""}

      <!-- Conditions List -->
      <div class="conditions-row">
        ${(c.conditions || []).map(condId => {
          const cond = CONDITIONS.find(cn => cn.id === condId);
          if (!cond) return "";
          return `
            <span class="condition-chip" style="background-color: ${cond.color};" onclick="toggleCondition('${c.id}', '${cond.id}')" title="${cond.desc}">
              ${cond.name} <span class="chip-remove">&times;</span>
            </span>
          `;
        }).join("")}
        <button class="btn btn-ghost btn-sm" style="font-size: 0.68rem; padding: 2px 6px; height: 24px; border: 1px dashed var(--border-dungeon);" onclick="openConditionsModal('${c.id}')">
          + Condition
        </button>
      </div>
    </div>
  `;
}

// --- Screen 2: Party Roster ---
function renderPartyRoster() {
  const party = store.party;

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); flex-wrap: wrap; gap: var(--space-xs);">
      <div>
        <h2 style="font-size: var(--font-lg); color: var(--color-gold-light);">Party Roster</h2>
        <p style="font-size: var(--font-xs); color: var(--text-muted);">Manage persistent player characters saved in your browser storage.</p>
      </div>
      <div style="display: flex; gap: var(--space-xs);">
        <button class="btn btn-secondary btn-sm" onclick="addAllPartyToEncounter()">+ Add All to Arena</button>
        <button class="btn btn-primary btn-sm" onclick="openCharacterModal()">+ New Character</button>
      </div>
    </div>

    <div class="roster-grid">
      ${party.length === 0 ? `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl);">
          <h3 style="color: var(--color-gold-light); margin-bottom: var(--space-xs);">No Party Members</h3>
          <p style="color: var(--text-muted); font-size: var(--font-sm); margin-bottom: var(--space-md);">Add your adventuring party to track their stats, spells, and initiatives.</p>
          <button class="btn btn-primary" onclick="openCharacterModal()">+ Create Character</button>
        </div>
      ` : party.map(pc => `
        <div class="character-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="font-size: var(--font-md); color: var(--color-gold-light);">${pc.name}</h3>
              <div style="font-size: var(--font-xs); color: var(--text-muted);">${pc.characterClass} &bull; Lvl ${pc.level} ${pc.playerName ? `(${pc.playerName})` : ""}</div>
            </div>
            <div style="display: flex; gap: 2px;">
              <button class="btn btn-ghost btn-sm" onclick="openCharacterModal('${pc.id}')" title="Edit Character">
                <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
              <button class="btn btn-ghost btn-sm" onclick="deleteCharacter('${pc.id}')" title="Delete Character">
                <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            </div>
          </div>

          <div class="combatant-stats-bar" style="margin: var(--space-xs) 0;">
            <div class="stat-pill">HP: <strong>${pc.maxHp}</strong></div>
            <div class="stat-pill pill-ac">AC: <strong>${pc.armorClass}</strong></div>
            <div class="stat-pill">Init Mod: <strong>${pc.initiativeModifier >= 0 ? "+" + pc.initiativeModifier : pc.initiativeModifier}</strong></div>
            <div class="stat-pill">Speed: <strong>${pc.speed}ft</strong></div>
            ${pc.passivePerception ? `<div class="stat-pill">Percep: <strong>${pc.passivePerception}</strong></div>` : ""}
            ${pc.spellDc ? `<div class="stat-pill">DC: <strong>${pc.spellDc}</strong></div>` : ""}
          </div>

          ${pc.notes ? `
            <div style="font-size: var(--font-xs); color: var(--text-muted); background: rgba(15, 14, 19, 0.5); padding: var(--space-xs); border-radius: var(--radius-sm); border: 1px solid var(--border-dungeon); margin-top: auto;">
              ${pc.notes}
            </div>
          ` : ""}

          <button class="btn btn-outline-gold btn-sm" style="margin-top: var(--space-xs); width: 100%;" onclick="addPlayerToEncounter(store.party.find(p => p.id === '${pc.id}'))">
            + Add to Active Combat
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

// --- Screen 3: Bestiary (5e SRD Presets) ---
function renderBestiary() {
  const categories = ["All", "Humanoid", "Undead", "Beast", "Giant", "Dragon", "Aberration"];
  const query = store.bestiarySearch.toLowerCase().trim();

  const filtered = MONSTER_PRESETS.filter(m => {
    const matchCat = store.bestiaryCategory === "All" || m.type.toLowerCase() === store.bestiaryCategory.toLowerCase();
    const matchSearch = !query || m.name.toLowerCase().includes(query) || m.cr.toLowerCase().includes(query) || m.type.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); flex-wrap: wrap; gap: var(--space-xs);">
      <div>
        <h2 style="font-size: var(--font-lg); color: var(--color-gold-light);">Bestiary & SRD Monsters</h2>
        <p style="font-size: var(--font-xs); color: var(--text-muted);">Quickly spawn SRD 5e monsters with authentic stats, attacks, and traits.</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openAddEnemyModal()">+ Custom Monster</button>
    </div>

    <!-- Search & Category Filters -->
    <div style="display: flex; flex-direction: column; gap: var(--space-xs); margin-bottom: var(--space-md);">
      <input type="text" class="form-input" placeholder="Search monsters by name or CR (e.g. Goblin, Dragon, CR 1)..." value="${store.bestiarySearch}" oninput="store.bestiarySearch = this.value; renderApp();">
      
      <div class="filter-chip-row">
        ${categories.map(cat => `
          <button class="filter-chip ${store.bestiaryCategory === cat ? "active" : ""}" onclick="store.bestiaryCategory = '${cat}'; renderApp();">
            ${cat}
          </button>
        `).join("")}
      </div>
    </div>

    <div class="bestiary-grid">
      ${filtered.length === 0 ? `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl);">
          <p style="color: var(--text-muted);">No monsters matched your filter.</p>
        </div>
      ` : filtered.map(m => `
        <div class="card" style="display: flex; flex-direction: column; gap: var(--space-xs);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="font-size: var(--font-md); color: var(--color-gold-light);">${m.name}</h3>
              <div style="font-size: var(--font-xs); color: var(--text-muted);">${m.cr} &bull; ${m.type}</div>
            </div>
            <span class="role-tag monster">Monster</span>
          </div>

          <div class="combatant-stats-bar">
            <div class="stat-pill">HP: <strong>${m.maxHp}</strong></div>
            <div class="stat-pill pill-ac">AC: <strong>${m.ac}</strong></div>
            <div class="stat-pill">Init Mod: <strong>${m.initMod >= 0 ? "+" + m.initMod : m.initMod}</strong></div>
            <div class="stat-pill">Speed: <strong>${m.speed}ft</strong></div>
            ${m.spellDc ? `<div class="stat-pill">DC: <strong>${m.spellDc}</strong></div>` : ""}
          </div>

          ${m.notes ? `
            <div style="font-size: var(--font-xs); color: var(--text-muted); background: rgba(15, 14, 19, 0.5); padding: var(--space-xs); border-radius: var(--radius-sm); border: 1px solid var(--border-dungeon); margin-top: auto;">
              ${m.notes}
            </div>
          ` : ""}

          <div style="display: flex; align-items: center; gap: var(--space-xs); margin-top: var(--space-xs);">
            <div style="display: flex; align-items: center; background: var(--bg-dungeon-card-elevated); border: 1px solid var(--border-dungeon); border-radius: var(--radius-sm); height: 36px;">
              <button class="btn btn-ghost btn-sm" style="width: 28px; height: 36px; padding: 0;" onclick="adjustPresetCount('${m.name}', -1)">-</button>
              <span id="preset-count-${m.name}" style="font-weight: 700; font-size: var(--font-xs); min-width: 20px; text-align: center;">1</span>
              <button class="btn btn-ghost btn-sm" style="width: 28px; height: 36px; padding: 0;" onclick="adjustPresetCount('${m.name}', 1)">+</button>
            </div>
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="spawnPresetMonster('${m.name}')">
              + Spawn into Combat
            </button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

const presetCounts = {};
function adjustPresetCount(name, delta) {
  presetCounts[name] = Math.max(1, (presetCounts[name] || 1) + delta);
  const el = document.getElementById(`preset-count-${name}`);
  if (el) el.textContent = presetCounts[name];
}

function spawnPresetMonster(name) {
  const preset = MONSTER_PRESETS.find(m => m.name === name);
  if (!preset) return;
  const count = presetCounts[name] || 1;
  addEnemyToEncounter(preset.name, preset.maxHp, preset.ac, preset.initMod, count, true, preset.cr, preset.notes, preset.speed, preset.spellDc);
}

// --- Screen 4: Dice Roller & Rules Reference ---
function renderDiceAndRules() {
  const last = store.lastRoll;

  return `
    <div class="dice-roller-panel">
      <!-- Left Column: Interactive Dice Roller -->
      <div>
        <div style="margin-bottom: var(--space-md);">
          <h2 style="font-size: var(--font-lg); color: var(--color-gold-light);">Dice Roller</h2>
          <p style="font-size: var(--font-xs); color: var(--text-muted);">Roll 5e polyhedral dice with Advantage, Disadvantage, and modifiers.</p>
        </div>

        <!-- Dice Control Options (Quantity & Modifier) -->
        <div class="card" style="margin-bottom: var(--space-md); padding: var(--space-sm) var(--space-md);">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-sm);">
            <!-- Dice Count -->
            <div style="display: flex; align-items: center; gap: var(--space-xs);">
              <span class="form-label" style="margin: 0;">Count:</span>
              <button class="btn-step" onclick="store.diceCount = Math.max(1, store.diceCount - 1); renderApp();">-</button>
              <strong style="min-width: 24px; text-align: center;">${store.diceCount}</strong>
              <button class="btn-step" onclick="store.diceCount = Math.min(20, store.diceCount + 1); renderApp();">+</button>
            </div>

            <!-- Modifier -->
            <div style="display: flex; align-items: center; gap: var(--space-xs);">
              <span class="form-label" style="margin: 0;">Mod:</span>
              <button class="btn-step" onclick="store.diceModifier--; renderApp();">-</button>
              <strong style="min-width: 32px; text-align: center;">${store.diceModifier >= 0 ? "+" + store.diceModifier : store.diceModifier}</strong>
              <button class="btn-step" onclick="store.diceModifier++; renderApp();">+</button>
            </div>

            <!-- D20 Mode -->
            <div style="display: flex; align-items: center; gap: 4px;">
              <button class="btn btn-sm ${store.d20RollMode === "NORMAL" ? "btn-primary" : "btn-secondary"}" onclick="store.d20RollMode = 'NORMAL'; renderApp();">Normal</button>
              <button class="btn btn-sm ${store.d20RollMode === "ADVANTAGE" ? "btn-primary" : "btn-secondary"}" onclick="store.d20RollMode = 'ADVANTAGE'; renderApp();">Adv</button>
              <button class="btn btn-sm ${store.d20RollMode === "DISADVANTAGE" ? "btn-primary" : "btn-secondary"}" onclick="store.d20RollMode = 'DISADVANTAGE'; renderApp();">Dis</button>
            </div>
          </div>
        </div>

        <!-- Dice Buttons Grid -->
        <div class="dice-grid" style="margin-bottom: var(--space-md);">
          <button class="dice-btn" onclick="rollDice(4, store.diceCount, store.diceModifier, store.d20RollMode)">
            <svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 4.5l6.5 12h-13L12 6.5z"/></svg>
            <span class="dice-name">d4</span>
          </button>
          <button class="dice-btn" onclick="rollDice(6, store.diceCount, store.diceModifier, store.d20RollMode)">
            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 7h2v2H7V7zm10 10h-2v-2h2v2zm0-10h-2v2h2V7zM7 17h2v-2H7v2zm5-5h2v2h-2v-2z"/></svg>
            <span class="dice-name">d6</span>
          </button>
          <button class="dice-btn" onclick="rollDice(8, store.diceCount, store.diceModifier, store.d20RollMode)">
            <svg viewBox="0 0 24 24"><path d="M12 2l8 10-8 10-8-10 8-10zm0 3.2L6.5 12 12 18.8 17.5 12 12 5.2z"/></svg>
            <span class="dice-name">d8</span>
          </button>
          <button class="dice-btn" onclick="rollDice(10, store.diceCount, store.diceModifier, store.d20RollMode)">
            <svg viewBox="0 0 24 24"><path d="M12 2l7 6-4 14H9L5 8l7-6z"/></svg>
            <span class="dice-name">d10</span>
          </button>
          <button class="dice-btn" onclick="rollDice(12, store.diceCount, store.diceModifier, store.d20RollMode)">
            <svg viewBox="0 0 24 24"><path d="M12 2l6 4v8l-6 8-6-8V6l6-4z"/></svg>
            <span class="dice-name">d12</span>
          </button>
          <button class="dice-btn" style="border-color: var(--color-gold);" onclick="rollDice(20, store.diceCount, store.diceModifier, store.d20RollMode)">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l4 12 6 3 6-3 4-12L12 2zm0 2.8l3.6 4.2H8.4L12 4.8zm-5 5.2h10l-5 6.5-5-6.5z"/></svg>
            <span class="dice-name" style="color: var(--color-gold-light);">d20</span>
          </button>
          <button class="dice-btn" onclick="rollDice(100, store.diceCount, store.diceModifier, store.d20RollMode)">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
            <span class="dice-name">d100</span>
          </button>
        </div>

        <!-- Big Visual Result Showcase -->
        <div class="dice-result-showcase">
          ${last ? `
            <div class="dice-result-total ${last.isNat20 ? "nat20" : last.isNat1 ? "nat1" : ""}">
              ${last.total}
            </div>
            <div style="font-family: var(--font-display); font-size: var(--font-md); font-weight: 700; color: var(--color-gold-light); margin-top: var(--space-xs);">
              ${last.isNat20 ? "🌟 NATURAL 20! CRITICAL HIT! 🌟" : last.isNat1 ? "💀 NATURAL 1! CRITICAL FUMBLE! 💀" : last.dice + (last.modifier ? (last.modifier > 0 ? " +" + last.modifier : " " + last.modifier) : "")}
            </div>
            <div class="dice-result-formula">
              Rolls: [${last.rolls.join(", ")}] ${last.discarded !== null ? `(discarded: ${last.discarded})` : ""} ${last.modifier ? `+ (${last.modifier})` : ""}
            </div>
          ` : `
            <div style="color: var(--text-muted); font-size: var(--font-sm);">
              Click any die above to roll!
            </div>
          `}
        </div>

        <!-- Dice Roll History -->
        <div class="card" style="margin-top: var(--space-md); max-height: 240px; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs);">
            <span class="form-label" style="margin: 0;">Recent Rolls</span>
            <button class="btn btn-ghost btn-sm" onclick="store.diceHistory = []; store.lastRoll = null; store.saveToStorage(); renderApp();">Clear</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; font-size: var(--font-xs);">
            ${store.diceHistory.length === 0 ? `
              <span style="color: var(--text-subtle);">No roll history yet.</span>
            ` : store.diceHistory.map(r => `
              <div style="display: flex; justify-content: space-between; padding: 4px 8px; background: rgba(15, 14, 19, 0.4); border-radius: var(--radius-sm); border-left: 2px solid ${r.isNat20 ? "#34d399" : r.isNat1 ? "#ef4444" : "var(--color-gold)"};">
                <span><strong>${r.dice}</strong> [${r.rolls.join(",")}] ${r.modifier ? (r.modifier > 0 ? "+" + r.modifier : r.modifier) : ""}</span>
                <strong style="color: ${r.isNat20 ? "#34d399" : r.isNat1 ? "#ef4444" : "var(--color-gold-light)"}; font-size: 0.95rem;">${r.total}</strong>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Right Column: 5e Rules & Conditions Quick Reference -->
      <div>
        <div style="margin-bottom: var(--space-md);">
          <h2 style="font-size: var(--font-lg); color: var(--color-gold-light);">5e Rules Reference</h2>
          <p style="font-size: var(--font-xs); color: var(--text-muted);">Quick mechanical lookups for conditions, cover, and actions in combat.</p>
        </div>

        <div class="card" style="display: flex; flex-direction: column; gap: var(--space-sm);">
          <h3 style="font-size: var(--font-md); color: var(--color-gold-light); border-bottom: 1px solid var(--border-dungeon); padding-bottom: 4px;">
            Conditions Reference
          </h3>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 480px; overflow-y: auto; padding-right: 4px;">
            ${CONDITIONS.map(cond => `
              <div style="padding: 6px 10px; background: rgba(15, 14, 19, 0.5); border-radius: var(--radius-sm); border-left: 3px solid ${cond.color};">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                  <strong style="color: ${cond.color}; font-size: var(--font-xs);">${cond.name}</strong>
                </div>
                <p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.35;">${cond.desc}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// MODAL CONTROLS & EVENT HANDLERS
// ==========================================

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("open");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("open");
}

// Damage / Heal Modal
function openDamageHealModal(combatantId) {
  const c = store.encounter.combatants.find(comb => comb.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;

  document.getElementById("modal-dmg-name").textContent = c.name;
  document.getElementById("modal-dmg-hp-display").textContent = `${c.currentHp} / ${c.maxHp} HP (Temp: ${c.tempHp || 0})`;
  document.getElementById("modal-dmg-input").value = "";
  openModal("modal-damage-heal");
}

function submitDamage(isHeal) {
  const amount = parseInt(document.getElementById("modal-dmg-input").value, 10);
  if (isNaN(amount) || amount <= 0) {
    showToast("Enter a positive number");
    return;
  }
  if (isHeal) {
    applyHealing(store.activeCombatantId, amount);
  } else {
    applyDamage(store.activeCombatantId, amount);
  }
  closeModal("modal-damage-heal");
}

function submitTempHp() {
  const amount = parseInt(document.getElementById("modal-dmg-input").value, 10);
  if (isNaN(amount) || amount < 0) {
    showToast("Enter a valid number");
    return;
  }
  setTempHp(store.activeCombatantId, amount);
  closeModal("modal-damage-heal");
}

function submitSetDirectHp() {
  const amount = parseInt(document.getElementById("modal-dmg-input").value, 10);
  if (isNaN(amount) || amount < 0) {
    showToast("Enter a valid HP number");
    return;
  }
  setHpDirect(store.activeCombatantId, amount);
  closeModal("modal-damage-heal");
}

// AC & Cover Modal
function openAcModal(combatantId) {
  const c = store.encounter.combatants.find(comb => comb.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;

  document.getElementById("modal-ac-name").textContent = c.name;
  document.getElementById("modal-ac-input").value = c.baseArmorClass || c.armorClass;
  document.getElementById("modal-ac-cover-select").value = c.coverType || "NONE";
  openModal("modal-ac");
}

function submitAcUpdate() {
  const baseAc = parseInt(document.getElementById("modal-ac-input").value, 10);
  const cover = document.getElementById("modal-ac-cover-select").value;
  if (isNaN(baseAc) || baseAc < 1) {
    showToast("Enter a valid AC");
    return;
  }
  updateArmorClass(store.activeCombatantId, baseAc, cover);
  closeModal("modal-ac");
}

// Speed & Difficult Terrain Modal
function openSpeedModal(combatantId) {
  const c = store.encounter.combatants.find(comb => comb.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;

  document.getElementById("modal-speed-name").textContent = c.name;
  document.getElementById("modal-speed-input").value = c.baseSpeed || c.speed;
  document.getElementById("modal-speed-diff-checkbox").checked = !!c.isDifficultTerrain;
  openModal("modal-speed");
}

function submitSpeedUpdate() {
  const baseSpeed = parseInt(document.getElementById("modal-speed-input").value, 10);
  const isDiff = document.getElementById("modal-speed-diff-checkbox").checked;
  if (isNaN(baseSpeed) || baseSpeed < 0) {
    showToast("Enter a valid speed");
    return;
  }
  updateSpeed(store.activeCombatantId, baseSpeed, isDiff);
  closeModal("modal-speed");
}

// Conditions Modal
function openConditionsModal(combatantId) {
  const c = store.encounter.combatants.find(comb => comb.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;

  document.getElementById("modal-conditions-name").textContent = c.name;
  const container = document.getElementById("modal-conditions-grid");
  container.innerHTML = CONDITIONS.map(cond => {
    const isChecked = (c.conditions || []).includes(cond.id);
    return `
      <label style="display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: var(--bg-dungeon-card-elevated); border: 1px solid ${isChecked ? cond.color : "var(--border-dungeon)"}; border-radius: var(--radius-sm); cursor: pointer;">
        <input type="checkbox" ${isChecked ? "checked" : ""} onchange="toggleCondition('${combatantId}', '${cond.id}')">
        <span style="font-size: var(--font-xs); font-weight: 600; color: ${isChecked ? cond.color : "var(--text-white)"};">${cond.name}</span>
      </label>
    `;
  }).join("");

  openModal("modal-conditions");
}

// Initiative Edit Modal
function openInitiativeEditModal(combatantId) {
  const c = store.encounter.combatants.find(comb => comb.id === combatantId);
  if (!c) return;
  store.activeCombatantId = combatantId;

  document.getElementById("modal-init-name").textContent = c.name;
  document.getElementById("modal-init-input").value = c.initiativeRoll;
  openModal("modal-initiative");
}

function submitInitiative() {
  const val = parseInt(document.getElementById("modal-init-input").value, 10);
  if (isNaN(val)) {
    showToast("Enter a valid score");
    return;
  }
  setInitiative(store.activeCombatantId, val);
  closeModal("modal-initiative");
}

function rollSingleCombatantInitiative() {
  const c = store.encounter.combatants.find(comb => comb.id === store.activeCombatantId);
  if (!c) return;
  const roll = rollD20() + c.initiativeModifier;
  setInitiative(store.activeCombatantId, roll);
  closeModal("modal-initiative");
}

// Party Initiative Batch Modal
function openPartyInitiativeModal() {
  const partyInCombat = store.encounter.combatants.filter(c => c.isPlayer);
  if (partyInCombat.length === 0) {
    showToast("No party members in the combat arena!");
    return;
  }

  const container = document.getElementById("modal-party-init-list");
  container.innerHTML = partyInCombat.map(c => `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); padding: var(--space-xs) 0; border-bottom: 1px solid var(--border-dungeon);">
      <div>
        <strong style="color: var(--text-white); font-size: var(--font-sm);">${c.name}</strong>
        <div style="font-size: var(--font-xs); color: var(--text-muted);">Mod: ${c.initiativeModifier >= 0 ? "+" + c.initiativeModifier : c.initiativeModifier}</div>
      </div>
      <div style="display: flex; align-items: center; gap: var(--space-xs);">
        <input type="number" class="form-input party-init-field" data-id="${c.id}" value="${c.initiativeRoll}" style="width: 70px; text-align: center;">
        <button class="btn btn-secondary btn-sm" onclick="this.previousElementSibling.value = rollD20() + ${c.initiativeModifier};">Roll</button>
      </div>
    </div>
  `).join("");

  openModal("modal-party-initiative");
}

function submitPartyInitiatives() {
  document.querySelectorAll(".party-init-field").forEach(field => {
    const id = field.dataset.id;
    const val = parseInt(field.value, 10);
    if (!isNaN(val)) {
      const combatant = store.encounter.combatants.find(c => c.id === id);
      if (combatant) combatant.initiativeRoll = val;
    }
  });

  if (store.encounter.isCombatStarted) {
    store.encounter.combatants = sortCombatants(store.encounter.combatants);
  }
  store.logEvent("Applied party initiative scores", "info");
  store.saveToStorage();
  closeModal("modal-party-initiative");
  renderApp();
  showToast("Party initiatives applied!");
}

function rollAllPartyInModal() {
  document.querySelectorAll(".party-init-field").forEach(field => {
    const id = field.dataset.id;
    const c = store.encounter.combatants.find(comb => comb.id === id);
    if (c) {
      field.value = rollD20() + c.initiativeModifier;
    }
  });
}

// Add Enemy / Custom Monster Modal
function openAddEnemyModal() {
  document.getElementById("modal-enemy-name").value = "";
  document.getElementById("modal-enemy-hp").value = 15;
  document.getElementById("modal-enemy-ac").value = 13;
  document.getElementById("modal-enemy-mod").value = 1;
  document.getElementById("modal-enemy-count").value = 1;
  document.getElementById("modal-enemy-cr").value = "CR 1/2";
  document.getElementById("modal-enemy-speed").value = 30;
  document.getElementById("modal-enemy-notes").value = "";
  openModal("modal-add-enemy");
}

function submitAddEnemy() {
  const name = document.getElementById("modal-enemy-name").value.trim();
  const hp = parseInt(document.getElementById("modal-enemy-hp").value, 10);
  const ac = parseInt(document.getElementById("modal-enemy-ac").value, 10);
  const mod = parseInt(document.getElementById("modal-enemy-mod").value, 10) || 0;
  const count = parseInt(document.getElementById("modal-enemy-count").value, 10) || 1;
  const cr = document.getElementById("modal-enemy-cr").value.trim();
  const speed = parseInt(document.getElementById("modal-enemy-speed").value, 10) || 30;
  const notes = document.getElementById("modal-enemy-notes").value.trim();

  if (!name) {
    showToast("Please enter a monster name");
    return;
  }
  if (isNaN(hp) || hp <= 0) {
    showToast("Please enter valid HP");
    return;
  }
  if (isNaN(ac) || ac <= 0) {
    showToast("Please enter valid AC");
    return;
  }

  addEnemyToEncounter(name, hp, ac, mod, count, true, cr, notes, speed);
  closeModal("modal-add-enemy");
}

// Character Creator / Editor Modal
let characterEditTargetId = null;

function openCharacterModal(characterId = null) {
  characterEditTargetId = characterId;
  const isEdit = !!characterId;
  document.getElementById("modal-char-title").textContent = isEdit ? "Edit Character" : "New Player Character";

  if (isEdit) {
    const pc = store.party.find(p => p.id === characterId);
    if (!pc) return;
    document.getElementById("modal-char-name").value = pc.name;
    document.getElementById("modal-char-player").value = pc.playerName || "";
    document.getElementById("modal-char-class").value = pc.characterClass;
    document.getElementById("modal-char-level").value = pc.level;
    document.getElementById("modal-char-hp").value = pc.maxHp;
    document.getElementById("modal-char-ac").value = pc.armorClass;
    document.getElementById("modal-char-mod").value = pc.initiativeModifier;
    document.getElementById("modal-char-speed").value = pc.speed || 30;
    document.getElementById("modal-char-percep").value = pc.passivePerception || 10;
    document.getElementById("modal-char-dc").value = pc.spellDc || "";
    document.getElementById("modal-char-notes").value = pc.notes || "";
  } else {
    document.getElementById("modal-char-name").value = "";
    document.getElementById("modal-char-player").value = "";
    document.getElementById("modal-char-class").value = "Fighter";
    document.getElementById("modal-char-level").value = 1;
    document.getElementById("modal-char-hp").value = 12;
    document.getElementById("modal-char-ac").value = 14;
    document.getElementById("modal-char-mod").value = 0;
    document.getElementById("modal-char-speed").value = 30;
    document.getElementById("modal-char-percep").value = 10;
    document.getElementById("modal-char-dc").value = "";
    document.getElementById("modal-char-notes").value = "";
  }

  openModal("modal-character");
}

function submitCharacterForm() {
  const name = document.getElementById("modal-char-name").value.trim();
  const player = document.getElementById("modal-char-player").value.trim();
  const charClass = document.getElementById("modal-char-class").value.trim();
  const level = parseInt(document.getElementById("modal-char-level").value, 10) || 1;
  const hp = parseInt(document.getElementById("modal-char-hp").value, 10);
  const ac = parseInt(document.getElementById("modal-char-ac").value, 10);
  const mod = parseInt(document.getElementById("modal-char-mod").value, 10) || 0;
  const speed = parseInt(document.getElementById("modal-char-speed").value, 10) || 30;
  const percep = parseInt(document.getElementById("modal-char-percep").value, 10) || 10;
  const dcInput = document.getElementById("modal-char-dc").value.trim();
  const dc = dcInput ? parseInt(dcInput, 10) : null;
  const notes = document.getElementById("modal-char-notes").value.trim();

  if (!name) {
    showToast("Name is required");
    return;
  }
  if (isNaN(hp) || hp <= 0) {
    showToast("Valid HP is required");
    return;
  }
  if (isNaN(ac) || ac <= 0) {
    showToast("Valid AC is required");
    return;
  }

  if (characterEditTargetId) {
    // Edit existing
    store.party = store.party.map(p => {
      if (p.id === characterEditTargetId) {
        return {
          ...p,
          name, playerName: player, characterClass: charClass, level,
          maxHp: hp, currentHp: hp, armorClass: ac, initiativeModifier: mod,
          speed, passivePerception: percep, spellDc: dc, notes
        };
      }
      return p;
    });

    // Also sync with active encounter if combatant present
    store.encounter.combatants = store.encounter.combatants.map(c => {
      if (c.characterId === characterEditTargetId) {
        return {
          ...c,
          name, maxHp: hp, armorClass: ac, baseArmorClass: ac,
          initiativeModifier: mod, speed, baseSpeed: speed,
          passivePerception: percep, spellDc: dc, notes
        };
      }
      return c;
    });
    showToast(`Updated ${name}`);
  } else {
    // Create new
    const newPc = {
      id: "pc-" + Date.now(),
      name, playerName: player, characterClass: charClass, level,
      maxHp: hp, currentHp: hp, tempHp: 0, armorClass: ac, initiativeModifier: mod,
      speed, passivePerception: percep, spellDc: dc, notes
    };
    store.party.push(newPc);
    showToast(`Added ${name} to party!`);
  }

  store.saveToStorage();
  closeModal("modal-character");
  renderApp();
}

function deleteCharacter(characterId) {
  const pc = store.party.find(p => p.id === characterId);
  if (!pc) return;
  if (!confirm(`Are you sure you want to delete ${pc.name}?`)) return;

  store.party = store.party.filter(p => p.id !== characterId);
  store.encounter.combatants = store.encounter.combatants.filter(c => c.characterId !== characterId);
  store.saveToStorage();
  renderApp();
  showToast(`Deleted ${pc.name}`);
}

// ==========================================
// DATA BACKUP & RESTORE (JSON EXPORT/IMPORT)
// ==========================================

function exportDataAsJson() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    party: store.party,
    encounter: store.encounter,
    diceHistory: store.diceHistory
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `dnd_combat_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Exported backup JSON!");
}

function triggerImportJson() {
  const fileInput = document.getElementById("file-import-input");
  if (fileInput) fileInput.click();
}

function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.party && Array.isArray(data.party)) {
        store.party = data.party;
      }
      if (data.encounter) {
        store.encounter = data.encounter;
      }
      store.saveToStorage();
      renderApp();
      showToast("Data imported successfully!");
    } catch (err) {
      alert("Failed to parse JSON file: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Navigation tab click listeners
  document.querySelectorAll("[data-tab]").forEach(button => {
    button.addEventListener("click", () => {
      store.currentTab = button.dataset.tab;
      renderApp();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Modal backdrop click to close
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("open");
      }
    });
  });

  // Register service worker for offline / PWA support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Initial render
  renderApp();
});
