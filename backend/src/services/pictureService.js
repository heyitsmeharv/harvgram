import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.development" });

const client = new LambdaClient({ region: process.env.AWS_REGION });

export const uploadPicture = async (title, caption, tag, image) => {
  const command = new InvokeCommand({
    FunctionName: process.env.UPLOAD_PICTURE_LAMBDA,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({
      title: title,
      caption: caption,
      tag: tag,
      image: image
    })
  });

  try {
    const response = await client.send(command);
    const jsonString = Buffer.from(response.Payload).toString('utf-8');
    return JSON.parse(jsonString);
  } catch (err) {
    throw {
      name: err.name || "UploadLambdaError",
      message: err.message || "Failed to upload image",
      status: 500,
    };
  }
};

export const getAll = async tag => {
  const command = new InvokeCommand({
    FunctionName: process.env.GET_PICTURES_LAMBDA,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({
      tag: tag || null
    })
  });

  try {
    const response = await client.send(command);
    const jsonString = Buffer.from(response.Payload).toString('utf-8');
    return JSON.parse(jsonString);
  } catch (err) {
    throw {
      name: err.name || "UploadLambdaError",
      message: err.message || "Failed to upload image",
      status: 500,
    };
  }
};

export const deletePicture = async (id, pictureUrl) => {
  const command = new InvokeCommand({
    FunctionName: process.env.DELETE_PICTURE_LAMBDA,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ id, pictureUrl }),
  });

  try {
    const response = await client.send(command);
    const jsonString = Buffer.from(response.Payload).toString('utf-8');
    return JSON.parse(jsonString);
  } catch (err) {
    throw {
      name: err.name || "DeleteLambdaError",
      message: err.message || "Failed to delete image",
      status: 500,
    };
  }
};