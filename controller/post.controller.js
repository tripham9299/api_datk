var postModel = require('../models/post.model')
let controller = {}

controller.addNewPost = async (req, res) => {
    try {
        let newPost = await postModel.create({user:req.user.id, content: req.body.content})
        res.status(200).json({ message: "Successfully" })
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

controller.updatePost = async ( req, res) => {
    try{
        let updatePost = await postModel.findOneAndUpdate({ _id:req.body.post_id },{ content: req.body.content })
        res.status(200).json({ message: "Successfully" })
    }
    catch(err){
        res.status(500).json({error: err})
    }
}

controller.getPostList = async (req,res) => {
    try{
        let getPostList = await postModel.find({user: req.user.id}).populate('user')
        res.status(200).json(getPostList)
    }
    catch(err){
         res.status(500).json({error: err})
    }
}

controller.deletePost = async (req,res) => {
    try{
        let deletePost = await postModel.remove({_id:req.body.post_id})
        res.status(200).json({ message: "Deleted successfully" })
    }
    catch(err){
         res.status(500).json({error: err})
    }
}


module.exports = controller