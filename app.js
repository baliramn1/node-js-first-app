import express from "express"
import mongoose from "mongoose"
import taskRouter from "./routes/task.js"
import userRouter from "./routes/user.js"
import { config } from "dotenv"
import cookieParser from "cookie-parser"
import { errorMiddleWare } from "./middlewares/error.js"
import cors from "cors"


export const app = express()

config({
    path: "./data/config.env",
})


app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],//allows requests of accessing data only to the url specified in this array
        methods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true, // if we make this false then cookies will not reach to the frontend
    }))


app.use("/api/v1/users", userRouter)
app.use("/api/v1/task", taskRouter)

app.get("/", (req, res) => {
    res.send(`<h1 style='font-size: 50px;'>Home page</h1>`)
})

app.use(errorMiddleWare)
































// notes on how to create an api:
// import express from "express"
// import mongoose from "mongoose"
// import userRouter from "./routes/user.js"
// import { config } from "dotenv" // to change the url (mongodb://127.0.0.1:27017) that we use to
// // connect to the database after the app is deployed without hard coding



// // In Node.js, middleware refers to a software component or a function that sits between the client and the server
// // in an application's request/response processing pipeline. Middleware functions are used to perform various tasks and
// // operations on incoming HTTP requests or outgoing HTTP responses before they reach their final destination.
// export const app = express()

// config({
//     path: "./data/config.env",
// })


// app.use(express.json())

// // in the below line we are already specifiying /users so we dont need to write it again and again in the routes section
// app.use("/users", userRouter)

// app.get("/", (req, res) => {
//     res.send("<h1>helo world</h1>")
// })


