//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
// const resetAction = StackActions.reset({
//   index: 0,
//   actions: [NavigationActions.navigate({ routeName: "RootStack" })]
// });
// const resetActionOk = StackActions.reset({
//   index: 0,
//   actions: [NavigationActions.navigate({ routeName: "MainDrawer" })]
// });

console.disableYellowBox = true;
// create a component
class Initial extends Component {
  async componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      async payload => {
        await this.getData();
      }
    );
  }

  async getData() {
    const value = await AsyncStorage.getItem("Signed");
    if (value === "1") {
      this.props.navigation.navigate("MainDrawer");
    } else {
      this.props.navigation.navigate("AuthStack");
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

//make this component available to the app
export default Initial;
