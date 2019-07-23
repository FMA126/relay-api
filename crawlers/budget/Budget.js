const puppeteer = require('puppeteer');
const cheerio = require('cheerio')
const iPhone = puppeteer.devices['iPhone 8']

const populateFormOnIndexPage = async (url) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 250
    })
    const page = await browser.newPage()
    await page.emulate(iPhone)
    await page.goto(url)
    await page.type('#txtPickupLocation', '80301')
    await page.type('#txtDropOffLocation', '85718')
    await page.select('#ddlPickupTimes', '10:00 AM')
    // await page.click('#pickUpDate')
    // await page.$('#pickUpDate', (el) => el.value = '09/04/2019')
    await page.addScriptTag({
      content: "$('#pickUpDate').val('09/04/2019')"
    })
    await page.click('#btnFindTruck')
    // const loaded = page.waitForSelector('#datepicker-modal', true)
    //   .then(res => {
    //     console.log('------- modal is seen ---')
    //     page.click('#datepicker-modal div > div > div > div > div.ui-datepicker-group.ui-datepicker-group-middle > table > tbody td.date-2019-8-4')
    //     page.select('#pickUpDate', '09/04/2019')
    //     return res
    //   })
    //   .then(res => {
    //     setTimeout(() => page.click('#btnFindTruck'), 1000)
    //     return res
    //   })
    //   .catch(console.error)

    // await page.click('#ddlPickupTimes > option:nth-child(10)')
    // const optionLoaded = page.waitForSelector('#ddlPickupTimes > option', true)
    //   .then(res => {
    //     page.click('#ddlPickupTimes > option:nth-child(10)')
    //     return res
    //   })
    //   .catch(console.error)

    const storeLocationPickup = page.waitForSelector('#item1 > div.col-xs-12.col-sm-4.col-md-3.bt-price-module > div.strikethrough > div.st-info > div.price-size.st-orange > span:nth-child(1)', true)
      .then(res => {
        const html = page.evaluate(() => document.body.innerHTML)
        return html
      })
      .then(res => {
        const $ = cheerio.load(res)
        return $
      })
      .then(res => {
        const priceObj = {}
        priceObj.twelveFootTruck = res('#item1 > div.col-xs-12.col-sm-4.col-md-3.bt-price-module > div.strikethrough > div.st-info > div.price-size.st-orange > span:nth-child(1)').text()
        priceObj.sixteenFootTruck = res('#item2 > div.col-xs-12.col-sm-4.col-md-3.bt-price-module > div.strikethrough > div.st-info > div.price-size.st-orange > span:nth-child(1)').text()
        priceObj.twentySixFootTruck = res('#item3 > div.col-xs-12.col-sm-4.col-md-3.bt-price-module > div.strikethrough > div.st-info > div.price-size.st-orange > span:nth-child(1)').text()
        console.log(priceObj)
      })
      .catch(console.error)
  } catch (err) {
    console.error(err)
  }
}

populateFormOnIndexPage('https://www.budgettruck.com')
