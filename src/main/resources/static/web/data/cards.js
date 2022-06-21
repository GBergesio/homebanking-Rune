const app = Vue.createApp({

    data() {
        return {
            message: 'Hello Vue!',
            saludo: "",
            dataClient: {},
            infoClient: "",
            accountsClient: [],
            cards: [],
            initials: "",
            thruDateArray: [],
            message: "",
            notification: false,
        }
    },
    created() {
        axios.get(`http://localhost:8080/api/clients/current`)
            .then(data => {
                this.dataClient = data.data
                this.accountsClient = data.data.accountDTO
                this.infoClient = data.data.firstName + " " + data.data.lastName
                this.cards = this.dataClient.cards
                this.cutName()
                this.thruDate = this.cards.filter(card => card.id)
                this.getDate()
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
        logout() {
            axios.post('/api/logout').then(response => console.log('signed out!!!'))
            setTimeout(function () {
                window.location.href = './index.html'
            }, 1000)
        },
        cutName() {
            let initialName = this.dataClient.firstName
            let initialLastName = this.dataClient.lastName
            this.initials = initialName.charAt(0) + initialLastName.charAt(0)
        },
        selectCard(card) {
            this.oneCard = card
            console.log(this.oneCard)
            return this.oneCard
        },
        getDate() {
            this.thruDateArray = []
            let cuske = this.cards
            cuske.forEach(card => {
                this.thruDateArray.push(card.thruDate)
            })
        },
        compareDates(card) {
            //today
            let time = new Date().getTime();
            // card
            let dateCard = new Date(card).getTime();

            let difference = dateCard - time

            let toOvercome = 5270388157

            if (difference < toOvercome) {
                if (dateCard < time) {
                    this.message = "Expired Card"
                } else {
                    this.message = "Card about to expire"
                }
            }
            else {
                this.message = "Valid Card"
            }
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







