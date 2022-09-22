/*
 * @Date: 2022-09-21 15:59:19
 * @Description:工具管理
 */
import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getList} from './service';
import {Colors, Space, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import {DragSortableView} from 'react-native-drag-sort';
const sortWidth = deviceWidth - px(32);
const childrenWidth = sortWidth / 5;
const ToolList = () => {
    const [data, setData] = useState({});
    const [scrollEnable, setScrollEnable] = useState(true);
    const {my_tools = {}, tool_modules} = data;
    const getData = async () => {
        let res = await getList({type: 200});
        setData(res);
    };
    useEffect(() => {
        getData();
    }, []);
    const onSelectedDragStart = () => {
        setScrollEnable(false);
    };
    const onSelectedDragEnd = () => {
        setScrollEnable(true);
    };
    const renderSelectedItemView = (item) => {
        const {text, icon} = item;
        return (
            <View style={{alignItems: 'center'}}>
                <Image source={{uri: icon}} style={styles.icon} />
                <Text>{text}</Text>
            </View>
        );
    };
    return (
        <ScrollView style={{backgroundColor: Colors.bgColor}} scrollEnabled={scrollEnable}>
            <View style={styles.card}>
                <Text style={styles.title}>{my_tools?.title}</Text>
                {my_tools?.tool_list ? (
                    <DragSortableView
                        dataSource={my_tools?.tool_list}
                        parentWidth={sortWidth}
                        childrenWidth={childrenWidth}
                        childrenHeight={60}
                        marginChildrenTop={10}
                        onDragStart={onSelectedDragStart}
                        onDragEnd={onSelectedDragEnd}
                        // onDataChange={(data) => {
                        //     this.setState({selectedItems: data});
                        // }}
                        // onClickItem={this.onSelectedClickItem}
                        keyExtractor={(item, index) => item.tool_id} // FlatList作用一样，优化
                        renderItem={renderSelectedItemView}
                    />
                ) : null}
                <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                    {my_tools?.tool_list?.map(({text, tool_id, icon}) => (
                        <View key={tool_id} style={{alignItems: 'center', width: '20%'}}>
                            <Image source={{uri: icon}} style={styles.icon} />
                            <Text>{text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default ToolList;

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: px(20),
        marginBottom: px(12),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    title: {
        marginVertical: px(16),
        fontSize: px(13),
        lineHeight: px(18),
    },
    icon: {
        width: px(26),
        height: px(26),
        marginBottom: px(8),
    },
    text: {
        fontSize: px(11),
        lineHeight: px(15),
    },
});
