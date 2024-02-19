import Button from "../../components/Button";
import {MaterialIcons} from "@expo/vector-icons";
import {useState} from "react";
import DialogContainer from "react-native-dialog/lib/Container";
import DialogTitle from "react-native-dialog/lib/Title";
import DialogDescription from "react-native-dialog/lib/Description";
import DialogButton from "react-native-dialog/lib/Button";
import {getUserName, isLoggedIn, logout} from "../../api/AccountManager";
import {Redirect, router} from "expo-router";
import {Text} from "react-native";

export default function Manage() {
    let username = getUserName();

    if (!isLoggedIn() || username === null) {
        return <Redirect href={"/login"}/>;
    }

    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

    let doLogout = () => {
        setShowLogoutPrompt(false);
        logout();
        router.navigate("/");
    }

    return (<>
        <Text style={{margin: 10, fontFamily: "Inter_600SemiBold"}}>Welcome, {username}</Text>
        <DialogContainer visible={showLogoutPrompt}>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>
                Are you sure you want to logout from this account?
            </DialogDescription>
            <DialogButton label="No" onPress={() => {
                setShowLogoutPrompt(false)
            }}/>
            <DialogButton label="Yes" onPress={doLogout}/>
        </DialogContainer>
        <Button label={"Logout"} onPress={() => setShowLogoutPrompt(true)} theme={"danger"}
                icon={<MaterialIcons name={"logout"} size={16} style={{marginRight: 5}}/>}></Button>
    </>);
}

