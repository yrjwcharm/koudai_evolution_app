/*
 * @Date: 2022-06-24 10:36:09
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-13 16:56:26
 * @Description:导入自选
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, PermissionsAndroid, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useSelector} from 'react-redux';
import {Button} from '~/components/Button';
import {followAdd} from '../Index/service';
import Toast from '~/components/Toast';
const Index = ({navigation, route}) => {
    const [checkList, setCheckList] = useState([]);
    let data = useSelector((store) => store.ocrFund).toJS()?.ocrOptionalList;
    useEffect(() => {
        //默认勾选
        setCheckList(data.map((item) => item.code));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const toggle = (code) => {
        setCheckList((prev) => {
            let tmp = [...prev];
            let index = tmp.indexOf(code);
            index > -1 ? tmp.splice(index, 1) : tmp.push(code);
            return tmp;
        });
    };
    const handleImport = async () => {
        let res = await followAdd({item_id: checkList.join(','), item_type: route?.params?.item_type || 1});
        Toast.show(res.message);
        if (res.code === '000000') {
            navigation.pop(2);
        }
    };
    return (
        <ScrollView style={styles.con}>
            {data?.map((item, index) => {
                return (
                    <View style={[Style.flexRow, {alignItems: 'flex-start', marginBottom: px(15)}]} key={index}>
                        <TouchableOpacity
                            style={{height: px(20), marginTop: px(2), width: px(24)}}
                            onPress={() => toggle(item.code)}>
                            <AntDesign
                                name={'checkcircle'}
                                size={px(14)}
                                color={checkList?.includes(item.code) ? Colors.btnColor : '#ddd'}
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={{fontSize: px(14), color: Colors.defaultColor}}>{item.name}</Text>
                            <Text style={{fontSize: px(11), color: Colors.lightGrayColor, marginTop: px(4)}}>
                                {item.code}
                            </Text>
                        </View>
                    </View>
                );
            })}
            <Button
                onPress={handleImport}
                title={'确定导入(已选' + checkList.length + '/' + data.length + ')'}
                disabled={checkList.length == 0}
            />
        </ScrollView>
    );
};

export default Index;

const styles = StyleSheet.create({
    con: {
        backgroundColor: '#fff',
        padding: px(16),
    },
});
