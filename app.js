require('dotenv').config();
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');


app.use(
    fileUpload({
        extended: true,
    })
)

app.use(express.static(__dirname))

app.use(express.json())

const path = require('path')
const ethers = require('ethers')

const port = 3000

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL)

const signer = new ethers.Wallet(PRIVATE_KEY, provider)

const contractInstatce = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)


app.get('/index.html', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post("/addcandidate", async(req, res) =>{
    const { vote } = req.body;
    console.log(vote)

    const storeDataInBlockchain = async (vote) =>{
        const tx = await contractInstatce.addCandidate(vote)
        await tx.wait()
    }

    const bool = await contractInstatce.getVotingStatus()

    if (bool == true){
        await storeDataInBlockchain(vote)
        res.send("The candidate has been registered in the smart contract")
    }else {
        res.send("Voting is finished");
    }
})

app.listen(port, ()=>{
    console.log('listening on port', port);
})