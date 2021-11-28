const express = require('express')
require('dotenv').config()
const app = express()
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 7000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o6kvc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('BicycleTour');
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders')
        const reviewCollection = database.collection('review')
        const blogsCollection = database.collection("blogs")
        const clientsCollection = database.collection("clients")



        app.post('/users', async (req, res) => {
           
            const user = req.body;
           
            const result = await usersCollection.insertOne(user);

            res.json(result)
        });


        app.put('/users', async (req, res) => {

            const user = req.body.email;
            const filter = { email: email }

            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    email: email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
;

            res.json(result)
        });



        app.get("/blogs", async (req, res) => {
            const result = await blogsCollection.find({}).toArray()
            res.send(result)
        })
        // Get All Client Logo
        app.get("/clients", async (req, res) => {
            const result = await clientsCollection.find({}).toArray()
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
            
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            // console.log(req);
            const service = await productsCollection.findOne(query);
            res.json(service);
        });


        // Add NEW Products API
        app.post('/products', async (req, res) => {
            // console.log(req.body);
            const result = await productsCollection.insertOne(req.body);
            res.send(result);
        });

        app.post('/addOrders', async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        });

    
        app.get("/myOrders/:email", async (req, res) => {
            // console.log(req.params.email);
            const result = await ordersCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        });
        app.post('/addSReview', async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.send(result);
        });
        app.put("/admin", async (req, res) => {
            const email = req.body.userEmail
            const filter = { userEmail: email }
            const updateDoc = { $set: { role: "Admin" } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })
        app.delete("/orders/:orderId", async (req, res) => {
            const orderId = req.params.orderId
            const filter = { _id: ObjectId(orderId) }
            const result = await ordersCollection.deleteOne(filter)
            res.json(result)
        })
        app.get("/allOrders", async (req, res) => {
            const result = await ordersCollection.find({}).toArray()
            res.send(result)
        })
        app.put("/orders/:orderId", async (req, res) => {
            const orderId = req.params.orderId
            const update = req.body
            const filter = { _id: ObjectId(orderId) }
            const options = { upsert: true };
            const updateDoc = { $set: { status: update } }
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        app.get("/orders", async (req, res) => {
            const find = req.query.email
            const filter = { email: find }
            const result = await ordersCollection.find(filter).toArray()
            res.send(result)
        })
        app.post("/orders/", async (req, res) => {
            const order = req.body
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        // Post a Review
        app.post("/reviews", async (req, res) => {
            const review = req.body
            const result = await reviewsCollection.insertOne(review)
            res.json(result)
        })
        // Get All Reviews
        app.get("/reviews", async (req, res) => {
            const result = await reviewsCollection.find({}).toArray()
            res.send(result)
        })
        app.get("/checkAdmin/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result=await usersCollection.findOne(query)
            if (result?.role === "admin") {
            res.json({ role: "admin" });
            }else {
            res.json({})
            }


           
        })
        

    }
    
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World! je he')
})

app.listen(port, () => {
    console.log(` listening at${port}`)
})