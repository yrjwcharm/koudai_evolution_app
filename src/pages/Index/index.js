import * as React from 'react';
import { View, Text, Button } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { update } from '../../redux/actions/userInfo'
import Storage from '../../utils/storage'
import { px } from '../../utils/screenUtils'
function HomeScreen (props) {
  const { navigation } = props
  const userInfo = useSelector(store => store.userInfo);
  const dispatch = useDispatch()
  React.useEffect(() => {

    const unsubscribe = navigation.addListener('tabPress', (e) => {
      // Prevent default behavior
      console.log('111')
      // e.preventDefault();

      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>首页</Text>
      <Text style={{ fontSize: 30, color: 'red', fontFamily: 'DINAlternate-Bold' }}>88888%</Text>
      <Text>{userInfo.toJS().name}啊啊啊</Text>
      <AntDesign name="setting" size={18} color={'#00f'} />
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('DetailScreen')}
      />
      <Button
        title="Go to LineChart"
        onPress={() => navigation.navigate('LineChart')}
      />
      <Button
        title="Dispatch"
        onPress={() => dispatch(update({ is_dav: '哈哈哈', name: '眼' }))}
      />
    </View>
  );
}
export default HomeScreen