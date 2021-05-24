const createPictureSchema = {
  type: 'strict',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        message: {
          type: 'string',
        },
        tag: {
          type: 'string',
        },
      },
      required: ['title', 'message'],
    },
  },
  required: ['body'],
};

export default createPictureSchema;