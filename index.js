const express = require("express");
const dotenv = require("dotenv")
const cors = require("cors");
const connectDb = require("./DB/db")
const cookieParser = require('cookie-parser')
const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")

// middleware
const app = express();
dotenv.config({})
const options = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cookieParser())
app.use(cors(options));
app.use("/auth", authRouter)
app.use("/user", userRouter)

app.get("/", (req, res) => {
    res.send("hello ")
})


const port = process.env.PORT || 8000
connectDb().then(() => {
    app.listen(port, () => {
        console.log("server is listen on", port)
    })
}).catch((error) => {
    console.log(error)
})
