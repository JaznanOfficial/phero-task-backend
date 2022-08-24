const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require('mongodb').ObjectId;
const PORT = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectID } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qpm5ky8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
// connect to the database

async function run() {
    try {
        const database = client.db("phero-job-task");
        const billData = database.collection("billing-data");

        app.get('/api/allBills', async (req, res) => {
            const query = {};
            const allBills = await billData.find(query).toArray();
            res.send(allBills);
        })
        
        app.post('/api/allBiills', async (req, res) => {
            const bill = req.body;
            console.log(bill);
            const result = await billData.insertOne(bill);
            res.send(result);
            console.log(result);
        })
        
        app.put('/api/updateBills/:id', async (req, res) => {
            const bill = req.body
            // console.log(bill);
            const id = req.params.id
            const { name, email, phone, amount } = bill
            const query = { _id: ObjectId(id) }
            // console.log(query);
            const updateStatus = {
                $set: {
                    name, email, phone, amount
                },
            }

            const option = {upsert:true}
            const result = await billData.updateOne(query, updateStatus, option)
            console.log(result);
            res.send(result)
        })

        app.delete('/api/deleteBill/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const result = await billData.deleteOne({_id: ObjectId(id)});
            res.send(result);
            console.log(result);
         })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// testing server------------
app.get("/", (req, res) => {
    res.send("welcome to phero job task server");
});

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});

