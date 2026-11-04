import {useTableDragScroll} from './SmartControls'
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/reset.css'
import './styles.css'
import App from './App'

function TableDragSetup(){useTableDragScroll();return null}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><TableDragSetup/><App /></React.StrictMode>,
)