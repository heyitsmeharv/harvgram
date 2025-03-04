import hdate from "human-date";

import { Box, Typography, Grow } from "@mui/material";
import { styled } from "@mui/system";

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

  @media only screen and (max-width: 375px) {
    width: auto;
  }

  & img {
    width: 100%;
    max-height: 380px;
    border-radius: 20px;
    object-fit:cover;
    object-position: 50% 50%;
    transition: transform 0.25s ease;
  } 

`;

const PhotoTitle = styled(Typography)`
  font-family: 'Open Sans', sans-serif;
  padding: 0.5rem 0rem;
  font-size: 24px;
  font-weight: 700;
  line-height: 27px;
  color: black;
  display: inline-block;
  margin-bottom: 7px;
`;

const PhotoDate = styled(Typography)`
  margin-left: auto;
  font-family: 'Open Sans', sans-serif;
  font-weight: 700;
  color: black;
  line-height: 14px;
  font-size: 14px;
  vertical-align: middle;
  display: inline-block;
`;

const PhotoMessage = styled(Box)`
  display: block;
  font-size: 16px;
  line-height: 22px;
  color: black;
`;

const Tag = styled(Box)`
  font-size: 14px;
  line-height: 14px;
  color: rgba(67,91,113,.5);
  display: inline-block;
  vertical-align: middle;
`;

export const Photo = ({ image, title, caption, date, tag }) => {
  const prettyDate = hdate.prettyPrint(date);
  return (
    <Grow in={true}
      {...{ timeout: 1000 }}
    >
      <PhotoContainer>
        <image src={image} />
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
    </Grow>
  )
}