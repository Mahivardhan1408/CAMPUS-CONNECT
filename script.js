
document.addEventListener("DOMContentLoaded", function () {
    // NAVIGATION
    const pages = document.querySelectorAll(".page");
    const navButtons = document.querySelectorAll(".nav-btn");

    function showSection(sectionId) {
        const target = document.getElementById(sectionId);

        if (!target || !target.classList.contains("page")) {
            return;
        }

        pages.forEach(function (page) {
            const isSelected = page.id === sectionId;
            page.hidden = !isSelected;
            page.classList.toggle("active", isSelected);
        });

        navButtons.forEach(function (button) {
            button.classList.toggle(
                "active",
                button.dataset.section === sectionId
            );
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    navButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            showSection(button.dataset.section);
        });
    });

    document.querySelectorAll("[data-go]").forEach(function (button) {
        button.addEventListener("click", function () {
            showSection(button.dataset.go);
        });
    });

    // ANNOUNCEMENT SEARCH
    const noticeSearch = document.getElementById("notice-search");
    const noticeItems = document.querySelectorAll(".notice-item");
    const noticeEmpty = document.getElementById("notice-empty");

    function filterNotices() {
        const query = noticeSearch.value.trim().toLowerCase();
        let count = 0;

        noticeItems.forEach(function (item) {
            const text = (
                item.textContent + " " + (item.dataset.search || "")
            ).toLowerCase();

            const matches = text.includes(query);
            item.hidden = !matches;

            if (matches) count++;
        });

        noticeEmpty.hidden = count > 0;
    }

    noticeSearch.addEventListener("input", filterNotices);

    // MARKETPLACE CATEGORY AND SEARCH
    const categoryButtons = document.querySelectorAll(".category-btn");
    const marketItems = document.querySelectorAll(".market-item");
    const marketSearch = document.getElementById("market-search");
    const marketEmpty = document.getElementById("market-empty");

    let selectedCategory = "all";

    function filterMarketplace() {
        const query = marketSearch.value.trim().toLowerCase();
        let count = 0;

        marketItems.forEach(function (item) {
            const category = item.dataset.category;
            const text = item.textContent.toLowerCase();

            const categoryMatches =
                selectedCategory === "all" ||
                category === selectedCategory;

            const searchMatches = text.includes(query);
            const visible = categoryMatches && searchMatches;

            item.hidden = !visible;

            if (visible) count++;
        });

        marketEmpty.hidden = count > 0;
    }

    categoryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectedCategory = button.dataset.categoryFilter;

            categoryButtons.forEach(function (otherButton) {
                otherButton.classList.toggle(
                    "active",
                    otherButton === button
                );
            });

            filterMarketplace();
        });
    });

    marketSearch.addEventListener("input", filterMarketplace);

    // LOST AND FOUND
    const lostForm = document.getElementById("lost-form");
    const lostName = document.getElementById("lost-name");
    const lostType = document.getElementById("lost-type");
    const lostLocation = document.getElementById("lost-location");
    const lostList = document.getElementById("lost-list");
    const lostEmpty = document.getElementById("lost-empty");

    const storageKey = "campusconnect-lost-found";

    function createReport(report) {
        const article = document.createElement("article");
        article.className = "content-card";

        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = report.type;

        const heading = document.createElement("h3");
        heading.textContent = report.name;

        const location = document.createElement("p");
        location.textContent = "Location: " + report.location;

        article.append(tag, heading, location);
        return article;
    }

    function loadReports() {
        let reports = [];

        try {
            const saved = localStorage.getItem(storageKey);
            const parsed = saved ? JSON.parse(saved) : [];
            reports = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            reports = [];
        }

        lostList.replaceChildren();

        reports.forEach(function (report) {
            if (
                report &&
                typeof report.name === "string" &&
                typeof report.type === "string" &&
                typeof report.location === "string"
            ) {
                lostList.appendChild(createReport(report));
            }
        });

        lostEmpty.hidden = lostList.children.length > 0;
    }

    lostForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const report = {
            name: lostName.value.trim(),
            type: lostType.value,
            location: lostLocation.value.trim()
        };

        if (!report.name || !report.type || !report.location) {
            alert("Please complete all fields.");
            return;
        }

        let reports = [];

        try {
            const saved = localStorage.getItem(storageKey);
            const parsed = saved ? JSON.parse(saved) : [];
            reports = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            reports = [];
        }

        reports.unshift(report);

        try {
            localStorage.setItem(storageKey, JSON.stringify(reports));
        } catch (error) {
            alert("Could not save the report in this browser.");
            return;
        }

        loadReports();
        lostForm.reset();
    });

    // INITIAL SETUP
    filterNotices();
    filterMarketplace();
    loadReports();
});
