const app = Vue.createApp({

  data() {
    return {
      message: 'Hello Vue!',
      saludo: "",
      dataClient: {},
      infoClient: "",
      accountsClient: [],
      initials: "",

      //Create Type Loan
      nameLoan: "",
      amountLoan: 0,
      interestLoan: 0,
      paymentsLoan: [6, 12, 18, 24, 36, 48, 72, 120],
      paymentLoan: []
    }
  },
  created() {
    this.loadData()
    this.loadAccounts()
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
    loadData() {
      axios.get(`/api/clients/current`)
        .then(data => {
          this.dataClient = data.data
          this.accountsClient = this.dataClient.accountDTO
          this.infoClient = data.data.firstName + " " + data.data.lastName
          this.cutName()
        })
    },
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
    createTypeLoan() {
      let newLoan = {
        name: this.nameLoan,
        maxAmount: this.amountLoan,
        payments: this.paymentLoan,
        interest: this.interestLoan,
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
          axios.post('/api/loans/createLoan', newLoan)
            .catch(function (error) {
              this.error = error.response.data
            })
            .then(
              setTimeout(function () {
                if (this.error == "Only admins can enter here" || this.error == "Loan already exists, enter another name" || this.error == "Missing Data") {
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
                    // location.reload()
                    
                  }, 1000)
                }
              }, 1000))
        }
      })
      console.log(newLoan);
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