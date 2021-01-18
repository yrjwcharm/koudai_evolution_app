/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-18 10:38:47
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-18 10:46:40
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {px as text} from '../utils/appUtil';
import PropTypes from 'prop-types';
export default class Table extends Component {
    static defaultProps = {
        head: {},
        body: [],
    };
    static propTypes = {
        head: PropTypes.object,
        body: PropTypes.array,
    };
    render() {
        const {head, body} = this.props.data;
        return (
            <View>
                <View style={styles.ContainerHead}>
                    <View style={[styles.HeadText]}></View>
                    <Text style={styles.HeadText}>{head.percent || head.share}</Text>
                    <Text style={[styles.HeadText]}>{head.amount}</Text>
                </View>
                {body.length > 0 &&
                    body.map((item, index) => {
                        return (
                            <View
                                key={index + 'line'}
                                style={{
                                    backgroundColor: index % 2 == 0 ? '#fff' : '#F7F8FA',
                                    flexDirection: 'row',
                                    paddingVertical: text(10),
                                    alignItems: 'center',
                                }}>
                                <Text style={[styles.bodyText]}>{item.name}</Text>
                                <Text style={styles.bodyText}>{item.percent || item.share}</Text>
                                <Text style={styles.bodyText}>{item.amount || item.share}</Text>
                            </View>
                        );
                    })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ContainerHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: text(10),
    },
    HeadText: {
        width: '33%',
        color: '#101A30',
        fontSize: text(14),
        // paddingHorizontal: 15,
        textAlign: 'center',
    },
    Textleft: {
        textAlign: 'left',
    },
    TextRight: {
        textAlign: 'right',
    },
    bodyText: {
        color: '#0B1E3E',
        fontSize: text(14),
        textAlign: 'center',
        width: '33%',
    },
});
