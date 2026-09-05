let loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        let username =
            document.getElementById("username")
                .value.trim();

        let password =
            document.getElementById("password")
                .value;


        let usernameError =
            document.getElementById(
                "usernameError"
            );

        let passwordError =
            document.getElementById(
                "passwordError"
            );

        let loginMessage =
            document.getElementById(
                "loginMessage"
            );


        // CLEAR OLD ERRORS

        usernameError.textContent = "";
        passwordError.textContent = "";
        loginMessage.textContent = "";


        document.getElementById("username")
            .classList.remove("input-error");

        document.getElementById("password")
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


        // PASSWORD VALIDATION

        let passwordPattern =
            /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8}$/;


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


        // STOP IF VALIDATION FAILED

        if (!valid) {

            return;
        }


        // GET SAVED USER

        let savedUser =
            localStorage.getItem("libraryUser");


        // NO ACCOUNT

        if (!savedUser) {

            usernameError.textContent =
                "No registered account found. Please register first.";

            document.getElementById("username")
                .classList.add("input-error");

            return;
        }


        // CONVERT STRING TO OBJECT

        savedUser =
            JSON.parse(savedUser);


        // CHECK USERNAME AND PASSWORD

        if (
            username !== savedUser.username ||
            password !== savedUser.password
        ) {


            // INVALID USERNAME

            if (
                username !== savedUser.username
            ) {

                usernameError.textContent =
                    "Invalid username or password.";

                document.getElementById("username")
                    .classList.add("input-error");
            }


            // INVALID PASSWORD

            if (
                password !== savedUser.password
            ) {

                passwordError.textContent =
                    "Invalid username or password.";

                document.getElementById("password")
                    .classList.add("input-error");
            }


            return;
        }


        // LOGIN SUCCESS

        loginMessage.textContent =
            "Login successful!";


        loginMessage.style.color = "green";


        sessionStorage.setItem(
            "loggedInUser",
            username
        );


        setTimeout(function () {

            window.location.href ="../dashboard/dashboard.html";

        }, 1000);

    });

}


// REMOVE ERROR WHEN USER TYPES

let allInputs =
    document.querySelectorAll(
        ".login-box input"
    );


allInputs.forEach(function (input) {

    input.addEventListener(
        "input",
        function () {

            input.classList.remove(
                "input-error"
            );

        }
    );

});