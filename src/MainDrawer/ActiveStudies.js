import React, { Component } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Platform,
  RefreshControl,
  Linking,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationEvents } from "react-navigation";
import { firebase } from "@react-native-firebase/messaging";
import Request from "../_services/Request";
import Toast from "react-native-simple-toast";

class ActiveStudies extends Component {
  state = {
    token: "",
    company: "",
    location: "",
    studies: [],
    tally: 0,
    ptally: 0,
    uniqueValue: 1,
  };

  async componentDidMount() {
    const participantId = await AsyncStorage.getItem("id");
    await this.setState({
      participantId,
    });
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      await this.setState({ fcm: fcmToken });
      console.log(fcmToken);
      Request.postRequest("participant/registerDevice", {
        participantId: this.state.participantId,
        notificationToken: fcmToken,
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log("ERROR", error);
        });
    } else {
      console.warn("token doesnt exist");
    }

    await this.getActiveStudies(this.state.participantId);
    await this.getTally(this.state.participantId);
    this.state.ptally = this.state.tally;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.company !== this.props.navigation.getParam("company", " ")) {
      this.setState({
        company: this.props.navigation.getParam("company", " "),
        location: this.props.navigation.getParam("location", " "),
      });
    }
    if (this.state.token !== this.props.navigation.getParam("token", " ")) {
      console.log(this.props.navigation.getParam("token", " "));
      console.log("updatemeup");
      this.setState({
        token: this.props.navigation.getParam("token", " "),
      });
      this._onRefresh();
      setTimeout(() => this._onRefresh(), 3000);
    }
  }

  async getTally(participantId) {
    //console.log("THIS BE LIKE");
    Request.getRequest(`gettally/${participantId}`)
      .then(async (response) => {
        if (response.status == 1) {
          this.state.ptally = this.state.tally;
          await this.setState({ tally: response.tally });
          // if (this.state.ptally != this.state.tally) {Alert.alert("", "You have completed this test", [
          //     { text: "OK", onPress: () => console.log("alert closed") },
          //   ]);
          //
          //   ptally++;
          //console.log("THIS BE LIKE", response);
        } else {
          Toast.show(response.message, Toast.LONG);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  }

  async getActiveStudies(participantId) {
    Request.getRequest(`studies/active/${participantId}`)
      .then(async (response) => {
        if (response.status == 1) {
          await this.setState({ studies: response.studies });
        } else {
          Toast.show(response.message, Toast.LONG);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  }

  _onRefresh = () => {
    this.getTally(this.state.participantId);
    this.setState({ refreshing: true, studies: [] });
    this.getActiveStudies(this.state.participantId).then(() => {
      this.setState({ refreshing: false });
    });
  };

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
              onPress={() => {
                console.log("props be ", this.props);
                this.props.navigation.openDrawer();
              }}
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

          <View
            style={[
              styles.heading,
              {
                bottom: "88%",
                left: "15%",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text style={{ fontSize: 17 }}>
              Tests Completed: {this.state.tally}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.heading,
            {
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ fontSize: 17 }}>Active Studies</Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={{ padding: 15, marginTop: 20 }}>
            {this.state.studies.length > 0 ? (
              this.state.studies.map((item, index) => {
                return (
                  <Study
                    company={this.state.company}
                    location={this.state.location}
                    study={item}
                    participantId={this.state.participantId}
                    key={index}
                    navigation={this.props.navigation}
                  />
                );
              })
            ) : (
              <View>
                <Text>
                  If you do not see any studies here, please wait for a few
                  minutes for a coordinator to add you to the system. If you
                  receive a notification that you've been added to a study, try
                  pulling down to refresh. Check out the FAQ for more details.
                </Text>
                <Text>
                  If you still do not see any studies after an hour please
                  contact{" "}
                  <Text
                    onPress={() => Linking.openURL(`mailto:mia@audaciabio.com`)}
                  >
                    mia@audaciabio.com
                  </Text>
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

// Individual Study components
class Study extends Component {
  state = {
    toggled: false,
    forms: [],
    studyId: "",
    participantId: "",
  };
  props = {
    company: "",
    location: "",
    study: Object,
    participantId: Number,
    key: Number,
    navigation: Object,
  };

  async componentDidMount() {
    await this.getFormsForStudy(this.props.study.id, this.props.participantId);
    this.setState({ studyId: this.props.study.id });
    this.setState({ participantId: this.props.participantId });
  }

  async getFormsForStudy(studyId, participantId) {
    console.log(studyId, participantId);
    Request.getRequest(`studies/${studyId}/participants/${participantId}/forms`)
      .then(async (response) => {
        console.log(response);
        if (response.status === 1) {
          console.log(response.forms);
          await this.setState({ forms: response.forms });
        } else {
          Toast.show(response.message, Toast.LONG);
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error, undefined, 4));
      });
  }

  async resetMe() {
    console.log("THIS BE LIKE", this.state.studyId, this.state.participantId);
    const studyId = this.state.studyId;
    const participantId = this.state.participantId;
    Request.postRequest(
      `studies/${studyId}/participants/${participantId}/reset`
    )
      .then(async (response) => {
        console.log("Study is now resetted");
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  }

  createTwoButtonAlert = () =>
    // Alert.alert(
    //   "Reset Study: " + this.props.study.studyTitle + "?"
    Alert.alert(
      "Reset this study? ",
      this.props.study.studyTitle,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this.resetMe();
            Alert.alert("Pull down to Refresh");
          },
        },
      ],
      { cancelable: false }
    );

  render() {
    return (
      <View style={[styles.box]} key={this.props.key}>
        <View style={styles.study}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={[{ width: 30, height: 30, resizeMode: "contain" }]}
              source={require("../images/study.png")}
            />
            <Text
              style={{ fontWeight: "bold", color: "#1f427a", paddingLeft: 10 }}
            >
              {this.props.study.studyTitle}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <Button
              title=" Reset "
              onPress={() => {
                this.createTwoButtonAlert();
              }}
            />
          </View>
        </View>

        <View>
          {this.state.forms.map((form) => {
            return (
              <TouchableOpacity
                key={form.id}
                onPress={() => {
                  if (
                    this.props.company == " " ||
                    this.props.company == "" ||
                    this.props.location == " " ||
                    this.props.location == ""
                  ) {
                    Alert.alert(
                      "Location/Organization Not found",
                      "Please set the organization and location from settings",
                      [
                        {
                          text: "SET UP NOW",
                          onPress: () =>
                            this.props.navigation.navigate("SettingsScreen"),
                        },
                        {
                          text: "CANCEL",
                          onPress: () => console.log("alert closed"),
                        },
                      ]
                    );
                  } else if (form.status === "WAITING") {
                    Toast.show(
                      "Please complete the pending form prior to this form."
                    );
                  } else if (form.status === "COMPLETED") {
                    Toast.show("This form has been completed.");
                  } else if (form.status === "REPLIED") {
                    Toast.show("This form has been filled.");
                  } else {
                    //console.log("elSE", this.props);
                    this.props.navigation.navigate("FormScreen", {
                      participantId: this.props.participantId,
                      studyId: this.props.study.id,
                      studyTitle: this.props.study.studyTitle,
                      formId: form.id,
                      formTitle: form.formTitle,
                      company: this.props.company,
                      location: this.props.location,
                    });
                  }
                }}
              >
                <View style={styles.item}>
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>
                    {form.formTitle}
                  </Text>
                  <FormStatus status={form.status} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

//COMPLETED PENDING AND REJECTED STATUS DISPLAYS
class FormStatus extends Component {
  props = {
    status: String,
  };
  render() {
    return (
      <View>
        {this.props.status === "COMPLETED" ||
        this.props.status === "REPLIED" ? (
          <Text style={{ color: "green" }}>{this.props.status}</Text>
        ) : (
          <Text style={{ color: "red" }}>{this.props.status}</Text>
        )}
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
    flex: 1,
    alignItems: "center",
    height: 60,
    padding: 10,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#d6d6d6",
    flexDirection: "row",
  },
  study: {
    alignItems: "center",
    color: "#fff",
    height: 70,
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
export default ActiveStudies;
