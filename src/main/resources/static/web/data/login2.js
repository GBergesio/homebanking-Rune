const app = Vue.createApp({
    data() {
        return {
            message: 'Hello Vue!',

            email: "",
            password: "",
            firstName: "",
            lastName: "",

            emailSignUp:"",
            passwordSignUp: "",
            firstNameSignUp: "",
            lastNameSignUp: "",
            
            errorMessage: "",
            notification: false,
            notificationSignUp: false
        }
    },
    created() {

    },
    methods: {
        login(){
            axios.post('/api/login',`email=${this.email}&password=${this.password}`,
            {headers:{'content-type':'application/x-www-form-urlencoded'}})
            .then(response =>
                setTimeout(function(){
                window.location.href='./accounts.html'
            },1000))
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
        signUp(){
            axios.post('/api/clients',`firstName=${this.firstNameSignUp}&lastName=${this.lastNameSignUp}&email=${this.emailSignUp}&password=${this.passwordSignUp}`,{headers:{'content-type':'application/x-www-form-urlencoded'}})
            .then(response => 
                axios.post('/api/login',`email=${this.emailSignUp}&password=${this.passwordSignUp}`,
                {headers:{'content-type':'application/x-www-form-urlencoded'}})
                ) .then(response => 
                                setTimeout(function(){
                    window.location.href='./accounts.html'
                },1000))
                .catch(error =>{
                    if (error.response.status == 403){
                        if(error.response.data == 'Email already in use'){
                        this.errorMessage = "Email already in use"
                        console.log("error?")
                        }
                        this.notificationSignUp = true;
                    }
                })

        },





    },
    computed: {


    },
}).mount('#app')

window.slide = new SlideNav();


