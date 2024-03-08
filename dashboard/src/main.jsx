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
            darkItemSelectedColor: 'var(--main)'
          },
          Button: {
            colorPrimary: 'var(--main)'
          }
        }
      }}
    >
      <App />
    </ConfigProvider>
  </FirebaseProvider>

)
