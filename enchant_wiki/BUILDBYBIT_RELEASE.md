# OmniEnchant 3.15.0 Interactive Wiki Update (BuiltByBit)

## Title

OmniEnchant 3.15.0 - Interactive Runtime Wiki and Complete Authoring Reference

## Short Description

OmniEnchant now ships with a rebuilt documentation application: global search,
a ten-file configuration explorer, a source-verified mechanic and condition
catalog, copy-ready YAML, responsive navigation, and a live enchant-lattice visual.
The wiki still opens directly from disk without a build step or web server.

## Key Highlights

- Search pages, config files, mechanics, conditions, aliases, and triggers
- Browse `config.yml` plus all nine `settings/` files in a folder-style explorer
- Reference all 14 custom mechanics with parameters, hard limits, and examples
- Reference 12 RPG condition families, 13 environment forms, and nine triggers
- Copy YAML from any code block, including through local `file://` use
- Navigate every page through one responsive, keyboard-accessible shell
- Reduced-motion-aware WebGL enchant lattice with a static fallback
- Corrected stale counts, links, versions, navigation, and encoding artifacts

## Compatibility

- Paper/Folia: 1.21+
- Java: 21
- MMOItems: 6.10.1+
- MythicLib: 1.7.1+
- MythicMobs: optional, recommended for custom RPG skills
- ProtocolLib: optional

## Migration Notes

1. Deploy `OmniEnchant.jar` while retaining the existing plugin data directory.
2. No config value is replaced; missing default keys continue to migrate safely.
3. Open `enchant_wiki/index.html` directly or host the folder as static files.
4. Use `reference.html` for canonical mechanic/condition grammar and examples.
5. Existing enchant, combo, MMOItems slot, and MythicMobs behavior is unchanged.

## Validation

- All ten pages verified at 1440px, 768px, and 375px widths
- 69 internal deep links validated
- Direct `file://` shell, search, and WebGL rendering verified
- JavaScript syntax, keyboard controls, accessible labels, and overflow audited

## Changelog Summary

See `enchant_wiki/changelog.html` and `enchant_wiki/CHANGELOG.md` for full details.
