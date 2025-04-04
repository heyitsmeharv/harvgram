console.log("loading get_picture lambda");

import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';

import commonMiddleware from "./libs/commonMiddleware.js";
import { client, tracer } from "./libs/client.js";

import createError from "http-errors";

import { GetItemCommand } from "@aws-sdk/client-dynamodb";

const logger = new Logger({ serviceName: "get_picture_lambda" });
tracer.provider.setLogger(logger);

const traceEvents = (response, data, success, err = null) => {
  tracer.putMetadata("API_RESPONSE", { response });
  tracer.putMetadata("EVENT", JSON.stringify(data, null, 2));
  tracer.putAnnotation("GET_PICTURE_SUCCESS", success);
  if (!success) {
    tracer.putMetadata("ERROR", { err });
  }
}

export async function getPictureById(id) {
  let picture;
  let response;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      name: { S: id }
    }
  }

  try {
    response = await client.send(new GetItemCommand(params))
    picture = response.Item;
    traceEvents(response, params, true);
  } catch (error) {
    logger.error("An error occurred", { message: "Error: failed to lookup image", error, stackTrace: error.stack, xRayTraceId: tracer.getRootXrayTraceId() });
    traceEvents(response, params, false, error);
    throw new createError.NotFound(`Picture with ID "${id}" not found!`);
    // throw new createError.InternalServerError(error);
  }

  return picture;
}

const getPicture = async (event, context) => {
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

  const { id } = event.pathParameters;
  const picture = await getPictureById(id);

  const response = { body: JSON.stringify(picture) }
  return {
    statusCode: 200,
    response,
  };
};

export const handler = commonMiddleware(getPicture)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));