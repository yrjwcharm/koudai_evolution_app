/*
 * @Date: 2021-01-22 10:51:10
 * @Author: dx
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-02 19:04:52
 * @Description: 资产增强
 */
import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FitImage from 'react-native-fit-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import http from '../../services';
import BottomDesc from '../../components/BottomDesc';
import FixedBtn from './components/FixedBtn';

const AssetsEnhance = ({navigation}) => {
    const [data, setData] = useState({});
    useEffect(() => {
        http.get('/portfolio/asset_enhance/20210101').then((res) => {
            setData(res.result);
            navigation.setOptions({title: res.result.title});
        });
    }, [navigation]);
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            {Object.keys(data).length > 0 && (
                <ScrollView>
                    <View style={styles.topPart}>
                        <Text style={styles.topTitle}>{data.info.title}</Text>
                        <Text style={styles.topContent}>{data.info.content}</Text>
                        <FitImage
                            source={{
                                uri: data.info.img,
                            }}
                            style={styles.img}
                        />
                    </View>
                    <View style={styles.details}>
                        {data.info.items.map((_item, _index) => {
                            return (
                                <View style={[styles.detail, {marginTop: 0}]} key={_index + '_item'}>
                                    <Text style={styles.title}>{_item.title}</Text>
                                    <Text style={styles.content}>{_item.content}</Text>
                                </View>
                            );
                        })}
                    </View>
                    <BottomDesc />
                </ScrollView>
            )}
            {data.btns && <FixedBtn btns={data.btns} />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topPart: {
        paddingVertical: Space.marginVertical,
        paddingHorizontal: Space.marginAlign,
        backgroundColor: '#fff',
    },
    topTitle: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    topContent: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        marginTop: text(4),
    },
    img: {
        marginTop: text(8),
        paddingHorizontal: text(18),
    },
    details: {
        marginHorizontal: Space.marginAlign,
        marginBottom: text(20),
        paddingVertical: Space.marginVertical,
        paddingRight: text(8),
        paddingLeft: text(14),
        backgroundColor: Colors.bgColor,
        borderRadius: Space.borderRadius,
    },
    detail: {
        marginTop: text(14),
    },
    title: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
        fontWeight: '500',
        marginBottom: text(4),
    },
    content: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
    },
});

export default AssetsEnhance;
