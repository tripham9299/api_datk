var roomModel = require('../models/room.model')
var billModel = require('../models/bill.model')
var userModel = require('../models/user.model')

const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
let controller = {}

controller.addNewRoom = async (req,res) => {
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access." })
		}
		else{

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
	            let newRoom = await roomModel.create({userMaster: req.user.id, address: req.body.address, price:req.body.price, image:result.secure_url})
	            res.status(200).json({code:"1000",message: 'OK'})
        	}
	        else{
				let newRoom = await roomModel.create({userMaster: req.user.id, address: req.body.address, price:req.body.price})
	            res.status(200).json({code:"1000",message: 'OK'})
	        }
		}
	}
	catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }
}



controller.updateRoom = async(req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})
		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
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
	            let updateRoom = await roomModel.findOneAndUpdate({_id:req.body.room_id},{ address: req.body.address, price:req.body.price, image:result.secure_url})
	            res.status(200).json({code:"1000",message: 'OK'})
        	}
	        else{
				let updateRoom = await roomModel.findOneAndUpdate({_id:req.body.room_id},{ address: req.body.address, price:req.body.price})
	            res.status(200).json({code:"1000",message: 'OK'})
	        }
		}
	}
	catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }
}


controller.deleteRoom = async (req, res) => {
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})
		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
			let deleteRoom = await roomModel.remove({_id: req.body.room_id})
			res.status(200).json({code:"1000",message: 'OK'})
		}

	}
	catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }
}

controller.getRoomInfor = async (req, res) =>{
	try{
		let room_id = req.query.room_id
		let room_data = await roomModel.findOne({_id: room_id })
		console.log(room_data)
		res.status(200).json(room_data)
	}
	catch (err) {
        console.log(err);
        res.status(200).json({ error: err })
    }
}

controller.getRoomList =async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}

		else{
	        let index = req.body.index
	        var count= req.body.count
	        var room_list = []
	        let getRoomList = await roomModel.find({ userMaster: req.user.id})

	        if( count + index > getRoomList.length ){
	            count= getRoomList.length-index
	        }

	        if( index < getRoomList.length ){
	            for( let i = 1; i<=count; i++){
	                room_list.push(getRoomList[getRoomList.length-index-i])
	            }
	            res.status(200).json({code:"1000", message: "OK", room_list})
	        }
	        else{
	            res.status(200).json({code:"9994", message: "No data or end of list data entry"})
	        }
		}

    }
    catch(err){
         res.status(200).json({error: err})
    }
}

controller.getRoomBill = async (req,res) =>{
	try{
		if(req.body.room_id){
			let billData = await billModel.find({roomRent: req.body.room_id})
			res.status(200).json({code:"1000", message: "OK", billData})
		}
		else{
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
	}
	catch(err){
         res.status(200).json({error: err})
    }
}

controller.getBill = async (req,res) =>{
	try{
		if(req.body.bill_id){
			let billData = await billModel.find({_id: req.body.bill_id})
			res.status(200).json({code:"1000", message: "OK", billData})
		}
		else{
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
	}
	catch(err){
         res.status(200).json({error: err})
    }
}

module.exports = controller