const express = require('express')
const MongoClient = require('mongodb').MongoClient

const app = express()

app.use(express.json())
var database

app.get('/',(req,res)=>{
    res.send('Welcome to Mongodb API')
})

app.get('/api/books',(req,res)=>{
    database.collection('books').find({}).toArray((err,result)=>
    {
        if(err) throw err
        res.send(result)
    })
})

app.get('/api/books/:id',(req,res)=>{
    database.collection('books').find({id:parseInt(req.params.id)}).toArray((err,result)=>
    {
        if(err) throw err
        res.send(result)
    })
})

app.post('/api/books/addBook',(req,res)=>{
    let resu = database.collection('books').find({}).sort({id:-1}).limit(1)
    resu.forEach(obj=>{
        if(obj){
            let book ={
                id:obj.id+1,
                title: req.body.title
            }
            database.collection('books').insertOne(book,(err,result)=>{
                if(err) res.status(500).send(err)
                res.send("add Successfully")
            })
        }
    })
})

app.put('/api/books/:id',(req,res)=>{
   let query = {id: parseInt(req.params.id)}
   let book = {
       id: parseInt(req.params.id),
       title: req.body.title
   }
   let dataSet = {
       $set: book
   }
   database.collection('books').updateOne(query,dataSet,(err,result)=>{
       if(err) throw err
       res.send(book)
   })

})

app.delete('/api/books/:id',(req,res)=>{
   database.collection('books').deleteOne({id:parseInt(req.params.id)},(err,result)=>{
       if(err) throw err
       res.send('Book is deleted')
   })
 
 })


app.listen(8081,()=>{
    MongoClient.connect('mongodb://localhost:27017',{
        useNewUrlParser:true
    },(error,result)=>{
        if(error) throw error;
        database = result.db('mydatabase')
        console.log("Connect successful")
    })
})