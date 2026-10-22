
const reportForm = document.getElementById("reportForm");
const results = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const filterButtons = document.querySelectorAll(".filter-button");
const message = document.getElementById("message");

let items = [];
let currentFilter = "الكل";

const icons = {
  "مفقود": "🔎",
  "معثور عليه": "🎁"
};

function renderItems() {
  const searchText = searchInput.value.trim().toLowerCase();

  const filteredItems = items.filter(item => {
    const matchesFilter =
      currentFilter === "الكل" || item.type === currentFilter;

    const searchableText =
      `${item.name} ${item.location} ${item.description}`.toLowerCase();

    return matchesFilter && searchableText.includes(searchText);
  });

  if (filteredItems.length === 0) {
    results.innerHTML = `
      <div class="empty-state">
        <span>🔎</span>
        <h3>ما لقينا أغراض تطابق بحثك</h3>
        <p>جربي كلمة ثانية أو أضيفي بلاغًا جديدًا.</p>
      </div>
    `;
    return;
  }

  results.innerHTML = filteredItems.map(item => `
    <article class="item-card">
      <div class="item-icon">${icons[item.type]}</div>
      <span class="item-status ${item.type === "معثور عليه" ? "found" : ""}">
        ${item.type}
      </span>
      <h3>${escapeHTML(item.name)}</h3>
      <p><strong>المكان:</strong> ${escapeHTML(item.location)}</p>
      <p><strong>التفاصيل:</strong> ${escapeHTML(item.description)}</p>
      <p><small>تاريخ البلاغ: ${item.date}</small></p>
    </article>
  `).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

reportForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("itemName").value.trim();
  const type = document.getElementById("reportType").value;
  const location = document.getElementById("itemLocation").value.trim();
  const description = document.getElementById("itemDescription").value.trim();

  if (!name || !location || !description) {
    message.textContent = "فضلاً، عبئي جميع الحقول.";
    return;
  }

  items.unshift({
    name,
    type,
    location,
    description,
    date: new Date().toLocaleDateString("ar-SA")
  });

  currentFilter = "الكل";
  filterButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.filter === "الكل");
  });

  searchInput.value = "";
  renderItems();
  reportForm.reset();

  message.textContent = "تمت إضافة البلاغ إلى قائمة الأغراض بنجاح.";
  document.getElementById("items").scrollIntoView({ behavior: "smooth" });
});

filterButtons.forEach(button => {
  button.addEventListener("click", function() {
    currentFilter = this.dataset.filter;

    filterButtons.forEach(filterButton => {
      filterButton.classList.toggle("active", filterButton === this);
    });

    renderItems();
  });
});

searchInput.addEventListener("input", renderItems);
searchButton.addEventListener("click", renderItems);

renderItems();


