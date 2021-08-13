//import liraries
import React, { Component } from "react";
import { firebase as fcm } from "@react-native-firebase/messaging";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationEvents } from "react-navigation";
import Request from "../_services/Request";
// create a component
class EditProfile extends Component {
  state = {
    participantId: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    response: ""
  };
  async sendToServer() {
    if (
      this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.phone === "" ||
      this.state.country === "" ||
      this.state.state === "" ||
      this.state.city === ""
    ) {
      if (this.state.city === "") {
        Toast.show("City can't be empty!", Toast.LONG);
      } else if (this.state.firstName === "") {
        Toast.show("Firstname can't be empty!", {
          duration: Toast.LONG
        });
      } else if (this.state.lastName === "") {
        Toast.show("Lastname can't be empty!", {
          duration: Toast.LONG
        });
      } else if (this.state.state === "") {
        Toast.show("State can't be empty!", Toast.LONG);
      } else if (this.state.country === "") {
        Toast.show("Country can't be empty!", {
          duration: Toast.LONG
        });
      } else if (this.state.phone === "") {
        Toast.show("Phone number can't be empty!", {
          duration: Toast.LONG
        });
      }
    } else {
      let profileData = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country
      };
      Request.putRequest(
        "participant/profile/" + this.state.participantId,
        profileData
      )
        .then(async response => {
          Toast.show(response.message, Toast.LONG);
          if (response.status == 1) {
            let participant = response.participant;
            await this.setState({
              participantId: participant.id,
              email: participant.email,
              firstName: participant.firstName,
              lastName: participant.lastName,
              city: participant.city,
              state: participant.state,
              country: participant.country,
              phone: participant.phone
            });
            await this.storeData();
          }
          return response;
        })
        .catch(error => {
          console.log("ERROR", error);
        });
    }
  }

  storeData = async () => {
    try {
      await AsyncStorage.setItem("Signed", "1");
      await AsyncStorage.setItem("participantId", this.state.participantId.toString());
      await AsyncStorage.setItem("email", this.state.email);
      await AsyncStorage.setItem("firstName", this.state.firstName);
      await AsyncStorage.setItem("lastName", this.state.lastName);
      await AsyncStorage.setItem("city", this.state.city);
      await AsyncStorage.setItem("state", this.state.state);
      await AsyncStorage.setItem("country", this.state.country);
      await AsyncStorage.setItem("phone", this.state.phone);
    } catch (e) {
      console.log(e);
    }
  };

  validate = email => {
    // const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    const expression = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return expression.test(String(email).toLowerCase());
  };

  async componentDidMount() {
    const value = await AsyncStorage.getItem("participantId");
    this.setState({ participantId: value });

    const firstName = await AsyncStorage.getItem("firstName");
    this.setState({ firstName: firstName });

    const lastName = await AsyncStorage.getItem("lastName");
    this.setState({ lastName: lastName });

    const city = await AsyncStorage.getItem("city");
    this.setState({ city: city });
    const state = await AsyncStorage.getItem("state");
    this.setState({ state: state });

    const country = await AsyncStorage.getItem("country");
    this.setState({ country: country });
    const phone = await AsyncStorage.getItem("phone");
    this.setState({ phone: phone });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            height: 60,
            backgroundColor: "#1f427a",
            alignItems: "center",
            paddingLeft: 12
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
            <Image
              style={[
                {
                  marginTop: Platform.OS === "ios" ? 25 : 0,
                  width: 30,
                  height: 30,
                  resizeMode: "contain"
                }
              ]}
              source={require("../images/sidemenu.png")}
            />
          </TouchableOpacity>

          <Text style={{ color: "white", fontSize: 17, paddingHorizontal: 55 }}>
            Edit Profile
          </Text>
        </View>
        <ScrollView>
          <View style={{ padding: 8 }}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{ paddingHorizontal: 5, paddingTop: 5, width: "50%" }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 5
                  }}
                >
                  <Image
                    style={[
                      {
                        marginRight: 10,
                        width: 15,
                        height: 15,
                        resizeMode: "contain"
                      }
                    ]}
                    source={require("../images/user_name.png")}
                  />
                  <Text>First Name</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputs}
                    value={this.state.firstName}
                    onChangeText={firstName => {
                      if (firstName.length < 30) this.setState({ firstName });
                      else Toast.show("Enter your first name", Toast.SHORT);
                    }}
                    placeholder="Enter your first name"
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
              <View
                style={{ paddingHorizontal: 5, paddingTop: 5, width: "50%" }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 5
                  }}
                >
                  <Image
                    style={[
                      {
                        marginRight: 10,
                        width: 15,
                        height: 15,
                        resizeMode: "contain"
                      }
                    ]}
                    source={require("../images/user_name.png")}
                  />
                  <Text>Last Name </Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputs}
                    value={this.state.lastName}
                    onChangeText={lastName => {
                      if (lastName.length < 30) this.setState({ lastName });
                      else Toast.show("Enter your last name", Toast.SHORT);
                    }}
                    placeholder="Enter your last name"
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={{ paddingHorizontal: 5, paddingTop: 5, width: "50%" }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 5
                  }}
                >
                  <Image
                    style={[
                      {
                        marginRight: 10,
                        width: 15,
                        height: 15,
                        resizeMode: "contain"
                      }
                    ]}
                    source={require("../images/city.png")}
                  />
                  <Text>City</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputs}
                    value={this.state.city}
                    onChangeText={city => {
                      if (city.length < 30) this.setState({ city });
                      else Toast.show("Enter your city", Toast.SHORT);
                    }}
                    placeholder="Enter your city"
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
              <View
                style={{ paddingHorizontal: 5, paddingTop: 5, width: "50%" }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 5
                  }}
                >
                  <Image
                    style={[
                      {
                        marginRight: 10,
                        width: 15,
                        height: 15,
                        resizeMode: "contain"
                      }
                    ]}
                    source={require("../images/state.png")}
                  />
                  <Text>State</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputs}
                    value={this.state.state}
                    onChangeText={state => {
                      if (state.length < 30) this.setState({ state });
                      else Toast.show("Enter your state", Toast.SHORT);
                    }}
                    placeholder="Enter your state/province"
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
            </View>
            <View style={{ paddingHorizontal: 5, paddingTop: 5 }}>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  paddingVertical: 5
                }}
              >
                <Image
                  style={[
                    {
                      marginRight: 10,
                      width: 15,
                      height: 15,
                      resizeMode: "contain"
                    }
                  ]}
                  source={require("../images/address.png")}
                />
                <Text>Country</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputs}
                  value={this.state.country}
                  onChangeText={country => {
                    if (country.length < 30) this.setState({ country });
                    else Toast.show("Enter your country", Toast.SHORT);
                  }}
                  placeholder="Enter your country"
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <View style={{ paddingHorizontal: 5, paddingTop: 5 }}>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  paddingVertical: 5
                }}
              >
                <Image
                  style={[
                    {
                      marginRight: 10,
                      width: 15,
                      height: 15,
                      resizeMode: "contain"
                    }
                  ]}
                  source={require("../images/phone.png")}
                />
                <Text>Phone</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputs}
                  keyboardType={"number-pad"}
                  value={this.state.phone}
                  onChangeText={phone => {
                    if (phone.length < 30) this.setState({ phone });
                    else Toast.show("Enter your phone number", Toast.SHORT);
                  }}
                  placeholder="Enter your phone number"
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>

            <TouchableOpacity onPress={() => this.sendToServer()}>
              <View
                style={[
                  styles.buttonContainer,
                  styles.loginButton,
                  { marginTop: 15, alignSelf: "center" }
                ]}
              >
                <Text style={{ color: "white" }}>Update</Text>
              </View>
            </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  },
  inputContainer: {
    padding: 5,
    borderColor: "gray",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    width: "100%",
    height: 45,
    flexDirection: "row",
    alignItems: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1
  },
  buttonContainer: {
    height: 38,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "85%",
    borderRadius: 30
  },
  loginButton: {
    backgroundColor: "#1f427a"
  }
});

//make this component available to the app
export default EditProfile;
