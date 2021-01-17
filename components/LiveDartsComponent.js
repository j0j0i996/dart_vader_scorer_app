import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import { Typography } from "../styles";
import { Icon } from "react-native-elements";

export default function LiveDartsComponent(props) {
  return (
    <View style={styles.container}>
      <SingleDartView throwObject={props.throwObject.first} />
      <SingleDartView throwObject={props.throwObject.second} />
      <SingleDartView throwObject={props.throwObject.third} />
    </View>
  );
}

function SingleDartView(props) {
  return (
    <View
      style={[
        styles.singleDartBox,
        props.throwObject.score
          ? { backgroundColor: colors.primary }
          : { backgroundColor: colors.lightgray },
      ]}
    >
      <Text style={styles.text}>Dart {props.throwObject.throw}</Text>
      <Text style={styles.header1}>
        {props.throwObject.score ? props.throwObject.score : " "}
      </Text>
      <Text style={styles.header3}>
        {props.throwObject.field ? props.throwObject.field : " "}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex:0.4,
    margin: 10,
    justifyContent: "space-around",
    flexDirection: "row",
    marginBottom: 5,
  },
  singleDartBox: {
    flex: 1,
    padding: 10,
    margin: 10,
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: colors.lightgray,
  },
  header1: {
    ...Typography.header1,
    color: colors.white,
  },
  header3: {
    ...Typography.header3,
    color: colors.white,
  },
  text: {
    ...Typography.text,
    color: colors.white,
  },
});
