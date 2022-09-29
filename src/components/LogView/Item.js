/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-09-28 17:16:10
 */
import React, {forwardRef, useContext, useRef} from 'react';
import {View} from 'react-native';
import context from './context';

const Item = ({logKey, handler, onLayout, children = null, ...resetProps}, ref) => {
    const {register} = useContext(context);

    const viewRef = useRef();

    return logKey ? (
        <View
            {...resetProps}
            onLayout={(e) => {
                register?.([logKey, {el: viewRef.current, handler}]);
                onLayout?.(e);
            }}
            ref={(el) => {
                viewRef.current = el;
                if (ref) ref.current = el;
            }}>
            {children}
        </View>
    ) : (
        (console.error('请传入唯一的logKey'), null)
    );
};

export default forwardRef(Item);
