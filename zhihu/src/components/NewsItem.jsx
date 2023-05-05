import React from "react";
import './NewsItem.less';
import { Image } from 'antd-mobile';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NewsItem = function NewsItem(props) {
    let { info } = props;
    if (!info) return null;

    let { id, title, hint, images, image } = info;
    // 如果image是undefined，转换为数组，避免下面用下标访问报错
    if (!images) images = [image];
    if (!Array.isArray(images)) images = [""];
    return <div className="news-item-box">
        <Link to={{ pathname: `/detail/${id}` }}>
            <div className="content">
                <h4 className="title">{title}</h4>
                {hint ? <p className="author">{hint}</p> : null}
            </div>
            <Image src={images[0]} lazy />
        </Link>
    </div>;
};
/* 属性规则处理 */
NewsItem.defaultProps = {
    info: null
};
NewsItem.propTypes = {
    info: PropTypes.object
};

export default NewsItem;