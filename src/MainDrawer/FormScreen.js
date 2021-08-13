import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  ScrollView,
  TextInput,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { Button } from "react-native-elements";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import Request from "../_services/Request";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";
import { Formik } from "formik";
import {
  handleTextInput,
  withInputTypeProps,
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm,
} from "react-native-formik";
import makeInput, {
  withFormikControl,
  withPickerValues,
} from "react-native-formik";
import { compose } from "recompose";
import DatePicker from "react-native-date-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import TextTicker from "react-native-text-ticker";
import FormikSelect from "../FormComponents/FormikSelect";
import FormikRadioGroup from "../FormComponents/FormikRadioGroup";
import FormikMultiSelect from "../FormComponents/FormikMultiSelect";
import FormikBarCode from "../FormComponents/FormikBarcode";
import FormikSignature from "../FormComponents/FormikSignature";
import FaqScreen from "./FaqScreen";
import FormikCamera from "../FormComponents/FormikCamera";

const FormikTextInput = compose(
  handleTextInput,
  withInputTypeProps,
  withNextInputAutoFocusInput
)(TextInput);
const FormikDatePicker = compose(
  withFormikControl,
  withNextInputAutoFocusInput
)(DatePicker);
const Form = withNextInputAutoFocusForm(View);

export class FormScreen extends Component {
  state = {
    company: "",
    phone: "",
    email: "",
    birthdate: "",
    swabdate: "",
    hiddenDate: "",
    location: "",
    participantId: "",
    studyId: "",
    formId: "",
    formTitle: "",
    repeatFormNumber: "",
    questions: [],
    questionIds: [],
    responsechecker: [],
    properQuestion: "",
    skippedDate: false,
    skippedDate2: false,
    faqModalVisible: false,
  };

  async componentDidMount() {
    const participantId = await AsyncStorage.getItem("id");

    await this.setState({
      participantId,
      company: this.props.navigation.getParam("company", " "),
      location: this.props.navigation.getParam("location", " "),
      studyId: this.props.navigation.getParam("studyId", " "),
      studyTitle: this.props.navigation.getParam("studyTitle", " "),
      formId: this.props.navigation.getParam("formId", " "),
      formTitle: this.props.navigation.getParam("formTitle", " "),
    });

    //this.state.birthdate = moment(this.state.birthdate).format("YYYY-MM-DD");
    console.log("In formScreen", this.state);

    this.getFormQuestions();
    this.getRepeatFormNum();
  }

  async getRepeatFormNum() {
    //console.log("FormID is ", this.state.formId);
    Request.getRequest(`getRepeatNum/${this.state.formId}`).then(
      async (response) => {
        //console.log("Response is ", response);
        if (response.status == 1) {
          await this.setState({ repeatFormNumber: response.repeatFormNumber });
          //console.log("Repeat Num is ", this.state.repeatFormNumber);
        } else {
          Toast.show(response.message, Toast.LONG);
        }
      }
    );
  }

  async getFormQuestions() {
    let count = 0;
    Request.getRequest(
      `form/questions?participantId=${this.state.participantId}&formId=${
        this.state.formId
      }`
    )
      .then(async (response) => {
        if (response.status == 1) {
          await this.setState({ questions: response.questions });
          for (i = 0; i < this.state.questions.length; i++) {
            if (
              this.state.questions[i].inputType === "READ_ONLY" ||
              !response.questions[i].answerRequired
            ) {
              console.log("answer reqqqq: ", response.questions[i]);
              count++;
            }
          }
          console.log("count is", count);
          console.log("Lenght is", this.state.questions.length);
          this.setState({
            properQuestion: this.state.questions.length - count, //To make sure all question are answered
          });
          // await this.setState({
          //   questionIds: this.state.questions[0].questionId,
          // });
          // console.log("quesID are", this.state.questionIds);
          this.getInitialValues();
        } else {
          Toast.show(response.message, Toast.LONG);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  }

  getInitialValues() {
    const initialValues = {};
    this.state.questions.map((question) => {
      // eslint-disable-next-line prettier/prettier
      const value = ["TEXT", "LARGE_TEXT", "SIGNATURE", "PICTURE"].includes(
        question.inputType
      )
        ? " "
        : ["NUMBER", "BARCODE"].includes(question.inputType)
        ? 0
        : ["SELECT", "MULTI_SELECT", "RADIO"].includes(question.inputType)
        ? question.options[0].optionName
        : null;
      initialValues[question.questionId] = value;
    });
    return initialValues;
  }

  submitForm(data) {
    let datacount = 0;
    //console.log("proper questions be", this.state.properQuestion);
    console.log("Data is", data);
    const formResponse = [];
    for (let key in data) {
      //console.log("key be", key);
      datacount++;
      let answer;
      if (Array.isArray(data[key])) {
        answer = data[key].map((answer) => answer.value);
        //console.log("answer be", answer);
      } else {
        answer = data[key];
        //console.log("answer2 be", answer);
      }
      formResponse.push({ id: key, answer });
    }

    formResponse.push({
      id: -1,
      answer: { company: this.state.company, location: this.state.location },
    });

    console.log("In formScreen after push", formResponse);

    Alert.alert("Submit Form", "Are you sure to save this form?", [
      { text: "No", onPress: () => {} },
      {
        text: "Yes",
        onPress: () => {
          if (this.state.skippedDate) {
            ++datacount;
          }
          console.log("properquestion ", this.state.properQuestion);
          console.log("datacount", datacount);
          if (this.state.properQuestion > datacount) {
            Alert.alert("", "All Questions must be answered", [
              { text: "OK", onPress: () => console.log("alert closed") },
            ]);
          } else {
            Request.postRequest(
              `participant/${this.state.participantId}/study/${
                this.state.studyId
              }/form/${this.state.formId}/response`,
              formResponse
            )
              .then(async (response) => {
                //console.log("RepeatNum is ", this.state.repeatFormNumber);
                if (this.state.repeatFormNumber >= 0) {
                  Alert.alert("Test Complete!", "Swipe down to refresh", [
                    {
                      text: "OK",
                      onPress: () => console.log("alert closed"),
                    },
                  ]);
                }
                Toast.show(
                  "Your response has been recorded. Swipe down to refresh."
                );
                this.props.navigation.navigate("Loading", {});
              })
              .catch((error) => {
                Toast.show("There was an error recording your response.");
              });
          }
        },
      },
    ]);
  }

  setModalVisible(visible) {
    this.setState({ faqModalVisible: visible });
  }

  skippedDateTogglerHandler = () => {
    this.setState((prevState) => ({
      skippedDate: !prevState.skippedDate,
    }));
  };

  skippedDateTogglerHandler2 = () => {
    this.setState((prevState) => ({
      skippedDate2: !prevState.skippedDate,
    }));
  };

  validate = () => {
    text = this.state.email;
    //console.log("test email be ", text);
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
    //console.log("text phone be ", text);
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
    var emailResponseRemember = [];
    var phoneResponseRemember = [];
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.navigationHeader}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              style={styles.backButton}
              source={require("../images/back.png")}
            />
          </TouchableOpacity>
          <View style={{ flex: 5, marginRight: 5 }}>
            <TextTicker style={{ color: "white", fontSize: 20 }}>
              {`${this.state.studyTitle}: ${this.state.formTitle}`}
            </TextTicker>
          </View>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              this.props.navigation.navigate("FaqScreen");
            }}
          >
            <Icon name="question-circle" color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              const subject = encodeURI(
                `Query regarding ${this.state.formTitle} in study ${
                  this.state.studyTitle
                }`
              );
              Linking.openURL(`mailto:mia@audaciabio.com?subject=${subject}`);
            }}
          >
            <Icon name="envelope" color="#fff" size={20} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Formik
            initialValues={this.getInitialValues()}
            onSubmit={(data) => {
              emailFlag = true;
              phoneFlag = true;

              for (i = 0; i < emailResponseRemember.length; i++) {
                let xyz = emailResponseRemember[i];
                // console.log("xyz is ", xyz);
                // console.log("XXXXEMAILDATA BE", data[xyz]);
                this.setState({ email: data[xyz] });
                if (!this.validate()) {
                  emailFlag = false;
                }
              }
              for (i = 0; i < phoneResponseRemember.length; i++) {
                let xxxyz = phoneResponseRemember[i];
                // console.log("xxxyz is ", xxxyz);
                // console.log("XXXXPHONEDATA BE", data[xxxyz]);
                this.setState({ phone: data[xxxyz] });
                if (!this.mobilevalidate()) {
                  phoneFlag = false;
                }
              }
              // console.log("email flag ", emailFlag);
              // console.log("phone flag ", phoneFlag);
              if (emailFlag && phoneFlag) {
                // console.log("email flag ", emailFlag);
                // console.log("phone flag ", phoneFlag);
                this.submitForm(data);
              }
            }}
          >
            {({ values, handleChange, handleBlur, handleSubmit }) => (
              <Form>
                {this.state.questions.map((question, index) => {
                  //console.log("questions be", question);
                  if (
                    question.inputType === "EMAIL" &&
                    !(emailResponseRemember.indexOf(question.questionId) > -1)
                  ) {
                    emailResponseRemember.push(question.questionId);
                  }
                  if (
                    question.inputType === "PHONE" &&
                    !(phoneResponseRemember.indexOf(question.questionId) > -1)
                  ) {
                    phoneResponseRemember.push(question.questionId);
                  }
                  // console.log("Email Array is", emailResponseRemember);
                  // console.log("Phone Array is", phoneResponseRemember);
                  return (
                    <View key={index} style={styles.formItem}>
                      <Text style={styles.questionText}>
                        {question.questionText}
                      </Text>
                      <Text style={styles.questionSubText}>
                        {question.questionSubText}
                      </Text>
                      <View>
                        {question.inputType === "TEXT" ? (
                          <FormikTextInput
                            name={question.questionId}
                            style={styles.inputContainer}
                            returnKeyType="next"
                          />
                        ) : question.inputType === "LARGE_TEXT" ? (
                          <FormikTextInput
                            name={question.questionId}
                            style={[styles.inputContainer, styles.textArea]}
                            multiline={true}
                            numberOfLines={4}
                            returnKeyType="next"
                          />
                        ) : question.inputType === "NUMBER" ? (
                          <FormikTextInput
                            name={question.questionId}
                            style={styles.inputContainer}
                            type="digits"
                            returnKeyType="next"
                          />
                        ) : question.inputType === "SELECT" ? (
                          <FormikSelect
                            name={question.questionId}
                            firstItem="Select Option"
                            options={question.options.map((option) => {
                              return {
                                label: option.optionName,
                                value: option.optionName,
                              };
                            })}
                          />
                        ) : question.inputType === "MULTI_SELECT" ? (
                          <FormikMultiSelect
                            name={question.questionId}
                            options={question.options}
                          />
                        ) : question.inputType === "RADIO" ? (
                          <FormikRadioGroup
                            name={question.questionId}
                            options={question.options}
                          />
                        ) : question.inputType === "PHONE" ? (
                          <FormikTextInput
                            name={question.questionId}
                            style={styles.inputContainer}
                            returnKeyType="next"
                          />
                        ) : question.inputType === "EMAIL" ? (
                          <FormikTextInput
                            name={question.questionId}
                            style={styles.inputContainer}
                            returnKeyType="next"
                          />
                        ) : question.inputType === "BARCODE" ? (
                          <FormikBarCode
                            name={question.questionId}
                            navigation={navigation}
                          />
                        ) : question.inputType === "HIDDEN" ? (
                          <View>
                            <View style={styles.xinputContainer}>
                              <TouchableOpacity
                                placeholder="Select date"
                                onPress={() =>
                                  Alert.alert(
                                    "Confirm:",
                                    "Have you done the test mentioned in this question before?",
                                    [
                                      {
                                        text: "No",
                                        onPress: () => {
                                          this.skippedDateTogglerHandler();
                                          console.log("did dis");
                                        },
                                      },
                                      {
                                        text: "Yes",
                                        onPress: () => {
                                          this.setState((previousState) => ({
                                            showDatePicker: !previousState.showDatePicker,
                                          }));
                                        },
                                      },
                                    ]
                                  )
                                }
                                style={{ paddingHorizontal: 5 }}
                              >
                                {this.state.skippedDate == false ? (
                                  <Text>
                                    {values.swabdate === new Date()
                                      ? "Tap again to close"
                                      : moment(values.swabdate).format(
                                          "MMM DD, YYYY"
                                        )}
                                  </Text>
                                ) : null}
                              </TouchableOpacity>
                            </View>
                            {this.state.showDatePicker && (
                              <FormikDatePicker
                                name="swabdate"
                                placeholder="Select date"
                                mode="date"
                                date={values.swabdate}
                                style={styles.datepicker}
                                //value={this.state.birthdate}
                                onDateChange={(swabdate) => {
                                  console.log(swabdate);
                                  values.swabdate = moment(swabdate).format(
                                    "MMM DD, YYYY"
                                  );
                                  this.setState({
                                    swabdate: values.swabdate,
                                  });
                                }}
                              />
                            )}
                          </View>
                        ) : question.inputType === "HIDDENx2" ? (
                          <View>
                            <View style={styles.xinputContainer}>
                              <TouchableOpacity
                                placeholder="Select date"
                                onPress={() =>
                                  Alert.alert(
                                    "Confirm:",
                                    "Have you done the test mentioned in this question before?",
                                    [
                                      {
                                        text: "No",
                                        onPress: () => {
                                          this.skippedDateTogglerHandler2();
                                        },
                                      },
                                      {
                                        text: "Yes",
                                        onPress: () => {
                                          this.setState((previousState2) => ({
                                            showDatePicker2: !previousState2.showDatePicker2,
                                          }));
                                        },
                                      },
                                    ]
                                  )
                                }
                                style={{ paddingHorizontal: 5 }}
                              >
                                {this.state.skippedDate2 == false ? (
                                  <Text>
                                    {values.hiddenDate === new Date()
                                      ? "Tap again to close"
                                      : moment(values.hiddenDate).format(
                                          "MMM DD, YYYY"
                                        )}
                                  </Text>
                                ) : null}
                              </TouchableOpacity>
                            </View>
                            {this.state.showDatePicker2 && (
                              <FormikDatePicker
                                name="hiddenDate"
                                placeholder="Select date"
                                mode="date"
                                date={values.hiddenDate}
                                style={styles.datepicker}
                                //value={this.state.birthdate}
                                onDateChange={(hiddenDate) => {
                                  console.log(hiddenDate);
                                  values.hiddenDate = moment(hiddenDate).format(
                                    "MMM DD, YYYY"
                                  );
                                  this.setState({
                                    hiddenDate: values.hiddenDate,
                                  });
                                }}
                              />
                            )}
                          </View>
                        ) : question.inputType === "DATE" ? (
                          <View>
                            <View style={styles.xinputContainer}>
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
                                    : moment(values.birthdate).format(
                                        "MMM DD, YYYY"
                                      )}
                                </Text>
                              </TouchableOpacity>
                            </View>
                            {this.state.showDatePicker && (
                              <FormikDatePicker
                                name="birthdate"
                                placeholder="Select date"
                                mode="date"
                                date={values.birthdate}
                                style={styles.datepicker}
                                //value={this.state.birthdate}
                                onDateChange={(birthdate) => {
                                  console.log(birthdate);
                                  values.birthdate = moment(birthdate).format(
                                    "MMM DD, YYYY"
                                  );
                                  this.setState({
                                    birthdate: values.birthdate,
                                  });
                                }}
                              />
                            )}
                          </View>
                        ) : question.inputType === "SIGNATURE" ? (
                          <FormikSignature
                            name={question.questionId}
                            navigation={navigation}
                          />
                        ) : question.inputType === "PICTURE" ? (
                          <FormikCamera
                            name={question.questionId}
                            navigation={navigation}
                          />
                        ) : null}
                      </View>
                    </View>
                  );
                })}
                <View style={styles.submitButton}>
                  <TouchableOpacity onPress={handleSubmit}>
                    <Text style={{ color: "white" }}>Submit Form</Text>
                  </TouchableOpacity>
                </View>
              </Form>
            )}
          </Formik>
        </ScrollView>
        <NavigationEvents onWillFocus={() => this.componentDidMount()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationHeader: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    backgroundColor: "#1f427a",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
  },
  backButton: { width: 50, height: 30, resizeMode: "contain" },
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
  formItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  questionText: {
    fontSize: 20,
  },
  subText: {
    fontSize: 20,
    paddingBottom: 5,
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
    alignItems: "center",
  },
  xinputContainer: {
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
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  question: {
    paddingBottom: 5,
    paddingTop: 20,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
  },
  submitButton: {
    marginVertical: 10,
    width: Dimensions.get("window").width - 100,
    backgroundColor: "#1f427a",
    padding: 15,
    borderRadius: 5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FormScreen;
