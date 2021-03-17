/*
 * @Author: dx
 * @Date: 2021-01-18 17:58:51
 * @LastEditTime: 2021-03-17 20:37:02
 * @LastEditors: dx
 * @Description: 资金安全
 * @FilePath: /koudai_evolution_app/src/pages/Common/FundSafe.js
 */
import React, {Component} from 'react';
import {StyleSheet, StatusBar, ScrollView, Text, TouchableOpacity} from 'react-native';
import FitImage from 'react-native-fit-image';
import Feather from 'react-native-vector-icons/Feather';
import http from '../../services';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Style} from '../../common/commonStyle';
import {ShareModal} from '../../components/Modal';

class FundSafe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }
    componentDidMount() {
        http.get('/portfolio/asset_safe/20210101').then((res) => {
            if (res.code === '000000') {
                this.props.navigation.setOptions({
                    headerBackImage: () => {
                        return <Feather name="chevron-left" size={30} color={'#fff'} />;
                    },
                    headerStyle: {
                        backgroundColor: Colors.brandColor,
                        shadowOffset: {
                            height: 0,
                        },
                        elevation: 0,
                    },
                    headerTitleStyle: {
                        color: '#fff',
                        fontSize: text(18),
                    },
                    headerRight: (props) => (
                        <>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.topRightBtn, Style.flexCenter]}
                                onPress={() => this.shareModal.show()}>
                                <Text style={styles.btnText}>分享</Text>
                            </TouchableOpacity>
                        </>
                    ),
                    title: res.result.title || '资金安全',
                });
                StatusBar.setBarStyle('light-content');
                this.setState({data: res.result});
            }
        });
    }
    componentWillUnmount() {
        StatusBar.setBarStyle('dark-content');
    }
    render() {
        const {data} = this.state;
        return (
            <ScrollView style={[styles.container]} scrollIndicatorInsets={{right: 1}}>
                {data?.image_list?.map((item, index) => {
                    return <FitImage key={index} source={{uri: item}} />;
                })}
                <ShareModal ref={(ref) => (this.shareModal = ref)} title={'分享理财魔方'} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topRightBtn: {
        flex: 1,
        width: text(36),
        marginRight: text(8),
    },
    btnText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#fff',
    },
});

export default FundSafe;
