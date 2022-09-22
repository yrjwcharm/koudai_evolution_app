/*
 * @Date: 2022-08-25 17:09:12
 * @Description: 页面加载高阶组件
 */
import React, {forwardRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Colors, Style} from '../common/commonStyle';

const PageLoadingComponent = ({Component, color = Colors.lightGrayColor, _ref, ...props}) => {
    const [loading, setLoading] = useState(true);

    return (
        <View style={styles.container}>
            <Component {...props} _ref={_ref} setLoading={setLoading} />
            {loading && (
                <View style={[Style.flexCenter, styles.loadingContainer]}>
                    <ActivityIndicator color={color} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: Colors.bgColor,
        zIndex: 9999,
    },
});

export default (Component, color) =>
    forwardRef((props, ref) => <PageLoadingComponent {...props} Component={Component} color={color} _ref={ref} />);
