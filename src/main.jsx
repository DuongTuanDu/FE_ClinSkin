import React from "react";
import { createRoot } from 'react-dom/client'
import './index.scss'
import { store } from "./redux/store.jsx";
import App from './App.jsx'
import { Provider } from 'react-redux'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
