import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ImageBackground,
    PermissionsAndroid,
    DeviceEventEmitter,
    FlatList,
    BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import NavBar from '~/components/NavBar';
import {isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
// import Storage from '~/utils/storage';
// import http from '~/services';
// import {useFocusEffect} from '@react-navigation/native';
// import {useJump} from '~/components/hooks';
// import Loading from '~/pages/Portfolio/components/PageLoading';
// import URI from 'urijs';
// import {Modal, PageModal} from '~/components/Modal';
// import {Button} from '~/components/Button';
// import Toast from '~/components/Toast';
import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {Style, Colors, Space} from '~/common/commonStyle';
import Input from '~/components/Input';
import {useJump} from '~/components/hooks';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import Radio from '~/components/Radio.js';
import {getTemplateImg} from '../services';
// const hanMap = ['零', '一']
function BgSelectItem(props) {
    const {index, curIndex, handleSelect, uri} = props;
    const title = `选择图片${index + 1}`;
    return (
        <TouchableOpacity
            style={[styles.itemWrap, index === 0 ? {marginTop: 12} : {}]}
            onPress={() => handleSelect(index)}>
            <View style={styles.header}>
                <Radio checked={curIndex === index} />
                <Text style={styles.title}>{title}</Text>
            </View>
            <FastImage style={styles.image} source={{uri: uri}} />
        </TouchableOpacity>
    );
}

export default function SpecialModifyBgImage(props) {
    const {selectedUri, onSure} = props.route.params || {};
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState([]);
    const [index, setIndex] = useState(0);
    const loadTemplate = useCallback(() => {
        getTemplateImg()
            .then((res) => {
                setRefreshing(false);
                let i = res.result.findIndex((item) => item.uri === selectedUri);
                if (selectedUri && i > -1) {
                    setIndex(i);
                }
                setData(res.result);
            })
            .catch(() => {
                setRefreshing(false);
            });
    }, [selectedUri]);

    useEffect(() => {
        loadTemplate();
    }, [loadTemplate]);

    const rightPress = () => {
        //TODO: save image to server
        onSure(data[index].uri);
        props.navigation.goBack();
    };

    const renderItem = ({index: i, item}) => {
        return <BgSelectItem {...item} index={i} curIndex={index} handleSelect={(idx) => setIndex(idx)} />;
    };

    return (
        <SafeAreaView edges={['bottom']}>
            <NavBar
                title={'更换专题图片'}
                leftIcon="chevron-left"
                rightText={'确定'}
                rightPress={rightPress}
                on
                rightTextStyle={styles.right_sty}
            />
            <View style={styles.pageWrap}>
                <FlatList
                    data={data}
                    refreshing={refreshing}
                    onRefresh={loadTemplate}
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
