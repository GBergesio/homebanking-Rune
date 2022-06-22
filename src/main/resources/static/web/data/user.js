const app = Vue.createApp({

    data() {
        return {
            message: 'Hello Vue!',
            saludo: "",
            infoClient: "",
            initials: "",
            client: {},
            accountsClient: [],
            loans: [],
            cards: [],
            accounts: []
        }
    },
    created() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlParamsDos = new URLSearchParams(window.location.search);
        const id = urlParams.get('id')
        const idDos = urlParamsDos.get('id')

        this.loadAccounts()
        this.loadClient()
    },
    methods: {
        loadAccounts() {
            axios.get(`/api/clients/current/accounts`)
                .then(data => {
                    this.accounts = data.data
                    this.sortAccounts()
                    console.log(this.accounts);
                })
        },
        loadClient() {
            axios.get(`/api/clients/current`)
                .then(data => {
                    this.client = data.data
                    this.infoClient = this.client.firstName + " " + this.client.lastName
                    this.cutName()
                    this.cards = this.client.cards
                    this.loans = this.client.loans
                    this.sortCards()
                    console.log(this.client);
                })
        },
        cutName() {
            let initialName = this.client.firstName
            let initialLastName = this.client.lastName
            this.initials = initialName.charAt(0) + initialLastName.charAt(0)
        },
        logout() {
            axios.post('/api/logout')
            .then(response => 
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Successful Logout!' ,
                showConfirmButton: false,
                timer: 1500
              }))
            setTimeout(function () {
              window.location.href = './index.html'
            }, 1000)
          },
        sortAccounts() {
            this.accounts.sort((a, b) => a.id - b.id)
        },
        sortCards() {
            this.cards.sort((a, b) => a.id - b.id)
        },
        selectCard(card) {
            this.oneCard = card
            return this.oneCard
        },
        selectAccount(account) {
            this.oneAccount = account
            return this.oneAccount
        },
        getDate() {
            this.thruDateArray = []
            let cuske = this.cards
            cuske.forEach(card => {
                this.thruDateArray.push(card.thruDate)
            })
            // console.log(this.thruDateArray);
        },
        compareDates(card) {
            this.dateOneCard = card.thruDate
            //today
            let time = new Date().getTime();
            // card
            let dateCard = new Date(this.dateOneCard).getTime();
            let difference = dateCard - time
            let toOvercome = 5270388157

            if (difference < toOvercome) {
                if (dateCard < time) {
                    return this.message = "Expired Card"
                } else {
                    return this.message = "Card about to expire"
                }
            }
            else {
                return this.message = "Valid Card"
            }
        },
        getExpiresDate(dateImput) {
            const date = new Date(dateImput)
            const dateYear = date.getFullYear()
            const getTwoDigits = dateYear.toString().substring(2)
            return (date.getMonth() + 1) + "/" + getTwoDigits
        },
        deleteCard(card) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You are about to delete a Card!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.oneCard = card.number
                    axios.post('/api/cards/delete', `cardNumber=${this.oneCard}`)
                        .catch(function (error) {
                            this.error = error.response.data
                        })
                        .then(
                            setTimeout(function () {
                                if (this.error == "Card does not exist" || this.error == "Card does not belong to authenticated client") {
                                    Swal.fire({
                                        title: "Error",
                                        text: `${this.error}`,
                                        icon: "error"
                                    })
                                    this.error = ""
                                } else {
                                    Swal.fire({
                                        title: "Delete card ",
                                        text: "Deleted card",
                                        icon: "success"
                                    })
                                    setTimeout(function () {
                                        location.reload()
                                    }, 1000)
                                }
                            }, 1000))
                }
            })
        },
        renewCard(card) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You are about to renew a card of the same type and color!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.oneCard = card.number
                    this.cardColor = card.color
                    this.cardType = card.type
                    axios.post('/api/cards/delete', `cardNumber=${this.oneCard}`)
                    axios.post('/api/clients/current/cards', `cardColor=${this.cardColor}&cardType=${this.cardType}`)
                        .catch(function (error) {
                            this.error = error.response.data
                        })
                        .then(
                            setTimeout(function () {
                                if (this.error == "Card does not exist" || this.error == "Card does not belong to authenticated client") {
                                    Swal.fire({
                                        title: "Error",
                                        text: `${this.error}`,
                                        icon: "error"
                                    })
                                    this.error = ""
                                } else {
                                    Swal.fire({
                                        title: "Renew card ",
                                        text: "Renewed card",
                                        icon: "success"
                                    })
                                    setTimeout(function () {
                                        location.reload()
                                    }, 1000)
                                }
                            }, 1000))
                }
            })
        },
        deleteAccount(account) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You are about to delete an Account!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.oneAccount = account.number
                    axios.post('/api/accounts/delete', `accountNumber=${this.oneAccount}`)
                        .catch(function (error) {
                            this.error = error.response.data
                        })
                        .then(
                            setTimeout(function () {
                                if (this.error == "Account has a positive balance, it cannot be deleted" || this.error == "The client has an active loan. Accounts cannot be deleted until they are paid in full" || this.error == "Account does not belong to authenticated client") {
                                    Swal.fire({
                                        title: "Error",
                                        text: `${this.error}`,
                                        icon: "error"
                                    })
                                    this.error = ""
                                } else {
                                    Swal.fire({
                                        title: "Account deleted",
                                        text: "Account deleted",
                                        icon: "success"
                                    })
                                    setTimeout(function () {
                                        location.reload()
                                    }, 1000)
                                }
                            }, 1000))
                }
            })
        }
    },
    computed: {
        showClientInformation(client) {
            this.client = {
                firstName: dataClient.firstName,
                lastName: dataClient.lastName,
                email: dataClient.email,
            }
            return console.log(client)
        },
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

    // Your code to run since DOM is loaded and ready
});

$(document).ready(function () {

    var s_round = '.s_round';

    $(s_round).hover(function () {
        $('.b_round').toggleClass('b_round_hover');
        return false;
    });

    $(s_round).click(function () {
        $('.flip_box').toggleClass('flipped');
        $(this).addClass('s_round_click');
        $('.s_arrow').toggleClass('s_arrow_rotate');
        $('.b_round').toggleClass('b_round_back_hover');
        return false;
    });

    $(s_round).on('transitionend', function () {
        $(this).removeClass('s_round_click');
        $(this).addClass('s_round_back');
        return false;
    });
});