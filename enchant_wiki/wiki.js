(function () {
  "use strict";

  const data = window.OmniWikiData;
  if (!data) return;

  const icons = {
    home: "layout-dashboard",
    config: "folder-cog",
    enchant: "sparkles",
    reference: "book-open-text",
    features: "workflow",
    items: "package-open",
    commands: "terminal",
    lore: "rows-3",
    rpg: "swords",
    history: "history"
  };

  const iconFallbacks = {
    menu: "&#9776;",
    x: "&times;",
    search: "&#9906;",
    github: "GH",
    copy: "[]",
    check: "OK",
    "arrow-up": "^",
    "arrow-up-right": "^",
    "chevron-down": ">",
    "link-2": "#",
    "triangle-alert": "!"
  };

  const navigation = [
    { label: "Start", items: [
      ["Overview", "index.html", icons.home],
      ["Configuration", "configuration.html", icons.config],
      ["Runtime Reference", "reference.html", icons.reference]
    ] },
    { label: "Build", items: [
      ["Enchant System", "enchants.html", icons.enchant],
      ["Feature Systems", "features.html", icons.features],
      ["Items & Systems", "items.html", icons.items],
      ["Lore Format", "lore-format.html", icons.lore],
      ["RPG Abilities", "rpg-abilities.html", icons.rpg]
    ] },
    { label: "Operate", items: [
      ["Commands & API", "commands.html", icons.commands],
      ["Changelog", "changelog.html", icons.history]
    ] }
  ];

  const pageOutline = {
    "index.html": [["System map", "#start"], ["Installation", "#install"], ["Enchant slots", "#quick-config"]],
    "enchants.html": [["File structure", "#file-structure"], ["Base fields", "#base-fields"], ["Stats", "#stats"], ["Abilities", "#abilities"], ["Mechanics", "#mechanics"], ["Conflicts", "#conflicts"], ["Formulas", "#formulas"], ["Lore placeholders", "#placeholders"], ["Full example", "#full-example"]],
    "features.html": [["Feature map", "#feature-map"], ["Drag & drop", "#dragdrop"], ["Protection stone", "#protection"], ["Tier shop", "#tiershop"], ["Enchant browser", "#browser"], ["Dust crafting", "#dust-crafting"], ["Extraction", "#extraction"], ["Fusion", "#fusion"], ["Grindstone & anvil", "#grindstone"], ["Enchant table", "#enchant-table"], ["Passive abilities", "#passive-abilities"], ["Active abilities", "#interaction-abilities"], ["Vanilla stat bridge", "#vanilla-stat-bridge"], ["Souls", "#soul-system"], ["Trak", "#trak-system"], ["Set bonuses", "#set-bonus"], ["Slot increaser", "#slot-increaser"]],
    "items.html": [["Custom items", "#items"], ["Souls", "#souls"], ["Set enchants", "#sets"], ["Enchant slots", "#slots"], ["Conflict pairs", "#conflict-pairs"]],
    "lore-format.html": [["How it works", "#how-it-works"], ["Slot setup", "#slot-setup"], ["Legacy block", "#adding"], ["MMOItems build path", "#mmoitems-build-path"], ["Visual result", "#visual"], ["Modifier lore", "#modifier"], ["External enchants", "#external"], ["Spacing", "#spacing"]],
    "rpg-abilities.html": [["Mythic signals", "#mythic-signal-bridge"], ["Equipped item toolkit", "#equipped-item-toolkit"], ["Activation conditions", "#activation-conditions"], ["Chain diagnostics", "#chain-context"]],
    "commands.html": [["Commands", "#commands"], ["Permissions", "#permissions"], ["Placeholders", "#papi"], ["Developer API", "#api"]],
    "changelog.html": [["v3.17.0", "#v3-17-0"], ["v3.16.0", "#v3-16-0"], ["v3.15.0", "#v3-15-0"], ["v3.14.0", "#v3-14-0"], ["v3.13.1", "#v3-13-1"], ["v3.13.0", "#v3-13-0"]]
  };

  function outlineFor(href) {
    if (href === "configuration.html") return data.configs.map(item => [item.name, `?file=${item.id}`]);
    if (href === "reference.html") return [
      ["Native mechanics", "?group=mechanics"], ["Mythic mechanics", "?group=mythic-mechanics"],
      ["RPG conditions", "?group=rpg"], ["Equipment conditions", "?group=equipment"],
      ["Mythic conditions", "?group=mythic-conditions"], ["Environment", "?group=environment"],
      ["Triggers", "?group=triggers"]
    ];
    return pageOutline[href] || [];
  }

  const pageName = location.pathname.split("/").pop() || "index.html";
  const escapeHtml = (value) => String(value == null ? "" : value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function icon(name, label) {
    return `<i data-lucide="${name}"${label ? ` aria-label="${escapeHtml(label)}"` : " aria-hidden=\"true\""}>${iconFallbacks[name] || "&middot;"}</i>`;
  }

  function renderShell() {
    const sidebar = document.getElementById("sidebar") || document.querySelector(".sidebar");
    if (!sidebar) return;
    sidebar.id = "sidebar";
    sidebar.setAttribute("aria-label", "Documentation navigation");
    sidebar.innerHTML = `
      <a class="brand-lockup" href="index.html" aria-label="OmniEnchant overview">
        <span class="brand-mark" aria-hidden="true"><span>O</span></span>
        <span class="brand-copy"><strong>OmniEnchant</strong><small>RPG enchant engine</small></span>
      </a>
      <nav class="sidebar-nav">
        ${navigation.map(group => `
          <div class="nav-group">
            <div class="nav-label">${group.label}</div>
            ${group.items.map(([label, href, glyph]) => {
              const active = pageName === href;
              const children = outlineFor(href);
              return `<div class="nav-page${active ? " active expanded" : ""}">
                <div class="nav-page-row">
                  <a href="${href}" class="nav-link${active ? " active" : ""}"${active ? ' aria-current="page"' : ""}>${icon(glyph)}<span>${label}</span></a>
                  ${children.length ? `<button class="nav-expand" type="button" data-nav-expand aria-label="${active ? "Collapse" : "Show"} ${escapeHtml(label)} topics" aria-expanded="${active}">${icon("chevron-down")}</button>` : ""}
                </div>
                ${children.length ? `<div class="nav-sublist"${active ? "" : " hidden"}>${children.map(([childLabel, target]) => `<a class="nav-sublink" href="${href}${target}" data-section="${target.startsWith("#") ? target.slice(1) : ""}">${escapeHtml(childLabel)}</a>`).join("")}</div>` : ""}
              </div>`;
            }).join("")}
          </div>`).join("")}
      </nav>
      <div class="sidebar-footer">
        <span class="status-dot" aria-hidden="true"></span>
        <span><strong>v${data.version}</strong><small>Paper 1.21+ / Folia</small></span>
      </div>`;

    let mobileButton = document.getElementById("mobileToggle") || document.querySelector(".mobile-toggle");
    if (!mobileButton) {
      mobileButton = document.createElement("button");
      document.body.prepend(mobileButton);
    }
    if (mobileButton.tagName !== "BUTTON") {
      const replacement = document.createElement("button");
      replacement.id = "mobileToggle";
      mobileButton.replaceWith(replacement);
      mobileButton = replacement;
    }
    mobileButton.id = "mobileToggle";
    mobileButton.className = "mobile-toggle icon-button";
    mobileButton.type = "button";
    mobileButton.setAttribute("aria-label", "Open navigation");
    mobileButton.setAttribute("aria-controls", "sidebar");
    mobileButton.setAttribute("aria-expanded", "false");
    mobileButton.innerHTML = icon("menu");

    let scrim = document.querySelector(".nav-scrim");
    if (!scrim) {
      scrim = document.createElement("button");
      scrim.className = "nav-scrim";
      scrim.type = "button";
      scrim.setAttribute("aria-label", "Close navigation");
      document.body.append(scrim);
    }

    const closeDrawer = () => {
      sidebar.classList.remove("open");
      document.body.classList.remove("nav-open");
      mobileButton.setAttribute("aria-expanded", "false");
      mobileButton.innerHTML = icon("menu");
      refreshIcons();
    };
    const openDrawer = () => {
      sidebar.classList.add("open");
      document.body.classList.add("nav-open");
      mobileButton.setAttribute("aria-expanded", "true");
      mobileButton.innerHTML = icon("x");
      refreshIcons();
    };
    mobileButton.addEventListener("click", () => sidebar.classList.contains("open") ? closeDrawer() : openDrawer());
    scrim.addEventListener("click", closeDrawer);
    sidebar.querySelectorAll("[data-nav-expand]").forEach(button => button.addEventListener("click", () => {
      const page = button.closest(".nav-page");
      const expanded = !page.classList.contains("expanded");
      page.classList.toggle("expanded", expanded);
      page.querySelector(".nav-sublist").hidden = !expanded;
      button.setAttribute("aria-expanded", String(expanded));
    }));
    sidebar.querySelectorAll("a").forEach(link => link.addEventListener("click", closeDrawer));

    const content = document.querySelector(".content");
    if (!content) return;
    const title = data.pages.find(page => page.href === pageName)?.title || document.title.split("|")[0].trim();
    const utility = document.createElement("header");
    utility.className = "utility-bar";
    utility.innerHTML = `
      <div class="utility-context"><span>OmniEnchant</span><i>/</i><strong>${escapeHtml(title)}</strong></div>
      <div class="utility-actions">
        <button class="search-trigger" type="button" data-search-open>
          ${icon("search")}<span>Search documentation</span><kbd>Ctrl K</kbd>
        </button>
        <a class="icon-button" href="https://github.com/SalyyS1/OminiEnchant" target="_blank" rel="noreferrer" aria-label="Open GitHub repository" title="GitHub repository">${icon("github")}</a>
      </div>`;
    content.prepend(utility);

    document.querySelectorAll(".version-badge").forEach(el => { el.textContent = "v" + data.version; });
    document.querySelectorAll(".footer p").forEach(el => {
      el.innerHTML = el.innerHTML.replace(/v\d+\.\d+\.\d+/g, "v" + data.version);
    });
  }

  function buildSearchIndex() {
    return [
      ...data.pages.map(item => ({ type: "Page", title: item.title, summary: item.summary, href: item.href, terms: item.terms })),
      ...data.configs.map(item => ({ type: "Config", title: item.name, summary: item.summary, href: `configuration.html?file=${item.id}`, terms: item.topics.join(" ") + " " + item.path })),
      ...data.mechanics.map(item => ({ type: item.kind, title: item.name, summary: item.summary, href: item.href, terms: item.modes.join(" ") + " " + item.params.join(" ") + " " + item.aliases.join(" ") })),
      ...data.mythicMechanics.map(item => ({ type: item.kind, title: item.name, summary: item.summary, href: item.href, terms: item.params.join(" ") + " " + item.aliases.join(" ") })),
      ...data.rpgConditions.map(item => ({ type: item.kind, title: item.name, summary: item.summary, href: item.href, terms: item.syntax + " " + item.aliases.join(" ") })),
      ...data.equipmentConditions.map(item => ({ type: item.kind, title: item.name, summary: item.summary, href: item.href, terms: item.syntax + " " + item.category })),
      ...data.mythicConditions.map(item => ({ type: item.kind, title: item.name, summary: item.summary, href: item.href, terms: item.syntax + " " + item.aliases.join(" ") })),
      ...data.environmentConditions.map(item => ({ type: item.kind, title: item.name, summary: item.summary, href: item.href, terms: item.syntax })),
      ...data.triggers.map(item => ({ type: item.kind, title: item.name, summary: item.summary, href: item.href, terms: item.aliases.join(" ") }))
    ].map(item => ({ ...item, haystack: `${item.type} ${item.title} ${item.summary} ${item.terms || ""}`.toLowerCase() }));
  }

  function setupSearch() {
    const index = buildSearchIndex();
    const dialog = document.createElement("dialog");
    dialog.className = "search-dialog";
    dialog.setAttribute("aria-label", "Search OmniEnchant documentation");
    dialog.innerHTML = `
      <div class="search-box">
        <div class="search-field">${icon("search")}<input type="search" autocomplete="off" spellcheck="false" placeholder="Search mechanics, conditions, configs..." aria-label="Search documentation"><button class="icon-button" type="button" data-search-close aria-label="Close search">${icon("x")}</button></div>
        <div class="search-results" role="listbox" aria-label="Search results"></div>
        <div class="search-empty"><strong>No matching entry</strong><span>Try a mechanic name, config file, trigger, or command.</span></div>
        <div class="search-hint"><span>Runtime-sourced index</span><span><kbd>Esc</kbd> close</span></div>
      </div>`;
    document.body.append(dialog);
    const input = dialog.querySelector("input");
    const results = dialog.querySelector(".search-results");
    const empty = dialog.querySelector(".search-empty");

    const render = () => {
      const query = input.value.trim().toLowerCase();
      const words = query.split(/\s+/).filter(Boolean);
      const matches = index.filter(item => words.every(word => item.haystack.includes(word))).slice(0, 12);
      results.innerHTML = matches.map((item, position) => `
        <a class="search-result${position === 0 ? " selected" : ""}" href="${item.href}" role="option" aria-selected="${position === 0}">
          <span class="result-icon">${icon(item.type === "Config" ? "file-cog" : item.type.includes("condition") ? "git-branch" : item.type === "Mechanic" ? "zap" : "file-text")}</span>
          <span><small>${escapeHtml(item.type)}</small><strong>${escapeHtml(item.title)}</strong><em>${escapeHtml(item.summary)}</em></span>
          ${icon("arrow-up-right")}
        </a>`).join("");
      empty.hidden = matches.length > 0;
      results.hidden = matches.length === 0;
      refreshIcons();
    };

    const open = () => {
      if (!dialog.open) dialog.showModal();
      input.value = "";
      render();
      requestAnimationFrame(() => input.focus());
    };
    const close = () => dialog.open && dialog.close();
    document.querySelectorAll("[data-search-open]").forEach(button => button.addEventListener("click", open));
    dialog.querySelector("[data-search-close]").addEventListener("click", close);
    dialog.addEventListener("click", event => { if (event.target === dialog) close(); });
    dialog.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    });
    input.addEventListener("input", render);
    input.addEventListener("keydown", event => {
      const links = [...results.querySelectorAll("a")];
      const current = links.findIndex(link => link.classList.contains("selected"));
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const next = (current + direction + links.length) % links.length;
        links.forEach((link, i) => {
          link.classList.toggle("selected", i === next);
          link.setAttribute("aria-selected", String(i === next));
        });
        links[next]?.scrollIntoView({ block: "nearest" });
      } else if (event.key === "Enter" && links.length) {
        event.preventDefault();
        location.href = (links[current >= 0 ? current : 0]).href;
      }
    });
    document.addEventListener("keydown", event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
      if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "")) {
        event.preventDefault();
        open();
      }
    });
  }

  async function copyText(text, button) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (_) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      copied = document.execCommand("copy");
      area.remove();
    }
    const original = button.innerHTML;
    button.innerHTML = copied ? `${icon("check")}<span>Copied</span>` : `${icon("triangle-alert")}<span>Copy failed</span>`;
    button.classList.toggle("copied", copied);
    refreshIcons();
    setTimeout(() => {
      button.innerHTML = original;
      button.classList.remove("copied");
      refreshIcons();
    }, 1600);
  }

  function enhanceCodeBlocks(root) {
    (root || document).querySelectorAll("pre").forEach((pre, index) => {
      if (pre.dataset.copyReady) return;
      pre.dataset.copyReady = "true";
      const host = pre.closest(".config-block") || pre.parentElement;
      let toolbar = host?.querySelector(":scope > .config-header");
      if (!toolbar) {
        toolbar = document.createElement("div");
        toolbar.className = "code-toolbar";
        toolbar.innerHTML = `<span>${pre.dataset.language || "YAML / text"}</span>`;
        pre.before(toolbar);
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-button";
      button.setAttribute("aria-label", `Copy code sample ${index + 1}`);
      button.innerHTML = `${icon("copy")}<span>Copy</span>`;
      button.addEventListener("click", () => copyText(pre.textContent.trim(), button));
      toolbar.append(button);
    });
  }

  function renderConfigExplorer() {
    const root = document.getElementById("config-explorer");
    if (!root) return;
    root.innerHTML = `
      <aside class="config-tree" aria-label="Configuration files">
        <div class="tree-head"><span>Plugin files</span><small>${data.configs.length} files</small></div>
        <div class="tree-root"><span>${icon("folder-open")}</span><strong>OmniEnchant/</strong></div>
        <div class="tree-files" role="listbox"></div>
      </aside>
      <article class="config-view" aria-live="polite"></article>`;
    const list = root.querySelector(".tree-files");
    const view = root.querySelector(".config-view");
    list.innerHTML = data.configs.map(item => `
      <button type="button" class="tree-file" data-config="${item.id}" role="option">
        <span class="tree-indent${item.group === "Root" ? " root-file" : ""}"></span>${icon("file-cog")}
        <span><strong>${item.name}</strong><small>${item.group}</small></span>
      </button>`).join("");

    const select = (id, pushState) => {
      const item = data.configs.find(entry => entry.id === id) || data.configs[0];
      list.querySelectorAll("button").forEach(button => {
        const active = button.dataset.config === item.id;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });
      view.innerHTML = `
        <div class="config-view-head">
          <div><span class="eyebrow">${escapeHtml(item.group)}</span><h2>${escapeHtml(item.name)}</h2><code>${escapeHtml(item.path)}</code></div>
          <div class="topic-row">${item.topics.map(topic => `<span>${escapeHtml(topic)}</span>`).join("")}</div>
        </div>
        <p class="config-summary">${escapeHtml(item.summary)}</p>
        <div class="config-block explorer-code">
          <div class="config-header"><span class="config-file">${escapeHtml(item.name)}</span><span class="config-desc">Focused example</span></div>
          <pre class="code-block">${escapeHtml(item.source)}</pre>
        </div>
        <div class="field-notes"><h3>Operational notes</h3>${item.notes.map(note => `<p>${note.replace(/`([^`]+)`/g, "<code>$1</code>")}</p>`).join("")}</div>`;
      if (pushState) {
        const url = new URL(location.href);
        url.searchParams.set("file", item.id);
        history.replaceState(null, "", url);
      }
      enhanceCodeBlocks(view);
      refreshIcons();
    };
    list.addEventListener("click", event => {
      const button = event.target.closest("[data-config]");
      if (button) select(button.dataset.config, true);
    });
    list.addEventListener("keydown", event => {
      if (!/Arrow(Down|Up)/.test(event.key)) return;
      event.preventDefault();
      const buttons = [...list.querySelectorAll("button")];
      const current = buttons.indexOf(document.activeElement);
      const next = (current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      buttons[next].click();
    });
    select(new URLSearchParams(location.search).get("file"), false);
  }

  function renderReference() {
    const root = document.getElementById("reference-browser");
    if (!root) return;
    const groups = [
      ["mechanics", "Native Mechanics", data.mechanics],
      ["mythic-mechanics", "Mythic Mechanics", data.mythicMechanics],
      ["rpg", "RPG Conditions", data.rpgConditions],
      ["equipment", "Equipment Conditions", data.equipmentConditions],
      ["mythic-conditions", "Mythic Conditions", data.mythicConditions],
      ["environment", "Environment", data.environmentConditions],
      ["triggers", "Triggers", data.triggers]
    ];
    root.innerHTML = `
      <div class="reference-tools">
        <div class="reference-filter">${icon("search")}<input type="search" placeholder="Filter this reference..." aria-label="Filter runtime reference"></div>
        <div class="reference-tabs" role="tablist">${groups.map(([id, label, items], i) => `<button type="button" role="tab" data-reference-tab="${id}" aria-selected="${i === 0}">${escapeHtml(label)}<span>${items.length}</span></button>`).join("")}</div>
      </div>
      <div class="reference-summary" aria-live="polite"></div>
      <div class="reference-list"></div>`;
    const input = root.querySelector("input");
    const list = root.querySelector(".reference-list");
    const summary = root.querySelector(".reference-summary");
    const requestedGroup = new URLSearchParams(location.search).get("group");
    let active = location.hash.startsWith("#mythic-mechanic-") ? "mythic-mechanics"
      : location.hash.startsWith("#mythic-condition-") ? "mythic-conditions"
      : location.hash.startsWith("#equipment-condition-") ? "equipment"
      : location.hash.startsWith("#condition-") ? "rpg"
      : location.hash.startsWith("#environment-") ? "environment"
      : location.hash.startsWith("#trigger-") ? "triggers"
      : groups.some(([id]) => id === requestedGroup) ? requestedGroup : "mechanics";

    const render = () => {
      const group = groups.find(([id]) => id === active);
      const query = input.value.trim().toLowerCase();
      const items = group[2].filter(item => JSON.stringify(item).toLowerCase().includes(query));
      root.querySelectorAll("[data-reference-tab]").forEach(tab => {
        const selected = tab.dataset.referenceTab === active;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      summary.innerHTML = `<strong>${items.length}</strong> of ${group[2].length} ${escapeHtml(group[1].toLowerCase())}`;
      list.innerHTML = items.map(item => {
        const anchor = item.href.split("#")[1];
        const meta = item.params
          ? `<div><dt>Category</dt><dd><code>${escapeHtml(item.category)}</code></dd></div><div><dt>Modes</dt><dd>${item.modes.map(value => `<code>${value}</code>`).join("")}</dd></div><div><dt>Parameters</dt><dd>${item.params.map(value => `<span>${escapeHtml(value)}</span>`).join("")}</dd></div><div><dt>Policy</dt><dd><span>${escapeHtml(item.limits)}</span></dd></div>`
          : active === "triggers" ? "" : `<div><dt>Syntax</dt><dd><code>${escapeHtml(item.syntax)}</code></dd></div><div><dt>Limits</dt><dd><span>${escapeHtml(item.limits)}</span></dd></div>`;
        return `<article class="reference-entry" id="${anchor}" tabindex="-1">
          <header><div><span class="entry-kind">${escapeHtml(item.kind)}</span><h2>${escapeHtml(item.name)}</h2></div><a href="#${anchor}" aria-label="Link to ${escapeHtml(item.name)}">${icon("link-2")}</a></header>
          <p>${escapeHtml(item.summary)}</p>
          <dl class="entry-meta">${meta}${item.aliases?.length ? `<div><dt>Aliases</dt><dd>${item.aliases.map(value => `<code>${escapeHtml(value)}</code>`).join("")}</dd></div>` : ""}</dl>
          <div class="config-block"><div class="config-header"><span class="config-file">Example</span></div><pre class="code-block">${escapeHtml(item.example)}</pre></div>
        </article>`;
      }).join("") || `<div class="reference-empty"><strong>No matching runtime entry</strong><span>Clear the filter or select another category.</span></div>`;
      enhanceCodeBlocks(list);
      refreshIcons();
    };
    root.querySelector(".reference-tabs").addEventListener("click", event => {
      const tab = event.target.closest("[data-reference-tab]");
      if (!tab) return;
      active = tab.dataset.referenceTab;
      const url = new URL(location.href);
      url.searchParams.set("group", active);
      url.hash = "";
      history.replaceState(null, "", url);
      render();
    });
    input.addEventListener("input", render);
    render();
    if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ block: "start" }));
  }

  function setupPageUtilities() {
    const progress = document.createElement("div");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.append(progress);
    const backTop = document.createElement("button");
    backTop.className = "back-top icon-button";
    backTop.type = "button";
    backTop.setAttribute("aria-label", "Back to top");
    backTop.title = "Back to top";
    backTop.innerHTML = icon("arrow-up");
    backTop.addEventListener("click", () => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
    document.body.append(backTop);
    const update = () => {
      const distance = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
      backTop.classList.toggle("visible", scrollY > 480);
    };
    addEventListener("scroll", update, { passive: true });
    update();

    document.querySelectorAll("table").forEach(table => {
      if (!table.parentElement.classList.contains("table-wrap")) {
        const wrap = document.createElement("div");
        wrap.className = "table-wrap";
        table.before(wrap);
        wrap.append(table);
      }
    });
  }

  function setupOutlineSpy() {
    const links = [...document.querySelectorAll(`.nav-page.active .nav-sublink[data-section]:not([data-section=""])`)];
    if (!links.length || !("IntersectionObserver" in window)) return;
    const byId = new Map(links.map(link => [link.dataset.section, link]));
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      links.forEach(link => link.classList.toggle("active", link === byId.get(visible.target.id)));
    }, { rootMargin: "-18% 0px -70%", threshold: 0 });
    byId.forEach((_, id) => { const section = document.getElementById(id); if (section) observer.observe(section); });
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
  }

  function loadIcons() {
    if (window.lucide) return refreshIcons();
    const script = document.createElement("script");
    script.src = "https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js";
    script.defer = true;
    script.onload = refreshIcons;
    document.head.append(script);
  }

  renderShell();
  renderConfigExplorer();
  renderReference();
  setupSearch();
  enhanceCodeBlocks();
  setupPageUtilities();
  setupOutlineSpy();
  loadIcons();
}());
