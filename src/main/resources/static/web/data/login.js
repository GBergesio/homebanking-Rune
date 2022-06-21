const app = Vue.createApp({
    data() {
        return {
            message: 'Hello Vue!',

            email: "",
            password: "",
            firstName: "",
            lastName: "",
            emailSignUp: "",
            passwordSignUp: "",
            firstNameSignUp: "",
            lastNameSignUp: "",
            emailReset: "",
            passwordReset: "",
            errorMessage: "",
            notification: false,
            notificationSignUp: false,
            fadein: false,
            fadeOut: false
        }
    },
    created() {
    },
    methods: {
        login() {
            axios.post('/api/login', `email=${this.email}&password=${this.password}`,
                { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
                .then(response =>
                    setTimeout(function () {
                        window.location.href = './accounts.html'
                    }, 1000))
                .catch(error => {
                    if (error.response.status == 404) {
                        this.errorMessage = "User not found, please check your email or password or Create an Account"
                    } else if (error.response.status == 401) {
                        this.errorMessage = "Can not log in, please check your email or password"
                    } else {
                        this.errorMessage = error.response.data
                    }
                    this.notification = true;
                })
        },
        signUp() {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, create Account'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post('/api/clients', `firstName=${this.firstNameSignUp}&lastName=${this.lastNameSignUp}&email=${this.emailSignUp}&password=${this.passwordSignUp}`, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
                   .then(response =>
                        axios.post('/api/login',`email=${this.emailSignUp}&password=${this.passwordSignUp}`))
                        .catch(function (error) {
                            this.error = error.response.data
                        })
                        .then(
                            setTimeout(function () {
                                if (this.error == "Email already in use" || this.error == "Missing data") {
                                    Swal.fire({
                                        title: "Error",
                                        text: `${this.error}`,
                                        icon: "error"
                                    })
                                    this.error = ""
                                } else {
                                    Swal.fire({
                                        title: "Account",
                                        text: "Account created",
                                        icon: "success"
                                    })
                                    setTimeout(function () {
                                        window.location.href = './accounts.html'
                                    }, 800)
                                }
                            }, 10))
                }
            })
        },
    },
    computed: {
        compClasses: function () {
            return {
                fadein: this.fadein,
                fadeOut: this.fadeOut
            }
        },
    },
}).mount('#app')

