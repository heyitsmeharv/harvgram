import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env" });

const client = new LambdaClient({ region: process.env.AWS_REGION });

export const uploadImage = async (payload) => {
  const { title, caption, tag, image } = payload
  const command = new InvokeCommand({
    FunctionName: process.env.UPLOAD_LAMBDA,
    Payload: Buffer.from(JSON.stringify({ title, caption, tag, image })),
  });

  try {
    return await client.send(command);
  } catch (err) {
    throw {
      name: err.name || "UploadLambdaError",
      message: err.message || "Failed to upload image",
      status: 500,
    };
  }
};
