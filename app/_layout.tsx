import {Stack} from "expo-router";

export default function Layout() {
    return <Stack screenOptions={{}}>
        <Stack.Screen name="home" options={{
            title: "Home",
        }}/>

    </Stack>;
}