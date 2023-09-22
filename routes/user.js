import express from "express";
import { user } from "../models/user.js";
import { getMyProfile, getAllUsers, register, login, logout } from "../controller/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router()

router.get("/all", getAllUsers)

router.post("/new", register)

router.post("/login", login)

router.get("/logout", logout)

router.get("/me", isAuthenticated, getMyProfile)




export default router;



























// Notes on how to create an api:

// import express from "express";
// import { user } from "../models/user.js";
// import { getUserDetails, getAllUsers, register, specialUser, deleteUser, updateUser } from "../controller/user.js";

// const router = express.Router()

// router.get("/all", getAllUsers)



// // when we will go to the below url we get msg that cannot get /users/new
// // becoz we cant access post method so thats why we will be using postman
// // to develop and test api's with ease
// router.post("/new", register)


// router.get("/userid/special", specialUser)

// // while using dynamic route like below if we want a special route like above then we can place the special route before the dynamic so that it
// // will execute (special route) becoz js is executed top to bottom and if we place the special route after the dynamic id then it will give error as the
// // special route /special is not an id and does not have a document with that id in the database
// // router.get("/userid/:id", getUserDetails) 

// // router.put("/userid/:id", updateUser)

// // router.delete("/userid/:id", deleteUser)

// // or we can do the above in one line 

// router.route("/userid/:id")
// .get(getUserDetails)
// .put(updateUser)
// .delete(deleteUser)