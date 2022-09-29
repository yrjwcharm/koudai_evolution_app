import Wrapper from './Wrapper';
import Item from './Item';

/*
 *  - 目前只供竖向滚动时子组件的曝光埋点
 *  - 需要曝光的元素不应嵌套在其他ScrollView中
 * 
 *  - 使用方式
    <LogView.Wrapper>  // 就是scrollView
        ...
        <LogView.Item  // 就是View
            logKey={字符串类型，当前ScrollView中唯一的key}
            handler={函数类型，此Item组件曝光时会执行此函数}
            ...
            >
            ...
        </LogView.Item>
       ...
    </LogView.Wrapper>;
 */

export default {
    Wrapper,
    Item,
};
