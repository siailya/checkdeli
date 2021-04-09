import {CDUser, Check} from "./database/Models";

const express = require("express")
const history = require('connect-history-api-fallback')
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const staticFileMiddleware = express.static("../frontend/dist")
const APIv1 = "/api/v1"

mongoose.connect('mongodb+srv://root:z8V-MUx-8fJ-FAR@cluster0.uff8y.mongodb.net/checkdeli?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}
);

app.use(bodyParser.json())
app.use(staticFileMiddleware)
app.use(history({
    disableDotRule: true,
    verbose: true
}))
app.use(staticFileMiddleware)

app.get("/robots.txt", ((req, res) => {
    res.sendFile("../frontend/robots.txt")
}))

app.get("/sitemap.xml", ((req, res) => {
    res.sendFile("../frontend/sitemap.xml")
}))

app.post(APIv1 + "/login/vk", (async (req, res) => {
    let user = await CDUser.findOne({vkid: req.body.vkid})
    if (user) {
        res.send({status: "Successful login", uid: user._id})
    } else {
        CDUser.create(req.body).then(r => {
            res.send({status: "Successful register", uid: r._id})
        })
    }
}))

app.get(APIv1 + "/checks/get/:uid", (async (req, res) => {
    if (req.params.uid !== "undefined") {
        let user = await CDUser.findById(req.params.uid).populate("checks")
        if (user) {
            res.send({status: "OK", checks: user.checks})
        } else {
            res.send({status: "No such user"}).status(404)
        }
    } else {
        res.send({status: "No such user", checks: []}).status(404)
    }
}))

app.post(APIv1 + "/checks/create", ((req, res) => {
    let params = req.body
    params.user = req.headers["cduserid"]
    Check.create(params).then(async r => {
        let user = await CDUser.findById(params.user)
        user.checks.push(r._id)
        user.save()
        res.send({status: "Successfully created", cdid: r._id})
    })
}))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});