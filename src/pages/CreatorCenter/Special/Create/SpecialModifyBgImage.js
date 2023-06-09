import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {px} from '~/utils/appUtil';
import {SafeAreaView} from 'react-native-safe-area-context';
import Radio from '~/components/Radio.js';
import {getTemplateBgImg} from './services';
import LoadingTips from '~/components/LoadingTips';

function BgSelectItem(props) {
    const {index, curIndex, handleSelect, url, name} = props;

    return (
        <TouchableOpacity
            style={[styles.itemWrap, index === 0 ? {marginTop: 12} : {}]}
            onPress={() => handleSelect(index)}>
            <View style={styles.header}>
                <Radio checked={curIndex === index} />
                <Text style={styles.title}>{name}</Text>
            </View>
            <FastImage style={styles.image} source={{uri: url}} />
        </TouchableOpacity>
    );
}

export default function SpecialModifyBgImage(props) {
    const {selectedUri, onSure} = props.route.params || {};
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [index, setIndex] = useState(0);
    const loadTemplate = useCallback(() => {
        setLoading(true);
        getTemplateBgImg()
            .then((res) => {
                if (res.code === '000000') {
                    let i = res.result.items.findIndex((item) => item.url === selectedUri);
                    if (selectedUri && i > -1) {
                        setIndex(i);
                    }
                    setData(res.result);
                }
            })
            .catch((e) => {
                console.log(e);
            })
            .finally((_) => {
                setLoading(false);
            });
    }, [selectedUri]);

    useEffect(() => {
        loadTemplate();
    }, [loadTemplate]);

    const rightPress = () => {
        onSure(data.items[index].url);
        props.navigation.goBack();
    };

    const renderItem = ({index: i, item}) => {
        return <BgSelectItem {...item} index={i} curIndex={index} handleSelect={(idx) => setIndex(idx)} />;
    };

    if (loading) {
        return (
            <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
                <NavBar title={data?.title || '更换专题图片'} leftIcon="chevron-left" />
                <View style={{width: '100%', height: px(200)}}>
                    <LoadingTips />
                </View>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar
                title={data?.title || '更换专题图片'}
                leftIcon="chevron-left"
                rightText={'确定'}
                rightPress={rightPress}
                rightTextStyle={styles.right_sty}
            />
            <View style={styles.contentWrap}>
                <FlatList
                    data={data.items}
                    renderItem={renderItem}
                    extraData={index}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    right_sty: {
        marginRight: px(14),
        color: '#121D3A',
    },
    pageWrap: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    contentWrap: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: px(16),
        paddingRight: px(16),
        paddingTop: px(12),
        minHeight: '100%',
    },
    itemWrap: {
        backgroundColor: '#fff',
        marginTop: 16,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        marginLeft: px(8),
        fontSize: px(13),
        color: '#121D3A',
    },
    image: {
        marginTop: px(12),
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
        height: 183,
    },
    space1: {
        marginTop: px(12),
    },
});
