console.log("loading delete_picture_entry lambda");

import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';

import commonMiddleware from "./libs/commonMiddleware.js";
import { dynamoDBClient, s3Client, tracer } from "./libs/client.js";

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { DeleteItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

const logger = new Logger({ serviceName: "delete_picture_entry_lambda" });
tracer.provider.setLogger(logger);

const traceEvents = (response, data, success, err = null) => {
  tracer.putMetadata("API_RESPONSE", { response });
  tracer.putMetadata("EVENT", JSON.stringify(data, null, 2));
  tracer.putAnnotation("DELETE_PICTURE_ENTRY_SUCCESS", success);
  if (!success) {
    tracer.putMetadata("ERROR", { err });
  }
}

const deletePictureEntry = async (event, context) => {
  const { functionName, functionVersion, awsRequestId } = context;
  const metadata = {
    functionName,
    functionVersion,
    requestId: awsRequestId,
    region: process.env.AWS_REGION,
    accountId: process.env.AWS_ACCOUNT_ID,
    eventSource: event?.source,
    userIdentity: event?.requestContext?.identity?.userArn || "Anonymous"
  }
  const annotations = {
    httpMethod: event?.httpMethod,
    path: event?.path,
    inputPayload: event || null
  }
  logger.info("Lambda execution details", { ...metadata, ...annotations });

  const { id } = event;

  try {
    const getItemResponse = await dynamoDBClient.send(new GetItemCommand({
      TableName: process.env.PICTURE_TABLE_NAME,
      Key: { id: { S: id } },
    }));

    const pictureItem = getItemResponse.Item;

    if (!pictureItem) {
      return {
        status: 404,
        body: JSON.stringify({ message: 'Picture not found' }),
      };
    }

    const pictureUrl = pictureItem.pictureUrl.S;
    const s3Key = new URL(pictureUrl).pathname.slice(1);

    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    }));

    await dynamoDBClient.send(new DeleteItemCommand({
      TableName: process.env.PICTURE_TABLE_NAME,
      Key: { id: { S: id } },
    }));

    return {
      statusCode: 200,
      message: 'Picture deleted successfully',
    };
  } catch (err) {
    throw {
      name: err.name || "DeleteDynamoDBError",
      message: err.message || "Failed to delete DynamoDB/S3 entry",
      status: 500,
    };
  }
};

export const handler = commonMiddleware(deletePictureEntry)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));