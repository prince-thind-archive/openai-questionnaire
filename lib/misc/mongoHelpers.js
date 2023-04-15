import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const textSchema = mongoose.Schema({
  text: String,
  name: String,
});
const Text = mongoose.model("Text", textSchema);

export async function getText() {
  await mongoose.connect(process.env.MONGODB_URI);

  const textDoc = await Text.findOne({ name: "main" });
  const res = textDoc.text;

  mongoose.connection.close();
  return res;
}

export async function saveText(text) {
  await mongoose.connect(process.env.MONGODB_URI);

  const textDoc = await Text.findOne({ name: "main" });

  if (textDoc) {
    textDoc.text = text;
    await textDoc.save();
  } else {
    const newTextDoc = new Text({ name: "main", text });
    await newTextDoc.save();
  }

  mongoose.connection.close();
}
