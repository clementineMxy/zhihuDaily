import { createStore, applyMiddleware } from 'redux';
// 日志中间件，可以在控制台中打印出每个 action 的类型、参数、持续时间、时间戳以及 state 的变化
import reduxLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import reducer from './reducer';

// 根据不同的环境，使用不同的中间件
// start.js 中第5行 process.env.NODE_ENV = 'development'; 可以修改
let middleware = [reduxThunk, reduxPromise],
    env = process.env.NODE_ENV;
if (env === "development") {
    middleware.push(reduxLogger);
}

// 创建store容器
const store = createStore(
    reducer,
    applyMiddleware(...middleware)
);
export default store;