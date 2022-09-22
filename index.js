require("dotenv").config();
const express = require("express");
const { connectDB } = require("./db");

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ extended: false }));

app.use("/", require("./url"));

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`server running on port ${PORT}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
});
