# OmniEnchant Changelog

## v3.17.0 - 2026-07-22

### Added
- Five MythicMobs item mechanics: `omniEnchantItem`, `omniItemDurability`,
  `omniItemSouls`, `omniCompactSlots`, and `omniGiveEnchantBook`.
- Five live-equipment Mythic conditions: `omniHasEnchant`,
  `omniEnchantCount`, `omniEmptyEnchantSlots`, `omniItemDurability`, and
  `omniItemSouls`.
- Five weapon mechanics (`CLEAVE`, `EXECUTE`, `LIFESTEAL`, `KNOCKBACK`,
  `CRITICAL_STRIKE`) and five target-aware weapon conditions.
- Five armor mechanics (`DAMAGE_REDUCTION`, `DODGE`, `THORNS`,
  `PROJECTILE_WARD`, `SECOND_WIND`) and five incoming-hit armor conditions.
- Five tool mechanics (`DURABILITY_SHIELD`, `TOOL_REPAIR`, `MINING_HASTE`,
  `AUTO_TORCH`, `MINING_XP`) and five block/tool-aware conditions.
- `ITEM_DAMAGE` native mechanic mode with `DURABILITY_DAMAGE` and
  `TOOL_DAMAGE` aliases.
- Opt-in vanilla enchant stat profiles that map any vanilla enchant level to
  arbitrary MythicLib offense, defense, resistance, recovery, or utility stats.
- Per-profile equipment slots, environment conditions, level formulas, modifier
  types, value caps, and registry-aware direct melee damage synchronization.

### Changed
- Scripted enchant mutations now use the canonical OmniEnchant API, preserving
  MMOItems applicability, conflicts, ordered slot capacity, lore, and lifecycle
  events. Arbitrary detached Mythic item variables are never authoritative.
- Weapon effects use two phases: damage modifiers run at `HIGHEST`, while
  lifesteal, knockback, and cleave consume final post-armor damage at `MONITOR`.
- Runtime reference now separates seven searchable categories and documents 29
  native mechanics, five Mythic mechanics, 45 conditions, and all 32 triggers.
- Wiki accents are lower saturation and the expanded reference tabs scroll
  cleanly without forcing page overflow.
- Wiki navigation now exposes expandable per-page topic trees with deep links
  for feature sections, configuration files, reference groups, and commands.
- Vanilla stat modifiers use the same exact-instance registration lifecycle as
  custom enchant stats and are removed on unequip, reload, quit, and shutdown.

### Fixed
- Secondary cleave and thorns damage can no longer recursively enter either the
  new RPG mechanic listeners or the legacy combat ability pipeline.
- Auto Torch fires a cancellable `BlockPlaceEvent` and consumes a real torch
  only after protection plugins accept placement.
- Hard caps contain stacked damage, healing, armor reduction, knockback, repair,
  XP, mutation depth, soul storage, and area targets independently of formulas.
- Negative Minecraft build heights now parse correctly in `BLOCK_Y_RANGE`.
- Unknown item selectors, mutation modes, ranges, IDs, event contexts, and
  condition names fail closed.
- Equipment slot identity is included in permanent modifier keys, preventing
  equal enchant/stat pairs on separate armor pieces from overwriting each other.

## v3.16.0 - 2026-07-22

### Added
- `omniEnchantSignal`, `omniSignal`, and `omiSignal` MythicMobs mechanics for
  emitting a typed signal into a player's equipped OmniEnchant abilities.
- `MYTHIC_SIGNAL:<id>` and `SIGNAL:<id>` ability modes, all-six-slot filtering,
  target-aware casts, and the `omi_signal`/`omi_signal_source` variable pair.
- Cancellable `OmniEnchantSignalEvent` for protection, class, and combat plugins.
- Copy-ready MythicMobs and enchant YAML in `examples/mythic-signal-bridge.yml`.

### Changed
- MythicMobs can now orchestrate equipped enchant combinations in both
  directions instead of only receiving skills dispatched by an enchant.
- Equipped item state is authoritative: scripts select a signal and slots, but
  cannot forge an enchant id, enchant level, or detached item.

### Fixed
- Nested signals are bounded to four levels and repeated signal/ability cycles
  are rejected within one root cast.
- Invalid signal grammar, slot selectors, non-player ownership, async casts,
  and cancelled signal events fail closed without consuming an ability proc.

## v3.15.0 - 2026-07-22

### Added
- A runtime-sourced reference catalog for all 14 custom mechanics, 12 RPG
  condition families, 13 environment condition forms, and nine trigger modes.
  Every record includes aliases, enforced limits, a deep link, and copy-ready YAML.
- A folder-style configuration explorer covering `config.yml` and all nine files
  under `settings/`, with focused examples and operational notes.
- Global documentation search across pages, configs, mechanics, conditions, and
  triggers, including keyboard navigation and `Ctrl+K`/`/` activation.
- Accessible code-copy controls with a fallback that also works when the wiki is
  opened directly through `file://`.
- A reduced-motion-aware WebGL enchant lattice with a non-WebGL visual fallback.

### Changed
- Rebuilt all ten wiki pages around one canonical responsive navigation shell,
  sticky context bar, consistent footer/version state, and reusable interaction layer.
- Reorganized the overview around server tasks and the feature page around clear
  application, acquisition, mutation, progression, mechanic, and condition paths.
- Replaced stale mechanic totals and configuration snippets with source-verified
  runtime names, aliases, defaults, and hard limits.
- Introduced an arcane-industrial visual system with graphite, jade, brass,
  crimson, and ice-white roles tuned for dense operational documentation.

### Fixed
- Restored the exact lore-ownership orchestrator contract used by
  `EnchantDataUtil`, so a clean source checkout compiles and managed lore can be
  replaced without deleting rich foreign lines that share the same visible text.
- Incomplete legacy lore markers now fail open instead of consuming every
  trailing lore line.
- Removed double-encoded punctuation and broken tree glyphs from public wiki pages.
- Fixed inconsistent copy-pasted navigation, including pages that omitted RPG or
  reference destinations.
- Fixed stale overview metadata and changelog links from prior versions.
- Corrected the Items guide to distinguish the member-facing `/sle compact`
  display toggle from the admin-only `/sle compact slots` slot-packing command.
- Search now closes on the first `Escape` press even when its native search input
  would otherwise consume that key to clear the query.
- Prevented horizontal overflow at desktop, tablet, and 375px mobile viewports.

## v3.14.0 - 2026-07-22

### Added
- Ordered `ENCHANT_SEQUENCE:a>b>c:seconds[:scope][:consumption]` conditions for
  deterministic RPG combo recipes. Scope supports `ANY` and `SAME_TARGET`;
  consumption supports one-shot `CONSUME` and window-bound `REUSABLE`.
- `ENCHANT_ACTIVATIONS:id:minimum:seconds[:scope]` for repeated-proc thresholds.
- MythicMobs variables `omi_chain_depth`, `omi_chain_root_enchant`, and
  `omi_chain_source_enchant`, including kebab-case aliases.
- Redacted skill trace reasons for RPG condition rejection, chain cycle blocks,
  and chain depth limits.

### Changed
- CHAIN validation now accepts every activation condition while retaining full
  compatibility with `RECENT_ENCHANT(S)`.
- Convergence now requires Ember Brand followed by Void Mark on the same target
  within 12 seconds and consumes each completed recipe once per branch.

### Fixed
- Stateful sequence consumption is committed only after all pure gates and the
  shared chance pass, so a rejected ability cannot silently eat player progress.
- CHAIN soul cost is now admitted inside the same condition transaction, so a
  rejected recipe or insufficient balance does not consume sequence progress.
- Monotonic activation serials preserve ordering even when multiple procs share
  the same millisecond timestamp.
- Activation history and per-ability consumption watermarks are player-owned,
  in-memory, and hard bounded.

## v3.13.1 - 2026-07-22

### Changed
- MMOItems `ENCHANTSLOTS` lore now remains in detailed mode regardless of the
  generic `detail-limit`. Every occupied slot shows its configured enchant
  description until compact mode is explicitly enabled.
- `/sle compact [on|off|toggle|auto]` is now a member command for personal lore
  display. `/sle show` uses the same direct detailed/compact toggle behavior.
- The previous physical slot-packing operation is retained as
  `/sle compact slots` for administrators.

### Fixed
- Items with more enchants than `detail-limit` no longer lose slot descriptions
  before the player requests compact mode.
- Explicit compact rendering still includes every enchant name, including items
  with ten or more enchants, while omitting description lines as intended.

## v3.13.0 - 2026-07-22

### Added
- Block mechanics now accept material names, `#minecraft:block_tags`, deny
  selectors, and cumulative `level-unlocks` tiers. One enchant can progress from
  iron veins at level 1 to Ancient Debris at level 5 without custom code.
- Blast Mine supports per-axis formula radii and cube, sphere/ellipsoid, or
  horizontal-plane shapes. Vein Mine supports 6, 18, or 26-way connectivity;
  Tree Feller exposes nearby-log search radius; Harvest Area has a formula cap.
- MythicEnchant-style option aliases are supported for radius, maximum blocks,
  durability-per-block, and Unbreaking behavior while retaining OmniEnchant's
  `{level}` formula engine.
- Smelter Relic 12 now demonstrates a level-gated Vein Mine and Auto Smelt
  combination. Tree Feller demonstrates Minecraft block-tag selectors.
- Startup now prints a console-safe status banner with version, catalog size,
  runtime, integrations, update checker, Folia readiness, and help command.

### Changed
- Console-facing `SLEnchant`/`OminiEnchant` labels in startup and enchant-config
  migration now use the `OmniEnchant` brand. Legacy IDs remain compatible.

### Fixed
- Hard safety caps contain hostile or accidental radius/max-block formulas.
- Multi-block mechanics honor synthetic `BlockBreakEvent` cancellation and
  `isDropItems`; tile entities are skipped to prevent container-content loss.
- Unknown legacy mechanic conditions now fail closed instead of silently
  bypassing a misspelled gate.
- Startup and config-migration status lines use console-safe ASCII text.

## v3.12.1 - 2026-07-22

### Fixed
- Tree Feller now follows only Minecraft log-tagged wood blocks, including
  stripped wood, stems, and hyphae, without consuming leaves or unrelated axe
  blocks.
- Auto Smelt accepts legacy `SMELTING`, `SMELT`, and `AUTOSMELT` mechanic names;
  bundled Auto Smelt and Tree Feller definitions are restored.
- Omni-owned lore now uses exact item metadata ownership instead of visible
  Unicode control markers. Refreshes are idempotent, malformed legacy markers
  fail open, and unrelated expiration lore is preserved.
- Grindstones remove custom enchant data, occupied slot state, modifier tags,
  and proven Omni-owned lore while retaining configured slot capacity and
  unrelated lore.

## v3.12.0 - 2026-07-19

### Added
- MythicMobs skill dispatch now exposes a stable RPG context-variable contract:
  live caster/target health, fall distance, damage, item attack, enchant data,
  and underscore/kebab aliases. Common MythicEnchant variable names are
  supported for migrated skill packs.

## v3.11.0 - 2026-07-19

### Added
- Per-enchant `table-reagents` eligibility for RPG table pools. A definition
  can target a named reagent profile, `vanilla`, or `*` for every reagent.

### Changed
- Existing enchant definitions without this field retain their previous
  all-reagent behavior, so enabling reagent profiles does not silently shrink
  legacy table pools.

## v3.10.0 - 2026-07-19

### Added
- Opt-in bounded bonus-enchant rolls for RPG table item offers, adapted from
  MythicEnchant's weighted multi-selection approach.
- Configurable maximum enchants per offer and per-extra chance. Books remain
  single-enchant; item offers are bounded by free virtual enchant slots.

### Fixed
- Bonus candidates exclude pairwise conflicts before the table transaction
  mutates item state. Applied bonus enchants emit normal lifecycle events and
  are announced clearly to the player.

## v3.9.0 - 2026-07-19

### Added
- RPG table reagent profiles for custom lapis, adapted from MythicEnchant's
  secondary-slot model. Match MMOItems type/id, Mythic item id, model strings,
  legacy model data, or material with deterministic priority.
- Reagents can add to or override table power while vanilla remains the sole
  authority that consumes the secondary-slot lapis stack.

### Fixed
- The selected reagent profile is fingerprinted and revalidated before a click
  commits, preventing an offer preview from being applied after reagent swaps.

## v3.8.0 - 2026-07-19

### Added
- Deterministic RPG table power from configurable nearby materials, weighted
  values, line-of-sight, radius, vertical range, and a bounded maximum.
- Table power joins item enchantability to unlock higher custom-enchant levels
  without changing vanilla XP or lapis cost.

### Fixed
- RPG offer previews now fingerprint and revalidate live table power before a
  click commits, rejecting a stale offer after the table room changes.
- Paper 1.21.11 no longer sees Kotlin `Unit` event-handler warnings from the
  equipment lifecycle and passive timer listeners.

## v3.7.0 - 2026-07-19

### Added
- Active MythicMobs interaction abilities for the actual main/off hand:
  `RIGHT_CLICK`/`RIGHTCLICK`/`USE`, `LEFT_CLICK`/`LEFTCLICK`/`SWING`, shared
  `INTERACT`, and sneaking-only `SHIFT_RIGHT_CLICK`/`SHIFT_LEFT_CLICK`.
- Interaction context variables: `omi_interact_action`, `omi_interact_block`,
  and `omi_interaction_location` for compatible Mythic mechanics.

### Changed
- Cancelled interactions no longer activate enchant abilities or spend souls.
  Click casts use the clicked block center as origin, or eye position for air.

## v3.6.0 - 2026-07-19

### Added
- Equipment-scoped `TIMER` MythicMobs ability mode for passive RPG enchants.
  `interval` supports level formulas and `TIMER:<ticks>` supports static
  migration syntax; values are bounded to 20-72,000 ticks.
- Timer casts now expose the existing `omi_trigger: TIMER` context and honor
  ability chance plus per-item soul cost.

### Changed
- Passive timer cache stores only player, equipment slot, enchant id, and
  ability id. The current item NBT is revalidated at every proc, and cache
  refreshes follow equipment changes, enchant mutations, reload scans, quit,
  and plugin shutdown.

## v3.5.0 - 2026-07-19

### Added
- RPG table item-enchantability profiles with deterministic MMOItems `type/id`, Mythic item id, material, and default precedence.
- High-enchantability items now unlock higher custom-enchant levels at the same vanilla table cost without using lore as state.

### Changed
- The RPG table fingerprint now includes stable MMOItems/Mythic item identity so a changed source item cannot commit a preview calculated for another profile.

## v3.4.0 - 2026-07-19

### Added
- Opt-in deterministic RPG enchanting-table offers. The vanilla table can preview the real registered OmniEnchant, level, and XP cost before the player pays.
- A bounded per-player offer session keyed by item/slot fingerprint and configuration generation. Selecting a valid offer advances its seed; stale sessions cancel before any custom NBT mutation.

### Changed
- `settings/enchant-table.yml` adds `rpg-offer-engine.enabled` (default `false`), `session-ttl-seconds`, and `maximum-cost`.
- The initial RPG offer engine intentionally applies one custom enchant per button. Reagents and multi-enchant bonus rolls remain a later module.

## v3.3.0 - 2026-07-19

### Added
- Per-ability MythicMobs `conditions:` with `condition-target: CASTER`, `TARGET`, or `ORIGIN` policy and the existing item-aware skill metadata.
- Curated `examples/mythic-skill-runtime.yml` covering melee, defense, projectile, kill, apply, and virtual-slot lifecycle casts.

### Changed
- Conditions are parsed during enchant reload and cached by immutable condition configuration. Invalid conditions disable only their ability and report a stable reload-time error code.
- Condition rejection, invalid configuration, evaluation errors, and an unavailable MythicMobs runtime all fail closed; native fallback cannot bypass the configured gate.

## v3.2.0 - 2026-07-19

### Added
- RPG virtual-slot lifecycle: committed `SLOT_FILLED`/`ON_SLOT_FILLED` and `SLOT_EMPTIED`/`ON_SLOT_EMPTIED` MythicMobs ability modes.
- The `omi_enchant_slot` Mythic variable plus public `OmniEnchantSlotFilledEvent` and `OmniEnchantSlotEmptiedEvent` payloads with the exact configured slot label.

### Fixed
- Enchant upgrades retain their current slot and do not trigger a false slot-filled lifecycle proc.
- Grindstone removal now emits an emptied transition for every original logical enchant slot instead of losing slot identity while grouping enchant IDs.

## v3.1.1 - 2026-07-19

### Added
- Opt-in, bounded MythicMobs skill-dispatch tracing with the `debug-skill-trace` and `debug-skill-trace-capacity` config settings.
- `/sle debug skill [count]`, available from both player chat and server console, to inspect recent dispatch outcomes.

### Changed
- Trace records intentionally retain only a mechanic root, outcome, and short reason. They exclude item NBT, mechanic parameters, player identity, and exception messages.

## v3.1.0 - 2026-07-18

### Added
- Equipment lifecycle abilities: `EQUIP`/`ON_EQUIP` and `UNEQUIP`/`ON_UNEQUIP` for main hand, off-hand, helmet, chestplate, leggings, and boots.
- Coalesced equipment state reconciliation after held-item swaps, hand swaps, inventory clicks/drags, interaction, drops, and the periodic inventory scan.

### Fixed
- Changing an enchant level on an already equipped MMOItem does not emit a false unequip/equip pair; it remains an apply/remove lifecycle change.

## v3.0.9 - 2026-07-18

### Added
- Projectile skill lifecycle for bows, crossbows, tridents, and other player-fired projectiles. `SHOOT`/`SHOOT_BOW` runs at launch and `PROJECTILE_HIT`/`IMPACT` runs with the original launch enchant snapshot at impact.
- MythicMobs targeters `@omiShotProjectile`, `@omiProjectileOrigin`, and `@omiProjectileDestination`, plus `omi_projectile`, `omi_projectile_id`, and `omi_lifecycle_action` metadata/variables.
- Apply/remove ability modes: `APPLY`/`ENCHANT_APPLY` and `REMOVE`/`ENCHANT_REMOVE`. Drag-drop, public API application, and extraction now emit committed lifecycle events.

### Fixed
- Projectile abilities no longer inspect the player's current main hand after launch, preventing a weapon swap from changing the source enchant.
- Projectile context records use opaque projectile PDC ids, a 30-second TTL, bounded storage, and cleanup on hit, player quit, plugin shutdown, and expiry.

## v3.0.8 - 2026-07-18

### Added
- MythicMobs RPG skill runtime. Abilities now receive direct MythicMobs metadata for the equipped item, item slot, enchant id, display name, rarity, current/max level, target, trigger, damage, and final damage.
- MythicMobs variable keys: `omi_enchant_id`, `omi_enchant_name`, `omi_enchant_rarity`, `omi_enchant_level`, `omi_enchant_max_level`, `omi_slot`, `omi_trigger`, `omi_damage`, `omi_final_damage`, plus `omi_item` and `omi_target` metadata objects for compatible mechanics.

### Fixed
- Armor abilities configured with `DAMAGED` or `DAMAGED_BY_ENTITY` now dispatch instead of being silently skipped.
- Weapon abilities configured with `KILL` or `ON_KILL` now dispatch on player kills, including soul-cost lore refresh.

### Changed
- Mythic mechanic parsing uses a bounded cache cleared by `/sle reload` and plugin shutdown.
- Native Bukkit fallbacks remain active when MythicMobs is unavailable or a configured Mythic mechanic cannot be resolved.

## v3.0.7 - 2026-07-18

### Fixed
- `ENCHANTSLOTS` now has a dedicated managed-lore marker and always keeps the exact `#enchantslots#` position, even when legacy `SLENCHANT` / `#omnienchant#` lore exists earlier in the same MMOItems item.
- Lore refresh and lore protection recognize both slot-owned and legacy managed blocks, removing stale duplicates without moving the slot block to the tooltip top.

### Added
- `/sle cleanse` (alias: `/sle cleanseorphaned`) removes only custom enchant IDs whose definitions are no longer loaded, freeing their occupied slots after an enchant config is intentionally removed. This is manual by design; reload never deletes player enchant data automatically.

## v3.0.6 - 2026-07-18

### Fixed
- Removed the remaining duplicate lore path when MMOItems items define both `SLENCHANT` and `ENCHANTSLOTS`; `SLENCHANT` preview lore is now also managed and replaced by the slot-aware renderer.
- Managed lore markers now use invisible zero-width sentinels, while the parser still recognizes and removes old section-code marker blocks.
- Lore refresh now removes stale unmarked OmniEnchant artifact lines, including old compact 2-enchant blocks and fallback `Enchant Slot: 0/5` sections.
- Items with empty `ENCHANTSLOTS` now render the configured slot counter inside `#enchantslots#` immediately, e.g. `Enchant Slot: 0/3`.

### Changed
- Lore repair now checks for managed markers and slot models instead of guessing from the first enchant display name.

## v3.0.5 - 2026-07-05

### Fixed
- `#enchantslots#` no longer duplicates OmniEnchant lore at the top of MMOItems tooltips; the initial MMOItems slot block is now managed and replaced in-place.
- Slot limits are enforced when reading legacy overfilled enchant data, so items with 5 slots no longer render or activate 24 custom enchants.
- Runtime stat, permanent effect, set bonus, mechanic, packet lore, tracker, extraction, anvil, and enchant-table paths now read the slot-aware effective enchant map.
- Compact lore now renders every enchant and wraps by `chars-per-line` instead of truncating long lists.

### Changed
- Slot counter is enabled by default and now uses `Enchant Slot: {used}/{max}` in the generated `settings/display.yml`.

## v3.0.4 - 2026-07-05

### Added
- Native MMOItems `ENCHANTSLOTS` stat for ordered OmniEnchant slots.
- `#enchantslots#` lore-format placeholder support for gem-slot-style placement.
- Slot display formats in `settings/display.yml`: `slot-name-format`, `slot-empty-format`, `slot-desc-format`, `show-empty-slots`, `show-slot-counter`, and `slot-counter-format`.
- `/sle compact` and `/sle compress` to move filled enchant slots upward.
- PlaceholderAPI counters: `%slenchant_slots_used%`, `%slenchant_slots_max%`, `%slenchant_slots_empty%`.

### Fixed
- Drag-drop, `/sle addenchant`, `/sle removeenchant`, enchant table, and anvil merge now share the ordered slot-state writer.
- Removing an enchant leaves its slot empty until compacted instead of reshuffling lore unexpectedly.
- `gradlew.bat` now exits cleanly in shells where `%OS%` is not defined.

## v3.0.3 - 2026-06-30

### Fixed
- `/sle browse` and `/sle browser` now have first-class Brigadier registration instead of relying on the fallback parser.
- `/sle shop`, `/sle dust`, `/sle version`, `/sle giverandom`, `/sle givescroll`, and no-arg admin commands now route through explicit Brigadier nodes.
- `/sle version` now reports plugin version, loaded enchant count, server version, and dependency status.
- `/sle giverandom <player> <rarity> [level] [amount]` now matches the wiki and gives random enchant books by rarity.
- `/sle addenchant <enchant> <level>` and `/sle removeenchant <enchant>` now match the wiki and use the shared NBT/lore update pipeline.
- Player command permissions now match the wiki defaults for `slenchant.info`, `slenchant.browser`, `slenchant.shop`, `slenchant.dust`, and `slenchant.activity`.

## v3.0.2 - 2026-06-30

### Improved
- Fusion GUI now aggregates duplicate required books and shows owned/required counts, e.g. `Fire Aspect III x2 (1/2)`.
- Fusion recipes now consume the exact required quantity for duplicate inputs and block crafting when the player only has one matching book.
- Dust Crafting now consumes exactly one enchant book per craft and keeps the rest of a stacked input in the GUI slot.
- MMOItems enchant editor now requires Shift-click to clear all enchants, preventing accidental full item cleanup.
- Fusion GUI now honors `filler-material`, `filler-name`, and `recipe-start-slot` from `settings/fusion.yml`.

## v3.0.1 - 2026-06-30

### Fixed
- MMOItems lore-format placement now uses OmniEnchant's native MMOItems stat insertion, so `#omnienchant#` is resolved during item build instead of by a delayed post-build lore rewrite.
- Disabled the delayed MMOItems build-lore renderer path because it could lose the placeholder and move enchant lore to fallback position.
- ProtocolLib packet lore rendering is optional at startup; servers without ProtocolLib no longer fail while loading OmniEnchant.
- Folia/Paper scheduled tasks now use the Folia compatibility wrapper for cooldown cleanup, inventory scans, permanent effects, GUI reopen flows, anvil/enchant-table/book callbacks, lore watching, set bonuses, and crop replanting.
- Activity data unload/flush keeps dirty player data until async save succeeds, preventing progress loss after write failures.
- Fusion now validates output and payment before consuming source books, and failed payments no longer remove ingredients.
- Config migration preserves existing live config files and only creates missing defaults instead of overwriting admin edits.

### Lore Format Notes
- Put `#omnienchant#` directly in MMOItems `lore-format.yml` or item lore at the exact position enchant lore should appear.
- Existing items that already have an OmniEnchant managed block keep that block's previous position on later renders.
- Existing/generated items with no token and no managed block cannot infer the MMOItems template position; rebuild those items after adding `#omnienchant#` for exact placement.

## v2.0.0 — 2026-04-06

### Rebranding
- Renamed from SLMMOEnchant / OminiEnchant to **OmniEnchant**.
- JAR output is now `OmniEnchant.jar` (no version suffix).
- Plugin folder is now `plugins/OmniEnchant/`.
- Lore placeholder changed to `#omnienchant#` (old tokens `#ominienchant#` and `#slenchant#` still accepted).
- Modifier placeholder changed to `#omnimodifier#` (old tokens still accepted).
- All in-game GUI branding updated to OmniEnchant.

### Added
- OminiModifier runtime hook for unified lore management.
- Lore orchestration core (LoreOrchestrator, LoreSectionParser).
- External adapter framework (EcoEnchants, AdvancedEnchant interop).
- Enchant Browser GUI (`/sle browser`).
- Dust Crafting system — convert enchant books into dust to boost success rates.
- Enchant Fusion system — combine enchants to create new ones.
- Extraction system — extract enchants from items (selective or random).
- Soul Tracker — PvP/PvE soul points stored per-item via NBT.
- Trak System — BlockTrak / KillTrak / MobTrak counters.
- Set Bonus system.
- Permanent effect manager.

### Changed
- Version bumped from 1.21.11 to 2.0.0.
- Paper API target: 1.21.11.
- Config defaults now prefer OmniEnchant naming.
- Lore writes skip no-op updates to reduce meta churn.

### Compatibility
- All legacy placeholder tokens still supported.
- Permission nodes (`slenchant.*`) unchanged for backward compatibility.
- NBT keys (`SLENCHANT_*`) unchanged — existing item data is preserved.

---

## v1.21.11 — 2026-04-06

### Added
- Lore orchestration core (LoreOrchestrator, LoreSectionParser).
- External interop scaffold (EcoEnchantsAdapter, AdvancedEnchantAdapter).
- Runtime hook module (OminiModifierHook).
- Token compatibility: `#ominienchant#`, legacy alias `#slenchant#`.

### Changed
- Project version updated to 1.21.11.
- Config defaults now prefer Omini naming.

---

## v1.2.8 — 2026-03-15

### Added
- Enchant Table integration with whitelist/blacklist modes.
- Tier Shop GUI with economy support (Vault, PlayerPoints).
- Grindstone custom enchant removal.
- Anvil enchant combining.
- Protection Stone consumable.
- Lucky Dust success rate booster.
- Slot Increaser item.
- 52 sample enchants across weapon/armor categories.

### Fixed
- Color codes (hex, MiniMessage support).
- Drag-drop enchant application.
- Improved error messages.
