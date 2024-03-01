import React, {useState} from "react";
import {getUserName, isLoggedIn, logout} from "../../api/AccountManager";
import {Redirect, router} from "expo-router";
import {AlertDialog, Button, Text, XStack, YStack} from "tamagui";

export default function Manage() {
    let username = getUserName();

    if (!isLoggedIn() || username === null) {
        return <Redirect href={"/login"}/>;
    }

    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

    let doLogout = () => {
        setShowLogoutPrompt(false);
        logout();
        router.replace("/");
    }

    return (<>
        <Text margin={"10"}>Welcome, {username}</Text>
        <AlertDialog native>
            <AlertDialog.Trigger asChild>
                <Button theme={"red_active"}>Logout</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay
                    key="overlay"
                    animation="quick"
                    opacity={0.5}
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                />
                <AlertDialog.Content
                    bordered
                    elevate
                    key="content"
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
                    exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
                    x={0}
                    scale={1}
                    opacity={1}
                    y={0}
                >
                    <YStack space>
                        <AlertDialog.Title color={"red"}>Logout</AlertDialog.Title>
                        <AlertDialog.Description>
                            Are you sure you want to logout?
                        </AlertDialog.Description>

                        <XStack space="$3" justifyContent="flex-end">
                            <AlertDialog.Cancel asChild>
                                <Button>Cancel</Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action onPress={doLogout} asChild>
                                <Button theme={"red_active"}>Logout</Button>
                            </AlertDialog.Action>
                        </XStack>
                    </YStack>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog>
    </>);
}

