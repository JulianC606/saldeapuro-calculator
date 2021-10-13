/**
 * Object returned by calculation function
 * @typedef {Object} CalculationResult
 * @property {Date} startDate - The X Coordinate
 * @property {Number} months - The Y Coordinate
 * @property {Date[]} dates
 * @property {Number} interests
 * @property {Number} total
 * @property {Number} paymentAmt
 * { startDate, months, dates, interests, total, paymentAmt }
 */

/**
 * Calculates the interests from a capital (Requested Loan Amount), monthly interest rate (in percentage, not decimals)
 * and the number of payments ()
 * @param {Number} capital The amount that the client requested.
 * @param {Number} rate Monthly interest Rate
 * @param {Number} payments Number of payments
 * @returns Interests amount
 */
const calInterests = (capital, rate, payments) => {
  return capital * (rate / 100) * payments
}

/**
 * Calculate the payment dates of a loan from the number of payments and the loan date. The start date will be the
 * next fortnight and will skip decembers
 * @param {Number} payments
 * @param {Date} startDate
 * @returns An Object with the exact amount of months and a list of payment dates of the loan.
 */
const calDates = (payments, startDate = new Date()) => {
  let dates

  dates = getDatesFromFortnights(payments, startDate)
  const totalPaymentsQty = fixDecembers(dates)

  dates = getDatesFromFortnights(totalPaymentsQty, startDate)
  const months = Math.ceil(dates.length / 2)

  return { dates, months }
}

/**
 * Returns the total amount of fortnights in an array of payment dates. In case, there is a payments in december,
 * adds 2 fortnights to the total amount, because there is no payments in december.
 * @param {Date[]} dates - An array of payment dates.
 * @returns {Number} Total amount of Fortnights
 */
const fixDecembers = (dates) => {
  const isDecember = dates.filter(date => date.getMonth() === 11).length > 0
  return isDecember ? dates.length + 2 : dates.length
}

/**
 * Returns the 15th of the next month.
 * @param {Date} date - Date to be modify
 * @returns {Date} Next month's 15th
 */
const nextMonthFirstFortnight = (date) => {
  date.setMonth(date.getMonth() + 1)
  date.setDate(15)
  return new Date(date.getTime())
}

/**
 * Returns the 28th of same month
 * @param {Date} date
 * @returns {Date} Current month's 28th
 */
const sameMonthLastFortnight = (date) => {
  date.setDate(28)
  return new Date(date.getTime())
}

/**
 * Returns the next payment date
 * @param {Date} date
 * @returns {Date} Next date
 */
const nextFortnight = (date) => {
  return date.getDate() <= 15
    ? sameMonthLastFortnight(date)
    : nextMonthFirstFortnight(date)
}

/**
 * returns a list of payments dates.
 * @param {Number} fortnights - amount of payments
 * @param {Date} startDate - start date
 * @returns {Date[]} Payment dates
 */
const getDatesFromFortnights = (fortnights, startDate) => {
  const dates = []
  const currentDate = new Date(startDate.getTime())

  for (let i = 0; i < fortnights; i++) {
    dates.push(nextFortnight(currentDate))
  }

  return dates
}

/**
 * Returns the results of a calculation.
 * @param {Number} payments
 * @param {Number} capital
 * @param {Date} startDate
 * @returns {CalculationResult}
 */
const calculate = (payments, capital, startDate) => {
  const { dates, months } = calDates(payments, startDate)
  let interests = calInterests(capital, 25, months)
  let total = parseFloat(interests) + parseFloat(capital)
  const paymentAmt = Math.ceil((parseFloat(total) / parseFloat(payments)) * 100) / 100
  total = paymentAmt * payments
  interests = total - capital

  return { startDate, months, dates, interests, total, paymentAmt }
}
