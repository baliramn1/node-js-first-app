import { user } from "../models/user.js"
import bcrypt from "bcrypt"
import { sendCookie } from "../utils/features.js"

export const getAllUsers = async (req, res) => { }


export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body

        let User = await user.findOne({ email })

        if (!User) return next(new ErrorHandler("User Already Exist", 400))

        const hashedPassword = await bcrypt.hash(password, 10)

        User = await user.create({ name, email, password: hashedPassword })

        sendCookie(User, res, "Registered successfully", 201)
    } catch (error) {
        next(error)
    }
}


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const User = await user.findOne({ email }).select("+password")

        if (!User) return next(new ErrorHandler("Invalid", 400))

        const isMatch = await bcrypt.compare(password, User.password)

        if (!isMatch) return next(new ErrorHandler("Invalid email or password", 404))

        sendCookie(User, res, `Welcom back, ${User.name}`, 200)
    } catch (error) {
        next(error)
    }

}


export const getMyProfile = async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.User
    })
}



// export const logout = (req, res) => {
//     res.status(200).cookie(
//         "token",
//         "",
//         {
//             expires: new Date(Date.now()),
//             sameSite: process.env.NODE_ENV === "Developement" ? "lax" : "none", // It specifies that the site url(ports) are diff (for front and backend)
//             secure: process.env.NODE_ENV === "Developement" ? false : true,
//         })
//         .json({
//             success: true,
//             user: "loged out successfully",
//         })
// }



































// notes on how to create an api:

// import { user } from "../models/user.js"

// export const getAllUsers = async (req, res) => {

//     const users = await user.find({})

//     res.json({
//         success: true,
//         users,
//     })
// }

// export const register = async (req, res) => {
//     const { name, email, password } = req.body;

//     const users = await user.create({
//         name,
//         email,
//         password,
//     })

//     res.status(201).cookie("cookie1", "lets go").json({
//         success: true,
//         message: "Registered successfully",
//     })
// }

// export const specialUser = (req, res) => {
//     res.json({
//         success: true,
//         message: "hello there",
//     })
// }

// export const getUserDetails = async (req, res) => {

//     //     // const { id } = req.body //add the json object like {"id": "64f89863835916c7924e3597"} in
//     //     // the postman body to and excute the about url ie, localhos:2100/userid then we will get the
//     //     // that specific user.
//     //     //  or we can do the same by using params

//     const { id } = req.params

//     let user1 = await user.findById(id)

//     res.json({
//         success: true,
//         user: user1,
//     })
// }
// export const updateUser = async (req, res) => {

//     const { id } = req.params

//     let user1 = await user.findById(id)

//     res.json({
//         success: true,
//         message: "updated",
//     })
// }
// export const deleteUser = async (req, res) => {

//     const { id } = req.params

//     let user1 = await user.findById(id)

//     await user1.deleteOne()

//     res.json({
//         success: true,
//         message: "deleted",
//     })
// }