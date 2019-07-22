// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for people
const Person = require('../models/person')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { person: { title: '', text: 'foo' } } -> { person: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /people
router.get('/people', requireToken, (req, res, next) => {
  Person.find()
    .then(people => {
      // `people` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return people.map(person => person.toObject())
    })
    // respond with status 200 and JSON of the people
    .then(people => res.status(200).json({ people: people }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /people/5a7db6c74d55bc51bdf39793
router.get('/people/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Person.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "person" JSON
    .then(person => res.status(200).json({ person: person.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /people
router.post('/people', requireToken, (req, res, next) => {
  // set owner of new person to be current user
  req.body.person.owner = req.user.id

  Person.create(req.body.person)
    // respond to succesful `create` with status 201 and JSON of new "person"
    .then(person => {
      res.status(201).json({ person: person.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /people/5a7db6c74d55bc51bdf39793
router.patch('/people/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.person.owner

  Person.findById(req.params.id)
    .then(handle404)
    .then(person => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, person)

      // pass the result of Mongoose's `.update` to the next `.then`
      return person.update(req.body.person)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /people/5a7db6c74d55bc51bdf39793
router.delete('/people/:id', requireToken, (req, res, next) => {
  Person.findById(req.params.id)
    .then(handle404)
    .then(person => {
      // throw an error if current user doesn't own `person`
      requireOwnership(req, person)
      // delete the person ONLY IF the above didn't throw
      person.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
