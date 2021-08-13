import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";
import Request from "../_services/Request";
import Toast from "react-native-simple-toast";

class Wallet extends Component {
  state = {
    participantId: "",
    points: "",
    loadingWalletItems: "Loading..",
    walletItem: [],
    width3rd: ""
  };

  async componentDidMount() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    await this.setState({ width3rd: Math.round(screenWidth / 3) });
    const value = await AsyncStorage.getItem("participantId");
    await this.setState({ participantId: value });
    this.getWallet();
  }

  async getWallet() {
    Request.getRequest("wallet/" + this.state.participantId)
      .then(async response => {
        console.log(response);
        if (response.status == 1) {
          await this.setState({ points: response.cashishPoints });
          await this.setState({ walletItem: [] });
          if (this.state.walletItem.length < 1) {
            await this.setState({ loadingWalletItems: "No records" });
          }
        } else {
          Toast.show(response.message, Toast.LONG);
        }
      })
      .catch(error => {
        console.log("ERROR", error);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: "30%",
            flexDirection: "row",
            width: "100%",
            backgroundColor: "#1f427a",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 20
          }}
        >
          <ImageBackground
            style={[
              {
                height: "100%",
                width: "100%",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between"
              }
            ]}
            source={require("../images/walletbg.png")}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image
                style={[
                  {
                    marginTop: Platform.OS === "ios" ? 35 : 10,
                    margin: 10,
                    width: 30,
                    height: 30,
                    resizeMode: "contain"
                  }
                ]}
                source={require("../images/sidemenu.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Notifications")}
            >
              <Image
                style={[
                  {
                    marginTop: Platform.OS === "ios" ? 35 : 10,
                    margin: 10,
                    width: 25,
                    height: 25,
                    resizeMode: "contain"
                  }
                ]}
                source={require("../images/bell.png")}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View
          style={[
            styles.heading,
            { justifyContent: "center", alignItems: "center" }
          ]}
        >
          <Text style={{ fontSize: 17 }}>WALLET</Text>
        </View>
        <ScrollView>
          <View
            style={{
              margin: 10,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 10,
              backgroundColor: "white",
              elevation: 5
            }}
          >
            <View style={{ padding: 10 }}>
              <Image
                style={[
                  {
                    width: 20,
                    height: 20,
                    resizeMode: "contain"
                  }
                ]}
                source={require("../images/cash.png")}
              />
            </View>
            <View>
              <Text style={{ color: "#3A558A" }}>
                {"Cashish Points: " + this.state.points + " pts"}
              </Text>
            </View>
          </View>
          <View
            style={{
              margin: 10,
              padding: 10,
              borderRadius: 10,
              backgroundColor: "white",
              elevation: 5
            }}
          >
            <View
              style={{
                borderColor: "#f5f5f5",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1
              }}
            >
              <View style={{ padding: 10 }}>
                <Image
                  style={[
                    {
                      width: 20,
                      height: 20,
                      resizeMode: "contain"
                    }
                  ]}
                  source={require("../images/available.png")}
                />
              </View>
              <View>
                <Text style={{ color: "#3A558A" }}>Available Items:</Text>
              </View>
            </View>
            <View style={{ paddingBottom: 10 }}>
              {this.state.walletItem.length > 0 ? (
                <FlatGrid
                  itemDimension={Number(this.state.width3rd) - 30}
                  items={this.state.walletItem}
                  spacing={10}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => console.log("walletItem")}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          height: Number(this.state.width3rd) - 30,
                          marginTop: 10,
                          alignItems: "center",
                          borderRadius: 10,
                          backgroundColor: "#fffac4",
                          borderWidth: 1,
                          borderColor: "#e0e0e0"
                        }}
                      >
                        <Image
                          style={[styles.icon]}
                          source={require("../images/banner2.png")}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text>{this.state.loadingWalletItems}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  heading: {
    position: "absolute",
    height: 40,
    width: "75%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    marginTop:
      Platform.OS === "ios"
        ? (Math.round(Dimensions.get("window").height) / 100) * 30 - 20
        : (Math.round(Dimensions.get("window").height) / 100) * 30 - 25
  },
  formItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#d6d6d6",
    paddingVertical: 10
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    justifyContent: "center"
  }
});

export default Wallet;
