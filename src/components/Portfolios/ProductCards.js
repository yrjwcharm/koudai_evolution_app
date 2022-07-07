/*
 * @Date: 2022-06-13 14:42:28
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-07 14:52:04
 * @Description: v7产品卡片
 */
import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import quot from '~/assets/img/icon/quot.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Chart, chartOptions} from '~/components/Chart';
import {useJump} from '../hooks';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import {addProduct} from '~/redux/actions/pk/pkProducts';
import {px} from '~/utils/appUtil';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import {debounce} from 'lodash';

const onPressBtn = debounce(
    ({action, code, dispatch, plan_id}) => {
        if (action === 'do_pk') {
            dispatch(addProduct(code));
        } else if (action === 'attention' || action === 'cancel_attention') {
            (action === 'attention' ? followAdd : followCancel)({
                item_id: code || plan_id,
                item_type: code ? 1 : plan_id ? 2 : 3,
            }).then((res) => {
                if (res.code === '000000') {
                    res.message && Toast.show(res.message);
                    DeviceEventEmitter.emit('attentionRefresh');
                }
            });
        }
    },
    500,
    {leading: true, trailing: false}
);

/** @name 基金经理卡片 */
const ManagerCard = () => (
    <View>
        <View style={styles.rowStart}>
            <Image
                source={{
                    uri: 'https://static.licaimofang.com/wp-content/uploads/2022/05/im_happy_icon.png',
                }}
                style={styles.managerPic}
            />
            <View style={{flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.title}>{'张鸣 | 大满贯科技股猎手'}</Text>
                </View>
                <View style={[Style.flexRow, {marginTop: px(4)}]}>
                    <View style={styles.tagBox}>
                        <Text style={styles.tagText}>{'3次明星基金奖'}</Text>
                    </View>
                    <View style={styles.tagBox}>
                        <Text style={styles.tagText}>{'近3年回报超300%'}</Text>
                    </View>
                </View>
                <Text style={styles.managerDesc}>{`· 管理规模超100亿\n· 科技领域深耕经验，擅长挖局低估股`}</Text>
            </View>
        </View>
        <View style={[Style.flexBetween, styles.fundBox, {marginTop: px(8)}]}>
            <View>
                <Text style={styles.subTitle}>{'交银品质增长一年混合A'}</Text>
                <View style={[styles.rowEnd, {marginTop: px(4)}]}>
                    <Text style={[styles.profit, {marginRight: px(8)}]}>{'+18.67%'}</Text>
                    <Text style={styles.label}>{'近一年收益率'}</Text>
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.btnBox}>
                <Text style={styles.btnText}>{'PK'}</Text>
            </TouchableOpacity>
        </View>
        <View style={[Style.flexBetween, styles.fundBox]}>
            <View>
                <Text style={styles.subTitle}>{'交银品质增长一年混合A'}</Text>
                <View style={[styles.rowEnd, {marginTop: px(4)}]}>
                    <Text style={[styles.profit, {marginRight: px(8)}]}>{'+18.67%'}</Text>
                    <Text style={styles.label}>{'近一年收益率'}</Text>
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.btnBox}>
                <Text style={styles.btnText}>{'PK'}</Text>
            </TouchableOpacity>
        </View>
    </View>
);

/** @name 私募卡片 */
const PrivateCard = ({data: {data}}) => {
    const jump = useJump();
    return (
        <LinearGradient
            colors={['#FFF7EC', '#FFFFFF']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[Style.flexRow, styles.privateCardBox]}>
            <View style={{flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.title}>{data.name}</Text>
                </View>
                {data.tags && (
                    <View style={[Style.flexRow, {marginTop: px(4)}]}>
                        {data.tags.map((item, idx) => (
                            <View key={idx} style={[styles.tagBox, {borderColor: '#AD9064'}]}>
                                <Text style={[styles.tagText, {color: '#AD9064'}]}>{item}</Text>
                            </View>
                        ))}
                    </View>
                )}
                <View style={[Style.flexRow, {marginTop: px(12)}]}>
                    <View style={{flex: 1}}>
                        <HTML style={styles.profit} html={data.yield_info?.value} />
                        <Text style={[styles.label, {marginTop: px(2)}]}>{data.yield_info?.text}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <HTML style={[styles.profit, {fontSize: px(18)}]} html={data.nav_info?.value} />
                        <Text style={[styles.label, {marginTop: px(2)}]}>{data.nav_info?.text}</Text>
                    </View>
                </View>
                {data.tip ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[Style.flexRow, {marginTop: px(12)}]}
                        onPress={() => {
                            jump(data.url);
                        }}>
                        <Text style={styles.jumpText}>{data.tip}</Text>
                        <FontAwesome color={'#AD9064'} name={'angle-right'} size={16} />
                    </TouchableOpacity>
                ) : null}
            </View>
            <FontAwesome color={Colors.descColor} name={'angle-right'} size={16} />
        </LinearGradient>
    );
};

/** @name 榜单卡片 */
const RankCard = ({data = {}, isPking}) => {
    const dispatch = useDispatch();
    const {button, code, icon, labels, name, rank, tags = [], yield_info} = data;
    return (
        <View style={Style.flexRow}>
            {icon ? (
                <ImageBackground
                    source={{
                        uri: icon,
                    }}
                    style={[Style.flexCenter, styles.rankIcon]}>
                    {rank > 3 && <Text style={styles.rankText}>{rank}</Text>}
                </ImageBackground>
            ) : null}
            <View style={{flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.title}>{name}</Text>
                    {labels?.length > 0 ? (
                        <View style={{marginLeft: px(8)}}>
                            {labels.map((label, i) => (
                                <HTML html={i === 0 ? label : `| ${label}`} key={label + i} style={styles.desc} />
                            ))}
                        </View>
                    ) : null}
                </View>
                {tags?.length > 0 && (
                    <View style={[Style.flexRow, {marginTop: px(4)}]}>
                        {tags.map((tag, i) => (
                            <View key={tag + i} style={styles.tagBox}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
                <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                    <View style={tags?.length > 0 ? styles.rowEnd : {}}>
                        <HTML html={yield_info.value} style={styles.profit} />
                        <Text style={[styles.label, tags?.length > 0 ? {marginLeft: px(8)} : {marginTop: px(2)}]}>
                            {yield_info.text}
                        </Text>
                    </View>
                    {button?.text ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={button.avail === 0}
                            onPress={() => onPressBtn({action: button.action, code, dispatch})}
                            style={[
                                styles.btnBox,
                                button.avail === 0 ? {backgroundColor: '#ddd', borderColor: '#ddd'} : {},
                            ]}>
                            <Text style={[styles.btnText, button.avail === 0 ? {color: '#ddd'} : {}]}>
                                {isPking ? 'PK中' : button.text}
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </View>
    );
};

/** @name 推荐卡片 */
const RecommendCard = ({data = {}, isPking}) => {
    const dispatch = useDispatch();
    const {
        button,
        chart = [],
        code,
        label: leftLabel = [],
        labels,
        name,
        plan_id,
        reason,
        tags = [],
        yield_info,
    } = data;
    return (
        <View>
            <View style={Style.flexRow}>
                <View style={styles.leftPart}>
                    {chart?.length > 0 ? <Chart initScript={chartOptions.smChart(chart)} /> : null}
                    {leftLabel?.length > 0 && (
                        <>
                            {leftLabel[0] ? (
                                <View style={[Style.flexCenter, styles.leftLabel1]}>
                                    <Text style={styles.leftLabel1Text}>{leftLabel[0]}</Text>
                                </View>
                            ) : null}
                            {leftLabel[1] ? (
                                <View style={[Style.flexCenter, styles.leftLabel2]}>
                                    <Text style={styles.leftLabel2Text}>{leftLabel[0]}</Text>
                                </View>
                            ) : null}
                            {leftLabel[2] ? (
                                <View style={[Style.flexCenter, styles.leftLabel3]}>
                                    <Text style={styles.leftLabel3Text}>{leftLabel[0]}</Text>
                                </View>
                            ) : null}
                        </>
                    )}
                </View>
                <View style={{flex: 1}}>
                    <View style={Style.flexRow}>
                        <Text style={styles.title}>{name}</Text>
                        {labels?.length > 0 ? (
                            <View style={{marginLeft: px(8)}}>
                                {labels.map((label, i) => (
                                    <HTML html={i === 0 ? label : `| ${label}`} key={label + i} style={styles.desc} />
                                ))}
                            </View>
                        ) : null}
                    </View>
                    {tags?.length > 0 && (
                        <View style={[Style.flexRow, {marginTop: px(4)}]}>
                            {tags.map((tag, i) => (
                                <View key={tag + i} style={styles.tagBox}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                        <View style={tags?.length > 0 ? styles.rowEnd : {}}>
                            <HTML html={yield_info.value} style={styles.profit} />
                            <Text style={[styles.label, tags?.length > 0 ? {marginLeft: px(8)} : {marginTop: px(2)}]}>
                                {yield_info.text}
                            </Text>
                        </View>
                        {button?.text ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={button.avail === 0}
                                onPress={() => {
                                    data?.LogTool?.();
                                    onPressBtn({action: button.action, code, dispatch, plan_id});
                                }}
                                style={[
                                    styles.btnBox,
                                    button.avail === 0 ? {backgroundColor: '#ddd', borderColor: '#ddd'} : {},
                                ]}>
                                <Text style={[styles.btnText, button.avail === 0 ? {color: '#ddd'} : {}]}>
                                    {isPking ? 'PK中' : button.text}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
            {reason ? (
                <View style={styles.recommendBox}>
                    <Image source={quot} style={styles.quot} />
                    <HTML
                        html={`<span style="color: #FF7D41;font-weight: 500;">推荐</span>｜${reason}`}
                        style={styles.recommendText}
                    />
                </View>
            ) : null}
        </View>
    );
};

/** @name 默认卡片 */
const DefaultCard = ({data = {}, isPking}) => {
    const dispatch = useDispatch();
    const {button, code, labels, name, rank_info, tags = [], yield_info} = data;
    return (
        <View>
            <View style={Style.flexRow}>
                <Text style={styles.title}>{name}</Text>
                {labels?.length > 0 ? (
                    <View style={{marginLeft: px(8)}}>
                        {labels.map((label, i) => (
                            <HTML html={i === 0 ? label : `| ${label}`} key={label + i} style={styles.desc} />
                        ))}
                    </View>
                ) : null}
            </View>
            {tags?.length > 0 && (
                <View style={[Style.flexRow, {marginTop: px(4)}]}>
                    {tags.map((tag, i) => (
                        <View key={tag + i} style={styles.tagBox}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
            <View style={[Style.flexBetween, {marginTop: px(12), alignItems: 'flex-end'}]}>
                {yield_info ? (
                    <View style={rank_info ? {} : styles.rowEnd}>
                        <HTML html={yield_info.value} style={styles.profit} />
                        <Text style={[styles.label, rank_info ? {marginTop: px(2)} : {marginLeft: px(8)}]}>
                            {yield_info.text}
                        </Text>
                    </View>
                ) : null}
                {rank_info ? (
                    <View>
                        <HTML html={rank_info.value} style={{...styles.profit, color: Colors.defaultColor}} />
                        <Text style={[styles.label, {marginTop: px(2)}]}>{rank_info.text}</Text>
                    </View>
                ) : null}
                {button?.text ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={button.avail === 0}
                        onPress={() => onPressBtn({action: button.action, code, dispatch})}
                        style={[
                            styles.btnBox,
                            button.avail === 0 ? {backgroundColor: '#ddd', borderColor: '#ddd'} : {},
                        ]}>
                        <Text style={[styles.btnText, button.avail === 0 ? {color: '#ddd'} : {}]}>
                            {isPking ? 'PK中' : button.text}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

export default ({data = {}, style = {}}) => {
    const jump = useJump();
    const outerStyle = Object.prototype.toString.call(style) === '[object Array]' ? style : [style];
    const {code, type, url} = data;
    const [isPking, setIsPking] = useState(false);
    const pkProducts = useSelector((store) => store.pkProducts);

    useEffect(() => {
        if (pkProducts.includes(code)) {
            setIsPking(true);
        } else {
            setIsPking(false);
        }
    }, [code, pkProducts]);

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => jump(url)} style={[styles.cardContainer, ...outerStyle]}>
            {(() => {
                switch (type) {
                    // 基金经理卡片
                    case 'manager_card':
                        return <ManagerCard />;
                    // 私募卡片
                    case 'private_card':
                        return <PrivateCard data={data} />;
                    // 榜单卡片
                    case 'rank_card':
                        return <RankCard data={data} isPking={isPking} />;
                    // 推荐卡片
                    case 'recommend_card':
                        return <RecommendCard data={data} isPking={isPking} />;
                    // 默认卡片
                    default:
                        return <DefaultCard data={data} isPking={isPking} />;
                }
            })()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    privateCardBox: {
        margin: -Space.padding,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        overflow: 'hidden',
    },
    rankIcon: {
        marginRight: px(10),
        width: px(31),
        height: px(31),
    },
    rankText: {
        marginTop: px(2),
        fontSize: px(15),
        lineHeight: px(17),
        color: Colors.placeholderColor,
        fontFamily: Font.numFontFamily,
    },
    leftPart: {
        marginRight: px(10),
        width: px(74),
        height: px(74),
    },
    leftLabel1: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: px(49),
        height: px(49),
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
        borderRadius: px(49),
    },
    leftLabel1Text: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.red,
    },
    leftLabel2: {
        position: 'absolute',
        top: px(22),
        left: px(35),
        width: px(38),
        height: px(38),
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
        borderRadius: px(38),
    },
    leftLabel2Text: {
        fontSize: px(8),
        lineHeight: px(13),
        color: Colors.red,
    },
    leftLabel3: {
        position: 'absolute',
        top: px(39),
        left: px(11),
        width: px(34),
        height: px(34),
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
        borderRadius: px(34),
    },
    leftLabel3Text: {
        fontSize: px(7),
        lineHeight: px(12),
        color: Colors.red,
    },
    managerPic: {
        marginRight: px(12),
        borderRadius: Space.borderRadius,
        width: px(74),
        height: px(74),
    },
    managerDesc: {
        marginTop: px(8),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        marginLeft: px(8),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    tagBox: {
        marginRight: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(2),
        borderWidth: Space.borderWidth,
        borderColor: '#BDC2CC',
    },
    tagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: Colors.descColor,
    },
    rowStart: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    baseText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    profit: {
        fontSize: px(20),
        lineHeight: px(24),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
    },
    label: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    fundBox: {
        marginTop: px(12),
        paddingTop: px(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    btnBox: {
        paddingVertical: px(4),
        paddingHorizontal: Space.padding,
        borderRadius: px(100),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
    btnText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.brandColor,
    },
    recommendBox: {
        marginTop: px(12),
        paddingVertical: px(6),
        paddingHorizontal: px(8),
        borderRadius: px(4),
        backgroundColor: '#FFF5E5',
        position: 'relative',
    },
    quot: {
        width: px(19),
        height: px(15),
        position: 'absolute',
        top: 0,
        left: 0,
    },
    recommendText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    jumpText: {
        marginRight: px(6),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#AD9064',
    },
});
