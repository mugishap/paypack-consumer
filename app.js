const express = require('express');
const dotenv = require('dotenv');
const http = require('http')
const paypack = require("paypack-js");
const bodyParser = require('body-parser')
const cors = require('cors')

dotenv.config();

const app = express();
const server = http.createServer(app);
const { CLIENT_ID, CLIENT_SECRET, ENVIRONMENT } = process.env;
app.use(express.json());
app.use(bodyParser.json({}))
app.use(cors({ origin: '*' }))

paypack.config({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
});

app.post('/pay', async (req, res) => {
    const { amount, phone } = req.body;
    if (!amount || !phone) return res.status(400).json({ success: false, message: "Please provide amount and phone number" })
    paypack.cashin({
        number: phone,
        amount: amount,
        environment: ENVIRONMENT,
    })
        .then((data) => {
            console.log(data.data);
            return res.status(200).json({ success: true, message: "Payment initiated successfully" })
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({ success: false, message: err.message })
        });
})


server.listen(3000, () => {
    console.log('Server is running on port 3000');
});