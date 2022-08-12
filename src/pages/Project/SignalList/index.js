/*
 * @Date: 2022-07-23 12:08:12
 * @Description:指数买卖信号列表
 */
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getList} from './service';
import {Colors, Style, Font} from '~/common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import {px} from '~/utils/appUtil';
import {useJump} from '~/components/hooks';
import {copilot, CopilotStep, walkthroughable} from 'react-native-copilot';
import NavBar from '~/components/NavBar';
import TooltipComponent from './TooltipComponent';
import {useSelector} from 'react-redux';

const CopilotView = walkthroughable(View);
const CopilotText = walkthroughable(Text);

const SignalList = ({navigation, start}) => {
    const jump = useJump();
    const isFocused = useIsFocused();
    const is_login = useSelector((store) => store.userInfo)?.toJS().is_login;
    const [data, setData] = useState({});

    const isFocusedRef = useRef(isFocused);
    const showCopilot = useRef(false);

    const getData = async () => {
        let res = await getList();
        setData(res.result);
        if (is_login && res.result?.is_guide_page === 1) {
            showCopilot.current = true;
        }
    };

    const navBarOption = useMemo(() => {
        return data.title
            ? {
                  title: data.title,
                  renderRight: (
                      <TouchableOpacity
                          onPress={() => jump(data?.subs_url?.url)}
                          onLayout={() => {
                              setTimeout(() => {
                                  if (isFocusedRef.current && showCopilot.current) {
                                      start?.();
                                      showCopilot.current = false;
                                  }
                              }, 251);
                          }}>
                          <CopilotStep order={1} name="headerRight">
                              <CopilotText style={styles.headerRightText}>{data?.subs_url?.text}</CopilotText>
                          </CopilotStep>
                      </TouchableOpacity>
                  ),
              }
            : {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        isFocusedRef.current = isFocused;
    }, [isFocused]);

    return (
        <>
            <NavBar leftIcon="chevron-left" {...navBarOption} />
            <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
                <CopilotStep order={2} name="content">
                    <CopilotView
                        style={[Style.flexBetween, {flexWrap: 'wrap', marginHorizontal: px(16), marginTop: px(16)}]}>
                        {data?.list?.map((item, index) => (
                            <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => jump(item.url)}>
                                <LinearGradient
                                    style={styles.con}
                                    colors={item?.background || ['#E0F9DC', '#EEF7ED']}
                                    start={{x: 0, y: 0}}
                                    end={{x: 0, y: 1}}>
                                    <Text style={styles.text}>{item.text}</Text>
                                    <Text
                                        style={{
                                            color: Colors.defaultColor,
                                            fontSize: px(15),
                                            fontFamily: Font.numFontFamily,
                                        }}>
                                        {item?.index_num}
                                    </Text>
                                    <View style={[Style.flexBetween, {position: 'absolute', bottom: px(8)}]}>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: Colors.lightBlackColor,
                                                fontSize: px(12),
                                            }}>
                                            {item?.desc}
                                        </Text>
                                        {!!item?.strength_icon && (
                                            <Image source={{uri: item?.strength_icon}} style={styles.icon} />
                                        )}
                                    </View>
                                    {!!item?.favor_icon && (
                                        <Image source={{uri: item?.favor_icon}} style={styles.favor_icon} />
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </CopilotView>
                </CopilotStep>
                <Text style={{color: '#BDC2CC', fontSize: px(11), marginHorizontal: px(16)}}>{data?.flush_time}</Text>
            </ScrollView>
        </>
    );
};

export default copilot({
    overlay: 'svg',
    animated: true,
    backdropColor: 'rgba(30,30,32,0.8)',
    tooltipComponent: TooltipComponent,
    stepNumberComponent: () => null,
    arrowColor: 'transparent',
    tooltipStyle: {
        backgroundColor: 'transparent',
        width: '100%',
    },
    contentPadding: 2,
})(SignalList);

const styles = StyleSheet.create({
    con: {
        width: px(110),
        height: px(91),
        borderRadius: px(5),
        marginBottom: px(10),
        paddingLeft: px(8),
        alignItems: 'center',
    },
    text: {
        color: Colors.defaultColor,
        fontSize: px(12),
        marginBottom: px(6),
        marginTop: px(12),
    },
    icon: {
        width: px(34),
        height: px(24),
    },
    favor_icon: {
        width: px(12),
        height: px(14),
        position: 'absolute',
        left: px(8),
        top: px(0),
    },
    headerRightText: {height: px(36), width: px(64), textAlign: 'center', lineHeight: px(36)},
});
