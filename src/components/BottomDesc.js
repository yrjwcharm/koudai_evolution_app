/*
 * @Author: dx
 * @Date: 2021-01-18 15:10:15
 * @LastEditTime: 2021-12-06 20:46:35
 * @LastEditors: yhc
 * @Description: 底部背书
 * @FilePath: /koudai_evolution_app/src/components/BottomDesc.js
 */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';
import {deviceWidth, px as text} from '../utils/appUtil';
import {Colors, Space, Style} from '../common/commonStyle';
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
            {props?.fix_img
                ? [props.fix_img].flat(3).map((item) => (
                      <View style={styles.item}>
                          <FastImage
                              resizeMode={FastImage.resizeMode.contain}
                              source={{uri: item}}
                              style={[{height: text(30), width: '100%', marginBottom: text(8)}]}
                          />
                      </View>
                  ))
                : null}
            <View style={styles.item}>
                <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    source={{uri: userInfo.toJS()[type + '_footer_config']?.img}}
                    style={[styles.img]}
                />
            </View>
            {userInfo.toJS()[type + '_footer_config']?.sale_service ? (
                <ImageBackground
                    style={[Style.flexRowCenter, styles.bg]}
                    source={require('../assets/img/bottomBg.png')}>
                    <Text style={styles.text}>{userInfo.toJS()[type + '_footer_config']?.sale_service}</Text>
                </ImageBackground>
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
