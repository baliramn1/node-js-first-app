// express
import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt" //for not saving password as it is on the database or encoding the password while storing on the database

// in express we write app which means server.


mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
})
.then(() => console.log("database connected"))
.catch(e => console.log(e))


//defining the structure of data before registerPage
// const messageSchema = new mongoose.Schema({
//     name: String,
//     email: String,
// })

// creating a collection by the name Message and also passing the structure that defines in which format the data will be stored
// const message = mongoose.model("Message", messageSchema)

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const user = mongoose.model("user", userSchema)

const app = express()

// middlewares
app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.set("view engine", "ejs")


const isAuthenticated = async (req, res, next) => {
    const {token} = req.cookies
    if (token) 
    {
        // here we are decoding the userid that means the token code will be converted to actual userid when the same secret code (here, random secret)
        // is entered
        const decodedId = jwt.verify(token, "random secret")
        req.user = await user.findById(decodedId._id)
        next()
    }
    else
    {
        res.redirect("/login")
    }
}

//same as node js if else statements but here in express its syntax is better 
app.get("/", isAuthenticated, (req, res) => {
     res.render("logout", {name: req.user.name});
})


app.get("/registerPage", (req, res) => {
    res.render("register")
})

app.get("/login", async (req, res) => {
    res.render("login")
})


app.get("/logout", async (req, res) => {
    let {name, email} = req.body
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.redirect("/")
    // let deletedUser = await user.deleteOne({email})
    // console.log(deletedUser, " is deleted")
})


app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    let user11 = await user.findOne({email})
    
    if (!user11) return res.redirect("/registerPage")

    const isMatch = await bcrypt.compare(password, user11.password); //compare method will automatically compare the encoded password and normal password

    if (!isMatch) return res.render("login", {email, message: "Incorrect password"})

    const token = jwt.sign({_id: user11._id}, "random secret")

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now()+60*1000)
    })
    res.redirect("/")
})

app.post("/registerPage", async (req, res) => {
    const {name, email, password} = req.body;

    let user11 = await user.findOne({email})

    if (user11) {
        return res.redirect("/login")
    }

    let hashPassword = await bcrypt.hash(password, 10)
    // so becoz of bcrypt suppose if you enter "a" as password then in database the password will be hashed and stored like this 
    // password: "$2b$10$29sEySvlL1BTvENSfDUJqeBOYWaT4.QkF2dZvJ7UnP33EbfMVA7Ha"
    const userInfo = await user.create({
        name,
        email,
        password:hashPassword,
    })

    //we use jwt to encodes the data, here we are encoding the user id
    const token = jwt.sign({_id: userInfo._id}, "random secret")
    // console.log(token)
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now()+60*1000)
    })
    res.redirect("/")

})

app.listen(2100, ()=>{
    console.log("server is working")   
})



// app.post("/login", async (req, res) => {
//     const {name, email} = req.body;

//     let user11 = await user.findOne({email})


//     if (!user11) {
//         console.log("executed")
//         return res.redirect("/registerPage")
//     }


//     const userInfo = await user.create({
//         name,
//         email
//     })


//     //we use jwt to encrypt the data, here we are encrypting the user id
//     const token = jwt.sign({_id: userInfo._id}, "random secret")
//     // console.log(token)
//     res.cookie("token", token, {
//         httpOnly: true,
//         expires: new Date(Date.now()+60*1000)
//     })
//     res.redirect("/")


//     // res.send("<h1>logged in successfully 😎")
// })




// app.get("/success", (req, res) => {
//     res.send(`<h1 style='background-color:black; 
//                         color:red; 
//                         text-align:center;
//                         padding: 5px;'>
//                 message is done, lesss go 😎
//               </h1>`)
// })


























// app.get("/about", (req, res) => {
//     res.send("<h1>about</h1>")
// })



// const users = []; temp array that was used as database

// app.post("/contact", async (req, res) => {
//     // const messageData = {userName: req.body.name, userEmail: req.body.email}
//     // const userData = users.push({userName: req.body.name, userEmail: req.body.email})
//     const {name, email} = req.body
//     // await message.create({name: name, email: email}) if the key and value are same like here name: name then we can write it as:
//     await message.create({name, email})
//     res.redirect("/success")
// })  


// app.get("/users", (req, res) => {
//     for (let i = 0; i < users.length; i++)
//         res.send(`<h1>Name: ${users[i].userName} <br/> Email: ${users[i].userEmail}</h1>`)
// })

// app.get("/add", async (req, res) => {
//     await message.create({name: "tanmay", email: "tanmay@gmail.com"})
//     res.send("noice")
// })



// app.get("/", (req, res) => {
        // res.send("<h1>home</h1>") // instead of res.end() we use res.send()

    // res.statusCode = 404

    // res.sendStatus(404) // if we see on the browser then each code will have its own text for eg,. 404 means not found
    // and there are alot of codes like this for eg,. 400, 505, etc search it on google

    // res.json({
    //     name: "jhon",
    //     id: 1,
    //     good_emp: true
    // })

    // res.status(404).send("<h1 style='color:red;'>major error :(</h1>") // we can also add custom msg if 404 error occurs

//    const currentLocation = path.resolve() //path.resolve() is used to get the current path 

//    res.sendFile(path.join(currentLocation, "./index.html")) // we are joining the index.html file name at the end of the path and 
   //passing it to sendfile to render index.html file 

    // res.render("index1", {name: "tanmay"}) // to send data to the index1 file like i have sent name: "tanmay"

    // res.sendFile("index")
    // res.render("login")
// })
















// import http from "http"
// import randomvar from "./explicitmod.js"
// import {randomvar1, randomvar2, generateRandom} from "./explicitmod.js"
// import * as expl from "./explicitmod.js"
// import fs from "fs"
// import path from "path"


// // console.log(path.dirname("/main/test/index.js"))

// // syncronous way to add another file content
// // const home = fs.readFile("./index1.html", () => {
// //     console.log("read file content successfully")
// // })

// // console.log(home)

// // console.log(http)
// console.log(randomvar+ "\n" + randomvar2 + "\n" + randomvar2)
// console.log(expl.randomvar1)

// // we have just created the server but we are not listening on the server
// const server = http.createServer((req, res) => {
//     // console.log("served")
//     // console.log(req.url)

//     console.log(req.method())

//     if (req.url === "/about")
//         res.end(`<h1 style='color:red; background-color:black; padding:5px;'>${generateRandom()}</h1>`)
//     else if (req.url === "/contact")
//         res.end("<h1 style='color:red'>contact</h1>")
//     else if (req.url === "/") {
//         // asyncronous way to add another file content
//         fs.readFile("./index.html", (error, home) => {
//             console.log("file read") //this will be printed after server is listening becoz of js async behaviour that let 
//             // js execute code ahead of this , giving time for this code to execute.. 
//             res.end(home)
//         })
//     }
//     else
//         res.end("<h1 style='color:red'>Page not found :(</h1>")
// })

// // here we are listening to the server 
// server.listen(2100, () => {
//     console.log("server is listening")
// })