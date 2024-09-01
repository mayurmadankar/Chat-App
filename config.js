import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/chatApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connect to the mongodb");
};
