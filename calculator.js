const monthsRadios = document.querySelectorAll('input[name="calculator[payments]"]')
const requestedAmt = document.querySelector('input[name="calculator[requestedAmt]"]')

/**
 * FRONTEND METHODS
 */

const attatchEvent = (el, eventName, callback) => {
  return el.addEventListener(eventName, callback)
}

const attatchEventToList = (list, eventName, cb) => {
  return list.forEach(el => attatchEvent(el, eventName, cb))
}

const displayCurrency = (amount) => `B/. ${parseFloat(amount).toFixed(2)}`

const printValues = (payments, capital) => {
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const datesTable = document.querySelector('.dates')
  const startDate = new Date()

  const { dates, interests, total, paymentAmt } = calculate(payments, capital, startDate)

  let paymentNum = 0
  document.querySelector('.interests').innerText = displayCurrency(interests)
  document.querySelector('.totalLoanAmt').innerText = displayCurrency(total)

  datesTable.innerHTML = ''

  for (const date of dates) {
    if (date.getMonth() === 11) { continue }

    paymentNum++

    const idxCell = document.createElement('td')
    const dateCell = document.createElement('td')
    const amountCell = document.createElement('td')
    const row = document.createElement('tr')

    dateCell.innerText = date.toLocaleDateString('es-PA', dateOptions)
    amountCell.innerText = displayCurrency(paymentAmt)
    idxCell.innerText = paymentNum

    row.appendChild(idxCell)
    row.appendChild(dateCell)
    row.appendChild(amountCell)

    datesTable.appendChild(row)
  }
}

const cleanRadios = () => monthsRadios.forEach(radio => radio.parentElement.classList.remove('active'))

const handleOnCheckRadios = function (e) {
  if (this.checked) {
    cleanRadios()
    this.parentNode.classList.add('active')
  }
  const payments = getPayments()
  const capital = requestedAmt.value
  return printValues(payments, capital)
}

const getPayments = () => {
  return Array.from(monthsRadios).filter(radio => radio.checked)[0].value
}

const handleOnInputRequestedAmt = function () {
  document.querySelectorAll('.requestedAmt').forEach(el => { el.innerText = displayCurrency(this.value) })
  const payments = getPayments()
  printValues(payments, this.value)
}
/**
 * Runtime
 */
document.addEventListener('DOMContentLoaded', () => {
  attatchEventToList(monthsRadios, 'change', handleOnCheckRadios)
  requestedAmt.addEventListener('input', handleOnInputRequestedAmt)
})
