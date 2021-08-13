//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Picker,
  ScrollView,
  AsyncStorage,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "react-native-elements";
import { Formik, ErrorMessage } from "formik";
import makeInput, {
  withFormikControl,
  handleTextInput,
  withPickerValues,
  withInputTypeProps,
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm,
} from "react-native-formik";
import { compose } from "recompose";
import Toast from "react-native-simple-toast";
import Request from "../_services/Request";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import * as Yup from "yup";
import FormikSelect2 from "../FormComponents/FormikSelect2";

const FormikTextInput = compose(
  withFormikControl,
  handleTextInput,
  withInputTypeProps,
  withNextInputAutoFocusInput
)(TextInput);
const FormikDatePicker = compose(
  withFormikControl,
  withNextInputAutoFocusInput
)(DatePicker);
const Form = withNextInputAutoFocusForm(ScrollView);

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string().required("Please enter your last name"),
  city: Yup.string().required("Please enter your city name"),
  state: Yup.string().required("Please choose your state"),
  country: Yup.string().required("Please choose your country"),
  birthdate: Yup.date().required("Please choose your birthdate"),
  gender: Yup.string().required(),
  phone: Yup.number().required("Please enter a phone number"),
  organization: Yup.string().required("Please enter your organization's name"),
  email: Yup.string()
    .required("Please enter an email")
    .email("Please enter a valid email"),
  password: Yup.string()
    .required("Please enter a password")
    .min(2, "Please enter a valid, secure password"),
  cpassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

// create a component
class SignupScreen extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "ON",
    country: "CA",
    phone: "",
    birthdate: new Date(),
    gender: "male",
    password: "",
    cpassword: "",
    organization: "",
    showDatePicker: false,
    birthdateSet: false,
  };
  getInitialValues() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      state: "ON",
      country: "CA",
      phone: "",
      birthdate: new Date(),
      gender: "male",
      password: "",
      cpassword: "",
      organization: "",
    };
  }
  async sendToServer(data) {
    let signupData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      city: this.state.city,
      state: this.state.state,
      country: this.state.country,
      phone: this.state.phone,
      birthdate: this.state.birthdate,
      gender: this.state.gender,
      password: this.state.password,
      cpassword: this.state.cpassword,
      organization: this.state.organization,
      status: "Joined",
    };
    console.log("this is: ", signupData);
    signupData.birthdate = moment(signupData.birthdate).format("YYYY-MM-DD");
    Request.postRequest("participant/signup", signupData)
      .then(async (response) => {
        console.log(response);
        if (response.status === "Joined") {
          Toast.show(
            "Thank you for your info. We will review and make a decision shortly.",
            Toast.LONG
          );
          this.props.navigation.navigate("Login");
        } else {
          Toast.show(response.message, Toast.LONG);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  }
  getYears = () => {
    const current = new Date().getFullYear();
    const min = current - 70;
    const yearArr = [];
    for (let i = current; i > min; i--) {
      yearArr.push(i.toString());
    }
    return yearArr;
  };
  getRegions = (country) => {
    const regions = {
      CA: [
        "AB",
        "BC",
        "MB",
        "NB",
        "NL",
        "NT",
        "NS",
        "NU",
        "ON",
        "PE",
        "QC",
        "SK",
        "YT",
      ],
      USA: [
        "AK",
        "AL",
        "AR",
        "AS",
        "AZ",
        "CA",
        "CO",
        "CT",
        "DC",
        "DE",
        "FL",
        "GA",
        "GU",
        "HI",
        "IA",
        "ID",
        "IL",
        "IN",
        "KS",
        "KY",
        "LA",
        "MA",
        "MD",
        "ME",
        "MI",
        "MN",
        "MO",
        "MS",
        "MT",
        "NC",
        "ND",
        "NE",
        "NH",
        "NJ",
        "NM",
        "NV",
        "NY",
        "OH",
        "OK",
        "OR",
        "PA",
        "PR",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VA",
        "VI",
        "VT",
        "WA",
        "WI",
        "WV",
        "WY",
      ],
    };
    //console.log(country);
    return regions[country].map((region) => {
      return { label: region, value: region };
    });
  };

  validate = () => {
    text = this.state.email;
    console.log("test email be ", text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      Alert.alert("Invalid Email", "Please try again");
      return false;
    } else {
      this.setState({ email: text });
      console.log("Email is Correct");
      return true;
    }
  };

  mobilevalidate() {
    text = this.state.phone;
    console.log("text phone be ", text);
    const reg = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    if (reg.test(text) === false) {
      Alert.alert("Invalid Phone Number", "Please try again");
      return false;
    } else {
      this.setState({
        mobilevalidate: true,
        telephone: text,
        message: "",
      });
      return true;
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              style={{ width: 50, height: 30, resizeMode: "contain" }}
              source={require("../images/back.png")}
            />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 17 }}>Sign Up</Text>
        </View>
        <Formik
          initialValues={this.getInitialValues()}
          onSubmit={(values) => console.log(values)}
          validationSchema={validationSchema}
        >
          {({
            errors,
            touched,
            values,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form style={{ padding: 8 }}>
              <View style={{ paddingBottom: 30 }}>
                <View style={styles.formRow}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/user_name.png")}
                      />
                      <Text>First Name</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <FormikTextInput
                        name="firstName"
                        style={styles.inputs}
                        returnKeyType="next"
                        placeholder="Enter your first name"
                        underlineColorAndroid="transparent"
                        value={this.state.firstName}
                        onChangeText={(firstName) =>
                          this.setState({ firstName })
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/user_name.png")}
                      />
                      <Text>Last Name</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <FormikTextInput
                        name="lastName"
                        style={styles.inputs}
                        returnKeyType="next"
                        placeholder="Enter your last name"
                        underlineColorAndroid="transparent"
                        value={this.state.lastName}
                        onChangeText={(lastName) => this.setState({ lastName })}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/venus-mars-solid.png")}
                      />
                      <Text>Gender</Text>
                    </View>
                    <FormikSelect2
                      name="gender"
                      options={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        {
                          label: "Non-Binary/Gender-Queer",
                          value: "non-binary/gender-queer",
                        },
                        { label: "Other", value: "other" },
                      ]}
                      value={this.state.gender}
                      setFieldValue={(gender) => this.setState({ gender })}
                    />
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/birthday-cake-solid.png")}
                      />
                      <Text>Date of Birth</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState((previousState) => ({
                            showDatePicker: !previousState.showDatePicker,
                          }))
                        }
                        style={{ paddingHorizontal: 5 }}
                      >
                        <Text>
                          {values.birthdate === new Date()
                            ? "Tap again to close"
                            : moment(values.birthdate).format("MMM DD, YYYY")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {this.state.showDatePicker && (
                  <FormikDatePicker
                    name="birthdate"
                    mode="date"
                    date={values.birthdate}
                    style={styles.datepicker}
                    //value={this.state.birthdate}
                    onDateChange={(birthdate) => {
                      console.log(birthdate);
                      values.birthdate = moment(birthdate).format(
                        "MMM DD, YYYY"
                      );
                      this.setState({ birthdate: values.birthdate });
                    }}
                  />
                )}

                <View style={styles.formRow}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/address.png")}
                      />
                      <Text>Country</Text>
                    </View>
                    <FormikSelect2
                      name="country"
                      placeholder="Select a country"
                      options={[
                        { label: "CA", value: "CA" },
                        { label: "USA", value: "USA" },
                      ]}
                      value={this.state.country}
                      setFieldValue={(country) => this.setState({ country })}
                    />
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/state.png")}
                      />
                      <Text>Province/State</Text>
                    </View>
                    <FormikSelect2
                      name="state"
                      options={this.getRegions(values.country)}
                      value={this.state.state}
                      setFieldValue={(state) => this.setState({ state })}
                    />
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/city.png")}
                      />
                      <Text>City</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <FormikTextInput
                        name="city"
                        returnKeyType="next"
                        style={styles.inputs}
                        placeholder="Enter your city"
                        underlineColorAndroid="transparent"
                        value={this.state.city}
                        onChangeText={(city) => this.setState({ city })}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/phone.png")}
                      />
                      <Text>Phone</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <FormikTextInput
                        name="phone"
                        style={styles.inputs}
                        type="digits"
                        returnKeyType="next"
                        placeholder="Enter your phone number"
                        underlineColorAndroid="transparent"
                        value={this.state.phone}
                        onChangeText={(phone) => this.setState({ phone })}
                      />
                    </View>
                    <Text>
                      <ErrorMessage name="phone" />
                    </Text>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/email.png")}
                      />
                      <Text>Organization</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <FormikTextInput
                        name="organization"
                        style={styles.inputs}
                        returnKeyType="next"
                        placeholder="Enter your organization's name"
                        underlineColorAndroid="transparent"
                        value={this.state.organization}
                        onChangeText={(organization) =>
                          this.setState({ organization })
                        }
                      />
                    </View>
                    <Text>
                      <ErrorMessage name="organization" />
                    </Text>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/email.png")}
                      />
                      <Text>Email</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <FormikTextInput
                        name="email"
                        style={styles.inputs}
                        type="email"
                        returnKeyType="next"
                        placeholder="Enter your email"
                        underlineColorAndroid="transparent"
                        onChangeText={(email) => {
                          this.setState({ email });
                        }}
                        value={this.state.email}
                      />
                    </View>
                    <Text>
                      <ErrorMessage name="email" />
                    </Text>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/confirm_password.png")}
                      />
                      <Text>Password</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <FormikTextInput
                        style={styles.inputs}
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        underlineColorAndroid="transparent"
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                      />
                    </View>
                    <Text>
                      <ErrorMessage name="password" />
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldHeader}>
                      <Image
                        style={styles.fieldIcon}
                        source={require("../images/confirm_password.png")}
                      />
                      <Text>Confirm</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <FormikTextInput
                        style={styles.inputs}
                        name="cpassword"
                        type="password"
                        placeholder="Confirm password"
                        underlineColorAndroid="transparent"
                        value={this.state.cpassword}
                        onChangeText={(cpassword) =>
                          this.setState({ cpassword })
                        }
                      />
                    </View>
                    <Text>
                      <ErrorMessage name="cpassword" />
                    </Text>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={styles.fieldContainer}>
                    <Button
                      buttonStyle={styles.loginButton}
                      title="Register"
                      onPress={() => {
                        if (this.validate()) {
                          console.log("First layer");
                          if (this.mobilevalidate()) {
                            console.log("Second Layer");
                            this.sendToServer();
                          }
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            </Form>
          )}
        </Formik>
      </SafeAreaView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    backgroundColor: "#1f427a",
    alignItems: "center",
    paddingLeft: 12,
  },
  formRow: {
    flex: 1,
    flexDirection: "row",
  },
  fieldContainer: {
    flex: 1,
    padding: 5,
  },
  inputContainer: {
    flex: 1,
    padding: 5,
    borderColor: "gray",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  inputs: {
    marginLeft: 10,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  fieldHeader: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 5,
  },
  fieldIcon: {
    marginRight: 10,
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#1f427a",
  },
  datepicker: {
    alignSelf: "center",
  },
});

//make this component available to the app
export default SignupScreen;
