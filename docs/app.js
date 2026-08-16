import { collect, buildPayload } from "./fp-collect.js";

const STATUS = {
  0: { text: "collected", kind: "ok" },
  "-1": { text: "not available", kind: "miss" },
  "-2": { text: "unsupported", kind: "miss" },
  "-3": { text: "unexpected shape", kind: "fail" },
  "-4": { text: "deadline", kind: "wait" },
  "-101": { text: "threw", kind: "fail" },
};

const state = {
  labels: null,
  signals: [],
  payload: {},
  elapsed: 0,
  query: "",
  showWire: false,
  onlyReported: false,
};

const el = (id) => document.getElementById(id);

function statusMeta(code) {
  if (code === undefined || code === null) return { text: "no value", kind: "fail" };
  return STATUS[String(code)] ?? { text: `code ${code}`, kind: "fail" };
}

function typeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function preview(value, depth = 0) {
  const kind = typeOf(value);
  if (kind === "string") return depth === 0 ? value : JSON.stringify(value);
  if (kind === "number" || kind === "boolean" || kind === "null" || kind === "undefined") {
    return String(value);
  }
  if (kind === "array") {
    if (value.length === 0) return "[]";
    if (value.every((item) => typeOf(item) !== "object" && typeOf(item) !== "array")) {
      const flat = value.slice(0, 6).map((item) => preview(item, depth + 1)).join(", ");
      return `[${flat}${value.length > 6 ? `, +${value.length - 6}` : ""}]`;
    }
    return `${value.length} items`;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return "{}";
  return `{ ${keys.slice(0, 4).join(", ")}${keys.length > 4 ? `, +${keys.length - 4}` : ""} }`;
}

function searchText(value) {
  try {
    return JSON.stringify(value) ?? "";
  } catch {
    return String(value);
  }
}

function node(key, value, depth) {
  const wrap = document.createElement("div");
  wrap.className = "node";

  const row = document.createElement("div");
  row.className = "row";

  const toggle = document.createElement("span");
  toggle.className = "toggle";
  row.append(toggle);

  if (key !== null) {
    const keySpan = document.createElement("span");
    keySpan.className = "key";
    keySpan.textContent = key;
    row.append(keySpan);
    const colon = document.createElement("span");
    colon.className = "colon";
    colon.textContent = ":";
    row.append(colon);
  }

  const kind = typeOf(value);
  const branch = kind === "object" || kind === "array";

  if (!branch) {
    toggle.classList.add("leaf");
    toggle.textContent = "-";
    const leaf = document.createElement("span");
    leaf.className = kind === "string" ? "str" : kind === "number" ? "num" : kind === "boolean" ? "bool" : "null";
    const text = kind === "string" ? JSON.stringify(value) : String(value);
    leaf.textContent = text.length > 600 ? `${text.slice(0, 600)}…` : text;
    if (text.length > 600) {
      leaf.title = text;
    }
    row.append(leaf);
    wrap.append(row);
    return wrap;
  }

  const entries = kind === "array" ? value.map((item, i) => [String(i), item]) : Object.entries(value);
  const summary = document.createElement("span");
  summary.className = "summaryline";
  summary.textContent = kind === "array" ? `[${entries.length}]` : `{${entries.length}}`;
  row.append(summary);
  wrap.append(row);

  const children = document.createElement("div");
  children.className = "children";
  for (const [childKey, childValue] of entries) {
    children.append(node(childKey, childValue, depth + 1));
  }
  wrap.append(children);

  const collapsed = depth >= 1 && entries.length > 8;
  if (collapsed) wrap.classList.add("collapsed");
  toggle.textContent = collapsed ? "+" : "−";
  toggle.addEventListener("click", () => {
    wrap.classList.toggle("collapsed");
    toggle.textContent = wrap.classList.contains("collapsed") ? "+" : "−";
  });

  return wrap;
}

function tree(value) {
  const box = document.createElement("div");
  box.className = "tree";
  box.append(node(null, value, 0));
  return box;
}

function matches(signal, query) {
  if (!query) return true;
  const needle = query.toLowerCase();
  return (
    signal.label.toLowerCase().includes(needle) ||
    signal.note.toLowerCase().includes(needle) ||
    signal.id.toLowerCase() === needle ||
    signal.wireName.toLowerCase().includes(needle) ||
    signal.group.toLowerCase().includes(needle) ||
    signal.text.toLowerCase().includes(needle)
  );
}

function renderSignal(signal) {
  const details = document.createElement("details");
  details.className = "signal";

  const summary = document.createElement("summary");

  const name = document.createElement("div");
  name.className = "name";
  const label = document.createElement("b");
  label.textContent = signal.label;
  name.append(label);
  if (state.showWire) {
    const wire = document.createElement("span");
    wire.className = "wire";
    wire.textContent = `${signal.id} · ${signal.wireName}`;
    name.append(wire);
  }
  summary.append(name);

  const value = document.createElement("div");
  value.className = "preview";
  value.textContent = signal.error ?? preview(signal.value);
  summary.append(value);

  const meta = statusMeta(signal.status);
  const pill = document.createElement("span");
  pill.className = `pill ${meta.kind}`;
  pill.textContent = meta.text;
  summary.append(pill);

  const ms = document.createElement("div");
  ms.className = "ms";
  ms.textContent = signal.duration === undefined ? "" : `${Math.round(signal.duration)} ms`;
  summary.append(ms);

  details.append(summary);

  const detail = document.createElement("div");
  detail.className = "detail";

  if (signal.note) {
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = signal.note;
    detail.append(note);
  }

  const facts = document.createElement("div");
  facts.className = "surfaces";
  facts.textContent = `wire id ${signal.id} · agent name ${signal.wireName} · status ${signal.status}`;
  detail.append(facts);

  detail.append(tree(signal.error ? { error: signal.error } : signal.value));
  details.append(detail);
  return details;
}

function render() {
  const host = el("groups");
  host.textContent = "";

  const visible = state.signals.filter(
    (signal) => matches(signal, state.query) && (!state.onlyReported || signal.status === 0),
  );

  el("stat-signals").textContent = String(state.signals.length);
  el("stat-reported").textContent = String(state.signals.filter((s) => s.status === 0).length);
  el("stat-keys").textContent = String(Object.keys(state.payload).length);
  el("stat-ms").textContent = `${state.elapsed}`;

  if (visible.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No signal matches that filter.";
    host.append(empty);
    return;
  }

  for (const group of state.labels.groups) {
    const rows = visible.filter((signal) => signal.group === group.id);
    if (rows.length === 0) continue;

    const section = document.createElement("section");
    section.className = "group";

    const heading = document.createElement("h3");
    heading.textContent = group.label;
    const count = document.createElement("span");
    count.className = "count";
    count.textContent = `${rows.length}`;
    heading.append(count);
    section.append(heading);

    const list = document.createElement("div");
    list.className = "signals";
    for (const signal of rows) list.append(renderSignal(signal));
    section.append(list);
    host.append(section);
  }
}

function toSignals(named, payload) {
  const known = state.labels.signals;
  const collected = new Set(Object.values(named).map((entry) => entry.id));
  const fromRequest = Object.entries(payload)
    .filter(([key]) => /^s\d+$/.test(key) && !collected.has(key))
    .map(([id, value]) => [known[id]?.label ?? id, { id, value }]);

  return [...Object.entries(named), ...fromRequest]
    .map(([wireName, entry]) => {
      const meta = known[entry.id] ?? {};
      const value = entry.value?.v;
      return {
        id: entry.id,
        wireName,
        label: meta.label ?? wireName,
        group: meta.group ?? "page",
        note: meta.note ?? "",
        status: entry.error ? -101 : entry.value?.s,
        duration: entry.duration,
        error: entry.error,
        value,
        text: searchText(value),
      };
    })
    .sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
}

async function run() {
  const button = el("rerun");
  button.disabled = true;
  button.textContent = "Analyzing…";
  el("groups").textContent = "";

  const started = performance.now();
  const result = await collect();
  const payload = await buildPayload({ apiKey: "none" });
  state.elapsed = Math.round(performance.now() - started);
  state.payload = payload;
  state.signals = toSignals(result.named, payload);
  window.fp = { ...result, payload, signals: state.signals };

  button.disabled = false;
  button.textContent = "Analyze my browser again";
  render();
}

function download() {
  const dump = state.signals.map((signal) => ({
    id: signal.id,
    name: signal.label,
    agentName: signal.wireName,
    group: signal.group,
    status: signal.status,
    ms: signal.duration,
    value: signal.value,
  }));
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "fingerprint-signals.json";
  link.click();
  URL.revokeObjectURL(url);
}

state.labels = await fetch("./labels.json").then((response) => {
  if (!response.ok) throw new Error("Failed to load labels");
  return response.json();
});

el("search").addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  render();
});

el("wire").addEventListener("click", (event) => {
  state.showWire = !state.showWire;
  event.currentTarget.setAttribute("aria-pressed", String(state.showWire));
  render();
});

el("reported").addEventListener("click", (event) => {
  state.onlyReported = !state.onlyReported;
  event.currentTarget.setAttribute("aria-pressed", String(state.onlyReported));
  render();
});

el("download").addEventListener("click", download);
el("rerun").addEventListener("click", run);

await run();
