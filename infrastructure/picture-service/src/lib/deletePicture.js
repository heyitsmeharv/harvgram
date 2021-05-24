import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function deletePicture(picture) {
  let result;

  try {
    result = await dynamodb.deleteItem({
      TableName: process.env.PICTURES_TABLE_NAME,
      Key: picture,
    }).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  return result;
}