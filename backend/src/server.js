const express = require("express")

const http = require("http")
const morgan = require("morgan")
const cors = require("cors")

const app = express()
const server = http.createServer(app)

const collabRoutes = require("./routes/collabsRoute")
const authRoutes = require("./routes/authRoute")
const userRoutes = require("./routes/userRoute")
const {errorHandler} = require("./middleware/errors")
const connectMongo = require("./config/mongo")
const setupShareDBWebSocket = require("./sharedb/connection")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}))
app.use(morgan("dev"))

app.use("/api/collabs", collabRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use(errorHandler)

connectMongo();
setupShareDBWebSocket(server);

server.listen(8000, () => {
  console.log("Server is running on port 8000")
})