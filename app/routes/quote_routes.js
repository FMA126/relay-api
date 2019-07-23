// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for quotes
const Quote = require('../models/quote')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { quote: { title: '', text: 'foo' } } -> { quote: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// require crawlers
const crawler = require('../../crawlers/uhaul/Uhaul')
const Uhaul = crawler.Uhaul
const crawlerPenske = require('../../crawlers/penske/Penske')
const Penske = crawlerPenske.Penske
const crawlerBudget = require('../../crawlers/budget/Budget')
const Budget = crawlerBudget.Budget

// Crawler
router.post('/quotes', requireToken, (req, res, next) => {
  // set owner of new quote to be current user
  req.body.quote.owner = req.user.id
  let databaseObj = {}
  databaseObj = req.body.quote
  let prices = []
  const runCrawlers = () => {
    const UhaulCrawler = new Uhaul()
    const PenskeCrawler = new Penske()
    const BudgetCrawler = new Budget()
    const {pickUpLocation, dropOffLocation, pickUpDate} = req.body.quote

    UhaulCrawler.populateFormOnIndexPage(pickUpLocation, dropOffLocation, pickUpDate)
      .then(res => {
        prices.push(UhaulCrawler.priceObj)
        return res
      })
      .catch(console.error)
    PenskeCrawler.populateFormOnIndexPage(pickUpLocation, dropOffLocation, pickUpDate)
      .then(res => {
        // const tester = Object.assign(prices, PenskeCrawler.priceObj)
        prices.push(PenskeCrawler.priceObj)
        return res
      })
      .then(res => {
        databaseObj.prices = prices
        console.log(databaseObj)
        return res
      })
      .then(response => {
        Quote.create(databaseObj)
        // respond to succesful `create` with status 201 and JSON of new "quote"
          .then(quote => {
            res.status(201).json({ quote: quote.toObject() })
          })
          .catch(next)
      })
      .catch(console.error)
    BudgetCrawler.populateFormOnIndexPage(pickUpLocation, dropOffLocation, pickUpDate)
      .then(res => {
        // const tester = Object.assign(prices, PenskeCrawler.priceObj)
        prices.push(BudgetCrawler.priceObj)
        return res
      })
      .catch(console.error)
  }
  const finalPrices = async function () {
    try {
      await runCrawlers()
    } catch (err) {
      console.error(err)
    }
  }
  //   finally {
  //     Quote.create(databaseObj)
  //     // respond to succesful `create` with status 201 and JSON of new "quote"
  //       .then(quote => {
  //         res.status(201).json({ quote: quote.toObject() })
  //       })
  //     // if an error occurs, pass it off to our error handler
  //     // the error handler needs the error message and the `res` object so that it
  //     // can send an error message back to the client
  //       .catch(next)
  //   }
  // }
  finalPrices()
})

// INDEX
// GET /quotes
router.get('/quotes', requireToken, (req, res, next) => {
  Quote.find()
    .then(quotes => {
      // `quotes` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return quotes.map(quote => quote.toObject())
    })
    // respond with status 200 and JSON of the quotes
    .then(quotes => res.status(200).json({ quotes: quotes }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /quotes/5a7db6c74d55bc51bdf39793
router.get('/quotes/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Quote.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "quote" JSON
    .then(quote => res.status(200).json({ quote: quote.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// // CREATE
// // POST /quotes
// router.post('/quotes', requireToken, (req, res, next) => {
//   // set owner of new quote to be current user
//   req.body.quote.owner = req.user.id
//
//   Quote.create(req.body.quote)
//     // respond to succesful `create` with status 201 and JSON of new "quote"
//     .then(quote => {
//       res.status(201).json({ quote: quote.toObject() })
//     })
//     // if an error occurs, pass it off to our error handler
//     // the error handler needs the error message and the `res` object so that it
//     // can send an error message back to the client
//     .catch(next)
// })

// CREATE
// POST start crawler
// router.post('/quotes/crawl', requireToken, (req, res, next) => {
//   // set owner of new quote to be current user
//   req.body.quote.owner = req.user.id
//
//   const crawl = async () => {
//     try {
//       let results
//       results = uhaul.populateFormOnIndexPage('https://www.uhaul.com')
//       Quote.create(req.body.quote)
//       // respond to succesful `create` with status 201 and JSON of new "quote"
//         .then(quote => {
//           res.status(201).json({ quote: quote.toObject() })
//         })
//       // if an error occurs, pass it off to our error handler
//       // the error handler needs the error message and the `res` object so that it
//       // can send an error message back to the client
//         .catch(next)
//     } catch (err) {
//       console.error(err)
//     }
//   }
// })

// UPDATE
// PATCH /quotes/5a7db6c74d55bc51bdf39793
router.patch('/quotes/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.quote.owner

  Quote.findById(req.params.id)
    .then(handle404)
    .then(quote => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, quote)

      // pass the result of Mongoose's `.update` to the next `.then`
      return quote.update(req.body.quote)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /quotes/5a7db6c74d55bc51bdf39793
router.delete('/quotes/:id', requireToken, (req, res, next) => {
  Quote.findById(req.params.id)
    .then(handle404)
    .then(quote => {
      // throw an error if current user doesn't own `quote`
      requireOwnership(req, quote)
      // delete the quote ONLY IF the above didn't throw
      quote.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
