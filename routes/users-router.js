const { getUsers, getUserByUsername } = require("../app/controllers/users.controller")

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)

usersRouter.get("/:username", getUserByUsername)

module.exports = usersRouter