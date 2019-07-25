const axios = require('axios')
const cheerio = require('cheerio')

const requester = async function () {
  try {
    const getData = await axios({
      method: 'POST',
      url: 'https://www.uhaul.com/Misc/EquipmentSearch/?Area=&scenario=TruckOnly&isActionForm=False&isAlternateLayout=False&isTowMycar=True',
      data: {
        Scenario: 'TruckOnly',
        IsActionFrom: 'False',
        PickupLocation: '80301',
        DropoffLocation: '85718',
        PickupDate: '9/1/2019',
        View: '~/Views/Home/_EquipmentSearchForm.cshtml'
      }
    })
    const response = await console.log(getData.headers)

    // const response = await function () {
    //   console.log(getData)
    //   return getData.headers
    // }
    const html = await axios({
      method: 'GET',
      url: `https://www.uhaul.com/Reservations/RatesTrucks/`,
      headers: {}
    })
    // const check = await console.log(html.data)
    // const $ = await cheerio.load(html.data)
    // const whatsInside = await $('#mainRow > div > div > div > div > h1').text()
    // const check = await console.log(whatsInside)
  } catch (err) {
    console.error(err)
  }
}

requester()
