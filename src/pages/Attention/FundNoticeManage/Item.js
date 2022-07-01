/*
 * @Date: 2022-06-29 21:56:50
 * @Description:
 */
import {StyleSheet, Switch, Text, View, Image} from 'react-native';
import React, {useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import {setEvent} from './services';

const Item = ({data}) => {
    const [isEnabled, setIsEnabled] = useState(data.status == 'ON');
    const toggleSwitch = () => {
        setIsEnabled((previousState) => {
            sendEvent({id: data.id, status: previousState ? 'OFF' : 'ON'});
            return !previousState;
        });
    };
    const sendEvent = (params) => {
        setEvent(params);
    };
    return (
        <View>
            <View style={[styles.card, Style.flexBetween]}>
                <View style={Style.flexRow}>
                    {data.icon_url && (
                        <Image
                            source={{uri: data.icon_url}}
                            style={{marginRight: px(7), width: px(24), height: px(24)}}
                        />
                    )}
                    <View>
                        <Text style={styles.title}>{data.name}</Text>
                        <Text style={styles.desc}>{data.desc}</Text>
                    </View>
                </View>
                <Switch
                    trackColor={{false: Colors.bgColor, true: Colors.btnColor}}
                    thumbColor={'#fff'}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
        </View>
    );
};

export default Item;

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: px(16),
        borderTopColor: '#E9EAEF',
        borderTopWidth: 0.5,
        height: px(63),
        backgroundColor: '#fff',
    },
    title: {
        fontSize: px(14),
        lineHeight: px(20),
        color: Colors.defaultColor,
        marginBottom: px(2),
        fontWeight: '700',
    },
    desc: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        lineHeight: px(17),
    },
    icon_img: {
        width: px(24),
        height: px(24),
        marginRight: px(8),
    },
});
