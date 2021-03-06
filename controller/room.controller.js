var roomModel = require('../models/room.model')
var billModel = require('../models/bill.model')
var userModel = require('../models/user.model')
var notificationModel = require('../models/notification.model')

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
			if(req.query.address === "" || req.query.address === undefined || req.query.address === null){
	            res.status(200).json({code:"1002", message: "Parameter is not enought" })
	        }
            else if(req.query.price === "" || req.query.price === undefined || req.query.price === null){
            	res.status(200).json({code:"1002", message: "Parameter is not enought" })
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
	            let newRoom = await roomModel.create({userMaster: req.user.id, address: req.query.address, price:req.query.price, image:result.secure_url})
	            let notificationUser = await notificationModel.create({user:req.user.id, contents:"You just added a new room"})
	            res.status(200).json({code:"1000",message: 'OK'})
	        	}
		        else{
					let newRoom = await roomModel.create({userMaster: req.user.id, address: req.query.address, price:req.query.price})
		            let notificationUser = await notificationModel.create({user:req.user.id, contents:"You just added a new room"})
		            res.status(200).json({code:"1000",message: 'OK'})
		        }
            }
		}
	}
	catch (err) {
        console.log(err);
        res.status(200).json({ error: err.message })
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
	            let updateRoom = await roomModel.findOneAndUpdate({_id:req.query.room_id},{ address: req.query.address, price:req.query.price, image:result.secure_url})
	            let notificationUser = await notificationModel.create({user:req.user.id, contents:"You just updated a room"})
	            res.status(200).json({code:"1000",message: 'OK'})
        	}
	        else{
				let updateRoom = await roomModel.findOneAndUpdate({_id:req.query.room_id},{ address: req.query.address, price:req.query.price})
	            res.status(200).json({code:"1000",message: 'OK'})
	        }
		}
	}
	catch (err) {
        console.log(err);
        res.status(200).json({ error: err.message })
    }
}


controller.deleteRoom = async (req, res) => {
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})
		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
			if(req.query.room_id){
				let deleteRoom = await roomModel.remove({_id: req.query.room_id})
				let notificationUser = await notificationModel.create({user:req.user.id, contents:"You just deleted a room"})
				res.status(200).json({code:"1000",message: 'OK'})
			} else{
				res.status(200).json({code:"1004", message: "Parameter value is invalid"})
			}
		}

	}
	catch (err) {
        console.log(err);
        res.status(200).json({ error: err.message })
    }
}

controller.getRoomInfor = async (req, res) =>{
	try{
		if(req.query.room_id){
			let room_id = req.query.room_id
			let room_data = await roomModel.findOne({_id: room_id })
			console.log(room_data)
			res.status(200).json({code:"1000", message: "OK",room_data})
		}
		else{
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
	}
	catch (err) {
        console.log(err);
        res.status(200).json({ error: err.message })
    }
}

controller.getRoomList =async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}

		else{
			if(isNaN(parseInt( req.query.index)) || isNaN(parseInt( req.query.count)) ){
				res.status(200).json({code:"1004", message: "Parameter value is invalid"})
			} 
			else {
				let index = parseInt( req.query.index)
		        var count= parseInt( req.query.count)
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

    }
    catch(err){
         res.status(200).json({error: err.message})
    }
}

controller.getRoomBill = async (req,res) =>{
	try{
		if(req.query.room_id){
			let billData = await billModel.find({roomRent: req.query.room_id})
			res.status(200).json({code:"1000", message: "OK", billData})
		}
		else{
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
	}
	catch(err){
         res.status(200).json({error: err.message})
    }
}

controller.getBill = async (req,res) =>{
	try{
		if(req.query.bill_id){
			let billData = await billModel.findOne({_id: req.query.bill_id})
			res.status(200).json({code:"1000", message: "OK", billData})
		}
		else{
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
	}
	catch(err){
         res.status(200).json({error: err.message})
    }
}

controller.searchRoom =async (req,res) =>{
	try{
		if(isNaN(parseInt(req.query.index)) || isNaN(parseInt(req.query.count)) ){
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
		else{
			let index =  parseInt(req.query.index)
	        var count=  parseInt(req.query.count)
	        var room_list = []
	        let getRoomList = await roomModel.find()

	        let searchResult = getRoomList.filter(item => item.address !== undefined && item.address.toLowerCase().indexOf(req.query.keyword) !== -1);

	        if( count + index > searchResult.length ){
	            count= searchResult.length-index
	        }

	        if( index < searchResult.length ){
	            for( let i = 1; i<=count; i++){
	                room_list.push(searchResult[searchResult.length-index-i])
	            }
	            res.status(200).json({code:"1000", message: "OK", room_list})
	        }
	        else{
	            res.status(200).json({code:"9994", message: "No data or end of list data entry"})
	        }
		}
    }
    catch(err){
        res.status(200).json({error: err.message})
    }
}

controller.statistic = async (req, res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
		}
	}
	catch(err){
        res.status(200).json({error: err.message})
    }
}

module.exports = controller