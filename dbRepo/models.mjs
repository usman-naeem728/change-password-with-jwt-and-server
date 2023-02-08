import mongoose from 'mongoose';


let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    description: String,
    owner:{type: mongoose.ObjectId, required: true},
    createdOn: { type: Date, default: Date.now }
});
 export const productModel = mongoose.model('products', productSchema);
 

  
let userSchema= new mongoose.Schema({
    firstName : { type: String },
    lastName :{ type: String },
    email : { type: String, required: true }, 
    password :  { type: String, required: true },
})

export const userModel= mongoose.model("user", userSchema);





const mongodbURI = process.env.mongodbURI || "mongodb+srv://userdb123:0987654321@clusterdb.ubzqlp7.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
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