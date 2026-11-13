
let currentUser = sessionStorage.getItem("loggedInUser");

if (!currentUser) {
    window.location.replace("../login/login.html");
}

let booksKey = "LIB_libraryBooks_" + currentUser;

let books = JSON.parse(localStorage.getItem(booksKey) || "[]");

let collectionList = document.getElementById("collectionList");
let detailsPanel = document.getElementById("bookDetailsPanel");
let categoryTabs = document.getElementById("categoryTabs");
let searchBooks = document.getElementById("searchBooks");
let galleryTitle = document.getElementById("galleryTitle");
let bookCount = document.getElementById("bookCount");

let selectedCategory = "All Books";
let selectedBook = null;

// Get all categories

let categories = ["All Books"];

books.forEach(function(book) {
    let category = book.category || "Uncategorized";

    if (!categories.includes(category)) {
        categories.push(category);
    }
});

// Display category tabs

function displayCategories() {

    categoryTabs.innerHTML = "";

    categories.forEach(function(category) {

        let tab = document.createElement("button");

        tab.className = "category-tab";

        if (category === selectedCategory) {
            tab.classList.add("active");
        }

        tab.textContent = category;

        tab.addEventListener("click", function() {

            selectedCategory = category;

            displayCategories();
            displayBooks();

        });

        categoryTabs.appendChild(tab);

    });
}

// Display books

function displayBooks() {

    collectionList.innerHTML = "";

    let searchValue = searchBooks.value.toLowerCase();

    let filteredBooks = books.filter(function(book) {

        let matchesCategory =
            selectedCategory === "All Books" ||
            (book.category || "Uncategorized") === selectedCategory;

        let matchesSearch =
            (book.bookName || "").toLowerCase().includes(searchValue) ||
            (book.author || "").toLowerCase().includes(searchValue);

        return matchesCategory && matchesSearch;

    });

    galleryTitle.textContent = selectedCategory;

    bookCount.textContent = filteredBooks.length + " Book(s)";

    if (filteredBooks.length === 0) {
        detailsPanel.hidden = true;
document.querySelector(".collection-layout").classList.remove("has-selection");

        collectionList.innerHTML = `
            <div class="no-books">
                No books found in this collection.
            </div>
        `;

        detailsPanel.innerHTML = `
            <div class="details-placeholder">
                <div class="placeholder-icon">📖</div>
                <h2>About the Book</h2>
                <p>No matching book is currently available.</p>
            </div>
        `;

        selectedBook = null;

        return;
    }

    filteredBooks.forEach(function(book) {

        let bookBox = document.createElement("div");

        bookBox.className = "book-card";

        if (selectedBook === book) {
            bookBox.classList.add("selected");
        }

        bookBox.tabIndex = 0;

        let image = book.image || book.bookImage;

        bookBox.innerHTML = `
            ${
                image
                ? `<img src="${image}" alt="Book Cover">`
                : `<div class="book-cover-placeholder">📖</div>`
            }

            <h3>${book.bookName || "Untitled Book"}</h3>

            <p>${book.author || "Author not provided"}</p>

            <button type="button">📖 Read</button>
        `;

        // Select book and display details

        bookBox.addEventListener("click", function() {

            selectBook(book);

        });

        // Keyboard selection

        bookBox.addEventListener("keydown", function(event) {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();

                selectBook(book);

            }

        });

        // Read button

        bookBox.querySelector("button").addEventListener("click", function(event) {

            event.stopPropagation();

            readBook(book.bookName);

        });

        collectionList.appendChild(bookBox);

    });

}

// Display selected book details

function selectBook(book) {

    selectedBook = book;
    detailsPanel.hidden = false;
document.querySelector(".collection-layout").classList.add("has-selection");

    // Highlight selected card

    document.querySelectorAll(".book-card").forEach(function(card) {

        card.classList.remove("selected");

    });

    let selectedCards = document.querySelectorAll(".book-card");

    selectedCards.forEach(function(card) {

        let title = card.querySelector("h3").textContent;

        if (title === (book.bookName || "Untitled Book")) {
            card.classList.add("selected");
        }

    });

    let image = book.image || book.bookImage;

    detailsPanel.innerHTML = `

        <div class="details-content">

            <span class="details-label">ABOUT THE BOOK</span>

            ${
                image
                ? `<img src="${image}" class="details-book-image" alt="Book Cover">`
                : `<div class="details-image-placeholder">📖</div>`
            }

            <h2>${book.bookName || "Untitled Book"}</h2>

            <p class="details-author">
                ${book.author || "Author not provided"}
            </p>

            <div class="details-info">

                <h3>Book Information</h3>

                <div class="detail-row">
                    <strong>Book ID</strong>
                    <span>${book.bookId || "Not available"}</span>
                </div>

                <div class="detail-row">
                    <strong>Book Name</strong>
                    <span>${book.bookName || "Not available"}</span>
                </div>

                <div class="detail-row">
                    <strong>Author</strong>
                    <span>${book.author || "Not available"}</span>
                </div>

                <div class="detail-row">
                    <strong>Category</strong>
                    <span>${book.category || "Uncategorized"}</span>
                </div>

                <div class="detail-row">
                    <strong>Publisher</strong>
                    <span>${book.publisher || "Not available"}</span>
                </div>

                <div class="detail-row">
                    <strong>Year</strong>
                    <span>${book.year || "Not available"}</span>
                </div>

                <div class="detail-row">
                    <strong>Quantity</strong>
                    <span>${book.quantity ?? "Not available"}</span>
                </div>

            </div>

        </div>

    `;

}

// Read button functionality

function readBook(bookName) {

    alert("📖 You selected: " + bookName);

}

// Search books

searchBooks.addEventListener("input", function() {

    displayBooks();

});

// Initial display
displayCategories();
displayBooks();
// Open a book selected from Dashboard recommendations
const urlParams = new URLSearchParams(window.location.search);
const requestedBookId = urlParams.get("bookId");

if (requestedBookId) {
    const requestedBook = books.find(
        book => String(book.bookId) === requestedBookId
    );

    if (requestedBook) {
        selectBook(requestedBook);
    }
}
// Close book details when clicking outside
document.addEventListener("click", function(event) {
    let clickedBook = event.target.closest(".book-card");
    let clickedDetails = event.target.closest(".book-details-panel");

    if (!clickedBook && !clickedDetails) {

        detailsPanel.hidden = true;

        document.querySelector(".collection-layout")
            .classList.remove("has-selection");

        document.querySelectorAll(".book-card").forEach(function(card) {
            card.classList.remove("selected");
        });
        selectedBook = null;
    }
});