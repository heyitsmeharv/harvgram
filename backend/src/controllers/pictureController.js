import { getAllPictures, uploadImage } from "../services/pictureService.js";

export const pictures = async (req, res) => {
  const { tag } = req.body;
  try {
    const pictures = await getAllPictures(tag);
    return res.status(200).json({
      status: 200,
      body: pictures
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      error: err.message,
      code: err.name || "INTERNAL_SERVER_ERROR"
    });
  }
};

export const getPicture = async (req, res) => {

};

export const createPictureEntry = async (req, res) => {
  const { image, title, caption, tag } = req.body;

  try {
    const result = await uploadImage(title, caption, tag, image);
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
