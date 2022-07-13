/*
 * @Date: 2022-06-24 10:37:18
 * @Description:导入持仓
 */
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import EvilIcons from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {FixedButton} from '~/components/Button';
import {postImport} from './services';
import Toast from '~/components/Toast';
const Index = ({navigation, route}) => {
    let data = useSelector((store) => store.ocrFund).toJS()?.ocrOwernList || [];
    const handleImport = async () => {
        let res = await postImport({items: JSON.stringify(data), item_type: route?.params?.item_type || 3});
        Toast.show(res.message);
        if (res.code === '000000') {
            navigation.pop(2);
        }
    };
    return (
        <>
            <ScrollView style={styles.con}>
                {data?.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => {
                            navigation.navigate('EditOwnerFund', {key: index});
                        }}>
                        <View style={[Style.flexRow, {marginBottom: px(8)}]}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.code}>{item.code}</Text>
                        </View>
                        <View style={Style.flexRow}>
                            <View style={{flex: 1}}>
                                <Text style={styles.label_title}>持有金额</Text>
                                <Text style={styles.label_desc}>{item.amount}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={styles.label_title}>持有收益</Text>
                                <Text style={{...styles.label_desc, color: item.yield > 0 ? Colors.red : Colors.green}}>
                                    {item.yield > 0 ? '+' : ''}
                                    {item.yield}
                                </Text>
                            </View>
                        </View>
                        <View style={[Style.flexRowCenter, {marginTop: px(6)}]}>
                            <Text style={{color: Colors.btnColor, fontSize: px(12), marginRight: px(2)}}>编辑</Text>
                            <EvilIcons name={'right'} size={px(8)} color={Colors.btnColor} />
                        </View>
                    </TouchableOpacity>
                ))}
                <View style={{height: px(20)}} />
            </ScrollView>
            <FixedButton title="立即导入" onPress={handleImport} style={{position: 'relative'}} />
        </>
    );
};

export default Index;

const styles = StyleSheet.create({
    con: {
        backgroundColor: Colors.bgColor,
        padding: px(16),
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingHorizontal: px(16),
        paddingVertical: px(12),
        marginBottom: px(12),
    },
    title: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        marginRight: px(4),
    },
    code: {
        fontSize: px(11),
        color: Colors.lightGrayColor,
    },
    label_title: {
        color: '#858DA3',
        fontSize: px(12),
        lineHeight: px(17),
        marginBottom: px(2),
    },
    label_desc: {
        lineHeight: px(20),
        fontSize: px(14),
        fontFamily: Font.numFontFamily,
    },
});
