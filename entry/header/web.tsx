import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';

const el = document.getElementById('header');
ReactDOM.hydrate(<Header />, el);
