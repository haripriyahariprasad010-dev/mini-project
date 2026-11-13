let loginForm =
    document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let username =document.getElementById("username").value.trim();
        let password =document.getElementById("password") .value;
        let usernameError =document.getElementById("usernameError");
        let passwordError =document.getElementById("passwordError");
        let loginMessage =document.getElementById("loginMessage");
        usernameError.textContent = "";
        passwordError.textContent = "";
        loginMessage.textContent = "";
        document.getElementById("username").classList.remove("input-error");
        document.getElementById("password").classList.remove("input-error");
        let valid = true;
        let usernamePattern = /^[A-Za-z0-9]+$/;
        if (username === "") {
            usernameError.textContent = "Username is required.";
            document.getElementById("username").classList.add("input-error");
            valid = false;
        }
        else if (!usernamePattern.test(username)) {
            usernameError.textContent ="Invalid username. Use letters and numbers only.";
            document.getElementById("username").classList.add("input-error");
            valid = false;
        }
        let passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8}$/;
        if (password === "") {
            passwordError.textContent ="Password is required.";
            document.getElementById("password").classList.add("input-error");
            valid = false;
        }
        else if (!passwordPattern.test(password)) {
            passwordError.textContent = "Password must be exactly 8 characters with 1 number and 1 special character.";
            document.getElementById("password").classList.add("input-error");
            valid = false;
        }
        if (!valid) {
            return;
        }
        let users =
            JSON.parse(
                localStorage.getItem("LIB_libraryUsers")
            ) || [];
        if (users.length === 0) {
            usernameError.textContent = "No registered account found. Please register first.";
            document.getElementById("username").classList.add("input-error");
            return;
        }
        let savedUser =
            users.find(
                function (user) {
                    return user.username
                        .toLowerCase() ===
                        username.toLowerCase();
                }
            );
        if (!savedUser) {
            usernameError.textContent ="Invalid username or password.";
            document.getElementById("username").classList.add("input-error");
            return;
        }
        if (password !== savedUser.password) {
            passwordError.textContent ="Invalid username or password.";
            document.getElementById("password").classList.add("input-error");
            return;
        }
        loginMessage.textContent = "Login successful!";
        loginMessage.style.color = "green";
        sessionStorage.setItem("loggedInUser", savedUser.username);
        setTimeout(function () {
            window.location.href = "../dashboard/dashboard.html";
        }, 1000);
    });
}
let allInputs = document.querySelectorAll(".login-box input");
allInputs.forEach(function (input) {
    input.addEventListener("input", function () {
            input.classList.remove("input-error");
        }
    );
});