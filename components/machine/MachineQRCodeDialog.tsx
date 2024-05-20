import {Machine} from "../../api/machine";
import {Dialog, View, XStack} from "tamagui";
import React, {useState} from "react";
import {Save, XCircle} from "@tamagui/lucide-icons";
import {LmButton} from "@tamagui-extras/core";
import {useIsWeb} from "../../api/utils";
import SimpleDialog from "../SimpleDialog";
import QRCode from "react-native-qrcode-svg";

export default function MachineQRCodeDialog({machine, children}: {
    machine: Machine,
    children: React.ReactNode
}) {
    const [QR, setQR] = useState<QRCode>()
    const [open, setOpen] = useState(false)
    const isWeb = useIsWeb();

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

    let save = () => {

    }


    return <SimpleDialog open={open} onOpenChange={openChange} trigger={children}>
        <Dialog.Title>
            Machine QR Code
        </Dialog.Title>
        <Dialog.Description>
            Displaying QR Code for {machine.name}
        </Dialog.Description>
        <View alignSelf={"center"}>
            <QRCode getRef={setQR} size={200} value={machine.id}/>
        </View>
        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            <LmButton theme={"red"} onPress={close} icon={XCircle}>
                Close
            </LmButton>
            <LmButton theme={"green"} onPress={save} icon={Save}>
                Save
            </LmButton>
        </XStack>
    </SimpleDialog>
}