/*
 * @Description:大额转账说明页
 * @Autor: xjh
 * @Date: 2021-01-23 13:46:12
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-25 15:59:39
 */
import React, {useEffect, memo} from 'react';
import {View, ScrollView, StyleSheet, Linking, Alert, Dimensions} from 'react-native';
import FitImage from 'react-native-fit-image';
import Agreement from '../../components/Agreements';
import {FixedButton} from '../../components/Button';
import Toast from '../../components/Toast/';
const deviceWidth = Dimensions.get('window').width;
const LargeAmountIntro = (props) => {
    const callTel = () => {
        const url = 'tel:400-080-8208';
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    return Toast.show(`您的设备不支持该功能，请手动拨打400-080-8208`);
                }
                return Linking.openURL(url);
            })
            .catch((err) => Alert(err));
    };
    const img_list = [
        'https://static.licaimofang.com/wp-content/uploads/2020/12/remit_intro1.png',
        'https://static.licaimofang.com/wp-content/uploads/2020/12/remit_intro2.png',
        'https://static.licaimofang.com/wp-content/uploads/2020/12/remit_intro3.png',
    ];
    return (
        <>
            <ScrollView>
                {img_list &&
                    img_list.map((_item, _index) => {
                        return <FitImage key={_index} source={{uri: _item}} resizeMode="contain" />;
                    })}
                <View style={{paddingBottom: 100}}>
                    <Agreement isHide={true} data={[{title: '《理财魔方汇款交易须知》'}]} />
                </View>
            </ScrollView>
            <FixedButton title={'魔方客服电话:400-080-8208'} onPress={() => callTel()} />
        </>
    );
};
export default LargeAmountIntro;
const styles = StyleSheet.create({
    img_sty: {
        width: deviceWidth,
        height: 'auto',
        flex: 1,
    },
});
