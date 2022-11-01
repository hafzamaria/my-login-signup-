import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { 
    stringToHash
} from "bcrypt-inzi"
// import {stringToHash} from 'bcrypt-inzi'///npm i bcrypt-inzi


 let dbURI ='mongodb+srv://abcd:abcd@cluster0.0nsp7aq.mongodb.net/mySocialMediaBase?retryWrites=true&w=majority';
mongoose.connect(dbURI);

const app = express();
app.use (express.json());
app.use ( cors());
const port = process.env.PORT || 5000;

const userSchema = new mongoose.Schema({ ///from mongoose
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    createdOn:{ type: Date, default: Date.now },
  });
const userModel = mongoose.model('User', userSchema);

// app.post('/signup',(req , res)=>{////from expres.js

//     let body = req.body;

//     if(!body.firstName 
//     ||!body.lastName
//     ||!body.email
//     ||!body.password
//     ){
//       res.status(400).send(`required field missing:
//       {
//         "firstName":"Maria",
//         "lastName":"Imran",
//         "email":"abc@gmail.com",
//         "password":"12345"
//       }
//    `);
//    return;
//     }
//     userModel.findOne({email:body.email},(err,data)=>{
//        if(!err){
//         console.log(err)
//         console.log("data:",data);
//         if(data){//already exist
//             console.log({message:"user already exist:",data});
//             res.status(400).send({message:"user already exist, please try another email"});
//             return;
//         }else{
//             stringToHash(body.password).then(hashString=>{
//                 let newUser =userModel({
//                     firstName:body.firstName,
//                     lastName:body.lastName,
//                     email:body.email.toLowerCase(),
//                     password:hashString
//                 })
//                 newUser.save((err,result)=>{
//                     if(!err){
//                         console.log("data saved:",result)
//                         res.status(201).send({message:'user is created'});
//                     }else{
//                         console.log('db error:',err)
//                         res.status(500).send({message:'internal server error'})
//                     }
            
//                 });
//             })
//         }
//        } else{
//         console.log('db error:',err);
//         res.status(500).send({message:"db error in query"});
//        }
//     })

// })
app.post("/signup", (req, res) => {

    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user already exist // query email user
    userModel.findOne({ email: body.email }, (err, data) => {
        if (!err) {
            console.log("data: ", data);

            if (data) { // user already exist
                console.log("user already exist: ", data);
                res.status(400).send({ message: "user already exist,, please try a different email" });
                return;

            } else { // user not already exist

                stringToHash(body.password).then(hashString => {
                //  let newUser= new userModel({
                    userModel.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email.toLowerCase(),
                        password: hashString
                    },
                        (err, result) => {
                            if (!err) {
                                console.log("data saved: ", result);
                                res.status(201).send({ message: "user is created" });
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "internal server error" });
                            }
                        });
                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
            return;
        }
    })
});

app.post("/login", (req, res) => {

  let body = req.body;

  if (!body.email || !body.password) {
      res.status(400).send(
          `required fields missing, request example: 
              {
                  "email": "abc@abc.com",
                  "password": "12345"
              }`
      );
      return;
  }

  let isFound = false; // https://stackoverflow.com/a/17402180/4378475

  for (let i = 0; i < userBase.length; i++) {
      if (userBase[i].email === body.email) {

          isFound = true;
          if (userBase[i].password === body.password) { // correct password

              res.status(200).send({
                  firstName: userBase[i].firstName,
                  lastName: userBase[i].lastName,
                  email: userBase[i].email,
                  message: "login successful",
                  token: "some unique token"
              })
              return;

          } else { // password incorrect

              res.status(401).send({
                  message: "incorrect password"
              })
              return;
          }
      }
  }

  if (!isFound) {
      res.status(404).send({
          message: "user not found"
      })
      return;
  }
})

   

app.use(express.json()); app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () { //connected
    console.log("mongoose connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});


process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

//////////////////////////////////////