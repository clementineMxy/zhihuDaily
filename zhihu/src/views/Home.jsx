import React, { useState, useEffect, useRef } from "react";
import HomeHead from "../components/HomeHead";
import _ from '../assets/utils';
import './Home.less';
import { Swiper, Image, Divider, DotLoading } from 'antd-mobile';
import { Link } from 'react-router-dom';
import api from '../api';
import NewsItem from "../components/NewsItem";
import SkeletonAgain from "../components/SkeletonAgain";

const Home = function Home() {
    /* 创建所需状态 */
    // formatTime参数如果不是字符串，就使用当前时间的字符串，{0}{1}{2}表示返回年月日
    let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}")),
        [bannerData, setBannerData] = useState([]),
        [newsList, setNewsList] = useState([]);
    let loadMore = useRef();

    /* 第一次渲染完毕:向服务器发送数据请求 */
    useEffect(() => {
        (async () => {
            try {
                let { date, stories, top_stories } = await api.queryNewsLatest();
                setToday(date);
                setBannerData(top_stories);
                // 更新新闻列表状态
                newsList.push({
                    date,
                    stories
                });
                setNewsList([...newsList]);
            } catch (_) { }
        })();
    }, []);

    /* 第一次渲染完毕:设置监听器,实现触底加载 */
    useEffect(() => {
        // IntersectionObserver用于检测一个元素是否离开了另一个元素的可视区域
        // 创建IntersectionObserver对象时第二个参数可以是一个配置对象，里面包含root、threshold或者rootMargin的值
        // root根元素，判断可见性的参照元素
        // rootMargin根边距，为正数px相当于提前对应像素触发回调函数，为负数px相当于延后对应像素触发回调函数
        // changes数组包含了所有被观察元素的交叉信息。每个元素都是一个IntersectionObserverEntry对象
        // 根据被观察元素发生交叉的时间戳排序
        let ob = new IntersectionObserver(async changes => {
            let { isIntersecting } = changes[0];
            if (isIntersecting) {
                // 加载更多的按钮出现在视口中「也就是触底了」
                try {
                    let time = newsList[newsList.length - 1]['date'];
                    let res = await api.queryNewsBefore(time);
                    newsList.push(res);
                    // 状态变量的地址不变，useEffect不会更新，视图也不更新，所以需要用一个新变量设置状态
                    setNewsList([...newsList]);
                } catch (_) { }
            }
        });
        let loadMoreBox = loadMore.current;
        // 可以监测多个元素，只要把每个元素的引用作为参数传入就可以了。
        // 例如：ob.observe(element1); ob.observe(element2);
        ob.observe(loadMore.current);

        // 组件完全销毁时触发这个回调函数，手动销毁监听器
        return () => {
            // ob.unobserve(lloadMore.current) 不生效，因为loadMore.current已经是null
            // 可以提前let loadMoreBox = loadMore.current存这个dom
            ob.unobserve(loadMoreBox); //loadMore.current=null
            ob = null;
        };
    }, []);

    return <div className="home-box">
        {/* 头部 */}
        <HomeHead today={today} />

        {/* 轮播图 */}
        <div className="swiper-box">
            {/* bannerData不为空才渲染Swiper */}
            {bannerData.length > 0 ? <Swiper autoplay={true} loop={true}>
                {bannerData.map(item => {
                    let { id, image, title, hint } = item;
                    return <Swiper.Item key={id}>
                        <Link to={{ pathname: `/detail/${id}` }}>
                            <Image src={image} lazy />
                            <div className="desc">
                                <h3 className="title">{title}</h3>
                                <p className="author">{hint}</p>
                            </div>
                        </Link>
                    </Swiper.Item>;
                })}
            </Swiper> : null}
        </div>

        {/* 新闻列表 */}
        {newsList.length === 0 ?
            <SkeletonAgain /> : 
            // 空标签包裹 避免多个根标签
            <>
                {
                    newsList.map((item, index) => {
                        let { date, stories } = item;
                        return <div className="news-box" key={date}>
                            {/* 当天的新闻不需要标识日期 */}
                            {index !== 0 ? <Divider contentPosition="left">
                                {_.formatTime(date, '{1}月{2}日')}
                            </Divider> : null}
                            <div className="list">
                                {stories.map(cur => {
                                    return <NewsItem key={cur.id} info={cur} />;
                                })}
                            </div>
                        </div>;
                    })
                }
            </>
        }

        {/* 加载更多 */}
        <div className="loadmore-box" ref={loadMore}
            style={{
                display: newsList.length === 0 ? 'none' : 'block'
            }} >
            <DotLoading />
            数据加载中
        </div>
    </div >;
};
export default Home;