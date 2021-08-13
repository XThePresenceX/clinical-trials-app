//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// create a component
import { StackActions, NavigationActions } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

const resetAction = StackActions.popToTop();

class DrawerSideMenu extends Component {
  state = {
    current: "ActiveStudies",
    firstName: "",
    lastName: "",
  };
  async logout() {
    await AsyncStorage.setItem("Signed", "0");
    this.props.navigation.dangerouslyGetParent().navigate("Initial");
  }

  renderMenu() {
    let menuArray = [
      {
        id: 0,
        screen: "ActiveStudies",
        title: "Active Studies",
        logo: <Icon name="home" color="#1f427a" size={20} />,
      },
      {
        id: 1,
        screen: "PreviousStudies",
        title: "Previous Studies",
        logo: <Icon name="copy" color="#1f427a" size={20} />,
      },
      {
        id: 2,
        screen: "FaqScreen",
        title: "FAQ",
        logo: <Icon name="question-circle" color="#1f427a" size={20} />,
      },
      {
        id: 3,
        screen: "SettingsScreen",
        title: "Settings",
        logo: <Icon name="cog" color="#1f427a" size={20} />,
      },
    ];
    return menuArray.map((item) => {
      return (
        <TouchableOpacity
          onPress={this.navigateToScreen(item.screen)}
          key={item.id}
        >
          <View style={styles.itemIcon}>
            {item.logo}
            <Text style={styles.navItemStyle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }
  navigateToScreen = (route) => async () => {
    // if (this.state.current === route) {
    //   this.props.navigation.closeDrawer();
    // } else {
    await this.setState({ current: route });
    // if (this.state.current === "SettingsScreen") {
    //   console.log("here I am");
    //   navigator.navigate(this.state.current);
    // }
    const navigationAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigationAction);
    //}
  };

  async componentDidMount() {
    const firstName = await AsyncStorage.getItem("firstName");
    const lastName = await AsyncStorage.getItem("lastName");
    await this.setState({ firstName: firstName });
    await this.setState({ lastName: lastName });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: "30%",
            flexDirection: "row",
            width: "100%",
            backgroundColor: "#1f427a",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <ImageBackground
            style={[
              {
                height: "100%",
                width: "100%",
                alignItems: "flex-start",
                justifyContent: "space-between",
              },
            ]}
            source={require("../images/SideMenuIcons/sidemenubg.png")}
          >
            <View style={{ alignSelf: "flex-end" }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.closeDrawer()}
              >
                <Image
                  style={[
                    {
                      marginTop: Platform.OS === "ios" ? 35 : 10,
                      margin: 10,
                      width: 30,
                      height: 30,
                      resizeMode: "contain",
                    },
                  ]}
                  source={require("../images/back.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  borderRadius: 40,
                  marginLeft: 10,
                  backgroundColor: "white",
                }}
              >
                <Image
                  style={[
                    {
                      borderRadius: 40,
                      width: 80,
                      height: 80,
                      resizeMode: "contain",
                    },
                  ]}
                  source={require("../images/small-icon.png")}
                />
              </View>
              <Text style={{ color: "white", fontSize: 20, paddingLeft: 5 }}>
                {this.state.firstName} {this.state.lastName}
              </Text>
            </View>
            <View
              style={{
                alignSelf: "flex-end",
                marginBottom: 10,
                marginRight: 10,
              }}
            >
              {/* <TouchableOpacity onPress={()=>this.props.navigation.closeDrawer()}> */}
              <TouchableOpacity onPress={this.navigateToScreen("EditProfile")}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
                    borderRadius: 15,
                    backgroundColor: "#51b8fc",
                  }}
                >
                  <Image
                    style={[
                      {
                        width: 12,
                        height: 12,
                        resizeMode: "contain",
                      },
                    ]}
                    source={require("../images/SideMenuIcons/edit.png")}
                  />
                  <Text
                    style={{ color: "white", fontSize: 12, paddingLeft: 5 }}
                  >
                    EDIT PROFILE
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <ScrollView>
          {this.renderMenu()}
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Logout", "Are you sure you want to logout?", [
                {
                  text: "No",
                  onPress: () => console.log("Canceled"),
                  style: "cancel",
                },
                { text: "Yes", onPress: () => this.logout() },
              ]);
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Icon name="sign-out" color="#1f427a" size={20} />
                <Text style={styles.navItemStyle}>Logout</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemIcon: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  navItemStyle: {
    padding: 15,
    fontSize: 15,
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  fotterContainer: {
    padding: 20,
    backgroundColor: "lightgrey",
  },
});

//make this component available to the app
export default DrawerSideMenu;
