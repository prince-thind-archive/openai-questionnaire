import fs from "fs";
import ytdl from "ytdl-core";

// const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; //sample short video
const url = "https://www.youtube.com/watch?v=QxU-JrfA824";

export default async function downloadAudio() {
  return new Promise((resolve, reject) => {
    const ytStream = ytdl(url, { filter: "audioonly" });
    fs.writeFileSync("./.temp/audio.mp3", ""); //due to some strange reason file should exist first
    const fsStream = fs.createWriteStream("./.temp/audio.mp3");

    ytStream.pipe(fsStream);

    ytStream.on("error", (e) => {
      console.error(e);
      reject(e);
    });

    ytStream.on("finish", () => {
      resolve();
    });
  });
}
