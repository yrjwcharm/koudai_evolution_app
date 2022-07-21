import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px} from '~/utils/appUtil';
import http from '~/services';
import {useJump} from '~/components/hooks';

const SubscribeManage = () => {
    const jump = useJump();
    const [data, setData] = useState(null);
    const [status, setStatus] = useState([]);

    const getData = () => {
        http.get('/project/get/subscribe/conf/202207').then((res) => {
            if (res.code === '000000') {
                setData(res.result);
                setStatus(
                    res.result?.list?.reduce((memo, item) => {
                        memo[item.item_id] = item.status === 'ON';
                        return memo;
                    }, {})
                );
            }
        });
    };
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        let arr = Object.values(status).slice(1);
        if (arr.length) {
            let num = arr.reduce((memo, cur) => (cur ? ++memo : memo), 0);
            let id = data.list[0].item_id;
            let state = num === arr.length;
            if (state !== status[id]) setStatus((val) => ({...val, [id]: state}));
        }
    }, [status, data]);

    const handlerCellSwitch = (state, id, idx) => {
        if (idx === 0) id = data.list.map((item) => item.item_id)?.join();
        http.post('/project/set/subscribe/conf/202207', {status: state ? 'ON' : 'OFF', item_id: id}).then((res) => {
            if (res.code === '000000') {
                if (idx === 0) {
                    setStatus((val) => {
                        let newVal = {...val};
                        for (let key in newVal) {
                            newVal[key] = state;
                        }
                        return newVal;
                    });
                } else {
                    setStatus((val) => ({...val, [id]: state}));
                }
            }
        });
    };

    return data ? (
        <View style={styles.container}>
            <View style={styles.topHintWrap}>
                <Text style={styles.topHintText}>{data.header.line1}</Text>
            </View>
            <View style={styles.copyCell}>
                <FastImage source={{uri: data.header.line2.icon}} style={styles.wxImg} />
                <Text style={styles.copyText}>{data.header.line2.text}</Text>
                {data.header.line2?.button ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.copyBtn}
                        onPress={() => {
                            jump(data.header.line2?.button?.url);
                        }}>
                        <Text style={styles.copyBtnText}>{data.header.line2?.button.text}</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={{marginTop: px(12)}} />
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <View>
                    {data.list.map((item, idx) => (
                        <View key={idx} style={[styles.switchCell, idx > 0 ? styles.borderTop : {}]}>
                            <View style={styles.switchCellLeft}>
                                <Text style={styles.switchCellTitle}>{item.index_name}</Text>
                                <Text style={styles.switchCellDesc}>{item.desc}</Text>
                            </View>
                            <View>
                                <Switch
                                    ios_backgroundColor={'#CCD0DB'}
                                    thumbColor={'#fff'}
                                    trackColor={{false: '#CCD0DB', true: '#0051CC'}}
                                    value={status[item.item_id]}
                                    onValueChange={(state) => handlerCellSwitch(state, item.item_id, idx)}
                                />
                            </View>
                        </View>
                    ))}
                </View>
                <View style={{height: px(50)}} />
            </ScrollView>
        </View>
    ) : null;
};

export default SubscribeManage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topHintWrap: {
        paddingVertical: px(12),
        paddingHorizontal: px(16),
    },
    topHintText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
    },
    copyCell: {
        backgroundColor: '#fff',
        padding: px(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    wxImg: {
        width: px(32),
        height: px(32),
    },
    copyText: {
        marginLeft: px(8),
        fontSize: px(14),
        lineHeight: px(20),
        color: '#3d3d3d',
    },
    copyBtn: {
        marginLeft: px(10),
        backgroundColor: '#0051CC',
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(6),
    },
    copyBtnText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#fff',
    },
    switchCell: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        paddingVertical: px(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    switchCellLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchCellTitle: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121d3a',
    },
    switchCellDesc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9aa0b1',
        marginLeft: px(5),
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#E9EAEF',
    },
});
