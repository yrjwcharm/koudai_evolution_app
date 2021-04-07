/*
 * @Author: dx
 * @Date: 2021-01-19 18:36:15
 * @LastEditTime: 2021-04-07 10:32:49
 * @LastEditors: dx
 * @Description: 常见问题
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import http from '../../services';
import {px as text} from '../../utils/appUtil';
import {Style, Colors, Space} from '../../common/commonStyle';
import HTML from '../../components/RenderHtml';

const CommonProblem = ({navigation, route}) => {
    const [data, setData] = useState({});
    const [activeSections, setActiveSections] = useState([0]);
    useEffect(() => {
        http.get('/portfolio/qa/20210101', {
            upid: route.params?.upid,
            poid: route.params?.poid,
        }).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, [navigation, route]);
    const updateSections = (active) => setActiveSections(active);
    const renderHeader = (section, index, isActive) => {
        return (
            <View
                style={[
                    Style.flexBetween,
                    styles.header,
                    {borderBottomRightRadius: isActive ? 0 : text(8), borderBottomLeftRadius: isActive ? 0 : text(8)},
                    index === 0 ? {marginTop: text(14)} : {},
                ]}>
                <View style={[Style.flexRow, {flex: 1, maxWidth: '90%', alignItems: 'flex-start'}]}>
                    <Image source={require('../../assets/img/detail/question.png')} style={styles.icon_ques} />
                    <Text style={styles.headerText}>{section.question}</Text>
                </View>
                <FontAwesome
                    name={`${isActive ? 'angle-up' : 'angle-down'}`}
                    size={20}
                    color={Colors.descColor}
                    style={{marginLeft: Space.marginAlign}}
                />
            </View>
        );
    };
    const renderContent = (section) => {
        const minHeight = text((Math.ceil(section.answer.length / 24) + 1) * 20);
        return (
            <View style={[styles.content, {minHeight}]}>
                {/* <HTML style={styles.content_text} html={section.a} /> */}
                <Text style={styles.content_text}>{section.answer}</Text>
            </View>
        );
    };
    return (
        <>
            {Object.keys(data || {}).length > 0 && (
                <ScrollView style={styles.container}>
                    <Accordion
                        sections={data.rows}
                        expandMultiple
                        touchableProps={{activeOpacity: 1}}
                        activeSections={activeSections}
                        renderHeader={renderHeader}
                        renderContent={renderContent}
                        onChange={updateSections}
                        sectionContainerStyle={{marginBottom: text(12)}}
                        touchableComponent={TouchableOpacity}
                    />
                </ScrollView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingHorizontal: text(12),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: text(14),
        borderRadius: text(8),
        paddingVertical: text(18),
    },
    headerText: {
        fontSize: text(15),
        lineHeight: text(22),
        fontWeight: '500',
        marginLeft: text(6),
    },
    content: {
        backgroundColor: '#fff',
        paddingHorizontal: text(20),
        paddingBottom: text(16),
        borderBottomLeftRadius: text(8),
        borderBottomRightRadius: text(8),
    },
    content_text: {
        fontSize: text(13),
        color: Colors.darkGrayColor,
        lineHeight: text(20),
        textAlign: 'justify',
    },
    icon_ques: {
        width: text(20),
        height: text(20),
        marginTop: text(2),
        marginRight: text(4),
    },
});

export default CommonProblem;
