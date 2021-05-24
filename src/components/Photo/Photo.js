import React from 'react';
import './Photo.css';

const Photo = ({ image, title, message }) => {
  return (
    <div className="photo">
      <div className="photo-title">
        {title}
      </div>
      <img className="photo-image" src={image} />
      <div className="photo-message">
        {message}
      </div>
    </div>
  )
}

export default Photo;