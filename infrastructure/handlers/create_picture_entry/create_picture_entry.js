console.log("loading create_picture_entry lambda");

import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';

import commonMiddleware from "./libs/commonMiddleware.js";
import { dynamoDBClient, tracer } from "./libs/client.js";

import { PutCommand } from "@aws-sdk/lib-dynamodb";

import { uploadPictureToS3 } from './libs/uploadPictureToS3.js';
import { setPictureUrl } from './libs/setPictureUrl.js';

import { v4 as uuid } from 'uuid';

const logger = new Logger({ serviceName: "create_picture_entry_lambda" });
tracer.provider.setLogger(logger);

const traceEvents = (response, data, success, err = null) => {
  tracer.putMetadata("API_RESPONSE", { response });
  tracer.putMetadata("EVENT", JSON.stringify(data, null, 2));
  tracer.putAnnotation("CREATE_PICTURE_ENTRY_SUCCESS", success);
  if (!success) {
    tracer.putMetadata("ERROR", { err });
  }
}

const createPictureEntry = async (event, context) => {
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

  const { title, caption, tag, image, user } = event;

  const now = new Date();

  const entry = {
    id: uuid(),
    title,
    caption,
    tag,
    createdAt: now.toISOString(),
    user
  }

  const base64 = image.replace(/^data:image\/w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  let params, putItem;
  try {
    params = {
      TableName: process.env.PICTURE_TABLE_NAME,
      Item: entry
    }
    putItem = await dynamoDBClient.send(new PutCommand(params));
    traceEvents(putItem, params, true);
  } catch (err) {
    traceEvents(putItem, params, false, err);
    throw {
      name: err.name || "InsertDynamoDBError",
      message: err.message || "Failed to insert into DynamoDB",
      status: 500,
    };
  }

  let pictureUrl;

  try {
    pictureUrl = await uploadPictureToS3(entry.id + '.jpg', buffer);
    await setPictureUrl(entry.id, pictureUrl);
    traceEvents(pictureUrl, entry.id, true);
  } catch (err) {
    traceEvents(pictureUrl, entry.id, false, err);
    throw {
      name: err.name || "UpdateDynamoDBError",
      message: err.message || "Failed to update DynamoDB entry",
      status: 500,
    };
  }

  return {
    statusCode: 201,
    body: { entry },
  };
};

export const handler = commonMiddleware(createPictureEntry)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));