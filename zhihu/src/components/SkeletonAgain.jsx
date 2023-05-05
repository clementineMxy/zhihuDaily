// 对UI组件库二次封装，目的：多个UI组件作为一个整体，设置通用样式
import React from "react";
import { Skeleton } from 'antd-mobile';
import './SkeletonAgain.less';

const SkeletonAgain = function SkeletonAgain() {
    return <div className="skeleton-again-box">
        <Skeleton.Title animated />
        <Skeleton.Paragraph lineCount={5} animated />
    </div>;
};
export default SkeletonAgain;