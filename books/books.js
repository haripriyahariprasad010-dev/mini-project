const bookForm = document.getElementById("bookForm");
const bookName = document.getElementById("bookName");
const author = document.getElementById("author");
const yearSelect = document.getElementById("year");
const bookImage = document.getElementById("bookImage");
const recommendOnDashboard = document.getElementById("recommendOnDashboard");
// Get the currently logged-in user
const currentUser = sessionStorage.getItem("loggedInUser");
// Stop access if nobody is logged in
if (!currentUser) {
    window.location.href = "../login/login.html";
}
// Each user gets a separate books list
const booksKey = "LIB_libraryBooks_" + currentUser;
// Load this user's books only
let books = JSON.parse(localStorage.getItem(booksKey) || "[]");
let editingIndex = -1;
// Generate publication years
for (let year = 2026; year >= 1900; year--) {
    let option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}
// Save the current user's books
function saveBooks() {
    localStorage.setItem(booksKey, JSON.stringify(books));
}
// Display books
function displayBooks(bookList = books) {
    let tableBody = document.getElementById("bookTableBody");
    tableBody.innerHTML = "";
    bookList.forEach(function (book) {
        let index = books.indexOf(book);
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.bookId}</td>
            <td>${book.bookName}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.quantity}</td>
            <td>
                <button class="action-button" onclick="viewBook(${index})">View</button>
                <button class="edit-button" onclick="editBook(${index})">Edit</button>
                <button class="delete-button"  onclick="deleteBook(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
// View book details
function viewBook(index) {
    let book = books[index];
    if (!book) return;
    document.getElementById("viewBookId").textContent = book.bookId;
    document.getElementById("viewBookName").textContent = book.bookName;
    document.getElementById("viewAuthor").textContent = book.author;
    document.getElementById("viewCategory").textContent = book.category;
    document.getElementById("viewPublisher").textContent = book.publisher;
    document.getElementById("viewYear").textContent = book.year;
    document.getElementById("viewQuantity").textContent = book.quantity;
    let image = document.getElementById("viewBookImage");
    if (book.image) {
        image.src = book.image;
        image.style.display = "block";
    } else {
        image.removeAttribute("src");
        image.style.display = "none";
    }
    document.getElementById("viewModal").style.display = "flex";
}
// Close view modal
function closeView() {
    document.getElementById("viewModal").style.display = "none";
}
// Edit book
function editBook(index) {
    let book = books[index];
    if (!book) return;
    document.getElementById("bookId").value = book.bookId;
    document.getElementById("bookName").value = book.bookName;
    document.getElementById("author").value = book.author;
    document.getElementById("category").value = book.category;
    document.getElementById("publisher").value = book.publisher;
    document.getElementById("year").value = book.year;
    document.getElementById("quantity").value = book.quantity;
    recommendOnDashboard.checked = book.recommendOnDashboard || false;
    editingIndex = index;
    document.getElementById("submitButton").textContent = "Update Book";
    bookForm.scrollIntoView({
        behavior: "smooth"
    });
}
// Delete book
function deleteBook(index) {
    if (!books[index]) return;
    let confirmDelete = confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;
    books.splice(index, 1);
    saveBooks();
    displayBooks();
}
// Add or update book
bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let id = document.getElementById("bookId").value.trim();
    let name = document.getElementById("bookName").value.trim();
    let selectedAuthor = document.getElementById("author").value.trim();
    let category = document.getElementById("category").value;
    let publisher = document.getElementById("publisher").value.trim();
    let year = document.getElementById("year").value;
    let quantity = document.getElementById("quantity").value;
    let bookIdError = document.getElementById("bookIdError");
    let bookNameError = document.getElementById("bookNameError");
    let quantityError = document.getElementById("quantityError");
    let bookMessage = document.getElementById("bookMessage");
    bookIdError.textContent = "";
    bookNameError.textContent = "";
    quantityError.textContent = "";
    bookMessage.textContent = "";
    let valid = true;
    // Validate Book ID
    if (id === "") {
        bookIdError.textContent = "Book ID is required.";
        valid = false;
    } else {
        let duplicateBook = books.some(function (book, index) {
            return index !== editingIndex &&
                book.bookId.toLowerCase() === id.toLowerCase();
        });
        if (duplicateBook) {
            bookIdError.textContent = "Book ID already exists.";
            valid = false;
        }
    }
    // Validate book name
    if (name === "") {
        bookNameError.textContent = "Book Name is required.";
        valid = false;
    }
    // Validate quantity
    if (quantity === "" || !Number.isInteger(Number(quantity)) ||
        Number(quantity) <= 0) {
        quantityError.textContent =
            "Quantity must be a whole number greater than zero.";
        valid = false;
    }
    if (category === "") {
        alert("Please select a category.");
        valid = false;
    }
    if (year === "") {
        alert("Please select publication year.");
        valid = false;
    }
    if (!valid) return;
    let imageFile = bookImage.files[0];
    function saveBook(imageData) {
        let book = {
            bookId: id,
            bookName: name,
            author: selectedAuthor,
            category: category,
            publisher: publisher,
            year: year,
            quantity: Number(quantity),
            image: imageData,
            recommendOnDashboard: recommendOnDashboard.checked
        };
        if (editingIndex === -1) {
            books.push(book);
            bookMessage.textContent = "Book added successfully!";
        } else {
            books[editingIndex] = book;
            bookMessage.textContent = "Book updated successfully!";
            editingIndex = -1;
            document.getElementById("submitButton").textContent = "Add Book";
        }
        saveBooks();
        bookMessage.style.color = "green";
        displayBooks();
        bookForm.reset();
    }
    if (imageFile) {
        let reader = new FileReader();
        reader.onload = function (event) {
            saveBook(event.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        let oldImage = "";
        if (editingIndex !== -1) {
            oldImage = books[editingIndex].image || "";
        }

        saveBook(oldImage);
    }
});
// Initial display
displayBooks();
// Search books belonging to this user
let searchBook = document.getElementById("searchBook");
searchBook.addEventListener("input", function () {
    let searchText = searchBook.value.toLowerCase();
    let filteredBooks = books.filter(function (book) {
        return (
            (book.bookName || "").toLowerCase().includes(searchText) ||
            (book.author || "").toLowerCase().includes(searchText) ||
            (book.category || "").toLowerCase().includes(searchText)
        );
    });
    displayBooks(filteredBooks);
});
