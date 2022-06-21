const app = Vue.createApp({

    data() {
        return {
            message: 'Hello Vue!',
            saludo: "",
            dataClient: {},
            infoClient: "",
            accountsClient: [],
            accNumber: "",
            dataBalance: 0,
            transactions: [],
            initials: "",
            // PDF
            sinceDate: "",
            untilDate: ""
        }
    },
    created() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlParamsDos = new URLSearchParams(window.location.search);
        const id = urlParams.get('id')
        const idDos = urlParamsDos.get('id')

         axios.get(`http://localhost:8080/api/clients/current`)
            .then(data => {
                this.dataClient = data.data
                this.accountsClient = data.data.accounts
                this.infoClient = data.data.firstName + " " + data.data.lastName
                this.cutName()
            }),

        axios.get(`http://localhost:8080/api/clients/current/accounts/`+ id)
            .then(dataAcc => {
                this.dataAccount = dataAcc.data
                this.accNumber = this.dataAccount.number
                this.dataBalance = this.dataAccount.balance
                this.transactions = this.dataAccount.transactionDTO
                this.sortTransactions()
            })
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
        downloadPDF(){
        let pdfData = {
            numberAccount: this.accNumber,
            dataSince: this.sinceDate,
            dateUntil: this.untilDate
        }
        axios.post('/api/transactions/pdfResume', pdfData,{'responseType':'blob'})
        .then(response =>{
            let url = window.URL.createObjectURL(new Blob([response.data]))
            let link = document.createElement("a")
            link.href= url;
            link.setAttribute("download",`Resume.pdf`)
            document.body.appendChild(link)
            link.click()
        })
        },
        sortTransactions(){
            this.transactions.sort((a, b) => b.id - a.id)
        },
        getTransactionDate(dateImput){
            const date = new Date(dateImput)
            return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()  
        },
        logout(){
            axios.post('/api/logout').then(response => console.log(''))
            setTimeout(function(){
              window.location.href='./index.html'
          },1000) 
          },
          cutName(){
            let initialName = this.dataClient.firstName 
            let initialLastName = this.dataClient.lastName
            this.initials = initialName.charAt(0) + initialLastName.charAt(0)
          },
    },
    computed: {

    },
}).mount('#app')


document.addEventListener("DOMContentLoaded", function (event) {

    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)

        // Validate that all variables exist
        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('click', () => {
                // show navbar
                nav.classList.toggle('show')
                // change icon
                toggle.classList.toggle('bx-x')
                // add padding to body
                bodypd.classList.toggle('body-pd')
                // add padding to header
                headerpd.classList.toggle('body-pd')
            })
        }
    }

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')

    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')

    function colorLink() {
        if (linkColor) {
            linkColor.forEach(l => l.classList.remove('active'))
            this.classList.add('active')
        }
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink))

});


