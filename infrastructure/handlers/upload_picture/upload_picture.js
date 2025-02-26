console.log("loading upload_picture lambda");

import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";

import commonMiddleware from "./libs/commonMiddleware.js";
import { tracer } from "./libs/client.js";

import createError from "http-errors";

import { getPictureById } from '../get_picture/get_picture.js';
import { uploadPictureToS3 } from './libs/uploadPictureToS3.js';
import { setPictureUrl } from './libs/setPictureUrl.js';

const logger = new Logger({ serviceName: "upload_picture_lambda" });
tracer.provider.setLogger(logger);

const traceEvents = (response, data, success, err = null) => {
  tracer.putMetadata("API_RESPONSE", { response });
  tracer.putMetadata("EVENT", JSON.stringify(data, null, 2));
  tracer.putAnnotation("UPLOAD_PICTURE_SUCCESS", success);
  if (!success) {
    tracer.putMetadata("ERROR", { err });
  }
}

async function uploadPicture(event) {
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
  const base64 = event.body.replace(/^data:image\/w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  let updatedPicture

  try {
    const pictureUrl = await uploadPictureToS3(picture.id + '.jpg', buffer);
    updatedPicture = await setPictureUrl(picture.id, pictureUrl);
    console.log(pictureUrl);
    console.log(updatedPicture);
    traceEvents({ ...pictureUrl, ...updatedPicture }, picture.id, true);
  } catch (error) {
    logger.error("An error occurred", { message: "Error: failed to upload image", error, stackTrace: error.stack, xRayTraceId: tracer.getRootXrayTraceId() });
    traceEvents({ ...pictureUrl, ...updatedPicture }, id, false, error);
    throw new createError.InternalServerError(error);
  }

  const response = { body: JSON.stringify(updatedPicture) }

  return {
    statusCode: 201,
    body: response,
  };
}

export const handler = commonMiddleware(uploadPicture)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));
