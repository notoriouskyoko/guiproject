let register = false;

let ShowRegisteringForm = () => {
    if (!register) {
        let loginform = document.getElementById("loginForm")
        loginform.style.display = "none"
        let registerForm = document.getElementById("registerForm")
        registerForm.style.display = "block"
        register = true;
    } else if (register) {
        let loginform = document.getElementById("loginForm")
        loginform.style.display = "block"
        let registerForm = document.getElementById("registerForm")
        registerForm.style.display = "none"
        register = false;
    }
}

let registerUser = () => {
    let firstname = document.getElementById('inputfirstname')
    let lastname = document.getElementById('inputlastname')
    let email = document.getElementById('inputEmailRegister')
    let password = document.getElementById('inputPasswordRegister')

    if (firstname.value !== "" && lastname.value !== "" && email.value !== "" && password.value !== "") {
        $.post("/register", {
            firstname: firstname.value,
            lastname: lastname.value,
            email: email.value,
            password: password.value,
            DateRegistered: Date.now(),


        }, (data) => {
            console.log(data.code)
            if (data.code === 200) {
                window.location.replace("/login")
            } else {
                let popup = document.getElementById("Popup");
                popup.innerHTML = data.message
                popup.style.display = 'block'
                setTimeout(function () {
                    popup.style.display = 'none'
                }, 4000)
            }
        })
    } else {
        let popup = document.getElementById("Popup");
        popup.innerHTML = "fields cannot be empty!"
        popup.style.display = 'block'
        setTimeout(function () {
            popup.style.display = 'none'
        }, 4000)


    }


}
let  Userlogin = () => {
    let email = document.getElementById('InputEmailLogin')
    let password = document.getElementById('InputPasswordLogin')

    if (email.value !== "" || password.value !== "") {
        $.post("/login", {
            email: email.value,
            password: password.value,
        }, (data) => {
            if (data.code === 200) {
                window.location.replace("/")

            } else {
                let popup = document.getElementById("Popup");
                popup.innerHTML = data.message
                popup.style.display = 'block'
                setTimeout(function () {
                    popup.style.display = 'none'
                }, 4000)
            }
        })
    } else {
        let popup = document.getElementById("Popup");
        popup.innerHTML = "please fill something in!"
        popup.style.display = 'block'
        setTimeout(function () {
            popup.style.display = 'none'
        }, 4000)
    }
}
