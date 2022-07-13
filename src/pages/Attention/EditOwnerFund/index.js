/*
 * @Date: 2022-06-24 10:38:02
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-13 23:10:29
 * @Description:修改持仓
 */
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Colors, Font, Style} from '~/common/commonStyle';
import {onlyNumber, px} from '~/utils/appUtil';
import addImg from '~/assets/img/attention/add.png';
import downImg from '~/assets/img/attention/down.png';
import {Button} from '~/components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {updateFundList} from '~/redux/actions/ocrFundList';
import Toast from '~/components/Toast';
const Index = ({navigation, route}) => {
    const dispatch = useDispatch();
    const key = route?.params?.key;
    let ocrFundList = useSelector((store) => store.ocrFund).toJS();
    const initalData = useSelector((store) => store.ocrFund).toJS()?.ocrOwernList[key];
    const tmpData = {...initalData};
    tmpData.yield = tmpData.yield < 0 ? tmpData.yield.slice(1) : tmpData.yield;
    const [data, setData] = useState(tmpData);
    const [isUp, setIsUp] = useState(initalData.yield > 0 ? true : false);
    const handleSave = () => {
        let _data = {...data};
        if (!isUp && _data?.yield != 0) {
            _data.yield = '-' + _data.yield;
        }
        let tmpCcrFundList = [...ocrFundList.ocrOwernList];
        tmpCcrFundList[key] = _data;
        dispatch(updateFundList({ocrOwernList: tmpCcrFundList}));
        navigation.goBack();
    };
    const onChangeText = (value, _key) => {
        if (value > 99999999) {
            Toast.show('请输入合理的金额');
            return;
        }
        setData((prev) => {
            let tmp = {...prev};
            tmp[_key] = onlyNumber(value);
            return tmp;
        });
    };
    const hanldeToggle = () => {
        setIsUp((prev) => !prev);
    };
    return (
        <View style={styles.con}>
            <View style={{...Style.flexRow, marginBottom: px(12)}}>
                <Text style={styles.lable}>基金名称</Text>
                <View style={styles.input_con}>
                    <TextInput style={styles.input} defaultValue={data.name} editable={false} />
                </View>
            </View>
            <View style={{...Style.flexRow, marginBottom: px(12)}}>
                <Text style={styles.lable}>持有金额</Text>
                <View style={styles.input_con}>
                    <TextInput
                        style={styles.input}
                        value={data.amount}
                        keyboardType={'numeric'}
                        placeholder="请输入持有金额"
                        onChangeText={(value) => {
                            onChangeText(value, 'amount');
                        }}
                    />
                </View>
            </View>
            <View style={{...Style.flexRow}}>
                <Text style={styles.lable}>持有收益</Text>
                <TouchableOpacity onPress={hanldeToggle}>
                    <Image
                        source={isUp ? addImg : downImg}
                        style={{width: px(24), height: px(24), marginRight: px(7)}}
                    />
                </TouchableOpacity>
                <View style={styles.input_con}>
                    <TextInput
                        placeholder="请输入持有收益"
                        style={styles.input}
                        value={data.yield}
                        keyboardType={'numeric'}
                        onChangeText={(value) => {
                            onChangeText(value, 'yield');
                        }}
                    />
                </View>
            </View>
            <Button
                title="保存"
                onPress={handleSave}
                style={{marginTop: px(20)}}
                disabled={!data.amount || !data.yield}
            />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    con: {
        backgroundColor: '#fff',
        padding: px(16),
        paddingTop: px(24),
        flex: 1,
    },
    lable: {
        fontSize: px(12),
        color: Colors.lightBlackColor,
        marginRight: px(12),
    },
    input_con: {
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
        height: px(40),
        flex: 1,
        paddingHorizontal: px(16),
    },
    input: {
        flex: 1,
        height: px(40),
        fontFamily: Font.numFontFamily,
        fontSize: px(16),
    },
});
