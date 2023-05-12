import mongoose from "mongoose";
import app from "./app";

const port: number = 5000;

// database connection
async function bootstrap() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mongoose-basic");
    console.log("Database connected successfully!");

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to connect database!", error);
  }
}
bootstrap();
