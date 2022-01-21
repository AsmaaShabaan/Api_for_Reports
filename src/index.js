const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('./db/mongoose')
const timestamp = require('express-timestamp')
app.use(timestamp.init)
app.use(express.json())
const userRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
app.use(userRouter)
app.use(newsRouter)
app.listen(port,()=>{console.log('Listening on port 3000')})

