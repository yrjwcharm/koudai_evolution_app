/*
 * @Description:大额转账说明页
 * @Autor: xjh
 * @Date: 2021-01-23 13:46:12
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-24 16:44:37
 */
import React from 'react';
import {ScrollView, Linking, Alert, View} from 'react-native';
import FitImage from 'react-native-fit-image';
import Agreement from '../../components/Agreements';
import {FixedButton} from '../../components/Button';
import {px as text, isIphoneX} from '../../utils/appUtil';
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
    const img_list = [
        'https://static.licaimofang.com/wp-content/uploads/2021/05/large_pay_1.jpg',
        'https://static.licaimofang.com/wp-content/uploads/2021/05/large_pay_2.jpg',
        'https://static.licaimofang.com/wp-content/uploads/2021/05/large_pay_3.jpg',
    ];
    return (
        <View style={{backgroundColor: Colors.bgColor}}>
            <ScrollView style={{marginBottom: btnHeight}}>
                {img_list.map((_item, _index) => {
                    return <FitImage key={_index} source={{uri: _item}} resizeMode="contain" />;
                })}
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
