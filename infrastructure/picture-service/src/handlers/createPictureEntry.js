import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import createError from 'http-errors';
import createPictureSchema from '../lib/schemas/createPictureSchema';

import { getPictureById } from './getPicture';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { setPictureUrl } from '../lib/setPictureUrl';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createPictureEntry(event, context) {
  const { title, caption, tag, image } = event.body;
  const now = new Date();

  const entry = {
    id: uuid(),
    title,
    caption,
    tag,
    createdAt: now.toISOString(),
  }

  const base64 = image.replace(/^data:image\/w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  try {
    await dynamodb.put({
      TableName: process.env.PICTURES_TABLE_NAME,
      Item: entry,
    }).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  let updatedAuction

  try {
    const pictureUrl = await uploadPictureToS3(entry.id + '.jpg', buffer);
    updatedAuction = await setPictureUrl(entry.id, pictureUrl);
    console.log(pictureUrl);
    console.log(updatedAuction);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(entry, updatedAuction),
  };
}

export const handler = commonMiddleware(createPictureEntry)
  // .use(validator({ inputSchema: createPictureSchema }));
