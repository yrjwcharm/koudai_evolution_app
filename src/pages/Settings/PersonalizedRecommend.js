/*
 * @Date: 2021-09-02 14:20:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-07 16:57:28
 * @Description:个性化推荐
 */
import React, {useState} from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';

const PersonalizedRecommend = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <View style={[styles.partBox, Style.flexBetween]}>
                <Text style={styles.title}>开启个性化推荐</Text>
                <Switch
                    ios_backgroundColor={'#CCD0DB'}
                    onValueChange={(value) => {
                        setOpen(value);
                    }}
                    thumbColor={'#fff'}
                    trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                    value={open}
                />
            </View>
            <Text style={styles.text}>您收到的内容跟您个人相关性比较弱</Text>
        </>
    );
};
const styles = StyleSheet.create({
    partBox: {
        marginVertical: Space.marginVertical,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: px(56),
        marginHorizontal: Space.marginVertical,
    },
    text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        marginHorizontal: Space.marginVertical,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.lightBlackColor,
    },
});
export default PersonalizedRecommend;
