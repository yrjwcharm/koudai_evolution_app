/*
 * @Date: 2022-07-20 17:00:22
 * @Description:
 */
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Colors, Space, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import {getInfo} from './service';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {BankCardModal} from '~/components/Modal';
const Index = ({route}) => {
    const poid = route?.params?.poid || 1;
    const project_id = route?.params?.project_id || 'X04F926077';
    const [data, setData] = useState({});
    const [bankSelect, setBankSelect] = useState(0);
    const bankCardRef = useRef();
    const jump = useJump();
    const getData = async () => {
        let res = await getInfo({poid, project_id});
        setData(res.result);
    };
    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    const changeBankCard = () => {};
    const render_bank = () => {
        const {pay_methods = []} = data;
        return (
            <View style={[Style.flexBetween, styles.bankCard]}>
                <View style={Style.flexRow}>
                    <Image
                        style={styles.bank_icon}
                        source={{
                            uri: pay_methods[bankSelect]?.bank_icon,
                        }}
                    />
                    <View>
                        <Text style={{color: '#101A30', fontSize: px(14), marginBottom: 8}}>
                            {pay_methods[bankSelect]?.bank_name}
                            {pay_methods[bankSelect]?.bank_no ? (
                                <Text>({pay_methods[bankSelect]?.bank_no})</Text>
                            ) : null}
                        </Text>
                        <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                            {pay_methods[bankSelect]?.limit_desc}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={changeBankCard}>
                    <Text style={{color: Colors.lightGrayColor}}>
                        切换
                        <Icon name={'right'} size={px(12)} />
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <View style={{height: 0.5, backgroundColor: Colors.bgColor}} />
            <Image source={require('~/assets/img/trade/setModel2.png')} style={{width: deviceWidth, height: px(42)}} />
            <ScrollView style={{flex: 1}}>
                <Text>index</Text>
                {render_bank()}
                <BottomDesc />
            </ScrollView>
            <BankCardModal
                data={data?.pay_methods || []}
                select={bankSelect}
                ref={bankCardRef}
                onDone={(select, index) => {
                    // this.setState(
                    //     (prev) => {
                    //         if (prev.bankSelect?.pay_method !== select?.pay_method) {
                    //             if (select?.pop_risk_disclosure) {
                    //                 setTimeout(() => {
                    //                     this.showRiskDisclosure(prev.data);
                    //                 }, 300);
                    //             }
                    //         }
                    //         return {bankSelect: select, bankSelectIndex: index};
                    //     },
                    //     () => {
                    //         if (!this.state.isLargeAmount) {
                    //             this.onInput(this.state.amount);
                    //         }
                    //     }
                    // );
                }}
            />
            <FixedButton
                style={{position: 'relative'}}
                // title={data?.btn?.text}
                // disabled={data?.btn?.avail != 1}
                // onPress={() => jump(data?.btn?.url)}
            />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    bankCard: {
        backgroundColor: '#fff',
        paddingVertical: px(12),
        paddingHorizontal: px(14),
    },
    bank_icon: {
        width: px(28),
        height: px(28),
        marginRight: px(9),
    },
});
