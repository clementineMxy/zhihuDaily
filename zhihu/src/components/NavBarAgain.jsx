// 对UI组件库的NavBar二次封装，目的：对复杂业务逻辑的统一处理
import React from "react";
import PropTypes from "prop-types";
import { NavBar } from 'antd-mobile';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './NavBarAgain.less';

const NavBarAgain = function NavBarAgain(props) {
    let { title } = props;
    const navigate = useNavigate(),
        location = useLocation(),
        [usp] = useSearchParams();

    const handleBack = () => {
        // 特殊:登录页 & to的值是/deatil/xxx(to是自己传的search参数)
        // 不是通过路由表匹配的组件props里没有路由信息，需要用路由hooks
        let to = usp.get('to');
        if (location.pathname === '/login' && /^\/detail\/\d+$/.test(to)) {
            navigate(to, { replace: true });
            return;
        }
        navigate(-1);
    };

    return <NavBar className="navbar-again-box"
        onBack={handleBack}>
        {title}
    </NavBar>
};
NavBarAgain.defaultProps = {
    title: '个人中心'
};
NavBarAgain.propTypes = {
    title: PropTypes.string
};

export default NavBarAgain;