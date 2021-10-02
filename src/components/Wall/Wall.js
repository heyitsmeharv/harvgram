import React, { useState, useEffect } from 'react';

import 'styled-components/macro';

import {
  Box,
} from "@material-ui/core";

import Photo from '../Photo/Photo';

const Wall = ({ data, isAuthenticated, token }) => {
  // const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     (async () => {
  //       fetch(`${process.env.REACT_APP_SERVICE_ENDPOINT}/dev/pictures`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Access-Control-Allow-Headers": "Content-Type",
  //           "Access-Control-Allow-Origin": "*",
  //           "Access-Control-Allow-Methods": "GET"
  //         }
  //       })
  //         .then(response => {
  //           return response.json();
  //         }).then(pictures => {
  //           setList(pictures);
  //           console.log('pictures', pictures);
  //         })
  //         .catch(error => {
  //           console.log(`Unable to get pictures: ${error}`)
  //         });
  //     })();
  //   }
  // }, [isAuthenticated]);

  // const fetchPics = async () => {
  //   try {
  //     fetch(`${process.env.REACT_APP_SERVICE_ENDPOINT}/dev/pictures`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Access-Control-Allow-Headers": "Content-Type",
  //         "Access-Control-Allow-Origin": "*",
  //         "Access-Control-Allow-Methods": "GET"
  //       }
  //     })
  //       .then(response => {
  //         return response.json();
  //       }).then(pictures => {
  //         setList(pictures);
  //         console.log('pictures', pictures);
  //       })
  //       .catch(error => {
  //         console.log(`Unable to get pictures: ${error}`)
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   if (token) {
  //     fetchPics();
  //   }
  // }, [isAuthenticated, token]);

  // useEffect(() => {
  //   if (searchValue !== '') {
  //     setFilteredList(data.pictures.filter(item => {
  //       const value = searchValue.value.toLowerCase();
  //       const tag = item.tag.toLowerCase();
  //       if (tag.includes(value)) {
  //         return item;
  //       }
  //     }));
  //   }
  // }, [searchValue]);

  return (
    <Box
      css={`
      display: flex;
      margin: auto;
      @media only screen and (max-width: 375px) {
        display: block;
      }
    `}
    >
      {/* {filteredList.length === 0 && data.length ? data.pictures.map((img, i) => {
        return <Photo key={i} id={img.id} date={img.createdAt} image={img.pictureUrl} title={img.title} tag={img.tag} caption={img.caption} />
      })
        :
        filteredList.map((img, i) => {
          return <Photo key={i} id={img.id} date={img.createdAt} image={img.pictureUrl} title={img.title} tag={img.tag} caption={img.caption} />
        })
      } */}
      {data.pictures && data.pictures.map((img, i) => {
        return <Photo key={i} id={img.id} date={img.createdAt} image={img.pictureUrl} title={img.title} tag={img.tag} caption={img.caption} />
      })}
    </Box>
  )
}

export default Wall;