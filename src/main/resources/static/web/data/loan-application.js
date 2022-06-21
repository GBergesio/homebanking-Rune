const app = Vue.createApp({

    data() {
        return {
            saludo: "",
            infoClient: "",
            initials: "",
            loans: [],
            accountsClient: [],
            accountsClient2: [],
            typeLoan: {},
            amountLoan: 0,
            destinationAccount: "",
            paymentsLoan: 0,
            payment: "",
            interest: 0,
            idLoan: 0,
            clientLoans: [],
            errorMessage: "",
            notification: false,
        }
    },
    created() {
        this.loadAccounts()
        axios.get(`/api/clients/current`)
            .then(data => {
                this.dataClient = data.data
                this.accountsClient = this.dataClient.accountDTO
                this.infoClient = data.data.firstName + " " + data.data.lastName
                this.cutName()
                this.loans = this.dataClient.loans
            })
        axios.get(`/api/loans`)
            .then(data => {
                this.loans = data.data
            })
    },
    methods: {
        loadAccounts() {
            axios.get(`/api/clients/current/accounts`)
                .then(data => {
                    this.accountsClient2 = data.data
                })
        },
        cutName() {
            let initialName = this.dataClient.firstName
            let initialLastName = this.dataClient.lastName
            this.initials = initialName.charAt(0) + initialLastName.charAt(0)
        },
        logout() {
            axios.post('/api/logout').then(response => console.log('signed out!!!'))
            setTimeout(function () {
                window.location.href = './index.html'
            }, 1000)
        },
        selectLoan(loan) {
            this.typeLoan = loan
            console.log(this.typeLoan)
            window.location.href = './loan-application.html#form'
            return this.typeLoan.name
        },
        cleanErrorMessage() {
            setTimeout(() => {
                this.errorMessage = ""
            }, 7000);
        },
        showToast() {
            $('#liveToast').toast('show');
        },
        requestLoan() {
            let applyForLoan = {
                loanID: this.idLoan,
                amount: this.amountLoan,
                payments: this.paymentsLoan,
                interest: this.interest,
                accountNumber: this.destinationAccount
            }
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                  axios.post('/api/loans', applyForLoan)
                    .catch(function (error) {
                      this.error = error.response.data
                    })
                    .then(
                      setTimeout(function () {
                        if (this.error == "Missing Data" || this.error == "Missing data Amount" || this.error == "Type of loan already taken" || this.error == "The type of loan does not exist" || this.error == "Exceeds the maximum allowed" || this.error == "Number of payments not allowed" || this.error == "The account to which you want to deposit does not exist" || this.error == "The account does not belong to the authenticated client") {
                          Swal.fire({
                            title: "Error",
                            text: `${this.error}`,
                            icon: "error"
                          })
                          this.error = ""
                        } else {
                          Swal.fire({
                            title: "New Loan",
                            text: "New Type Loan Created",
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
