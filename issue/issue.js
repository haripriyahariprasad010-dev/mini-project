const issueForm = document.getElementById("issueForm");
const memberSelect = document.getElementById("memberSelect");
const bookSelect = document.getElementById("bookSelect");
const issueDate = document.getElementById("issueDate");
const returnDate = document.getElementById("returnDate");
const memberInfo = document.getElementById("memberInfo");
const bookInfo = document.getElementById("bookInfo");
const issueMessage = document.getElementById("issueMessage");
const issueTableBody = document.getElementById("issueTableBody");
const recordCount = document.getElementById("recordCount");

const currentUser = sessionStorage.getItem("loggedInUser");

if (!currentUser) {
    window.location.replace("../login/login.html");
}

const booksKey = "LIB_libraryBooks_" + currentUser;
const membersKey = "LIB_libraryMembers_" + currentUser;
const issuesKey = "LIB_libraryIssues_" + currentUser;

function getData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function todayString() {
    const date = new Date();
    const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().split("T")[0];
}

function showMessage(message, type) {
    issueMessage.textContent = message;
    issueMessage.className = type;
}

function populateMembers() {
    const members = getData(membersKey);

    memberSelect.innerHTML =
        '<option value="">Choose a member</option>';

    members.forEach(member => {
        const option = document.createElement("option");
        option.value = member.memberId;
        option.textContent = `${member.name} (${member.memberId})`;
        memberSelect.appendChild(option);
    });

    memberInfo.textContent = members.length === 0
        ? "Add a member in Member Management first."
        : "";
}

function populateBooks() {
    const books = getData(booksKey);

    bookSelect.innerHTML =
        '<option value="">Choose a book</option>';

    books.forEach(book => {
        const quantity = Number(book.quantity) || 0;

        if (quantity > 0) {
            const option = document.createElement("option");
            option.value = book.bookId;
            option.textContent =
                `${book.bookName} (${quantity} available)`;
            bookSelect.appendChild(option);
        }
    });

    bookInfo.textContent = bookSelect.options.length === 1
        ? "No books are currently available."
        : "";
}

function updateMemberInfo() {
    const members = getData(membersKey);
    const member = members.find(
        item => item.memberId === memberSelect.value
    );

    memberInfo.textContent = member
        ? `Department: ${member.department || "Not specified"}`
        : "";
}

function updateBookInfo() {
    const books = getData(booksKey);
    const book = books.find(
        item => item.bookId === bookSelect.value
    );
    bookInfo.textContent = book
        ? `Author: ${book.author || "Not specified"} | Available: ${Number(book.quantity) || 0}`
        : "";
}
function displayIssues() {
    const issues = getData(issuesKey);
    issueTableBody.innerHTML = "";
    recordCount.textContent =
        `${issues.length} record${issues.length === 1 ? "" : "s"}`;
    if (issues.length === 0) {
        issueTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">
                    No issue records found.
                </td>
            </tr>`;
        return;
    }
    [...issues].reverse().forEach(issue => {
        const row = document.createElement("tr");
        [
            issue.issueId,
            issue.memberName,
            issue.bookName,
            issue.issueDate,
            issue.returnDate
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value || "-";
            row.appendChild(cell);
        });
        const statusCell = document.createElement("td");
        const status = document.createElement("span");
        status.className = "status";
        status.textContent = issue.status || "Issued";
        statusCell.appendChild(status);
        row.appendChild(statusCell);
        issueTableBody.appendChild(row);
    });
}
memberSelect.addEventListener("change", updateMemberInfo);
bookSelect.addEventListener("change", updateBookInfo);
issueDate.value = todayString();
issueDate.max = todayString();
returnDate.min = issueDate.value;
returnDate.value = issueDate.value;
issueDate.addEventListener("change", () => {
    returnDate.min = issueDate.value;
    if (returnDate.value < issueDate.value) {
        returnDate.value = issueDate.value;
    }
});
issueForm.addEventListener("submit", function(event) {
    event.preventDefault();
    if (!currentUser) {
        showMessage("Please log in before issuing a book.", "error");
        return;
    }
    const members = getData(membersKey);
    const books = getData(booksKey);
    const issues = getData(issuesKey);
    const member = members.find(
        item => item.memberId === memberSelect.value
    );
    const book = books.find(
        item => item.bookId === bookSelect.value
    );
    if (!member || !book) {
        showMessage("Please select a valid member and book.", "error");
        return;
    }
    if (Number(book.quantity) <= 0) {
        showMessage("This book is out of stock.", "error");
        populateBooks();
        return;
    }
    if (
        !issueDate.value ||
        !returnDate.value ||
        returnDate.value < issueDate.value
    ) {
        showMessage("Please choose a valid issue date and due date.", "error");
        return;
    }
    book.quantity = Number(book.quantity) - 1;
    const newIssue = {
        issueId: "ISS" + Date.now(),
        username: currentUser,
        memberId: member.memberId,
        memberName: member.name,
        bookId: book.bookId,
        bookName: book.bookName,
        issueDate: issueDate.value,
        returnDate: returnDate.value,
        status: "Issued"
    };
    issues.push(newIssue);
    saveData(booksKey, books);
    saveData(issuesKey, issues);
    showMessage("Book issued successfully!", "success");
    issueForm.reset();
    issueDate.value = todayString();
    returnDate.min = issueDate.value;
    returnDate.value = issueDate.value;
    memberInfo.textContent = "";
    bookInfo.textContent = "";
    populateMembers();
    populateBooks();
    displayIssues();
});
populateMembers();
populateBooks();
displayIssues();