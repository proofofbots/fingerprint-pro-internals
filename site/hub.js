(() => {
  const navFilter = document.getElementById("navfilter");
  if (navFilter) {
    navFilter.addEventListener("input", () => {
      const needle = navFilter.value.trim().toLowerCase();
      for (const link of document.querySelectorAll(".sidebar a[data-nav]")) {
        const hit = !needle || link.dataset.nav.toLowerCase().includes(needle);
        link.classList.toggle("hidden", !hit);
      }
      for (const section of document.querySelectorAll(".sidebar .section")) {
        const visible = section.querySelectorAll("a:not(.hidden)").length;
        section.style.display = visible ? "" : "none";
      }
    });
  }

  for (const wrap of document.querySelectorAll("[data-filterable]")) {
    const input = wrap.querySelector("input");
    const count = wrap.querySelector(".rowcount");
    const rows = [...wrap.querySelectorAll("tbody tr")];
    const haystack = rows.map((row) => row.textContent.toLowerCase());

    input.addEventListener("input", () => {
      const needle = input.value.trim().toLowerCase();
      let shown = 0;
      rows.forEach((row, index) => {
        const hit = !needle || haystack[index].includes(needle);
        row.style.display = hit ? "" : "none";
        if (hit) shown += 1;
      });
      count.textContent = `${shown} of ${rows.length} rows`;
    });
  }

  const current = location.hash;
  if (current) {
    const target = document.querySelector(current);
    if (target) target.scrollIntoView();
  }
})();
