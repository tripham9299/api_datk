var postModel = require('../models/post.model')
var commentModel = require('../models/comment.model')
let controller = {}

controller.addNewPost = async (req, res) => {
    try {
        let newPost = await postModel.create({user:req.user.id, content: req.query.content})
        res.status(200).json({code:"1000", message: "OK" })
    }
    catch (err) {
        res.status(200).json({ error: err })
    }
}

controller.updatePost = async ( req, res) => {
    try{
        let updatePost = await postModel.findOneAndUpdate({ _id:req.query.post_id },{ content: req.query.content })
        res.status(200).json({code:"1000", message: "OK" })
    }
    catch(err){
        res.status(200).json({error: err})
    }
}

controller.getPostList = async (req,res) => {
    try{
        let post_list = await postModel.find({user: req.user.id}).populate('user')
        res.status(200).json(post_list)
    }
    catch(err){
         res.status(200).json({error: err})
    }
}

controller.deletePost = async (req,res) => {
    try{
        let deletePost = await postModel.remove({_id:req.query.post_id})
        res.status(200).json({code:"1000", message: "OK" })
    }
    catch(err){
         res.status(200).json({error: err})
    }
}

controller.getPost = async (req,res) =>{
    try{
        let postId= req.query.post_id
        let post_data = await postModel.findOne({_id: postId })
        res.status(200).json({code:"1000", message: "OK", post_data })
    }
    catch(err){
         res.status(200).json({error: err})
    }
}

controller.comment= async(req,res)=>{
    try{
        let post_id= req.query.post_id
        let comment = req.query.comment
        let newComment= await commentModel.create({user: req.user.id, post: post_id,  content : comment})
        res.status(200).json({code:"1000", message: "OK"})
    }
    catch(err){
         res.status(200).json({error: err})
    }
}

controller.getCommentList = async  (req,res) =>{
     try{
        let post_id = req.query.post_id
        let index = req.query.index
        var count= req.query.count
        var comment_list = []
        let getCommentList = await commentModel.find({ post: post_id})

        if( count + index > getCommentList.length ){
            count= getCommentList.length-index
        }

        if( index < getCommentList.length ){
            for( let i = 1; i<=count; i++){
                comment_list.push(getCommentList[getCommentList.length-index-i])
            }
            res.status(200).json({code:"1000", message: "OK", comment_list})
        }
        else{
            res.status(200).json({code:"9994", message: "No data or end of list data entry"})
        }
    }
    catch(err){
         res.status(200).json({error: err})
    }
}


module.exports = controller