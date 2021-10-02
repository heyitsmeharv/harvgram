import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getPictures(event, context) {
  const { tag } = event.queryStringParameters;
  let pictures;
  let result;

  if (!tag) {
    try {
      result = await dynamodb.scan({
        TableName: process.env.PICTURES_TABLE_NAME
      }).promise();
    } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
    }
  } else {
    const params = {
      TableName: process.env.PICTURES_TABLE_NAME,
      IndexName: 'tag',
      KeyConditionExpression: '#tag = :tag',
      ExpressionAttributeValues: {
        ':tag': tag,
      },
      ExpressionAttributeNames: {
        '#tag': 'tag',
      },
    }
    try {
      result = await dynamodb.query(params).promise();
    } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
    }
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      pictures: result.Items
    }),
  };

  return response;

  // pictures = result.Items;

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(pictures),
  // };
}

export const handler = commonMiddleware(getPictures)