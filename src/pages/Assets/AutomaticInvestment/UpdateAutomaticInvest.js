/*
 * @Date: 2022/10/11 19:43
 * @Author: yanruifeng
 * @Description: 修改定投
 */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Text, TextInput, Image} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import BottomDesc from '../../../components/BottomDesc';
import {FixedButton} from '../../../components/Button';

const UpdateAutomaticInvest = ({navigation}) => {
    const [money] = useState('20,000');
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[Style.flexRow, {paddingLeft: px(16)}]}>
                    <Text style={styles.fundName}>中欧价值发现混合A</Text>
                    <Text style={styles.fundCode}>000888</Text>
                </View>
            </View>
            <View style={styles.investMode}>
                <View style={styles.investMoneyView}>
                    <View style={Style.flexBetween}>
                        <Text style={styles.label}>每月定投金额(元)</Text>
                        <View style={{width: px(160), alignItems: 'flex-end'}}>
                            <View style={Style.flexRow}>
                                <Image source={require('./assets/decrease.png')} />
                                <TextInput value={money + ''} style={styles.textInputStyle} placeholder="定投金额" />
                                <Image source={require('./assets/add.png')} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.interval}>
                    <View style={Style.flexBetween}>
                        <Text style={styles.label}>定投周期</Text>
                        <View style={Style.flexRow}>
                            <Text style={styles.date}>每月17日</Text>
                            <Image source={require('./assets/arrow.png')} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.choiceBankCard}>
                <View style={Style.flexBetween}>
                    <View style={Style.flexRow}>
                        <Image source={require('./assets/logo.png')} />
                        <View style={{marginLeft: px(8)}}>
                            <Text style={styles.cardType}>招商银行 (尾号8888)</Text>
                            <Text style={styles.maxTransfer}>单笔限额:10万，单日限额：100万</Text>
                        </View>
                    </View>
                    <View style={Style.flexRow}>
                        <Text style={styles.change}>切换</Text>
                        <Image source={require('./assets/arrow.png')} />
                    </View>
                </View>
            </View>
            <View style={{justifyContent: 'flex-end', flex: 1}}>
                <BottomDesc style={{marginBottom: px(90)}} />
            </View>
            <FixedButton title="确认修改" onPress={() => {}} />
        </View>
    );
};

UpdateAutomaticInvest.propTypes = {};

export default UpdateAutomaticInvest;
const styles = StyleSheet.create({
    change: {
        marginRight: px(6),
        fontSize: px(12),
        fontFamily: 'PingFang SC-常规体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.lightBlackColor,
    },
    cardType: {
        fontSize: px(13),
        fontFamily: 'PingFang SC-中黑体, PingFang SC',
        color: Colors.defaultColor,
    },
    maxTransfer: {
        marginTop: px(2),
        fontSize: px(11),
        fontFamily: 'PingFang SC-常规体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.lightGrayColor,
    },
    choiceBankCard: {
        backgroundColor: Colors.white,
        paddingHorizontal: px(16),
        height: px(63),
        justifyContent: 'center',
    },
    label: {
        fontSize: px(13),
        fontFamily: 'PingFang SC-常规体, PingFang SC',
        color: Colors.lightBlackColor,
    },
    textInputStyle: {
        marginHorizontal: px(30),
        textAlign: 'center',
        fontSize: px(20),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: Colors.defaultColor,
    },
    date: {
        marginRight: px(6),
        fontSize: px(14),
        fontWeight: 'normal',
        fontFamily: 'PingFang SC-中黑体, PingFang SC',
        color: Colors.defaultColor,
    },
    interval: {
        height: px(60),
        justifyContent: 'center',
    },
    investMoneyView: {
        height: px(59),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E2E4EA',
        borderStyle: 'solid',
    },
    investMode: {
        backgroundColor: Colors.white,
        paddingHorizontal: px(16),
    },
    fundName: {
        fontSize: px(14),
        fontFamily: 'PingFang SC-中黑体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.defaultColor,
    },
    fundCode: {
        fontSize: px(12),
        marginLeft: px(8),
        fontFamily: 'PingFang SC-中黑体, PingFang SC',
        fontWeight: 'normal',
        color: Colors.lightGrayColor,
    },
    header: {
        height: px(36),
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
});
