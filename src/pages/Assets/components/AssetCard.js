import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import RenderAlert from './RenderAlert';
import RenderHtml from '~/components/RenderHtml';
import {Colors, Font, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import {useJump} from '~/components/hooks';
import Icon from 'react-native-vector-icons/Entypo';
import TagInfo from './TagInfo';
const AssetCard = ({data = {}, showEye, style, borderStyle, type}) => {
    const jump = useJump();
    const {
        log_id,
        adviser,
        company_name,
        holding_days,
        profit_acc,
        remind_info,
        tag_info,
        tool_tag_info,
        url,
        name,
        anno,
        amount,
        share,
        nav,
        cost_nav,
        profit,
        code,
        signal_icons, //工具icon
        open_tip, //私募下期开放时间
        profit_title,
        right_top_tag,
    } = data;
    return (
        <TouchableOpacity
            style={[styles.portCard, {paddingTop: borderStyle ? 0 : px(12)}, style]}
            activeOpacity={0.8}
            onPress={() => {
                if (tag_info?.log_id) {
                    global.LogTool('guide_click', '卡片标签 ', tag_info.log_id);
                }
                global.LogTool('single_card', log_id);
                jump(url);
            }}>
            <View style={[{paddingTop: borderStyle ? px(12) : 0}, borderStyle]}>
                <View style={[Style.flexBetween, {marginBottom: px(5)}]}>
                    <View style={Style.flexRow}>
                        <Text style={[styles.name, {marginBottom: 0}]}>{name}</Text>
                        {!!anno && <Text style={{fontSize: px(11), marginLeft: px(4)}}>{anno}</Text>}
                        {!!tag_info && <TagInfo data={tag_info} />}
                        {tool_tag_info?.map?.((item) => (
                            <View style={[styles.toolTag, {borderColor: item.tag_color}]} key={item.text}>
                                <Text
                                    style={{
                                        fontSize: px(10),
                                        lineHeight: px(14),
                                        color: item.tag_color,
                                    }}>
                                    {item?.text}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={Style.flexRow}>
                        {profit_title ? (
                            <View style={styles.portCardUpdateHint}>
                                <Text style={styles.portCardUpdateHintText}>{profit_title}</Text>
                            </View>
                        ) : null}
                        {!!open_tip && <Text style={{fontSize: px(10), color: Colors.lightGrayColor}}>{open_tip}</Text>}
                        <Icon name="chevron-thin-right" color={Colors.lightBlackColor} size={px(10)} />
                    </View>
                </View>

                <View style={Style.flexRow}>
                    {/* 基金 */}
                    {type == 10 ? (
                        <View style={{flex: 1.4}}>
                            <Text style={styles.holdingDays}>{code}</Text>
                            {holding_days && right_top_tag ? (
                                <Text
                                    style={{
                                        fontSize: px(10),
                                        color: Colors.lightGrayColor,
                                    }}>
                                    {holding_days}
                                </Text>
                            ) : (
                                //占位
                                <Text
                                    style={{
                                        fontSize: px(10),
                                        color: Colors.lightGrayColor,
                                    }}>
                                    {''}
                                </Text>
                            )}
                        </View>
                    ) : (
                        <View style={{flex: 1.4}}>
                            {!!holding_days && <Text style={styles.holdingDays}>{holding_days}</Text>}
                            {/* 计划工具icon */}
                            {signal_icons ? (
                                <View style={Style.flexRow}>
                                    {signal_icons?.map((_icon, _index) => (
                                        <Image
                                            source={{uri: _icon}}
                                            key={_index}
                                            style={{width: px(14), height: px(14), marginRight: px(6)}}
                                        />
                                    ))}
                                </View>
                            ) : company_name || adviser ? (
                                <Text
                                    style={{
                                        fontSize: px(10),
                                        color: Colors.lightGrayColor,
                                    }}>
                                    {company_name || adviser}
                                </Text>
                            ) : null}
                        </View>
                    )}
                    {/* 资产份额 */}
                    <View style={{alignItems: 'flex-end', flex: 1}}>
                        <Text style={styles.card_amount}>{showEye === 'true' ? amount : '****'}</Text>
                        <Text style={styles.amountLightText}>{showEye === 'true' ? share : '****'}</Text>
                    </View>
                    {/* 净值/成本 */}
                    <View style={{alignItems: 'flex-end', flex: 1}}>
                        <Text style={styles.card_amount}>{showEye === 'true' ? nav : '****'}</Text>
                        <Text style={styles.amountLightText}>{showEye === 'true' ? cost_nav : '****'}</Text>
                    </View>
                    {/* 收益 */}
                    <View style={{alignItems: 'flex-end', flex: 1}}>
                        {log_id == 10 ? (
                            <Text style={styles.card_amount}>
                                {showEye === 'true'
                                    ? profit && <RenderHtml html={profit} style={styles.card_amount} />
                                    : '****'}
                            </Text>
                        ) : (
                            <Text style={styles.card_amount}>
                                {showEye === 'true'
                                    ? profit_acc && <RenderHtml html={profit_acc} style={styles.card_amount} />
                                    : '****'}
                            </Text>
                        )}
                    </View>
                </View>
                {!!remind_info && <RenderAlert alert={remind_info} />}
            </View>
        </TouchableOpacity>
    );
};

export default AssetCard;

const styles = StyleSheet.create({
    portCard: {
        backgroundColor: '#fff',
        padding: px(12),
        borderRadius: px(6),
        marginHorizontal: px(16),
        marginBottom: px(8),
    },
    portCardUpdateHint: {
        backgroundColor: '#F1F6FF',
        paddingVertical: px(2),
        paddingHorizontal: px(3),
        borderRadius: px(4),
        marginRight: px(8),
    },
    portCardUpdateHintText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#0051CC',
    },
    card_amount: {
        fontSize: px(12),
        fontFamily: Font.numFontFamily,
        lineHeight: px(16.8),
    },
    amountLightText: {fontSize: px(11), color: Colors.lightBlackColor, marginTop: px(5), fontFamily: Font.numRegular},
    sortImg: {
        width: px(6),
        height: px(10),
        marginLeft: px(1),
        marginBottom: px(-2),
    },
    name: {fontWeight: '700', fontSize: px(12)},
    holdingDays: {
        fontSize: px(11),
        color: Colors.lightBlackColor,
        lineHeight: px(15.4),
        marginBottom: px(4),
    },
    toolTag: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: px(2),
        paddingHorizontal: px(5),
        paddingVertical: 1,
        marginLeft: px(6),
    },
});
