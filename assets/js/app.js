// Reemplazar por el número real en formato internacional, sin +, espacios ni guiones.
const WHATSAPP_PHONE = "5492477669952";

const EXCHANGE_RULE =
  "El canje se realiza figurita por figurita; si necesitas más figuritas de las que vos me das; el canje se realiza 1 sobre cerrado cada 7 figuritas.";

const state = {
  needed: new Map(),
  offered: new Map(),
};

const elements = {
  loadStatus: document.querySelector("#load-status"),
  exchangeContent: document.querySelector("#exchange-content"),
  summary: document.querySelector("#summary"),
  formMessage: document.querySelector("#form-message"),
  exchangeRule: document.querySelector("#exchange-rule"),
  suggestedPacks: document.querySelector("#suggested-packs"),
  exchangeButton: document.querySelector("#exchange-button"),
  needed: {
    list: document.querySelector("#needed-list"),
    empty: document.querySelector("#needed-empty"),
    search: document.querySelector("#needed-search"),
    clear: document.querySelector("#needed-clear"),
    counter: document.querySelector("#needed-counter"),
    total: document.querySelector("#needed-total"),
  },
  offered: {
    list: document.querySelector("#offered-list"),
    empty: document.querySelector("#offered-empty"),
    search: document.querySelector("#offered-search"),
    clear: document.querySelector("#offered-clear"),
    counter: document.querySelector("#offered-counter"),
    total: document.querySelector("#offered-total"),
  },
  differenceTotal: document.querySelector("#difference-total"),
};

function normalizeDataset(dataset) {
  return Object.entries(dataset)
    .map(([country, numbers]) => {
      const uniqueNumbers = [...new Set(numbers.map(Number).filter(Number.isFinite))].sort(
        (a, b) => a - b,
      );

      return [country.toUpperCase(), uniqueNumbers];
    })
    .filter(([, numbers]) => numbers.length > 0)
    .sort(([countryA], [countryB]) => countryA.localeCompare(countryB));
}

function itemKey(country, number) {
  return `${country}:${number}`;
}

function createStickerOption(section, country, number) {
  const label = document.createElement("label");
  label.className = "sticker-option";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.value = String(number);
  input.dataset.country = country;
  input.setAttribute("aria-label", `${country} figurita ${number}`);
  input.addEventListener("change", () => {
    const selection = state[section];
    const key = itemKey(country, number);

    if (input.checked) {
      selection.set(key, { country, number });
    } else {
      selection.delete(key);
    }

    updateSummary();
  });

  const visibleNumber = document.createElement("span");
  visibleNumber.textContent = number;

  label.append(input, visibleNumber);
  return label;
}

function renderSection(section, dataset) {
  const fragment = document.createDocumentFragment();

  dataset.forEach(([country, numbers]) => {
    const group = document.createElement("article");
    group.className = "country-group";
    group.dataset.country = country;
    group.dataset.numbers = numbers.join(" ");

    const heading = document.createElement("h3");
    heading.className = "country-code";
    heading.textContent = country;

    const stickerGrid = document.createElement("div");
    stickerGrid.className = "sticker-grid";
    numbers.forEach((number) => {
      stickerGrid.append(createStickerOption(section, country, number));
    });

    group.append(heading, stickerGrid);
    fragment.append(group);
  });

  elements[section].list.replaceChildren(fragment);
}

function filterSection(section) {
  const query = elements[section].search.value.trim().toUpperCase();
  let visibleGroups = 0;

  elements[section].list.querySelectorAll(".country-group").forEach((group) => {
    const countryMatches = group.dataset.country.includes(query);
    const numberMatches = group.dataset.numbers
      .split(" ")
      .some((number) => number.includes(query));
    const isVisible = !query || countryMatches || numberMatches;

    group.hidden = !isVisible;
    visibleGroups += Number(isVisible);
  });

  elements[section].empty.hidden = visibleGroups > 0;
}

function clearSelection(section) {
  state[section].clear();
  elements[section].list.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  updateSummary();
}

function selectionByCountry(selection) {
  const grouped = new Map();

  [...selection.values()]
    .sort((a, b) => a.country.localeCompare(b.country) || a.number - b.number)
    .forEach(({ country, number }) => {
      if (!grouped.has(country)) {
        grouped.set(country, []);
      }
      grouped.get(country).push(number);
    });

  return grouped;
}

function formatSelection(selection) {
  return [...selectionByCountry(selection)]
    .map(([country, numbers]) => `${country}: ${numbers.join(", ")}`)
    .join("\n");
}

function updateSummary() {
  const neededTotal = state.needed.size;
  const offeredTotal = state.offered.size;
  const difference = Math.max(neededTotal - offeredTotal, 0);

  elements.needed.counter.textContent = `${neededTotal} seleccionada${neededTotal === 1 ? "" : "s"}`;
  elements.offered.counter.textContent = `${offeredTotal} seleccionada${offeredTotal === 1 ? "" : "s"}`;
  elements.needed.total.textContent = neededTotal;
  elements.offered.total.textContent = offeredTotal;
  elements.differenceTotal.textContent = difference;

  const ruleApplies = neededTotal > offeredTotal;
  elements.exchangeRule.hidden = !ruleApplies;
  if (ruleApplies) {
    const suggestedPacks = Math.ceil(difference / 7);
    elements.suggestedPacks.textContent =
      `Diferencia: ${difference} figurita${difference === 1 ? "" : "s"}. ` +
      `Sobres sugeridos: ${suggestedPacks}.`;
  }

  hideFormMessage();
}

function showFormMessage(message, type) {
  elements.formMessage.textContent = message;
  elements.formMessage.className = `status status-${type}`;
  elements.formMessage.hidden = false;
}

function hideFormMessage() {
  elements.formMessage.hidden = true;
  elements.formMessage.textContent = "";
}

function buildWhatsAppMessage() {
  const neededTotal = state.needed.size;
  const offeredTotal = state.offered.size;
  const difference = neededTotal - offeredTotal;
  const parts = [
    "Hola, quiero hacer un canje de figuritas.",
    "",
    "Figuritas que necesito:",
    formatSelection(state.needed),
    `Total que necesito: ${neededTotal}`,
    "",
    "Figuritas que te doy:",
    offeredTotal > 0 ? formatSelection(state.offered) : "Ninguna seleccionada",
    `Total que te doy: ${offeredTotal}`,
  ];

  if (difference > 0) {
    parts.push(
      "",
      EXCHANGE_RULE,
      `Diferencia: ${difference} figurita${difference === 1 ? "" : "s"}.`,
      `Sobres sugeridos: ${Math.ceil(difference / 7)}.`,
    );
  }

  return parts.join("\n");
}

function startExchange() {
  if (state.needed.size === 0) {
    showFormMessage("Seleccioná al menos una figurita que necesitás.", "error");
    elements.formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (state.offered.size === 0) {
    showFormMessage("No seleccionaste figuritas para dar a cambio.", "warning");
  } else {
    hideFormMessage();
  }

  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

async function loadData() {
  try {
    const response = await fetch("data/figuritas.json");
    if (!response.ok) {
      throw new Error(`No se pudo cargar el JSON (${response.status}).`);
    }

    const data = await response.json();
    if (!data.repetidas || !data.faltantes) {
      throw new Error("El JSON no contiene las claves repetidas y faltantes.");
    }

    renderSection("needed", normalizeDataset(data.repetidas));
    renderSection("offered", normalizeDataset(data.faltantes));
    elements.loadStatus.hidden = true;
    elements.exchangeContent.hidden = false;
    elements.summary.hidden = false;
    updateSummary();
  } catch (error) {
    elements.loadStatus.className = "status status-error";
    elements.loadStatus.textContent =
      "No se pudieron cargar las figuritas. Abrí el sitio desde un servidor local o GitHub Pages.";
    console.error(error);
  }
}

elements.needed.search.addEventListener("input", () => filterSection("needed"));
elements.offered.search.addEventListener("input", () => filterSection("offered"));
elements.needed.clear.addEventListener("click", () => clearSelection("needed"));
elements.offered.clear.addEventListener("click", () => clearSelection("offered"));
elements.exchangeButton.addEventListener("click", startExchange);

loadData();
