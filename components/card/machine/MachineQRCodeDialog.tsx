import {Machine} from "../../../api/machine";
import {Dialog, View, XStack} from "tamagui";
import React, {useRef, useState} from "react";
import {Save, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {useIsWeb} from "../../../api/utils";
import SimpleDialog from "../SimpleDialog";
import QRCode from "react-native-qrcode-svg";
import ViewShot, {captureRef} from "react-native-view-shot";
import {Linking, Platform, View as RNView} from "react-native"
import Sharing from 'expo-sharing';
import * as url from "url";

export default function MachineQRCodeDialog({machine, children}: {
    machine: Machine,
    children: React.ReactNode
}) {
    const [QR, setQR] = useState<QRCode>()
    const [open, setOpen] = useState(false)
    const isWeb = useIsWeb();
    const viewRef = useRef<RNView>(null);

    function prtSc() {

        captureRef(viewRef, {
            format: "png",
            quality: 1,
        }).then(
             (uri) => {
                if (isWeb) {
                    Linking.openURL(uri).then()
                } else {
                    Sharing.isAvailableAsync().then((a) => alert(a))
                        .catch(e => alert(e))
                         Sharing.shareAsync(uri).then()
                }
            },
            (error) => console.error("Oops, snapshot failed", error)
        )
    }

    let openChange = (open: boolean) => {
        if (open)
            setOpen(true)
        else if (!isWeb) {
            close();
        }
    }


    let close = () => {
        setOpen(false)
    }

    return <SimpleDialog open={open} onOpenChange={openChange} trigger={children}>
        <Dialog.Title>
            Machine QR Code
        </Dialog.Title>
        <Dialog.Description>
            Displaying QR Code for {machine.name}
        </Dialog.Description>
        <View ref={viewRef} alignSelf={"center"}>
            <QRCode getRef={setQR} size={200} value={machine.id}/>
        </View>
        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            <LmButton theme={"red"} onPress={close} icon={XCircle}>
                Close
            </LmButton>
            <LmButton theme={"green"} onPress={prtSc} icon={Save}>
                Save
            </LmButton>
        </XStack>
    </SimpleDialog>
}