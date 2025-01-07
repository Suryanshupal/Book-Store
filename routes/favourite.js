const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//add book to favourite
router.put("/add-book-to-favourite" , authenticateToken, async(req,res)=>{
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if (isBookFavourite) {
            return res
            .status(200)
            .json({ message: "Book is already in favourites"})
        }
        await User.findByIdAndUpdate(
                    id,
                    { $push: { favourites: bookid } },
                    { new: true }
                  );
        return res.status(200).json({ message: "Book added to favourites"})
    } catch (error) {
        res.status(500).json({ message: "Internal server error"})
    }
})


// router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
//     try {
//       // Destructure bookId and id from request body
//       const { bookid, id } = req.headers;
  
//       // Validate input
//       if (!bookid || !id) {
//         return res.status(400).json({ message: "Invalid or missing bookId or userId" });
//       }
  
//       // Find user by ID
//       const userData = await User.findById(id);
//       if (!userData) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       // Ensure favourites is an array
//       if (!Array.isArray(userData.favourites)) {
//         userData.favourites = [];
//       }
  
//       // Check if the book is already in favourites
//       const isBookFavourite = userData.favourites.includes(bookid);
//       if (isBookFavourite) {
//         return res.status(200).json({ message: "Book is already in favourites" });
//       }
  
//       // Add book to favourites
//       await User.findByIdAndUpdate(
//         id,
//         { $push: { favourites: bookid } },
//         { new: true }
//       );
  
//       return res.status(200).json({ message: "Book added to favourites" });
//     } catch (error) {
//       console.error("Error adding book to favourites:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   });
  



//remove book from favourite
router.put("/remove-book-from-favourite" , authenticateToken, async(req,res)=>{
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if (isBookFavourite) {
            await User.findByIdAndUpdate(id,{$pull:{ favourites: bookid}})
        }
        return res.status(200).json({ message: "Book removed from favourites"})
    } catch (error) {
        res.status(500).json({ message: "Internal server error"})
    }
})

//get favourite books of a particular user 
router.get("/get-favourite-books", authenticateToken, async (req,res)=>{
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
        return res.json({
            status: "Success",
            data: favouriteBooks,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred"})
    }
})

// router.get("/get-favourite-books", authenticateToken, async (req, res) => {
//     try {
//       // Extract the user ID (e.g., from headers, query, or body)
//       const { id } = req.headers; // Adjust as per your setup
  
//       // Validate the ID
//       if (!id) {
//         return res.status(400).json({ message: "User ID is required" });
//       }
  
//       // Find the user and populate the favourites
//       const userData = await User.findById(id).populate("favourites");
        
//       // Check if the user exists
//       if (!userData) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       // Get the favourite books
//       const favouriteBooks = userData.favourites;
//       console.log(favouriteBooks)
//       // Respond with the data
//       return res.json({
//         status: "Success",
//         data: favouriteBooks,
//       });
//     } catch (error) {
//       // Log detailed error for debugging
//       console.error("Error fetching favourite books:", error);
//       return res.status(500).json({ message: "An error occurred" });
//     }
//   });
  

module.exports = router;