import ColorPicker, {Panel5, Preview} from "reanimated-color-picker";
import {LmButton} from "@tamagui-extras/core";
import React, {useState} from "react";
import SimpleDialog from "./SimpleDialog";
import {useIsWeb} from "../api/utils";
import {View, XStack} from "tamagui";
import {Check, XCircle} from "@tamagui/lucide-icons";

type editDialogProps = {
    children: React.ReactNode
    color?: string,
    setColor: (color: string) => void
}
export default function ColorPickerDialog(props: editDialogProps) {
    const [open, setOpen] = useState(false)
    const isWeb = useIsWeb();
    const [color, setColor] = useState("#FFFFFF")

    let openChange = (open: boolean) => {
        if (open)
            setOpen(true)
        else if (!isWeb) {
            setOpen(false)
        }
    }

    let cancel = () => {
        setOpen(false);
    };

    let confirm = () => {
        props.setColor(color);
        setOpen(false);
    }


    return <SimpleDialog open={open} onOpenChange={openChange} trigger={props.children}>
        <View width={475}>
            <ColorPicker value={props.color ?? "#FFFFFF"} onComplete={(({hex}) => setColor(hex))}>
                <Preview/>
                <Panel5/>
            </ColorPicker>
        </View>
        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            <LmButton theme={"red"} onPress={cancel} icon={<XCircle/>}>
                Cancel
            </LmButton>
            <LmButton theme={"green"} onPress={confirm} icon={Check}>
                Confirm
            </LmButton>
        </XStack>
    </SimpleDialog>
}