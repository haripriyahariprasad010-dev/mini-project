let memberForm = document.getElementById("memberForm");
// Get the currently logged-in username
const currentUser = sessionStorage.getItem("loggedInUser");
// If nobody is logged in, redirect to login
if (!currentUser) {
    window.location.href = "../login/login.html";
}
// Each user gets a separate member list
const membersKey = "LIB_libraryMembers_" + currentUser;
// Load only this user's members
let members = JSON.parse(localStorage.getItem(membersKey)) || [];
let editIndex = -1;
// Save members for the current user
function saveMembers() {
    localStorage.setItem(membersKey, JSON.stringify(members));
}
// Display members in the table
function displayMembers(memberList = members) {
    let tableBody = document.getElementById("memberTableBody");
    tableBody.innerHTML = "";
    memberList.forEach(function(member) {
        let index = members.indexOf(member);
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${member.memberId}</td>
            <td>${member.name}</td>
            <td>${member.department}</td>
            <td>
                <button class="view-button"
                    onclick="viewMember(${index})">
                    View
                </button>

                <button class="edit-button"
                    onclick="editMember(${index})">
                    Edit
                </button>

                <button class="delete-button"
                    onclick="deleteMember(${index})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// View member details
function viewMember(index) {
    let member = members[index];

    if (!member) return;

    document.getElementById("viewMemberId").textContent =
        member.memberId;

    document.getElementById("viewMemberName").textContent =
        member.name;

    document.getElementById("viewDepartment").textContent =
        member.department;

    document.getElementById("viewEmail").textContent =
        member.email;

    document.getElementById("viewMobile").textContent =
        member.mobile;

    document.getElementById("viewMemberSince").textContent =
        member.memberSince || "Not recorded";

    document.getElementById("viewModal").style.display = "flex";
}

// Close the view modal
function closeView() {
    document.getElementById("viewModal").style.display = "none";
}

// Edit member details
function editMember(index) {
    let member = members[index];

    if (!member) return;

    document.getElementById("memberId").value =
        member.memberId;

    document.getElementById("memberName").value =
        member.name;

    document.getElementById("department").value =
        member.department;

    document.getElementById("email").value =
        member.email;

    document.getElementById("mobile").value =
        member.mobile;

    editIndex = index;

    document.querySelector(
        "#memberForm button[type='submit']"
    ).textContent = "Update Member";

    document.querySelector(".form-box").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Delete a member
function deleteMember(index) {
    let confirmDelete = confirm(
        "Are you sure you want to delete this member?"
    );

    if (confirmDelete) {
        members.splice(index, 1);

        saveMembers();
        displayMembers();

        // Cancel editing if the deleted member was being edited
        if (editIndex === index) {
            editIndex = -1;
            memberForm.reset();

            document.querySelector(
                "#memberForm button[type='submit']"
            ).textContent = "Add Member";
        } else if (editIndex > index) {
            editIndex--;
        }
    }
}

// Add or update a member
memberForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let memberId = document.getElementById("memberId").value.trim();
    let name = document.getElementById("memberName").value.trim();
    let department = document.getElementById("department").value.trim();
    let email = document.getElementById("email").value.trim();
    let mobile = document.getElementById("mobile").value.trim();

    let memberIdError = document.getElementById("memberIdError");
    let memberNameError = document.getElementById("memberNameError");
    let departmentError = document.getElementById("departmentError");
    let emailError = document.getElementById("emailError");
    let mobileError = document.getElementById("mobileError");
    let memberMessage = document.getElementById("memberMessage");

    // Clear previous messages
    memberIdError.textContent = "";
    memberNameError.textContent = "";
    departmentError.textContent = "";
    emailError.textContent = "";
    mobileError.textContent = "";
    memberMessage.textContent = "";

    let valid = true;

    // Member ID validation
    if (memberId === "") {
        memberIdError.textContent = "Member ID is required.";
        valid = false;
    } else {
        let duplicateId = members.some(function(member, index) {
            return member.memberId.toLowerCase() === memberId.toLowerCase()
                && index !== editIndex;
        });

        if (duplicateId) {
            memberIdError.textContent = "This Member ID already exists.";
            valid = false;
        }
    }

    // Name validation
    if (name === "") {
        memberNameError.textContent = "Name is required.";
        valid = false;
    }

    // Department validation
    if (department === "") {
        departmentError.textContent = "Department is required.";
        valid = false;
    }

    // Email validation
    if (email === "") {
        emailError.textContent = "Email is required.";
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = "Enter a valid email.";
        valid = false;
    }

    // Mobile validation
    if (mobile === "") {
        mobileError.textContent = "Mobile number is required.";
        valid = false;
    } else if (!/^\d{10}$/.test(mobile)) {
        mobileError.textContent =
            "Mobile number must contain 10 digits.";
        valid = false;
    }

    if (!valid) {
        return;
    }

    // Create the member object
    let member = {
        memberId: memberId,
        name: name,
        department: department,
        email: email,
        mobile: mobile,
        memberSince: editIndex === -1
            ? new Date().toLocaleDateString("en-GB")
            : members[editIndex].memberSince
    };

    if (editIndex === -1) {
        // Add new member
        members.push(member);
        memberMessage.textContent = "Member added successfully!";
    } else {
        // Update existing member
        members[editIndex] = member;
        memberMessage.textContent = "Member updated successfully!";
        editIndex = -1;
    }

    // Save only this user's members
    saveMembers();

    memberMessage.style.color = "green";

    displayMembers();
    memberForm.reset();
    document.querySelector( "#memberForm button[type='submit']").textContent = "Add Member";
});
// Display saved members when the page loads
displayMembers();