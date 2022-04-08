/*
 * @Author: dx
 * @Date: 2021-01-18 15:10:15
 * @LastEditTime: 2022-04-08 13:18:00
 * @LastEditors: yhc
 * @Description: 底部背书
 * @FilePath: /koudai_evolution_app/src/components/BottomDesc.js
 */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet} from 'react-native';
import {deviceWidth, px, px as text} from '../utils/appUtil';
import {Colors, Space} from '../common/commonStyle';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {useJump} from './hooks';

const BottomDesc = (props) => {
    const userInfo = useSelector((store) => store.userInfo);
    const {style} = props;
    const jump = useJump();
    const [type, setType] = useState(userInfo.toJS().po_ver === 0 ? 'ym' : 'xy');
    useEffect(() => {
        setType(userInfo.toJS().po_ver === 0 ? 'ym' : 'xy');
    }, [userInfo]);
    return (
        <View style={[styles.con, ...(Object.prototype.toString.call(style) === '[object Object]' ? [style] : style)]}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                {props?.fix_img ? (
                    Array.isArray(props.fix_img) ? (
                        Array.isArray.map((item, idx) => (
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
            <View style={styles.item}>
                <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    source={{uri: userInfo.toJS()[type + '_footer_config']?.img}}
                    style={[styles.img]}
                />
            </View>
            {userInfo.toJS()[type + '_footer_config']?.sale_service ? (
                <View style={{alignItems: 'center'}}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={require('../assets/img/bottomDescLeft.png')}
                        style={{position: 'absolute', left: px(10), height: text(10), width: px(78), top: px(4)}}
                    />
                    <Text style={[styles.text, {textAlign: 'center', position: 'relative'}]}>
                        {userInfo.toJS()[type + '_footer_config']?.sale_service}
                    </Text>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        source={require('../assets/img/bottomDescRight.png')}
                        style={{position: 'absolute', right: px(10), height: text(10), width: px(78), top: px(4)}}
                    />
                </View>
            ) : null}
            <View style={styles.item}>
                <Text style={[styles.text]}>{userInfo.toJS()[type + '_footer_config']?.sale_credential?.text}</Text>
                {userInfo.toJS()[type + '_footer_config']?.sale_credential?.url ? (
                    <Text
                        style={styles.button}
                        onPress={() => {
                            global.LogTool('bottomDesc');
                            jump(userInfo.toJS()[type + '_footer_config']?.sale_credential?.url);
                        }}>
                        {userInfo.toJS()[type + '_footer_config']?.sale_credential?.tip}
                    </Text>
                ) : null}
            </View>
            <View style={styles.item}>
                <Text style={[styles.text, {color: '#B8C1D3', marginTop: text(8)}]}>
                    {userInfo.toJS()[type + '_footer_config']?.reminder}
                </Text>
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
