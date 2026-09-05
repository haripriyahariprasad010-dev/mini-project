let navLinks =
    document.querySelectorAll(".nav-link");
navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        if (link.classList.contains("logout")) {
            return;
        }

        event.preventDefault();
        navLinks.forEach(function (item) {

            item.classList.remove("active");

        });

        link.classList.add("active");

        let section =
            link.getAttribute("data-section");

        showSection(section);
    });
});
function showSection(section) {

    let content =
        document.getElementById(
            "dashboardContent"
        );

    if (section === "dashboard") {

        content.innerHTML = `

            <div class="dashboard-title">

                <p class="small-title">
                    📋 LIBRARY OVERVIEW
                </p>

                <h2>
                    Welcome to the Dashboard
                </h2>

                <p>
                    Manage your digital library from one place.
                </p>

            </div>


            <div class="summary-cards">


                <div class="summary-card">

                    <div class="dashboard-emoji">
                        📚
                    </div>

                    <h3>
                        Total Books
                    </h3>

                    <p>
                        250
                    </p>

                </div>


                <div class="summary-card">

                    <div class="dashboard-emoji">
                        👥
                    </div>

                    <h3>
                        Total Members
                    </h3>

                    <p>
                        120
                    </p>

                </div>


                <div class="summary-card">

                    <div class="dashboard-emoji">
                        📖
                    </div>

                    <h3>
                        Issued Books
                    </h3>

                    <p>
                        35
                    </p>

                </div>


                <div class="summary-card">

                    <div class="dashboard-emoji">
                        ✅
                    </div>

                    <h3>
                        Returned Books
                    </h3>

                    <p>
                        215
                    </p>

                </div>


            </div>


            <div class="most-issued">

                <h3>
                    📚 Most Issued Books
                </h3>

                <p class="section-description">
                    Popular books among library members
                </p>


                <div class="book-item">

                    <div class="book-number">
                        1
                    </div>

                    <div class="book-info">

                        <h4>
                            The Alchemist
                        </h4>

                        <p>
                            Paulo Coelho
                        </p>

                    </div>

                    <div class="issued-count">
                        18 issued
                    </div>

                </div>


                <div class="book-item">

                    <div class="book-number">
                        2
                    </div>

                    <div class="book-info">

                        <h4>
                            Atomic Habits
                        </h4>

                        <p>
                            James Clear
                        </p>

                    </div>

                    <div class="issued-count">
                        15 issued
                    </div>

                </div>


                <div class="book-item">

                    <div class="book-number">
                        3
                    </div>

                    <div class="book-info">

                        <h4>
                            Rich Dad Poor Dad
                        </h4>

                        <p>
                            Robert Kiyosaki
                        </p>

                    </div>

                    <div class="issued-count">
                        12 issued
                    </div>

                </div>


                <div class="book-item">

                    <div class="book-number">
                        4
                    </div>

                    <div class="book-info">

                        <h4>
                            Clean Code
                        </h4>

                        <p>
                            Robert C. Martin
                        </p>

                    </div>

                    <div class="issued-count">
                        9 issued
                    </div>

                </div>

            </div>

        `;

    }


    else if (section === "books") {

        content.innerHTML = `

            <div class="module-content">

                <p class="small-title">
                    📚 BOOK MODULE
                </p>

                <h2>
                    Books
                </h2>

                <p>
                    This section will display all books
                    available in the digital library.
                </p>

            </div>

        `;

    }

    else if (section === "members") {

        content.innerHTML = `

            <div class="module-content">

                <p class="small-title">
                    👥 MEMBER MODULE
                </p>

                <h2>
                    Members
                </h2>

                <p>
                    This section will display registered
                    library members.
                </p>

            </div>

        `;

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
            <div class="module-content">

                <p class="small-title">
                    ℹ️ ABOUT LIBRARY
                </p>

                <h2>
                    About
                </h2>

                <p>
                    Digital Library Management System
                    helps manage books, members and
                    library activities efficiently.
                </p>

            </div>

        `;

    }

}