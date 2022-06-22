const app = Vue.createApp({

  data() {
    return {
      message: 'Hello Vue!',
      saludo: "",
      dataClient: {},
      infoClient: "",
      accountsClient: [],
      accountsClient2: [],
      loans: [],
      cards: [],
      balanceTotal: 0,
      accNumber: "",
      dataBalance: [],
      transactions: [],
      allDescriptions: [],
      allTransactions: [],
      allAmountsCredit: [],
      allAmountsDebit: [],
      // allTransactionsAmount: []     
      initials: "",
      userType: "",
      newbal: null
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
          this.cards = this.dataClient.cards
          this.loans = this.dataClient.loans
          this.userType = this.dataClient.userType
          this.showChart()
          this.sortAccounts()
          this.sortCards()
          this.sortTransactions()
          this.searchTransactions()
          this.allAmountsDebit
          this.searchTransactionsAmounts()
          this.searchTransactionsDescription()
          this.cutName()
          this.dataBalance = []
          let acc = this.accountsClient
          acc.forEach(accBal => {
            this.dataBalance.push(accBal.balance)
          })
          this.newbal = this.dataBalance.reduce((a, b) => a + b, 0)
        })
    },
    loadAccounts() {
      axios.get(`/api/clients/current/accounts`)
        .then(data => {
          this.accountsClient2 = data.data
        })
    },
    sortAccounts() {
      this.accountsClient.sort((a, b) => a.id - b.id)
    },
    sortCards() {
      this.cards.sort((a, b) => a.id - b.id)
    },
    copiarNumber(number) {
      navigator.clipboard.writeText(number)
    },
    getTransactionDate(dateImput) {
      const date = new Date(dateImput)
      return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    },
    searchTransactions() {
      this.allTransactions = []
      this.accountsClient.forEach(account => {
        account.transactionDTO.forEach(transaction => {
          this.allTransactions.push(transaction)
        })
      })
    },
    searchTransactionsDescription() {
      let descriptionVar = this.allTransactions
      this.allDescriptions = []
      descriptionVar.forEach(transaction => {
        this.allDescriptions.push(transaction.description)
      })
    },
    searchTransactionsAmounts() {
      let cuscus = this.allTransactions
      this.allAmountsCredit = []
      this.allAmountsDebit = []
      cuscus.forEach(transaction => {
        if (transaction.type == 'CREDIT') {
          this.allAmountsCredit.push(transaction.amount)
        }
        else {
          this.allAmountsDebit.push(transaction.amount)
        }
      })
    },
    sortTransactions() {
      this.allTransactions.sort((a, b) => b.id - a.id)
    },
    sumaCredit() {
      let sumaCredit = 0
      this.allAmountsCredit.forEach(amountCredit => {
        sumaCredit += amountCredit
      })
      return sumaCredit
    },
    sumaDebit() {
      let sumaDebit = 0
      this.allAmountsDebit.forEach(amountDebit => {
        sumaDebit += amountDebit
      })
      return sumaDebit
    },
    createAccount() {
      const inputOptions = new Promise((resolve) => {
        resolve({
          'SAVINGS': 'Savings Account',
          'CURRENT': 'Current Account',
        })
      })
      const { value: typeAccount } = Swal.fire({
        title: 'Select Type Account',
        input: 'radio',
        inputOptions: inputOptions,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to choose something!'
          }
        }
      })
        .then((result) => {
          if (result.isConfirmed) {
            axios.post(`/api/clients/current/accounts`, `accountType=${result.value}`)
              .catch(function (error) {
                this.error = error.response.data
                // console.log(this.error);
              })
              .then(response => {
                if (this.error == "Forbidden, already has 3 accounts") {
                  Swal.fire({
                    title: "Error",
                    text: `${this.error}`,
                    icon: "error"
                  })
                  this.error = ""
                } else {
                  Swal.fire({
                    title: "Create Account",
                    text: "Account Created",
                    icon: "success"
                  })
                  setTimeout(function () {
                    location.reload()
                  }, 1000)
                }
              })
          }
        })
    },
    cutName() {
      let initialName = this.dataClient.firstName
      let initialLastName = this.dataClient.lastName
      this.initials = initialName.charAt(0) + initialLastName.charAt(0)
    },
    showChart() {
      var root = am5.Root.new("chartdiv");
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
      var chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          startAngle: 160, endAngle: 380
        })
      );
      var series0 = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "account",
          categoryField: "balance",
          startAngle: 160,
          endAngle: 380,
          radius: am5.percent(70),
          innerRadius: am5.percent(65),
        })
      );
      var series1 = chart.series.push(
        am5percent.PieSeries.new(root, {
          startAngle: 160,
          endAngle: 380,
          valueField: "balance",
          innerRadius: am5.percent(80),
          categoryField: "account"
        })
      );
      series1.ticks.template.set("forceHidden", true);
      series1.labels.template.set("forceHidden", true);
      var label = chart.seriesContainer.children.push(
        am5.Label.new(root, {
          textAlign: "center",
          centerY: am5.p100,
          centerX: am5.p50,
          text: `[fontSize:18px]Total[/]:\n[bold fontSize:30px]$${this.accountsClient.map(account => account.balance).reduce((a, b) => a + b, 0)}[/]`
        })
      );
      var data = [
      ];
      this.accountsClient.forEach(account => {
        let item = {};
        item = {
          account: account.number,
          balance: account.balance
        }
        data.push(item)
      })
      // series0.data.setAll(data);
      series1.data.setAll(data);
    },
    // logout() {
    //   axios.post('/api/logout').then(response => console.log('Thanks for use Rune Bank'))
    //   setTimeout(function () {
    //     window.location.href = './index.html'
    //   }, 1000)
    // }

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
    }











  },
  computed: {
    showClientInformation(client) {
      this.client = {
        firstName: dataClient.firstName,
        lastName: dataClient.lastName,
        email: dataClient.email,
      }
      // return console.log(client)
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