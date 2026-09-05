let registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let username =
            document.getElementById("username")
                .value.trim();

        let email =
            document.getElementById("email")
                .value.trim();

        let phone =
            document.getElementById("phone")
                .value.trim();

        let password =
            document.getElementById("password")
                .value;

        let confirmPassword =
            document.getElementById("confirmPassword")
                .value;

        let usernameError =
            document.getElementById(
                "registerUsernameError"
            );

        let emailError =
            document.getElementById(
                "emailError"
            );

        let phoneError =
            document.getElementById(
                "phoneError"
            );

        let passwordError =
            document.getElementById(
                "registerPasswordError"
            );

        let confirmPasswordError =
            document.getElementById(
                "confirmPasswordError"
            );

        let registerMessage =
            document.getElementById(
                "registerMessage"
            );


        // CLEAR OLD ERRORS

        usernameError.textContent = "";
        emailError.textContent = "";
        phoneError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        registerMessage.textContent = "";


        document.getElementById("username")
            .classList.remove("input-error");

        document.getElementById("email")
            .classList.remove("input-error");

        document.getElementById("phone")
            .classList.remove("input-error");

        document.getElementById("password")
            .classList.remove("input-error");

        document.getElementById("confirmPassword")
            .classList.remove("input-error");


        let valid = true;


        // USERNAME VALIDATION

        let usernamePattern =
            /^[A-Za-z]+$/;


        if (username === "") {

            usernameError.textContent =
                "Username is required.";

            document.getElementById("username")
                .classList.add("input-error");

            valid = false;

        }

        else if (!usernamePattern.test(username)) {

            usernameError.textContent =
                "Invalid username. Use alphabets only.";

            document.getElementById("username")
                .classList.add("input-error");

            valid = false;
        }


        // EMAIL VALIDATION

        let emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {

            emailError.textContent =
                "Email is required.";

            document.getElementById("email")
                .classList.add("input-error");

            valid = false;

        }

        else if (!emailPattern.test(email)) {

            emailError.textContent =
                "Invalid email address.";

            document.getElementById("email")
                .classList.add("input-error");

            valid = false;
        }


        // PHONE VALIDATION

        let phonePattern =
            /^[0-9]{10}$/;


        if (phone === "") {

            phoneError.textContent =
                "Phone number is required.";

            document.getElementById("phone")
                .classList.add("input-error");

            valid = false;

        }

        else if (!phonePattern.test(phone)) {

            phoneError.textContent =
                "Invalid phone number. Enter exactly 10 digits.";

            document.getElementById("phone")
                .classList.add("input-error");

            valid = false;
        }


        // PASSWORD VALIDATION

        let passwordPattern =/^(?=.*[0-9])(?=.*[!@#$%^&*]).{8}$/;


        if (password === "") {

            passwordError.textContent =
                "Password is required.";

            document.getElementById("password")
                .classList.add("input-error");

            valid = false;

        }

        else if (!passwordPattern.test(password)) {

            passwordError.textContent =
                "Password must be exactly 8 characters with 1 number and 1 special character.";

            document.getElementById("password")
                .classList.add("input-error");

            valid = false;
        }


        // CONFIRM PASSWORD

        if (confirmPassword === "") {

            confirmPasswordError.textContent =
                "Please confirm your password.";

            document.getElementById("confirmPassword")
                .classList.add("input-error");

            valid = false;
        }

        else if (confirmPassword !== password) {

            confirmPasswordError.textContent =
                "Passwords do not match.";

            document.getElementById("confirmPassword")
                .classList.add("input-error");

            valid = false;
        }


        // CHECK EXISTING USER

        let existingUser =
            localStorage.getItem("libraryUser");


        if (existingUser && valid) {

            existingUser =
                JSON.parse(existingUser);


            if (
                existingUser.username.toLowerCase() ===
                username.toLowerCase()
            ) {

                usernameError.textContent =
                    "Username already exists.";

                document.getElementById("username")
                    .classList.add("input-error");

                valid = false;
            }
        }


        // SAVE USER

        if (valid) {

            let user = {

                username: username,

                email: email,

                phone: phone,

                password: password
            };


            localStorage.setItem(
                "libraryUser",
                JSON.stringify(user)
            );


            registerMessage.textContent =
                "Registration successful! Redirecting to login in 5 seconds...";


            registerMessage.style.color = "green";


            let registerButton =
                registerForm.querySelector(
                    'button[type="submit"]'
                );


            registerButton.disabled = true;

            registerButton.style.opacity = "0.6";


            setTimeout(function () {

                window.location.href =
                    "../login/login.html";

            }, 5000);

        }

    });

}


// PHONE NUMBER ONLY

let phoneInput =
    document.getElementById("phone");


if (phoneInput) {

    phoneInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );

}