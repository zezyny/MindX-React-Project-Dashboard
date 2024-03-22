import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import FirebaseProvider from './Context/FirebaseProvider.jsx';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <FirebaseProvider>
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            darkItemBg: 'var(--dark0)',
            darkSubMenuItemBg: 'var(--dark0)',
            darkItemSelectedBg: 'var(--dark1)',
          },
          Button: {
            colorPrimary: 'var(--main)'
          },
          Result: {
            subtitleFontSize: '18px'
          }
        }
      }}
    >
      <App />
    </ConfigProvider>
  </FirebaseProvider>

)
