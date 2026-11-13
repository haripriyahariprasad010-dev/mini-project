let navLinks =document.querySelectorAll(".nav-link");
navLinks.forEach(
    function (link) {
        link.addEventListener("click", function (event) {
                if (link.classList.contains("logout") || link.getAttribute("href") !== "#"
                ) {
                    return;
                }
                event.preventDefault();
                navLinks.forEach(function (item) {
                        item.classList.remove("active");
                    }
                );
                link.classList.add(
                    "active"
                );
                let section =link.getAttribute("data-section");
                showSection(section);
            }
        );
    }
);
let logoutLink = document.querySelector(".logout");
if (logoutLink) {
    logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        let confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "../login/login.html";
        }
    });
}
function showSection(section) {
    let content =document.getElementById("dashboardContent");
    if (section === "dashboard") {
        content.innerHTML = `
            <div class="dashboard-title">
                <p class="small-title">📋 LIBRARY OVERVIEW</p>
                <h2> Welcome to the Dashboard</h2>
                <p> Manage your digital library from one place.</p>
            </div>
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="dashboard-emoji">  📚 </div>
                    <h3> Total Books</h3>
                    <p id="totalBooks"> 0</p>
                </div>
                <div class="summary-card">
                    <div class="dashboard-emoji">  👥 </div>
                    <h3> Total Members</h3>
                    <p id="totalMembers"> 0</p>
                </div>
                <div class="summary-card">
                    <div class="dashboard-emoji"> 📖</div>
                    <h3> Issued Books </h3>
                    <p id="issuedBooks"> 0 </p>
                </div>
                <div class="summary-card">
                    <div class="dashboard-emoji"> ✅ </div>
                    <h3> Returned Books </h3>
                    <p id="returnedBooks"></p>
                </div>
            </div>
            <section class="recommended-section">
    <div class="section-heading">
        <div>
            <p class="small-title">A LITTLE INSPIRATION</p>
            <h3>Recommended Books</h3>
            <p class="section-description">
                A selection of books worth exploring
            </p>
        </div>
        <span class="recommend-label">Editor's Picks</span>
    </div>

    <div id="recommendedBooks" class="recommended-books">
        <p>No recommendations available yet.</p>
    </div>
</section>
            <div class="dashboard-bottom">
                <div class="most-issued">
                    <h3> 📚 Most Issued Books</h3>
                    <p class="section-description"> Popular books among library members
                    </p>
                    <div id="mostIssuedBooks"><p>No issued books yet.</p>
                    </div>
                </div>
                <div class="most-issued">
                    <h3>🆕 Recently Added Books</h3>
                    <p class="section-description"> Latest books added to the library</p>
                    <div id="recentBooks"></div>
                </div>
            </div>
        `;
        updateDashboard();
    }
    else if (section === "issue") {
        content.innerHTML = `
            <div class="module-content">
                <p class="small-title">
                    📖 BOOK TRANSACTION
                </p>
                <h2>
                    Issue Book
                </h2>
                <p>
                    This section will be used to issue
                    books to library members.
                </p>
            </div>
        `;
    }
    else if (section === "return") {
        content.innerHTML = `
            <div class="module-content">
                <p class="small-title">
                    ↩️ BOOK TRANSACTION
                </p>
                <h2>
                    Return Book
                </h2>
                <p>
                    This section will be used to manage
                    returned books.
                </p>
            </div>
        `;
    }
    else if (section === "reports") {
        content.innerHTML = `
            <div class="module-content">
                <p class="small-title">
                    📊 REPORT MODULE
                </p>
                <h2>
                    Reports
                </h2>
                <p>
                    This section will display library
                    reports such as issued books and
                    returned books.
                </p>
            </div>
        `;
    }
else if (section === "about") {
    content.innerHTML = `
        <div class="about-page">
            <h2 class="about-title">About Our Library</h2>
            <div class="about-intro">
                <img src="../assets/about-library.png" alt="Books in our digital library" class="about-image">

                <div class="about-intro-text">
                    <h3>A love for books, a smarter way to manage them</h3>

                    <p>
                        The Digital Library Management System is designed
                        to make library activities simpler and more
                        organized. From maintaining book records to
                        managing members and tracking issue and return
                        activities, everything is brought together in
                        one convenient place.
                    </p>
                </div>
            </div>
            <section class="about-mission">
                <h3>Our Mission</h3>
                <p>
                    Our mission is to simplify library management through
                    technology. We aim to provide an easy-to-use platform
                    that helps organize information, reduce manual work,
                    and make everyday library operations more efficient.
                </p>
            </section>
            <section class="about-offer">
                <h3>What We Offer</h3>
                <div class="about-offer-list">
                    <p>Book Management</p>
                    <p>Member Management</p>
                    <p>Book Issue & Return</p>
                    <p>Library Reports</p>
                </div>
            </section>
            <section class="about-technologies">
                <h3>Built With</h3>
                <div class="about-tech-list">
                    <span>HTML5</span>
                    <span>CSS3</span>
                    <span>JavaScript</span>
                    <span>Local Storage</span>
                    <span>Session Storage</span>
                </div>
            </section>
        </div>
    `;
}
}
function updateDashboard() {
    let currentUser = sessionStorage.getItem("loggedInUser");
    let booksKey = "LIB_libraryBooks_" + currentUser;
    let membersKey = "LIB_libraryMembers_" + currentUser;
    let issuesKey = "LIB_libraryIssues_" + currentUser;
    let books = JSON.parse(localStorage.getItem(booksKey) || "[]");
    let members = JSON.parse(localStorage.getItem(membersKey) || "[]");
    let issues = JSON.parse(localStorage.getItem(issuesKey) || "[]");
    // Total Books
    let totalBooks = document.getElementById("totalBooks");
    if (totalBooks) {
        totalBooks.textContent = books.length;
    }
    // Total Members
    let totalMembers = document.getElementById("totalMembers");
    if (totalMembers) {
        totalMembers.textContent = members.length;
    }
    // Issued and Returned Books
    let issuedBooks = document.getElementById("issuedBooks");
    let returnedBooks = document.getElementById("returnedBooks");
    let issuedCount = issues.filter(
        issue => issue.status === "Issued"
    ).length;
    let returnedCount = issues.filter(
        issue => issue.status === "Returned"
    ).length;
    if (issuedBooks) {
        issuedBooks.textContent = issuedCount;
    }
    if (returnedBooks) {
        returnedBooks.textContent = returnedCount;
    }
    // Count how many times each book was issued
   let issueCounts = {};
issues.forEach(function(issue) {
    let bookId = String(issue.bookId).trim();
    if (bookId) {
        issueCounts[bookId] =
            (issueCounts[bookId] || 0) + 1;
    }
});
    // Match issue records with actual books
   let mostIssued = Object.entries(issueCounts)
    .map(function(entry) {
        let book = books.find(
            item => String(item.bookId) === String(entry[0])
        );
        return book ? {
            book: book,
            count: entry[1]
        } : null;
    })
    .filter(item => item !== null)
    .sort((a, b) => b.count - a.count);

    // MOST ISSUED BOOKS SECTION
    let mostIssuedBooks =
        document.getElementById("mostIssuedBooks");

    if (mostIssuedBooks) {
        mostIssuedBooks.innerHTML = "";

        if (mostIssued.length === 0) {
            mostIssuedBooks.innerHTML =
                "<p>No issued books yet.</p>";
        } else {
            mostIssued.slice(0, 4).forEach(function(item, index) {
                mostIssuedBooks.innerHTML += `
                    <div class="book-item">
                        <div class="book-number">${index + 1}</div>

                        <div class="book-info">
                            <h4>${item.book.bookName}</h4>
                            <p>${item.book.author || "Author not provided"}</p>
                        </div>

                        <span class="issued-count">
                            ${item.count} times
                        </span>
                    </div>
                `;
            });
        }
    }

    // RECENTLY ADDED BOOKS
    let recentBooks = document.getElementById("recentBooks");

    if (recentBooks) {
        recentBooks.innerHTML = "";

        let latestBooks = books.slice(-4).reverse();

        if (latestBooks.length === 0) {
            recentBooks.innerHTML = "<p>No books added yet.</p>";
        } else {
            latestBooks.forEach(function(book, index) {
                recentBooks.innerHTML += `
                    <div class="book-item">
                        <div class="book-number">${index + 1}</div>

                        <div class="book-info">
                            <h4>${book.bookName}</h4>
                            <p>${book.author || "Author not provided"}</p>
                        </div>
                    </div>
                `;
            });
        }
    }

    // RECOMMENDED BOOKS
    let recommendedBooks =
        document.getElementById("recommendedBooks");

    if (recommendedBooks) {

        // Priority 1: Admin-selected books
        let recommendations = books.filter(
            book => book.recommendOnDashboard === true
        );

        // Priority 2: Most issued books
        if (recommendations.length === 0 && mostIssued.length > 0) {
            recommendations = mostIssued
                .slice(0, 5)
                .map(item => item.book);
        }

        // Priority 3: Recently added books
        if (recommendations.length === 0) {
            recommendations = books.slice(-5).reverse();
        }

        recommendedBooks.innerHTML = "";

        if (recommendations.length === 0) {
            recommendedBooks.innerHTML =
                "<p>No recommendations available yet.</p>";
        } else {
            recommendations.forEach(function(book) {

                let image = book.image || book.bookImage;

                recommendedBooks.innerHTML += `
                    <a href="../collections/collection.html?bookId=${encodeURIComponent(book.bookId)}"
                       class="recommend-card">

                        <div class="recommend-cover">
                            ${
                                image
                                ? `<img src="${image}" alt="${book.bookName}">`
                                : `<div class="no-cover">📖</div>`
                            }
                        </div>

                        <div class="recommend-info">
                            <h4>${book.bookName}</h4>
                            <p>${book.author || "Author not provided"}</p>
                            <span>Explore book ↗</span>
                        </div>

                    </a>
                `;
            });
        }
    }
}
updateDashboard();