import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "../../api/api.js";
import {
  Backdrop,
  Box,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  Grow,
  useTheme
} from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import hdate from 'human-date';

const MotionBackdrop = motion(Backdrop);
const MotionBox = motion(Box);

const OverlayContainer = styled(MotionBackdrop)(({ theme }) => ({
  zIndex: 1300,
  color: "#fff",
}));

const ContentBox = styled(MotionBox)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  width: "90%",
  maxHeight: "80%",
  overflow: "auto",
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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  float: "right",
  backgroundColor: theme.palette.button.main,
  color: theme.palette.text.main,
  "&:hover": {
    backgroundColor: theme.palette.button.highlight,
    borderColor: theme.palette.button.border,
    transition: "background-color 0.3s ease",
  }
}));

const UploadButton = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.text.main}`,
  backgroundColor: theme.palette.background.main,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.main,
  textTransform: "none",
  height: "350px",
  width: "350px",
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

const StyledGrow = styled(Grow)(({ theme }) => ({
  height: "350px",
  width: "100%"
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  color: theme.palette.text.main,
  "& .MuiInputLabel-root": {
    color: theme.palette.text.main,
  },
  "& .MuiFormHelperText-root": {
    color: theme.palette.text.main,
    fontWeight: "bold",
    fontStyle: "italic"
  },
}));

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.main
}));

export default function UploadOverlay({ open, user, isEdit, data, setData, onClose }) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState("#");
  const [email] = useState(user);
  const [date] = useState(new Date());
  const prettyDate = hdate.prettyPrint(date);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const reset = () => {
    setFile(null);
    setBase64("");
    setImagePreview("")
    setTitle("");
    setCaption("");
    setTag("");
    setData([]);
    setLoading(false);
  }

  const uploadFile = async payload => {
    try {
      setLoading(true);
      await uploadImage(payload);
      reset();
      onClose();
      queryClient.invalidateQueries(['pictures']);
    } catch (err) {
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
        tag: tag.split(",").map(t => t.trim()),
        user: email
      }
      uploadFile(payload);
    }
  };

  const onFileChange = e => {
    let file = e ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = handleReaderLoaded;
      reader.readAsBinaryString(file);
    }
  }

  const handleReaderLoaded = readerEvt => {
    let binaryString = readerEvt.target.result;
    setBase64(btoa(binaryString))
  };

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setFile(file);
        setImagePreview(reader.result);
      }
      reader.readAsDataURL(file);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <OverlayContainer
          // initial={{ x: 0 }}
          // animate={error ? { x: [0, -10, 10, -10, 10, 0], backgroundColor: [theme.palette.background.main, theme.palette.error.main, theme.palette.background.main] } : {}}
          // transition={{ duration: 0.5 }}
          open={open}
        >
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
            {imagePreview === "" ?
              <form onChange={() => onFileChange(file)}>
                <UploadButton>
                  <AddPhotoAlternateIcon fontSize="large" sx={{ mb: 1 }} />
                  <input type="file" accept="image/*" onChange={photoUpload} src={imagePreview} />
                </UploadButton>
              </form>
              :
              <StyledGrow in={imagePreview !== ""}
                {...{ timeout: 1000 }}
              >
                <img src={imagePreview} />
              </StyledGrow>
            }
            {imagePreview !== "" && <IconButton
              onClick={() => reset()}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>}

            <StyledTextField
              name="title"
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />
            <StyledTextField
              name="caption"
              label="Caption"
              fullWidth
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              margin="normal"

            />
            <StyledTextField
              name="tag"
              label="Tag"
              fullWidth
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              helperText="Separate with commas, e.g. nature, beach, summer, thirsty"
              margin="normal"
              sx={{ marginBottom: "50px" }}
            />
            <StyledText
              sx={{ position: "absolute", bottom: "25px", right: "25px" }}
            >
              {prettyDate}
            </StyledText>
            {file !== null &&
              <StyledIconButton
                disabled={file === '' || title === '' || caption === '' ? true : false}
                onClick={(e) => onFileSubmit(e)}
              >
                {loading ? (
                  <CircularProgress
                    size={36}
                    color="inherit"
                  />
                ) : (
                  <CloudUploadIcon fontSize="large" />
                )}
              </StyledIconButton>
            }
          </ContentBox>
        </OverlayContainer>
      )}
    </AnimatePresence>
  );
}