/*
 * @Description: 可对子元素曝光打点的scrollView
 * @Autor: wxp
 * @Date: 2022-09-26 11:13:58
 */
import React, {useMemo, useState} from 'react';
import {forwardRef, useEffect, useRef} from 'react';
import {ScrollView} from 'react-native';
import {deviceHeight} from '~/utils/appUtil';

/*
-. 需曝光的元素不应嵌套在其他ScrollView中
-. 目前只支持竖向滚动埋点

// 1.声明元素加载是否完成的flag
const [load1,setLoad1] = useState(false) 
const [load2,setLoad2] = useState(false) 

// 2.声明元素引用变量
const ref1 = useRef()
const ref2 = useRef()

// 设置options， 为了性能建议使用 useMemo
const logOptions = useMemo(()=>{
    let obj = {}

    if(load1) {
        // 设置唯一key用来快速查找
        obj[唯一key] = { // el, handler两个配置项
            el: ref1.el,
            handler: () => {
                // 曝光时自动执行LogTool({})
            }
        }
    }
    if(load2){
          // 设置唯一key用来快速查找
          obj[唯一key] = {
            el: ref1.el,
            handler: () => {
                // 曝光时自动执行LogTool({})
            }
        }
    }
    。。。

    return obj

},[load1,load2])

<LogScrollView logOptions={logOptions} ...>
    。。。
    <View ref={ref1} onLoad={()=>setLoad1(true)}>
    </View>

    <View ref={ref2} onLoad={()=>setLoad2(true)}>
    </View>
    。。。
</LogScrollView>; 

*/

const LogScrollView = ({logOptions, onScroll, children, ...restProps}, ref) => {
    const touchHeightsMap = useRef({});
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current &&
            Object.keys(logOptions).forEach?.((key) => {
                const {el, handler} = logOptions[key];
                if (el && !touchHeightsMap.current[key]) {
                    const obj = {
                        status: true,
                        handler,
                        el,
                    };
                    touchHeightsMap.current[key] = obj;
                    el?.measureLayout?.(scrollRef.current, (x, y, width, height) => {
                        const touchHeight = y + height / 2;
                        obj.touchHeight = touchHeight;
                        handlerLog(deviceHeight, obj);
                    });
                }
            });
    }, [logOptions]);

    const handlerLog = (touchHeight, obj) => {
        if (obj.status && touchHeight >= obj.touchHeight) {
            obj.status = false;
            obj?.handler?.();
        }
    };

    return (
        <ScrollView
            onScroll={(e) => {
                const y = e.nativeEvent.contentOffset.y;
                Object.values(touchHeightsMap.current).forEach((obj) => {
                    handlerLog(y + deviceHeight, obj);
                });
                onScroll?.(e);
            }}
            scrollEventThrottle={6}
            {...restProps}
            ref={(el) => {
                scrollRef.current = el;
                if (ref) ref.current = el;
            }}>
            {children}
        </ScrollView>
    );
};

export default forwardRef(LogScrollView);
