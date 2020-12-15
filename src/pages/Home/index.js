import * as React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
function HomeScreen ({ navigation }) {

  return (
    <ScrollView>
      <View style={{ height: 2000, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20 }}>Home Scree111n</Text>
        <Text style={{ fontSize: 30, color: 'red', fontFamily: 'DINAlternate-Bold' }}>88888%</Text>
        <AntDesign name="setting" size={18} color={'#00f'} />
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('DetailScreen')}
        />
      </View>
    </ScrollView>
  );
}
export default HomeScreen