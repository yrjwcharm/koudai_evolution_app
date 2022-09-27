/*
 * @Description: 可对子元素曝光打点的scrollView
 * @Autor: wxp
 * @Date: 2022-09-26 11:13:58
 */
import React from 'react';
import {forwardRef, useEffect, useRef} from 'react';
import {ScrollView} from 'react-native';
import {deviceHeight} from '~/utils/appUtil';

/*
1. LogScrollView 应放在最外层
2. 需曝光的元素不应嵌套在其他ScrollView中，尽管是处在LogScrollView内部的ScrollView
const logOptions = useMemo(
    () => [
        {
            el: viewRef.current,
            handler: () => {
                console.log(123);
            },
        },
        ...
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewRef.current, sub4Ref.current]
);

<LogScrollView logOptions={logOptions} ...>
    ...
    
</LogScrollView>; 

*/

const LogScrollView = ({logOptions, onScroll, children, ...restProps}, ref) => {
    const touchHeights = useRef([]);

    useEffect(() => {
        function search(arr, x) {
            for (let i = arr.length - 1; i >= 0; i--) {
                if (x >= arr[i].touchHeight) return i + 1;
            }
            return 0;
        }
        logOptions
            ?.filter?.((obj) => obj.el)
            ?.forEach?.(({el, handler}) => {
                let exist = touchHeights.current.find((obj) => obj?.el === el);
                if (!exist) {
                    el?.measure?.((x, y, width, height) => {
                        const touchHeight = y + height / 2;
                        let i = search(touchHeights.current, touchHeight);
                        const obj = {
                            touchHeight,
                            status: true,
                            handler,
                            el,
                        };
                        touchHeights.current.splice(i, 0, obj);
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
                touchHeights.current.forEach((obj) => {
                    handlerLog(y + deviceHeight, obj);
                });
                onScroll?.(e);
            }}
            scrollEventThrottle={6}
            {...restProps}
            ref={ref}>
            {children}
        </ScrollView>
    );
};

export default forwardRef(LogScrollView);
