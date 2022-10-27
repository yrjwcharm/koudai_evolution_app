import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import RenderHtml from '~/components/RenderHtml';
import {px} from '~/utils/appUtil';

const StickyHeaderPlan = ({scrollY, detail, curtainNum, handlerCurtainHeight, cardsRate}) => {
    return (
        <View
            style={[styles.container, {top: scrollY}]}
            onLayout={(e) => {
                handlerCurtainHeight(e.nativeEvent.layout.height);
            }}>
            {curtainNum > 0 && (
                <View style={[styles.item]}>
                    <View style={styles.itemLeft}>
                        <Text style={styles.itemTitle}>{detail[0].item_title}</Text>
                    </View>
                    <View style={styles.itemRight}>
                        <RenderHtml style={styles.rate} html={cardsRate?.[0]?.now_value || detail?.[0]?.now_value} />
                        <FastImage
                            source={{
                                uri: 'https://static.licaimofang.com/wp-content/uploads/2022/07/91657595187_.pic_.png',
                            }}
                            style={styles.panelIcon}
                        />
                        <RenderHtml
                            style={styles.rate}
                            html={cardsRate?.[0]?.after_value || detail?.[0]?.after_value}
                        />
                    </View>
                </View>
            )}
            {curtainNum > 1 && (
                <>
                    <View style={[styles.item, {borderTopColor: '#F4F5F7', borderTopWidth: 1}]}>
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemTitle}>{'2. 买卖工具'}</Text>
                        </View>
                    </View>
                    {new Array(curtainNum - 1).fill('').map((_, idx) => (
                        <View key={idx} style={[styles.item, {borderTopColor: '#F4F5F7', borderTopWidth: 1}]}>
                            <View style={styles.subItemLeft}>
                                <FastImage
                                    source={{
                                        uri: detail[idx + 1].item_icon,
                                    }}
                                    style={{width: px(18), height: px(18)}}
                                />
                                <Text style={styles.itemSubTitle}>{detail[idx + 1].item_title}</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <RenderHtml
                                    style={styles.rate}
                                    html={cardsRate[idx + 1]?.now_value || detail[idx + 1]?.now_value}
                                />
                                <FastImage
                                    source={{
                                        uri:
                                            'https://static.licaimofang.com/wp-content/uploads/2022/07/91657595187_.pic_.png',
                                    }}
                                    style={styles.panelIcon}
                                />
                                <RenderHtml
                                    style={styles.rate}
                                    html={cardsRate[idx + 1]?.after_value || detail[idx + 1]?.after_value}
                                />
                            </View>
                        </View>
                    ))}
                </>
            )}
            <View
                style={{
                    backgroundColor: '#ddd',
                    opacity: 0.8,
                    height: 0.5,
                    width: '100%',
                }}
            />
        </View>
    );
};

export default StickyHeaderPlan;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        zIndex: 1,
    },
    item: {
        backgroundColor: '#fff',
        paddingVertical: px(12),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
    },
    panelIcon: {
        width: px(28),
        height: px(13),
        marginHorizontal: px(8),
    },
    rate: {
        fontSize: px(16),
        lineHeight: px(22),
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemSubTitle: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121D3a',
        marginLeft: px(8),
    },
});
