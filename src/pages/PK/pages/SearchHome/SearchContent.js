/*
 * @Date: 2022-06-13 12:19:36
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-14 11:51:47
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {px} from '../../../../utils/appUtil';
import {Colors, Font, Style} from '../../../../common/commonStyle';
import collectActive from '~/assets/img/pk/pkcollectActive.png';
import collect from '~/assets/img/pk/pkcollect.png';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import {useJump} from '~/components/hooks';
import {getColor} from './utils';
import {useDispatch, useSelector} from 'react-redux';
import {addProduct} from '~/redux/actions/pk/pkProducts';
import RenderHtml from '~/components/RenderHtml';
const SearchContent = ({data, type}) => {
    const [favor, setFavor] = useState(data.favor);
    const jump = useJump();
    const dispatch = useDispatch();
    const pkProducts = useSelector((store) => store.pkProducts[global.pkEntry]);
    const onFavor = () => {
        setFavor((_favor) => !_favor);
        if (favor) {
            followCancel({item_id: data.code, item_type: data.item_type || 1});
        } else {
            followAdd({item_id: data.code, item_type: data.item_type || 1});
        }
    };
    const onPk = () => {
        dispatch(addProduct(data.code));
    };
    return type != 'content' ? (
        <TouchableOpacity style={[styles.con, Style.flexBetween]} onPress={() => jump(data.url)} activeOpacity={0.9}>
            <View style={{maxWidth: '60%'}}>
                <View style={Style.flexRow}>
                    <RenderHtml html={data?.name} style={styles.title} numberOfLines={1} />
                    <Text style={styles.code}>{data?.code}</Text>
                </View>
                <Text style={[styles.rate, {color: getColor(parseFloat(data?.yield_info?.ratio))}]}>
                    {data?.yield_info?.ratio}
                </Text>
                <Text style={styles.rateDesc}>{data?.yield_info?.title}</Text>
            </View>
            <View style={Style.flexRow}>
                {data?.item_type === 1 ? (
                    <>
                        <TouchableOpacity onPress={onFavor} activeOpacity={0.8}>
                            <Image source={favor ? collectActive : collect} style={{width: px(26), height: px(26)}} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.pkBtn, Style.flexCenter]} onPress={onPk} activeOpacity={0.8}>
                            <Text style={{color: '#fff'}}>{pkProducts.includes(data.code) ? 'PK中' : 'PK'}</Text>
                        </TouchableOpacity>
                    </>
                ) : null}
            </View>
        </TouchableOpacity>
    ) : (
        // 内容
        <TouchableOpacity style={styles.con} onPress={() => jump(data.url)} activeOpacity={0.9}>
            <RenderHtml html={data?.title} style={styles.title} />
            <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                <View style={Style.flexRow}>
                    {data?.tag_list?.map((text, index) => {
                        return (
                            <View key={index} style={styles.tagBox}>
                                <Text style={{fontSize: px(12), color: Colors.btnColor}}>{text}</Text>
                            </View>
                        );
                    })}
                </View>
                <Text style={styles.rateDesc}>{data?.published_at}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default SearchContent;

const styles = StyleSheet.create({
    con: {
        paddingVertical: px(11),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.4,
    },
    title: {fontSize: px(14), lineHeight: px(20), marginRight: px(6)},
    code: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.darkGrayColor,
        marginLeft: px(6),
    },
    rate: {
        marginTop: px(8),
        fontWeight: '700',
        fontFamily: Font.numMedium,
        fontSize: px(20),
        lineHeight: px(24),
    },
    rateDesc: {
        marginTop: px(2),
        fontSize: px(11),
        lineHeight: px(16),
        color: Colors.darkGrayColor,
    },
    pkBtn: {
        backgroundColor: '#0051CC',
        borderRadius: px(103),
        width: px(50),
        height: px(26),
        marginLeft: px(12),
    },
    tagBox: {
        marginRight: px(2),
        paddingVertical: px(4),
        paddingHorizontal: px(10),
        borderRadius: px(2),
        backgroundColor: '#F1F6FF',
    },
});
