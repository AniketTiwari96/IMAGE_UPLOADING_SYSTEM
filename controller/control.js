
const knex=require('../dbconnection/connection');
const bcrypt = require('bcrypt');
const {createToken} = require('../jwt/jsonwebToken'); 

const createUser=async(req,res,next)=>{

    try {
        
        let { name,gmail, password } = req.body;
        const image =`http://localhost:4000/image/${req.file.filename}`; 


        password = await bcrypt.hash(password,10);

        let rows = await knex('student').select().where({gmail});

        if (rows.length > 0) {
            res.send({ message: 'You are allready done signUp Please go and login',"This is your data":rows });
            next()
        }
        else {
            let d = await knex('student').insert({name,gmail,password,profile:image});
            res.send({message:"data created successfuly....",stauts:req.body,profile:image})

            next()
        };
    }catch (error) {
        console.error(error.message);
        res.status(500).send({ error: 'Internal server error' });
        next()
     }
}

let home = (req,res)=>{
    res.render('index',{ error: null });
}

const loginUser = async(req, res) => {
    try {
        let {gmail,password} = req.body

        let data = await knex('student').where({gmail});
        console.log("data",data);
        if (!data) {
            return res.status(401).json({ error: 'Invalid username or password' });
          }

        let passwordMatch = await bcrypt.compare(password, data[0].password);
        let id = data[0].id   // here I got the id from the login user
        const token =  await createToken(id) // generatetoken here  // here aniket is secret key
        // console.log('token',token);

        res.cookie('cookie',token);
        res.redirect('http://localhost:4000/readData')
        // res.send({'login user data': data,"token": token})

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    }
    catch (error) {
        console.log(error);
        res.json({message:"please first signUp",error:error.message});
        
    }
};

  

let  loginPage = (req,res)=>{
    res.render('loginPage', { error: null }); // Pass the error as null initially

}


let  profileImage = (req,res)=>{
    res.render('imageUpload', { error: null }); // Pass the error as null initially

}

let uploadImageProfile = async(req,res,next)=>{
    try {
        let id = req.id__
        console.log(id);
        let userdata = await knex('student').where({ id: id });
        console.log(userdata);
        if(userdata.length>0){
            const fileData =`http://localhost:4000/image/${req.file.filename}`; 
            const existingData = await knex('student').select('proifleImage').where('id', id).first();
            console.log(existingData,'==========');
            console.log(existingData.profileImage,'============');

            let newData = [];

            if (existingData && existingData.proifleImage) {
                newData = JSON.parse(existingData.proifleImage);
                console.log('newData',newData);
            }

            newData.push(fileData);

            await knex('student').where('id', id).update({ proifleImage: JSON.stringify(newData) });

            console.log('Image uploaded successfully');

            res.send({ "user id": id, 'image uploaded successfully': req.body });
            next();
    
        }else{
            console.log('login first');
            res.send('login first')
            next()
        }
    } catch (error) {
        console.log(error);
        res.send(error) 
    }
}



const read_all_data = async (req, res, next) => {
    try {
      const rows = await knex('student');
      if (rows.length > 0) {

        let data = rows.map(row => {
          let proifleImages = [];
          if (row.proifleImage) {
            try {
              proifleImages = JSON.parse(row.proifleImage);
            } catch (error) {
              console.error('Error parsing proifleImage:', error);
            }
          }
          return {
            ...row,
            proifleImages: proifleImages
          };
        });
  
        res.render('student', { data: data });
        next()

      } else {
        res.send('There is no user data, please go and sign up');
      }
    } catch (error) {
      console.log(error);
      res.send('Data not found...');
    }
  };


const my_call = async (req, res, next) => {
    try {
      let id = req.id__;
      let rows = await knex('student').where({ id: id });
      if (rows.length > 0) {
        let data = rows.map(row => {
          let proifleImages = [];
          if (row.proifleImage) {
            try {
              proifleImages = JSON.parse(row.proifleImage);
            } catch (error) {
              console.error('Error parsing proifleImage:', error);
            }
          }
          return {
            ...row,
            proifleImages: proifleImages
          };
        });
        res.render('navbarPage', {data:data });
        next();
      } else {
        res.status(401).json({ error: 'Please login first' });
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
      next();
    }
  }
  

let updatePage = (req,res)=>{
    res.render('update',{ error: null });
}

// const update=async(req,res)=>{
//     try {
//         const id = req.id__ // find id with jwt logn user data
//         console.log('id',id);
//         let user = await knex('student').where({id});
//         console.log(user);
//         if (!user) {
//             return res.status(401).json({ error: 'Invalid username or password' });
//         };
//         let { name , gmail, password} = req.body;
//         const image =`http://localhost:4000/image/${req.file.filename}`; 
//         password = await bcrypt.hash(password,10);
//         console.log('============');
//         const data = await knex('student').where({id:id}).update({name,gmail,password,proifleImage:image});
//         res.json({"user id": id, 'update user data successfully ': req.body});

//         // let rows = await knex('student').select().where({gmail})
//         // if (rows.length == 0) {
//         //     res.json({ message: 'login first' });
//         // }
//         // else {           
           
//         // }
//     }
//     catch (error) {
//         console.log(error);
//         res.json({message:'Please login first'});
       
//     }
// };

const update = async (req, res) => {
    try {
      const id = req.id__;
      let user = await knex('student').where({ id });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      let { name, gmail, password } = req.body;
      const updateData = {}; // Empty object to store the fields to be updated
  
      if (name) {
        updateData.name = name; // Only update if name field is provided
      }
      if (gmail) {
        updateData.gmail = gmail; // Only update if gmail field is provided
      }
      if (password) {
        password = await bcrypt.hash(password, 10);
        updateData.password = password; // Only update if password field is provided
      }
      if (req.file) {
        const image = `http://localhost:4000/image/${req.file.filename}`;
        updateData.profile = image; // Only update if file is uploaded
      }  
      const data = await knex('student').where({ id: id }).update(updateData);
      // res.render('navbarPage', {data:data });

      res.json({ "user id": id, 'update user data successfully': req.body });
    } catch (error) {
      console.log(error);
      res.json({ message: 'Please login first' });
    }
  };
  
// this code for delete login user data
const deleteuserdata=async(req,res)=>{
    try {
        console.log('aniket tiwari');
        const id = req.id__ // find id with jwt logn user data
        console.log('================',id);
        let rows = await knex('student').where({ id: id });
        if(rows.length>0){
            const data=await knex('student').where({id:id}).del(id)
            res.send({info:'data delete successfuly....',"this is your data":rows}) 
            console.log('+++++++++++++++++++++++',data);
        }else{
            res.send({message:'sorry data not found.....',info:'login first'})
        }
    
    } catch (error) {
        console.log(error.message);
        res.send({err:error,message:'sorry data not found.....'})
        
    }
}

// this code for delete login user colomn data 
const deletedata = async (req, res) => {
    try {
      const id = req.id__;
      let rows = await knex('student').where({ id: id });
  
      if (rows.length > 0) {
        let columnName = req.params.column; // Column name from the route parameter
        console.log(columnName);
  
        if (columnName && rows[0].hasOwnProperty(columnName)) {
          const updateData = {};
          updateData[columnName] = null; // Set the column value to null to delete the data
  
          const condition = { id: id }; // Specify the condition to identify the row you want to update
          await knex('student').where(condition).update(updateData);
  
          res.send({ info: `Deleted ${columnName} successfully`, "this is your data": rows });
        } else {
          res.send({ message: 'Invalid column name or column not found' });
        }
      } else {
        res.send({ message: 'Sorry, data not found', info: 'Login first' });
      }
    } catch (error) {
      console.log(error.message);
      res.send({ err: error, message: 'Sorry, data not found' });
    }
  };
  
  


const delete_all_data=async(req,res)=>{
    try {
        const data=await knex('student').truncate()
        res.send('all data deleted seccessfuly......')
    } catch (error) {
        console.log(error.message);
        res.send({err:error,message:'there is no data'})
    }
}

const Logout = async(req,res)=>{
    try {
        let id = req.id__
        console.log(id,'============');
        let userdata = await knex('student').where({id});
        if(userdata.length>0){
            res.clearCookie('cookie')
            res.send("logout succefully")
            
        }else{
            res.send('login first')
            res.redirect('http://localhost:4000/login')
        }
        
    } catch (error) {
        res.send('login first')
    }

}



const homepage = (req,res)=>{
  res.render('homaPage',{ error: null });
  
}
module.exports={homepage,deleteuserdata,profileImage,uploadImageProfile,updatePage,loginPage,my_call,home,createUser,read_all_data,update,deletedata,delete_all_data,loginUser, Logout};
