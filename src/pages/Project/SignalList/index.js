/*
 * @Date: 2022-07-23 12:08:12
 * @Description:指数买卖信号列表
 */
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getList} from './service';
import {Colors, Style, Font} from '~/common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import {px} from '~/utils/appUtil';
import {useJump} from '~/components/hooks';

const SignalList = ({navigation}) => {
    const [data, setData] = useState({});
    const jump = useJump();
    const getData = async () => {
        let res = await getList();
        setData(res.result);
        navigation.setOptions({
            title: res.result.title,
            headerRight: () => (
                <TouchableOpacity style={{width: px(68)}} onPress={() => jump(res?.result?.subs_url?.url)}>
                    <Text>{res?.result?.subs_url?.text}</Text>
                </TouchableOpacity>
            ),
        });
    };
    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    return (
        <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
            <View style={[Style.flexBetween, {flexWrap: 'wrap', padding: px(16)}]}>
                {data?.list?.map((item, index) => (
                    <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => jump(item.url)}>
                        <LinearGradient
                            style={styles.con}
                            colors={item?.background || ['#E0F9DC', '#EEF7ED']}
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}>
                            <Text style={styles.text}>{item.text}</Text>
                            <Text
                                style={{
                                    color: Colors.defaultColor,
                                    fontSize: px(15),
                                    fontFamily: Font.numFontFamily,
                                }}>
                                {item?.index_num}
                            </Text>
                            <View style={[Style.flexBetween, {position: 'absolute', bottom: px(8)}]}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: Colors.lightBlackColor,
                                        fontSize: px(12),
                                    }}>
                                    {item?.desc}
                                </Text>
                                {!!item?.strength_icon && (
                                    <Image source={{uri: item?.strength_icon}} style={styles.icon} />
                                )}
                            </View>
                            {!!item?.favor_icon && <Image source={{uri: item?.favor_icon}} style={styles.favor_icon} />}
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
                <Text style={{color: '#BDC2CC', fontSize: px(11), marginTop: px(8)}}>{data?.flush_time}</Text>
            </View>
        </ScrollView>
    );
};

export default SignalList;

const styles = StyleSheet.create({
    con: {
        width: px(110),
        height: px(91),
        borderRadius: px(5),
        marginBottom: px(10),
        paddingLeft: px(8),
        alignItems: 'center',
    },
    text: {
        color: Colors.defaultColor,
        fontSize: px(12),
        marginBottom: px(6),
        marginTop: px(12),
    },
    icon: {
        width: px(34),
        height: px(24),
    },
    favor_icon: {
        width: px(12),
        height: px(14),
        position: 'absolute',
        left: px(8),
        top: px(0),
    },
});
