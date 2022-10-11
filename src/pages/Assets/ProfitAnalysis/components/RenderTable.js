/*
 * @Date: 2022/10/11 22:48
 * @Author: yanruifeng
 * @Description: 收益明细更新说明表格
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet} from 'react-native';
import {Colors, Font, Space, Style} from '../../../../common/commonStyle';
import {px, px as text} from '../../../../utils/appUtil';

const RenderTable = () => {
    return (
        <View style={[styles.tableWrap]}>
            <View style={[Style.flexRow, {backgroundColor: Colors.bgColor}]}>
                <View style={[styles.borderRight, {flex: 1}]}>
                    <Text style={[styles.tableCell, {fontWeight: '500'}]}>{'基金种类'}</Text>
                </View>
                <View style={[styles.borderRight, {flex: 1.5}]}>
                    <Text style={[styles.tableCell, {fontWeight: '500'}]}>{'更新时间'}</Text>
                </View>
                <View style={[styles.borderRight, {flex: 1.76}]}>
                    <Text style={[styles.tableCell, {fontWeight: '500'}]}>{'说明'}</Text>
                </View>
            </View>
            <View style={Style.flexRow}>
                <View style={{flex: 2.5}}>
                    <View style={Style.flexRow}>
                        <View style={[styles.borderRight, {flex: 1}]}>
                            <Text style={styles.tableCell}>{'普通基金'}</Text>
                        </View>
                        <View style={[styles.borderRight, {flex: 1.5}]}>
                            <Text style={styles.tableCell}>{'1个交易日（T+1）'}</Text>
                        </View>
                    </View>
                    <View style={[Style.flexRow, {backgroundColor: Colors.bgColor, height: text(41)}]}>
                        <View style={[styles.borderRight, {flex: 1}]}>
                            <Text style={styles.tableCell}>{'QDII基金'}</Text>
                        </View>
                        <View style={[styles.borderRight, {flex: 1.5}]}>
                            <Text style={styles.tableCell}>{'2个交易日（T+2）'}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex: 1.76}}>
                    <Text style={[styles.tableCell, styles.bigCell]}>
                        {'因基金净值更新时间不同，收益更新时，日收益、累计收益会产生变动'}
                    </Text>
                </View>
            </View>
        </View>
    );
};

RenderTable.propTypes = {};

export default RenderTable;
const styles = StyleSheet.create({
    tableWrap: {
        marginBottom: text(20),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        overflow: 'hidden',
    },
    borderRight: {
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    tableCell: {
        paddingVertical: text(12),
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
        textAlign: 'center',
    },
    incomeContainer: {
        padding: Space.padding,
        backgroundColor: '#fff',
    },
    incomeItem: {
        marginBottom: text(12),
        marginHorizontal: Space.marginAlign,
        backgroundColor: Colors.bgColor,
    },
    colorBar: {
        height: text(34),
        paddingHorizontal: text(12),
    },
    incomeText: {
        fontSize: Font.textH2,
        lineHeight: text(16),
        color: '#fff',
        fontFamily: Font.numFontFamily,
        // fontWeight: 'bold',
    },
    feeText: {
        paddingVertical: text(4),
        paddingLeft: text(12),
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
    },
    headerText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
    sectionList: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bigCell: {
        paddingVertical: text(6),
        paddingHorizontal: text(8),
        textAlign: 'justify',
        flex: 1,
    },
});
