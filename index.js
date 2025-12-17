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
    origin: (origin, callback) => {
        const allowedOrigins = [process.env.BASE_URL];
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || !process.env.BASE_URL) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
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
