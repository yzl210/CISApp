import React from "react";
import {router} from "expo-router";
import {AlertDialog, Button, Text, XStack, YStack} from "tamagui";
import {supabase} from "../../api/supabase";
import {useRole, useUser} from "../../api/API";
import Loading from "../../components/Loading";

export default function Manage() {
    const {user} = useUser();
    const {role} = useRole();

    if (!user || !role) {
        return <Loading/>
    }

    let doLogout = () => {
        supabase.auth.signOut().then(error => {
            router.replace("/");
        });
    }

    return (<>
        <Text margin={"10"}>Welcome, {user.name + " (" + role.role + ")"}</Text>
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
                    <YStack gap>
                        <AlertDialog.Title color={"red"}>Logout</AlertDialog.Title>
                        <AlertDialog.Description>
                            Are you sure you want to logout?
                        </AlertDialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
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

