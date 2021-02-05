/*
 * @Author: xjh
 * @Date: 2021-01-25 16:51:32
 * @Description:银行常见问题
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-04 14:40:37
 */
import React, {useState, TouchableOpacity} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {px as text} from '../utils/appUtil';
import {Colors, Style} from '../common//commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Html from '../components/RenderHtml';
export default function Question(props) {
    const [activeSections, setActiveSections] = useState([0]);
    const updateSections = (activeSections) => setActiveSections(activeSections);
    const renderHeader = (section, index, isActive) => {
        return (
            <View style={[styles.header_sty, Style.flexBetween]}>
                <Text style={{flex: 1}}>{section.k}</Text>
                <AntDesign name={`${isActive ? 'up' : 'down'}`} size={12} color={'#4E556C'} />
            </View>
        );
    };
    const renderContent = (section) => {
        return <Html style={styles.content_text_sty} html={section.v} />;
    };
    return (
        <View>
            <Accordion
                sections={props.data}
                expandMultiple
                touchableProps={{activeOpacity: 1}}
                activeSections={activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={updateSections}
                duration={300}
                sectionContainerStyle={{marginBottom: text(12)}}
                touchableComponent={TouchableOpacity}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    content_sty: {
        padding: text(16),
        paddingBottom: 0,
        backgroundColor: '#fff',
    },
    content_text_sty: {
        fontSize: text(13),
        color: Colors.darkGrayColor,
        lineHeight: text(20),
        textAlign: 'justify',
    },
    header_sty: {
        paddingBottom: text(4),
        backgroundColor: '#fff',
    },
});
