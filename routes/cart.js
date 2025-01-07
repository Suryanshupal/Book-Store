const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//put book to cart
router.put("/add-to-cart", authenticateToken, async (req,res)=>{
    try {
        const { bookid,id } = req.headers;

      // Find user by ID
      const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        const isBookInCart = userData.cart.includes( bookid );
        if ( isBookInCart ){
            return res.json({
                status: "Success",
                message:'Book is already in cart',
            });
        }
        await User.findByIdAndUpdate(id , {$push:{ cart: bookid}})

        return res.json({
            status: "Success",
            message: "Book added to cart",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "An error occurred"})
    }
})

//remove from cart
router.put("/remove-from-cart/:bookId", authenticateToken, async(req,res)=>{
    try {
        const { bookId } = req.params;
        const { id } = req.headers;
        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookId},
        })

        return res.json({
            status: "Success",
            message: "Book removed from cart",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred"})
    }
})

//get cart of particular user
router.get("/get-user-cart", authenticateToken, async(req,res)=>{
    try {
        const { id } = req.headers;        
        const userData = await User.findById(id).populate("cart");
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        const cart = userData.cart.reverse(); 

        return res.json({
            status: "Success",
            data: cart,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred"})
    }
})

module.exports = router;