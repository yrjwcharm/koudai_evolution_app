/*
 * @Date: 2021-09-02 14:20:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-13 14:20:34
 * @Description:个性化推荐
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import http from '../../services';

const PersonalizedRecommend = () => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        http.get('/mapi/personalized/recommend/20210906').then((res) => {
            setOpen(res?.result?.status == 1 ? true : false);
        });
    }, []);
    const recommend = (value) => {
        http.post('/mapi/set/per_recommend/20210906', {status: value ? 1 : 0});
    };
    return (
        <>
            <View style={[styles.partBox, Style.flexBetween]}>
                <Text style={styles.title}>开启个性化推荐</Text>
                <Switch
                    ios_backgroundColor={'#CCD0DB'}
                    onValueChange={(value) => {
                        recommend(value);
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
