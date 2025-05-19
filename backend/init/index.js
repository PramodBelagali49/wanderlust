const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")
require("dotenv").config()

main()
    .then(() => {
        console.log("connected to DB")
    })
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({
        ...obj, 
        // owner: "6803877dbcb6a99e15763edb", // Hi Contributer, please change the owner to your user id 
    }))
    await Listing.insertMany(initData.data)
    console.log("data was initialized")
}

initDB()
