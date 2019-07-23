const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const Uhaul = function () {
  this.url = 'https://www.uhaul.com'
  this.priceObj = {}
}

Uhaul.prototype.populateFormOnIndexPage = async function () {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100
    })
    const page = await browser.newPage()
    await page.goto(this.url)
    await page.type('#PickupLocation-TruckOnly', '80301')
    await page.type('#DropoffLocation-TruckOnly', '85718')
    await page.type('#PickupDate-TruckOnly', '09/02/2019')
    // await page.click('#EquipmentSearch .button-confirm')
    // await page.waitForNavigation()
    const [response] = await Promise.all([
      page.waitForNavigation(), // The promise resolves after navigation has finished
      page.click('#EquipmentSearch .button-confirm')
      // Clicking the link will indirectly cause a navigation
    ])
    const html = await page.evaluate(() => document.body.innerHTML)
    const $ = await cheerio.load(html)
    this.priceObj.tenFootTruck = await $('#formProcessRequest_TM > div > dl > dd:nth-child(2) > div > b').text().trim()
    this.priceObj.fifteenFootTruck = await $('#formProcessRequest_DC > div > dl > dd:nth-child(2) > div > b').text().trim()
    this.priceObj.twentyFootTruck = await $('#formProcessRequest_TT > div > dl > dd:nth-child(2) > div > b').text().trim()
    this.priceObj.twentySixFootTruck = await $('#formProcessRequest_JH > div > dl > dd:nth-child(2) > div > b').text().trim()
    browser.close()
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  Uhaul
}
