import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";

export default handler => middy(handler)
  .use([
    httpErrorHandler()
  ]);