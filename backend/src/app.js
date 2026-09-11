import express from "express"
import cors from 'cors'; 



const app = express();

app.use(cors());

app.use(express.json())


app.get("/healthcheck", (req, res) => {
  console.log("Server is working");

  res.status(200).json({
    success: true,
    message: "Server is working",
  });
});

export default app;