require("dotenv").config();
const express = require("express");
const { connectDB } = require("./db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ extended: false }));

app.use("/", require("./url"));
app.use("*", (req, res) => {
  console.log({ error: true, message: "Route not found" });
  return res.status(404).json({ error: true, message: "Route not found" });
});

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`server running on port ${PORT}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
});
