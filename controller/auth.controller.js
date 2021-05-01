let userModel = require('../models/user.model');

var { validationResult } = require('express-validator');

let bcrypt = require('bcryptjs')
const jwtMethod = require('../jsonwebtoken/jwt.method');
const authMiddleware = require('../middleware/auth.middleware');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "6h";
const acesssSecretKey = process.env.ACCESS_TOKEN_SECRET || "Tri09021999";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET || "Tri09021999Refesh";


let controller = {}

controller.login = async (req, res) => {

    try {

            let user = req.query;
            const checkUser = await userModel.findOne({ username: user.username }).lean();
            if (!checkUser) res.status(200).json({
                code:"401",
                message: "Username or password is incorrect"
            })

            else {
                const checkPass = await bcrypt.compare(user.password, checkUser.password)
                delete checkUser.password;
                if (!checkPass) res.status(200).json({
                    code:"401",
                    message: "Username or password is incorrect"
                })

                else if (checkUser.isBlock) res.status(200).json({
                    code:"401",
                    message: "The account has been locked"
                })

                else {
                    const payloadUser = {
                        id: checkUser._id,
                        username: checkUser.username,
                        role: checkUser.role
                    }

                    const accessToken = await jwtMethod.generateToken(payloadUser, acesssSecretKey, accessTokenLife)
                    const refreshToken = await jwtMethod.generateToken(payloadUser, refreshSecretKey, refreshTokenLife)

                    res.cookie('access_token', accessToken, {
                        maxAge: 60 * 24 * 60 * 60,
                        httpOnly: true,
                        secure: true
                    })

                    res.cookie('refresh_token', accessToken, {
                        maxAge: 60 * 24 * 60 * 60,
                        httpOnly: true,
                        secure: true
                    })



                    return res.status(200).json({
                        code:"1000",
                        message: "OK",
                        user: {
                            user_id:checkUser._id,
                            role:checkUser.role,
                            avatar:checkUser.avatar,
                            fullname: checkUser.fullname,
                            token:accessToken,
                            refreshToken: refreshToken
                        }
                    })
                }
            }

    }
    catch (err) {
        res.status(200).json({ err: err })
    }

}

controller.logout=async (req, res)=> {
    try{

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.json({code:"1000",message: "OK"})

    }
    catch(err){
        console.log(err);
        res.status(200).json({message: err})
    }
}


controller.refreshToken = async (req, res) => {

    try {

        const refreshTokenClient = req.query.refreshToken || req.cookies.refreshToken || req.cookies.refreshToken || req.headers["x-refresh-token"] || req.headers["refreshToken"];
        const userDecode = await jwtMethod.verifyToken(refreshTokenClient, refreshSecretKey);

        const payloadUser = {
            id: userDecode._id,
            email: userDecode.email
        }

        const accessToken = await jwtMethod.generateToken(payloadUser, acesssSecretKey, accessTokenLife)

        res.cookie('access_token', accessToken, {
            maxAge: 60 * 24 * 60 * 60,
            httpOnly: true,
            secure: true
        })

        res.status(200).json({
            code:"1000",
            message: "OK",
            access_token: accessToken
        })


    }
    catch (err) {
        res.status(200).json(err)
    }


}

controller.signup = async (req, res) => {
    try{
        const newUserClient = req.query;

        let emailExits = await userModel.findOne({ email: newUserClient.email })
        let userExits = await userModel.findOne({ email: newUserClient.username })

        if (emailExits) {
            res.status(200).json({code:"9996", message: "User exited" })
        }
        else if(userExits){
            res.status(200).json({code:"9996", message: "User exited" })
        }
        else if(newUserClient.username === "" || newUserClien.username === undefined || newUserClient.username === null){
            res.status(200).json({code:"9996", message: "Username is required" })
        }
        else if(newUserClient.fullname === "" || newUserClien.fullname === undefined || newUserClient.fullname === null){
            res.status(200).json({code:"9996", message: "Fullname is required" })
        }
        else {
            let newUser = new userModel(newUserClient);

            const salt = await bcrypt.genSalt(10)
            newUser.password = await bcrypt.hash(newUserClient.password, salt)
            newUser = await newUser.save();

            res.status(200).json({ code:"1000", message: "OK" })
        }
    }
    catch (err) {
        res.status(200).json(err)
    }
}

module.exports = controller
