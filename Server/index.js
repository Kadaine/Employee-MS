import express from "express"
import cors from "cors"
import { adminRouter } from "./Routes/adminRoute.js"

const app = express()
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json()) //Use to convert information obtain from the frontend into json
app.use('/auth', adminRouter)
app.use(express.static('Public'))

app.listen(3000, () => {
    console.log("Server is running")
})