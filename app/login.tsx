import {Image} from 'expo-image';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import React, {useState} from "react";
import {Text, View, XStack, YStack} from "tamagui";
import {AlertCircle, KeyRound, Mail} from "@tamagui/lucide-icons";
import {LmFormRhfProvider, LmInputRhf, LmSubmitButtonRhf} from "@tamagui-extras/form";
import {useHeaderHeight} from '@react-navigation/elements';
import {router} from "expo-router";
import {supabase} from "../api/supabase";
import {getUserRole} from "../api/API";

const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);


export default function Layout() {
    const [loading, setLoading] = React.useState(false);
    const [emailValid, setEmailValid] = useState(true)
    const height = useHeaderHeight();

    let login = (data: any) => {
        let email: string = data.email;
        let password: string = data.password;
        if (email.length === 0 || password.length === 0) {
            return;
        }

        if (!emailRegex.test(email)) {
            setEmailValid(false)
            return;
        }

        setLoading(true);
        supabase.auth.signInWithPassword({email, password})
            .then((result) => {
                if (result.error) {
                    setLoading(false);
                    alert(result.error);
                } else {
                    getUserRole(result.data.user.id).then(({data: role}) => {
                        setLoading(false);
                        if (!role) {
                            alert("User role not found");
                            return;
                        }
                        if (role?.role === "new") {
                            alert("Please wait for your account to be approved");
                            return;
                        }
                        router.replace("/");
                    });
                }
            });
    }


    return (
        <KeyboardAvoidingView behavior={"position"} keyboardVerticalOffset={height + 10}>
            <YStack gap={"$5"} alignItems={"center"}>
                <View>
                    <Image
                        style={styles.image}
                        source="data:image/png;base64,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"
                        contentFit="cover"
                        transition={1000}
                    />
                </View>
                <LmFormRhfProvider>
                    <YStack width={"$20"} gap={"$1"} marginTop={30}>
                        <XStack marginBottom={"$1"} alignItems={"center"} gap={"$2"}>
                            {emailValid ? <Mail/> : <AlertCircle color={"red"}/>}
                            <Text color={emailValid ? "black" : "red"}>Email: </Text>
                        </XStack>

                        <LmInputRhf
                            helperText={!emailValid ? "Email is not valid" : undefined}
                            onChange={() => setEmailValid(true)}
                            required
                            name={"email"}
                            textContentType={"emailAddress"}
                            placeholder="email@athenian.org"
                        >

                        </LmInputRhf>
                        <XStack marginTop={"$3"} marginBottom={"$1"} alignItems={"center"} gap={"$2"}>
                            <KeyRound/>
                            <Text>Password: </Text>
                        </XStack>
                        <LmInputRhf
                            required
                            name={"password"}
                            isPassword
                            textContentType={"password"}
                        >
                        </LmInputRhf>
                    </YStack>
                    <YStack gap={"$3"} width={"$20"}>
                        <LmSubmitButtonRhf
                            loading={loading}
                            themeInverse
                            theme={"blue_active"}
                            onSubmit={login}>Login</LmSubmitButtonRhf>
                        <LmSubmitButtonRhf
                            //loading={loading}
                            theme={"blue_active"}
                            variant={"outlined"}
                            disabled
                            onSubmit={login}>Register</LmSubmitButtonRhf>
                    </YStack>
                </LmFormRhfProvider>
            </YStack>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        marginTop: 100,
    }
});