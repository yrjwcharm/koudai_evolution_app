/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-09-28 17:16:02
 */
import React, {forwardRef, useCallback, useMemo, useRef} from 'react';
import {ScrollView} from 'react-native';
import Context from './context';
import _ from 'lodash';

const LogViewWrapper = ({onScroll, onLayout, onContentSizeChange, children, ...restProps}, ref) => {
    const containerHeight = useRef();
    const containerScrollHeight = useRef();
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
            option.el?.measureLayout?.(scrollRef.current, (x, y, width, height) => {
                const touchHeight = y + height / 2;
                obj.touchHeight = touchHeight;
                handlerLog(containerHeight.current, obj);
            });
        });
    }, []);

    const unregister = useCallback((logKey) => {
        return delete logOptions.current[logKey];
    }, []);

    const providerValue = useMemo(() => {
        return {register, unregister};
    }, [register, unregister]);

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
                        option.el?.measureLayout?.(scrollRef.current, (x, y, width, height) => {
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
                // 重组scroll事件的 arguments
                onScroll?.(e, containerHeight.current, containerScrollHeight.current);
            }}
            onContentSizeChange={(w, h) => {
                containerScrollHeight.current = h;
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

export default forwardRef(LogViewWrapper);
