/*
 * @Date: 2022-07-12 14:25:26
 * @Description:持仓卡片
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Image from 'react-native-fast-image';
import {px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {BottomModal} from '~/components/Modal';
import {postAssetClass} from './service';
import {fromJS} from 'immutable';
import {RenderAlert} from '../components/RenderAlert';
const HoldCard = ({data, reload, showEye}) => {
    const {class_list, pop_info} = data;
    return (
        <>
            <View>
                <ListTitle title="全部资产" pop_info={pop_info} reload={reload} />
                {class_list?.map((account, key) => {
                    return <CardItem data={account} showEye={showEye} key={key} />;
                })}
            </View>
        </>
    );
};
const ListTitle = ({title, pop_info, reload}) => {
    const bottomModal = useRef();
    const [list, setList] = useState(fromJS([]));
    useEffect(() => {
        setList(fromJS(pop_info?.list || []));
    }, [pop_info]);
    const modal = () => {
        bottomModal.current.show();
    };
    const onChange = (index) => {
        let tmp = list.setIn([index, 'select'], list.getIn([index, 'select']) == 0 ? 1 : 0);
        setList(tmp);
    };
    const onClose = () => {
        let params = list
            .toJS()
            ?.filter((item) => item.select == 1)
            .map((_i) => _i.type)
            .join(',');
        postAssetClass({type_list: params}).then((res) => {
            if (res.code === '000000') reload();
        });
    };
    return (
        <TouchableOpacity
            onPress={modal}
            style={[Style.flexRow, {marginBottom: px(10), position: 'relative', zIndex: -10}]}
            activeOpacity={0.8}>
            <View style={styles.title_tag} />
            <Text style={styles.bold_text}>
                {title} {''}
            </Text>
            <AntDesign name="caretdown" />
            <BottomModal ref={bottomModal} title={pop_info?.title} style={{height: px(460)}} onClose={onClose}>
                <>
                    {list.toJS().map(({name, icon, number, desc, select, type}, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            style={[Style.flexBetween, styles.popCard]}
                            onPress={() => onChange(index)}>
                            <View>
                                <View style={[Style.flexRow, {marginBottom: px(4)}]}>
                                    {!!icon && (
                                        <Image
                                            source={{uri: icon}}
                                            style={{width: px(18), height: px(18), marginRight: px(3)}}
                                        />
                                    )}
                                    <Text style={{fontSize: px(14), fontWeight: '700'}}>
                                        {name}({number})
                                    </Text>
                                </View>
                                <Text style={{fontSize: px(12), color: Colors.lightBlackColor, marginLeft: px(21)}}>
                                    {desc}
                                </Text>
                            </View>
                            {select == 1 && <Entypo name="check" color="#0051CC" size={px(14)} />}
                        </TouchableOpacity>
                    ))}
                </>
            </BottomModal>
        </TouchableOpacity>
    );
};
const CardItem = ({data = {}, showEye}) => {
    const jump = useJump();
    const {name, number, remind_info, symbol, indicators, icon, url} = data;
    return (
        <>
            <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => jump(url)}>
                {name && (
                    <View style={[Style.flexRow, {marginBottom: px(10)}]}>
                        {!!icon && (
                            <Image source={{uri: icon}} style={{width: px(16), height: px(16), marginRight: px(3)}} />
                        )}
                        <Text style={{fontSize: px(12), fontWeight: '700'}}>
                            {name}
                            {number}
                        </Text>
                        {!!symbol && (
                            <View>
                                <Text>{symbol}</Text>
                            </View>
                        )}
                    </View>
                )}
                <View style={[Style.flexRow]}>
                    {indicators?.map(({text, value, symbol, color}, index) => (
                        <View
                            key={index}
                            style={{
                                flex: index == 0 ? 2 : 1,
                            }}>
                            <Text style={[styles.label_text]}>{text}</Text>
                            <Text
                                style={[
                                    styles.amount_text,
                                    showEye == 'true' && color && {color: color},
                                    {fontSize: index == 0 ? px(14) : px(12)},
                                ]}>
                                {showEye == 'true' ? value : '****'}
                            </Text>
                        </View>
                    ))}
                </View>
                {!!remind_info && <RenderAlert alert={remind_info} />}
            </TouchableOpacity>
        </>
    );
};

export default HoldCard;

const styles = StyleSheet.create({
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightBlackColor,
    },
    bold_text: {fontSize: px(14), lineHeight: px(20), fontWeight: '700'},
    title_tag: {
        width: px(3),
        height: px(12),
        backgroundColor: Colors.defaultColor,
        marginRight: px(13),
    },

    card: {
        padding: px(16),
        backgroundColor: '#fff',
        borderRadius: px(6),
        marginBottom: px(12),
        marginHorizontal: px(16),
    },

    label_text: {
        fontSize: px(11),
        lineHeight: px(15),
        marginBottom: px(3),
        color: Colors.lightBlackColor,
    },
    amount_text: {
        fontSize: px(15),
        lineHeight: px(21),
        fontFamily: Font.numFontFamily,
    },

    popCard: {
        marginHorizontal: px(20),
        height: px(62),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
    },
});
