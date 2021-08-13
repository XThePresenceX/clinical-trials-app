import React, { Component } from "react";
import { firebase as fcm } from "@react-native-firebase/messaging";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ScrollView } from "react-native-gesture-handler";

class PreviousStudies extends Component {
  state = {
    studies: [],
    singleItem: [],
    id: "",
  };
  async componentDidMount() {
    fcm.messaging().onMessage(async (remoteMessage) => {
      console.log("FCM Message Data:", remoteMessage);
      console.log("rcvd");
    });
    const fcmToken = await fcm.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      console.log(fcmToken);
      await this.setState({ fcm: fcmToken });
    } else {
      // user doesn't have a device token yet
      console.warn("token doesnt exist");
    }
    const value = await AsyncStorage.getItem("participantId");
    await this.setState({ id: value });
    console.log(value);
    // await this.getStudies()
    // this.getP() //get all participants
    this.getStudyP();

    var x = [];
    for (let i = 0; i < this.state.studies.length; i++) {
      x[i] = false;
    }
    await this.setState({ singleItem: x });
    console.log(this.state.singleItem);
  }
  async getStudies() {
    // console.log(id)
    const url = "https://cognizancevct.com:3000/database/get_studys"; //url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // 'Authorization':'Basic ' + 'cognizance-api:w85Emt_y)z9TGN[;',
        Authorization: "Basic Y29nbml6YW5jZS1hcGk6dzg1RW10X3kpejlUR05bOw==",
        apiKey: "202k1w6nc-6d0js-4ema-8a3m6-94b2d5osme1b9",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        // Showing response message coming from server after inserting records.
        // resolve(responseJson);
        console.log(responseJson.results);
        // if(responseJson!=='Wrong Credentials!'){
        // await this.setState({studies:responseJson.results})
        // }
        return responseJson;
      })
      .catch((error) => {
        // reject(error);
        console.log(error);

        return error;
      });
  }
  async getP() {
    // console.log(id)
    const url = "https://cognizancevct.com:3000/database/get_participants"; //url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // 'Authorization':'Basic ' + 'cognizance-api:w85Emt_y)z9TGN[;',
        Authorization: "Basic Y29nbml6YW5jZS1hcGk6dzg1RW10X3kpejlUR05bOw==",
        apiKey: "202k1w6nc-6d0js-4ema-8a3m6-94b2d5osme1b9",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        // Showing response message coming from server after inserting records.
        // resolve(responseJson);
        console.log(responseJson);
        console.log(responseJson.results);
        // if(responseJson!=='Wrong Credentials!'){
        // this.props.navigation.navigate('Home')
        // }
        return responseJson;
      })
      .catch((error) => {
        // reject(error);
        console.log(error);

        return error;
      });
  }
  async getStudyP() {
    // console.log(id)
    const url =
      "https://cognizancevct.com:3000/mobile/database/get_previous_studies/" +
      this.state.id; //url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // 'Authorization':'Basic ' + 'cognizance-api:w85Emt_y)z9TGN[;',
        Authorization: "Basic Y29nbml6YW5jZS1hcGk6dzg1RW10X3kpejlUR05bOw==",
        apiKey: "202k1w6nc-6d0js-4ema-8a3m6-94b2d5osme1b9",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        // Showing response message coming from server after inserting records.
        // resolve(responseJson);
        console.log(responseJson.results);
        await this.setState({ studies: responseJson.results });
        // if(responseJson!=='Wrong Credentials!'){
        // }
        return responseJson;
      })
      .catch((error) => {
        // reject(error);
        console.log(error);

        return error;
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
            padding: 10,
            paddingTop: 15,
            justifyContent: "space-between",
          }}
        >
          <ImageBackground
            style={[
              {
                height: "100%",
                width: "100%",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
              },
            ]}
            imageStyle={{ opacity: 0.5 }}
            source={require("../images/homebg.png")}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image
                style={[
                  {
                    marginTop: Platform.OS === "ios" ? 25 : 0,
                    width: 30,
                    height: 30,
                    resizeMode: "contain",
                  },
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
                    marginTop: Platform.OS === "ios" ? 25 : 0,
                    width: 25,
                    height: 25,
                    resizeMode: "contain",
                  },
                ]}
                source={require("../images/bell.png")}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View
          style={[
            styles.heading,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ fontSize: 17 }}>Previous Studies</Text>
        </View>
        <ScrollView>
          <View style={{ padding: 15, marginTop: 20 }}>
            {this.state.studies.map((item, index) => {
              return (
                <View style={[styles.box]}>
                  <TouchableOpacity
                    onPress={async () => {
                      var a = this.state.singleItem;
                      if (a[index] === true) {
                        a[index] = false;
                      } else {
                        for (let i = 0; i < this.state.studies.length; i++) {
                          a[i] = false;
                        }
                        a[index] = true;
                      }
                      await this.setState({ singleItem: a });
                      console.log(this.state.singleItem);
                    }}
                  >
                    <View style={styles.study}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          style={[
                            { width: 30, height: 30, resizeMode: "contain" },
                          ]}
                          source={require("../images/study.png")}
                        />
                        <Text style={{ paddingLeft: 10 }}>{item.name}</Text>
                      </View>
                      {this.state.singleItem[index] ? (
                        <Image
                          style={[
                            { width: 20, height: 20, resizeMode: "contain" },
                          ]}
                          source={require("../images/up.png")}
                        />
                      ) : (
                        <Image
                          style={[
                            { width: 20, height: 20, resizeMode: "contain" },
                          ]}
                          source={require("../images/down.png")}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  {this.state.singleItem[index] ? (
                    <View>
                      <TouchableOpacity
                        onPress={() => console.log(item.consent_text)}
                      >
                        <View style={styles.item}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              style={[
                                {
                                  width: 18,
                                  height: 18,
                                  resizeMode: "contain",
                                },
                              ]}
                              source={require("../images/tick.png")}
                            />
                            <Text style={{ paddingLeft: 10 }}>Consent</Text>
                          </View>
                          <Text style={{ color: "green" }}>Status</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => console.log(item.instructions_text)}
                      >
                        <View style={styles.item}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              style={[
                                {
                                  width: 18,
                                  height: 18,
                                  resizeMode: "contain",
                                },
                              ]}
                              source={require("../images/tick.png")}
                            />
                            <Text style={{ paddingLeft: 10 }}>
                              Instructions
                            </Text>
                          </View>
                          <Text style={{ color: "green" }}>Status</Text>
                        </View>
                      </TouchableOpacity>
                      <View>
                        {JSON.parse(item.forms).map((form) => {
                          return (
                            // <TouchableOpacity onPress={()=>
                            //     this.props.navigation.navigate(
                            //     'Form',
                            //     {
                            //         Study:item.id,
                            //         Form:form.form,
                            //     }
                            //     )
                            //     }>
                            <View style={styles.item}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  style={[
                                    {
                                      width: 18,
                                      height: 18,
                                      resizeMode: "contain",
                                    },
                                  ]}
                                  source={require("../images/tick.png")}
                                />
                                <Text style={{ paddingLeft: 10 }}>
                                  {"Form " + form.form}
                                </Text>
                              </View>
                              <Text style={{ color: "green" }}>Status</Text>
                            </View>
                            // </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
        : (Math.round(Dimensions.get("window").height) / 100) * 30 - 25,
  },
  item: {
    alignItems: "center",
    height: 40,
    padding: 10,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#d6d6d6",
    flexDirection: "row",
  },
  study: {
    alignItems: "center",
    height: 50,
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  box: {
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 7,
    marginBottom: 10,
  },
});

//make this component available to the app
export default PreviousStudies;
