import { s3Client } from "./client.js";

import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadPictureToS3(key, body) {
  const params = {
    Bucket: process.env.PICTURES_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };

  const response = await s3Client.send(new PutObjectCommand(params))

  return response.Location;
}