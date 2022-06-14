import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {BottomModal} from '../../../components/Modal';

const PKCollectUserInterest = () => {
    const modalRef = useRef(null);

    useEffect(() => {
        modalRef.current?.show();
    }, []);

    return (
        <View style={styles.container}>
            <BottomModal ref={(el) => (modalRef.current = el)} title={'选择你'}>
                <Text>123</Text>
            </BottomModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
});
export default PKCollectUserInterest;
