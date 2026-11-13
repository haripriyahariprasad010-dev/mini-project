const currentUser = sessionStorage.getItem("loggedInUser");

if (!currentUser) {
    window.location.replace("../login/login.html");
} else {
    // Storage keys for the currently logged-in user
    const booksKey = "LIB_libraryBooks_" + currentUser;
    const membersKey = "LIB_libraryMembers_" + currentUser;
    const issuesKey = "LIB_libraryIssues_" + currentUser;

    const reportTableBody =
        document.getElementById("reportTableBody");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    // Safely read Local Storage
    function getData(key) {
        try {
            const data = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    // Convert ISO or dd/mm/yyyy dates to yyyy-mm-dd
    function normalizeDate(value) {
        if (!value) return "";

        const text = String(value).trim();

        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
            return text;
        }

        const match = text.match(
            /^(\d{2})\/(\d{2})\/(\d{4})$/
        );

        if (match) {
            return `${match[3]}-${match[2]}-${match[1]}`;
        }

        return "";
    }

    // Today's date in local time
    function todayString() {
        const date = new Date();

        const localDate = new Date(
            date.getTime() -
            date.getTimezoneOffset() * 60000
        );

        return localDate.toISOString().split("T")[0];
    }

    // Get the actual status of an issue
    function getIssueStatus(issue) {
        if (issue.status === "Returned") {
            return "Returned";
        }

        const dueDate = normalizeDate(issue.returnDate);

        if (dueDate && dueDate < todayString()) {
            return "Overdue";
        }

        return "Issued";
    }

    // Summary cards
    function updateSummary() {
        const books = getData(booksKey);
        const members = getData(membersKey);
        const issues = getData(issuesKey);

        const totalCopies = books.reduce(
            (total, book) =>
                total + (Number(book.quantity) || 0),
            0
        );

        const issuedCount = issues.filter(
            issue => getIssueStatus(issue) !== "Returned"
        ).length;

        const returnedCount = issues.filter(
            issue => getIssueStatus(issue) === "Returned"
        ).length;

        const overdueCount = issues.filter(
            issue => getIssueStatus(issue) === "Overdue"
        ).length;

        document.getElementById("totalTitles").textContent =
            books.length;

        document.getElementById("totalCopies").textContent =
            totalCopies;

        document.getElementById("totalMembers").textContent =
            members.length;

        document.getElementById("issuedBooks").textContent =
            issuedCount;

        document.getElementById("returnedBooks").textContent =
            returnedCount;

        document.getElementById("overdueBooks").textContent =
            overdueCount;
    }

    // Get Monday and Sunday for the current week
    function getWeekDates() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const monday = new Date(today);
        const day = monday.getDay();

        monday.setDate(
            monday.getDate() + (day === 0 ? -6 : 1 - day)
        );

        const dates = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);

            const year = date.getFullYear();
            const month = String(
                date.getMonth() + 1
            ).padStart(2, "0");

            const dayNumber = String(
                date.getDate()
            ).padStart(2, "0");

            dates.push(
                `${year}-${month}-${dayNumber}`
            );
        }

        return dates;
    }

    // Create either the issue or return graph
    function drawWeeklyChart(chartId, totalId, dateField, barType, title) {
        const issues = getData(issuesKey);
        const chart = document.getElementById(chartId);
        const totalLabel = document.getElementById(totalId);

        const weekDates = getWeekDates();

        const dayNames = [
            "Mon", "Tue", "Wed", "Thu",
            "Fri", "Sat", "Sun"
        ];

        const counts = Array(7).fill(0);

        issues.forEach(issue => {
            // Returned records must have an actual return date
            if (
                dateField === "actualReturnDate" &&
                issue.status !== "Returned"
            ) {
                return;
            }

            const date = normalizeDate(issue[dateField]);

            const index = weekDates.indexOf(date);

            if (index !== -1) {
                counts[index]++;
            }
        });

        const maxCount = Math.max(...counts, 1);

        chart.innerHTML = "";

        counts.forEach((count, index) => {
            const dayColumn = document.createElement("div");
            dayColumn.className = "chart-day";

            const countLabel = document.createElement("div");
            countLabel.className = "chart-count";
            countLabel.textContent = count;

            const barArea = document.createElement("div");
            barArea.className = "chart-bar-area";

            const bar = document.createElement("div");
            bar.className = `chart-bar ${barType}`;

            bar.style.height = count === 0
                ? "0px"
                : `${(count / maxCount) * 155}px`;

            bar.title =
                `${count} ${title.toLowerCase()} on ${dayNames[index]}`;

            const dayLabel = document.createElement("div");
            dayLabel.className = "chart-label";
            dayLabel.textContent = dayNames[index];

            barArea.appendChild(bar);

            dayColumn.appendChild(countLabel);
            dayColumn.appendChild(barArea);
            dayColumn.appendChild(dayLabel);

            chart.appendChild(dayColumn);
        });

        const weeklyTotal = counts.reduce(
            (total, count) => total + count,
            0
        );

        totalLabel.textContent =
            `Total ${title.toLowerCase()} this week: ${weeklyTotal}`;
    }

    // Weekly issue graph
    function displayWeeklyIssueChart() {
        drawWeeklyChart(
            "issueChart",
            "issueWeeklyTotal",
            "issueDate",
            "issue-bar",
            "Books issued"
        );
    }

    // Weekly return graph
    function displayWeeklyReturnChart() {
        drawWeeklyChart(
            "returnChart",
            "returnWeeklyTotal",
            "actualReturnDate",
            "return-bar",
            "Books returned"
        );
    }

    // Search and status filtering
    function getFilteredIssues() {
        const issues = getData(issuesKey);

        const searchText =
            searchInput.value.trim().toLowerCase();

        const selectedStatus = statusFilter.value;

        return issues.filter(issue => {
            const status = getIssueStatus(issue);

            const matchesSearch = [
                issue.issueId,
                issue.memberId,
                issue.memberName,
                issue.bookId,
                issue.bookName
            ].some(value =>
                String(value || "")
                    .toLowerCase()
                    .includes(searchText)
            );

            const matchesStatus =
                selectedStatus === "All" ||
                selectedStatus === status;

            return matchesSearch && matchesStatus;
        });
    }

    // Display issue and return history
    function displayReports() {
        const filteredIssues = getFilteredIssues();

        reportTableBody.innerHTML = "";

        if (filteredIssues.length === 0) {
            reportTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-row">
                        No matching records found.
                    </td>
                </tr>`;
        } else {
            [...filteredIssues].reverse().forEach(issue => {
                const row = document.createElement("tr");
                const status = getIssueStatus(issue);

                const values = [
                    issue.issueId,
                    issue.memberName,
                    issue.bookName,
                    issue.issueDate,
                    issue.returnDate,
                    issue.actualReturnDate || "-"
                ];

                values.forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value || "-";
                    row.appendChild(cell);
                });

                const statusCell = document.createElement("td");
                statusCell.textContent = status;
                statusCell.className =
                    "status-" + status.toLowerCase();

                row.appendChild(statusCell);
                reportTableBody.appendChild(row);
            });
        }

        document.getElementById("reportCount").textContent =
            `${filteredIssues.length} record${filteredIssues.length === 1 ? "" : "s"}`;
    }

    // Export the filtered history to CSV
    function exportCSV() {
        const issues = getFilteredIssues();

        if (issues.length === 0) {
            alert("There are no records to export.");
            return;
        }

        const headings = [
            "Issue ID",
            "Member ID",
            "Member Name",
            "Book ID",
            "Book Name",
            "Issue Date",
            "Due Date",
            "Actual Return Date",
            "Status"
        ];

        const rows = issues.map(issue => [
            issue.issueId,
            issue.memberId,
            issue.memberName,
            issue.bookId,
            issue.bookName,
            issue.issueDate,
            issue.returnDate,
            issue.actualReturnDate || "-",
            getIssueStatus(issue)
        ]);

        function escapeCSV(value) {
            let text = String(value ?? "");

            if (/^[\s]*[=+\-@]/.test(text)) {
                text = "'" + text;
            }

            return '"' + text.replace(/"/g, '""') + '"';
        }

        const csvContent = [
            headings,
            ...rows
        ].map(row =>
            row.map(escapeCSV).join(",")
        ).join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "library-report.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    // Search and filter events
    searchInput.addEventListener("input", displayReports);
    statusFilter.addEventListener("change", displayReports);

    document.getElementById("exportButton")
        .addEventListener("click", exportCSV);

    // Load everything when the page opens
    updateSummary();
    displayReports();
    displayWeeklyIssueChart();
    displayWeeklyReturnChart();
}