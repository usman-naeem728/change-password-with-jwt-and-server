import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import AuthApis from './apis/auth.mjs'
import ProductApis from './apis/product.mjs'
import { userModel } from './dbRepo/models.mjs';

const port = process.env.PORT || 5001;
const app = express()

mongoose.set('strictQuery', true);
const SECRET = process.env.SECRET || "topsecret";
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000', 'https://authentication-9baa4.web.app', "*"],
  credentials: true
}));

const getUser = async (req, res) => {

  let _id = "";

  if (req.params.id) {
    _id = req.params._id
  } else {
    _id = req.body.token._id
  }


  try {
    const user = await userModel.findOne({ _id: _id }, "email firstName lastName -id").exec()
    if (!user) {
      res.status(404).send({})
    } else {
      res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store"
      });
      res.status(200).send(user)
      console.log("this is user", user)
    }


  } catch (error) {

    console.log("errors", error);

    res.status(500).send({
      message: "something went wrong on server",
    })
  }


}


app.use('/api/v1', AuthApis)

app.use("/api/v1", (req, res, next) => {

  console.log("req.cookies: ", req.cookies);

  if (!req?.cookies?.Token) {
    res.status(401).send({
      message: "include http-only credentials with every request"
    })
    return;
  }

  jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
    if (!err) {
      console.log("decodedData :", decodedData)
      const nowDate = new Date().getTime() / 1000;



      if (decodedData.exp < nowDate) {
        res.status(401)
        res.cookie('Token', '', {
          maxAge: 1,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          httpOnly: true


        });
        res.send({ message: "token expired" })
      } else {

        console.log("token approved");

        req.body.token = decodedData
        next();
      }
    }
    else {
      res.status(401).send("invalid token")
    }

  });

});


app.use('/api/v1', ProductApis)

app.get('/api/v1/profile', getUser)

app.get('/api/v1/profile/:id', getUser)

app.post('/api/v1/change-password', (req, res) => {
  const body = req.body;

  const currentPassword = body.currentPassword;
  const newPassword = body.newPassword;
  const _id = req.body.token._id

  // check if user exist
  userModel.findOne({ _id : _id },
    "password ",
    (err, data) => {
      if (!err) {
        console.log("data: ", data);

        //user found
        if (data) {
          varifyHash(currentPassword, data.password).then(isMatched => {
            console.log("isMatched: ", isMatched);

            if (isMatched) {
              stringToHash(newPassword).then((newHash)=>{
                userModel
              }) 

              res.send({
                message: "Login Succesful",
                profile: {
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  age: data.age,
                  _id: data._id
                }
              });
              return;

            } else {
              console.log("password did not match");
              res.status(401).send({ message: "Incorrect email or password" });
              return;
            }


          });

        } else {
          console.log("user not found");
          res.status(401).send({ message: "user not found" });
          return;
        }
      }
      else {
        console.log("db error: ", err);
        res.status(500).send({ message: "login failed, please try later" });
        return;
      }
    });


})

const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './authentication/build')))
app.use('*', express.static(path.join(__dirname, './authentication/build')))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})