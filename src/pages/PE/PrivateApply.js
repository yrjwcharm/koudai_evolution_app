/*
 * @Author: xjh
 * @Date: 2021-02-20 16:34:30
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-20 17:11:27
 */

import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {VerifyCodeModal, Modal} from '../../components/Modal/';
import http from '../../services';
import {Button} from '../../components/Button';
import {FixedButton} from '../../components/Button';

const PrivateApply = (props) => {
    const {txn_id} = props.route.params || {};
    const navigation = useNavigation();
    const [data, setData] = useState({});
    const [finish, setFinish] = useState(false);
    const [heightArr, setHeightArr] = useState([]);
    const [bankInfo, setBankInfo] = useState('');
    const [code, setCode] = useState('');
    const [isSign, setSign] = useState(false);

    const loopRef = useRef(0);
    const timerRef = useRef(null);
    const init = useCallback(
        (first) => {
            http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/doc/trade/order/processing/20210101', {
                txn_id: '20210101B000001S',
                loop: loopRef.current,
            }).then((res) => {
                setData(res.result);
            });
        },
        [loopRef, timerRef, navigation]
    );
    const onLayout = useCallback(
        (index, e) => {
            const arr = [...heightArr];
            arr[index] = e.nativeEvent.layout.height;
            setHeightArr(arr);
        },
        [heightArr]
    );
    useEffect(() => {
        init(true);
        return () => clearTimeout(timerRef.current);
    }, [init, timerRef]);
    return (
        <View style={[styles.container]}>
            <View style={[styles.processContainer]}>
                {Object.keys(data).length > 0 &&
                    data.items.map((item, index) => {
                        return (
                            <View key={index} style={[styles.processItem]} onLayout={(e) => onLayout(index, e)}>
                                <View style={[styles.icon, Style.flexCenter]}>
                                    {(item.done === 1 || item.done === -1) && (
                                        <Ionicons
                                            name={item.done === 1 ? 'checkmark-circle' : 'close-circle'}
                                            size={17}
                                            color={item.done === 1 ? Colors.green : Colors.red}
                                        />
                                    )}
                                    {item.done === 0 && (
                                        <FontAwesome
                                            name={'circle-thin'}
                                            size={16}
                                            color={'#CCD0DB'}
                                            style={{
                                                marginRight: text(2),
                                                backgroundColor: Colors.bgColor,
                                            }}
                                        />
                                    )}
                                </View>
                                <View style={[styles.contentBox]}>
                                    <FontAwesome
                                        name={'caret-left'}
                                        color={'#fff'}
                                        size={30}
                                        style={styles.caret_sty}
                                    />
                                    <View style={[styles.content]}>
                                        <View style={[styles.processTitle, Style.flexBetween]}>
                                            <Text numberOfLines={1} style={[styles.desc]}>
                                                {item.k}
                                            </Text>
                                        </View>
                                        {item.d && item.d.length > 0 && (
                                            <View style={[styles.moreInfo]}>
                                                {item.d.map((val, i) => {
                                                    return (
                                                        <Text key={val} style={[styles.moreInfoText]}>
                                                            {val}
                                                        </Text>
                                                    );
                                                })}
                                            </View>
                                        )}
                                    </View>
                                </View>
                                {index !== data.items.length - 1 && (
                                    <View
                                        style={[
                                            styles.line,
                                            {
                                                height: heightArr[index] ? text(heightArr[index] - 4) : text(52),
                                            },
                                        ]}
                                    />
                                )}
                            </View>
                        );
                    })}
            </View>
            <FixedButton title={'完成'} style={styles.btn_sty} onPress={() => btnClick()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
        paddingVertical: Space.marginVertical,
        paddingLeft: text(8),
    },
    processContainer: {
        paddingLeft: text(8),
        flex: 1,
        padding: Space.marginAlign,
    },
    processItem: {
        flexDirection: 'row',
        position: 'relative',
        marginBottom: text(12),
    },
    icon: {
        width: text(16),
        height: text(16),
        marginTop: text(16),
        marginRight: text(8),
        position: 'relative',
        zIndex: 2,
    },
    contentBox: {
        paddingLeft: text(6),
        width: text(310.5),
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
        paddingVertical: text(14),
        paddingHorizontal: Space.marginAlign,
    },
    processTitle: {
        flexDirection: 'row',
    },
    desc: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        maxWidth: text(160),
    },
    date: {
        fontSize: Font.textSm,
        lineHeight: text(13),
        color: Colors.darkGrayColor,
        fontFamily: Font.numRegular,
    },
    moreInfo: {
        marginTop: text(6),
    },
    moreInfoText: {
        fontSize: Font.textH3,
        lineHeight: text(22),
        color: Colors.descColor,
    },
    line: {
        position: 'absolute',
        top: text(28),
        left: text(6.7),
        width: text(1),
        backgroundColor: '#CCD0DB',
        zIndex: 1,
    },
    btn: {
        marginHorizontal: text(80),
        marginVertical: text(32),
        borderRadius: text(6),
        height: text(44),
        backgroundColor: Colors.brandColor,
    },
    btnText: {
        fontSize: text(15),
        lineHeight: text(21),
        color: '#fff',
    },
    caret_sty: {
        position: 'absolute',
        top: text(10),
        left: text(-2),
        zIndex: 1,
    },
});

export default PrivateApply;
