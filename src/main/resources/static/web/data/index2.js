const app = Vue.createApp({

    data() {
        return {
            message: 'Hello Vue!',

        }
    },
    created() {

        //  axios.get(`http://localhost:8080/api/clients/1`)
        //     .then(data => {
        //         this.dataClient = data.data
        //         this.accountsClient = data.data.accounts
        //         this.infoClient = data.data.firstName + " " + data.data.lastName
               
        //     }),

    },
    methods: {
        currentDateTime() {
            const time = new Date().getHours();

            if (time >= 6 && time < 12) {
                return this.saludo = "Good Morning"
            }
            else if (time >= 12 && time < 18) {
                return this.saludo = "Good Afternoon"
            }
            else if (time >= 18 && time < 22) {
                return this.saludo = "Good Evening"
            } else {
                return this.saludo = "Good Night"
            }
        },

    },
    computed: {


    },
}).mount('#app')

