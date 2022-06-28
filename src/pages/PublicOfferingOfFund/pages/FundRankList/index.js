/*
 * @Date: 2022-06-23 15:13:37
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-06-28 19:17:24
 * @Description: 基金榜单
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import NavBar from '~/components/NavBar';
import ProductCards from '~/components/Portfolios/ProductCards';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';

const Index = () => {
    const renderItem = ({item, index}) => {
        return <ProductCards data={item} style={index === 0 ? {marginTop: 0} : {}} />;
    };

    const renderList = () => {
        return (
            <>
                <FlatList
                    data={[{type: 'default_card'}, {type: 'default_card'}, {type: 'default_card'}]}
                    initialNumToRender={20}
                    keyExtractor={(item, index) => item + index}
                    // ListFooterComponent={renderFooter}
                    // ListEmptyComponent={renderEmpty}
                    // onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    // onRefresh={onRefresh}
                    // refreshing={refreshing}
                    renderItem={renderItem}
                    style={styles.flatList}
                />
            </>
        );
    };

    return (
        <View style={styles.container}>
            <Image
                source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/06/niub_header.png'}}
                style={styles.topBg}
            />
            <NavBar leftIcon={'chevron-left'} fontStyle={{color: '#fff'}} style={{backgroundColor: 'transparent'}} />
            {/* <View style={styles.listContainer}>{renderList()}</View> */}
            <LinearGradient
                colors={['rgba(255, 243, 243, 0.79)', '#F5F6F8']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 0.11}}
                style={[styles.listContainer, {paddingTop: px(24)}]}>
                {renderList()}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: px(268),
        zIndex: 9,
    },
    listContainer: {
        marginTop: px(100),
        borderRadius: Space.borderRadius,
        flex: 1,
        position: 'relative',
        zIndex: 10,
    },
    flatList: {
        marginHorizontal: Space.marginAlign,
        flex: 1,
    },
});

export default Index;
