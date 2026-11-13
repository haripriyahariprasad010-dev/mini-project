let registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        // Get input values
        let username = document.getElementById("username").value.trim();
        let email = document.getElementById("email").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        // Get error message elements
        let usernameError = document.getElementById("registerUsernameError");
        let emailError = document.getElementById("emailError");
        let phoneError = document.getElementById("phoneError");
        let passwordError = document.getElementById("registerPasswordError");
        let confirmPasswordError = document.getElementById("confirmPasswordError");
        let registerMessage = document.getElementById("registerMessage");
        // Clear previous error messages
        usernameError.textContent = "";
        emailError.textContent = "";
        phoneError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        registerMessage.textContent = "";
        // Remove previous error styling
        let inputs = registerForm.querySelectorAll("input");
        inputs.forEach(function (input) {
            input.classList.remove("input-error");
        });
        let valid = true;
        // Username: letters and numbers only
        let usernamePattern = /^[A-Za-z0-9]+$/;
        if (username === "") {
            usernameError.textContent = "Username is required.";
            document.getElementById("username").classList.add("input-error");
            valid = false;
        } else if (!usernamePattern.test(username)) {
            usernameError.textContent = "Username must contain letters and numbers only.";
            document.getElementById("username").classList.add("input-error");
            valid = false;
        }
        // Email validation
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === "") {
            emailError.textContent = "Email address is required.";
            document.getElementById("email").classList.add("input-error");
            valid = false;
        } else if (!emailPattern.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            document.getElementById("email").classList.add("input-error");
            valid = false;
        }
        // Phone number: exactly 10 digits
        let phonePattern = /^[0-9]{10}$/;
        if (phone === "") {
            phoneError.textContent = "Mobile number is required.";
            document.getElementById("phone").classList.add("input-error");
            valid = false;
        } else if (!phonePattern.test(phone)) {
            phoneError.textContent = "Mobile number must contain exactly 10 digits.";
            document.getElementById("phone").classList.add("input-error");
            valid = false;
        }
        // Password exactly 8 characters, with a letter, number and special character
        let passwordPattern =
            /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8}$/;
        if (password === "") {
            passwordError.textContent = "Password is required.";
            document.getElementById("password").classList.add("input-error");
            valid = false;
        } else if (!passwordPattern.test(password)) {
            passwordError.textContent = "Use exactly 8 characters with a letter, a number and a special character (!@#$%^&*).";
            document.getElementById("password").classList.add("input-error");
            valid = false;
        }
        // Confirm password
        if (confirmPassword === "") {
            confirmPasswordError.textContent = "Please confirm your password.";
            document.getElementById("confirmPassword").classList.add("input-error");
            valid = false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = "Passwords do not match.";
            document.getElementById("confirmPassword").classList.add("input-error");
            valid = false;
        }
        // Stop if any validation fails
        if (!valid) {
            return;
        }
        // Get registered users from Local Storage
        let users = JSON.parse(localStorage.getItem("LIB_libraryUsers")) || [];
        // Check duplicate username
        let usernameExists = users.some(function (user) {
            return user.username.toLowerCase() === username.toLowerCase();
        });
        if (usernameExists) {
            usernameError.textContent = "This username is already registered.";
            document.getElementById("username").classList.add("input-error");
            return;
        }
        // Check duplicate email
        let emailExists = users.some(function (user) {
            return user.email.toLowerCase() === email.toLowerCase();
        });
        if (emailExists) {
            emailError.textContent = "This email is already registered.";
            document.getElementById("email").classList.add("input-error");
            return;
        }
        // Create the new user
        let newUser = {
            username: username,
            email: email,
            phone: phone,
            password: password
        };
        // Save user details
        users.push(newUser);
        localStorage.setItem("LIB_libraryUsers", JSON.stringify(users));
        // Show success message
        registerMessage.textContent =
            "Registration successful! Redirecting to login...";
        registerMessage.style.color = "green";
        // Redirect to login page
        setTimeout(function () {
            window.location.href = "../login/login.html";
        }, 1500);
    });
    // Remove red border while typing
    let inputs = registerForm.querySelectorAll("input");
    inputs.forEach(function (input) {
        input.addEventListener("input", function () {
            input.classList.remove("input-error");
        });
    });
    // Clear messages when Reset is clicked
    registerForm.addEventListener("reset", function () {
        setTimeout(function () {
            registerForm.querySelectorAll(".input-error").forEach(function (element) {
                element.textContent = "";
                element.classList.remove("input-error");
            });
            document.getElementById("registerMessage").textContent = "";
        }, 0);
    });
}