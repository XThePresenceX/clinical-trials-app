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
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import Request from "../_services/Request";
import AsyncStorage from "@react-native-community/async-storage";
import { Formik } from "formik";
import {
  handleTextInput,
  withInputTypeProps,
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm,
} from "react-native-formik";
import { compose } from "recompose";
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
const Form = withNextInputAutoFocusForm(View);

export class SettingsScreen extends Component {
  state = {
    location: "",
    company: "",
    participantId: "",
    studyId: "",
    formId: "",
    formTitle: "",
    repeatFormNumber: "",
    questions: [],
    questionIds: [],
    properQuestion: "",
    faqModalVisible: false,
  };
  async componentDidMount() {
    const participantId = await AsyncStorage.getItem("id");

    await this.setState({
      participantId,
      studyId: this.props.navigation.getParam("studyId", " "),
      studyTitle: "Settings - Company and Location",
      formId: this.props.navigation.getParam("formId", " "),
      formTitle: this.props.navigation.getParam("formTitle", " "),
    });

    this.getFormQuestions();
  }

  async getFormQuestions() {
    let count = 0;
    Request.getRequest(`form/questionsX/47`)
      .then(async (response) => {
        if (response.status == 1) {
          await this.setState({ questions: response.questions });
          for (i = 0; i < this.state.questions.length; i++) {
            if (
              this.state.questions[i].inputType === "READ_ONLY" &&
              response.questions[0].answerRequired
            ) {
              count++;
            }
          }
          //console.log("count is", count);
          //console.log("Lenght is", this.state.questions.length);
          this.setState({
            properQuestion: this.state.questions.length - count,
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
    //console.log("Data is", data);
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
    //console.log(JSON.stringify(formResponse, undefined, 4));
    //console.log(datacount);
    if (this.state.properQuestion != datacount) {
      Alert.alert("Select Values:", "You must select a Company and Branch", [
        { text: "OK", onPress: () => console.log("alert closed") },
      ]);
    } else {
      Alert.alert("VALUES SET", "Company and location is now set", [
        {
          text: "OK",
          onPress: () => {
            console.log(JSON.stringify(formResponse, undefined, 4));
            this.setState({ company: formResponse[0].answer });
            this.setState({ location: formResponse[1].answer });
            // this.state.company = formResponse[0].answer;
            // this.state.location = formResponse[1].answer;
          },
        },
      ]);
    }
  }

  setModalVisible(visible) {
    this.setState({ faqModalVisible: visible });
  }
  render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.navigationHeader}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              //console.log("PREVIOUS STUDY STATE: ", this.state);
              this.props.navigation.navigate("ActiveStudies", {
                company: this.state.company,
                location: this.state.location,
              });
            }}
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
              this.submitForm(data);
            }}
          >
            {({ values, handleChange, handleBlur, handleSubmit }) => (
              <Form>
                {this.state.questions.map((question, index) => {
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
                        ) : question.inputType === "BARCODE" ? (
                          <FormikBarCode
                            name={question.questionId}
                            navigation={navigation}
                          />
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
                    <Text style={{ color: "white" }}>SET VALUES</Text>
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

export default SettingsScreen;
