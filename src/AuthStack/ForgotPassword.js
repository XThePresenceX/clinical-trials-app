import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-simple-toast";
import Request from "../_services/Request";
// create a component
class ForgotPassword extends Component {
  state = {
    email: ""
  };

  componentDidMount() {}

  async sendToServer() {
    var emVer = this.validate(this.state.email);
    if (this.state.email === "" || !emVer) {
      if (this.state.email === "") {
        Toast.show("Email can't be empty.", Toast.LONG);
      } else if (!emVer) {
        Toast.show("Please follow proper email format.", Toast.LONG);
      }
    } else {
      Request.postRequest("participant/forgotPassword", {
        email: this.state.email
      })
        .then(async response => {
          Toast.show(response.message, Toast.LONG);
          if (response.status == 1) {
            this.state.email = "";
          }
        })
        .catch(error => {
          console.log("ERROR", error);
        });
    }
  }

  validate = email => {
    // const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    const expression = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return expression.test(String(email).toLowerCase());
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={[
            {
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between"
            }
          ]}
          imageStyle={{ opacity: 0.3 }}
          source={require("../images/loginbg.png")}
        >
          <View style={{ paddingTop: 30 }}>
            <Image
              style={[{ width: 150, height: 150, resizeMode: "contain" }]}
              source={require("../images/logo.png")}
            />
          </View>
          <View style={[styles.container, { width: "100%" }]}>
            <View style={styles.inputContainer}>
              <Image
                style={[{ width: 25, height: 25, resizeMode: "contain" }]}
                source={require("../images/user_name.png")}
              />
              <TextInput
                style={styles.inputs}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                placeholder="Email"
                keyboardType={"email-address"}
                underlineColorAndroid="transparent"
              />
            </View>

            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={() => this.sendToServer()}
            >
              <Text style={{ color: "white" }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Text style={{ padding: 5 }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => this.props.navigation.navigate("Signup")}
            >
              <Text style={{ padding: 5 }}>Register</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity>
              <Text style={{ padding: 5, opacity: 0.5 }}>
                Copyright@cognizance
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    height: 38,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "55%",
    borderRadius: 30,
    marginTop: 20
  },
  loginButton: {
    backgroundColor: "#1f427a"
  },
  inputContainer: {
    padding: 5,
    borderColor: "gray",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    width: "85%",
    height: 45,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 12,
    borderBottomColor: "#FFFFFF",
    flex: 1
  }
});

//make this component available to the app
export default ForgotPassword;
