import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Header from './Header';
import IncreaseRevenue from './IncreaseRevenue';
import ReduceRisk from './ReduceRisk';

const ToPortfolio = () => {
    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <IncreaseRevenue />
                <ReduceRisk />
            </ScrollView>
        </View>
    );
};

export default ToPortfolio;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
