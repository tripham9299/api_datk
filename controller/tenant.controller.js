var roomModel = require('../models/room.model')
var billModel = require('../models/bill.model')
var userModel = require('../models/user.model')
var transferModel = require('../models/transfer.model')

let controller = {}


controller.rent = async(req,res) =>{
	try{
		if(req.query.room_id){
			let rentBill = await billModel.create({userRent: req.user.id, roomRent: req.query.room_id, status:"unpaid"})
			let rentRoom = await roomModel.findOneAndUpdate({_id:req.query.room_id},{ userRent: req.user.id })
			res.status(200).json({code:"1000", message: "OK"})
		}
		else{
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
	}
	catch(err){
         res.status(200).json({error: err.message})
    }
}

controller.cancelRent = async(req,res) =>{
	try{
		if(req.query.room_id){
			let cancelRent = await billModel.findOneAndUpdate({userRent:req.user.id, roomRent:req.query.room_id},{status:"cancel"})
			let rentRoom = await roomModel.findOneAndUpdate({_id:req.query.room_id},{ userRent: null })
			res.status(200).json({code:"1000", message: "OK"})
		}
		else{
			res.status(200).json({code:"1004", message: "Parameter value is invalid"})
		}
	}
	catch(err){
         res.status(200).json({error: err.message})
    }
}

controller.addToRoom = async(req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}

		else{

			if(req.query.room_id && req.query.user_id){
				let addToRoomBill = await billModel.create({userRent: req.user.id, roomRent: req.query.room_id, status:"unpaid"})
				let addToRoom = await roomModel.findOneAndUpdate({_id:req.query.room_id},{userRent: req.query.user_id})
				res.status(200).json({code:"1000", message: "OK"})
			}
			else{
				res.status(200).json({code:"1004", message: "Parameter value is invalid"})
			}

		}
	}
	catch(err){
         res.status(200).json({error: err.message})
    }
}

controller.removeFromRoom = async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{

			if(req.query.room_id && req.query.user_id){

				let removeFromRoom = await roomModel.findOneAndUpdate({_id:req.query.room_id},{userRent: null})
				res.status(200).json({code:"1000", message: "OK"})
			}

			else{
				res.status(200).json({code:"1004", message: "Parameter value is invalid"})
			}
		}
	}
	catch(err){
         res.status(200).json({error: err.message})
    }
}

controller.tenantTransfer = async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
			if(req.query.host_id && req.query.guest_id && req.query.room_id ){
				let tranferUser = await tranferModel.create({userMaster:req.query.host_id, userMasterTransfer: req.user.id, userGuest:req.query.guest_id})
				let removeUserFromRoom = await roomModel.findOneAndUpdate({_id: req.query.room_id},{userRent:null})
				res.status(200).json({code:"1000", message: "OK",tranferUser,removeUserFromRoom})
			}
			else{
				res.status(200).json({code:"1004", message: "Parameter value is invalid"})
			}
		}
	}
	catch(err){
         res.status(200).json({error: err.message})
    }
}
controller.getTenantTransfer = async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})
		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
			let listTenantTransfer = await transferModel.find({userMaster:req.user.id}).populate('userGuest').populate('userMasterTransfer')
			res.status(200).json({code:'1000',message:'OK',listTenantTransfer})
		}
	}
	catch(err){
         res.status(200).json({error: err.message})
    }
}

controller.receiveTenant = async (req,res) =>{
	try{
		let checkUserMaster = await userModel.findOne({_id: req.user.id})

		if(checkUserMaster.role!="master"){
			res.status(200).json({code:"1009",message: "Not access."})
		}
		else{
			if(req.query.confirm == 1){
				if(req.query.host_id && req.query.guest_id && req.query.room_id){
					let acceptTransferRoom = await roomModel.findOneAndUpdate({_id:req.query.room_id},{userRent:req.query.guest_id})
					let newBill = await billModel.create({userRent: req.query.guest_id, roomRent: req.query.room_id, status:"unpaid"})
					res.status(200).json({code:'1000',message:'OK'})
				}
				else{
					res.status(200).json({code:"1004", message: "Parameter value is invalid"})
				}
			}
			else{
				if(req.query.host_id && req.query.guest_id){
					let refuseTransfer = await tranferModel.remove({userMaster:req.user.id,userMasterTransfer:req.query.host_id,userGuest:req.query.guest_id})
				}
				else{
					res.status(200).json({code:"1004", message: "Parameter value is invalid"})
				}
			}
		}
	}
	catch(err){
         res.status(200).json({error: err.message})
    }
}

module.exports = controller