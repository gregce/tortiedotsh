const root = document.querySelector<HTMLElement>("[data-comparison-root]");

if (root) {
  const table = root.querySelector<HTMLTableElement>("[data-comparison-table]");
  const scroller = root.querySelector<HTMLElement>("[data-matrix-scroll]");
  const search = root.querySelector<HTMLInputElement>("[data-filter-search]");
  const show = root.querySelector<HTMLSelectElement>("[data-filter-show]");
  const os = root.querySelector<HTMLSelectElement>("[data-filter-os]");
  const sort = root.querySelector<HTMLSelectElement>("[data-sort-products]");
  const resetButtons = root.querySelectorAll<HTMLButtonElement>("[data-reset-view]");
  const summary = root.querySelector<HTMLElement>("[data-result-summary]");
  const empty = root.querySelector<HTMLElement>("[data-matrix-empty]");
  const hint = root.querySelector<HTMLElement>("[data-scroll-hint]");
  const picker = root.querySelector<HTMLDetailsElement>("[data-product-picker]");
  const pickerCopy = root.querySelector<HTMLElement>("[data-picker-copy]");
  const pickerApply = root.querySelector<HTMLButtonElement>("[data-picker-apply]");
  const pickerClear = root.querySelector<HTMLButtonElement>("[data-picker-clear]");
  const pickerSummary = root.querySelector<HTMLElement>("[data-picker-summary]");
  const rail = root.querySelector<HTMLElement>(".matrix-rail");
  const railToggle = root.querySelector<HTMLButtonElement>("[data-filter-toggle]");
  const railToggleLabel = root.querySelector<HTMLElement>("[data-filter-toggle-label]");
  const productChecks = Array.from(
    root.querySelectorAll<HTMLInputElement>("[data-product-check]"),
  );

  let appliedProducts: string[] = [];
  let debounceId = 0;
  const defaultOrder = Array.from(
    root.querySelectorAll<HTMLElement>("thead [data-product-id]"),
  ).map((element) => element.dataset.productId || "");

  function productHeaders() {
    return Array.from(
      root!.querySelectorAll<HTMLElement>("thead [data-product-id]"),
    );
  }

  function reorderProducts() {
    if (!table || !sort) return;
    const headers = productHeaders();
    const order = headers
      .slice()
      .sort((left, right) => {
        if (sort.value === "name") {
          return (left.dataset.productName || "").localeCompare(
            right.dataset.productName || "",
          );
        }
        if (sort.value === "stars") {
          const leftStars = Number(left.dataset.stars || -1);
          const rightStars = Number(right.dataset.stars || -1);
          if (leftStars !== rightStars) return rightStars - leftStars;
        }
        if (sort.value === "updated") {
          return (right.dataset.updated || "").localeCompare(
            left.dataset.updated || "",
          );
        }
        return (
          defaultOrder.indexOf(left.dataset.productId || "") -
          defaultOrder.indexOf(right.dataset.productId || "")
        );
      })
      .map((element) => element.dataset.productId || "");

    for (const row of Array.from(table.rows)) {
      const cells = new Map(
        Array.from(row.querySelectorAll<HTMLElement>("[data-product-id]")).map(
          (cell) => [cell.dataset.productId || "", cell],
        ),
      );
      for (const id of order) {
        const cell = cells.get(id);
        if (cell) row.append(cell);
      }
    }
  }

  function syncPickerState() {
    const checked = productChecks.filter((input) => input.checked);
    const count = checked.length;
    if (pickerApply) pickerApply.disabled = count === 1 || count > 4;
    if (pickerCopy) {
      pickerCopy.textContent =
        count === 0
          ? "All products are shown. Choose 2 to 4 for a focused comparison."
          : count === 1
            ? "Choose one more product to compare."
            : count > 4
              ? "Choose no more than 4 products."
              : `${count} products ready to compare.`;
    }
  }

  function selectedProductsFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const requested = (params.get("products") || "")
      .split(",")
      .filter(Boolean);
    const known = new Set(productChecks.map((input) => input.value));
    const valid = requested.filter((id) => known.has(id)).slice(0, 4);
    return valid.length >= 2 ? valid : [];
  }

  function updateQuery() {
    const params = new URLSearchParams();
    if (search?.value.trim()) params.set("q", search.value.trim());
    if (show?.value && show.value !== "all") params.set("show", show.value);
    if (os?.value && os.value !== "all") params.set("os", os.value);
    if (sort?.value && sort.value !== "editorial") params.set("sort", sort.value);
    if (appliedProducts.length >= 2) {
      params.set("products", appliedProducts.join(","));
    }
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }

  function applyFilters() {
    if (!table) return;
    const query = search?.value.trim().toLowerCase() || "";
    const mode = show?.value || "all";
    const osValue = os?.value || "all";
    const headers = productHeaders();
    const productNameMatches = query
      ? headers.filter((header) =>
          (header.dataset.productSearch || header.dataset.productName || "").includes(query),
        )
      : [];
    const compareSet = new Set(appliedProducts);
    const visibleProducts = new Set<string>();

    for (const header of headers) {
      const id = header.dataset.productId || "";
      const matchesCompare = compareSet.size === 0 || compareSet.has(id);
      const matchesOs =
        osValue === "all" ||
        (header.dataset.platforms || "").split("|").includes(osValue);
      const matchesName = productNameMatches.length === 0 || productNameMatches.includes(header);
      if (matchesCompare && matchesOs && matchesName) visibleProducts.add(id);
    }

    for (const cell of Array.from(
      table.querySelectorAll<HTMLElement>("[data-product-id]"),
    )) {
      cell.classList.toggle(
        "is-filtered",
        !visibleProducts.has(cell.dataset.productId || ""),
      );
    }

    const dataRows = Array.from(
      table.querySelectorAll<HTMLTableRowElement>("tr[data-row-id]"),
    );
    let visibleRows = 0;
    for (const row of dataRows) {
      const labelMatches =
        !query ||
        productNameMatches.length > 0 ||
        (row.dataset.search || "").includes(query);
      const visibleCells = Array.from(
        row.querySelectorAll<HTMLElement>("[data-product-id]"),
      ).filter((cell) => visibleProducts.has(cell.dataset.productId || ""));
      const normalized = new Set(
        visibleCells.map((cell) => cell.dataset.normalized || "unknown"),
      );
      const differs = visibleCells.length > 1 && normalized.size > 1;
      const hasUnknown = visibleCells.some(
        (cell) => cell.dataset.state === "unknown",
      );
      const modeMatches =
        mode === "all" ||
        (mode === "differences" && differs) ||
        (mode === "unknowns" && hasUnknown);
      const visible = labelMatches && modeMatches && visibleCells.length > 0;
      row.classList.toggle("is-filtered", !visible);
      if (visible) visibleRows += 1;
    }

    for (const group of Array.from(
      table.querySelectorAll<HTMLTableRowElement>("tr[data-group-row]"),
    )) {
      const groupName = group.dataset.groupRow;
      const groupHasRows = dataRows.some(
        (row) =>
          row.dataset.group === groupName && !row.classList.contains("is-filtered"),
      );
      group.classList.toggle("is-filtered", !groupHasRows);
    }

    const productCount = visibleProducts.size;
    if (summary) {
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => {
        summary.textContent = `${visibleRows} ${visibleRows === 1 ? "criterion" : "criteria"} · ${productCount} ${productCount === 1 ? "product" : "products"}`;
      }, 250);
    }
    empty?.classList.toggle("is-visible", visibleRows === 0 || productCount === 0);
    table.classList.toggle("is-filtered", visibleRows === 0 || productCount === 0);
    if (pickerSummary) {
      pickerSummary.textContent =
        appliedProducts.length >= 2
          ? `${appliedProducts.length} products`
          : "Focus products";
    }
    updateQuery();
  }

  function resetView() {
    if (search) search.value = "";
    if (show) show.value = "all";
    if (os) os.value = "all";
    if (sort) sort.value = "editorial";
    appliedProducts = [];
    for (const input of productChecks) input.checked = false;
    syncPickerState();
    reorderProducts();
    applyFilters();
  }

  const params = new URLSearchParams(window.location.search);
  if (search) search.value = params.get("q") || "";
  if (show && ["all", "differences", "unknowns"].includes(params.get("show") || "")) {
    show.value = params.get("show") || "all";
  }
  if (os && ["all", "macos", "windows", "linux", "web"].includes(params.get("os") || "")) {
    os.value = params.get("os") || "all";
  }
  if (sort && ["editorial", "name", "stars", "updated"].includes(params.get("sort") || "")) {
    sort.value = params.get("sort") || "editorial";
  }
  appliedProducts = selectedProductsFromQuery();
  for (const input of productChecks) input.checked = appliedProducts.includes(input.value);

  search?.addEventListener("input", applyFilters);
  show?.addEventListener("change", applyFilters);
  os?.addEventListener("change", applyFilters);
  sort?.addEventListener("change", () => {
    reorderProducts();
    applyFilters();
  });
  for (const button of resetButtons) button.addEventListener("click", resetView);
  for (const input of productChecks) input.addEventListener("change", syncPickerState);
  pickerApply?.addEventListener("click", () => {
    const checked = productChecks.filter((input) => input.checked).map((input) => input.value);
    if (checked.length === 0 || (checked.length >= 2 && checked.length <= 4)) {
      appliedProducts = checked;
      if (picker) picker.open = false;
      applyFilters();
    }
  });
  pickerClear?.addEventListener("click", () => {
    for (const input of productChecks) input.checked = false;
    appliedProducts = [];
    syncPickerState();
    if (picker) picker.open = false;
    applyFilters();
  });

  function setRailOpen(isOpen: boolean, returnFocus = false) {
    rail?.classList.toggle("is-open", isOpen);
    railToggle?.setAttribute("aria-expanded", String(isOpen));
    if (railToggleLabel) railToggleLabel.textContent = isOpen ? "Hide controls" : "View controls";
    if (returnFocus) railToggle?.focus();
  }

  railToggle?.addEventListener("click", () => {
    setRailOpen(!(rail?.classList.contains("is-open") ?? false));
  });

  document.addEventListener("pointerdown", (event) => {
    if (rail?.classList.contains("is-open") && !rail.contains(event.target as Node)) {
      setRailOpen(false);
    }
  });

  rail?.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && rail.classList.contains("is-open")) {
      event.preventDefault();
      setRailOpen(false, true);
    }
  });

  table?.addEventListener("focusin", (event) => {
    const target = event.target as HTMLElement;
    const product = target.closest<HTMLElement>("[data-product-id]");
    const id = product?.dataset.productId;
    for (const cell of Array.from(
      table.querySelectorAll<HTMLElement>("[data-product-id]"),
    )) {
      cell.classList.toggle("is-column-focus", Boolean(id) && cell.dataset.productId === id);
    }
  });
  table?.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!table.contains(document.activeElement)) {
        table.querySelectorAll(".is-column-focus").forEach((cell) =>
          cell.classList.remove("is-column-focus"),
        );
      }
    });
  });

  scroller?.addEventListener(
    "scroll",
    () => {
      if (hint && scroller.scrollLeft > 8) hint.hidden = true;
    },
    { passive: true },
  );

  document.querySelectorAll<HTMLElement>(".category-nav a").forEach((link) => {
    link.addEventListener("focus", () =>
      link.scrollIntoView({ inline: "nearest", block: "nearest" }),
    );
  });

  syncPickerState();
  reorderProducts();
  applyFilters();
}
