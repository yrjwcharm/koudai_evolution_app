/*
 * @Date: 2022-09-23 11:20:00
 * @Description:
 */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useJump} from '~/components/hooks';
import {getAlertColor} from './util';
import {Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import SmButton from '~/components/Button/SmButton';

// 信号
const RenderAlert = ({alert}) => {
    const jump = useJump();
    const {bgColor, buttonColor} = getAlertColor(alert.alert_style);
    return (
        <View style={[Style.flexBetween, styles.singal_card, {backgroundColor: bgColor, marginTop: px(8), top: px(4)}]}>
            <View style={[Style.flexRow, {flex: 1}]}>
                {/* <Image
                    onLoad={({nativeEvent: {width, height}}) =>
                        alertIcon.current.setNativeProps({style: {width: (width * px(16)) / height}})
                    }
                    ref={alertIcon}
                    source={{uri: alert?.alert_icon}}
                    style={{height: px(16), marginRight: px(8)}}
                /> */}
                <Text style={{flex: 1, fontSize: px(11), color: buttonColor}} numberOfLines={1}>
                    {alert?.desc}
                </Text>
            </View>
            {!!alert?.button && (
                <SmButton
                    title={alert?.button?.text}
                    style={{borderColor: buttonColor}}
                    titleStyle={{color: buttonColor}}
                    onPress={() => {
                        global.LogTool('guide_click', '资产卡片长条', alert?.log_id);
                        jump(alert?.alert_button?.url);
                    }}
                />
            )}
        </View>
    );
};
export default RenderAlert;
const styles = StyleSheet.create({
    singal_card: {
        height: px(32),
        borderRadius: px(4),
        paddingHorizontal: px(8),
    },
});
