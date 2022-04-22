/* init */
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

/* init middleware */
app.use(cors());
app.use(express.json())

// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.fykr4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run(){
    try{
        await client.connect();
        const blogCollection = client.db("blogs-db").collection("blogs");
        
        /* Send Data on MONGODB  */
        app.post("/blogs", async(req, res) =>{
            const blogContent = req.body;
            const result = await blogCollection.insertOne(blogContent); 
            res.send(result)
        })
        /* Get data on MongoDB  */
        app.get("/blogs", async(req, res) =>{
            const queryText = req.query?.title?.toLowerCase();
            console.log(queryText);
            const result = await blogCollection.find({});
            const blogsData = await result.toArray();
            const filteredData = blogsData.filter(blog => blog.title.toLowerCase().includes(queryText))
            res.send(blogsData);
           
        })
        /* Search data on MongoDB  */
        app.get("/blogs/search", async(req, res) =>{
            const queryText = req.query?.title?.toLowerCase();
            const result = await blogCollection.find({});
            const blogsData = await result.toArray();
            const filteredData = blogsData.filter(blog => blog.title.toLowerCase().includes(queryText))
            res.send(filteredData); 
        })

       /*  update data on mongoDB */
       app.put("/blogs/:id", async(req, res) => {
           const id = req.params.id;
           const article = req.body;
           const filter = { _id: ObjectId(id) };
           const options = { upsert: true };
           const updateDoc = {
            $set: {
              title: article.title,
              category: article.category,
              description: article.description,
              url: article.url
            },
          };

          const result = await blogCollection.updateOne(filter, updateDoc, options)
          res.send(result)

       })

        /* delete data on MongoDB */
        app.delete("/blog/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await blogCollection.deleteOne(query)
           res.send(result);
        })




    }finally{
        /* client.close(); */
    }
};

run().catch(console.dir)

app.get("/", (req, res) =>{
    res.send("YAH!! we got a new api url")
})



/* listen */
app.listen(port, ()=>{
    console.log(`START SERVER ON ${port}`);
})