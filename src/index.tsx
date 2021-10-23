import React from 'react'
import ReactDOM from 'react-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { HashRouter as Router } from 'react-router-dom'

import App from './App'
import { CustomThemeProvider } from './contexts/CustomThemeContext'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <CustomThemeProvider>
          <App />
        </CustomThemeProvider>
      </Router>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
