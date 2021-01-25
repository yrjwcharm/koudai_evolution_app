/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-21 18:34:43
 * @Description:
 */
import React, {PureComponent} from 'react';
import {Text, Button, View, ScrollView, Alert} from 'react-native';
import Chart from 'react-native-f2chart';
import data from './data.json';
import {WebView} from 'react-native-webview';
// import { Container, Title } from "../components";
import {baseChart, dynamicChart, area, pie} from './chartOptions';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
class LineChartScreen extends PureComponent {
    state = {
        data,
        dataPie: [
            {
                name: '股票类',
                percent: 83.59,
            },
            {
                name: '债券类',
                percent: 2.17,
            },
            {
                name: '现金类',
                percent: 14.24,
            },
        ],
    };
    changeData = (num) => {
        this.setState({
            data: data.slice(num),
        });
    };

    onChange = (tooltip) => {
        console.log(tooltip);
    };
    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e) => {
            // Prevent default behavior of leaving the screen
            e.preventDefault();
            // Prompt the user before leaving the screen
            Alert.alert(
                'Discard changes?',
                'You have unsaved changes. Are you sure to discard them and leave the screen?',
                [
                    {text: "Don't leave", style: 'cancel', onPress: () => {}},
                    {
                        text: 'Discard',
                        style: 'destructive',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => this.props.navigation.dispatch(e.data.action),
                    },
                ]
            );
        });
    }
    render() {
        return (
            <>
                <ScrollView>
                    <View>
                        <Text>基础折线图</Text>
                        {/* <View style={{height: 350}}>
                            <Chart onChange={this.onChange} initScript={baseChart(data)} />
                        </View> */}
                    </View>
                    <View>
                        <Text>动态加载数据</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                height: 50,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginHorizontal: 20,
                            }}>
                            <Button title="10条" onPress={() => this.changeData(40)} />
                            <Button title="20条" onPress={() => this.changeData(30)} />
                            <Button title="30条" onPress={() => this.changeData(20)} />
                            <Button title="40条" onPress={() => this.changeData(10)} />
                            <Button title="全部" onPress={() => this.changeData(0)} />
                        </View>
                        <View style={{height: 350}}>
                            <Chart data={this.state.data} initScript={area(data)} />
                        </View>
                    </View>
                    <View style={{height: 350}}>
                        <Chart initScript={pie(this.state.data)} />
                    </View>
                </ScrollView>
            </>
        );
    }
}

export default LineChartScreen;
