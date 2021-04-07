/*
 * @Author: xjh
 * @Date: 2021-02-20 16:34:30
 * @Description:
 * @LastEditors: dx
 * @LastEditTime: 2021-04-07 14:14:12
 */

import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import {FixedButton} from '../../components/Button';
import {useJump} from '../../components/hooks';

const PrivateApply = (props) => {
    const {fund_code, poid} = props.route.params || {};
    const jump = useJump();
    const [data, setData] = useState({});
    const [heightArr, setHeightArr] = useState([]);

    const init = useCallback(() => {
        http.get('/pe/redeem/20210101', {
            fund_code: fund_code,
            poid: poid,
        }).then((res) => {
            setData(res.result);
        });
    }, [fund_code, poid]);
    const onLayout = useCallback(
        (index, e) => {
            const arr = [...heightArr];
            arr[index] = e.nativeEvent.layout.height;
            setHeightArr(arr);
        },
        [heightArr]
    );
    const btnClick = () => {
        props.navigation.navigate('Home');
    };
    useEffect(() => {
        init();
    }, [init]);
    return (
        <View style={[styles.container]}>
            <View style={[styles.processContainer]}>
                {Object.keys(data).length > 0 &&
                    data.flow_list.map((item, index) => {
                        return (
                            <View key={index} style={[styles.processItem]} onLayout={(e) => onLayout(index, e)}>
                                <View style={[styles.icon, Style.flexCenter]}>
                                    <MaterialCommunityIcons
                                        name={item.status === 1 ? 'check-circle' : 'checkbox-blank-circle'}
                                        size={20}
                                        color={
                                            item.status === 1 ? Colors.green : item.status === 2 ? '#4BA471' : '#CCD0DB'
                                        }
                                    />
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
                                                {item.key}
                                            </Text>
                                            <TouchableOpacity onPress={() => jump(data.flow_list[1].button.url)}>
                                                <Text style={{color: '#0051CC'}}>{item?.button?.text}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.moreInfo]}>
                                            <Text style={[styles.moreInfoText]}>{item.vals}</Text>
                                        </View>
                                    </View>
                                </View>
                                {index !== data.flow_list.length - 1 && (
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
            <FixedButton
                title={'完成'}
                style={{...styles.btn_sty, backgroundColor: '#CEA26B'}}
                onPress={() => btnClick()}
                color={'#CEA26B'}
            />
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
        left: text(8),
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
