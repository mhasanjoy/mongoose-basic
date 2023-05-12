import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { Schema, model } from "mongoose";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  //   res.send("Hello World!");
  //   next();

  interface IUser {
    id: string;
    role: "student";
    password: string;
    name: {
      firstName: string;
      middleName?: string;
      lastName: string;
    };
    dateOfBirth?: string;
    gender: "male" | "female";
    email?: string;
    contactNo: string;
    emergencyContactNo: string;
    presentAddress: string;
    permanentAddress: string;
  }

  const userSchema = new Schema<IUser>({
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      middleName: String,
      lastName: {
        type: String,
        required: true,
      },
    },
    dateOfBirth: String,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    email: String,
    contactNo: {
      type: String,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
  });

  const User = model<IUser>("User", userSchema);

  const user = new User({
    id: "2",
    role: "admin",
    password: "12345",
    name: {
      firstName: "Md. Mehedi",
      lastName: "Hasan",
    },
    gender: "male",
    email: "abc@gmail.com",
    contactNo: "01777777777",
    emergencyContactNo: "01888888888",
    presentAddress: "Uganda",
    permanentAddress: "USA",
  });

  await user.save();
  console.log(user);
});

export default app;
