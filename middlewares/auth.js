// whenever we need to check whether a user exist we need to execute the following 
// code thats why i created this seperate file.
import jwt from "jsonwebtoken"
import { user } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token)
        return res.status(404).json({
            success: false,
            message: "Login First"
        })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.User = await user.findById(decoded._id)

    next() // This will call the next function in the chaain of function router.get() or router.post()
};