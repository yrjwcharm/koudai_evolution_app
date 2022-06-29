/*
 * @Date: 2022-06-13 14:42:28
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-06-29 17:38:24
 * @Description: v7产品卡片
 */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import quot from '~/assets/img/icon/quot.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import HTML from '~/components/RenderHtml';
import {px} from '~/utils/appUtil';

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
const PrivateCard = () => (
    <LinearGradient
        colors={['#FFF7EC', '#FFFFFF']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={[Style.flexRow, styles.privateCardBox]}>
        <View style={{flex: 1}}>
            <View style={Style.flexRow}>
                <Text style={styles.title}>{'嘉实中证基建ETF发起式联接A'}</Text>
            </View>
            <View style={[Style.flexRow, {marginTop: px(4)}]}>
                <View style={[styles.tagBox, {borderColor: '#AD9064'}]}>
                    <Text style={[styles.tagText, {color: '#AD9064'}]}>{'基础建设'}</Text>
                </View>
                <View style={[styles.tagBox, {borderColor: '#AD9064'}]}>
                    <Text style={[styles.tagText, {color: '#AD9064'}]}>{'大盘股'}</Text>
                </View>
            </View>
            <View style={[Style.flexRow, {marginTop: px(12)}]}>
                <View style={{flex: 1}}>
                    <Text style={styles.profit}>{'+50.18%'}</Text>
                    <Text style={[styles.label, {marginTop: px(2)}]}>{'近一年收益率'}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={[styles.profit, {fontSize: px(18), color: Colors.defaultColor}]}>{'1.266'}</Text>
                    <Text style={[styles.label, {marginTop: px(2)}]}>{'累计净值'}</Text>
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={[Style.flexRow, {marginTop: px(12)}]}>
                <Text style={styles.jumpText}>{'查看私募产品前，请先完成投资者认证'}</Text>
                <FontAwesome color={'#AD9064'} name={'angle-right'} size={16} />
            </TouchableOpacity>
        </View>
        <FontAwesome color={Colors.descColor} name={'angle-right'} size={16} />
    </LinearGradient>
);

/** @name 榜单卡片 */
const RankCard = ({data = {}}) => {
    const {button, icon, name, tags = [], yield_info} = data;
    return (
        <View style={Style.flexRow}>
            <Image
                source={{
                    uri: icon,
                }}
                style={styles.rankIcon}
            />
            <View style={{flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.title}>{name}</Text>
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
                        <TouchableOpacity activeOpacity={0.8} style={styles.btnBox}>
                            <Text style={styles.btnText}>{button.text}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </View>
    );
};

/** @name 推荐卡片 */
const RecommendCard = () => (
    <View>
        <View style={Style.flexRow}>
            <View style={styles.leftPart}>
                <></>
            </View>
            <View style={{flex: 1}}>
                <View style={Style.flexRow}>
                    <Text style={styles.title}>{'短期｜稳健组合'}</Text>
                    <Text style={styles.desc}>{'让你有钱可用'}</Text>
                </View>
                <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                    <View>
                        <Text style={styles.profit}>{'+50.18%'}</Text>
                        <Text style={[styles.label, {marginTop: px(2)}]}>{'近一年收益率'}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={styles.btnBox}>
                        <Text style={styles.btnText}>{'关注'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <View style={styles.recommendBox}>
            <Image source={quot} style={styles.quot} />
            <HTML
                html={`<span style="color: #FF7D41;font-weight: 500;">推荐</span>｜打包全市场明星经历代表作，长期绩优`}
                style={styles.recommendText}
            />
        </View>
    </View>
);

/** @name 默认卡片 */
const DefaultCard = ({data = {}}) => {
    const {button, name, rank_info = {}, tags = [], yield_info} = data;
    return (
        <View>
            <View style={Style.flexRow}>
                <Text style={styles.title}>{name}</Text>
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
                <View>
                    <HTML html={yield_info.value} style={styles.profit} />
                    <Text style={[styles.label, {marginTop: px(2)}]}>{yield_info.text}</Text>
                </View>
                <View>
                    <HTML html={rank_info.value} style={{...styles.profit, color: Colors.defaultColor}} />
                    <Text style={[styles.label, {marginTop: px(2)}]}>{rank_info.text}</Text>
                </View>
                {button?.text ? (
                    <TouchableOpacity activeOpacity={0.8} style={styles.btnBox}>
                        <Text style={styles.btnText}>{button.text}</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

export default ({data = {}, style = {}}) => {
    const outerStyle = Object.prototype.toString.call(style) === '[object Array]' ? style : [style];
    const {type} = data;
    return (
        <TouchableOpacity activeOpacity={0.8} style={[styles.cardContainer, ...outerStyle]}>
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
                        return <RankCard data={data} />;
                    // 推荐卡片
                    case 'recommend_card':
                        return <RecommendCard data={data} />;
                    // 默认卡片
                    default:
                        return <DefaultCard data={data} />;
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
    leftPart: {
        marginRight: px(10),
        width: px(74),
        height: '100%',
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
