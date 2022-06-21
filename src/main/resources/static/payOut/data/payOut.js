const app = Vue.createApp({

  data() {
    return {
      message: 'Hello Vue!',
      cardNumber: 0,
      cvv: 0,
      amount: 0,
      description: "",
      cardHolder: "",
    }
  },
  created() {
  },
  methods: {
    makePayment(){
      let newPayment = {
        cardNumber: this.cardNumber,
        cvv: this.cvv,
        description: this.description,
        amount: this.amount,
      }
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, make transaction!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post('/api/transactions/posnet', newPayment)
            .catch(function (error) {
              this.error = error.response.data
            })
            .then(
              setTimeout(function () {
                if (this.error == "This Account does not have enough balance" || this.error == "Invalid Cardholder" || this.error == "empty card number field" || this.error == "You cannot send a negative amount" || this.error == "Invalid CVV" || this.error == "Empty description" || this.error == "The card is expired") {
                  Swal.fire({
                    title: "Error",
                    text: `${this.error}`,
                    icon: "error"
                  })
                  this.error = ""
                } else {
                  Swal.fire({
                    title: "Rune Pay",
                    text: "Succesful transaction",
                    icon: "success"
                  })
                  setTimeout(function () {
                    // location.reload()
                  }, 1000)
                }
              }, 1000))
        }
      })
    }
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

// $("input[name='expiry-data']").mask("00 / 00");
