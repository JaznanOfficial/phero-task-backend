const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
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
        } )






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
