import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getPictureById(id) {
  let picture;

  try {
    const result = await dynamodb.get({
      TableName: process.env.PICTURES_TABLE_NAME,
      Key: { id },
    }).promise();

    picture = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!picture) {
    throw new createError.NotFound(`Picture with ID "${id}" not found!`);
  }

  return picture;
}

async function getPicture(event, context) {
  const { id } = event.pathParameters;
  const picture = await getPictureById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(picture),
  };
}

export const handler = commonMiddleware(getPicture);