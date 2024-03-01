import {StyleSheet} from "react-native";
import React from "react";
import {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import {Card, H2, View} from "tamagui";
import hairlineWidth = StyleSheet.hairlineWidth;

export default function Split({style, text}: { style?: ViewStyle, text?: string }) {
    if (!text) {
        return <View

            style={[{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }, style]}
        />
    }

    return <Card elevate bordered marginHorizontal={"$"} marginVertical={"$3"} width={300} alignSelf={"center"}>
        <H2 marginVertical={"$1.5"} textAlign={"center"}>{text}</H2>
    </Card>
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        borderWidth: hairlineWidth,
        borderColor: 'black',
        borderRadius: 10,
        alignSelf: 'center',
    },
});