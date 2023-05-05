import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* REDUX */
import { Provider } from 'react-redux';
import store from './store';

/* ANTD-MOBILE */
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';

/* 改变REM换算比例 */
// 后生效，会覆盖下面函数计算出的值(lib-flexible在不同的设备上等比例的对REM的换算比例进行缩放)
import 'lib-flexible';
import './index.less';

// 先生效
/* 处理最大宽度 */
(function () {
  const handleMax = function handleMax() {
    let html = document.documentElement,
      root = document.getElementById('root'),
      deviceW = html.clientWidth;
    root.style.maxWidth = "750px";
    if (deviceW >= 750) {
      html.style.fontSize = '75px';
    }
  };
  handleMax();
  // 可以注释掉下面，模拟器切换屏幕大小会突变，但是实际使用不会有屏幕大小切换的情况
  // window.addEventListener("resize",handleMax);
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);