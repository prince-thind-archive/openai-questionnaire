import convertAudioToText from "./convertAudioToText.js";
import fs from "fs";
import downloadAudio from "./downloadAudio.js";
import { saveText } from "../misc/mongoHelpers.js";

main();

async function main() {
  await downloadAudio();
  const text = await convertAudioToText();
  fs.writeFileSync("./.temp/transcripts.txt", text);
  await saveText(text);
}
