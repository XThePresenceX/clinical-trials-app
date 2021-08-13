import React, { Component } from "react";
import { Text, View } from "react-native";
var randomString = require("random-string");
import { NavigationEvents } from "react-navigation";

export class Loading extends Component {
  state = {
    uniqueValue: "",
  };
  forceRemount = () => {
    var x = randomString({ lenght: 6 });
    this.setState({
      uniqueValue: x + 1,
    });
  };
  componentWillMount() {
    setTimeout(() => {
      this.forceRemount();
      console.log("uniqueValue be ", this.state.uniqueValue);
      this.props.navigation.navigate("ActiveStudies", {
        token: this.state.uniqueValue,
      });
    }, 3000);
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }
}

export default Loading;
