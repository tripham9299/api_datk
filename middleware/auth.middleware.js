const jwtMethod = require('../jsonwebtoken/jwt.method');

const secretKey = process.env.ACCESS_TOKEN_SECRET || "Tri09021999";

let isAuth = async (req, res, next) => {

	const tokenClient = req.body.token || req.headers["x-access-token"] ||
	req.headers["user-token"] || req.headers["token"] ||
	 req.headers.authorization || req.cookies['access_token'] || req.query.token;

	if (!tokenClient) return res.status(200).json({
		code : "9998",
		message: "Token is invalid"
	})
	try {
		req.user = await jwtMethod.verifyToken(tokenClient, secretKey);
		next()
	}
	catch (err) {
		return res.status(200).json({
			message: err
		})
	}
}



let isAdmin = async (req, res, next) => {
	const tokenClient = req.body.token || req.headers["x-access-token"] || req.headers["user-token"] || req.headers["token"] || req.headers.authorization || req.cookies['access_token'];
	if (!tokenClient) return res.status(200).json({
		code : "9998",
		message: "Token is invalid"
	})

	try {
		req.user = await jwtMethod.verifyToken(tokenClient, secretKey);
		if ((!req.user.role) || req.user.role != 2) throw new Error("Not access");
		next()
	}
	catch (err) {
		return res.status(200).json({
			code: "1009",
			message: "Not access"
		})
	}
}




module.exports = { isAuth , isAdmin }

