import React, { PureComponent } from "react";
import { Text, Button, View, ScrollView } from "react-native";
import Chart from "react-native-f2chart";
import data from "./data.json";
import { WebView } from "react-native-webview";
// import { Container, Title } from "../components";
import { baseChart, dynamicChart } from "./chartOptions";


class LineChartScreen extends PureComponent {
  state = {
    data
  };
  changeData = num => {
    this.setState({
      data: data.slice(num)
    });
  };

  onChange = tooltip => {
    console.log(tooltip);
  };
  componentDidMount () {
    console.log(this.props)
  }
  render () {
    return (
      <ScrollView>
        <View>
          <Text>基础折线图</Text>
          <View style={{ height: 350 }}>
            <Chart
              onChange={this.onChange}
              initScript={baseChart(data)}
              webView={WebView}
            />
          </View>
        </View>
        <View>
          <Text>动态加载数据</Text>
          <View
            style={{
              flexDirection: "row",
              height: 50,
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 20
            }}
          >
            <Button title="10条" onPress={() => this.changeData(40)} />
            <Button title="20条" onPress={() => this.changeData(30)} />
            <Button title="30条" onPress={() => this.changeData(20)} />
            <Button title="40条" onPress={() => this.changeData(10)} />
            <Button title="全部" onPress={() => this.changeData(0)} />
          </View>
          <View style={{ height: 350 }}>
            <Chart
              data={this.state.data}
              initScript={dynamicChart(data)}
              webView={WebView}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default LineChartScreen;