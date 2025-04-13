import { s3Client } from "./client.js";

import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadPictureToS3(key, body) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `pictures/${key}`,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };

  await s3Client.send(new PutObjectCommand(params));
  return `https://${process.env.S3_BUCKET}.s3.${process.env.REGION}.amazonaws.com/pictures/${key}`;
}