import {Stack} from "expo-router";

export default function Layout() {
    return <Stack>
        <Stack.Screen name="main" options={{
            title: "Maintenance Tracker",
        }}/>
        <Stack.Screen name="login" options={{
            title: "Login or Register",
        }}/>
    </Stack>;
}