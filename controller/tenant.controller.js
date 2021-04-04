var roomModel = require('../models/room.model')
var billModel = require('../models/bill.model')
var userModel = require('../models/user.model')
var tranferModel = require('../models/transfer.model')

let controller = {}


controller.rent = async(req,res) =>{
	try{
		if(req.body.room_id){
			let rentBill = await billModel.create({userRent: req.user.id, roomRent: req.body.room_id, status:"unpaid"})
			let rentRoom = await roomModel.findOneAndUpdate({_id:req.body.room_id},{ userRent: req.user.id })
			res.status(200).json({code:"1000", message: "OK"})
		}
		else{
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
	}
	catch(err){
         res.status(200).json({error: err})
    }
}

controller.cancelRent = async(req,res) =>{
	try{
		if(req.body.room_id){
			let cancelRent = await billModel.findOneAndUpdate({userRent:req.user.id, roomRent:req.body.room_id},{status:"cancel"})
			let rentRoom = await roomModel.findOneAndUpdate({_id:req.body.room_id},{ userRent: null })
			res.status(200).json({code:"1000", message: "OK"})
		}
		else{
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
	}
	catch(err){
         res.status(200).json({error: err})
    }
}

controller.addToRoom = async(req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}

		else{

			if(req.body.room_id && req.body.user_id){
				let addToRoomBill = await billModel.create({userRent: req.user.id, roomRent: req.body.room_id, status:"unpaid"})
				let addToRoom = await roomModel.findOneAndUpdate({_id:req.body.room_id},{userRent: req.body.user_id})
				res.status(200).json({code:"1000", message: "OK"})
			}
			else{
				res.status(200).json({code:"1004", message: "Parameter value is invalid"})
			}

		}
	}
	catch(err){
         res.status(200).json({error: err})
    }
}

controller.removeFromRoom = async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{

			if(req.body.room_id && req.body.user_id){

				let removeFromRoom = await roomModel.findOneAndUpdate({_id:req.body.room_id},{userRent: null})
				res.status(200).json({code:"1000", message: "OK"})
			}

			else{
				res.status(200).json({code:"1004", message: "Parameter value is invalid"})
			}
		}
	}
	catch(err){
         res.status(200).json({error: err})
    }
}

controller.tenantTransfer = async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
			if(req.body.host_id && req.body.guest_id && req.body.room_id ){
				let tranferUser = await tranferModel.create({userMaster:req.body.host_id, userMasterTransfer: req.user.id, userGuest:req.body.guest_id})
				let removeUserFromRoom = await roomModel.findOneAndUpdate({_id: req.body.room_id},{userRent:null})
				res.status(200).json({code:"1000", message: "OK",tranferUser,removeUserFromRoom})
			}
			else{
				res.status(200).json({code:"1004", message: "Parameter value is invalid"})
			}
		}
	}
	catch(err){
         res.status(200).json({error: err})
    }
}
controller.getTenantTransfer = async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
			let listTenantTransfer = tranferModel.find({userMaster:req.user.id})
			res.status(200).json({code:'1000',message:'OK',listTenantTransfer})
		}
	}
	catch(err){
         res.status(200).json({error: err})
    }
}

controller.receiveTenant = async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
			if(req.body.confirm == 1){
				if(req.body.host_id && req.body.guest_id && req.body.room_id){
					let acceptTransferRoom = await roomModel.findOneAndUpdate({_id:req.body.room_id},{userRent:req.body.guest_id})
					let newBill = await billModel.create({userRent: req.body.guest_id, roomRent: req.body.room_id, status:"unpaid"})
					res.status(200).json({code:'1000',message:'OK'})
				}
				else{
					res.status(200).json({code:"1004", message: "Parameter value is invalid"})
				}
			}
			else{
				if(req.body.host_id && req.body.guest_id){
					let refuseTransfer = await tranferModel.remove({userMaster:req.user.id,userMasterTransfer:req.body.host_id,userGuest:req.body.guest_id})
				}
				else{
					res.status(200).json({code:"1004", message: "Parameter value is invalid"})
				}
			}
		}
	}
	catch(err){
         res.status(200).json({error: err})
    }
}

module.exports = controller