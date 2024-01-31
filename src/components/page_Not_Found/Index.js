// Index.js
import React from 'react';
import Styles from './Index.module.css';

const Index = () => {
  return (
    <div className={Styles.notFoundContainer}>
      <div className={Styles.notFoundContent}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default Index;
