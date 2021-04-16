import {CDUser, Check} from "./database/Models";
import axios from "axios";
import {API} from 'vk-io';

require("babel-core/register");
require("babel-polyfill");

const APIv1 = "/api/v1"
const port = 3000;
const secret = "CheckDeliSecretKeyJ9Ntt!J6V(FJbTc"

const express = require("express")
const mongoose = require("mongoose");
const history = require('connect-history-api-fallback')
const staticFileMiddleware = express.static("../frontend/dist")

const api = new API({
    token: "025cfd38025cfd38025cfd389d022beece0025c025cfd386201011549fd98d272cda721"
});

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const jwt = require('jsonwebtoken');

const app = express();

function verifyJWT (req, res, next) {
    let token = req.cookies.jwt
    try {
        jwt.verify(token, secret)
        next()
    } catch (e) {
        res.status(403).send("JWT verify failed: " + e.message)
    }
}

mongoose.connect('mongodb+srv://root:z8V-MUx-8fJ-FAR@cluster0.uff8y.mongodb.net/checkdeli?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}
);

app.use(bodyParser.json())
app.use(cookieParser())
app.use(staticFileMiddleware)

app.use(history({
    disableDotRule: true,
    verbose: true,
    rewrites: [
        {from: "/404", to: "/404"}
    ]
}))
app.use(staticFileMiddleware)


app.get("/404", ((req, res) => {
    res.status(404).sendFile(__dirname.slice(0, -12) + "/frontend/dist/index.html")
}))

app.get("/robots.txt", ((req, res) => {
    res.sendFile("../frontend/robots.txt")
}))

app.get("/sitemap.xml", ((req, res) => {
    res.sendFile("../frontend/sitemap.xml")
}))

app.post(APIv1 + "/checkaccount", async (req, res) => {
    let user = await CDUser.findOne({email: req.body.email})
    if (user) {
        res.send("1")
    } else {
        res.send("0")
    }
})

app.post(APIv1 + "/register/native", (req, res) => {
    CDUser.create(req.body).then(r => {
        r.setPassword(req.body.password)
        r.save()

        let user = JSON.parse(JSON.stringify(r))
        delete user.salt
        delete user.hash

        let token = jwt.sign({user: user}, secret, {expiresIn: "3h"})
        res.cookie("auth", "native",
            {maxAge: 60 * 60 * 60 * 24 * 7})
            .cookie("jwt", token,
                {
                maxAge: 60 * 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict"
            }).send({status: "User created!", token})
    })
})

app.post(APIv1 + "/login/native", (req, res) => {
    CDUser.findOne({email: req.body.email}).then(r => {
        if (r.validPassword(req.body.password)) {

            let user = JSON.parse(JSON.stringify(r))
            delete user.salt
            delete user.hash

            let token = jwt.sign({user: user}, secret, {expiresIn: "3h"})
            res.cookie("auth", "native",
                {maxAge: 60 * 60 * 60 * 24 * 7})
                .cookie("jwt", token,
                {
                maxAge: 60 * 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict"
            }).send({status: "User login successful!", token})
        } else {
            res.send("User login failed!")
        }
    })
})

app.post(APIv1 + "/login/vk", (async (req, res) => {
    try {
        let vkdata = (await axios.get(`https://oauth.vk.com/access_token?client_id=7803894&client_secret=6ZJhfvtISJCdMOzwerTX&redirect_uri=http://localhost:3000/vk&code=${req.body.code}`)).data
        let vkid = vkdata.user_id
        let user = await CDUser.findOne({vkid: vkid}, {__v: 0, checks: 0})

        if (user) {
            let token = jwt.sign({user: user}, secret, {expiresIn: "3d"});
            res.cookie("auth", "vk",
                {maxAge: 60 * 60 * 60 * 24 * 7})
                .cookie("jwt", token,
                    {
                maxAge: 60 * 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict"
            }).send({status: "Successful login", token})
        } else {
            let vk_user = (await api.call("users.get", {"user_ids": vkid, "lang": "ru", "fields": ["photo_200"]}))[0]
            req.body.type = "vk"
            req.body.vkid = vkid
            req.body.name = vk_user.first_name
            req.body.surname = vk_user.last_name
            req.body.avatar = vk_user.photo_200

            CDUser.create(req.body).then(async r => {
                let token = jwt.sign({user: r}, secret, {expiresIn: "3d"});
                res.cookie("auth", "vk", {maxAge: 60 * 60 * 60 * 24 * 7}).cookie("jwt", token, {
                    maxAge: 60 * 60 * 60 * 24 * 7,
                    httpOnly: true,
                    sameSite: "strict"
                }).send({status: "Successful register", token})
            })
        }
    } catch (e) {
        res.status(500).send({status: "Failed to login", error: e.message})
    }
}))

app.get(APIv1 + "/relogin", ((req, res) => {
    let v_token = req.cookies.jwt

    try {
        let data = jwt.verify(v_token, secret)
        let token = jwt.sign({user: data.user}, secret, {expiresIn: "3d"});
        res.cookie("auth", "vk", {maxAge: 60 * 60 * 60 * 24 * 7}).cookie("jwt", token, {
            maxAge: 60 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: "strict"
        }).send({status: "Successful relogin", token})
    } catch (e) {
        res.status(401).send({status: "Verification failed", error: e.message})
    }
}))

app.get(APIv1 + "/checks/get/:uid", verifyJWT, (async (req, res) => {
    if (req.params.uid !== "undefined") {
        let user = await CDUser.findById(req.params.uid).populate("checks")

        if (user) {
            res.send({
                status: "OK", checks: user.checks.map((check) => {
                    return {_id: check._id, title: check.title, date: check.date}
                })
            })
        } else {
            res.send({status: "No such user"}).status(404)
        }
    } else {
        res.send({status: "No such user", checks: []}).status(404)
    }
}))

app.get(APIv1 + "/logout", (req, res) => {
    res.cookie("auth", "none").cookie("jwt", "", {httpOnly: true, sameSite: "strict"}).send({status: "Logout success"})
})

app.post(APIv1 + "/checks/create", verifyJWT, ((req, res) => {
    let params = req.body
    params.user = jwt.decode(req.cookies.jwt).user._id

    console.log(params)

    Check.create(params).then(async r => {
        let user = await CDUser.findById(params.user)
        user.checks.push(r._id)
        user.save()
        res.send({status: "Successfully created", cdid: r._id})
    })
}))

app.get(APIv1 + "/checks/edit/:cdid", verifyJWT, (async (req, res) => {
    res.send(await Check.findById(req.params.cdid))
}))

app.post(APIv1 + "/checks/update", verifyJWT, (async (req, res) => {
    try {
        let check_data = req.body
        let check = await Check.findById(check_data.cd.cdid)

        check.defaultPayed = check_data.cd.defaultPayed
        check.products = check_data.cd.products
        check.users = check_data.users
        check.save()

        res.send({status: "Updated"})
    } catch (e) {
        res.status(501).send({status: "Failed to update"})

    }
}))

app.get(APIv1 + "/checks/getbyid/:cdid", (async (req, res) => {
    let check = await Check.findById(req.params.cdid).populate("user")
    res.send(check)
}))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});