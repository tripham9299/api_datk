var userModel = require('../models/user.model')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const bcrypt = require('bcryptjs')
let controller = {}

controller.getListUser = async (req, res) => {
    try {
        let listUser = await userModel.find()
        res.json(listUser);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

controller.getPersonalInfor = async (req, res) => {

    try {
        let id = req.user.id;
        let user = await userModel.findOne({ _id: id }).lean();
        delete user.isBlock
        delete user.role
        delete user.password

        res.json(user);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }

}

controller.updatePersonalInfor = async (req, res) => {

    try {
        let id = req.user.id;

        if (req.body.isBlock) delete req.body.isBlock
        if (req.body.role) delete req.body.role
        if (req.body.password) delete req.body.password

        if(req.file){
            let streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                      (error, result) => {
                        if (result) {
                          resolve(result);
                        } else {
                          reject(error);
                        }
                      }
                    );

                        streamifier.createReadStream(req.file.buffer).pipe(stream);
                    });
                };
            let result = await streamUpload(req);
            let userUpdate= await userModel.findOneAndUpdate({_id:id},
                {fullname: req.body.fullname,email:req.body.email,mobile:req.body.mobile,avatar:result.secure_url},
                {new:true})
            res.json(userUpdate);
        }
        else{

            let userUpdate = await userModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
            res.json(userUpdate);
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }

}

controller.changePass = async(req, res) => {

    try {

        let currentUser = await userModel.findById(req.user.id)
        const salt = await bcrypt.genSalt(10)
        const oldPass = req.body.old_password
        let checkPass = await bcrypt.compare(oldPass, currentUser.password)
        let newPass = await bcrypt.hash(req.body.new_password, salt)

        if (checkPass) {
            await currentUser.updateOne({password: newPass})
            res.status(200).json({message: 'thanh cong'})
        } else res.status(403).json({message: 'that bai'})
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}



controller.checkUserByEmail = async (req, res) => {

    try {
        let email = req.email
        let user = await userModel.findOne({ email: email })
        if (!user) res.status(404).json("tài khoản không tồn tại");
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }

}


controller.addUser = async (req, res) => {

    try {

        let userNew = new userModel(req.body)
        userNew = await userNew.save()
        res.json(userNew);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

controller.deleteUserById = async (req, res) => {

    try {
        let id = req.params.id
        let userDelete = await userModel.findByIdAndDelete(id)
        res.json(userDelete);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

controller.updateUserAdmin = async (req, res) => {

    try {
        let id = req.params.id || req.body._id
        if (req.body.password) delete req.body.password
        if (req.body.role) delete req.body.role
        let userUpdate = await userModel.findOneAndUpdate({ _id: id }, req.body, { new: true })

        res.json(userUpdate);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }


}


controller.LockUser = async (req, res) => {
    try {
        let id = req.params.id;

        let userUpdate = await userModel.findOneAndUpdate({ _id: id }, { isBlock: true }, { new: true });
        res.json(userUpdate);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}

controller.unLockUser = async (req, res) => {
    try {
        let id = req.params.id;

        let userUpdate = await userModel.findOneAndUpdate({ _id: id }, { isBlock: false }, { new: true });
        res.json(userUpdate);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}


module.exports = controller