const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check,validationResult} = require('express-validator');
const Post = require('../../models/post');
const Profile = require('../../models/profile');
const User = require('../../models/user');
//@route GET api/posts
// @desc create post
//access private
router.post('/',[auth,
    check('text','text is required').not().isEmpty(),
], async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try {
    const user = await User.findById(req.user.id).select('-password');
    const newPost=new Post({
        text : req.body.text,
        name : user.name , 
        avatar : user.avatar,
        user : req.user.id 
    });
    const post= await newPost.save();
    res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
   
});
//@route GET api/posts
// @desc get all  posts 
//access private
router.get('/', auth , async(req,res)=>{
    try {
        const posts = await Post.find().sort({date : -1});
        res.json(posts);
    } catch (error) {
       console.error(error.message);
       res.status(500).send('server error'); 
    }
});
//@route GET api/posts/:id
// @desc get post by ud  
//access private
router.get('/:id', auth , async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message : ' post not found'}) ;
        }

        res.json(post);
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({message : ' post not found'}) ;
        }
       console.error(error.message);
       res.status(500).send('server error'); 
    }
});
//@route delete api/posts/:id
// @desc delete post
//access private
router.delete('/:id', auth , async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message : ' post not found'}) ;
        }
        //check user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({message : ' user not authorized'});
        }
        await post.remove();
        res.json({message : 'post removed'});
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({message : ' post not found'}) ;
        }
       console.error(error.message);
       res.status(500).send('server error'); 
    }
});
//@route put api/posts/like/:id
// @desc  like a post
//access private

router.put('/like/:id', auth , async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
      /*  if(!post){
            return res.status(404).json({message : ' post not found'}) ;
        }*/
        // check if post liked
        if(post.likes.filter(like => like.user.toString()===req.user.id).length > 0){
            return res.status(400).json({ message : 'post already liked'})
        }
        post.likes.unshift({user : req.user.id});
        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});
//@route put api/posts/unlike/:id
// @desc  unlike a post
//access private

router.put('/unlike/:id', auth , async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
      /*  if(!post){
            return res.status(404).json({message : ' post not found'}) ;
        }*/
        // check if post liked
        if(post.likes.filter(like => like.user.toString()===req.user.id).length === 0){
            return res.status(400).json({ message : 'post not liked'})
        }
       //get remove index
       const removeIndex= post.likes.map(like => like.user.toString()).indexOf(req.user.id);
       post.likes.splice(removeIndex , 1);
        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

/********************************************************** */
//@route GET api/posts/comment/:id
// @desc create comment for a post
//access private
router.post('/comment/:id',[auth,
    check('text','text is required').not().isEmpty(),
], async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);
    const newComment={
        text : req.body.text,
        name : user.name , 
        avatar : user.avatar, 
        user : req.user.id 
    };
    post.comments.unshift(newComment);
   // post.comments.unshift(newComment);
    await post.save();
  
    res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
   
});
//@route delete api/posts/comment/:id/:comment_id
// @desc delete comment for a post
//access private
router.delete('/comment/:id/:comment_id' , auth , async (req,res)=>{
     try {
       // const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        // get comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // comment exist 
        if(!comment) return res.status(404).json({msg : 'comment does not exist'});
        // user check 
        if(comment.user.toString() !== req.user.id) return res.status(401).json({msg : 'user not authrized'});
         //get remove index
    
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
       // console.log(removeIndex);
        // Splice comment out of array
        post.comments.splice(removeIndex, 1);
       
        await post.save();
        res.json(post.comments);
     } catch (error) {
         console.error(error.message);
         res.status(500).send('server error');
             }
});

module.exports=router;