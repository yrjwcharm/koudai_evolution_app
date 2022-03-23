import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import Loading from '../Portfolio/components/PageLoading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import {px} from '../../utils/appUtil';
import {Colors} from '../../common/commonStyle';

const WalletAutoRechargeDetail = ({navigation, route}) => {
    const [imgLoaded, updateImgLoaded] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        navigation.setOptions({title: route.params.title});
        let historyRoutes = navigation.dangerouslyGetState?.()?.routes || [];
        historyRoutes.forEach((item) => {
            if (item.name === 'PortfolioAssets') {
                global.LogTool('FixedPlanDetail_Planrecord_BabyRecharge_Introduction');
            } else if (item.name === 'DetailAccount') {
                global.LogTool('DetailFixed_TradeBuy_BabyRecharge_Introduction');
            }
        });
    }, [navigation, route]);
    return (
        <>
            <ScrollView
                bounces={false}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1, backgroundColor: '#fff', padding: px(16)}}>
                <Image
                    source={{uri: route.params?.img}}
                    style={{width: px(343), height: px(835)}}
                    resizeMode="contain"
                    onLoadEnd={() => {
                        updateImgLoaded(true);
                    }}
                />
                <View style={{height: insets.bottom + 50}} />
            </ScrollView>
            {!imgLoaded && (
                <View
                    style={{
                        backgroundColor: Colors.bgColor,
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                    }}>
                    <Loading />
                </View>
            )}
        </>
    );
};

export default WalletAutoRechargeDetail;
