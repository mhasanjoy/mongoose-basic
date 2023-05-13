import User from "./user.model";

export const createUserToDB = async () => {
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
  return user;
};
