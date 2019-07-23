const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const Penske = function () {
  this.url = 'https://www.pensketruckrental.com/quote/#/start.html'
  this.priceObj = {
    penske: {}
  }
}

Penske.prototype.populateFormOnIndexPage = async function () {
  try {
    const browser = await puppeteer.launch({
      headless: false
    })
    const page = await browser.newPage()
    await page.goto(this.url)
    await page.type('#pickup_location_txtbox', '80301')
    await page.type('#drop_location_txtbox', '85718')
    await page.type('#pickupdate', '09/02/2019')
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
    await page.screenshot({ path: './crawlers/penske/shot1.png' })
    await Promise.all([
      page.waitForSelector('#time', true)
    ])
    await Promise.all([
      browser.waitForTarget(target => target.url() === 'https://www.pensketruckrental.com/quote/#/drop-off-locations.html'),
      page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a')
    ])
    await page.screenshot({ path: './crawlers/penske/shot2.png' })
    await Promise.all([
      page.waitForSelector('#caurosal_Container > app-carousal:nth-child(1)', true)
      // page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a')
    ])
    await page.screenshot({ path: './crawlers/penske/shot3.png' })
    await Promise.all([
      // page.waitForSelector('#caurosal_Container > app-carousal:nth-child(1)', true),
      page.waitForSelector('#time', true),
      page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a')
    ])
    await page.screenshot({ path: './crawlers/penske/shot4.png' })
    await Promise.all([
      page.waitForSelector('#caurosal_Container > app-carousal.location-item.selected > div.location-item-bottom > a', true)
      // page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a')
    ])
    await Promise.all([
      browser.waitForTarget(target => target.url() === 'https://www.pensketruckrental.com/quote/#/contact.html'),
      page.click('#caurosal_Container > app-carousal.location-item.selected > div.location-item-bottom > a')
    ])
    await page.screenshot({ path: './crawlers/penske/shot5.png' })
    await Promise.all([
      page.waitForSelector('#container > section > div.column.left > div > form > div.button-container > div > button', true)
      // page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a')
    ])
    await page.screenshot({ path: './crawlers/penske/shot6.png' })
    await Promise.all([
      browser.waitForTarget(target => target.url() === 'https://www.pensketruckrental.com/quote/#/truck-rates.html'),
      page.click('#container > section > div.column.left > div > form > div.button-container > div > button')
      // page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a')
    ])
    await page.screenshot({ path: './crawlers/penske/shot7.png' })
    await Promise.all([
      page.waitForSelector('#caurosal_Container > div:nth-child(1) > div.info-top.height-affirm > span.price', false)
    ])
    await page.screenshot({ path: './crawlers/penske/shot8.png' })
    const html = await page.evaluate(() => document.body.innerHTML)
    const $ = await cheerio.load(html)
    this.priceObj.penske.twelveFootTruck = await $('#caurosal_Container > div:nth-child(1) span.price').text()
    this.priceObj.penske.sixteenFootTruck = await $('#caurosal_Container > div:nth-child(2) span.price').text()
    this.priceObj.penske.twentyTwoFootTruck = await $('#caurosal_Container > div:nth-child(3) span.price').text()
    this.priceObj.penske.twentySixFootTruck = await $('#caurosal_Container > div:nth-child(4) span.price').text()
    //
    // const selectDropoff = browser.waitForTarget(target => target.url() === 'https://www.pensketruckrental.com/quote/#/drop-off-locations.html')
    //   .then(res => {
    //     console.log('--------------drop off url heard------------')
    //     return res
    //   })
    //   .then(res => {
    //     const loaded = page.waitForSelector('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a', true)
    //       .then(res => {
    //         page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a')
    //         // page.click('#container > section > div.button-container > div > button')
    //         // setTimeout(() => page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a'), 500)
    //         return res
    //       })
    //       .then(res => {
    //         setTimeout(() => page.click('#caurosal_Container > app-carousal:nth-child(1) > div.location-item-bottom > a'), 1000)
    //         return res
    //       })
    //       .catch(console.error)
    //   })
    //   .catch(console.error)
    //
    // const contactFormPage = browser.waitForTarget(target => target.url() === 'https://www.pensketruckrental.com/quote/#/contact.html')
    //   .then(res => {
    //     setTimeout(() => page.click('#container > section > div.column.left > div > form > div.button-container > div > button'),1000)
    //     return res
    //   })
    //   .catch(console.error)
    //
    // const truckPrice = browser.waitForTarget(target => target.url() === 'https://www.pensketruckrental.com/quote/#/truck-rates.html')
    //   .then(res => {
    //     const loaded = page.waitForSelector('#caurosal_Container > div:nth-child(1) > div.info-top.height-affirm > span.price', false)
    //       .then(res => {
    //         console.log('--------------truck rates url heard------------')
    //         return res
    //       })
    //       .then(res => {
    //         const html = page.evaluate(() => document.body.innerHTML)
    //         return html
    //       })
    //       .then(res => {
    //         const $ = cheerio.load(res)
    //         return $
    //       })
    //       .then(res => {
    //         //   .then(console.log)
    //         //   .catch(console.error)
    //         // page.screenshot({ path: 'truckrates.png'})
    //         // console.log($)
    //         // console.log(html)
    //         // console.log($('#caurosal_Container > div:nth-child(1) span.price').innerText)
    //         this.priceObj.twelveFootTruck = res('#caurosal_Container > div:nth-child(1) span.price').text()
    //         this.priceObj.sixteenFootTruck = res('#caurosal_Container > div:nth-child(2) span.price').text()
    //         this.priceObj.twentyTwoFootTruck = res('#caurosal_Container > div:nth-child(3) span.price').text()
    //         this.priceObj.twentySixFootTruck = res('#caurosal_Container > div:nth-child(4) span.price').text()
    //         // console.log(this.priceObj)
    //       })
    //       .catch(console.error)
    //   })
    //   .catch(console.error)
    console.log(this.priceObj)
    browser.close()
  } catch (err) {
    console.error(err)
  }
}

const blah = new Penske()
blah.populateFormOnIndexPage()
// console.log(Penske.priceObj)
// Penske.priceObj
// module.exports = { Penske }
