import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then((res) => console.log("DB CONNECTED :: " + res.connection.host))
      .catch((err) => console.log("ERROR WHILE CONNECTING :: " + err));
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED :: " + error);
  }
};

export default connectDB;
