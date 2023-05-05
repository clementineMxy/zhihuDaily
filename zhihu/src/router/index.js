import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import routes from "./routes";
import { Mask, DotLoading, Toast } from 'antd-mobile';
import store from '../store';
import action from "../store/action";

/* 统一路由配置 */
// 是否需要登录态校验
const isCheckLogin = (path) => {
    let { base: { info } } = store.getState(),
        checkList = ['/personal', '/store', '/update'];
    return !info && checkList.includes(path);
};
// 2--Element将路由信息作为props传给组件
// 组件函数不能加async，否则返回的是一个Promise实例，React不能渲染Promise实例
const Element = function Element(props) {
    // 函数式组件的参数就是props，可以取出属性
    let { component: Component, meta, path } = props;
    // 由是否需要登录态校验决定的是否展示组件
    let isShow = !isCheckLogin(path);
    let [_, setRandom] = useState(0);

    // 登录态校验 每一次组件更新后执行
    // 步骤：获取redux中的base.info，有就登录，没有就派发一个任务，从服务器获取
    // 获取到了，登录，直接进入对应组件；否则，跳转到登录页，?to=目标路由
    // 判断是否需要跳转必须在组件渲染前实现
    useEffect(() => {
        // 不需要登录态校验
        if (isShow) return;
        // await之后才能执行的代码必须也放在async中
        (async () => {
            let infoAction = await action.base.queryUserInfoAsync();
            let info = infoAction.info;
            if (!info) {
                // 如果获取后还是不存在:没有登录
                Toast.show({
                    icon: 'fail',
                    content: '请先登录'
                });
                // 跳转到登录页
                navigate({
                    pathname: '/login',
                    search: `?to=${path}`
                }, { replace: true });
                return;
            }
            // 如果获取到了信息,说明是登录的,我们派发任务把信息存储到容器中
            store.dispatch(infoAction);
            // 第一次渲染前执行，info改变，以下一行代码强制Element更新，重新执行组件函数代码使isShow的值改变，并渲染
            setRandom(+new Date());
        })();
    });

    // 修改页面的TITLE
    let { title = "知乎日报-WebApp" } = meta || {};
    document.title = title;

    // 获取路由信息,基于属性传递给组件
    const navigate = useNavigate(),
        location = useLocation(),
        params = useParams(),
        // useSearchParams () 钩子返回一个包含两个值的数组：当前位置的搜索参数和一个用于更新它们的函数
        // 解构出数组第一个值
        [usp] = useSearchParams();

    // isShow为false则渲染遮罩层
    // return jsx不能写在async里，因为函数组件必须立即返回jsx，不能等待异步操作
    // 用一个变量isShow控制，在等待异步操作过程中会渲染遮罩层，再根据校验结果渲染
    return <>
        {isShow ?
            <Component navigate={navigate}
                location={location}
                params={params}
                usp={usp} /> :
            <Mask visible={true}>
                <DotLoading color="white" />
            </Mask>
        }
    </>;
};

// 通过懒加载加载进来的组件使用Suspense标签，在fallback中声明组件加载完成前做的事
// fallback 属性接受任何在组件加载过程中想展示的 React 元素。
// 可以将 Suspense 组件置于懒加载组件之上的任何位置。可以用一个 Suspense 组件包裹多个懒加载组件。
export default function RouterView() {
    return <Suspense fallback={
        <Mask visible={true}>
            <DotLoading color="white" />
        </Mask>
    }>
        {/* 1--Route路由组件将路由表中每个配置路由对象展开，作为props属性传给Element */}
        <Routes>
            {routes.map(item => {
                let { name, path } = item;
                return <Route key={name}
                    path={path}
                    element={
                        <Element {...item} />
                    } />;
            })}
        </Routes>
    </Suspense>;
};