const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

// database connection
async function bootstrap() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mongoose-basic");
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Failed to connect database!", error);
  }
}
bootstrap();

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
