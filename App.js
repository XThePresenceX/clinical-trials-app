import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
} from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { setCustomText, setCustomTextInput } from "react-native-global-props";
import Toast from "react-native-simple-toast";

import Initial from "./src/Initial";

import Login from "./src/AuthStack/Login";
import ForgotPassword from "./src/AuthStack/ForgotPassword";
import Signup from "./src/AuthStack/Signup";

import ActiveStudies from "./src/MainDrawer/ActiveStudies";
import SettingsScreen from "./src/MainDrawer/SettingsScreen";
import PreviousStudies from "./src/MainDrawer/PreviousStudies";
import Reports from "./src/MainDrawer/Reports";
import Wallet from "./src/MainDrawer/Wallet";
import EditProfile from "./src/MainDrawer/EditProfile";
import DrawerSideMenu from "./src/MainDrawer/DrawerSideMenu";
import FormScreen from "./src/MainDrawer/FormScreen";
import Notifications from "./src/MainDrawer/Notifications";
import BarcodeScanner from "./src/MainDrawer/BarcodeScanner";
import SignatureScreen from "./src/MainDrawer/SignatureScreen";
import FaqScreen from "./src/MainDrawer/FaqScreen";
import Camera from "./src/MainDrawer/Camera";
import Loading from "./src/MainDrawer/Loading";

// create a component
class App extends Component {
  componentDidMount() {
    if (Platform.OS === "android") {
      setCustomText(customTextProps);
      setCustomTextInput(customTextProps);
    }
    dynamicLinks().onLink((url) => {
      Toast.show("Your email has been verified. Please login.");
    });
  }
  render() {
    return <AppContainer />;
  }
}

const customTextProps = {
  style: {
    fontFamily: "Nunito SemiBold",
  },
};
const AuthStack = createStackNavigator(
  {
    Login,
    Signup,
    ForgotPassword,
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      header: null,
    },
  }
);

const MainDrawerStack = createStackNavigator(
  {
    ActiveStudies,
    EditProfile,
    PreviousStudies,
    Reports,
    Wallet,
    DrawerSideMenu,
    Notifications,
    FormScreen,
    BarcodeScanner,
    SignatureScreen,
    SettingsScreen,
    Camera,
    FaqScreen,
    Loading,
  },
  {
    initialRouteName: "ActiveStudies",
    headerMode: "none",
  }
);

const MainDrawer = createDrawerNavigator(
  {
    MainDrawerStack: {
      screen: MainDrawerStack,
    },
  },
  {
    initialRouteName: "MainDrawerStack",
    gesturesEnabled: true,
    contentComponent: DrawerSideMenu,
    drawerWidth: Dimensions.get("window").width - 100,
  }
);
const RootSwitch = createSwitchNavigator(
  {
    Initial,
    AuthStack,
    MainDrawer,
  },
  {
    initialRouteName: "Initial",
  }
);

const AppContainer = createAppContainer(RootSwitch);
export default App;
