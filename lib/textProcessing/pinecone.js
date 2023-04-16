import { PineconeClient } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const text = fs.readFileSync(".temp/transcripts.txt", "utf8");

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 1,
});

const output = await splitter.createDocuments([text]);

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new PineconeClient();
await pinecone.init({
  environment: process.env.PINECONE_ENV,
  apiKey: process.env.PINECONE_VALUE,
});

const langChainIndx = pinecone.Index("langchain");

// await upsertData();
await queryData();

export async function upsertData() {
  for (let i = 0; i < output.length; i++) {
    const embeddingRes = await embeddings.embedQuery(output[i].pageContent);

    await langChainIndx.upsert({
      upsertRequest: {
        vectors: [
          {
            id: i + "",
            values: embeddingRes,
          },
        ],
        namespace: "song",
      },
    });
  }
}

export async function queryData() {
  const embeddingRes = await embeddings.embedQuery("tell you how i am feeling");

  const response = await langChainIndx.query({
    queryRequest: {
      topK: 2,
      vector: embeddingRes,
      namespace: "song",
    },
  });

  const ids = response.matches.map((m) => m.id);

  const res = await langChainIndx.fetch({ ids, namespace: "song" });

  return res.vectors;
}
