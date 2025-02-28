import { useState } from 'react';
import hdate from 'human-date';

import { Box, IconButton, Grow } from "@mui/material";

export const Upload = () => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('');
  const [date, setDate] = useState(new Date());
  const prettyDate = hdate.prettyPrint(date);

  return (
    <Box>Upload</Box>
  )
}
