import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

import { getPictureById } from './getPicture';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { setPictureUrl } from '../lib/setPictureUrl';

async function uploadPicture(event) {
  const { id } = event.pathParameters;
  const picture = await getPictureById(id);
  const base64 = event.body.replace(/^data:image\/w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  let updatedAuction

  try {
    const pictureUrl = await uploadPictureToS3(picture.id + '.jpg', buffer);
    updatedAuction = await setPictureUrl(picture.id, pictureUrl);
    console.log(pictureUrl);
    console.log(updatedAuction);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middy(uploadPicture)
  .use(httpErrorHandler());
