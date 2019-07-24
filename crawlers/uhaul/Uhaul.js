const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const Uhaul = function () {
  this.url = 'https://www.uhaul.com'
  this.priceObj = {
    uhaul: {}
  }
}

Uhaul.prototype.populateFormOnIndexPage = async function (pickUpLocation, dropOffLocation, date) {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 100
    })
    const page = await browser.newPage()
    await page.goto(this.url)
    await page.type('#PickupLocation-TruckOnly', pickUpLocation)
    await page.type('#DropoffLocation-TruckOnly', dropOffLocation)
    await page.type('#PickupDate-TruckOnly', date)
    // await page.click('#EquipmentSearch .button-confirm')
    // await page.waitForNavigation()
    await Promise.all([
      page.waitForNavigation(), // The promise resolves after navigation has finished
      page.click('#EquipmentSearch .button-confirm')
      // Clicking the link will indirectly cause a navigation
    ])
    const html = await page.evaluate(() => document.body.innerHTML)
    const $ = await cheerio.load(html)
    this.priceObj.uhaul.tenFootTruck = await $('#formProcessRequest_TM > div > dl > dd:nth-child(2) > div > b').text().trim()
    this.priceObj.uhaul.fifteenFootTruck = await $('#formProcessRequest_DC > div > dl > dd:nth-child(2) > div > b').text().trim()
    this.priceObj.uhaul.twentyFootTruck = await $('#formProcessRequest_TT > div > dl > dd:nth-child(2) > div > b').text().trim()
    this.priceObj.uhaul.twentySixFootTruck = await $('#formProcessRequest_JH > div > dl > dd:nth-child(2) > div > b').text().trim()
    console.log(this.priceObj)
    browser.close()
  } catch (err) {
    console.error(err)
  }
}

// const blah = new Uhaul()
// blah.populateFormOnIndexPage()
module.exports = {
  Uhaul
}
