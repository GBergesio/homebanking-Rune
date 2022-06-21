const app = Vue.createApp({

    data() {
        return {
            message: 'Hello Vue!',
            contenidoData: [],
            datos: [],
            datosAccount: [],
            clients: [],
            firstName: "",
            lastName: "",
            email: "",
            firstNameEdit: "",
            lastNameEdit: "",
            emailEdit: "",
            clientLink: [],
            clienteSeleccionado: {},
            time: "",
            greet: "",
            number: "",
            creationDate: "",
            balance: 0,
        }
    },
    created() {
        axios.get(`/api/clients`)
            .then(data => {
                this.datos = data.data
                console.log(data)
                console.log(this.datos)
            })
    },
    methods: {
        addClient() {
            if (this.firstName != "" && this.lastName != "" && this.email != "" && this.email.includes("@") && this.email.includes(".")) {
                this.client = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                }
                axios.post('/rest/clients/', this.client)
                location.reload()
            }
        },
        takeClient(cliente) {
            this.clienteSeleccionado = cliente;
            this.urlClienteSeleccionado = '/rest/clients/' + cliente.id;
            console.log(this.clienteSeleccionado)
            console.log(this.urlClienteSeleccionado)
        },
        deleteClient(url) {
            this.clienteSeleccionado.accounts.forEach(account =>{
                axios.delete("/rest/accounts/" + account.id)
                
            })
            function eliminando(){
                axios.delete(url)  
                location.reload()
            }
            setTimeout(eliminando, 100)
        },
        editClient(url) {
            this.firstNameEdit = document.querySelector("#nameImputEdit").value
            this.lastNameEdit = document.querySelector("#lastNameImputEdit").value
            this.emailEdit = document.querySelector("#inputEmailEdit").value

            this.client = {
                firstName: this.firstNameEdit,
                lastName: this.lastNameEdit,
                email: this.emailEdit,
            }
            axios.patch(url,this.client)
            .then(location.reload)
        },
    },
    computed: {


    },
}).mount('#app')



