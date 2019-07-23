const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const iPhone = puppeteer.devices['iPhone 8']

const Budget = function () {
  this.url = 'https://www.budgettruck.com'
  this.priceObj = {
    budget: {}
  }
}

Budget.prototype.populateFormOnIndexPage = async function (pickUpLocation, dropOffLocation, date) {
  try {
    const browser = await puppeteer.launch({
      slowMo: 250
    })
    const page = await browser.newPage()
    await page.emulate(iPhone)
    await page.goto(this.url)
    await page.type('#txtPickupLocation', pickUpLocation)
    await page.type('#txtDropOffLocation', dropOffLocation)
    await page.select('#ddlPickupTimes', '10:00 AM')
    await page.addScriptTag({
      content: `$('#pickUpDate').val('${date}')`
    })
    await Promise.all([
      page.waitForSelector('#item1 > div.col-xs-12.col-sm-4.col-md-3.bt-price-module > div.strikethrough > div.st-info > div.price-size.st-orange > span:nth-child(1)', true),
      await page.click('#btnFindTruck')
    ])
    const html = await page.evaluate(() => document.body.innerHTML)
    const $ = await cheerio.load(html)
    this.priceObj.budget.twelveFootTruck = await $('#item1 > div.col-xs-12.col-sm-4.col-md-3.bt-price-module > div.strikethrough > div.st-info > div.price-size.st-orange > span:nth-child(1)').text()
    this.priceObj.budget.sixteenFootTruck = await $('#item2 > div.col-xs-12.col-sm-4.col-md-3.bt-price-module > div.strikethrough > div.st-info > div.price-size.st-orange > span:nth-child(1)').text()
    this.priceObj.budget.twentySixFootTruck = await $('#item3 > div.col-xs-12.col-sm-4.col-md-3.bt-price-module > div.strikethrough > div.st-info > div.price-size.st-orange > span:nth-child(1)').text()
    console.log(this.priceObj)
    browser.close()
  } catch (err) {
    console.error(err)
  }
}

// const blah = new Budget()
// blah.populateFormOnIndexPage()
module.exports = {
  Budget
}
