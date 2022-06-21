const app = Vue.createApp({

  data() {
    return {
      message: 'Hello Vue!',
      saludo: "",
      dataClient: {},
      infoClient: "",
      initials: "",
      accountsClient: [],
      accountsClient2: [],
      allTransactions: [],
      allDescriptionsTo: [],
      allDescriptionsFrom: [],
      idAccount: "",

      rootAccount: "",
      destinationAccount: "",
      amount: "",
      description: "",

      rootAccountOwn: "",
      destinationAccountOwn: "",
      amountOwn: "",
      descriptionOwn: "",

      errorMessage: "",
      errorMessageOwn: "",
      notification: false,
      notificationOwn: false,
      allBalances: []
    }
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlParamsDos = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    const idDos = urlParamsDos.get('id')

    this.loadAccounts()

    axios.get(`/api/clients/current`)
      .then(data => {
        this.dataClient = data.data
        this.accountsClient = this.dataClient.accountDTO
        this.infoClient = this.dataClient.firstName + " " + this.dataClient.lastName
        this.cutName()
        this.sortAccounts()
        this.searchTransactions()
        this.searchTransactionsDescription()
        this.seteoDescription()
        this.searchBalance()

        console.log(this.accountsClient);

      })
  },
  methods: {
    loadAccounts() {
      axios.get(`/api/clients/current/accounts`)
        .then(data => {
          this.accountsClient2 = data.data
          console.log(this.accountsClient2);
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
    cleanErrorMessage() {
      setTimeout(() => {
        this.errorMessage = ""
      }, 7000);
    },
    makeTransfer() {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, make transfer!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post('/api/transactions', `amount=${this.amount}&description=${this.description}&rootAccount=${this.rootAccount}&destinationAccount=${this.destinationAccount}`)
            .catch(function (error) {
              this.error = error.response.data
            })
            .then(
              setTimeout(function () {
                if (this.error == "Missing Data" || this.error == "Choose your Account" || this.error == "Choose your Account"
                  || this.error == "Choose destination account" || this.error == "Amount less than or equal to 0" || this.error == "Missing enter description"
                  || this.error == "You cannot transfer to the same account" || this.error == "Origin account does not exist" || this.error == "Destination account does not exist"
                  || this.error == "Your Account does not have enough balance"
                ) {
                  Swal.fire({
                    title: "Error",
                    text: `${this.error}`,
                    icon: "error"
                  })
                  this.error = ""
                } else {
                  Swal.fire({
                    title: "Transfer",
                    text: "Successful transfer",
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
    makeTransferOwn() {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, make transfer!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post('/api/transactions', `amount=${this.amountOwn}&description=${this.descriptionOwn}&rootAccount=${this.rootAccountOwn}&destinationAccount=${this.destinationAccountOwn}`)
            .catch(function (error) {
              this.error = error.response.data
            })
            .then(
              setTimeout(function () {
                if (this.error == "Missing Data" || this.error == "Choose your Account" || this.error == "Choose your Account"
                  || this.error == "Choose destination account" || this.error == "Amount less than or equal to 0" || this.error == "Missing enter description"
                  || this.error == "You cannot transfer to the same account" || this.error == "Origin account does not exist" || this.error == "Destination account does not exist"
                  || this.error == "Your Account does not have enough balance"
                ) {
                  Swal.fire({
                    title: "Error",
                    text: `${this.error}`,
                    icon: "error"
                  })
                  this.error = ""
                } else {
                  Swal.fire({
                    title: "Transfer",
                    text: "Successful transfer",
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
    makeTransferOwn2() {
      axios.post('/api/transactions', `amount=${this.amountOwn}&description=${this.descriptionOwn}&rootAccount=${this.rootAccountOwn}&destinationAccount=${this.destinationAccountOwn}`)
        .then(response =>
          setTimeout(function () {
            location.reload()
          }, 1000))
    },
    showModal() {
      var myModal = document.getElementById('myModal')
      var myInput = document.getElementById('myInput')
      myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus()
      })
    },
    sortAccounts() {
      this.accountsClient.sort((a, b) => a.id - b.id)
    },
    searchTransactions() {
      this.allTransactions = []
      this.accountsClient.forEach(account => {
        account.transactionDTO.forEach(transaction => {
          this.allTransactions.push(transaction)
        })
      })
    },
    searchBalance() {
      this.allBalances = []
      let cuski = this.accountsClient
      cuski.forEach(account => {
        this.allBalances.push(account.balance)
      })
      console.log(this.allBalances);
    },
    searchTransactionsDescription() {
      let descriptionVar = this.allTransactions
      this.allDescriptionsTo = []
      this.allDescriptionsFrom = []
      descriptionVar.forEach(transaction => {
        if (transaction.description.includes("transfer to")) {
          this.allDescriptionsTo.push(transaction.description)
        }
        if (transaction.description.includes("transfer from")) {
          this.allDescriptionsFrom.push(transaction.description)
        }
      })
    },
    seteoDescription() {
      const set1 = new Set(this.allDescriptionsTo)
      console.log(set1);
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

