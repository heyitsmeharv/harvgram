import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import 'styled-components/macro';

import {
  Box,
  Fade,
} from "@material-ui/core";

import Header from './components/Header/Header';
import Upload from './components/Upload/Upload';
import Wall from './components/Wall/Wall';

function App() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const [upload, setUpload] = useState(false);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [token, setToken] = useState();

  useEffect(() => {
    let token;
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/`,
          scope: "read:current_user",
        });
        const userDetailsByIdUrl = `https://${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/users/${user.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        token = accessToken

        const user_metadata = await metadataResponse.json();

        setUserMetadata(user_metadata);
      } catch (e) {
        console.log(e.message);
      }

      try {
        fetch(`${process.env.REACT_APP_SERVICE_ENDPOINT}/dev/pictures`, {
          // method: 'GET',
          // mode: 'cors',
          Authorization: `Bearer ${token}`,
          // 'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Credentials': true,
          headers: {
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Credentials': true,
          }
        })
          .then(response => {
            return response.json();
          }).then(pictures => {
            setList(pictures);
            console.log('pictures', pictures);
          })
          .catch(error => {
            console.log(`Unable to get pictures: ${error}`)
          });
      } catch (error) {
        console.log(error);
      }

    };
    if (isAuthenticated) {
      getUserMetadata();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const fetchToken = async () => {
    // try {
    //   const token = await getAccessTokenSilently({
    //     audience: `https://${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/`,
    //     scope: "read:current_user",
    //   });
    //   setToken(token);
    // } catch (error) {
    //   console.log('error fetching token', error);
    // }
    if (token) {
      // try {
      //   fetch(`${process.env.REACT_APP_SERVICE_ENDPOINT}/dev/pictures`, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Access-Control-Allow-Headers": "Content-Type",
      //       "Access-Control-Allow-Origin": "*",
      //       "Access-Control-Allow-Methods": "GET"
      //     }
      //   })
      //     .then(response => {
      //       return response.json();
      //     }).then(pictures => {
      //       setList(pictures);
      //       console.log('pictures', pictures);
      //     })
      //     .catch(error => {
      //       console.log(`Unable to get pictures: ${error}`)
      //     });
      // } catch (error) {
      //   console.log(error);
      // }
      // (async () => {
      //   fetch(`${process.env.REACT_APP_SERVICE_ENDPOINT}/dev/pictures`, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Access-Control-Allow-Headers": "Content-Type",
      //       "Access-Control-Allow-Origin": "*",
      //       "Access-Control-Allow-Methods": "GET"
      //     }
      //   })
      //     .then(response => {
      //       return response.json();
      //     }).then(pictures => {
      //       setList(pictures);
      //       console.log('pictures', pictures);
      //     })
      //     .catch(error => {
      //       console.log(`Unable to get pictures: ${error}`)
      //     });
      // })();
    }
  }

  const fetchPics = async () => {
    try {
      fetch(`${process.env.REACT_APP_SERVICE_ENDPOINT}/dev/pictures`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET"
        }
      })
        .then(response => {
          return response.json();
        }).then(pictures => {
          setList(pictures);
          console.log('pictures', pictures);
        })
        .catch(error => {
          console.log(`Unable to get pictures: ${error}`)
        });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchToken();
    }
  }, [token, isAuthenticated]);

  // useEffect(() => {
  //   if (token) {
  //     fetchPics();
  //   }
  // }, [isAuthenticated, token]);

  console.log('metadata', userMetadata);

  console.log('pictures', list);


  return (
    <Box
      css={`
        background-color: #f8f8f8;
        height: 100vh;
      `}
    >
      <Header userMetadata={userMetadata} setUpload={setUpload} setSearchValue={setSearchValue} />
      <Wall data={list} isAuthenticated={isAuthenticated} token={token} />
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
