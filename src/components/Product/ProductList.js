/*
 * @Date: 2022-09-13 13:05:21
 * @Description: v7产品列表
 */
import React from 'react';
import {ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Swiper from 'react-native-swiper';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Chart, chartOptions} from '~/components/Chart';
import {useJump} from '~/components/hooks';
import HTML from '~/components/RenderHtml';
import Tabbar from '~/components/TabBar';
import {px} from '~/utils/appUtil';

const Index = ({data = [], type = 'default'}) => {
    const jump = useJump();

    /** @name 卡片左边部分 */
    const renderLeftPart = ({chart, image, rank_icon, rank_num, ratio_labels, yesterday_profit}) => {
        switch (true) {
            case chart?.length > 0:
                return (
                    <View style={styles.leftPart}>
                        <Chart
                            data={chart}
                            initScript={chartOptions.smChart(chart)}
                            updateScript={chartOptions.smChart}
                        />
                    </View>
                );
            case !!image:
                return (
                    <Image
                        source={{uri: image}}
                        style={[styles.leftPart, {marginRight: px(8), borderRadius: Space.borderRadius}]}
                    />
                );
            case !!rank_icon:
                return (
                    <ImageBackground source={{uri: rank_icon}} style={[Style.flexCenter, styles.rankIcon]}>
                        {rank_num ? <Text style={styles.rankText}>{rank_num}</Text> : null}
                    </ImageBackground>
                );
            case ratio_labels?.length > 0:
                return (
                    <View style={styles.leftPart}>
                        {ratio_labels.map((label, i) => {
                            return (
                                <View key={label + i} style={[Style.flexCenter, styles[`ratioLabel${i + 1}`]]}>
                                    <Text style={styles[`ratioLabelText${i + 1}`]}>{label}</Text>
                                </View>
                            );
                        })}
                    </View>
                );
            case !!yesterday_profit:
                const {bg_color, font_color, profit, profit_desc} = yesterday_profit;
                return (
                    <View style={[styles.profitBox, {backgroundColor: bg_color}]}>
                        <Text style={[styles.profit, {color: font_color}]}>{profit}</Text>
                        <Text style={[styles.profitLabel, {color: font_color}]}>{profit_desc}</Text>
                    </View>
                );
            default:
                return null;
        }
    };
    /** @name 默认卡片 */
    const renderDefaultItem = (item, index) => {
        const {
            flex_between = false, // 是否两端对齐
            desc,
            id,
            labels,
            name,
            out_box = false, // 外部是否有边框和阴影
            profit,
            profit_desc,
            reason,
            reason_icon,
            red_tag,
            tags,
            url,
        } = item;
        const containerSty = out_box
            ? {
                  marginTop: index === 0 ? 0 : px(8),
                  ...styles.outBox,
              }
            : {};
        return (
            <View key={name + id + index} style={containerSty}>
                {out_box ? (
                    <LinearGradient
                        colors={['#F1F6FF', '#fff']}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 0.68}}
                        style={styles.linearBox}
                    />
                ) : index !== 0 ? (
                    <View style={styles.divider} />
                ) : null}
                <TouchableOpacity activeOpacity={0.8} onPress={() => jump(url)} style={Style.flexRow}>
                    {renderLeftPart(item)}
                    <View style={flex_between ? [Style.flexBetween, {flex: 1}] : {flex: 1}}>
                        <View>
                            <View style={Style.flexRow}>
                                <Text style={styles.name}>{name}</Text>
                                {red_tag ? (
                                    <View style={styles.redTagBox}>
                                        <Text
                                            style={[
                                                styles.ratioLableText1,
                                                {color: '#fff', fontWeight: Font.weightMedium},
                                            ]}>
                                            {red_tag}
                                        </Text>
                                    </View>
                                ) : null}
                                {labels?.length > 0 ? (
                                    <View style={[Style.flexRow, {marginLeft: px(8), flexShrink: 1}]}>
                                        {labels.map((label, i) => (
                                            <HTML
                                                html={i === 0 ? label : `| ${label}`}
                                                key={label + i}
                                                numberOfLines={1}
                                                style={styles.label}
                                            />
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
                        </View>
                        {desc ? <Text style={styles.managerDesc}>{desc}</Text> : null}
                        {profit ? (
                            <View
                                style={
                                    flex_between
                                        ? {alignItems: 'flex-end'}
                                        : [Style.flexRow, {marginTop: desc ? px(4) : px(12)}]
                                }>
                                <HTML html={profit} style={styles.bigProfit} />
                                <Text
                                    style={
                                        flex_between
                                            ? [styles.profitLabel, {marginTop: px(4)}]
                                            : [styles.profitLabel, {marginLeft: px(8)}]
                                    }>
                                    {profit_desc}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </TouchableOpacity>
                {reason ? (
                    <View style={styles.reasonBox}>
                        {reason_icon ? <Image source={{uri: reason_icon}} style={styles.reasonIcon} /> : null}
                        <HTML html={reason} style={{...styles.label, color: Colors.descColor}} />
                    </View>
                ) : null}
            </View>
        );
    };
    /** @name 横向卡片 */
    const renderHorizontalItem = (item, index) => {
        const {chart, name, ratio_labels, profit, profit_desc, url} = item;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={name + index}
                onPress={() => jump(url)}
                style={[Style.flexCenter, {flex: 1}]}>
                <Text style={styles.name}>{name}</Text>
                {profit ? (
                    <View style={[Style.flexCenter, {marginTop: px(8)}]}>
                        <HTML html={profit} style={styles.smProfit} />
                        <Text style={[styles.profitLabel, {marginTop: px(4)}]}>{profit_desc}</Text>
                    </View>
                ) : null}
                {chart?.length > 0 ? (
                    <View style={{marginTop: px(12), width: '100%', height: px(36)}}>
                        <Chart
                            data={chart}
                            initScript={chartOptions.smChart(chart)}
                            updateScript={chartOptions.smChart}
                        />
                    </View>
                ) : null}
                {ratio_labels?.length > 0 && (
                    <View style={styles.ratioLabelBox}>
                        {ratio_labels.map((label, i) => {
                            return (
                                <View key={label + i} style={[Style.flexCenter, styles[`ratioLabel${i + 1}`]]}>
                                    <Text style={styles[`ratioLabelText${i + 1}`]}>{label}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </TouchableOpacity>
        );
    };
    /** @name 轮播卡片 */
    const renderSwiperItem = (item, index) => {
        const {bg_img, button, desc, name, tags, url} = item;
        return (
            <LinearGradient
                colors={['#FFFCF7', '#FFF2E0']}
                key={name + index}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.swiperItem}>
                {bg_img ? (
                    <TouchableOpacity activeOpacity={url ? 0.8 : 1} onPress={() => jump(url)} style={styles.bgImage}>
                        <Image source={{uri: bg_img}} style={{width: '100%', height: '100%'}} />
                    </TouchableOpacity>
                ) : null}
                {desc ? <HTML html={desc} style={styles.cardDesc} /> : null}
                {name ? <Text style={[styles.name, {marginTop: px(8), fontWeight: '400'}]}>{name}</Text> : null}
                {tags?.length > 0 && (
                    <View style={[Style.flexRowCenter, {marginTop: px(8)}]}>
                        {tags.map?.((tag, i) => {
                            return (
                                <View key={tag + i} style={[styles.goldenTagBox, {marginLeft: i === 0 ? 0 : px(8)}]}>
                                    <Text style={styles.goldenTagText}>{tag}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}
                {button?.text ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={button?.avail === 0}
                        onPress={() => jump(button?.url)}
                        style={[Style.flexCenter, styles.cardBtn]}>
                        <Text style={styles.cardBtnText}>{button?.text}</Text>
                    </TouchableOpacity>
                ) : null}
            </LinearGradient>
        );
    };
    /** @name tabbar卡片 */
    const renderTabItem = (item, index) => {
        const {tab_name} = item;
        return (
            <View key={tab_name + index} style={{margin: px(12), marginTop: 0, height: px(146)}} tabLabel={tab_name}>
                {renderSwiperItem(item, index)}
            </View>
        );
    };

    switch (type) {
        case 'horizontal':
            return <View style={[Style.flexRow, {paddingBottom: px(12)}]}>{data.map(renderHorizontalItem)}</View>;
        case 'swiper':
            return (
                <Swiper
                    activeDotStyle={{...styles.dotStyle, backgroundColor: Colors.defaultColor, width: px(8)}}
                    autoplay
                    autoplayTimeout={4}
                    dotStyle={styles.dotStyle}
                    height={px(152)}
                    loadMinimal={Platform.select({android: false, ios: true})}
                    loop
                    paginationStyle={{bottom: px(4)}}
                    removeClippedSubviews={false}>
                    {data.map(renderSwiperItem)}
                </Swiper>
            );
        case 'tab':
            return (
                <ScrollableTabView
                    initialPage={0}
                    renderTabBar={() => (
                        <Tabbar
                            activeFontSize={px(13)}
                            btnColor={Colors.defaultColor}
                            inActiveFontSize={px(12)}
                            style={{borderBottomWidth: 0}}
                            underlineWidth={px(12)}
                            underlineStyle={{bottom: px(8)}}
                        />
                    )}>
                    {data.map(renderTabItem)}
                </ScrollableTabView>
            );
        default:
            return <>{data.map(renderDefaultItem)}</>;
    }
};

const styles = StyleSheet.create({
    leftPart: {
        marginRight: px(12),
        width: px(64),
        height: px(64),
    },
    rankIcon: {
        marginRight: px(8),
        width: px(24),
        height: px(24),
    },
    rankText: {
        marginTop: px(2),
        marginRight: Platform.select({android: px(2), ios: px(1)}),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.placeholderColor,
        fontFamily: Font.numFontFamily,
    },
    profitBox: {
        marginRight: px(12),
        borderRadius: px(64),
        width: px(64),
        height: px(64),
        justifyContent: 'center',
        alignItems: 'center',
    },
    profit: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    bigProfit: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    smProfit: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    profitLabel: {
        marginTop: px(2),
        fontSize: px(10),
        lineHeight: px(14),
        color: Colors.lightGrayColor,
    },
    linearBox: {
        borderRadius: Space.borderRadius,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    name: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    label: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
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
        fontSize: px(9),
        lineHeight: px(13),
        color: Colors.descColor,
    },
    reasonBox: {
        marginTop: px(12),
        padding: px(8),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        flexDirection: 'row',
    },
    reasonIcon: {
        marginTop: px(4),
        marginRight: px(4),
        width: px(8),
        height: px(8),
    },
    dotStyle: {
        backgroundColor: '#BDC2CC',
        width: px(4),
        height: px(2),
    },
    swiperItem: {
        paddingTop: Space.padding,
        borderRadius: Space.borderRadius,
        overflow: 'hidden',
        height: '100%',
        alignItems: 'center',
    },
    bgImage: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    ratioLabelBox: {
        marginTop: px(12),
        width: px(64),
        height: px(64),
    },
    ratioLabel1: {
        borderRadius: px(42),
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 3,
        width: px(42),
        height: px(42),
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
    },
    ratioLabel2: {
        borderRadius: px(33),
        position: 'absolute',
        top: px(17),
        right: 0,
        zIndex: 2,
        width: px(33),
        height: px(33),
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
    },
    ratioLabel3: {
        borderRadius: px(32),
        position: 'absolute',
        left: px(9),
        bottom: 0,
        zIndex: 1,
        width: px(32),
        height: px(32),
        backgroundColor: 'rgba(231, 73, 73, 0.1)',
    },
    ratioLableText1: {
        fontSize: px(8),
        lineHeight: px(12),
        color: Colors.red,
    },
    ratioLableText2: {
        fontSize: px(7),
        lineHeight: px(11),
        color: Colors.red,
    },
    ratioLableText3: {
        fontSize: px(7),
        lineHeight: px(11),
        color: Colors.red,
    },
    cardDesc: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    goldenTagBox: {
        paddingVertical: px(2),
        paddingHorizontal: px(6),
        borderRadius: px(2),
        backgroundColor: 'rgba(246, 226, 195, 0.8)',
    },
    goldenTagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#B38051',
    },
    cardBtn: {
        marginTop: px(12),
        borderRadius: px(50),
        width: px(160),
        height: px(34),
        backgroundColor: '#F44949',
    },
    cardBtnText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        fontWeight: Font.weightMedium,
    },
    managerDesc: {
        marginTop: px(8),
        fontSize: px(10),
        lineHeight: px(14),
        color: Colors.defaultColor,
    },
    redTagBox: {
        marginLeft: px(4),
        padding: px(2),
        borderTopLeftRadius: px(4),
        borderTopRightRadius: px(4),
        borderBottomRightRadius: px(4),
        backgroundColor: Colors.red,
    },
    outBox: {
        padding: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        borderColor: '#E8E8E8',
        borderTopColor: 'transparent',
        overflow: 'hidden',
    },
    divider: {
        marginVertical: px(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
});

export default Index;
