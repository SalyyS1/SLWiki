# Enchant Configuration Guide

Hướng dẫn chi tiết cấu hình enchantment trong SLMMOEnchant.

---

## File Structure

Mỗi enchant là một file YAML riêng trong `plugins/SLMMOEnchant/enchants/`:

```
enchants/
├── inferno.yml
├── king.yml
├── night_vision_custom.yml
├── speed_burst.yml
└── ...
```

---

## Basic Config

```yaml
# Tên hiển thị (hỗ trợ & color codes + hex &#RRGGBB)
name: "&c&lInferno"

# Mô tả hiện trên lore — {KEY} sẽ được thay bằng giá trị từ stats/ability
lore:
  - "&7Sức mạnh hoả ngục"
  - "&7+{ATK} Damage"

# Level tối đa
max-level: 5

# Độ hiếm: COMMON, UNCOMMON, RARE, EPIC, LEGENDARY
rarity: LEGENDARY

# Loại item được gắn — khớp với MMOItems type hoặc material
applicable-to: [SWORD, AXE]

# Tỉ lệ thành công khi apply book (%)
success-rate: 25

# (NEW v1.2.0) Tỉ lệ phá hủy item khi enchant thất bại (%)
# Nếu không set = 0 (không phá hủy)
failure-rate: 30
```

### Success/Failure Logic (NEW v1.2.0)

| Success Roll | Failure Roll | Kết quả                                  |
| :----------: | :----------: | :--------------------------------------- |
|    ✓ Pass    |      —       | Enchant **thành công**                   |
|    ✓ Pass    |    ✓ Pass    | Vẫn **thành công**                       |
|    ✗ Fail    |    ✓ Pass    | **Hủy item** (vũ khí/giáp bị phá)        |
|    ✗ Fail    |    ✗ Fail    | **Không có gì xảy ra** (item giữ nguyên) |

> ⚠ **Mọi trường hợp**: Sách enchant đều bị tiêu hao.

### `applicable-to` Values

| Value        | Mô tả                       |
| ------------ | --------------------------- |
| `SWORD`      | Kiếm (main hand only)       |
| `AXE`        | Rìu (main hand only)        |
| `BOW`        | Cung                        |
| `CROSSBOW`   | Nỏ                          |
| `TRIDENT`    | Đinh ba                     |
| `MACE`       | Chùy                        |
| `PICKAXE`    | Cuốc                        |
| `SHOVEL`     | Xẻng                        |
| `HOE`        | Cuốc nông                   |
| `HELMET`     | Nón (armor slot only)       |
| `CHESTPLATE` | Áo giáp (armor slot only)   |
| `LEGGINGS`   | Quần giáp (armor slot only) |
| `BOOTS`      | Giày (armor slot only)      |
| `ARMOR`      | Tất cả giáp (4 slot armor)  |
| `OFFHAND`    | Tay phụ                     |
| `SHIELD`     | Khiên (tay phụ)             |
| `WEAPON`     | Tất cả vũ khí               |
| `ALL`        | Mọi item                    |

> ⚠ **Slot Validation**: Enchant armor chỉ hoạt động khi mặc đúng slot giáp. Cầm ở tay KHÔNG nhận stats. Enchant weapon chỉ hoạt động khi cầm main hand.

---

## Stats

Stats sử dụng **formula engine** với `{level}` placeholder:

```yaml
stats:
  attack-damage:
    formula: "15+({level}-1)*5" # Level 1: 15, Level 2: 20, Level 3: 25...
    key: ATK # Placeholder {ATK} trong lore
    type: FLAT # Optional: FLAT (mặc định) hoặc RELATIVE (%)

  critical-strike-chance:
    formula: "5+({level}-1)*2"
    key: CRIT
    type: RELATIVE # Relative = phần trăm
```

### Stat IDs (MythicLib)

| Stat ID (kebab-case)     | MythicLib ID           | Mô tả               |
| ------------------------ | ---------------------- | ------------------- |
| `attack-damage`          | ATTACK_DAMAGE          | Sát thương          |
| `attack-speed`           | ATTACK_SPEED           | Tốc độ đánh         |
| `critical-strike-chance` | CRITICAL_STRIKE_CHANCE | Tỉ lệ chí mạng      |
| `critical-strike-power`  | CRITICAL_STRIKE_POWER  | Sát thương chí mạng |
| `max-health`             | MAX_HEALTH             | Máu tối đa          |
| `armor`                  | ARMOR                  | Giáp                |
| `armor-toughness`        | ARMOR_TOUGHNESS        | Độ cứng giáp        |
| `movement-speed`         | MOVEMENT_SPEED         | Tốc độ di chuyển    |
| `health-regeneration`    | HEALTH_REGENERATION    | Hồi máu             |
| `max-mana`               | MAX_MANA               | Mana tối đa         |
| `mana-regeneration`      | MANA_REGENERATION      | Hồi mana            |
| `lifesteal`              | LIFESTEAL              | Hút máu             |
| `skill-damage`           | SKILL_DAMAGE           | Sát thương skill    |
| `cooldown-reduction`     | COOLDOWN_REDUCTION     | Giảm cooldown       |
| `dodge-rating`           | DODGE_RATING           | Né tránh            |
| `block-rating`           | BLOCK_RATING           | Chặn đòn            |
| `defense`                | DEFENSE                | Phòng thủ           |
| `damage-reduction`       | DAMAGE_REDUCTION       | Giảm sát thương     |

> Stat ID viết bằng **kebab-case** trong YAML, tự động chuyển sang UPPER_SNAKE_CASE cho MythicLib.

---

## Abilities (MythicLib Skills)

Kích hoạt MythicLib abilities khi chiến đấu:

```yaml
ability:
  firebolt: # Tên ability (tự đặt)
    type: FIREBOLT # MythicLib ability type
    mode: ATTACK # ATTACK, DAMAGED, SNEAK, RIGHT_CLICK...
    damage:
      formula: "5+({level}-1)*3"
      key: SKILLDMG # Placeholder {SKILLDMG} trong lore
    cooldown:
      formula: "6-({level}-1)*0.5"
    mana:
      formula: "0" # 0 = không tốn mana
```

### Ability Modes

| Mode          | Khi nào kích hoạt |
| ------------- | ----------------- |
| `ATTACK`      | Khi đánh mục tiêu |
| `DAMAGED`     | Khi bị đánh       |
| `SNEAK`       | Khi ngồi xuống    |
| `RIGHT_CLICK` | Khi click phải    |
| `LEFT_CLICK`  | Khi click trái    |

### Common Ability Types

`FIREBOLT`, `LIGHTNING`, `ICE_CRYSTAL`, `ARCANE_HAIL`, `ARCANE_RIFT`, `EARTHQUAKE`, `CHAIN_LIGHTNING`, `SHOCKWAVE`, `SKY_SMASH`, `GOLEM_WRATH`, `EARTH_SPIKE`, `HEAL`, `OVERLOAD`, `SLOW`, `BURN`, `WITHER`, `POISON`, `HEAVY_CHARGE`, `FRENZY`, `LIFE_ENDER`

---

## Permanent Effects (NEW v1.1.5)

Hiệu ứng potion bất vĩnh viễn khi mặc item đúng slot:

```yaml
perm-effects:
  NIGHT_VISION: # Bukkit PotionEffectType
    formula: "0" # Amplifier: 0 = level 1, 1 = level 2...
    key: NV # Placeholder {NV} trong lore

  SPEED:
    formula: "{level}-1" # Scale theo level enchant
    key: SPD
```

### Behavior

- Effect **auto-refresh** mỗi 10 giây
- **Tự xoá** khi tháo item hoặc rời server
- Chỉ apply khi item ở **đúng slot** (giáp = mặc, vũ khí = cầm)

### Common PotionEffectTypes

| Type              | Mô tả                              |
| ----------------- | ---------------------------------- |
| `NIGHT_VISION`    | Nhìn trong bóng tối                |
| `SPEED`           | Tăng tốc                           |
| `HASTE`           | Tăng tốc đào                       |
| `STRENGTH`        | Tăng sát thương                    |
| `JUMP_BOOST`      | Nhảy cao                           |
| `REGENERATION`    | Hồi máu                            |
| `RESISTANCE`      | Giảm sát thương                    |
| `FIRE_RESISTANCE` | Kháng lửa                          |
| `WATER_BREATHING` | Thở dưới nước                      |
| `SLOWNESS`        | Giảm tốc (dùng cho debuff enchant) |

---

## Particles (NEW v1.1.5)

Hiệu ứng particle spawn quanh player khi mặc item:

```yaml
particles:
  - type: FLAME # Bukkit Particle type
    amount: 3 # Số particle mỗi lần spawn
    speed: 0.02 # Tốc độ di chuyển particle
    offset-x: 0.2 # Độ lệch X
    offset-y: 0.3 # Độ lệch Y
    offset-z: 0.2 # Độ lệch Z

  - type: DUST # Particle có màu
    amount: 2
    speed: 0.0
    offset-x: 0.3
    offset-y: 0.5
    offset-z: 0.3
    color: "FF3300" # Hex color (RRGGBB)
    size: 1.2 # Kích thước dust particle
```

### Behavior

- Particles spawn mỗi **5 ticks** (0.25 giây)
- Tự dừng khi tháo item
- `DUST` và `DUST_COLOR_TRANSITION` hỗ trợ `color` + `size`

### Common Particle Types

| Type               | Mô tả                             |
| ------------------ | --------------------------------- |
| `FLAME`            | Lửa                               |
| `ENCHANT`          | Hiệu ứng enchant (xanh)           |
| `HEART`            | Trái tim                          |
| `SMOKE`            | Khói                              |
| `CLOUD`            | Mây                               |
| `DUST`             | Bụi có màu (cần `color` + `size`) |
| `VILLAGER_HAPPY`   | Xanh lá nhỏ                       |
| `CRIT`             | Chí mạng star                     |
| `SOUL`             | Hồn (xanh dương)                  |
| `END_ROD`          | Thanh end rod                     |
| `TOTEM_OF_UNDYING` | Nhiều màu                         |

---

## Set Bonus

Enchant set: đeo nhiều item cùng enchant → bonus tier:

```yaml
set-bonus:
  2: # Cần 2 item trở lên
    stats:
      attack-damage:
        formula: "10+({level}-1)*3"
        type: RELATIVE
        key: ATK
  4: # Cần 4 item trở lên
    stats:
      attack-damage:
        formula: "20+({level}-1)*5"
        type: RELATIVE
        key: ATK2
    ability: # Bonus ability khi đủ 4pc
      firebolt:
        type: FIREBOLT
        mode: ATTACK
        damage:
          formula: "5+({level}-1)*3"
          key: SKILLDMG
        cooldown:
          formula: "6-({level}-1)*0.5"
  6: # Full set (6 items: 4 armor + weapon + offhand)
    stats:
      attack-damage:
        formula: "35+({level}-1)*8"
        type: RELATIVE
        key: ATK3
```

### Slot Counting Rules

- **Armor** (HELMET/CHESTPLATE/LEGGINGS/BOOTS) → chỉ đếm khi **mặc đúng slot**
- **Weapon** → chỉ đếm khi **cầm main hand**
- **Offhand** → chỉ đếm khi ở **off hand**
- Cầm giáp ở tay KHÔNG đếm vào set

---

## Complete Example

```yaml
# Inferno — Full-featured enchant example
name: "&c&lInferno"
lore:
  - "&7Sức mạnh hoả ngục"
  - "&7+{ATK} Damage"
  - "&7Kích hoạt &cFirebolt &7khi đánh"
  - "&7Sát thương kỹ năng: &c{SKILLDMG}"
max-level: 5
rarity: LEGENDARY
applicable-to: [SWORD, AXE]
success-rate: 25
failure-rate: 20

stats:
  attack-damage:
    formula: "15+({level}-1)*5"
    key: ATK

ability:
  firebolt:
    type: FIREBOLT
    mode: ATTACK
    damage:
      formula: "5+({level}-1)*3"
      key: SKILLDMG
    cooldown:
      formula: "6-({level}-1)*0.5"
    mana:
      formula: "0"

perm-effects:
  SPEED:
    formula: "0"
    key: SPD

particles:
  - type: FLAME
    amount: 3
    speed: 0.02
    offset-x: 0.2
    offset-y: 0.3
    offset-z: 0.2
  - type: DUST
    amount: 2
    color: "FF3300"
    size: 1.2
```

---

## Formula Engine

Formulas hỗ trợ phép tính toán học với biến:

| Biến           | Mô tả                   |
| -------------- | ----------------------- |
| `{level}`      | Level enchant hiện tại  |
| `{level_item}` | Level của item (nếu có) |

### Ví dụ

| Formula               | Level 1 | Level 3 | Level 5 |
| --------------------- | ------- | ------- | ------- |
| `"10"`                | 10      | 10      | 10      |
| `"{level}*5"`         | 5       | 15      | 25      |
| `"15+({level}-1)*5"`  | 15      | 25      | 35      |
| `"6-({level}-1)*0.5"` | 6       | 5       | 4       |
| `"100-{level}*10"`    | 90      | 70      | 50      |

---

## Enchant Table (NEW v1.2.0)

Tích hợp SLEnchant với bàn enchant vanilla. Khi player enchant tại bàn, có cơ hội nhận thêm SLEnchant.

### Config: `settings/enchant-table.yml`

```yaml
enabled: true

# true = WHITELIST (chỉ enchant trong list), false = BLACKLIST (loại trừ)
enchant-list:
  mode: false
  list: []

# Override weight/level cho từng enchant
enchants:
  aegis:
    weight: 2.0 # Tỉ lệ cao gấp đôi
    min-level: 1 # Tối thiểu cấp 1
    max-level: 2 # Tối đa cấp 2 dù config max cao hơn
```

### Flow

1. Kiểm tra loại item → lọc enchant phù hợp
2. Roll tier (rarity) dựa trên cost level (level 30 = chance LEGENDARY/MYTHIC cao)
3. Roll enchant cụ thể theo weight trong tier đó
4. Roll level ngẫu nhiên trong khoảng min-max

---

## Grindstone (NEW v1.2.0)

Grindstone vanilla tự động xóa tất cả SLEnchant khỏi item:

- Đặt item vào grindstone → lấy result → SLEnchant bị strip
- Lore được re-render, stats được recalculate
- Không cần config — tự động hoạt động

---

## Enchant Slots (Updated v1.2.0)

- `max-enchants-per-item: 5` trong `config.yml`
- **Vanilla enchants TÍNH VÀO giới hạn** — VD: 2 vanilla + 3 custom = 5/5 (đầy)
- Slot Increaser có thể tăng thêm slot
- Lore hiện: `⚡ Enchant: 5/5`

---

## Inventory Scan (NEW v1.2.0)

```yaml
# config.yml
inventory-interval: 200 # ticks (200 = 10 giây)
```

Quét định kỳ trang bị của player, re-render lore và recalculate stats. Hữu ích khi item thay đổi bên ngoài plugin.
