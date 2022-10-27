/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-09-13 11:15:15
 */
import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {px} from '~/utils/appUtil';
import FastImage from 'react-native-fast-image';
import RenderHtml from '~/components/RenderHtml';

const StickyHeaderPortFolio = ({scrollY, curtainNum, handlerCurtainHeight, detail, cardsRate}) => {
    return (
        <View
            style={[styles.container, {top: scrollY}]}
            onLayout={(e) => {
                handlerCurtainHeight(e.nativeEvent.layout.height);
            }}>
            {new Array(curtainNum).fill('').map((_, idx) => (
                <View key={idx}>
                    <View style={[styles.item, idx > 0 ? {borderTopColor: '#F4F5F7', borderTopWidth: 1} : {}]}>
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemTitle}>{detail?.[idx]?.item_title}</Text>
                        </View>
                        <View style={styles.itemRight}>
                            <RenderHtml
                                html={cardsRate?.[idx]?.now_value || detail?.[idx]?.now_value}
                                style={styles.rate}
                            />
                            <FastImage
                                source={{
                                    uri:
                                        'https://static.licaimofang.com/wp-content/uploads/2022/07/91657595187_.pic_.png',
                                }}
                                style={styles.panelIcon}
                            />
                            <RenderHtml
                                html={cardsRate?.[idx]?.after_value || detail?.[idx]?.after_value}
                                style={styles.rate}
                            />
                        </View>
                    </View>
                </View>
            ))}
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

export default StickyHeaderPortFolio;

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
});
