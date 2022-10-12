/*
 * @Author: dx
 * @Date: 2021-01-18 15:10:15
 * @LastEditTime: 2022-04-22 11:02:59
 * @LastEditors: yhc
 * @Description: 底部背书
 * @FilePath: /koudai_evolution_app/src/components/BottomDesc.js
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet} from 'react-native';
import {deviceWidth, px, px as text} from '../utils/appUtil';
import {Colors, Space} from '../common/commonStyle';
import FastImage from 'react-native-fast-image';
import {useJump} from './hooks';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import http from '../services';
const BottomDesc = (props) => {
    const isUnmounted = useRef(false);
    const route = useRoute();
    const [data, setData] = useState(null);
    const {style} = props;
    const jump = useJump();

    useFocusEffect(
        useCallback(() => {
            http.get('/mapi/app/footer/20220518', {
                name: route.name,
                params: JSON.stringify(route.params),
            }).then((res) => {
                if (res.code === '000000') {
                    if (!isUnmounted.current) {
                        setData(res.result);
                    }
                }
            });
        }, [route])
    );
    /**
     * 已封装hooks utils/useIsMounted.js
     * 使用此方案解决控制台  Warning: Can't perform a React state update on an unmounted component.
     * This is a no-op, butit indicates a memory leak in your application.
     * To fix, cancel all subscriptions and asynchronous tasks
     */
    useEffect(() => {
        return () => {
            isUnmounted.current = true;
        };
    }, []);
    return (
        <View style={[styles.con, ...(Object.prototype.toString.call(style) === '[object Object]' ? [style] : style)]}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                {props?.fix_img ? (
                    Array.isArray(props.fix_img) ? (
                        props.fix_img.map((item, idx) => (
                            <FastImage
                                key={idx}
                                resizeMode={FastImage.resizeMode.contain}
                                source={{uri: item}}
                                style={[{height: text(30), minWidth: '50%', maxWidth: '100%', marginBottom: text(8)}]}
                            />
                        ))
                    ) : (
                        <FastImage
                            resizeMode={FastImage.resizeMode.contain}
                            source={{uri: props.fix_img}}
                            style={[{height: text(30), minWidth: '50%', maxWidth: '100%', marginBottom: text(8)}]}
                        />
                    )
                ) : null}
            </View>
            {data?.img && (
                <View style={styles.item}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={{uri: data?.img}}
                        style={[styles.img]}
                    />
                </View>
            )}
            {data?.sale_service ? (
                <View style={{alignItems: 'center'}}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={require('../assets/img/bottomDescLeft.png')}
                        style={{position: 'absolute', left: px(10), height: text(10), width: px(78), top: px(4)}}
                    />
                    <Text style={[styles.text, {textAlign: 'center', position: 'relative'}]}>{data?.sale_service}</Text>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={require('../assets/img/bottomDescRight.png')}
                        style={{position: 'absolute', right: px(10), height: text(10), width: px(78), top: px(4)}}
                    />
                </View>
            ) : null}
            <View style={styles.item}>
                <Text style={[styles.text]}>{data?.sale_credential?.text}</Text>
                {data?.sale_credential?.url ? (
                    <Text
                        style={styles.button}
                        onPress={() => {
                            global.LogTool('bottomDesc');
                            jump(data?.sale_credential?.url);
                        }}>
                        {data?.sale_credential?.tip}
                    </Text>
                ) : null}
            </View>
            <View style={styles.item}>
                <Text style={[styles.text, {color: '#B8C1D3', marginTop: text(8)}]}>{data?.reminder}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    con: {
        marginVertical: text(40),
        paddingHorizontal: Space.padding,
    },
    img: {
        width: deviceWidth - text(40),
        height: text(34),
        marginBottom: text(12),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: Colors.darkGrayColor,
        fontSize: text(11),
        lineHeight: text(18),
    },
    button: {
        color: Colors.brandColor,
        fontSize: text(11),
        marginLeft: text(2),
    },
    bg: {
        width: deviceWidth - Space.marginAlign * 2,
        height: text(18),
    },
});

BottomDesc.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};
BottomDesc.defaultProps = {
    style: {},
};

export default BottomDesc;
