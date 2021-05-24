import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import createError from 'http-errors';
import createPictureSchema from '../lib/schemas/createPictureSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createPictureEntry(event, context) {
  const { title, message, tag } = event.body;
  const now = new Date();

  const picture = {
    id: uuid(),
    title,
    message,
    tag,
    createdAt: now.toISOString(),
  }

  try {
    await dynamodb.put({
      TableName: process.env.PICTURES_TABLE_NAME,
      Item: picture,
    }).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(picture),
  };
}

export const handler = commonMiddleware(createPictureEntry)
  // .use(validator({ inputSchema: createPictureSchema }));
