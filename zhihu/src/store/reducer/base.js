// 导入所有的模块或者子模块，使用 TYPES.<type> 的形式来引用类型
import * as TYPES from '../action-types';
// 导入默认的模块或者对象。使用 _.<method> 的形式来调用 utils 中定义的方法或者属性。
import _ from '../../assets/utils';

let initial = {
    info: null
};
export default function baseReducer(state = initial, action) {
    // reducer函数必须是一个纯函数，不能修改函数参数state
    // 使用 lodash 库的方法来复制 state 对象，它表示创建一个新的对象，它的属性和值和原来的 state 对象一样，但是没有引用关系。
    state = _.clone(state);
    switch (action.type) {
        // 更新登录者信息
        case TYPES.BASE_INFO:
            state.info = action.info;
            break;
        default:
    }
    return state;
};