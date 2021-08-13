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
import Moment from "moment";
import { NavigationEvents } from "react-navigation";
import Toast from "react-native-simple-toast";
import Request from "../_services/Request";
import moment from "moment";
class Notifications extends Component {
  state = {
    id: "",
    studyid: "",
    formid: "",
    notifications: []
  };
  async getNotifications() {
    const participantId = await AsyncStorage.getItem("id");
    if (participantId) {
      Request.getRequest(`notifications?participantId=${participantId}`)
        .then(notifications => {
          this.setState({ notifications });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  async componentDidMount() {
    await this.getNotifications();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerImageContainer}>
          <ImageBackground
            style={styles.headerImage}
            source={require("../images/banner.png")}
          >
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                style={styles.backButton}
                source={require("../images/back.png")}
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
          <Text style={{ fontSize: 17 }}>NOTIFICATIONS</Text>
        </View>

        <ScrollView>
          <View style={{ padding: 10, marginTop: 20 }}>
            {this.state.notifications.map((item, index) => {
              return (
                <TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 15
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                        borderRadius: 20,
                        backgroundColor: "#d1daf0"
                      }}
                    >
                      <Image
                        style={[
                          {
                            width: 20,
                            height: 20,
                            resizeMode: "contain"
                          }
                        ]}
                        source={require("../images/notif.png")}
                      />
                    </View>
                    <View style={{ width: "75%" }}>
                      <View>
                        <Text>{item.notificationDescription}</Text>
                      </View>
                      <View style={{ flexDirection: "row", paddingTop: 5 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "45%"
                          }}
                        >
                          <View>
                            <Image
                              style={[
                                {
                                  width: 10,
                                  height: 10,
                                  resizeMode: "contain"
                                }
                              ]}
                              source={require("../images/time.png")}
                            />
                          </View>
                          <View>
                            <Text
                              style={{
                                fontSize: 10,
                                opacity: 0.6,
                                paddingLeft: 5
                              }}
                            >
                              {moment(item.createdAt).format("YYYY-MM-DD HH:mm")}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View>
                            <Image
                              style={[
                                {
                                  width: 10,
                                  height: 10,
                                  resizeMode: "contain"
                                }
                              ]}
                              source={require("../images/received.png")}
                            />
                          </View>
                          <View>
                            <Text
                              style={{
                                fontSize: 10,
                                opacity: 0.6,
                                paddingLeft: 5
                              }}
                            >
                              {item.title}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <View
                        style={
                          item.is_read === 0
                            ? {
                                height: 10,
                                width: 10,
                                backgroundColor: "green",
                                borderRadius: 5
                              }
                            : {
                                height: 10,
                                width: 10,
                                backgroundColor: "#d1daf0",
                                borderRadius: 5
                              }
                        }
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        {/* <NavigationEvents
                  onWillFocus={() => this.getNotf()}
                /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerImageContainer: {
    height: "30%",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#1f427a",
    alignItems: "flex-start",
    padding: 10,
    paddingTop: 15,
    justifyContent: "space-between",
    marginBottom: 20
  },
  headerImage: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  backButton: {
    marginTop: Platform.OS === "ios" ? 25 : 0,
    width: 30,
    height: 30,
    resizeMode: "contain"
  },
  heading: {
    position: "absolute",
    height: 40,
    width: "75%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
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
  }
});

export default Notifications;
