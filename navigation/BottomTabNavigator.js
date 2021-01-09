import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import InGameScreen from "../screens/InGameScreen";
import CalibrationScreen from "../screens/CalibrationScreen";
import colors from "../config/colors";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Game"
        component={GameTabNavigator}
        options={{
          tabBarIcon: () => (
            <Icon
              name="play-circle-outline"
              type="materialicons"
              color={colors.lightgray}
              size={28}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Calibration"
        component={CalibrationTabNavigator}
        options={{
          tabBarIcon: () => (
            <Icon
              name="tune"
              type="materialicons"
              color={colors.lightgray}
              size={28}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const GameTabStack = createStackNavigator();

function GameTabNavigator() {
  return (
    <GameTabStack.Navigator>
      <GameTabStack.Screen
        name="GameTabScreen"
        component={InGameScreen}
        options={{ headerTitle: "Game" }}
      />
    </GameTabStack.Navigator>
  );
}

const CalibrationTabStack = createStackNavigator();

function CalibrationTabNavigator() {
  return (
    <CalibrationTabStack.Navigator>
      <CalibrationTabStack.Screen
        name="CalibrationTabScreen"
        component={CalibrationScreen}
        options={{ headerTitle: "Calibration" }}
      />
    </CalibrationTabStack.Navigator>
  );
}
