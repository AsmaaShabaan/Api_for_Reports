const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middelware/auth')

// Post
router.post('/news',auth,async(req,res)=>{
    try{
        const news = new News({...req.body,reporter:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

// patch 
router.patch('/news/:_id',auth,async(req,res)=>{
    try{
        const id = req.params._id
        const news = await News.findOneAndUpdate({_id:id,reporter:req.reporter._id},req.body,{
            new:true,
            runValidators:true
        })
        if(!news){
          return res.send('No news')
        }
        res.send(news)
    }
    catch(e){
        res.send(e.message)
    }
})

router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const _id  = req.params.id
        const news = await News.findOneAndDelete({_id,reporter:req.reporter._id})
        if(!news){
            return res.status(404).send('No news')
        }
        res.send(news)
    }
    catch(e){
        res.send(e.message)
    }
})



module.exports = router