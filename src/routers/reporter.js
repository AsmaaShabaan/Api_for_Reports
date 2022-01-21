const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middelware/auth')
// signup
router.post('/signup', async (req, res) => {
    try{
        const reporter = new Reporter(req.body) 
        await reporter.save()
        const token = await reporter.generateToken()
        res.status(200).send({reporter,token})
       
        
    }
    catch(e){
        res.status(400).send(e)
    }

})
//////////////////////////////////////////////////////////////////////////

// login

router.post('/login',async (req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

////////////////////////////////////////////////////////////////////////////////

// profile 
router.get('/profile',auth,async(req,res)=>{
    res.send(req.reporter)
})


///////////////////////////////////////////////////////////////////////////////
// update

router.patch('/reporters/:id',auth,async (req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
   try{
       const reporter = await Reporter.findById(_id)
       if(!reporter){
        return res.status(404).send('Unable to find reporter')
    }
       console.log(reporter)
       updates.forEach((update)=> (reporter[update] = req.body[update]))
       await reporter.save()
       res.status(200).send(user)
   }catch(e){
       res.status(400).send(e.message)
   }
})

////////////////////////////////////////////////////////////////////////////////

// delete 
router.delete('/reporters/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const reporter = await Reporter.findByIdAndDelete(_id)
        if(!reporter){
            return res.status(404).send('No reporter is found')
        }
        res.send(reporter)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
///////////////////////////////////////////////////////////////////////////////

// logout 

router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((rep)=>{
            return rep !== req.token
        })
        await req.reporter.save()
        res.send('Logout Successfully')
    }
    catch(e){
       res.status(500).send(e.message)
    }
})
// //////////////////////////////////////
// logoutall 
router.delete('/logoutall',auth,async(req,res)=>{
   try{
        req.reporter.tokens = []
    await req.reporter.save()
    res.send('Logout all was done successfully')
   }
   catch(e){
       res.send(e)
   }
   
})











////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// description : required trim string
// completed : boolean default false
// routers --> CRUD operations async/ await 
// test

module.exports = router
