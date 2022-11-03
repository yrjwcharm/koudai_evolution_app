/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-11-03 11:37:22
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BoxShadow} from 'react-native-shadow';
import {Colors, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {px} from '~/utils/appUtil';

const Security = ({menu_list}) => {
    const jump = useJump();
    return menu_list ? (
        <View style={[Style.flexBetween, {marginTop: px(12)}]}>
            {menu_list.map((item, index) => (
                <BoxShadow
                    key={index}
                    setting={{
                        color: '#E3E6EE',
                        border: 8,
                        radius: 1,
                        opacity: 0.2,
                        x: 0,
                        y: 2,
                        width: px(167),
                        height: px(61),
                    }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.secure_card, styles.common_card]}
                        onPress={() => {
                            global.LogTool(item.click_code);
                            jump(item?.url);
                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FastImage style={{width: px(18), height: px(18)}} source={{uri: item.icon}} />
                            <View style={{marginLeft: px(5)}}>
                                <Text style={[styles.secure_title]}>{item?.title}</Text>
                                <Text style={styles.light_text}>{item.desc}</Text>
                            </View>
                        </View>
                        <FastImage
                            style={{width: px(10), height: px(10)}}
                            source={{
                                uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/right-arrow2.png',
                            }}
                        />
                    </TouchableOpacity>
                </BoxShadow>
            ))}
        </View>
    ) : null;
};

export default Security;

const styles = StyleSheet.create({
    secure_card: {
        width: px(165),
        padding: px(14),
        height: px(61),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    common_card: {
        backgroundColor: '#fff',
        borderRadius: px(5),
        marginRight: px(12),
    },
    secure_title: {
        fontSize: px(13),
        lineHeight: px(18),
        fontWeight: 'bold',
        color: Colors.defaultColor,
    },
    light_text: {
        fontSize: px(11),
        lineHeight: px(15),
        color: Colors.lightGrayColor,
        marginTop: px(4),
    },
});
