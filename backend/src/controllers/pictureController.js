import { getAll, uploadPicture, deletePicture } from "../services/pictureService.js";

export const getAllPictures = async (req, res) => {
  const { tag } = req.body;
  try {
    const pictures = await getAll(tag);
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
    const result = await uploadPicture(title, caption, tag, image);
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

export const deletePictureEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deletePicture(id);
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