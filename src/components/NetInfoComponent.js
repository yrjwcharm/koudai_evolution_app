import React, {useMemo} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {px} from '~/utils/appUtil';
import {Button} from './Button';
import EmptyTip from './EmptyTip';

// 暂不支持ref
const NetInfoComponent = ({Component, ...props}) => {
    const netInfo = useNetInfo();
    const state = useMemo(() => {
        return netInfo.type === 'unknown' ? true : netInfo.isConnected;
    }, [netInfo]);
    return state ? (
        <Component {...props} />
    ) : (
        <>
            <EmptyTip
                img={require('../assets/img/emptyTip/noNetwork.png')}
                text={'哎呀！网络出问题了'}
                desc={'网络不给力，请检查您的网络设置'}
                style={{paddingTop: px(110), paddingBottom: px(60)}}
            />
            <Button title={'刷新一下'} style={{marginHorizontal: px(20)}} onPress={() => {}} />
        </>
    );
};

export default (Component) => (props) => <NetInfoComponent Component={Component} {...props} />;
