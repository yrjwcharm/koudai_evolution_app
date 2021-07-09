/*
 * @Description:大额转账说明页
 * @Autor: xjh
 * @Date: 2021-01-23 13:46:12
 * @LastEditors: dx
 * @LastEditTime: 2021-07-09 16:22:40
 */
import React from 'react';
import {ScrollView, Linking, Alert, View, Image} from 'react-native';
import Agreement from '../../components/Agreements';
import {FixedButton} from '../../components/Button';
import {px as text, isIphoneX, deviceWidth} from '../../utils/appUtil';
import Toast from '../../components/Toast/';
import {Colors} from '../../common/commonStyle';
const btnHeight = isIphoneX() ? text(90) : text(66);
const LargeAmountIntro = () => {
    const callTel = () => {
        const url = 'tel:400-080-8208';
        global.LogTool('call');
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    return Toast.show('您的设备不支持该功能，请手动拨打400-080-8208');
                }
                return Linking.openURL(url);
            })
            .catch((err) => Alert(err));
    };

    return (
        <View style={{backgroundColor: Colors.bgColor}}>
            <ScrollView style={{marginBottom: btnHeight}}>
                <Image
                    source={require('../../assets/img/common/large_pay_1.jpg')}
                    style={{width: deviceWidth, height: deviceWidth * 0.68}}
                    // resizeMode="contain"
                />
                <Image
                    source={require('../../assets/img/common/large_pay_2.jpg')}
                    style={{width: deviceWidth, height: deviceWidth * 1.36}}
                    // resizeMode="contain"
                />
                <Image
                    source={require('../../assets/img/common/large_pay_3.png')}
                    style={{width: deviceWidth, height: deviceWidth * 2.3}}
                    // resizeMode="contain"
                />
                <Agreement
                    isHide={true}
                    data={[{title: '《理财魔方汇款交易须知》', id: 37}]}
                    style={{marginLeft: text(16), paddingTop: text(8), paddingBottom: text(6)}}
                />
            </ScrollView>
            <FixedButton title={'魔方客服电话:400-080-8208'} onPress={() => callTel()} />
        </View>
    );
};
export default LargeAmountIntro;
