# Changelog

All notable changes to SLMMOEnchant will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.5] - 2026-03-04

### Added

- **`/sle broadcast` Command** — Give enchant books to ALL online players: `/sle broadcast <enchant_id> [level] [amount]`. Random success/failure rates per player. Server-wide announcement + sound effect. Full Brigadier tab completion
- **Protection Stone Stacking** — Protection stones now stack charges (integer counter instead of boolean). Use multiple stones → charges add up (e.g. 🛡 Bảo Vệ: 3 lần). Each enchant failure consumes 1 charge. Sound changed to `BLOCK_ANVIL_USE`
- **Extra Slot Limit** — New config `extra-slot-limit` in `application.yml`. Set to 20 → max +20 extra enchant slots per item. Set to 0 → infinite (default)
- **Soul Cost in Mechanics** — `SLEMechanicEngine` now checks and consumes `soul-cost` before mechanics fire (was only working in CombatListener before). Not enough souls → mechanic silently skips
- **Config Auto-Updater** — Plugin auto-updates configs on version upgrade. Tracks version in `.config-version` file. On upgrade: backs up old configs to `enchants/backup_xxx/`, overwrites all enchant + settings files with new defaults. No more manual folder deletion needed!

### Fixed

- **Stats Not Working** — Stats with `mode:` (ATTACK, DAMAGED, etc.) were completely broken because PassiveSkill handler silently failed. ALL stats are now **permanent** (always-on when equipped). `mode:` field on stats is now ignored
- **Soul Stone vs Booster Distinction** — `soul_pvp`/`soul_pve` stones now **only enable soul tracking** (one-time). Refuses if already enabled. `soul_booster_pvp`/`soul_booster_pve` add souls but **require tracker first**
- **Protection Lore** — Lore now shows actual charge count: `🛡 Bảo Vệ: 3 lần` instead of always `1 lần`

### Changed

- 11 enchant configs cleaned: removed `mode:`/`duration:`/`cooldown:` from stats sections, updated lore to reflect permanent behavior
- All stat config files now use only `formula:`, `key:`, `type:` (FLAT/RELATIVE). No more conditional stat fields
- Soul boosters now require soul tracking to be enabled first (must apply Soul Stone → then Soul Booster)

### Technical

- `StatApplyListener` — Removed conditional stat PassiveSkill branch (60+ lines). All stats always permanent
- `SLEMechanicEngine.onBlockBreak` — Added soul cost check before mechanic activation
- `DragDropListener` — Soul stone now one-time enable only; boosters check for tracker
- `EnchantDataUtil` — Protection lore uses `nbt.getInteger()` with `{charges}` placeholder
- `EnchantConfig.ensureDefaults()` — Version-aware auto-updater with backup mechanism
- `CommandRegistrar` — Added `/sle broadcast` subcommand with full Brigadier registration
- `SLEnchantCommand` — Added `handleBroadcast()` function
- `ApplicationConfigLoader` — Added `extraSlotLimit` field

---

## [1.2.4] - 2026-03-04

### Fixed

- **Mechanic Conflicts** — Rewrite toàn bộ SLEMechanicEngine với coordinated pipeline: MULTIPLY_DROPS → AUTO_SMELT → TELEKINESIS chạy đúng thứ tự, không conflict nhau nữa
- **Blast Mine Block Filter** — 3x3/5x5/7x7 chỉ phá stone, ore, deepslate, netherrack... Không phá dirt, grass, wood, etc nữa
- **Placeholder Display** — `/sle enchant` GUI hiện chance, params (multiplier, radius...), conditions cho mechanics. Abilities hiện damage value

### Added

- **Durability Cost** — Vein mine, blast mine, tree feller, harvest area giờ tốn độ bền tương ứng (đào 9 blocks = -9 durability). Respect Unbreaking enchant

### Changed

- **SLEMechanicEngine v2** — Coordinated pipeline thay vì mỗi mechanic xử lý riêng. Extra blocks dùng chung pipeline với block gốc

---

## [1.2.3] - 2026-03-04

### Fixed

- **Placeholder Display** — `/sle enchant` GUI và MMOItems editor giờ hiện giá trị thật (lv1) thay vì formula raw như `5+({level}-1)*3`
- **Success Rate 0** — Cho phép đặt tỷ lệ thành công = 0% (trước đây bị chặn ở 1%)
- **Tier Shop EXP** — Giá EXP giờ dùng vanilla formula (10 levels = 160 EXP), trừ đúng số EXP và recalculate level/progress bar
- **Orb Failure Rate** — Orb reveal giờ luôn random tỷ lệ vỡ đồ (kể cả khi base = 0, random 0-5%)

### Added

- **Tier Shop LEVEL Mode** — `currency: LEVEL` trong tier-shop.yml → trừ trực tiếp level (20lv - 10 = 10lv). Default vẫn là EXP
- **Give Command Random** — `/sle give <player> <enchant> [level] [amount]` không chỉ định rate → tự random giống orb reveal

### Removed

- **Dust Consolation** — Không còn nhận dust khi ép enchant thất bại (dành cho tính năng GUI ép sách sau)

---

## [1.2.2] - 2026-03-04

### Added

- **SLE Mechanic Engine** — Custom scripting system for enchant effects not available in MMOItems/MythicLib
  - 12 mechanic types: `MULTIPLY_DROPS`, `AUTO_SMELT`, `BLAST_MINE`, `VEIN_MINE`, `TREE_FELLER`, `HARVEST_AREA`, `TELEKINESIS`, `REPLANT`, `MULTIPLY_MOB_DROPS`, `MULTIPLY_EXP`, `HEAD_DROP`, `BONUS_MONEY`
  - 7 trigger modes: `ATTACK`, `BREAK_BLOCK`, `KILL_ENTITY`, `DAMAGED`, `RIGHT_CLICK`, `BOW_SHOOT`, `EQUIP`
  - All params support formula: `"30+{level}*15"`
  - MythicMobs integration for mob drop multiplying
  - Cooldown tracking, chance rolling, recursion prevention
- **Condition System** — 15+ environment conditions for stats and mechanics
  - Time: `IN_DAY`, `IN_NIGHT`, `IN_TIME_6000_12000` (custom range)
  - Environment: `IN_WATER`, `ON_GROUND`, `IN_RAIN`, `IN_LAVA`, `IN_BIOME_xxx`
  - Player state: `HEALTH_BELOW_20`, `HEALTH_ABOVE_80`, `SNEAKING`, `SPRINTING`, `FLYING`
- **Stat Mode Unification** — Stats now support `mode:` like abilities (MythicLib TriggerType)
  - `mode: ATTACK` — stat activates when player attacks
  - `mode: DAMAGED` — stat activates when player takes damage
  - `duration:` and `cooldown:` support formulas
  - Mode aliases: `DAMAGED` → `WHEN_HIT`, `ON_HIT` → `ATTACK`, `ON_DEFEND` → `WHEN_HIT`
- **8 New Enchants** — `blast_mine`, `vein_miner`, `tree_feller`, `auto_smelt`, `telekinesis`, `harvest_area`, `extra_mob_drops`, `exp_multiplier`

### Fixed

- **Creative Mode Duplication** — Blocked all drag-drop enchanting in creative mode to prevent item duplication exploit
- **Tier Shop EXP Deduction** — Was deducting XP levels instead of total EXP points; now uses `player.totalExperience`
- **Orb Failure Rate** — Orb reveals now use per-enchant `failure-rate` instead of global default (which was 0.0)
- **Item Destruction** — Items are now reliably destroyed when failure rate triggers; uses `clickedInventory.setItem(slot, null)` instead of unreliable `type = AIR`

### Changed

- 11 legacy `trigger:` enchants converted to `stats:` with `mode:`: `berserk_rage`, `speed_burst`, `lifesteal_strike`, `lucky_strike`, `absorption`, `fervor`, `magic_shield`, `phantom`, `regeneration`, `soul_lifeline`, `mana_shield`
- `double_ore` — Changed from fake LUCK stat to real `MULTIPLY_DROPS` mechanic (45/60/75% chance at lv1/2/3)
- `executioner` — Added `IN_NIGHT` condition (stats only active at night)
- `mana_shield` — Separated into permanent (max-mana) + conditional (magic-damage-reduction on DAMAGED)

### Technical

- New files: `SLEMechanicDef.kt`, `SLEMechanicEngine.kt`
- `StatModifierDef` — Added `mode`, `duration`, `cooldown`, `conditions` fields
- `StatApplyListener.processItem` — Takes `Player` parameter for condition evaluation; splits permanent vs conditional stat branches
- `EnchantConfig.parseEnchant` — Parses `mechanics:` and stat `mode:`/`duration:`/`cooldown:`/`conditions:`
- `SLMMOEnchantPlugin` — Registers `SLEMechanicEngine` listener
- `DragDropListener` — `GameMode.CREATIVE` guard at line 34

---

## [1.2.1] - 2026-03-04

### Added

- **Protection Stone** — New custom item (TOTEM_OF_UNDYING) that protects items from being destroyed when enchant fails
  - Drag-drop onto item → adds `SLENCHANT_PROTECTED` NBT tag
  - Lore displays: `🛡 Bảo Vệ: 1 lần`
  - When enchant fails and destroy roll hits → protection consumed, item saved
  - Only 1 protection per item at a time
- **Random Failure Rate (Tier Shop)** — Orb reveals now randomize both success rate (base ±15%) and failure rate (0 to 2x base) on enchant books
- **Comprehensive Messages Update** — 15+ new message keys in `messages.yml`:
  - Protection: `protection-applied`, `protection-saved`, `protection-already`
  - Orbs: `orb-reveal`, `orb-no-enchants`, `orb-create-fail`
  - Shop: `shop-disabled`, `shop-not-enough-exp/money`, `shop-purchase-success`
  - Grindstone: `grindstone-removed`
  - Vanilla Book: `vanilla-book-applied`, `vanilla-book-failed`
  - Lore: `lore.protection` format string

### Changed

- `DragDropListener` — Added `protection_stone` handler in item ID when-block + destroy protection check in failure branch
- `OrbRevealListener` — Uses `ApplicationConfigLoader` for base rates, randomizes both success and failure
- `EnchantDataUtil` — Renders protection lore when `SLENCHANT_PROTECTED` NBT tag present
- `messages.yml` — Fully restructured with sections for all features
- `items.yml` — Added `protection_stone` item definition
- Wiki restructured from single-page to 7-page category-based wiki

### Technical

- `DragDropListener.PROTECTION_NBT_KEY = "SLENCHANT_PROTECTED"` constant in companion object
- Protection check: `if (protNbt.hasTag(PROTECTION_NBT_KEY))` in destroy branch
- OrbRevealListener: `randomSuccess = (baseSuccess - 15 + random(31)).coerceIn(5, 100)`
- OrbRevealListener: `randomFailure = (random(baseFailure * 2)).coerceIn(0, 100)`

---

## [1.2.0] - 2026-03-03

### Added

- **Enchant Table Integration** — SLEnchant tích hợp bàn enchant vanilla. Khi enchant tại bàn → có cơ hội nhận thêm SLEnchant. Config: `settings/enchant-table.yml` với whitelist/blacklist, weight, min/max level per-enchant
- **Grindstone Support** — Grindstone vanilla tự động xóa tất cả SLEnchant khỏi item. Re-render lore, recalculate stats
- **Failure Rate (Destroy System)** — `failure-rate` trong enchant config. Khi enchant thất bại → roll failure rate → nếu pass thì **hủy item**. Sách luôn bị tiêu hao
- **Inventory Scan Interval** — `inventory-interval` trong config.yml (default 200 ticks = 10s). Quét định kỳ re-render lore + recalculate stats
- **Give Command Failure Rate** — `/sle give <player> <enchant> [level] [amount] [successRate] [failureRate]` — thêm arg `failureRate` thứ 7
- **Enchant Editor GUI** — GUI paginated thay text-dump cũ. Click chọn enchant, shift-click max level, right-click xóa
- **`/sle list` Pagination** — 10/trang, nút [◀ Prev] [▶ Next] clickable

### Fixed

- **Vanilla Enchant Slot Count** — Vanilla enchants giờ TÍNH VÀO giới hạn `max-enchants-per-item` (trước đây chỉ đếm custom)
- **Default Enchant Files** — Chỉ tạo file mặc định nếu folder `enchants/` chưa tồn tại. Xóa file enchant → không bị re-create
- **Trigger Key Parsing** — Fix `key` không được parse từ trigger effects trong config
- **MythicLib Abilities** — Abilities giờ register đúng với MythicLib `PassiveSkill` API (trước đây chưa implement)
- **Lore Spacing** — Thêm `lore-spacing` config (default 0) để chỉnh khoảng cách giữa enchant lore và item lore
- **Fusion GUI Config** — GUI title, rows, filler, lore templates giờ configurable trong `fusion.yml > gui:`

---

## [1.1.5] - 2026-03-03

### Fixed

- **[CRITICAL] Stats Stacking — UUID Root Cause** — MythicLib's `StatModifier.unregister()` removes by UUID, but every `new StatModifier(...)` generates `UUID.randomUUID()`. Old code created NEW instances for unregister → wrong UUID → NEVER removed → infinite stacking. Now stores **actual `StatModifier` instances** and calls `unregister()` on those same objects
- **[CRITICAL] Set Bonus Stacking** — Same UUID bug in `SetBonusManager` — fixed identically
- **[CRITICAL] Safety Sweep** — Added `StatInstance.removeIf { it == modKey }` as backup removal by key string (works regardless of UUID). Runs on every recalculate to catch orphans
- **[HIGH] Fusion GUI Crash** — `triumph-gui:3.1.10` `ItemBuilder.name()` calls `MinecraftComponentSerializer` which crashes on Paper 1.21.8. Replaced with Paper native `ItemStack` + `ItemMeta.displayName()` + `GuiItem()` wrapper
- **[HIGH] Activity GUI Crash** — Same triumph-gui crash, same fix applied
- **[MEDIUM] Missing Armor Change Event** — Added `PlayerArmorChangeEvent` handler for right-click armor equip/unequip, which was not triggering stat recalculation

### Added

- **Permanent Effects** — `perm-effects:` config field. Potion effects that stay active while item is equipped in correct slot. Auto-refresh every 10s, auto-remove on unequip/quit. Supports formula amplifier:
  ```yaml
  perm-effects:
    NIGHT_VISION:
      formula: "0"
      key: NV
    SPEED:
      formula: "{level}-1"
      key: SPD
  ```
- **Particle Effects** — `particles:` config field. Particle effects spawn around player while item is equipped. Supports DUST with custom color/size:
  ```yaml
  particles:
    - type: FLAME
      amount: 3
      speed: 0.02
    - type: DUST
      color: "FF3300"
      size: 1.2
  ```
- **PermEffectManager** — Manages potion effects (refresh task every 10s) and particles (spawn task every 5 ticks) with per-player locking and cleanup
- **Enchant Config Guide** — New wiki page `wiki/Enchant-Config-Guide.md` with comprehensive documentation for all config fields
- **6-Piece Set Bonus** — King enchant now supports 6-piece set (4 armor + weapon + offhand) with GOLEM_WRATH ability

### Changed

- `StatApplyListener.activeStats`: `Map<String, Pair<String, ModifierType>>` → `MutableList<StatModifier>` — stores actual instances
- `SetBonusManager.activeModifiers`: Same change — stores actual instances
- `FusionGui` / `ActivityGui`: No longer uses `triumph-gui ItemBuilder` — uses Paper native API
- Enchant glow: only uses `setEnchantmentGlintOverride(true)`, no real enchant registration (prevents duplicate display)
- Wiki updated to v1.1.5 with new config format, perm-effects/particles sections, updated FAQ
- Version bumped from 1.1.4 → 1.1.5

### Technical

- `StatModifier.register()` stores instance in list → `unregister()` called on SAME instance with matching UUID
- Safety sweep: `mmoData.statMap.getInstance(statId).removeIf { it == modKey }` — key-based removal as backup
- `PermEffectManager` integrated into `StatApplyListener.recalculate()` and `onQuit()` lifecycle
- Added `SLEnchant.permEffects` (`Map<PotionEffectType, PermEffectDef>`) and `SLEnchant.particles` (`List<ParticleDef>`)

## [1.1.4] - 2026-03-03

### Fixed

- **[CRITICAL] Set Bonus Stat Stacking** — Set bonus modifiers were never removed on unequip because `SetBonusManager` used a dummy statId (`ATTACK_DAMAGE`) for unregistration. MythicLib requires the **correct statId** to find the modifier in its stat map. Now stores `modKey → statId` mapping for proper cleanup
- **[CRITICAL] Stat Modifier Stacking** — Same bug in `StatApplyListener`: `activeStats` changed from `Set<String>` to `Map<String, String>` (modKey→statId) for correct unregistration
- **[HIGH] Trak Counter Persistence** — `TrakListener` called `addBlocks(item, 1)` then `refreshLore()` which created a new NBTItem, overwriting the counter. Counter increment + NBT write now done in **single operation** before lore refresh
- **[MEDIUM] Debug Purge Method** — Replaced invalid `forEachModifier`/`removeIf` (not in MythicLib API) with brute-force `StatModifier.unregister()` approach using all registered enchant × stat ID combinations

### Added

- **New YAML Format** — All 63 enchant configs converted from legacy `display-name`/`base`/`per-level` to new `name`/`lore`/`formula` format with formula engine support (`{level}`, `{level_item}` placeholders)
- **8 New MythicLib Ability Enchants**:
  - ⚔ Void Slash (`ARCANE_RIFT`) — Chém xé không gian
  - 🌋 Earthquake (`EARTHQUAKE`) — Rung chấn đất khu vực
  - ⚡ Chain Lightning (`CHAIN_LIGHTNING`) — Sét xích nảy giữa kẻ thù
  - ✧ Shockwave (`SHOCKWAVE`) — Sóng xung kích khi bị đánh
  - 🩸 Vampiric Touch (`LIFE_ENDER` + lifesteal) — Ma cà rồng
  - Frenzy (`FRENZY` + ATK + SPD) — Điên cuồng tấn công
  - ✧ Arcane Barrier (`ARCANE_HAIL` + magic def) — Rào cản ma thuật
  - 🌿 Earth Spike (`EARTH_SPIKE`) — Gai đất
- **Set Bonus Formula & Ability Support** — New `SetBonusTierDef` data model: each tier now supports `stats` (with formulas) AND `abilities` (MythicLib). Example:
  ```yaml
  set-bonus:
    2:
      stats:
        attack-damage:
          formula: "10+({level}-1)*3"
          type: RELATIVE
          key: ATK
    4:
      stats: { ... }
      ability:
        firebolt:
          type: FIREBOLT
          mode: ATTACK
          damage:
            formula: "5+({level}-1)*3"
  ```
- **Skill → Ability Migration** — 14 legacy enchants converted from old `skill:` to new `ability:` format:
  - thunder_god → `LIGHTNING`, flame_burst → `FIREBOLT`, ice_shard → `ICE_CRYSTAL`
  - frostbite → `SLOW`, fire_aspect → `BURN`, guardian_angel → `HEAL`
  - mana_burst → `ARCANE_HAIL`, retaliation → `HEAVY_CHARGE`
  - spirit_guardian → `OVERLOAD`, wither_touch → `WITHER`
  - wind_fury → `SKY_SMASH`, venom_strike → `POISON`, toxic_blade → `POISON`

### Changed

- `SetBonusDef(statId, type, value)` → `SetBonusTierDef(stats, abilities)` — backward compatible with legacy flat format
- `SetBonusManager.recalculate()` now uses `StatModifierDef.valueAt(level)` for formula evaluation
- `SetBonusManager` tracks max enchant level across equipped items for formula calculation
- `TrakListener` directly increments NBT counter on the same NBTItem object (no separate `TrakManager.add*` call)
- Stats in YAML now use **kebab-case** (`attack-damage`) auto-normalized to MythicLib UPPER_SNAKE_CASE (`ATTACK_DAMAGE`)
- Version bumped from 1.1.3 → 1.1.4

### Technical

- `SLEnchant.setBonus` type: `Map<Int, Map<String, SetBonusDef>>` → `Map<Int, SetBonusTierDef>`
- `EnchantConfig` set-bonus loader: supports new `stats`/`ability` sections per tier + legacy flat fallback
- `StatApplyListener.activeStats`: `Set<String>` → `Map<String, String>` (modKey→statId)
- Debug purge: iterates `EnchantRegistry.getInstance().getAllIds()` × `KNOWN_STAT_IDS`

## [1.1.3] - 2026-03-02

### Added

- **Souls System** — Kill mobs/players → earn soul points on held weapon. Lore shows PvP/PvE/Total soul counts. PAPI placeholders: `%slenchant_soul_pvp%`, `%slenchant_soul_pve%`, `%slenchant_soul%` for MythicMobs integration
- **Set Enchants** — New enchant type with 2-piece/4-piece bonuses (like MMOItems item sets). Example: King (2pc=+10% DMG, 4pc=+20%), Warlord, Phantom
- **BlockTrak/StatTrak/MobTrak** — Track blocks mined, player kills, mob kills per item. PAPI: `%slenchant_trak_blocks%`, `%slenchant_trak_kills%`, `%slenchant_trak_mob_kills%`
- **Slot Increaser** — Custom item to increase max enchant slots on items. Command: `/sle giveslot <player> [amount]`
- **`/sle show` Command** — Toggle per-player detailed/compact enchant display (re-renders held item lore)
- **Vanilla Enchant Hooks** — `vanilla-enchants.yml` config with custom display names & descriptions for all vanilla enchants (shown in SLE lore block)
- **50+ Sample Enchants** — Across 8 categories: Weapon, Defense, Utility, Trigger, Buff, Soul-based, Set, Trak-aware
- **PlaceholderAPI Expansion** — Auto-registers when PAPI is present, provides soul & trak placeholders
- **Enchant Slot Lore** — Shows `⚡ Enchant: x/max` on items (includes vanilla + SLE enchant count)

### Changed

- Lore rendering now includes vanilla enchant descriptions, soul counts, trak counters, and slot usage
- Version bumped from 1.1.2 → 1.1.3

## [1.1.2] - 2026-03-02

### Fixed

- **Lore Spacing** — Removed extra blank line between enchant lore and item lore; enchant lines now sit tightly above original lore
- **MMOItems Editor GUI** — Fixed editor workflow: now properly closes GUI → accepts chat input → saves → reopens GUI (uses `ChatEdition`). Right-click to remove, left-click to add

### Added

- **Lucky Dust on Books** — Drag Lucky Dust onto an enchant book to increase its success rate (+1%/dust, up to 100%)
- **`/sle giveall` Command** — Give one book of every registered enchant to a player: `/sle giveall <player> [level] [amount]`
- **Dust Messages** — New `dust-applied` and `dust-max-rate` messages in `messages.yml`

### Changed

- Version bumped from 1.1.1 → 1.1.2

## [1.1.1] - 2026-03-02

### Fixed

- **[CRITICAL] Lore Position** — Enchant lore now displays at the TOP of item lore (like vanilla enchants), not appended at the bottom
- **[CRITICAL] Visible Markers** — Removed `[SLE_START]`/`[SLE_END]` visible text from item lore; replaced with invisible zero-width formatting codes
- **Backward Compatible Markers** — Old `[SLE_START]`/`[SLE_END]` items are automatically detected and migrated to new format on next enchant operation

### Added

- **Enchant Upgrade on Apply** — When applying a book with the same enchant at the same level, enchant auto-upgrades to next level (configurable via `allow-upgrade-on-apply` in `application.yml`)
- **Block Lower Level** — Cannot apply a lower-level book when a higher-level version of the same enchant is already on the item
- **Upgrade Messages** — New messages: `enchant-lower-level`, `enchant-no-upgrade`, `enchant-max-level`, `enchant-upgrade-success`, `enchant-upgrade-fail`
- **More Placeholders** — `{book}`, `{current}`, `{old_level}`, `{new_level}` for upgrade messages

### Changed

- `application.yml`: Added `allow-upgrade-on-apply: true` (default ON)
- Upgrade disabled: shows "you already have this enchant" + book is NOT consumed
- Upgrade success has distinct sound (higher pitch) and ⬆ arrow prefix
- Version bumped from 1.1.0 → 1.1.1

## [1.1.0] - 2026-03-02

### Added — New Features

- **Custom Success Rate per Enchant** — `success-rate` field in enchant YAML, displayed on book lore with color coding
- **Named Placeholders ({KEY})** — `key` field in stats config for specific placeholder names (e.g. `{ATK}`, `{SPD}`, `{CRIT}`)
- **Configurable Messages** — New `messages.yml` for all plugin messages with placeholder support
- **Expanded Give Command** — `/sle give <player> <id> [level] [amount] [successRate]` with bulk give and custom rates
- **Skill System Fallback** — Native Bukkit effects (lightning, fire, freeze) when MythicMobs is unavailable
- **Character-based Line Wrapping** — `chars-per-line` replaces `enchants-per-line` in compact display mode

### Fixed

- **[CRITICAL] Lore Wiping Bug** — Enchants no longer overwrite existing MMOItems lore; uses invisible marker lines to delimit SLEnchant lore block
- **[CRITICAL] {value} Placeholder** — Now supports multiple named placeholders per description line via `key` field
- **[CRITICAL] Vault ClassNotFoundError** — EconomyWrapper now uses isolated bridge objects to prevent crash when Vault/PlayerPoints not installed
- **Activity Messages** — Changed from ActionBar to Chat (no longer conflicts with MMOCore)
- **Combat Messages** — Buff/trigger/skill activation messages now use Chat instead of ActionBar
- **Fusion Config** — Supports both `input` and `inputs` YAML keys, added debug logging
- **Duplicate Command** — Removed `/sle fuse` duplicate (use `/sle fusion`)

### Changed

- `display.yml`: `enchants-per-line` → `chars-per-line: 40`
- `DragDropListener`: Success rate now reads from book PDC → enchant config → global config (priority chain)
- `CombatListener`: MythicMobs skill execution now checks plugin availability first, falls back gracefully
- `FusionConfigLoader`: Logs loaded recipe details for easier debugging
- All enchant YAML defaults updated with `key` and `success-rate` fields
- Version bumped from 1.0.8 → 1.1.0

### New Files

- `messages.yml` — All customizable plugin messages
- `MessageConfigLoader.kt` — Message config loader with placeholder support

## [1.0.8] - 2026-03-01

### Fixed — Code Review Round 1

- **[CRITICAL]** EnchantRegistry atomic swap — volatile reference swap instead of clear+putAll (readers never see empty state)
- **[CRITICAL]** matchesMetadata ENCHANT_LEVEL — now uses `metadataFilter.min-level` instead of comparing against `activity.requirement`
- **[CRITICAL]** ExtractionHandler lore update — item lore now refreshes after enchant removal
- **[CRITICAL]** Stale NBT cleanup — `SLENCHANT_MOD_*` tags removed when enchant is extracted
- **[PERF]** trackActivity no longer writes YAML to disk on every call — uses dirty-flag + async flush
- **[PERF]** Debug logging gated behind `config.yml debug: true` flag
- **[PERF]** calculateDustBonus early-exits when dust bonus is disabled
- **[PERF]** ActivityConfigLoader no longer double-loads on startup
- **[PERF]** whenDisplayed config hoisted outside loop

### Changed — DRY Refactoring

- Extracted `EnchantDataUtil` — shared writeEnchantData + lore update (DragDropListener + ExtractionHandler)
- Collapsed `applyTempBuff` + `applyTriggerEffects` into `registerTimedModifier` in CombatListener
- Cached `TypeToken` instances in `GsonUtil` (ENCHANT_MAP_TYPE, MUTABLE_ENCHANT_MAP_TYPE)
- Cached `NamespacedKey` in `EnchantBookBuilder.init()` — no more per-call allocation
- Removed all inline `TypeToken` creation across 4 files
- Added `metadataFilter` field to Activity data class for configurable metadata matching

### Removed

- Deleted dead `SLEnchantTabCompleter` (Brigadier handles tab completion)

### Modularization

- Extracted `CommandRegistrar` from SLMMOEnchantPlugin (218→83 lines)
- SLMMOEnchantPlugin now delegates all Brigadier registration to CommandRegistrar

## [1.0.7] - 2026-03-01

### Added

- **Per-file enchant system** — each enchant now has its own YAML file in `enchants/` directory
  - `enchants/fire_aspect.yml`, `enchants/ice_shard.yml`, etc.
  - Backward compatible: falls back to legacy `enchant.yml` if `enchants/` is empty
  - Auto-generates default enchant files on first run
- **Improved help command** — clickable commands with hover tooltips, color-coded categories
- **Enhanced MMOItems GUI editor** — shows available enchants, current enchants, supports `remove` command
- **Better `/sle list`** — sorted by rarity, clickable entries with hover info, type tags
- **Better `/sle info`** — formatted stats with % symbols, duration in seconds, [Give Book] button

### Fixed

- **Gson singleton** — replaced all `Gson()` instances with `GsonUtil.gson` in CombatListener, DragDropListener, ExtractionHandler, SLEnchantStat
- **Missing FoliaCompat import** in ActivityManager
- **Missing ModifierTracker import** in SLMMOEnchantPlugin
- **Missing `runTimer()` method** in FoliaCompat

### Changed

- EnchantConfig now loads from `enchants/` directory (one file per enchant)
- MMOItems editor shows rarity colors and available enchant list
- Help command uses Adventure API components with click/hover events
- `/sle info` shows stat formulas with proper FLAT/RELATIVE notation

## [1.0.6] - 2026-03-01

### Added - Phase 2 High Priority Fixes

- **[HIGH]** Memory leak prevention with periodic cleanup task (every 5 minutes)
- **[HIGH]** StatModifier cleanup on player quit via ModifierTracker
- **[HIGH]** Async file I/O for activity data saves (prevents lag spikes)
- **[MEDIUM]** Gson singleton utility (GsonUtil) to reduce object allocation

### Fixed

- **[HIGH]** Memory leaks from unbounded player data map
- **[HIGH]** Permanent buff exploits from modifiers not cleaned on quit
- **[HIGH]** Server lag spikes from synchronous file I/O
- **[MEDIUM]** Excessive Gson instance creation

### Changed

- Activity data now cleaned up after 30 minutes of inactivity
- File saves now async (except plugin disable for data integrity)
- StatModifiers tracked and cleaned up automatically
- Modifier keys now include timestamp for uniqueness

### Technical

- Added `ModifierTracker` object for modifier lifecycle management
- Added `GsonUtil` singleton for JSON operations
- Added `lastAccessTime` tracking in ActivityManager
- Added `startCleanupTask()` method with configurable intervals
- Cleanup task runs every 5 minutes, removes data after 30 min inactivity

## [1.0.5] - 2026-03-01

### Fixed - Phase 1 Critical Fixes

- **[CRITICAL]** Added missing `EconomyWrapper.deposit()` method (build-breaking bug)
- **[CRITICAL]** Fixed thread safety in `ActivityManager` using `ConcurrentHashMap`
- **[CRITICAL]** Fixed race conditions in `PlayerActivityData` with synchronized collections
- **[CRITICAL]** Fixed thread safety in `EnchantRegistry` with atomic swap during reload
- **[HIGH]** Added command injection protection in activity rewards
- **[HIGH]** Added comprehensive error handling for file I/O operations
- **[HIGH]** Added event priority to `PlayerActivityListener` (MONITOR)

### Changed

- `ActivityManager.playerData` now uses `ConcurrentHashMap` for thread safety
- `PlayerActivityData.progress` and `completed` now use synchronized collections
- `EnchantRegistry.enchants` now uses `ConcurrentHashMap`
- `EnchantRegistry.loadAll()` now uses atomic swap to prevent concurrent read issues
- `ActivityManager.saveAll()` now logs success/failure counts
- `ActivityManager.unloadPlayerData()` now handles save errors gracefully
- Player names in reward commands are now sanitized to prevent injection

### Technical

- Added `@Volatile` annotation to singleton instances
- Added synchronized blocks for collection access
- Added try-catch blocks with logging for all file operations
- Improved error messages with player names and exception details

## [1.0.4] - 2026-03-01

### Added

- **Activity/Achievement System** - Complete activity tracking with rewards
  - 11 built-in activities (enchant application, fusion, extraction, book combining, rare enchants)
  - Progress tracking with visual progress bars
  - Reward system (money, points, enchant books, commands)
  - Activity GUI (`/sle activity`) with completion status
  - Automatic progress saving per player
  - Activity completion notifications with sound effects
  - Broadcast for legendary achievements
- Activity configuration file (`activity.yml`)
- `/sle activity` command to view activities and progress
- Player join/quit listeners for activity data management
- Activity tracking integration in all enchant operations

### Fixed

- Fixed drag-drop enchant application not working properly
  - Enhanced debug logging throughout the process
  - Fixed permission checks and item type validation
  - Fixed success rate calculation with dust bonus
- Fixed enchant book combining not tracking activities
- Fixed fusion not tracking completion activities
- Fixed extraction not tracking completion activities

### Changed

- Improved activity tracking with metadata filtering
- Enhanced player feedback with action bar progress updates
- Activity data now auto-saves on player quit and plugin disable

### Technical

- Added `ActivityConfigLoader` for loading activity definitions
- Added `ActivityManager` for tracking player progress
- Added `ActivityGui` for displaying activities with progress
- Added `PlayerActivityListener` for data lifecycle management
- Integrated activity tracking in `DragDropListener`, `FusionGui`, and `ExtractionHandler`
- Activity data stored in `plugins/SLMMOEnchant/playerdata/<uuid>.yml`

## [1.0.3] - 2026-03-01

### Fixed

- Fixed color codes not working properly
  - Added support for hex colors (`&#RRGGBB` format)
  - Added support for MiniMessage format (`<yellow>`, `<#ff0000>`, `<bold>`, etc.)
  - Rewrote `TextUtil.kt` with full color support using `LegacyComponentSerializer.builder().hexColors()`
- Fixed drag-drop enchant application not working
  - Added debug logging to `DragDropListener`
  - Added clearer error messages for troubleshooting
- Fixed dust bonus calculation not being applied correctly

### Changed

- Improved error messages for enchant application failures
- Added comprehensive debug logging for troubleshooting

### Technical

- Removed `minimize()` from Shadow JAR configuration (was breaking FoliaLib reflection)
- Migrated from YAML command registration to Paper Lifecycle API + Brigadier
- Changed `description.version` to `pluginMeta.version` for Paper plugin compatibility

## [1.0.2] - 2026-03-01

### Fixed

- Fixed Paper plugin command registration error
  - Removed YAML `commands:` section from `paper-plugin.yml`
  - Implemented Paper Lifecycle API for command registration
  - Added `execute()` method to `SLEnchantCommand` for Brigadier compatibility

### Technical

- Added proper command registration using `LifecycleEvents.COMMANDS`
- Implemented Brigadier command builder with argument support

## [1.0.1] - 2026-03-01

### Fixed

- Fixed `ClassNotFoundException` for FoliaLib implementation classes
  - Removed `minimize()` from Shadow JAR configuration
  - All FoliaLib implementation classes now properly included in JAR

### Technical

- FoliaLib classes now properly shaded and relocated to `com.salyvn.slmmoenchant.libs.folialib`

## [1.0.0] - 2026-02-28

### Added

- Initial release of SLMMOEnchant
- Custom enchantment system for MMOItems
- Drag-drop enchant book application
- Book combining (same enchant + same level = level up)
- Lucky Dust system (increases success rate)
- Enchant extraction (random or selective)
- Fusion GUI for combining enchant books
- Rarity system (Common, Uncommon, Rare, Epic, Legendary)
- Conflict detection between enchants
- Permission-based enchant usage
- Item type restrictions (applicable-to)
- Max enchants per item limit
- Stat modifiers (FLAT, RELATIVE, MULTIPLY)
- Trigger system (HEALTH_BELOW, ON_HIT, etc.)
- Buff system (temporary stat boosts)
- Skill system (MythicMobs skill execution)
- Economy integration (Vault, PlayerPoints)
- Folia compatibility via FoliaLib

### Commands

- `/slenchant reload` - Reload all configs
- `/slenchant give <player> <enchant> [level]` - Give enchant book
- `/slenchant list` - List all enchants
- `/slenchant info <enchant>` - Show enchant details
- `/slenchant debug` - Debug held item
- `/slenchant fusion` - Open fusion GUI
- `/slenchant extract [enchant]` - Extract enchant from item
- `/slenchant activity` - View activities & achievements

### Configuration Files

- `config.yml` - General settings
- `display.yml` - Display & rarity configuration
- `application.yml` - Enchant application methods & dust settings
- `extraction.yml` - Extraction settings
- `enchant.yml` - Enchant definitions
- `fusion.yml` - Fusion recipes
- `activity.yml` - Activity/achievement definitions

---

## Version History Summary

- **1.0.5** - Phase 1 critical fixes: thread safety, missing methods, error handling
- **1.0.4** - Activity/Achievement system, activity tracking, progress GUI
- **1.0.3** - Color system fixes, debug logging
- **1.0.2** - Paper plugin command registration fix
- **1.0.1** - FoliaLib ClassNotFoundException fix
- **1.0.0** - Initial release
