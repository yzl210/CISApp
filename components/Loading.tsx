import {View} from "tamagui";
import {ActivityIndicator} from "react-native";

export default function Loading() {
    return <View height={"100%"} alignItems={"center"} justifyContent={"center"}>
        <ActivityIndicator size={"large"}/>
    </View>
}