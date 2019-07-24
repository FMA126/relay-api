const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const Penske = function () {
  this.url = 'https://www.pensketruckrental.com/quote/#/start.html'
  this.priceObj = {
    penske: {}
  }
}

Penske.prototype.populateFormOnIndexPage = async function (pickUpLocation, dropOffLocation, date) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 250
    })
    const page = await browser.newPage()
    await page.goto(this.url)
    await page.type('#pickup_location_txtbox', pickUpLocation)
    await page.type('#drop_location_txtbox', dropOffLocation)
    await page.type('#pickupdate', date)
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0'
      }),
      page.click('#container > section > form > div.button-container > div > button')
    ])
    await Promise.all([
      page.waitForSelector('#time', true),
      page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a')
    ])
    await Promise.all([
      page.waitForSelector('#time', true)
    ])
    await Promise.all([
      browser.waitForTarget(target => target.url() === 'https://www.pensketruckrental.com/quote/#/drop-off-locations.html'),
      page.click('#caurosal_Container > app-carousal.location-item.selected > div.location-item-bottom > a')
    ])
    await Promise.all([
      page.waitForSelector('#caurosal_Container > app-carousal:nth-child(1)', true)
    ])
    await Promise.all([
      page.waitForSelector('#time', true),
      page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a')
    ])
    await Promise.all([
      page.waitForSelector('#caurosal_Container > app-carousal.location-item.selected > div.location-item-bottom > a', true)
    ])
    await Promise.all([
      browser.waitForTarget(target => target.url() === 'https://www.pensketruckrental.com/quote/#/contact.html'),
      page.click('#caurosal_Container > app-carousal.location-item.selected > div.location-item-bottom > a')
    ])
    await Promise.all([
      page.waitForSelector('#container > section > div.column.left > div > form > div.button-container > div > button', true)
    ])
    await Promise.all([
      browser.waitForTarget(target => target.url() === 'https://www.pensketruckrental.com/quote/#/truck-rates.html'),
      page.click('#container > section > div.column.left > div > form > div.button-container > div > button')
    ])
    // await Promise.all([
    //   page.waitForSelector('#caurosal_Container > div:nth-child(1)', true)
    // ])
    await Promise.all([
      page.waitForSelector('#caurosal_Container > div:nth-child(1) span.price', true)
    ])
    const html = await page.evaluate(() => document.body.innerHTML)
    const $ = await cheerio.load(html)
    this.priceObj.penske.twelveFootTruck = await $('#caurosal_Container > div:nth-child(1) span.price').text()
    this.priceObj.penske.sixteenFootTruck = await $('#caurosal_Container > div:nth-child(2) span.price').text()
    this.priceObj.penske.twentyTwoFootTruck = await $('#caurosal_Container > div:nth-child(3) span.price').text()
    this.priceObj.penske.twentySixFootTruck = await $('#caurosal_Container > div:nth-child(4) span.price').text()
    console.log(this.priceObj)
    browser.close()
  } catch (err) {
    console.error(err)
  }
}

// const blah = new Penske()
// blah.populateFormOnIndexPage()
// console.log(Penske.priceObj)
// Penske.priceObj
module.exports = { Penske }
