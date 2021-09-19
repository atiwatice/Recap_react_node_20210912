const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

app.use(express.json())
var database

const options = {
    definition: {
        openapi : '3.0.0',
        info: {
            title: 'Node JS API Project for mongodb',
            version: '1.0.0'
        },
        servers: [
            {
                url:'http://localhost:8081/'
            }
        ]
    },
    apis:['./mongodb.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpec))

/**
 * @swagger
 * /:
 *  get:
 *      summary: This api is used to check if get method is working or not
 *      description: This api is used to check if get method is working or not
 *      responses:
 *          200:
 *              description: To test Get method
 */
app.get('/',(req,res)=>{
    res.send('Welcome to Mongodb API')
})

/**
 * @swagger
 *  components:
 *      schemas:
 *          Book:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  id:
 *                      type: integer
 *                  title:
 *                      type: string
 */

/**
 * @swagger
 * /api/books:
 *  get:
 *      summary: To get all books from mongodb
 *      description: This api is used to fetch data from mongodb
 *      responses:
 *          200:
 *              description: This api is used to fetch data from mongodb
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book'
 */

app.get('/api/books',(req,res)=>{
    database.collection('books').find({}).toArray((err,result)=>
    {
        if(err) throw err
        res.send(result)
    })
})

/**
 * @swagger
 * /api/books/{id}:
 *  get:
 *      summary: To get all books from mongodb
 *      description: This api is used to fetch data from mongodb
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Number ID required
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: This api is used to fetch data from mongodb
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book'
 */

app.get('/api/books/:id',(req,res)=>{
    database.collection('books').find({id:parseInt(req.params.id)}).toArray((err,result)=>
    {
        if(err) throw err
        res.send(result)
    })
})

/**
 * @swagger
 * /api/books/addBook:
 *  post:
 *      summary: Used to insert data to mongodb
 *      description: This api is used to fetch data from mongodb
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Book'
 *      responses:
 *          200:
 *              description: Added successfully
 */

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

/**
 * @swagger
 * /api/books/{id}:
 *  put:
 *      summary: Used to update data to mongodb
 *      description: This api is used to fetch data from mongodb
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Number ID required
 *            schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Book'
 *      responses:
 *          200:
 *              description: Updated successfully
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book' 
 */

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

/**
 * @swagger
 * /api/books/{id}:
 *  delete:
 *      summary: This api is used to delete record from mongodb database
 *      description: This api is used to fetch data from mongodb
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Number ID required
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Data is deleted
 */

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