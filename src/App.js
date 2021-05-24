import React, { useState } from 'react';
import './App.css';

import One from './assets/one.jpeg';
import Two from './assets/two.jpeg';

import Header from './components/Header/Header';
import Photo from './components/Photo/Photo';

function App() {
  const [list, setList] = useState([
    {
      title: 'Jessica!',
      message: 'first time she smiled at me <3',
      image: Two,
    },
    {
      title: 'Brighton with bae',
      message: 'trip to brighton!',
      image: One,
    }
  ])
  return (
    <div className="App">
      <Header />
      <div className="photo-container">
        {list.map((img, i) => {
          return <Photo key={i} image={img.image} title={img.title} message={img.message} />
        })}
      </div>
    </div>
  );
}

export default App;
