import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {px} from '~/utils/appUtil';
import Header from './Header';
import PKParams from './PKParams';

const Compare = (props) => {
    const [pageScroll, setPageScroll] = useState(false);
    const [headerScroll, setHeaderScroll] = useState(0);

    return (
        <View style={styles.container}>
            <Header pageScroll={pageScroll} onScroll={(x) => setHeaderScroll(x)} />
            <ScrollView
                style={{flex: 1, marginTop: px(12)}}
                bounces={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={6}
                onScroll={(e) => {
                    setPageScroll(e.nativeEvent.contentOffset.y > 0);
                }}>
                <PKParams headerScroll={headerScroll} />
            </ScrollView>
        </View>
    );
};
export default Compare;

const styles = StyleSheet.create({
    container: {flex: 1},
});
