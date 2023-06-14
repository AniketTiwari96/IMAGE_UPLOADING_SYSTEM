
const express=require('express')
const app=express()
const port=4000
const path = require('path')
// const bodyParser = require('body-parser');
const bodyParser = require('body-parser')



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

const router=require('./router/create_router')

app.use('/image', express.static('Images'));
app.use('/image', express.static(path.join(__dirname, 'Images')));


app.use(express.json())

app.use('/',router)



app.listen(port,()=>{
    console.log(`this server is runing on ${port}`);
})




// cloudinary.config({ 
//     cloud_name: 'dadiugb1i', 
//     api_key: '963744531982437', 
//     api_secret: '***************************' 
// });