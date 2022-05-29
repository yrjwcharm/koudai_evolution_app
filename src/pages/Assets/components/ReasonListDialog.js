import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Toast from '../../../components/Toast/Toast.js';
import Radio from '../../../components/Radio.js';
import http from '../../../services/index.js';
import {Modal} from '../../../components/Modal';
import {px} from '../../../utils/appUtil.js';

const ReasonListDialog = ({resolve, bottomModal, close}) => {
    const [curRadio, setCurRadio] = useState(null);
    const [data, setData] = useState(null);
    const [inputVal, setInputVal] = useState('');
    const [errMsg, setErrMsg] = useState('');
    useEffect(() => {
        const toast = Toast.showLoading();
        http.get('/adviser/unsign/reason/list/20220526')
            .then((res) => {
                Toast.hide(toast);
                resolve?.(false);
                if (res.code === '000000') {
                    setData(res.result);
                } else {
                    bottomModal.current.hide();
                }
            })
            .catch((_) => {
                Toast.hide(toast);
                resolve?.(false);
                bottomModal.current.hide();
            });
    }, []);

    useEffect(() => {
        if (data && data[0]) {
            Modal.show({
                clickClose: false,
                isTouchMaskToClose: false,
                confirmText: '确认退出',
                children: () => {
                    return (
                        <View style={{paddingVertical: px(18)}}>
                            <Text style={styles.title}>您暂时不签约的主要原因是</Text>
                            {data.map((item, idx) => (
                                <View key={idx} style={{marginTop: px(16)}}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            flexWrap: 'nowrap',
                                        }}>
                                        <Radio
                                            checked={curRadio === idx}
                                            onChange={() => {
                                                setCurRadio(idx);
                                                setErrMsg('');
                                            }}
                                        />
                                        <View
                                            style={{
                                                width: px(218),
                                                marginLeft: px(8),
                                            }}>
                                            <Text
                                                style={styles.text}
                                                onPress={() => {
                                                    setCurRadio(idx);
                                                    setErrMsg('');
                                                }}>
                                                {item.item}
                                            </Text>
                                            {curRadio === idx ? (
                                                item.can_input ? (
                                                    <TextInput
                                                        value={inputVal}
                                                        multiline
                                                        maxLength={item.input_limit}
                                                        underlineColorAndroid="transparent"
                                                        style={{
                                                            backgroundColor: '#E9EAEF',
                                                            padding: px(12),
                                                            paddingTop: px(12),
                                                            borderRadius: px(6),
                                                            marginTop: px(8),
                                                        }}
                                                        onChangeText={(val) => {
                                                            setInputVal(val);
                                                            setErrMsg('');
                                                        }}
                                                    />
                                                ) : (
                                                    <Text style={styles.tip}>{item.content}</Text>
                                                )
                                            ) : null}
                                        </View>
                                    </View>
                                </View>
                            ))}
                            {errMsg ? <Text style={{color: 'red', marginTop: px(20)}}>{errMsg}</Text> : null}
                        </View>
                    );
                },
                confirmCallBack: () => {
                    if (curRadio === null || curRadio === undefined) {
                        setErrMsg('请选择签约原因');
                    } else if (data[curRadio].can_input && !inputVal) {
                        setErrMsg('请输入签约原因');
                    } else {
                        let params = {
                            value: data[curRadio]?.value,
                        };
                        if (data[curRadio].can_input) {
                            params.detail = inputVal;
                        }
                        http.post('/adviser/unsign/reason/submit/20220526', params);
                        setErrMsg('');
                        Modal.close();
                        close?.();
                        resolve?.(false);
                        bottomModal.current.hide();
                    }
                },
            });
        }
    }, [data, curRadio, inputVal, close, errMsg, resolve, bottomModal]);

    return null;
};

export default ReasonListDialog;

const styles = StyleSheet.create({
    title: {
        marginTop: px(6),
        fontWeight: '500',
        color: '#121D3A',
        lineHeight: px(22),
        fontSize: px(16),
    },
    text: {
        lineHeight: px(21),
        fontSize: px(14),
        color: '#121D3A',
    },
    tip: {
        marginTop: px(8),
        fontSize: px(12),
        lineHeight: px(17),
        color: '#E74949',
    },
});
