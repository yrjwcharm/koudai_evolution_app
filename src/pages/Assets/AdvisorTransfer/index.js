/*
 * @Date: 2022-11-22 16:26:19
 * @Description: 转换投顾机构
 */
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import {Modal} from '~/components/Modal';
import NavBar from '~/components/NavBar';
import {PasswordModal} from '~/components/Password';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import withPageLoading from '~/components/withPageLoading';
import {px} from '~/utils/appUtil';
import {actionReport, doTransfer, getData} from './services';

const Index = ({navigation, route, setLoading}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {agreement, agreement_bottom, button, codes = '', desc_img, risk_disclosure, top_img, type = 0} = data;
    const [scrollY, setScrollY] = useState(0);
    const passwordModal = useRef();
    const riskScrollView = useRef();
    const showRiskDisclosure = useRef(true);

    const onTransfer = () => {
        if (risk_disclosure && showRiskDisclosure.current) {
            showRiskDisclosure.current = false;
            const {content, countdown, sub_title, title} = risk_disclosure;
            Modal.show({
                backButtonClose: false,
                children: () => {
                    return (
                        <>
                            <Text style={styles.subTitle}>{sub_title}</Text>
                            <ScrollView
                                bounces={false}
                                ref={riskScrollView}
                                scrollIndicatorInsets={{right: 1}}
                                style={styles.riskScrollView}>
                                <HTML html={content} style={styles.content} />
                            </ScrollView>
                        </>
                    );
                },
                confirmCallBack: () => {
                    actionReport({action: 'read', poids: [data.poid]}).finally(() => {
                        actionReport({action: 'confirm', poids: [data.poid]});
                        passwordModal.current.show();
                    });
                },
                confirmText: '关闭',
                countdown,
                isTouchMaskToClose: false,
                onCountdownChange: (val) => +val === 1 && riskScrollView.current.scrollToEnd({animated: true}),
                title,
            });
        } else {
            actionReport({action: 'confirm', poids: [data.poid]});
            passwordModal.current.show();
        }
    };

    const onSubmit = (password) => {
        const loading = Toast.showLoading('正在转换...');
        doTransfer({password})
            .then((res) => {
                Toast.hide(loading);
                res.message && Toast.show(res.message);
                if (res.code === '000000') jump(res.result.jump_url);
            })
            .finally(() => {
                Toast.hide(loading);
            });
    };

    useEffect(() => {
        getData()
            .then((res) => {
                if (res.code === '000000') {
                    actionReport({action: 'select', poids: [res.result.poid]});
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return Object.keys(data).length > 0 ? (
        <>
            <NavBar
                leftIcon="chevron-left"
                style={{
                    backgroundColor: scrollY > 0 ? '#fff' : 'transparent',
                    position: 'absolute',
                    opacity: scrollY < 50 && scrollY > 0 ? scrollY / 50 : 1,
                }}
                title={scrollY > 0 ? data.title : ''}
            />
            <ScrollView
                bounces={false}
                onScroll={({
                    nativeEvent: {
                        contentOffset: {y},
                    },
                }) => setScrollY(y)}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                {top_img ? <Image source={{uri: top_img}} style={{width: '100%', height: px(290)}} /> : null}
                {desc_img ? <Image source={{uri: desc_img}} style={styles.descImage} /> : null}
                <BottomDesc />
            </ScrollView>
            {button?.text ? (
                <FixedButton
                    agreement={agreement_bottom}
                    containerStyle={{position: 'relative'}}
                    disabled={button.avail === 0}
                    onPress={onTransfer}
                    suffix={agreement_bottom?.agree_text}
                    otherAgreement={agreement}
                    otherParam={{fund_codes: codes, type}}
                    title={button.text}
                />
            ) : null}
            <PasswordModal onDone={onSubmit} ref={passwordModal} />
        </>
    ) : null;
};

const styles = StyleSheet.create({
    subTitle: {
        marginTop: px(2),
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.red,
        textAlign: 'center',
    },
    riskScrollView: {
        marginVertical: Space.marginVertical,
        paddingHorizontal: px(20),
        maxHeight: px(352),
    },
    content: {fontSize: px(13), lineHeight: px(22), color: Colors.descColor},
    descImage: {
        marginTop: px(12),
        marginHorizontal: Space.marginAlign,
        height: px(350),
    },
});

export default withPageLoading(Index, {style: {borderTopWidth: 0, borderBottomWidth: StyleSheet.hairlineWidth}});
