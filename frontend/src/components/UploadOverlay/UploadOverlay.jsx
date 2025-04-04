import { useState } from "react";
import { uploadImage } from "../../api/api.js";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  Grow
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import hdate from 'human-date';

const OverlayContainer = styled(Backdrop)({
  zIndex: 1300,
  color: "#fff",
});

const MotionBox = motion(Box);

const ContentBox = styled(MotionBox)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  width: "90%",
  maxWidth: 500,
  position: "relative",
  boxShadow: theme.shadows[5],
}));

const LoaderOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: theme.palette.background.main,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  zIndex: 10,
}));



const UploadButton = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.main,
  textTransform: "none",

  minHeight: "370px",
  placeSelf: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  '& input[type="file"]': {
    opacity: 0,
    position: "absolute",
    borderRadius: "100%",
    cursor: "pointer",
    zIndex: 99999,
    width: "145px",
    height: "145px",
  }
}));

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.main
}));

export default function UploadOverlay({ open, onClose, onSubmit }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState();
  const [base64, setBase64] = useState();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState("#");
  const [date] = useState(new Date());
  const prettyDate = hdate.prettyPrint(date);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const uploadFile = async payload => {
    setLoading(true);
    try {
      await uploadImage(payload);
    } catch (err) {
      setError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onFileSubmit = () => {
    const reader = new FileReader();
    reader.onload = handleReaderLoaded;
    reader.readAsBinaryString(file);
    if (base64) {
      let payload = {
        image: base64,
        title: title,
        caption: caption,
        tag: tag
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false)
      }, 2000);

      uploadFile(payload);
    }
  };

  // const onFileChange = e => {
  //   let file = e ? e.target.files[0] : null;
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = handleReaderLoaded;
  //     reader.readAsBinaryString(file);
  //   }
  // }

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setBase64(base64String);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const handleReaderLoaded = readerEvt => {
    let binaryString = readerEvt.target.result;
    setBase64(btoa(binaryString))
  };

  // const photoUpload = (e) => {
  //   e.preventDefault();
  //   const reader = new FileReader();
  //   const file = e.target.files[0];
  //   if (reader !== undefined && file !== undefined) {
  //     reader.onloadend = () => {
  //       setFile(file);
  //       setImagePreview(reader.result);
  //     }
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <AnimatePresence>
      {open && (
        <OverlayContainer open={open}>
          <ContentBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {loading && (
              <LoaderOverlay>
                <CircularProgress color="primary" thickness={5} size={60} />
              </LoaderOverlay>
            )}
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <StyledText variant="h5" align="center" fontWeight="bold" fontFamily="Pacifico" gutterBottom>
              Upload
            </StyledText>
            {imagePreview === null ?
              <form>
                <UploadButton>
                  <CloudUploadIcon fontSize="large" onClick={handleFileChange} sx={{ mb: 1 }} />
                  <input type="file" accept="image/*" onChange={handleFileChange} src={imagePreview} />
                </UploadButton>
              </form>
              :
              <Grow in={imagePreview !== null}
                {...{ timeout: 1000 }}
              >
                <img src={imagePreview} />
              </Grow>
            }
            {imagePreview !== null && <IconButton
              onClick={() => setImagePreview(null)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>}

            <TextField
              name="title"
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              name="caption"
              label="Caption"
              fullWidth
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              margin="normal"

            />
            <TextField
              name="tag"
              label="Tag"
              fullWidth
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              margin="normal"
            />
            <StyledText>{prettyDate}</StyledText>
            <Button
              disabled={file === '' || title === '' || caption === '' ? true : false}
              variant="contained" fullWidth sx={{ mt: 2 }}
              onClick={() => onFileSubmit()}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                "Submit"
              )}
            </Button>
          </ContentBox>
        </OverlayContainer>
      )}
    </AnimatePresence>
  );
}