import React from 'react';
import styled from 'styled-components/macro';

import hdate from "human-date";

import { Box, Grow } from '@material-ui/core';

const PhotoContainer = styled(Box)`
  margin: 2%;
  border-radius: 20px;
  background-color: #fff;
  height: fit-content;
  width: 370px;
  transition: all .2s ease-out;
  box-shadow: 0 2px 43px -4px rgb(0 0 0 / 19%);
  display: -moz-flex;
  display: flex;
  -moz-flex-direction: column;
  flex-direction: column;
  :hover {
    transform: translateY(2px);
    box-shadow: 0 2px 5px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 5%);
  }

  img {
    cursor: zoom-in;
  }

  input[type=checkbox] {
    display: none;
  }

  input[type=checkbox]:checked ~ label > img {
    transform: scale(2);
    cursor: zoom-out;
  }

  @media only screen and (max-width: 375px) {
    width: auto;
  }

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

const Photo = ({ id, image, title, caption, date, tag }) => {
  const prettyDate = hdate.prettyPrint(date);
  return (
    <Grow in={true}
      {...{ timeout: 1000 }}
    >
      <PhotoContainer>
        <input type="checkbox" id={id} />
        <label htmlFor={id}>
          <PhotoImage src={image} />
        </label>
        <Box
          css={`
          padding: 19px 20px 13px;
          min-height: 110px;
        `}
        >
          <PhotoTitle>
            {title}
          </PhotoTitle>
          <PhotoMessage>
            {caption}
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
            #{tag}
          </Tag>
          <PhotoDate>
            {prettyDate}
          </PhotoDate>
        </Box>
      </PhotoContainer>
    </Grow >
  )
}

export default Photo;