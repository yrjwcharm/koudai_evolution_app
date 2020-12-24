import * as React from 'react';
import {View, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {px} from '../utils/screenUtils';
const IconWithBadge = function ({badgeCount = 0, size = 25, color = 'red'}) {
    return (
        <View style={{width: size, height: size, margin: 5}}>
            <AntDesign name="home" size={size} color={color} />
            {badgeCount > 0 && (
                <View
                    style={{
                        // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
                        position: 'absolute',
                        right: px(-6),
                        top: px(-3),
                        backgroundColor: 'red',
                        borderRadius: 6,
                        width: px(12),
                        height: px(12),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text style={{color: 'white', fontSize: px(10), fontWeight: 'bold'}}>{badgeCount}</Text>
                </View>
            )}
        </View>
    );
};
export default function HomeIconWithBadge(props) {
    return <IconWithBadge {...props} badgeCount={3} />;
}
