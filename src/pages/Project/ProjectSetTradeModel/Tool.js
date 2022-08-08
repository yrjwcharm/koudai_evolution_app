/*
 * @Date: 2022-07-20 16:41:11
 * @Description:
 */
import {StyleSheet, Switch, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import RenderAutoTime from './AutoTime';
import {px} from '~/utils/appUtil';
import {Modal} from '~/components/Modal';
import RenderHtml from '~/components/RenderHtml';
import {postLeaveTrace} from './service';

const Tool = ({tool, onChange, onChangeAutoTime, onChangeNowBuy, poid}) => {
    const [status, setStatus] = useState(tool.open_status != 0);
    const [needBuy, setNeedBuy] = useState(tool?.now_buy?.open_status == 1);
    const [showConfig, setShowConfig] = useState(true);
    const onValueChange = (value,init) => {
        setStatus(value);
        onChange && onChange(tool.id, value);

        if (tool.id == 3 || tool.id == 4) {
            //估值信号 概率工具
            setShowConfig(value);
        }
        //曾经关闭再次开启弹窗提示
        if (!init&&value && tool?.pop_tool_risk_reminder) {
            Modal.show({
                title: tool?.pop_tool_risk_reminder?.title,
                children: () => (
                    <ScrollView style={{margin: px(16), height: px(300)}} showsVerticalScrollIndicator={false}>
                        <RenderHtml style={styles.contentText} html={tool?.pop_tool_risk_reminder?.content} />
                    </ScrollView>
                ),
                confirmCallBack: () => {
                    postLeaveTrace({poid, tool_id: tool.id});
                },
            });
        }
    };
    useEffect(() => {
        onChange(tool.id, status);
        onChangeNowBuy(needBuy);
        onValueChange(status,'init');
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
    contentText: {fontSize: px(14), color: Colors.lightBlackColor, lineHeight: px(20)},
});
