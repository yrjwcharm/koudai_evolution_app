import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BlurView } from '@react-native-community/blur';
import { useHeaderHeight } from '@react-navigation/stack';

function HomeScreen ({ navigation }) {
  const headerHeight = useHeaderHeight();
  console.log(headerHeight)
  return (
    <View style={styles.container}>
      {/* <Text style={styles.absolute}>Hi, I am some blurred text</Text> */}
      {/* in terms of positioning and zIndex-ing everything before the BlurView will be blurred */}
      {/* <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      /> */}
      <Text>I'm the non blurred text because I got rendered on top of the BlurView</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
export default HomeScreen