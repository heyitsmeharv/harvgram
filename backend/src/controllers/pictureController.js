import { uploadImage } from "../services/pictureService.js";

export const pictures = async (req, res) => {

};

export const getPicture = async (req, res) => {

};

export const createPictureEntry = async (req, res) => {
  const { payload } = req.body;

  try {
    const result = await uploadImage(payload);
    return res.status(200).json({
      status: 200,
      body: result
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      error: err.message,
      code: err.name || "INTERNAL_SERVER_ERROR"
    });
  }
};
