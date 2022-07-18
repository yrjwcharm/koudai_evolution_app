/*
 * @Date: 2022-07-13 14:31:50
 * @Description:计划首页
 */
import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import NavBar from '~/components/NavBar';
import RenderSignal from './RenderSignal';
import {Button} from '~/components/Button';
import {useFocusEffect} from '@react-navigation/native';
import {getProjectData} from './service';

const Index = ({navigation}) => {
    const [data, setData] = useState({});
    const getData = async () => {
        let res = await getProjectData();
        setData(res.result);
        console.log(res.result);
    };
    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );
    return (
        <>
            <NavBar title="计划" />
            <ScrollView style={{backgroundColor: '#fff', paddingHorizontal: px(16)}}>
                <Title style={{marginBottom: px(16)}} />
                {data?.navigator?.items?.map((item, index) => (
                    <View>
                        <Image source={{uri: item.icom}} style={{width: px(32), height: px(32)}} />
                    </View>
                ))}
                <RenderSignal />
                <Button
                    onPress={() => {
                        navigation.navigate('ProjectSetTrade');
                    }}
                />
            </ScrollView>
        </>
    );
};
const Title = ({style}) => {
    return (
        <View style={Style.flexRow}>
            <Text style={{fontSize: px(18), fontWeight: '700', color: Colors.defaultColor, marginRight: px(8)}}>
                买入工具
            </Text>
            <Text style={{fontSize: px(13), color: Colors.lightGrayColor}}>为您提供合适的买卖点时机</Text>
        </View>
    );
};
export default Index;

const styles = StyleSheet.create({});
