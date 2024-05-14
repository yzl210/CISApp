import {Machine, useUpdateMachine} from "../../api/machine";
import {Button, Dialog, XStack, YStack} from "tamagui";
import React, {useEffect, useRef, useState} from "react";
import {CheckCircle, Edit3, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {LmInput} from "@tamagui-extras/form";
import {router} from "expo-router";
import QRCode from "react-native-qrcode-svg";
import ViewShot, {captureRef} from "react-native-view-shot";
import {capture} from "expo-camera/build/WebCameraUtils";
import {View} from "react-native"

export default function QrCodeDialog({machine, children}: { machine: Machine, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const viewRef = useRef<View>(null);
    function prtSc() {
        captureRef(viewRef, {
            format: "jpg",
            quality: 0.8,
        }).then(
            (uri) => console.log("Image saved to ", uri),
            (error) => console.error("Oops, snapshot failed", error)
        )
    }
    let openChange = (open: boolean) => {
        if (open)
            setOpen(true)
    }

    return <Dialog modal open={open} onOpenChange={openChange}>
        {/*<Adapt when="sm" platform="touch">*/}
        {/*    <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>*/}
        {/*        <Sheet.Frame padding="$4" gap="$4">*/}
        {/*            <Adapt.Contents />*/}
        {/*        </Sheet.Frame>*/}
        {/*        <Sheet.Overlay*/}
        {/*            animation="lazy"*/}
        {/*            enterStyle={{ opacity: 0 }}*/}
        {/*            exitStyle={{ opacity: 0 }}*/}
        {/*        />*/}
        {/*    </Sheet>*/}
        {/*</Adapt>*/}
        <Dialog.Trigger asChild>
            {children}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay disabled/>
            <Dialog.Content bordered elevate key={"content"}>
                <Dialog.Title>
                    QR code
                </Dialog.Title>
                <Dialog.Description alignItems={"center"}>
                    A QR code of {machine.name}
                </Dialog.Description>
                <View ref={viewRef}>
                        <QRCode
                            value={machine.id}
                            size={200}
                            color="black"
                            backgroundColor="white"
                        />
                </View>
                <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
                    <LmButton theme={"red"} onPress={() => setOpen(false)} icon={<XCircle/>}>
                        Close
                    </LmButton>
                    <LmButton theme={"green"} onPress={prtSc}  icon={<CheckCircle/>}>
                        Print
                    </LmButton>
                </XStack>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog>
}




