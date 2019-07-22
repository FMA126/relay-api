const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const urls = {
  uhaul: 'https://www.uhaul.com',
  penske: 'https://www.pensketruckrental.com',
  budget: 'https://www.budgettruck.com'
}

const populateFormOnIndexPage = async (url) => {
  try {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(url)
    await page.type('#PickupLocation-TruckOnly', '80301')
    await page.type('#DropoffLocation-TruckOnly', '85718')
    await page.type('#PickupDate-TruckOnly', '09/02/2019')
    await page.click('#EquipmentSearch .button-confirm')
    const price = page.waitForSelector('#formProcessRequest_TM > div > dl > dd:nth-child(2) > div > b', true)
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
        priceObj.tenFootTruck = res('#formProcessRequest_TM > div > dl > dd:nth-child(2) > div > b').text().trim()
        priceObj.fifteenFootTruck = res('#formProcessRequest_DC > div > dl > dd:nth-child(2) > div > b').text().trim()
        priceObj.twentyFootTruck = res('#formProcessRequest_TT > div > dl > dd:nth-child(2) > div > b').text().trim()
        priceObj.twentySixFootTruck = res('#formProcessRequest_JH > div > dl > dd:nth-child(2) > div > b').text().trim()
        return priceObj
      })
      .then(console.log)
      .catch(console.error)
    const divsCounts = await page.$$eval('#formProcessRequest_TM > div > dl > dd:nth-child(2) > div > b', divs => divs.innerHTML)
  } catch (err) {
    console.error(err)
  }
  // await page.screenshot({path: 'example.png'});
  //
  // await browser.close();
}

module.exports = populateFormOnIndexPage
