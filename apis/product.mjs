import express from 'express';
import { userModel, productModel } from './../dbRepo/models.mjs'
import mongoose from 'mongoose';

const router = express.Router()


router.post("/product", (req, res) => {

    const body = req.body;
    // validation
    if ( 
        !body.name
        || !body.price
        || !body.description
    ) {
        res.status(400).send({
            message: "required parameters missing",
        });
        return;
    }
  
    
  
    productModel.create({
        name: body.name,
        price: body.price,
        description: body.description,
        owner:new mongoose.Types.ObjectId(body.token._id)
    },
        (err, saved) => {
            if (!err) {
                console.log(saved);
  
                res.send({
                    message: "product added successfully"
                });
            } else {
                res.status(500).send({
                    message: "failed to add product"
                })
            }
        })
  })
  
router.get("/products", (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.body.token._id);

      productModel.find({ owner: userId, isDeleted: false },
        {},
         {
            sort: { "_id": -1 },
            limit: 100,
            skip: 0
        },
         (err, data) => {
        if (!err) {
          res.send({
            message: "got all products successfully",
            data: data
          });
        } else {
          res.status(500).send({
            message: "Get request  error",
          });
        }
      });
    });
  
router.delete('/product/:id', (req, res) => {
      const id = req.params.id;
  
      productModel.deleteOne({ editingId: id }, (err, deletedData) => {
          console.log("deleted: ", deletedData);
          if (!err) {
  
              if (deletedData.deletedCount !== 0) {
                  res.send({
                      message: "Product has been deleted successfully",
                  })
              } else {
                  res.status(404);
                  res.send({
                      message: "No Product found with this id: " + id,
                  })
              }
  
  
          } else {
              res.status(500).send({
                  message: "delete error"
              })
          }
      });
  })
  
router.put('/product/:id', async (req, res) => {
  
      const body = req.body;
      const id = req.params.id;
  
      if (
          !body.name ||
         !body.price ||
         !body.description
      ) {
          res.status(400).send(` required parameter missing. example request body:
          {
              "name": "  body.name,",
              "price": "body.price",
              "description": "body.description"
          }`)
          return;
      }
  
      try {
          let data = await productModel.findByIdAndUpdate(id,
              {
                  name: body.name,
                  price: body.price,
                  description: body.description
              },
              { new: true }
          ).exec();
  
          console.log('updated: ', data);
  
          res.send({
              message: "product modified successfully",
              data: products
          });
  
      } catch (error) {
          res.status(500).send({
              message: "update error"
          })
      }
  })
  






export default router