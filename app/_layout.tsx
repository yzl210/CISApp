import {Stack} from "expo-router";
import {useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {TamaguiProvider} from "tamagui";
import tamaguiConfig from "../tamagui.config";
import {useFonts} from "expo-font";

export default function Layout() {
    const [loaded] = useFonts({
        Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
        InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    });

    const colorScheme = useColorScheme()
    return <TamaguiProvider config={tamaguiConfig}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="main" options={{
                    title: "Maintenance Tracker",
                }}/>
                <Stack.Screen name="login" options={{
                    title: "Login or Register",
                }}/>
            </Stack>
        </ThemeProvider>
    </TamaguiProvider>;
}