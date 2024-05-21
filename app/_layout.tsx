import {Stack} from "expo-router";
import {useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {TamaguiProvider} from "tamagui";
import tamaguiConfig from "../tamagui.config";
import {useFonts} from "expo-font";
import React from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "../api/API";

export default function Layout() {
    const [loaded] = useFonts({
        Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
        InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    });

    const colorScheme = useColorScheme()

    if (!loaded) {
        return null;
    }

    return <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={tamaguiConfig}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="index" options={{
                        title: "Loading...",
                    }}/>
                    <Stack.Screen name="main" options={{
                        title: "CIS App",
                        headerShown: false
                    }}/>
                    <Stack.Screen name="login" options={{
                        title: "Login",
                    }}/>
                </Stack>
            </ThemeProvider>
        </TamaguiProvider>
    </QueryClientProvider>;
}