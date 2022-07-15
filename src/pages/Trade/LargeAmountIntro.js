/*
 * @Description:大额转账说明页
 * @Autor: xjh
 * @Date: 2021-01-23 13:46:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-15 10:26:20
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, Linking, Alert, View, Image} from 'react-native';
import Agreement from '../../components/Agreements';
import {FixedButton} from '../../components/Button';
import {px as text, isIphoneX, deviceWidth} from '../../utils/appUtil';
import Toast from '../../components/Toast/';
import {Colors} from '../../common/commonStyle';
import Http from '../../services';
const btnHeight = isIphoneX() ? text(90) : text(66);
const LargeAmountIntro = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        Http.get('/trade/large_transfer/intro/20210101').then((res) => {
            setData(res.result);
        });
    }, []);
    const callTel = (phone) => {
        const url = `tel:${phone}`;
        global.LogTool('call');
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    return Toast.show(`您的设备不支持该功能，请手动拨打${phone}`);
                }
                return Linking.openURL(url);
            })
            .catch((err) => Alert(err));
    };

    return Object.keys(data || {})?.length ? (
        <View style={{backgroundColor: Colors.bgColor}}>
            <ScrollView style={{marginBottom: btnHeight}}>
                {data?.imgs?.map((item, index) => (
                    <Image
                        key={index}
                        source={{uri: item}}
                        style={{
                            width: deviceWidth,
                            height:
                                index == 0 ? deviceWidth * 0.68 : index == 1 ? deviceWidth * 1.36 : deviceWidth * 2.3,
                        }}
                    />
                ))}
                <Agreement
                    isHide={true}
                    data={data?.agreement}
                    style={{marginLeft: text(16), paddingTop: text(8), paddingBottom: text(6)}}
                />
            </ScrollView>
            <FixedButton title={`魔方客服电话:${data.phone}`} onPress={() => callTel(data.phone)} />
        </View>
    ) : null;
};
export default LargeAmountIntro;
