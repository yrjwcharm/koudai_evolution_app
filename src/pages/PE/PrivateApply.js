/*
 * @Author: xjh
 * @Date: 2021-02-20 16:34:30
 * @Description:
 * @LastEditors: dx
 * @LastEditTime: 2021-07-15 19:01:35
 */

import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text, isIphoneX} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import {FixedButton, Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Html from '../../components/RenderHtml';
import Clipboard from '@react-native-community/clipboard';
import Toast from '../../components/Toast';
const PrivateApply = (props) => {
    const {fund_code, poid, scene} = props.route.params || {};
    const jump = useJump();
    const [data, setData] = useState({});
    const [heightArr, setHeightArr] = useState([]);
    const scrollRef = useRef(null);

    const init = useCallback(() => {
        http.get(`/pe/${scene || 'redeem'}/20210101`, {
            fund_code: fund_code,
            poid: poid,
        }).then((res) => {
            setData(res.result);
        });
    }, [fund_code, poid, scene]);
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
    useEffect(() => {
        if (data.title) {
            props.navigation.setOptions({
                title: data.title,
            });
        }
    }, [data, props]);
    return (
        <View style={[styles.container, {paddingBottom: isIphoneX() ? text(85) : text(51)}]}>
            <ScrollView
                style={[styles.processContainer]}
                ref={scrollRef}
                onContentSizeChange={() => scrollRef.current.scrollToEnd({animated: true})}>
                {Object.keys(data).length > 0 &&
                    data.flow_list.map((item, index, arr) => {
                        return (
                            <View
                                key={index}
                                style={[styles.processItem, index === arr.length - 1 ? {marginBottom: text(32)} : {}]}
                                onLayout={(e) => onLayout(index, e)}>
                                <View style={[styles.icon]}>
                                    <MaterialCommunityIcons
                                        name={item.status === 1 ? 'check-circle' : 'checkbox-blank-circle'}
                                        size={20}
                                        color={
                                            item.status === 1
                                                ? Colors.green
                                                : item.status === 2
                                                ? Colors.green
                                                : '#CCD0DB'
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
                                    <View style={[Style.flexRow, styles.content]}>
                                        <View style={{flex: 1}}>
                                            <View style={[styles.processTitle, Style.flexBetween]}>
                                                <Text numberOfLines={1} style={[styles.desc]}>
                                                    {item.key}
                                                </Text>
                                                {item?.text_button && (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() => {
                                                            if (item.text_button.type === 'copy') {
                                                                Clipboard.setString(item.vals.join('\n'));
                                                                Toast.show('复制成功');
                                                            } else {
                                                                jump(item.text_button.url);
                                                            }
                                                        }}>
                                                        <Text style={{color: Colors.brandColor}}>
                                                            {item?.text_button?.text}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                            {item.vals && (
                                                <View style={[styles.moreInfo]}>
                                                    {item.vals?.map((val, i) => {
                                                        return (
                                                            <Html
                                                                key={val + i}
                                                                html={val}
                                                                style={styles.moreInfoText}
                                                            />
                                                        );
                                                    })}
                                                </View>
                                            )}
                                        </View>
                                        {item.button && (
                                            <Button
                                                color={'#D7AF74'}
                                                disabled={!item.button.avail}
                                                title={item.button.text}
                                                style={styles.buttonSty}
                                                textStyle={styles.buttonTextSty}
                                                onPress={() => jump(item.button.url)}
                                            />
                                        )}
                                    </View>
                                </View>
                                {index !== data.flow_list.length - 1 && (
                                    <View
                                        style={[
                                            styles.line,
                                            {
                                                height: heightArr[index] ? text(heightArr[index]) + 2 : text(52),
                                            },
                                        ]}
                                    />
                                )}
                            </View>
                        );
                    })}
            </ScrollView>
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
        // width: text(16),
        // height: text(16),
        marginTop: text(16),
        marginRight: text(8),
        position: 'relative',
        zIndex: 2,
    },
    contentBox: {
        paddingLeft: text(6),
        // width: text(310.5),
        flex: 1,
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
        top: text(32),
        left: Platform.select({ios: text(8), android: text(9)}),
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
    buttonSty: {
        height: text(26),
        paddingHorizontal: text(12),
        backgroundColor: '#D7AF74',
        borderRadius: text(13),
    },
    buttonTextSty: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: '#fff',
    },
});

export default PrivateApply;
