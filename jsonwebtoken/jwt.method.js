const jwt= require('jsonwebtoken');

let generateToken= (data, secretKey, tokenLife)=>{
	return new Promise((resolve, reject)=>{
		jwt.sign(
				data,
				secretKey,
				{
			       algorithm: "HS256",
			       expiresIn: tokenLife,
			     },
			     (err, token)=>{
			     	if(err) return reject(err);
			     	 resolve(token)
			     }
			 )}
	)
}


let verifyToken= (token, sercretKey)=>{
	return new Promise((resolve, reject)=>{
		jwt.verify(token, sercretKey, (err, decoded)=>{
			if(err) return reject(err);
			resolve(decoded)
		})
	})
}

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};