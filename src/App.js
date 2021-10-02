import React, { useState, useEffect } from 'react';
import 'styled-components/macro';

import {
  Box,
  Fade,
  Grow,
} from "@material-ui/core";

import Header from './components/Header/Header';
import Photo from './components/Photo/Photo';
import Upload from './components/Upload/Upload';

function App() {
  const [upload, setUpload] = useState(false);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetch('https://3i5bxy6zqe.execute-api.eu-west-2.amazonaws.com/dev/pictures')
      .then(response => {
        return response.json();
      }).then(pictures => {
        setList(pictures);
      })
      .catch(error => {
        console.log(`Unable to get pictures: ${error}`)
      })
  }, [upload]);

  useEffect(() => {
    if (searchValue !== '') {
      setFilteredList(list.filter(item => {
        const value = searchValue.value.toLowerCase();
        const tag = item.tag.toLowerCase();
        if (tag.includes(value)) {
          return item;
        }
      }));
    }
  }, [searchValue])

  return (
    <Box
      css={`
        background-color: #f8f8f8;
        height: 100vh;
      `}
    >
      <Header setUpload={setUpload} setSearchValue={setSearchValue} />
      <Box
        css={`
          display: flex;
          @media only screen and (max-width: 375px) {
            display: block;
          }
        `}
      >
        {filteredList.length === 0 ? list.map((img, i) => {
          return <Photo key={img.id} date={img.createdAt} image={img.pictureUrl} title={img.title} tag={img.tag} caption={img.caption} />
        })
          :
          filteredList.map((img, i) => {
            return <Photo key={img.id} date={img.createdAt} image={img.pictureUrl} title={img.title} tag={img.tag} caption={img.caption} />
          })
        }
      </Box>
      {
        upload &&
        <Fade in={upload}
          {...{ timeout: 1000 }}
          css={`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            background-color: rgba(0,0,0,0.5);
          `}
        >
          <Box
            css={`
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <Upload setUpload={setUpload} />
          </Box>
        </Fade>
      }
    </Box>
  );
}

export default App;
