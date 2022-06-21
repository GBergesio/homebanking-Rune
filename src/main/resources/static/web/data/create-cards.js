const app = Vue.createApp({

    data() {
        return {
            message: 'Hello Vue!',
            saludo: "",
            dataClient: {},
            infoClient: "",
            accountsClient: [],
            cards: [],
            cardType: "",
            cardColor: "",

            creditIsHidden: true,
            debitIsHidden: true,


            allCreditCards: [],
            allDebitCards: [],
            initials: ""  
        }
    },
    created() {

        axios.get(`/api/clients/current`)
            .then(data => {
                this.dataClient = data.data
                this.accountsClient = data.data.accountDTO
                this.infoClient = data.data.firstName + " " + data.data.lastName
                this.cards = this.dataClient.cards
                // this.creditCard = this.cards.length
                console.log(this.cards);
                // console.log(this.creditCard);
                this.searchCards()
                console.log(this.allCreditCards.length);
                this.cutName()
            })
    },
    methods: {
        getExpiresDate(dateImput) {
            const date = new Date(dateImput)
            const dateYear = date.getFullYear()
            const getTwoDigits = dateYear.toString().substring(2)
            return (date.getMonth() + 1) + "/" + getTwoDigits
        },
        logout() {
            axios.post('/api/logout').then(response => console.log('signed out!!!'))
            setTimeout(function () {
                window.location.href = './index.html'
            }, 1000)
        },
        createCard() {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, create it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post('/api/clients/current/cards', `cardColor=${this.cardColor}&cardType=${this.cardType}`,
                    { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
                        .catch(function (error) {
                            this.error = error.response.data
                        })
                        .then(
                            setTimeout(function () {
                                if (this.error == "Forbidden, already has 3 Debit Cards" || this.error == "Forbidden, already has 3 Credit Cards") {
                                    Swal.fire({
                                        title: "Error",
                                        text: `${this.error}`,
                                        icon: "error"
                                    })
                                    this.error = ""
                                } else {
                                    Swal.fire({
                                        title: "Rune Card",
                                        text: "Card created",
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
        getExpiresDate(dateImput) {
            const date = new Date(dateImput)
            const dateYear = date.getFullYear() + 5
            const getTwoDigits = dateYear.toString().substring(2)
            return (date.getMonth() + 1) + "/" + getTwoDigits
        },
        searchCards() {
            let cuscus = this.cards
            this.allCreditCards = []
            this.allDebitCards = []
            cuscus.forEach(card => {
                if (card.type == 'CREDIT') {
                    this.allCreditCards.push(card.type)
                }
                else {
                    this.allDebitCards.push(card.type)
                }
            })
        },
        logout() {
            axios.post('/api/logout').then(response => console.log('signed out!!!'))
            setTimeout(function () {
                window.location.href = './index.html'
            }, 1000)
        },
        changeColor(color) {
            let container = document.querySelector("#colorCard")
            let containerBack = document.querySelector("#colorCardBack")
            console.log(this.cardColor);
            switch (color) {
                case "GOLD":
                    if (container.classList.contains('silver') && containerBack.classList.contains('silverBack') ) {
                        container.classList.remove('silver')
                        containerBack.classList.remove('silverBack')
                    }
                    if (container.classList.contains('titanium') && containerBack.classList.contains('titaniumBack')) {
                        container.classList.remove('titanium')
                        containerBack.classList.remove('titaniumBack')
                    }
                    container.classList.add('gold')
                    containerBack.classList.add('goldBack')
                    break;
                case "SILVER":
                    if (container.classList.contains('gold') && containerBack.classList.contains('goldBack')) {
                        container.classList.remove('gold')
                        containerBack.classList.remove('goldBack')
                    }
                    if (container.classList.contains('titanium') && containerBack.classList.contains('titaniumBack')) {
                        container.classList.remove('titanium')
                        containerBack.classList.remove('titaniumBack')
                    }
                    container.classList.add('silver')
                    containerBack.classList.add('silverBack')
                    break;
                case "TITANIUM":
                    if (container.classList.contains('gold') && containerBack.classList.contains('goldBack')) {
                        container.classList.remove('gold')
                        containerBack.classList.remove('goldBack')
                    }
                    if (container.classList.contains('silver') && containerBack.classList.contains('silverBack')) {
                        container.classList.remove('silver')
                        containerBack.classList.remove('silverBack')
                    }
                    container.classList.add('titanium')
                    containerBack.classList.add('titaniumBack')
                    break;
                default:
                    break;
            }
        },
        activePopOver(){
            const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
            const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
        },
        cutName(){
            let initialName = this.dataClient.firstName 
            let initialLastName = this.dataClient.lastName
            this.initials = initialName.charAt(0) + initialLastName.charAt(0)
          },
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