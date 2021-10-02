import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';

import hdate from 'human-date';

import { Box, IconButton, Grow } from '@material-ui/core';

import { CloudUpload } from '@styled-icons/boxicons-regular/CloudUpload';
import { Close } from '@styled-icons/evaicons-solid/Close';
import { Spinner2 } from '@styled-icons/icomoon/Spinner2'


const StyledForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PhotoContainer = styled(Box)`
  margin: 2%;
  border-radius: 20px;
  background-color: #fff;
  width: 370px;
  transition: all .2s ease-out;
  box-shadow: 0 2px 43px -4px rgb(0 0 0 / 19%);
  display: -moz-flex;
  display: flex;
  -moz-flex-direction: column;
  flex-direction: column;

  @media only screen and (max-width: 375px) {
    width: auto;
  }
`;

export const Spinner = styled.div`
  display: flex;
  justify-content: center;
  place-self: center;
  margin-top: 7px;  
  z-index: 9999;
  width: 4em;
  margin: 60px;
  animation: spin 1s 0.1s ease-in-out infinite both;

  @keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
`;

const CloseButton = styled(IconButton)`
  padding: 0!important;
  margin-left: auto!important;
  margin-top: -20px!important;
  margin-bottom: -30px!important;
  margin-right: -10px!important;
  z-index: 10!important;
`;

const UploadButton = styled(IconButton)`
  background: white!important;
  padding: 0!important;
  margin-left: auto!important;
  margin-top: -20px!important;
  margin-bottom: -30px!important;
  margin-right: 25px!important;
  z-index: 10!important;
  opacity: ${props => props.disabled ? 0.5 : 1}
`;

const CloseIcon = styled.span`
  border-radius: 50%;
  background: #f8f8f8;
  svg {
    width: 46px;
    fill: black;
  }
`;

const UploadIcon = styled.span`
  border-radius: 50%;
  background: white;
  svg {
    width: 60px;
    fill: black;
  }
`;

const StlyedCloudUpload = styled(CloudUpload)`
  width: 125px;
  border-radius: 20px;
  background: #f8f8f8;
  padding: 80px;
`;

const StyledInput = styled.input`
  outline: none;
  border: none;
  ${props => props.title && css`
    font-size: 3rem;
  `}
  ${props => props.caption && css`
    font-size: 2rem;
  `}
  ${props => props.caption && css`
    font-size: 2rem;
  `}
`;

const PhotoTitle = styled.h1`
  font-family: 'Open Sans', sans-serif;
  padding: 0.5rem 0rem;
  font-size: 24px;
  font-weight: 700;
  line-height: 27px;
  color: black;
  display: inline-block;
  margin-bottom: 7px;
`;

const PhotoDate = styled.h1`
  margin-left: auto;
  font-family: 'Open Sans', sans-serif;
  font-weight: 700;
  color: black;
  line-height: 14px;
  font-size: 14px;
  vertical-align: middle;
  display: inline-block;
`;

const PhotoImage = styled.img`
  width: 100%;
  max-height: 380px;
  border-radius: 20px;
  object-fit:cover;
  object-position: 50% 50%;
  transition: transform 0.25s ease;
`;

const PhotoMessage = styled.div`
  display: block;
  font-size: 16px;
  line-height: 22px;
  color: black;
`;

const Tag = styled.div`
  font-size: 14px;
  line-height: 14px;
  color: rgba(67,91,113,.5);
  display: inline-block;
  vertical-align: middle;
`;

const Upload = ({ setUpload }) => {
  const [imagePreview, setImagePreview] = useState('');
  const [file, setFile] = useState();
  const [base64, setBase64] = useState();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('');
  const [date, setDate] = useState(new Date());
  const prettyDate = hdate.prettyPrint(date);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = payload => {
    fetch(`${process.env.REACT_APP_SERVICE_ENDPOINT}/dev/createPictureEntry`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(payload)
    }).then(response => {
      console.log(`Successfully uploaded picture: ${response}`);
      setUpload(false);
    }).catch(error => {
      console.log(`Unable to upload picture: ${error}`);
    });
  };

  const onFileSubmit = e => {
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

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false)
      }, 2000);

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
  };

  return (
    <PhotoContainer>
      <CloseButton onClick={() => setUpload(false)}>
        <CloseIcon><Close /></CloseIcon>
      </CloseButton>
      {imagePreview === '' ?
        <StyledForm onChange={() => onFileChange(file)}>
          <Box
            css={`
            min-height: 370px;
            place-self: center;
            display: flex;
            align-items: center;
            justify-content: center;
            input[type="file"] {
              opacity: 0;
              position: absolute;
              border-radius: 100%;
              cursor: pointer;
              z-index: 99999;
              width: 145px;
              height: 145px;
            }
          `}
          >
            <StlyedCloudUpload />
            <input type="file" name="avatar" id="file" accept=".jpef, .png, .jpg" onChange={photoUpload} src={imagePreview} />
          </Box>
        </StyledForm>
        :
        <>
          <Grow in={imagePreview !== ''}
            {...{ timeout: 1000 }}
          >
            <PhotoImage src={imagePreview} />
          </Grow>
          <UploadButton
            disabled={title === '' || caption === '' || tag === '' ? true : false}
            onClick={(e) => onFileSubmit(e)}
          >
            <UploadIcon><CloudUpload /></UploadIcon>
          </UploadButton>
        </>
      }

      {!isLoading ?
        <>
          <Box
            css={`
            padding: 19px 20px 13px;
            min-height: 110px;
          `}
          >
            <PhotoTitle>
              <StyledInput
                title
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                value={title}
              />
            </PhotoTitle>
            <PhotoMessage>
              <StyledInput
                caption
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption"
                value={caption}
              />
            </PhotoMessage>
          </Box>
          <Box
            css={`
              display: flex;
              align-items: center;
              border-top: 1px solid rgba(67,91,113,.1);
              padding: 11px 20px 13px;
            `}
          >
            <Tag>
              #<StyledInput
                tag
                onChange={(e) => setTag(e.target.value)}
                placeholder="Tag"
                value={tag}
              />
            </Tag>
            <PhotoDate>
              {prettyDate}
            </PhotoDate>
          </Box>
        </>
        :
        <Spinner>
          <Spinner2 />
        </Spinner>
      }
    </PhotoContainer>
  )
}

export default Upload;