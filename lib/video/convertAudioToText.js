import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const audioStream = fs.createReadStream("./.temp/audio.mp3");
const url = "https://api.openai.com/v1/audio/transcriptions";

export default async function convertAudioToText() {
  const formData = new FormData();
  formData.append("file", audioStream);
  formData.append("model", "whisper-1");

  const res = await axios.post(url, formData, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      ...formData.getHeaders(),
    },
    body: formData,
  });

  return res.data.text;
}
