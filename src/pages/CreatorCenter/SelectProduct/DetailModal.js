/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-16 11:56:53
 */
import React from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const DetailModal = ({bottom, onClose}) => {
    return (
        <View style={[styles.container, {position: 'absolute', bottom}]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>选择明细</Text>
                <Icon
                    color={Colors.descColor}
                    name={'close'}
                    size={18}
                    onPress={() => {
                        onClose();
                    }}
                />
            </View>
            <ScrollView contentContainerStyle={styles.content} scrollIndicatorInsets={{right: 1}}>
                {[1, 2, 3, 4].map((item, idx) => (
                    <TouchableOpacity
                        style={[styles.item, {marginTop: idx > 0 ? px(27) : 0}]}
                        key={idx}
                        activeOpacity={0.8}
                        onPress={() => {}}>
                        <FastImage
                            source={{
                                uri: `http://static.licaimofang.com/wp-content/uploads/2022/10/${
                                    true ? 'check' : 'uncheck'
                                }.png`,
                            }}
                            style={{width: px(16), height: px(16)}}
                        />
                        <Text style={styles.itemText} numberOfLines={1}>
                            {'汇添富中证主要消费ETF联接A'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default DetailModal;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopLeftRadius: px(12),
        borderTopRightRadius: px(12),
        padding: px(16),
        borderBottomColor: '#ddd',
        borderBottomWidth: 0.5,
    },
    headerTitle: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#1e2331',
    },
    content: {
        backgroundColor: '#fff',
        paddingVertical: px(12),
        paddingHorizontal: px(16),
        maxHeight: px(255),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        marginLeft: px(8),
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
        flex: 1,
    },
});
