import express from "express";
import cors from "cors";
import indexRouter from "./routes/index.js";
import "dotenv/config";

const app = express();
const PORT=Number(process.env.PORT);

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.status(200).json({message:"API running"});  
});

app.use("/api",indexRouter);


app.listen(PORT, "0.0.0.0", ()=>{
    console.log(`API Started at Port-${PORT}...`);
})