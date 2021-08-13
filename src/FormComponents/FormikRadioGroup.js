import React from "react";
import { View } from "react-native";
import { CheckBox } from "react-native-elements";
import {
  withFormikControl,
  withNextInputAutoFocusInput
} from "react-native-formik";
import { compose } from "recompose";

class FormikRadioGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.controlRef = React.createRef();
  }
  focus = () => {
    this.controlRef.current.focus();
  };
  render() {
    const { value, setFieldValue } = this.props;
    return (
      <View ref={this.controlRef} {...this.props}>
        {this.props.options.map((option, index) => {
          return (
            <CheckBox
              title={option.optionName}
              key={index}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={value === option.optionName}
              onPress={() => {
                setFieldValue(option.optionName);
              }}
            />
          );
        })}
      </View>
    );
  }
}

export default compose(
  withFormikControl,
  withNextInputAutoFocusInput
)(FormikRadioGroup);
