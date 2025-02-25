console.log("loading create_picture_entry lambda");

import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";

import commonMiddleware from "./libs/commonMiddleware.js";
import { client, tracer } from "./libs/client.js";

import createError from "http-errors";

import { PutItemCommand } from "@aws-sdk/client-dynamodb";

import { uploadPictureToS3 } from './libs/uploadPictureToS3.js';
import { setPictureUrl } from './libs/setPictureUrl.js';


const logger = new Logger({ serviceName: "create_picture_entry_lambda" });
tracer.provider.setLogger(logger);

const traceEvents = (response, data, success, err = null) => {
  tracer.putMetadata("API_RESPONSE", { response });
  tracer.putMetadata("EVENT", JSON.stringify(data, null, 2));
  tracer.putAnnotation("GET_PICTURE_SUCCESS", success);
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
    inputPayload: event.body || null
  }
  logger.info("Lambda execution details", { ...metadata, ...annotations });

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

  let params, putItem;
  try {
    params = {
      TableName: process.env.PICTURES_TABLE_NAME,
      Item: entry
    }
    putItem = await client.send(new PutItemCommand(params));
    traceEvents(putItem, params, true);
  } catch (error) {
    console.error(error);
    traceEvents(putItem, params, false, error);
    throw new createError.InternalServerError(error);
  }

  let updatedPicture

  try {
    const pictureUrl = await uploadPictureToS3(entry.id + '.jpg', buffer);
    updatedPicture = await setPictureUrl(entry.id, pictureUrl);
    console.log(pictureUrl);
    console.log(updatedPicture);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  const response = { body: JSON.stringify(entry, updatedPicture) }

  return {
    statusCode: 201,
    body: response,
  };
};

export const handler = commonMiddleware(createPictureEntry)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));