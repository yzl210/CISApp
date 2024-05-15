import React, {useEffect, useState} from "react";
import {Button, Card, H2, Separator, Text, View, XStack} from "tamagui";
import {Machine} from "../../../api/machine";
import {Edit3, QrCode} from "@tamagui/lucide-icons";
import MachineInfoEditDialog from "./MachineInfoEditDialog";
import {useRole} from "../../../api/API";
import Loading from "../../Loading";
import {canEditMachineInfo} from "../../../api/users";
import MachineQRCodeDialog from "./MachineQRCodeDialog";
import {Dimensions, Image as RNImage} from "react-native";
import {Image} from "expo-image";

export default function MachineInfo({machine}: { machine: Machine }) {
    const {role} = useRole();
    const [ratio, setRatio] = useState(1)

    useEffect(() => {
        if (machine.image)
            RNImage.getSize(machine.image, (width, height) => {
                setRatio(width / height)
            });
    }, [machine.image]);

    if (!role) {
        return <Loading/>;
    }


    let desc: React.ReactNode[] = []
    let addDesc = (s: string | undefined) => {
        if (s)
            desc.push(<Text key={desc.length} textAlign={"center"} color={"gray"}>{s}</Text>, <Separator
                key={desc.length + 1} vertical
                marginHorizontal={"$2"}/>);
    }

    addDesc(machine.brand)
    addDesc(machine.model)
    addDesc(machine.serial)
    addDesc(machine.location)

    desc = desc.slice(0, -1)


    return <>
        <Card elevate bordered>
            <Card.Header>
                <H2 textAlign={"center"}>{machine.name}</H2>
                <XStack justifyContent={"center"}>
                    {desc}
                </XStack>
                <MachineQRCodeDialog machine={machine}>
                    <Button top={"$3"} left={"$3"} position={"absolute"} icon={QrCode}/>
                </MachineQRCodeDialog>
                {canEditMachineInfo(role) ? <MachineInfoEditDialog machine={machine}>
                    <Button top={"$3"} right={"$3"} position={"absolute"} icon={Edit3}/>
                </MachineInfoEditDialog> : null}
            </Card.Header>
            <Separator marginBottom={"$2.5"}/>
            <View alignSelf={"center"} marginBottom={"$2"}>
                <Image source={machine.image}
                       style={{width: Dimensions.get('window').width * 0.28, aspectRatio: ratio}}/>
            </View>
        </Card>
    </>;
}