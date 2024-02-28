import {Redirect} from "expo-router";
import {isLoggedIn} from "../api/AccountManager";

export default function Index() {
    if (isLoggedIn())
        return <Redirect href={"/main/home"}/>;
    else
        return <Redirect href={"/login"}/>;
};