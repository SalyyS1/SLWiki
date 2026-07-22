(function () {
  "use strict";

  const mechanic = (id, summary, modes, params, example, aliases, category, limits) => ({
    kind: "Mechanic",
    id,
    name: id,
    summary,
    modes,
    params,
    aliases: aliases || [],
    category: category || "Core",
    limits: limits || "Chance, cooldown, formulas, and conditions are evaluated before mutation.",
    example,
    href: "reference.html#mechanic-" + id.toLowerCase().replaceAll("_", "-")
  });

  const condition = (id, summary, syntax, example, aliases, limits, category) => ({
    kind: "RPG condition",
    id,
    name: id,
    summary,
    syntax,
    aliases: aliases || [],
    category: category || "Stateful RPG",
    limits: limits || "Malformed values fail closed.",
    example,
    href: "reference.html#condition-" + id.toLowerCase().replaceAll("_", "-")
  });

  const environment = (id, summary, example) => ({
    kind: "Environment condition",
    id,
    name: id,
    summary,
    syntax: id,
    aliases: [],
    limits: "Unknown or malformed names fail closed.",
    example,
    href: "reference.html#environment-" + id.toLowerCase().replaceAll("_", "-").replace(/[<>]/g, "")
  });

  const trigger = (id, summary, aliases, example) => ({
    kind: "Trigger",
    id,
    name: id,
    summary,
    aliases: aliases || [],
    example: example || "mode: " + id,
    href: "reference.html#trigger-" + id.toLowerCase().replaceAll("_", "-")
  });

  const mythicMechanic = (id, summary, params, example, aliases, limits) => ({
    kind: "Mythic mechanic",
    id,
    name: id,
    summary,
    modes: ["MythicMobs skill"],
    params,
    aliases: aliases || [],
    category: "Mythic bridge",
    limits: limits || "Synchronous only; invalid selectors and values fail closed.",
    example,
    href: "reference.html#mythic-mechanic-" + id.toLowerCase()
  });

  const mythicCondition = (id, summary, syntax, example, aliases, limits) => ({
    kind: "Mythic condition",
    id,
    name: id,
    summary,
    syntax,
    aliases: aliases || [],
    category: "Mythic bridge",
    limits: limits || "Reads live player equipment only; malformed config fails closed.",
    example,
    href: "reference.html#mythic-condition-" + id.toLowerCase()
  });

  const equipmentCondition = (id, category, summary, syntax, example, limits) => ({
    kind: category + " condition",
    id,
    name: id,
    summary,
    syntax,
    aliases: [],
    category,
    limits: limits || "Requires matching typed event context; malformed values fail closed.",
    example,
    href: "reference.html#equipment-condition-" + id.toLowerCase().replaceAll("_", "-")
  });

  const mechanics = [
    mechanic("MULTIPLY_DROPS", "Multiplies block or mob drops before smelting and inventory delivery.", ["BREAK_BLOCK", "KILL_ENTITY"], ["multiplier (formula, default 2)", "target: ALL | ORE | MYTHICMOBS"], `mechanics:
  - type: MULTIPLY_DROPS
    mode: BREAK_BLOCK
    chance: "35+{level}*10"
    multiplier: "1+{level}"
    target: ORE`),
    mechanic("AUTO_SMELT", "Converts supported mined drops through the built-in smelting map.", ["BREAK_BLOCK"], ["chance", "cooldown", "conditions"], `mechanics:
  - type: AUTO_SMELT
    mode: BREAK_BLOCK
    chance: "50+{level}*10"`, ["SMELTING", "SMELT", "AUTOSMELT"]),
    mechanic("BLAST_MINE", "Breaks a configurable cuboid, plane, or ellipsoid and routes every extra block through protection and drop pipelines.", ["BREAK_BLOCK"], ["radius/r (0-8)", "radius_x/rx (0-8)", "radius_y/ry (0-4)", "radius_z/rz (0-8)", "shape: CUBE | PLANE | SPHERE", "max_blocks/max/mb (1-512)", "durability_per_block", "respect_unbreaking", "blocks.include/exclude/level-unlocks"], `mechanics:
  - type: BLAST_MINE
    mode: BREAK_BLOCK
    radius_x: "1+floor({level}/3)"
    radius_y: "0"
    radius_z: "1+floor({level}/3)"
    shape: PLANE
    max_blocks: "9+{level}*8"
    durability_per_block: true
    respect_unbreaking: true
    blocks:
      include: ["#minecraft:mineable/pickaxe"]
      exclude: ["SPAWNER"]`),
    mechanic("VEIN_MINE", "Walks connected blocks with configurable adjacency and level-gated material rules.", ["BREAK_BLOCK"], ["max_blocks/max/mb (1-256)", "connectivity: 6 | 18 | 26", "same_type", "durability_per_block", "respect_unbreaking", "blocks.include/exclude/level-unlocks"], `mechanics:
  - type: VEIN_MINE
    mode: BREAK_BLOCK
    max_blocks: "8+{level}*8"
    connectivity: "26"
    same_type: false
    blocks:
      level-unlocks:
        1: ["IRON_ORE", "DEEPSLATE_IRON_ORE"]
        3: ["DIAMOND_ORE", "DEEPSLATE_DIAMOND_ORE"]
        5: ["ANCIENT_DEBRIS"]`),
    mechanic("TREE_FELLER", "Traverses nearby log blocks while honoring protection events, durability, and material selectors.", ["BREAK_BLOCK"], ["max_blocks/max/mb (1-256)", "search_radius/r (1-2)", "durability_per_block", "respect_unbreaking", "blocks.include/exclude/level-unlocks"], `mechanics:
  - type: TREE_FELLER
    mode: BREAK_BLOCK
    max_blocks: "24+{level}*16"
    search_radius: "1"
    blocks:
      include: ["#minecraft:logs"]
      exclude: ["STRIPPED_OAK_LOG"]`),
    mechanic("HARVEST_AREA", "Harvests mature crops in a horizontal area and can combine with multiply, telekinesis, and replant.", ["BREAK_BLOCK"], ["radius/r (0-8)", "max_blocks/max/mb (1-289)", "durability_per_block", "respect_unbreaking", "blocks.include/exclude/level-unlocks"], `mechanics:
  - type: HARVEST_AREA
    mode: BREAK_BLOCK
    radius: "min(1+{level}, 4)"
    max_blocks: "25+{level}*16"
    blocks:
      include: ["WHEAT", "CARROTS", "POTATOES"]`),
    mechanic("TELEKINESIS", "Moves coordinated block or mob drops into the player's inventory and drops only overflow.", ["BREAK_BLOCK", "KILL_ENTITY"], ["chance", "cooldown", "conditions"], `mechanics:
  - type: TELEKINESIS
    mode: BREAK_BLOCK
    chance: "100"`),
    mechanic("REPLANT", "Replants a mature crop one tick after a successful harvest.", ["BREAK_BLOCK"], ["chance", "cooldown", "conditions"], `mechanics:
  - type: REPLANT
    mode: BREAK_BLOCK
    chance: "70+{level}*6"`),
    mechanic("MULTIPLY_MOB_DROPS", "Duplicates entity drops, including MythicMobs and MMOItems drops.", ["KILL_ENTITY"], ["multiplier (formula, default 2)", "target: ALL | MYTHICMOBS"], `mechanics:
  - type: MULTIPLY_MOB_DROPS
    mode: KILL_ENTITY
    chance: "15+{level}*5"
    multiplier: "2"
    target: MYTHICMOBS`),
    mechanic("MULTIPLY_EXP", "Scales experience dropped by mined blocks or killed entities.", ["BREAK_BLOCK", "KILL_ENTITY"], ["multiplier (formula, default 2)"], `mechanics:
  - type: MULTIPLY_EXP
    mode: KILL_ENTITY
    multiplier: "1.25+{level}*0.25"`),
    mechanic("HEAD_DROP", "Adds a head for supported vanilla mobs or the killed player when the mechanic passes its chance gate.", ["KILL_ENTITY"], ["chance", "cooldown", "conditions"], `mechanics:
  - type: HEAD_DROP
    mode: KILL_ENTITY
    chance: "2+{level}*2"`),
    mechanic("BONUS_MONEY", "Deposits a formula-driven Vault economy reward after a valid trigger.", ["KILL_ENTITY"], ["amount (formula, default 10)"], `mechanics:
  - type: BONUS_MONEY
    mode: KILL_ENTITY
    chance: "20"
    amount: "5+{level}*4"`),
    mechanic("MENDING_REPAIR", "Consumes only the XP needed to repair the enchanted item, with bounded repair efficiency.", ["XP_GAIN"], ["repair-per-xp (formula, clamped 0.1-20)", "chance", "cooldown", "conditions"], `mechanics:
  - type: MENDING_REPAIR
    mode: XP_GAIN
    repair-per-xp: "1.5+{level}*0.5"
    cooldown: "0"`, ["MENDING", "REPAIR_WITH_XP", "XP_REPAIR"]),
    mechanic("SOULBOUND", "Removes an eligible item from death drops and restores it after respawn; optional charges persist on the item.", ["DEATH"], ["uses (-1 for unlimited, otherwise formula)", "chance", "conditions"], `mechanics:
  - type: SOULBOUND
    mode: DEATH
    chance: "60+{level}*8"
    uses: "1+floor({level}/2)"`, ["KEEP_ON_DEATH", "RECOVER_ITEM", "SOUL_BIND"]),
    mechanic("CLEAVE", "Damages up to 24 nearby living targets around the primary melee target.", ["ATTACK"], ["radius (default 3, max 6)", "damage_percent (default 35, max 100)"], `mechanics:
  - type: CLEAVE
    mode: ATTACK
    chance: "15+{level}*5"
    radius: "2+{level}*0.4"
    damage_percent: "25+{level}*5"`, [], "Weapon", "Secondary damage is capped at 40 and cannot trigger another enchant damage pipeline."),
    mechanic("EXECUTE", "Amplifies melee damage while the target is below a configurable health percentage.", ["ATTACK"], ["health_threshold (default 20, 0-100)", "multiplier (default 1.5, 1-4)"], `mechanics:
  - type: EXECUTE
    mode: ATTACK
    health_threshold: "12+{level}*3"
    multiplier: "1.25+{level}*0.15"`, [], "Weapon", "Combined attack scaling is capped at 8x the original event damage."),
    mechanic("LIFESTEAL", "Heals the attacker from final damage dealt by the current melee hit.", ["ATTACK"], ["percent (default 10, 0-100)"], `mechanics:
  - type: LIFESTEAL
    mode: ATTACK
    chance: "25+{level}*5"
    percent: "6+{level}*3"`, [], "Weapon", "Healing is capped at 40 health per activation and never exceeds max health."),
    mechanic("KNOCKBACK", "Adds directional horizontal and vertical velocity to the melee target.", ["ATTACK"], ["strength (default 0.6, max 3)", "vertical (default 0.25, max 1.5)"], `mechanics:
  - type: KNOCKBACK
    mode: ATTACK
    strength: "0.35+{level}*0.12"
    vertical: "0.2+{level}*0.04"`, [], "Weapon"),
    mechanic("CRITICAL_STRIKE", "Multiplies melee event damage after chance and condition gates pass.", ["ATTACK"], ["multiplier (default 1.5, 1-4)"], `mechanics:
  - type: CRITICAL_STRIKE
    mode: ATTACK
    chance: "8+{level}*4"
    multiplier: "1.4+{level}*0.1"`, [], "Weapon", "Combined attack scaling is capped at 8x the original event damage."),
    mechanic("DAMAGE_REDUCTION", "Reduces incoming damage using additive percentages across eligible armor pieces.", ["DAMAGED"], ["percent (default 10)"], `mechanics:
  - type: DAMAGE_REDUCTION
    mode: DAMAGED
    percent: "3+{level}*2"`, [], "Armor", "All armor reduction, including projectile ward, is capped at 80%."),
    mechanic("DODGE", "Cancels the incoming damage event after chance, cooldown, soul, and condition checks.", ["DAMAGED"], ["chance", "cooldown", "conditions"], `mechanics:
  - type: DODGE
    mode: DAMAGED
    chance: "3+{level}*2"
    cooldown: "80"`, [], "Armor"),
    mechanic("THORNS", "Returns bounded secondary damage to the living attacker.", ["DAMAGED"], ["damage (default 2, total max 40)"], `mechanics:
  - type: THORNS
    mode: DAMAGED
    chance: "20+{level}*4"
    damage: "1+{level}*0.75"`, [], "Armor", "Returned damage cannot re-enter OmniEnchant combat mechanics."),
    mechanic("PROJECTILE_WARD", "Adds damage reduction only when the incoming damager is a projectile.", ["DAMAGED"], ["percent (default 15)"], `mechanics:
  - type: PROJECTILE_WARD
    mode: DAMAGED
    percent: "6+{level}*3"
    conditions: ["DAMAGE_CAUSE_PROJECTILE"]`, [], "Armor", "Combined armor reduction is capped at 80%."),
    mechanic("SECOND_WIND", "Schedules a bounded heal when predicted post-hit health falls below the configured threshold.", ["DAMAGED"], ["health_threshold (default 25, 0-100)", "heal (default 4, max 40)"], `mechanics:
  - type: SECOND_WIND
    mode: DAMAGED
    cooldown: "400"
    health_threshold: "25"
    heal: "2+{level}*2"`, [], "Armor", "The heal runs one entity-safe tick later and does not revive dead players."),
    mechanic("DURABILITY_SHIELD", "Reduces or fully cancels durability consumed by PlayerItemDamageEvent.", ["ITEM_DAMAGE"], ["percent (default 50, 0-100)"], `mechanics:
  - type: DURABILITY_SHIELD
    mode: ITEM_DAMAGE
    chance: "30+{level}*8"
    percent: "35+{level}*10"`, [], "Tool"),
    mechanic("TOOL_REPAIR", "Repairs the enchanted tool after a valid block break.", ["BREAK_BLOCK"], ["amount (default 1, max 250)"], `mechanics:
  - type: TOOL_REPAIR
    mode: BREAK_BLOCK
    cooldown: "20"
    amount: "1+floor({level}/2)"`, [], "Tool"),
    mechanic("MINING_HASTE", "Refreshes a bounded vanilla Haste effect after a valid block break.", ["BREAK_BLOCK"], ["duration ticks (default 60, max 1200)", "amplifier (default 0, max 9)"], `mechanics:
  - type: MINING_HASTE
    mode: BREAK_BLOCK
    duration: "40+{level}*20"
    amplifier: "floor(({level}-1)/2)"`, [], "Tool"),
    mechanic("AUTO_TORCH", "Places and consumes a real torch in the broken block when light is low and protection allows it.", ["BREAK_BLOCK"], ["light_below (default 8, 1-15)"], `mechanics:
  - type: AUTO_TORCH
    mode: BREAK_BLOCK
    cooldown: "10"
    light_below: "8"`, [], "Tool", "Fires cancellable BlockPlaceEvent before placement; no torch is consumed when blocked."),
    mechanic("MINING_XP", "Adds bounded experience to the current block break drop.", ["BREAK_BLOCK"], ["amount (default 1, total event max 1000)"], `mechanics:
  - type: MINING_XP
    mode: BREAK_BLOCK
    amount: "1+{level}*2"`, [], "Tool")
  ];

  const mythicMechanics = [
    mythicMechanic("omniEnchantItem", "Sets, adds, subtracts, or removes one OmniEnchant through the canonical slot and lifecycle API.", ["id/enchant", "level/amount (default 1)", "mode: SET | ADD | SUBTRACT | REMOVE", "slot (default TRIGGER)", "clamp (default false)", "source"], `RewardUpgrade:
  Skills:
    - omniEnchantItem{id=ember_brand;level=1;mode=ADD;slot=HAND;clamp=true} @trigger`, ["omiMutateEnchant", "omiEnchantItem"], "One live equipped MMOItem only. Slot capacity, applicability, conflicts, max level, lore, and events are enforced."),
    mythicMechanic("omniItemDurability", "Repairs, damages, or sets durability on one equipped MMOItem without destroying it.", ["amount (default 1)", "mode: REPAIR | DAMAGE | SET_DAMAGE | SET_REMAINING", "slot (default TRIGGER)", "percent (default false)", "source"], `FieldRepair:
  Skills:
    - omniItemDurability{mode=REPAIR;amount=15;slot=HAND} @trigger`, ["omiDurability"], "Amount must be non-negative; percent is 0-100; resulting damage clamps below item breakage."),
    mythicMechanic("omniItemSouls", "Adds, subtracts, or sets PvE, PvP, or total souls on a tracked equipped MMOItem.", ["amount (default 1)", "mode: ADD | SUBTRACT | SET", "pool: PVE | PVP | TOTAL", "slot (default TRIGGER)", "source"], `SoulReward:
  Skills:
    - omniItemSouls{mode=ADD;amount=5;pool=PVE;slot=HAND} @trigger`, ["omiSouls"], "Requires an enabled soul tracker. Values clamp to 0-1,000,000; TOTAL writes a canonical PvE total and clears PvP."),
    mythicMechanic("omniCompactSlots", "Packs occupied logical slots on one or all selected live equipped MMOItems.", ["slots: TRIGGER | HAND | OFF_HAND | HEAD | CHEST | LEGS | FEET | ALL", "source"], `PrepareRaidGear:
  Skills:
    - omniCompactSlots{slots=ALL} @trigger`, ["omiCompact"], "Compaction changes physical slot order only; member compact display mode remains a separate preference."),
    mythicMechanic("omniGiveEnchantBook", "Creates validated OmniEnchant books as quest or boss rewards and drops only inventory overflow.", ["id/enchant", "level (default 1)", "success/successrate (optional 0-100)", "amount (1-64)"], `BossBookReward:
  Skills:
    - omniGiveEnchantBook{id=storm_caller;level=3;success=65;amount=1} @trigger`, ["omiEnchantBook", "omiGiveBook"], "Unknown IDs, invalid levels, success rates, or amounts fail closed.")
  ];

  const equipmentConditions = [
    equipmentCondition("TARGET_HEALTH_BELOW", "Weapon", "Target health percentage is strictly below the suffix.", "TARGET_HEALTH_BELOW_<percent>", `conditions: ["TARGET_HEALTH_BELOW_25"]`, "Requires an attack target; non-numeric thresholds fail closed."),
    equipmentCondition("TARGET_HEALTH_ABOVE", "Weapon", "Target health percentage is strictly above the suffix.", "TARGET_HEALTH_ABOVE_<percent>", `conditions: ["TARGET_HEALTH_ABOVE_70"]`),
    equipmentCondition("TARGET_ARMOR_BELOW", "Weapon", "Target vanilla armor attribute is below the suffix.", "TARGET_ARMOR_BELOW_<value>", `conditions: ["TARGET_ARMOR_BELOW_10"]`, "Requires a living target with an armor attribute."),
    equipmentCondition("ATTACK_DISTANCE_BELOW", "Weapon", "Attacker-to-target distance is within the configured radius.", "ATTACK_DISTANCE_BELOW_<blocks>", `conditions: ["ATTACK_DISTANCE_BELOW_3.5"]`, "Cross-world and negative distances fail closed."),
    equipmentCondition("TARGET_TYPE", "Weapon", "Matches PLAYER, MOB, MYTHIC, MYTHIC_MOB, or a Bukkit EntityType.", "TARGET_TYPE_<type>", `conditions: ["TARGET_TYPE_MYTHIC"]`, "MYTHIC requires a live MythicMobs ActiveMob."),
    equipmentCondition("DAMAGE_ABOVE", "Armor", "Incoming final damage is strictly above the suffix.", "DAMAGE_ABOVE_<value>", `conditions: ["DAMAGE_ABOVE_8"]`),
    equipmentCondition("DAMAGE_BELOW", "Armor", "Incoming final damage is strictly below the suffix.", "DAMAGE_BELOW_<value>", `conditions: ["DAMAGE_BELOW_20"]`),
    equipmentCondition("DAMAGE_CAUSE", "Armor", "Matches the current Bukkit EntityDamageEvent cause.", "DAMAGE_CAUSE_<cause>", `conditions: ["DAMAGE_CAUSE_PROJECTILE"]`, "Use canonical Bukkit cause names such as ENTITY_ATTACK, PROJECTILE, FIRE, or FALL."),
    equipmentCondition("ATTACKER_DISTANCE_BELOW", "Armor", "Defender-to-living-attacker distance is within the suffix.", "ATTACKER_DISTANCE_BELOW_<blocks>", `conditions: ["ATTACKER_DISTANCE_BELOW_6"]`, "Environmental damage without a living attacker fails."),
    equipmentCondition("ARMOR_ENCHANTS_AT_LEAST", "Armor", "Counts installed OmniEnchants across all four equipped armor items.", "ARMOR_ENCHANTS_AT_LEAST_<count>", `conditions: ["ARMOR_ENCHANTS_AT_LEAST_8"]`),
    equipmentCondition("BLOCK_TYPE", "Tool", "Matches the exact broken Bukkit material.", "BLOCK_TYPE_<material>", `conditions: ["BLOCK_TYPE_DEEPSLATE_DIAMOND_ORE"]`),
    equipmentCondition("BLOCK_TAG", "Tool", "Matches a Bukkit block tag using a namespaced key.", "BLOCK_TAG_<namespace:key>", `conditions: ["BLOCK_TAG_MINECRAFT:MINEABLE/PICKAXE"]`, "Unknown namespaced tags fail closed."),
    equipmentCondition("BLOCK_LIGHT_BELOW", "Tool", "Broken block light level is strictly below the suffix.", "BLOCK_LIGHT_BELOW_<0-15>", `conditions: ["BLOCK_LIGHT_BELOW_8"]`),
    equipmentCondition("BLOCK_Y_RANGE", "Tool", "Broken block Y is inside an inclusive range.", "BLOCK_Y_RANGE_<min>_<max>", `conditions: ["BLOCK_Y_RANGE_-64_20"]`, "Minimum must not exceed maximum."),
    equipmentCondition("TOOL_TYPE", "Tool", "Matches an exact material or a tool family suffix such as PICKAXE, AXE, SHOVEL, HOE, or SHEARS.", "TOOL_TYPE_<material-or-family>", `conditions: ["TOOL_TYPE_PICKAXE"]`)
  ];

  const mythicConditions = [
    mythicCondition("omniHasEnchant", "Checks one OmniEnchant ID and level range on any selected equipped MMOItem.", "omniHasEnchant{id=<id>;level=<range>;slots=<selector>}", `Conditions:
  - omniHasEnchant{id=ember_brand;level=>=3;slots=HAND} true`, ["omiHasEnchant"], "Level accepts comparisons or inclusive intervals; default >0."),
    mythicCondition("omniEnchantCount", "Checks the aggregate occupied enchant count across selected equipped MMOItems.", "omniEnchantCount{amount=<range>;slots=<selector>}", `Conditions:
  - omniEnchantCount{amount=>=8;slots=ALL} true`, ["omiEnchantCount"]),
    mythicCondition("omniEmptyEnchantSlots", "Checks aggregate empty logical slots across selected equipped MMOItems.", "omniEmptyEnchantSlots{amount=<range>;slots=<selector>}", `Conditions:
  - omniEmptyEnchantSlots{amount=>0;slots=HAND} true`, ["omiEmptySlots"]),
    mythicCondition("omniItemDurability", "Checks remaining durability percentage on any selected equipped MMOItem.", "omniItemDurability{percent=<range>;slots=<selector>}", `Conditions:
  - omniItemDurability{percent=<=25;slots=HAND} true`, ["omiDurabilityCondition"], "Range is bounded to 0-100; non-damageable items do not match."),
    mythicCondition("omniItemSouls", "Checks aggregate tracked PvE, PvP, or total souls across selected equipped MMOItems.", "omniItemSouls{amount=<range>;pool=PVE|PVP|TOTAL;slots=<selector>}", `Conditions:
  - omniItemSouls{amount=>=50;pool=TOTAL;slots=HAND} true`, ["omiSoulsCondition"], "Untracked items contribute zero; aggregate maximum is 6,000,000.")
  ];

  const rpgConditions = [
    condition("MYTHIC_KILLS", "Requires a number of kills for one MythicMob internal ID inside a rolling window.", "MYTHIC_KILLS:<mob-id>:<minimum>[:seconds]", `rpg-conditions:
  - "MYTHIC_KILLS:undead_knight:5:20"`, [], "Minimum 1-10,000; window 1-3,600 seconds, default 15."),
    condition("RECENT_ENCHANTS", "Requires every listed enchant to have activated recently; order is not checked.", "RECENT_ENCHANTS:<id,id...>[:seconds]", `rpg-conditions:
  - "RECENT_ENCHANTS:ember_brand,void_mark:12"`, ["RECENT_ENCHANT"], "Window 1-3,600 seconds, default 15."),
    condition("COMBO_HITS", "Requires consecutive direct hits against the current target inside a rolling window.", "COMBO_HITS:<minimum>[:seconds]", `rpg-conditions:
  - "COMBO_HITS:4:6"`, ["COMBO"], "Minimum 1-128; window 1-3,600 seconds, default 15."),
    condition("LETHAL", "Passes when the current final damage would deplete target health plus absorption.", "LETHAL", `rpg-conditions:
  - "LETHAL"`, ["WOULD_KILL"]),
    condition("TARGET_MYTHIC", "Requires the active target to be a MythicMob with one of the listed internal IDs.", "TARGET_MYTHIC:<id,id...>", `rpg-conditions:
  - "TARGET_MYTHIC:undead_knight,void_walker"`, ["MYTHIC_TARGET"]),
    condition("BATCHED_CHANCE", "Shares one random result across a bounded number of ability checks to coordinate multi-effect procs.", "BATCHED_CHANCE:<key>:<chance>[:uses]", `rpg-conditions:
  - "BATCHED_CHANCE:storm_gate:30:3"`, ["SHARED_CHANCE"], "Chance 0-100; uses 1-128, default 2."),
    condition("ITEM_DURABILITY", "Compares remaining durability percentage on the enchant source item.", "ITEM_DURABILITY:<operator><0-100>", `rpg-conditions:
  - "ITEM_DURABILITY:<=25"`, ["ITEM_DURABILITY_PERCENT", "DURABILITY_PERCENT"], "Operators: <, <=, >, >=, =. Non-damageable items fail."),
    condition("ITEM_ENCHANTS", "Requires every listed OmniEnchant to exist on the same source item.", "ITEM_ENCHANTS:<id,id...>", `rpg-conditions:
  - "ITEM_ENCHANTS:vitality,bulwark"`, ["HAS_ITEM_ENCHANTS"]),
    condition("TRIGGER", "Restricts an ability to one live Mythic skill trigger.", "TRIGGER:<EnchantSkillTrigger>", `rpg-conditions:
  - "TRIGGER:PROJECTILE_HIT"`),
    condition("ITEM_SLOT", "Restricts the source item to one Bukkit equipment slot.", "ITEM_SLOT:<EquipmentSlot>", `rpg-conditions:
  - "ITEM_SLOT:HAND"`),
    condition("ENCHANT_SEQUENCE", "Requires an ordered activation recipe, optionally on the same target and optionally reusable.", "ENCHANT_SEQUENCE:<a>b...>:<seconds>[:scope][:consumption]", `rpg-conditions:
  - "ENCHANT_SEQUENCE:ember_brand>void_mark:12:SAME_TARGET:CONSUME"`, ["ACTIVATION_SEQUENCE", "PROC_SEQUENCE"], "2-8 IDs; scope ANY or SAME_TARGET; consumption CONSUME or REUSABLE; window 1-3,600 seconds."),
    condition("ENCHANT_ACTIVATIONS", "Counts repeated activations of one enchant in a rolling window.", "ENCHANT_ACTIVATIONS:<id>:<minimum>:<seconds>[:scope]", `rpg-conditions:
  - "ENCHANT_ACTIVATIONS:ember_brand:3:10:SAME_TARGET"`, ["ACTIVATION_COUNT", "ENCHANT_PROC_COUNT"], "Minimum 1-128; scope ANY or SAME_TARGET; window 1-3,600 seconds.")
  ];

  const environmentConditions = [
    environment("IN_DAY", "World time is between 0 and 12,000 ticks.", `conditions: ["IN_DAY"]`),
    environment("IN_NIGHT", "World time is outside the day interval.", `conditions: ["IN_NIGHT"]`),
    environment("IN_TIME_<from>_<to>", "World time is inside an inclusive custom tick range.", `conditions: ["IN_TIME_6000_12000"]`),
    environment("IN_WATER", "The player is currently in water.", `conditions: ["IN_WATER"]`),
    environment("ON_GROUND", "The player is standing on the ground.", `conditions: ["ON_GROUND"]`),
    environment("IN_RAIN", "The world is storming and the player has sky exposure.", `conditions: ["IN_RAIN"]`),
    environment("IN_LAVA", "The player is currently in lava.", `conditions: ["IN_LAVA"]`),
    environment("IN_BIOME_<BIOME>", "The current Bukkit biome matches the suffix.", `conditions: ["IN_BIOME_DEEP_DARK"]`),
    environment("HEALTH_BELOW_<percent>", "Player health percentage is strictly below the threshold.", `conditions: ["HEALTH_BELOW_35"]`),
    environment("HEALTH_ABOVE_<percent>", "Player health percentage is strictly above the threshold.", `conditions: ["HEALTH_ABOVE_80"]`),
    environment("SNEAKING", "The player is sneaking.", `conditions: ["SNEAKING"]`),
    environment("SPRINTING", "The player is sprinting.", `conditions: ["SPRINTING"]`),
    environment("FLYING", "The player is flying.", `conditions: ["FLYING"]`)
  ];

  const triggers = [
    trigger("BREAK_BLOCK", "Native mechanic mode fired by BlockBreakEvent with the live main-hand MMOItem.", ["MINE", "MINING"]),
    trigger("KILL_ENTITY", "Native mechanic mode fired when the player is the entity killer.", ["ON_KILL"]),
    trigger("ATTACK", "Ability and native mechanic trigger for direct player entity damage.", ["ON_HIT", "ON_ATTACK"]),
    trigger("DAMAGED", "Native armor mechanic mode for incoming damage.", ["DAMAGED_BY_ENTITY", "WHEN_HIT", "ON_DEFEND"]),
    trigger("RIGHT_CLICK", "Ability and native interaction trigger for right click, including shift variants."),
    trigger("BOW_SHOOT", "Native mechanic mode for ranged weapon behavior.", ["SHOOT"]),
    trigger("XP_GAIN", "Native mechanic mode fired when the player receives XP.", ["XP", "EXP", "EXPERIENCE"]),
    trigger("ITEM_DAMAGE", "Ability and native tool mode fired before durability damage commits.", ["DURABILITY_DAMAGE", "TOOL_DAMAGE"]),
    trigger("DEATH", "Native mechanic mode during player death processing.", ["ON_DEATH", "PLAYER_DEATH"]),
    trigger("EQUIP", "Ability lifecycle trigger when an enchanted item becomes equipped; native PASSIVE maps here.", ["PASSIVE"]),
    trigger("DEFEND", "Ability trigger for armor or off-hand enchants when their owner takes damage.", ["ON_DEFEND", "WHEN_HIT"]),
    trigger("KILL", "Ability trigger carrying the killed living target and live weapon context.", ["ON_KILL"]),
    trigger("LEFT_CLICK", "Ability interaction trigger for left click, including shift variants."),
    trigger("SHIELD_BLOCK", "Ability trigger when a shield blocks damage; carries blocked damage context."),
    trigger("CONSUME", "Ability trigger after the player consumes the enchanted source item."),
    trigger("FISH", "Generic fishing ability trigger for any supported fishing state."),
    trigger("FISH_BITE", "Fishing trigger when the hook receives a bite."),
    trigger("FISH_CATCH", "Fishing trigger for CAUGHT_FISH."),
    trigger("FISH_GRAB", "Fishing trigger for CAUGHT_ENTITY."),
    trigger("FISH_GROUND", "Fishing trigger when the hook reaches the ground."),
    trigger("FISH_REEL", "Fishing trigger when the player reels an empty hook."),
    trigger("FISH_FAIL", "Fishing trigger for failed fishing attempts."),
    trigger("CHAIN", "Nested ability trigger emitted by an enchant activation recipe; protected by depth and cycle limits."),
    trigger("TIMER", "Passive equipped-item ability trigger using a bounded interval."),
    trigger("SHOOT", "Ability trigger at projectile launch; context follows the projectile UUID."),
    trigger("PROJECTILE_HIT", "Ability trigger at a tracked projectile impact location or entity."),
    trigger("APPLY", "Lifecycle trigger after an OmniEnchant is installed or its level changes."),
    trigger("REMOVE", "Lifecycle trigger after an OmniEnchant is removed."),
    trigger("UNEQUIP", "Lifecycle trigger when a previously equipped enchanted item leaves its slot."),
    trigger("SLOT_FILLED", "Logical slot lifecycle trigger when an empty enchant slot becomes occupied."),
    trigger("SLOT_EMPTIED", "Logical slot lifecycle trigger when an occupied enchant slot becomes empty."),
    trigger("MYTHIC_SIGNAL", "Runs when a MythicMobs skill emits a matching typed signal for live equipped items.", ["SIGNAL:<id>", "MYTHICSIGNAL:<id>"], `ability:
  raid_finisher:
    type: LIGHTNING
    mode: MYTHIC_SIGNAL:raid_finisher`)
  ];

  const configs = [
    {
      id: "config",
      name: "config.yml",
      path: "plugins/OmniEnchant/config.yml",
      group: "Root",
      summary: "Global limits, diagnostics, update checks, lore ownership, economy, souls, and external lore integration.",
      topics: ["Limits", "Updates", "Lore", "Diagnostics"],
      source: `version: 1
max-enchants-per-item: 5
economy-provider: vault
debug: false
debug-skill-trace: false
debug-skill-trace-capacity: 30
update-checker:
  enabled: true
  repository: "SalyyS1/OminiEnchant"
  notify-operators: true
lore-placeholder: "#omnienchant#"
lore-placeholder-aliases:
  - "#slmmoenchant#"
lore-spacing: 0
external-lore:
  enabled: true`,
      notes: ["`max-enchants-per-item` is the fallback for items without virtual MMOItems slots.", "The updater only reports releases; it never replaces plugin files.", "Missing default keys are added during migration without overwriting existing values."]
    },
    {
      id: "application",
      name: "application.yml",
      path: "plugins/OmniEnchant/settings/application.yml",
      group: "settings/",
      summary: "Drag-drop, anvil, enchanting-table admission, unique activation, dust, and extra-slot behavior.",
      topics: ["Apply", "Anvil", "Slots"],
      source: `drag-drop:
  enabled: true
  base-success-rate: 70.0
  base-failure-rate: 0.0
  allow-upgrade-on-apply: true
anvil:
  enabled: false
enchanting-table:
  enabled: false
unique-activation: true
dust:
  material: GLOWSTONE_DUST
  min-bonus-per-unit: 0.5
  bonus-per-unit: 1.5
  max-bonus: 30.0
extra-slot-limit: 0`,
      notes: ["Set `extra-slot-limit: 0` for no slot-increaser bonus, or a positive server cap.", "Admission revalidates conflicts, item types, levels, and logical slot capacity before mutation."]
    },
    {
      id: "display",
      name: "display.yml",
      path: "plugins/OmniEnchant/settings/display.yml",
      group: "settings/",
      summary: "Detailed and compact enchant lore, virtual slot labels, descriptions, separators, colors, and rarity presentation.",
      topics: ["Lore", "Compact mode", "Slots"],
      source: `display:
  detail-limit: 3
  chars-per-line: 40
  compact-separator: ", "
  name-format: "{rarity} {name} {level}"
  desc-format: "&7  {desc}"
  compact-format: "{enchants}"
  slot-name-format: "&eEnchant Slot {slot}: {rarity_color}{name} {level_roman}"
  slot-empty-format: "&8Enchant Slot {slot}: Empty"
  slot-desc-format:
    - "&7| {desc}"
  show-empty-slots: true
  show-slot-counter: true
  slot-counter-format: "&bEnchant Slot: &a{used}&7/&f{max}"
rarity:
  COMMON:
    display-name: "Common"
    color: "&f"
    weight: 50`,
      notes: ["Detailed mode renders every enchant and description in its configured MMOItems slot.", "Each member can toggle compact lore with `/sle compact`; admins can pack physical slot order with `/sle compact slots`."]
    },
    {
      id: "dust",
      name: "dust.yml",
      path: "plugins/OmniEnchant/settings/dust.yml",
      group: "settings/",
      summary: "Dust crafting GUI, tier recipes, materials, display names, and chance bonuses.",
      topics: ["GUI", "Crafting", "Chance"],
      source: `gui:
  title: "&8Dust Workshop"
  rows: 3
tiers:
  RARE:
    dust-name: "&9Rare Dust"
    dust-material: GLOWSTONE_DUST
    min-rate: 5.0
    max-rate: 12.0
    custom-model-data: 0`,
      notes: ["Tier definitions can choose independent materials and success bonuses.", "All visible names and lore remain configurable."]
    },
    {
      id: "enchant-browser",
      name: "enchant-browser.yml",
      path: "plugins/OmniEnchant/settings/enchant-browser.yml",
      group: "settings/",
      summary: "Member-facing `/sle browse` inventory layout, navigation items, filters, and entry lore.",
      topics: ["GUI", "Browse", "Filters"],
      source: `gui:
  title: "&8OmniEnchant Browser"
  rows: 6
  prev-page:
    slot: 45
    material: ARROW
  next-page:
    slot: 53
    material: ARROW
filter:
  show-rarity: true
  show-max-level: true
  show-stats-at-max: true`,
      notes: ["The browser is safe for members; editing remains permission-gated.", "Navigation slots and visible item presentation are configurable."]
    },
    {
      id: "enchant-table",
      name: "enchant-table.yml",
      path: "plugins/OmniEnchant/settings/enchant-table.yml",
      group: "settings/",
      summary: "Legacy table pools plus deterministic RPG offers, bonus enchant rolls, costs, and preview behavior.",
      topics: ["Table", "RPG offers", "Economy"],
      source: `enabled: true
enchant-list:
  mode: false
  list: []
rpg-offer-engine:
  enabled: true
  session-ttl-seconds: 120
  maximum-cost: 30
  multi-enchant:
    enabled: true
    maximum-enchants-per-offer: 2
    additional-chance-percent: 35`,
      notes: ["RPG offers are stable for the same player, item, slot state, and config generation.", "A click revalidates the item fingerprint and logical slot capacity before writing NBT."]
    },
    {
      id: "extraction",
      name: "extraction.yml",
      path: "plugins/OmniEnchant/settings/extraction.yml",
      group: "settings/",
      summary: "Selective and random extraction rules, scroll material, names, lore, and failure behavior.",
      topics: ["Extraction", "Items", "Chance"],
      source: `selective:
  enabled: true
  default-success-range: "50-80"
  default-destroy-range: "10-25"
random:
  enabled: true
  default-success-range: "40-70"
  default-destroy-range: "15-30"
scroll-material: PAPER
scroll-name-selective: "&dExtraction Scroll (Selective)"
scroll-name-random: "&dExtraction Scroll (Random)"`,
      notes: ["Selective extraction lets the player choose; random extraction chooses from installed enchants.", "Extraction uses the same logical slot map as drag-drop and table application."]
    },
    {
      id: "fusion",
      name: "fusion.yml",
      path: "plugins/OmniEnchant/settings/fusion.yml",
      group: "settings/",
      summary: "Fusion inventory layout, economy costs, input recipes, outputs, and success behavior.",
      topics: ["Fusion", "Recipes", "Economy"],
      source: `gui:
  title: "&8Enchant Fusion"
recipes:
  storm_core:
    input:
      - enchant: gale
        level: 3
      - enchant: ember_brand
        level: 3
    output:
      enchant: convergence
      level: 1
    cost:
      type: vault
      amount: 2500`,
      notes: ["Recipe IDs are server-owned and may combine arbitrary enchant levels.", "Economy provider is selected in `config.yml`."]
    },
    {
      id: "tier-shop",
      name: "tier-shop.yml",
      path: "plugins/OmniEnchant/settings/tier-shop.yml",
      group: "settings/",
      summary: "Tier orb shop inventory, EXP or economy currency, pricing, materials, and per-tier presentation.",
      topics: ["Shop", "Tiers", "Currency"],
      source: `enabled: true
currency: EXP
orb-material: MAGMA_CREAM
gui:
  title: "&8Enchant Tier Shop"
tiers:
  RARE:
    price: 35
    slot: 12`,
      notes: ["Currency can be EXP or the configured economy integration.", "Each tier controls price, GUI position, and display independently."]
    },
    {
      id: "vanilla-enchants",
      name: "vanilla-enchants.yml",
      path: "plugins/OmniEnchant/settings/vanilla-enchants.yml",
      group: "settings/",
      summary: "Vanilla display overrides plus level-aware MythicLib stat profiles for MMOItems equipment.",
      topics: ["Vanilla", "MythicLib", "MMOItems", "Stats"],
      source: `mythiclib-bridge:
  enabled: true
  mmoitems-only: true
  value-cap: 100000

sharpness:
  display-name: "&cSharpness"
  description:
    - "&7Increases melee damage"
  rarity: COMMON
  mythiclib:
    slots: [AUTO]
    damage-source: MYTHICLIB
    stats:
      ATTACK_DAMAGE:
        type: FLAT
        formula: "0.5 * {level} + 0.5"

mending:
  display-name: "&aMending"
  mythiclib:
    slots: [AUTO]
    stats:
      HEALTH_REGENERATION:
        type: FLAT
        formula: "0.25 * {level}"`,
      notes: ["Every profile accepts any MythicLib stat ID, `FLAT` or `RELATIVE`, `{level}` formulas, slots, and environment conditions.", "`damage-source: MYTHICLIB` compensates registry-defined direct melee bonus before MythicLib damage; `VANILLA` keeps native behavior.", "The global bridge is opt-in and defaults to MMOItems only. Non-stat behavior such as loot, Mending repair, curses, and Frost Walker remains owned by Minecraft."]
    }
  ];

  const pages = [
    { title: "Overview", summary: "Install, compatibility, system map, and recommended starting paths.", href: "index.html", terms: "start home requirements architecture" },
    { title: "Configuration", summary: "Explore every runtime configuration file and focused examples.", href: "configuration.html", terms: "config settings yaml folder" },
    { title: "Enchant System", summary: "Enchant schema, formulas, rarity, conflicts, stats, mechanics, and abilities.", href: "enchants.html", terms: "enchant yaml formula rarity conflict" },
    { title: "Runtime Reference", summary: "Search mechanics, RPG conditions, environment gates, and triggers.", href: "reference.html", terms: "mechanic condition trigger reference" },
    { title: "Feature Systems", summary: "Fusion, extraction, dust, table offers, slots, trackers, and set bonuses.", href: "features.html", terms: "feature fusion extraction dust table" },
    { title: "Items and Systems", summary: "Books, scrolls, orbs, sets, and bundled RPG assets.", href: "items.html", terms: "item book scroll orb set" },
    { title: "Commands and API", summary: "Member/admin commands, permissions, placeholders, and events.", href: "commands.html", terms: "command permission papi api event" },
    { title: "Lore Format", summary: "MMOItems slots, detailed/compact views, ownership, and placeholders.", href: "lore-format.html", terms: "lore slot compact mmoitems placeholder" },
    { title: "RPG Abilities", summary: "MythicMobs dispatch, typed signals, variables, active/passive modes, combos, and diagnostics.", href: "rpg-abilities.html", terms: "mythicmobs skill signal chain timer combo" },
    { title: "Changelog", summary: "Version history, migrations, fixes, and release notes.", href: "changelog.html", terms: "release version migration history" }
  ];

  window.OmniWikiData = {
    version: "3.17.0",
    pages,
    configs,
    mechanics,
    mythicMechanics,
    rpgConditions,
    equipmentConditions,
    mythicConditions,
    environmentConditions,
    triggers
  };
}());
