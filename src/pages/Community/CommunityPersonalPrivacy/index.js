/*
 * @Date: 2022-10-21 15:56:46
 * @Description: 社区个人隐私管理
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Toast from '~/components/Toast';
import withPageLoading from '~/components/withPageLoading';
import {px} from '~/utils/appUtil';
import {getData, saveData} from './services';

const Index = ({navigation, route, setLoading}) => {
    const [data, setData] = useState({});
    const {items = []} = data;

    const init = () => {
        getData()
            .then((res) => {
                if (res.code === '000000') {
                    const {title = '隐私管理'} = res.result;
                    navigation.setOptions({title});
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onValueChange = (key, val) => {
        saveData({[key]: Number(val)}).then((res) => {
            Toast.show(res.message);
            if (res.code === '000000') {
                init();
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    return Object.keys(data).length > 0 ? (
        <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.container}>
            <View style={styles.wrapper}>
                {items.map?.((item, i) => {
                    const {key, label, status} = item;
                    return (
                        <View
                            key={key}
                            style={[
                                Style.flexBetween,
                                styles.item,
                                {borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth},
                            ]}>
                            <Text style={styles.label}>{label}</Text>
                            <Switch
                                ios_backgroundColor="#CCD0DB"
                                onValueChange={(val) => onValueChange(key, val)}
                                thumbColor={'#fff'}
                                trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                                value={!!status}
                            />
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingHorizontal: Space.padding,
    },
    wrapper: {
        marginTop: Space.marginVertical,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    item: {
        paddingVertical: Space.padding,
        borderColor: Colors.borderColor,
    },
    label: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
});

export default withPageLoading(Index);
