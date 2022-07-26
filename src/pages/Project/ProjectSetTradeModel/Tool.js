/*
 * @Date: 2022-07-20 16:41:11
 * @Description:
 */
import {StyleSheet, Switch, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import RenderAutoTime from './AutoTime';
import {px} from '~/utils/appUtil';

const Tool = ({tool, onChange, onChangeAutoTime, onChangeNowBuy}) => {
    const [status, setStatus] = useState(tool.open_status != 0);
    const [needBuy, setNeedBuy] = useState(tool?.open_status == 1);
    const [showConfig, setShowConfig] = useState(true);
    const onValueChange = (value) => {
        setStatus(value);
        onChange && onChange(tool.id, value);
        if (tool.id == 3) {
            //估值信号
            setShowConfig(value);
        }
    };
    useEffect(() => {
        onChange(tool.id, status);
        onChangeNowBuy(needBuy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <View style={{...Style.flexBetween, ...styles.trade_con_title}}>
                <View style={styles.label}>
                    <Text style={{fontSize: px(14)}}>{tool.name}</Text>
                </View>
                <Switch
                    value={status}
                    onValueChange={onValueChange}
                    ios_backgroundColor={'#CCD0DB'}
                    thumbColor={'#fff'}
                    trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                />
            </View>
            {showConfig && (
                <>
                    {tool?.period_info && (
                        <RenderAutoTime initalData={tool?.period_info} onChangeAutoTime={onChangeAutoTime} />
                    )}
                    {/* 立即买一笔 */}
                    {tool?.now_buy ? (
                        <View
                            style={{
                                ...Style.flexBetween,
                                ...styles.trade_con_title,
                                borderBottomWidth: 0,
                                borderTopWidth: 0.5,
                                borderTopColor: '#E2E4EA',
                            }}>
                            <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>{tool?.now_buy?.text}</Text>
                            <Switch
                                ios_backgroundColor={'#CCD0DB'}
                                onValueChange={(value) => {
                                    setNeedBuy(value);
                                    onChangeNowBuy(value);
                                }}
                                thumbColor={'#fff'}
                                trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                                value={needBuy}
                            />
                        </View>
                    ) : null}
                </>
            )}
        </>
    );
};

export default Tool;

const styles = StyleSheet.create({
    trade_con_title: {
        height: px(52),
        borderBottomColor: '#E2E4EA',
        borderBottomWidth: 0.5,
    },
});
