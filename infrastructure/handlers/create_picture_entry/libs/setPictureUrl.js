import { dynamoDBClient } from "./client.js";

import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export async function setPictureUrl(id, pictureUrl) {
  const params = {
    TableName: process.env.PICTURE_TABLE_NAME,
    Key: {
      id: { S: id },
    },
    UpdateExpression: 'set pictureUrl = :pictureUrl',
    ExpressionAttributeValues: {
      ':pictureUrl': { S: pictureUrl },
    },
    ReturnValues: 'ALL_NEW',
  };

  const response = await dynamoDBClient.send(new UpdateItemCommand(params));
  return response.Attributes;
}