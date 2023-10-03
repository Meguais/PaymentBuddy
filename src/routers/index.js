const router = require("express").Router()
const APIError = require("../utils/errors")
const Response = require("../utils/response")
const payment = require("./payment.routers")
const webhook = require("./webhook.routers")

router.use(payment)
router.use(webhook)

module.exports = router