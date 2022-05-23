/*
 * @Date: 2022-05-11 15:34:32
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-21 15:24:56
 * @Description: 投资者信息表
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Picker from 'react-native-picker';
import {FormItem} from './IdentityAssertion';
import {Colors, Font, Space} from '../../common/commonStyle';
import {FixedButton} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Mask from '../../components/Mask';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';
import Toast from '../../components/Toast';
import {debounce} from 'lodash';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [showMask, setShowMask] = useState(false);
    const {button = {}, info: list = []} = data;
    const {avail, text} = button;

    const finished = useMemo(() => {
        const {info: _list = []} = data;
        return _list.every((item) => item.value !== '');
    }, [data]);

    const onSubmit = useCallback(
        debounce(
            () => {
                const params = {order_id: route.params.order_id || 1};
                const {info: _list = []} = data;
                _list.forEach((item) => (params[item.id] = item.value));
                http.post('/private_fund/submit_investor_info/20220510', params).then((res) => {
                    if (res.code === '000000') {
                        jump(res.result.url, 'replace');
                    }
                    Toast.show(res.message);
                });
            },
            1000,
            {leading: true, trailing: false}
        ),
        [data]
    );

    const onChange = (index, value) => {
        const _data = {...data};
        const _list = [...list];
        _list[index].value = value;
        _data.list = _list;
        setData(_data);
    };

    const hidePicker = () => {
        Picker.hide();
        setShowMask(false);
    };

    useEffect(() => {
        http.get('/private_fund/investor_info/20220510', {order_id: route.params.order_id || 1}).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '投资者信息表'});
                setData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            {showMask && <Mask onClick={hidePicker} />}
            <KeyboardAwareScrollView
                bounces={false}
                extraScrollHeight={px(100)}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                <View style={styles.contentBox}>
                    {list?.map?.((item, index) => (
                        <View
                            key={item + index}
                            style={[styles.itemBox, {borderTopWidth: index !== 0 ? Space.borderWidth : 0}]}>
                            <FormItem data={item} onChange={(val) => onChange(index, val)} setShowMask={setShowMask} />
                        </View>
                    ))}
                </View>
            </KeyboardAwareScrollView>
            {text ? (
                <FixedButton
                    color="#EDDBC5"
                    disabled={avail === 0 || !finished}
                    disabledColor="#EDDBC5"
                    onPress={onSubmit}
                    style={{backgroundColor: '#D7AF74'}}
                    title={text}
                />
            ) : null}
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    contentBox: {
        margin: Space.marginAlign,
        marginBottom: (isIphoneX() ? px(8) + px(45) + 34 : px(8) * 2 + px(45)) + px(20),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    itemBox: {
        height: px(56),
        borderColor: Colors.borderColor,
    },
    itemLabel: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    inputStyle: {
        fontSize: Font.textH2,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
});
