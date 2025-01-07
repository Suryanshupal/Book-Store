const router = require('express').Router();
const bodyParser = require('body-parser')
const User = require("../models/user");  
const jwt = require('jsonwebtoken')
const {authenticateToken} = require("./userAuth")
const book = require('../models/book')

const express = require('express');
const app = express();
app.use(bodyParser.json());

//add book --admin
router.post("/add-book", bodyParser.json(), authenticateToken, async(req ,res)=>{
    try {
        const {id} = req.headers 
        const user = await User.findById(id);
        if(user.role  !==  "admin"){
            return res.status(400).json({ message: "You do not have admin access"})
        }

        const newBook = new book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        })
        await newBook.save();
        res.status(200).json({message: "Book added successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})

//update book --admin
router.put("/update-book", bodyParser.json(), authenticateToken, async(req, res)=> {
    try {
        const { bookid } = req.headers;
        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required in params" });
        }
        await book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        return res.status(200).json({
            message: "Book updated successfully"
        })
    } catch (error) {
        return res.status(500).json({ message: "An error occurred"})
    }
})
// router.put("/update-book", bodyParser.json(), authenticateToken, async (req, res) => {
//     try {
//         const { bookid } = req.headers;
//         if (!bookid) {
//             return res.status(400).json({ message: "Book ID is required in headers" });
//         }

//         const { url, title, author, price, desc, language } = req.body;
//         if (!url || !title || !author || !price || !desc || !language) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const updatedBook = await book.findByIdAndUpdate(
//             bookid,
//             { url, title, author, price, desc, language },
//             { new: true }
//         );

//         if (!updatedBook) {
//             return res.status(404).json({ message: "Book not found" });
//         }
//         console.log(bookid);
//         return res.status(200).json({ message: "Book updated successfully", book: updatedBook });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "An error occurred", error: error.message });
//     }
// });


//delete book --admin
router.delete("/delete-book" , authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers; 
        await book.findByIdAndDelete(bookid);
        return res.status(200).json({
          message: "Book deleted successfully!",
        })    
    } catch (error) {
      return res.status(500).json({ message : "An error occurred"})  
    }
})

//get all books 
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await book.find().sort({ createdAt: -1});
        return res.json({
            status: "Success",
            data: books,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred"})
    } 
})

//get recently added books limit 4
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await book.find().sort({ createdAt: -1}).limit(4);
        return res.json({
            status: "Success",
            data: books,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred"})
    } 
})

//get book by id
router.get("/get-book-by-id/:id",bodyParser.json(), async (req, res) => {
    try {
        const { id  } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required in params" });
        }
        const Book = await book.findById(id);
        if (!Book) {
               return res.status(404).json({ message: "Book not found" });
        }
        // console.log(Book);
        return res.json({
            status: "Success",
            data:Book,
        }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred"})
    }
})


module.exports = router; 