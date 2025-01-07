const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

//placed order
router.post("/place-order",bodyParser.json(), authenticateToken, async (req, res)=>{
    try {
        const { id } = req.headers;
        const { order } = req.body;
        
        for(const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();             
            //saving Order in user model
            await User.findByIdAndUpdate(id, {
                $push: { orders : orderDataFromDb._id},
            });
            // if(orderData){return res.json({ message:"orderId found",orderId: orderData._id})}

 
            //clearing cart
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id},
            });
        }
        return res.json({
            status : "Success",
            message: "Order Placed Successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"})
    }
})


  




//get order history of particular user
router.get("/get-order-history", authenticateToken, async(req,res) => {
    try {
        const { id } = req.headers;    
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });
        const ordersData = userData.orders.reverse();
        return res.json({
            status: "Status",
            data: ordersData,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"})
    }
} )

//get-all-orders  --admin
router.get("/get-all-order", authenticateToken, async(req,res) => {
    try {
        const userData = await Order.find()
        .populate({ path: "book",})
        .populate({ path: "user",})
        .sort({ createdAt: -1,})
        
        return res.json({
            status: "Success",
            data: userData,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"})
    }
} )

//update order  --admin
router.put("/update-status/:id", authenticateToken, async(req,res)=> {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, { status: req.body.status });
        return res.json({
            status: "Success",
            message: "Status Update Successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" })
    }
})

module.exports = router;