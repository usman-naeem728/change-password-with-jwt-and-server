import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import AuthApis from './apis/auth.mjs'
import ProductApis from './apis/product.mjs'
import { userModel } from './dbRepo/models.mjs';
import { stringToHash, varifyHash } from 'bcrypt-inzi'

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

  jwt.verify(req.cookies.Token, SECRET, function (err, decodeduser) {
    if (!err) {
      console.log("decodeduser :", decodeduser)
      const nowDate = new Date().getTime() / 1000;



      if (decodeduser.exp < nowDate) {
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

        req.body.token = decodeduser
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

app.post('/api/v1/change-password', async (req, res) => {
  try {
    const body = req.body;

    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;
    const _id = req.body.token._id

    // check if user exist
    const user = await userModel.findOne({ _id: _id },
      "password ",
    ).exec()

    if (!user) throw new Error("user not find")
    //user found
    const isMatched = await varifyHash(currentPassword, user.password)
    console.log("isMatched: ", isMatched);

    if (!isMatched) throw new Error("password missmatch")


    const newHash = await stringToHash(newPassword);

    await userModel.updateOne({ _id: _id }, { password: newHash })
    res.send({
      message: "password change Succesfully"
    });
    return;

  } catch (error) {
    console.log("error", error);
    res.status(500).send("error");
  }
})

const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './authentication/build')))
app.use('*', express.static(path.join(__dirname, './authentication/build')))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})