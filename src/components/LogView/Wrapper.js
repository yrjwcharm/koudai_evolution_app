/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-09-28 17:16:02
 */
import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import Context from './context';
import _ from 'lodash';

/*
 *  - 需要曝光的元素不应嵌套在其他ScrollView中
 *  - 目前只供竖向滚动埋点使用
 */
const Wrapper = ({onScroll, onLayout, onContentSizeChange, children, ...restProps}, ref) => {
    const containerHeight = useRef();
    const scrollRef = useRef();
    const logOptions = useRef({});

    const register = useCallback(([logKey, option]) => {
        if (!option?.el || logOptions.current[logKey]) return;
        const obj = {
            status: true,
            ...option,
        };
        logOptions.current[logKey] = obj;

        requestAnimationFrame(() => {
            option.el.measureLayout?.(scrollRef.current, (x, y, width, height) => {
                const touchHeight = y + height / 2;
                obj.touchHeight = touchHeight;
                handlerLog(containerHeight.current, obj);
            });
        });
    }, []);

    const providerValue = useMemo(() => {
        return {register};
    }, [register]);

    const handlerLog = (touchHeight, obj) => {
        if (obj.status && touchHeight >= obj.touchHeight) {
            obj.status = false;
            obj?.handler?.();
        }
    };

    const handlerScrollLog = useCallback(
        _.debounce((y) => {
            for (let key in logOptions.current) {
                let obj = logOptions.current[key];
                handlerLog(y + containerHeight.current, obj);
            }
        }, 150),
        []
    );

    const updateTouchHeights = useCallback(
        _.debounce(() => {
            for (let k in logOptions.current) {
                let option = logOptions.current[k];
                if (option.status) {
                    requestAnimationFrame(() => {
                        option.el.measureLayout?.(scrollRef.current, (x, y, width, height) => {
                            const touchHeight = y + height / 2;
                            option.touchHeight = touchHeight;
                        });
                    });
                }
            }
        }, 200),
        []
    );

    return (
        <ScrollView
            scrollEventThrottle={6}
            {...restProps}
            onScroll={(e) => {
                const y = e.nativeEvent.contentOffset.y;
                handlerScrollLog(y);
                onScroll?.(e);
            }}
            onContentSizeChange={(w, h) => {
                updateTouchHeights();
                onContentSizeChange?.(w, h);
            }}
            ref={(el) => {
                scrollRef.current = el;
                if (ref) ref.current = el;
            }}
            onLayout={(e) => {
                containerHeight.current = e.nativeEvent.layout.height;
                onLayout?.(e);
            }}>
            <Context.Provider value={providerValue}>{children}</Context.Provider>
        </ScrollView>
    );
};

export default forwardRef(Wrapper);
