/*
 * @Date: 2022-10-14 15:42:01
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-27 17:53:11
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/components/SpecialRecommend.js
 * @Description:  专题推荐样式
 * @Usage:  <RecommendItemWrap tabs={['推广位一', '推广位二']}><RecommendImage /><RecommendImage /></RecommendItemWrap>
 * @Usage:  <RecommendItemWrap tabs={['推广位一', '推广位二']}><RecommendProduct /><RecommendProduct /></RecommendItemWrap>
 */

import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px} from '~/utils/appUtil';
import Html from '~/components/RenderHtml';

export function RecommendImage(props) {
    const {uri} = props;
    if (uri) {
        return <FastImage source={{uri}} style={styles.itemContent_bg} />;
    }
    return (
        <ImageBackground style={styles.itemContent_bg} source={require('~/assets/img/special/bg-gray.png')}>
            <Text style={styles.itemEmpty_title}>上传推广专题图片 </Text>
            <Text style={styles.itemEmpty_desc}> (建议包含专题名称、简介内容，图片尺寸957*438px)</Text>
        </ImageBackground>
    );
}

export function RecommendProduct(props) {
    const {desc, product, tags} = props;
    const filterdTags = tags.filter((t) => t && t.length > 0);
    return (
        <ImageBackground style={styles.itemContent_bg} source={require('~/assets/img/special/bg-product.png')}>
            <Html style={styles.itemContent_title} html={desc} numberOfLines={1} />
            <Text style={styles.itemContent_desc}>{product?.product_name}</Text>
            <View style={styles.itemContent_tagsWrap}>
                {(filterdTags || []).map((tag) => (
                    <View style={styles.itemContent_tag}>
                        <Text style={styles.itemContent_tagText}>{tag}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.itemContent_btn}>
                <Text style={styles.itemContent_btnText}>立刻查看</Text>
            </View>
        </ImageBackground>
    );
}

export function RecommendItemWrap(props) {
    const {tabs, children} = props;
    const [index, setIndex] = useState(0);
    const content = children[index];

    return (
        <View style={styles.itemWrap_card}>
            <View style={styles.tabItemsWrap}>
                {tabs.map((item, idx) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.tabItem]}
                        key={idx}
                        onPress={() => {
                            setIndex(idx);
                        }}>
                        <Text style={[index === idx ? styles.tabTextActive : styles.tabTextDefault]}>{item}</Text>
                        <View style={[styles.underLine, {opacity: index === idx ? 1 : 0}]} />
                    </TouchableOpacity>
                ))}
            </View>
            {content}
        </View>
    );
}

const styles = StyleSheet.create({
    itemWrap_card: {
        backgroundColor: '#fff',
        padding: px(12),
        borderRadius: px(6),
        width: '100%',
    },
    tabItemsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: px(8),
    },
    tabItem: {
        alignItems: 'center',
        marginRight: px(20),
    },
    tabTextDefault: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        fontWeight: 'bold',
    },
    tabTextActive: {
        fontSize: px(13),
        fontWeight: 'bold',
        color: '#121D3A',
        lineHeight: px(20),
    },
    underLine: {
        width: px(20),
        height: 2,
        borderRadius: 1,
        backgroundColor: '#121d3a',
        marginTop: 3,
    },
    itemContent_bg: {
        width: '100%',
        height: px(146),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContent_title: {
        color: '#121D3A',
        fontSize: px(15),
        marginTop: px(16),
        lineHeight: px(21),
        fontWeight: 'bold',
    },
    itemContent_desc: {
        color: '#121D3A',
        fontSize: px(12),
        marginTop: px(8),
        lineHeight: px(17),
    },
    itemContent_tagsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: px(8),
    },
    itemContent_tag: {
        backgroundColor: '#F6E2C3',
        borderRadius: px(2),
        height: px(18),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: px(6),
        marginLeft: px(8),
    },
    itemContent_tagText: {
        color: '#B38051',
        fontSize: px(10),
    },
    itemContent_btn: {
        height: px(34),
        marginTop: px(12),
        borderRadius: px(50),
        backgroundColor: '#F44949',
        width: px(150),
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContent_btnText: {
        fontSize: px(12),
        color: '#fff',
    },
    itemEmpty_title: {
        color: '#545968',
        fontSize: px(13),
        lineHeight: px(20),
    },
    itemEmpty_desc: {
        color: '#9AA0B1',
        fontSize: px(11),
        lineHeight: px(15),
    },
    image: {
        marginTop: px(12),
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
        height: 183,
    },
    space1: {
        marginTop: px(12),
    },
});
