import jwt from "jsonwebtoken"

export const sendCookie = (user, res, message, statusCode=200) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "Developement"? "lax" : "none", // It specifies that the site url(ports) are diff (for front and backend)
        secure: process.env.NODE_ENV === "Developement"? false : true,
    }).json({
        success: true,
        message,
    })
} 