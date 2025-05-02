const { getTopics, postTopic } = require("../app/controllers/topics.controller")

const topicsRouter = require("express").Router()

topicsRouter.route("/")
.get(getTopics)
.post(postTopic)

module.exports = topicsRouter