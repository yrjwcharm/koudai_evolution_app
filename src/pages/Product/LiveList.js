/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-11-03 11:41:59
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useJump} from '~/components/hooks';
import {px} from '~/utils/appUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LiveCard from '~/components/Article/LiveCard';

const LiveList = ({proData}) => {
    const jump = useJump();
    return (
        <View style={styles.liveCardsWrap}>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.liveCardsHeader}
                onPress={() => {
                    jump(proData?.live_list?.more?.url);
                }}>
                <Text style={styles.liveCardsTitleText}>{proData?.live_list.title}</Text>
                {proData?.live_list.more ? <FontAwesome name={'angle-right'} size={px(14)} color={'#545968'} /> : null}
            </TouchableOpacity>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginTop: px(8)}}>
                {proData?.live_list.items.map?.((item, idx) => (
                    <LiveCard
                        data={item}
                        key={idx}
                        style={{
                            marginLeft: px(idx > 0 ? 6 : 0),
                            width: px(213),
                            borderWidth: 0.5,
                            borderColor: '#E9EAEF',
                        }}
                        coverStyle={{width: px(213), height: px(94)}}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default LiveList;

const styles = StyleSheet.create({
    liveCardsWrap: {
        marginTop: px(12),
        backgroundColor: '#fff',
        borderRadius: px(6),
        padding: px(12),
    },
    liveCardsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    liveCardsTitleText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
    },
});
