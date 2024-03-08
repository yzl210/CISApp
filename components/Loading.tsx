    import {Spinner, View} from "tamagui";

export default function Loading() {
    return <View height={"100%"} alignItems={"center"} justifyContent={"center"}>
        <Spinner size={"large"}/>
    </View>
}