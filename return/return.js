const currentUser = sessionStorage.getItem("loggedInUser");

if (!currentUser) {
    window.location.replace("../login/login.html");
} else {
    const booksKey = "LIB_libraryBooks_" + currentUser;
    const issuesKey = "LIB_libraryIssues_" + currentUser;

    const returnTableBody =
        document.getElementById("returnTableBody");

    const returnMessage =
        document.getElementById("returnMessage");

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

    function showMessage(message, type) {
        returnMessage.textContent = message;
        returnMessage.className = type;
    }

    function displayReturnRecords() {
        const issues = getData(issuesKey);

        returnTableBody.innerHTML = "";

        if (issues.length === 0) {
            returnTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-row">
                        No issued books found.
                    </td>
                </tr>`;
            return;
        }

        [...issues].reverse().forEach(issue => {
            const row = document.createElement("tr");

            const values = [
                issue.issueId,
                issue.memberName,
                issue.bookName,
                issue.issueDate,
                issue.returnDate
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value || "-";
                row.appendChild(cell);
            });

            const statusCell = document.createElement("td");
            const status = document.createElement("span");

            status.textContent = issue.status || "Issued";
            status.className =
                (issue.status || "Issued") === "Returned"
                    ? "returned-status"
                    : "issued-status";

            statusCell.appendChild(status);
            row.appendChild(statusCell);

            const actionCell = document.createElement("td");
            const button = document.createElement("button");

            button.className = "return-button";

            if ((issue.status || "Issued") === "Returned") {
                button.textContent = "Returned";
                button.disabled = true;
            } else {
                button.textContent = "Return";
                button.addEventListener("click", function() {
                    returnBook(issue.issueId);
                });
            }

            actionCell.appendChild(button);
            row.appendChild(actionCell);

            returnTableBody.appendChild(row);
        });
    }

    function returnBook(issueId) {
        const issues = getData(issuesKey);
        const books = getData(booksKey);

        const issue = issues.find(
            item => item.issueId === issueId
        );

        if (!issue) {
            showMessage("Issue record not found.", "error");
            return;
        }

        if ((issue.status || "Issued") === "Returned") {
            showMessage("This book has already been returned.", "error");
            return;
        }

        const confirmReturn = confirm(
            `Confirm return of "${issue.bookName}"?`
        );

        if (!confirmReturn) {
            return;
        }

        const book = books.find(
            item => item.bookId === issue.bookId
        );

        if (!book) {
            showMessage(
                "The original book record was not found. Quantity was not changed.",
                "error"
            );
            return;
        }

        // Update the issue record
        issue.status = "Returned";
        issue.actualReturnDate = new Date().toLocaleDateString("en-GB");

        // Increase available book quantity
        book.quantity = (Number(book.quantity) || 0) + 1;

        saveData(issuesKey, issues);
        saveData(booksKey, books);

        showMessage(
            `"${issue.bookName}" was returned successfully!`,
            "success"
        );

        displayReturnRecords();
    }
    displayReturnRecords();
}