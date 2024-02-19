import {Redirect} from "expo-router";
import {Inter_600SemiBold, useFonts} from "@expo-google-fonts/inter";
import {isLoggedIn} from "../api/AccountManager";

export default function Index() {

    let [fontsLoaded] = useFonts({
        Inter_600SemiBold,
    });

    if (!fontsLoaded) {
        return null;
    }

    if (isLoggedIn())
        return <Redirect href={"/main/home"}/>;
    else
        return <Redirect href={"/login"}/>;
};