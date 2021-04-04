var userModel = require('../models/user.model')
var notificationModel = require('../models/notification.model')
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
        res.status(200).json({ error: err })
    }
}

controller.getPersonalInfor = async (req, res) => {

    try {
        let id = req.user.id;
        let user = await userModel.findOne({ _id: id }).lean();
        delete user.isBlock
        delete user.role
        delete user.password

        res.status(200).json({code:"1000",message:"OK",user});
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ error: err })
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
            res.status(200).json({code:'1000',message:'OK',userUpdate});
        }
        else{

            let userUpdate = await userModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
            res.status(200).json({code:'1000',message:'OK',userUpdate});
        }

    }
    catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }

}

controller.changePass = async(req, res) => {

    try {
        if(req.body.new_password!==req.body.retype_password){
            res.status(200).json({code:"403", message: 'incorect retype_password'})
        }
        else{
            let currentUser = await userModel.findById(req.user.id)
            const salt = await bcrypt.genSalt(10)
            const oldPass = req.body.old_password
            let checkPass = await bcrypt.compare(oldPass, currentUser.password)
            let newPass = await bcrypt.hash(req.body.new_password, salt)

            if (checkPass) {
                await currentUser.updateOne({password: newPass})
                res.status(200).json({code:"1000", message: 'OK'})
            }
            else res.status(200).json({code:"403", message: 'failure'})
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }
}


controller.deleteUserById = async (req, res) => {

    try {
        let checkUserAdmin = await userModel.findOne({_id: req.user.id})
        if(checkUserAdmin.role!="admin"){
            res.status(200).json({code:"1009",message: "Not access."})
        }
        else{
            if(req.body.confirm==1){
                let userDelete = await userModel.findByIdAndDelete(req.body.user_id)
                res.status(200).json({code:"1000",message: 'OK'})
            }
        }

    }
    catch (err) {
        res.status(200).json({ error: err })
    }
}

controller.LockUser = async (req, res) => {
    try {
        let id = req.params.id;

        let userUpdate = await userModel.findOneAndUpdate({ _id: id }, { isBlock: true }, { new: true });
        res.status(200).json({code:"1000",message:"OK",userUpdate});
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }
}

controller.unLockUser = async (req, res) => {
    try {
        let id = req.params.id;

        let userUpdate = await userModel.findOneAndUpdate({ _id: id }, { isBlock: false }, { new: true });
        res.status.json({code:'1000',message:'OK',userUpdate});
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }
}

controller.getNotification = async (req,res) =>{
    try{
        let notification_list = await notificationModel.find({user:req.user.id})
        res.status(200).json({code:'1000', message:'OK', notification_list })
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }
}


module.exports = controller