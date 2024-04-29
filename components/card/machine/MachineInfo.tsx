import React from "react";
import {Button, Card, H2, Image, Separator, Text, View} from "tamagui";
import {Machine} from "../../../api/machine";
import {Edit3} from "@tamagui/lucide-icons";
import MachineInfoEditDialog from "./MachineInfoEditDialog";
import {useRole} from "../../../api/API";
import Loading from "../../Loading";
import {canEditMachineInfo} from "../../../api/users";

export default function MachineInfo({machine}: { machine: Machine }) {
    const {role} = useRole();

    if (!role) {
        return <Loading/>;
    }

    let subtitle = (machine.brand ? machine.brand + "\t" : "") + machine.model;
    let desc = (machine.serial ? "Serial No.: " + machine.serial + "\t" : "") + (machine.location ? "Location: " + machine.location + "\t" : "");

    return <>
        <Card elevate bordered>
            <Card.Header>
                <H2 textAlign={"center"}>{machine.name}</H2>
                <Text color={"gray"} textAlign={"center"}>{subtitle}</Text>
                {canEditMachineInfo(role) ? <MachineInfoEditDialog machine={machine}>
                    <Button alignSelf={"flex-end"} position={"absolute"} icon={Edit3}/>
                </MachineInfoEditDialog> : null}
            </Card.Header>
            <Separator marginBottom={"$2.5"}/>
            <View alignSelf={"center"}>
                <Image source={{uri: machine.image, width: 300, height: 300}}/>
            </View>
            <Separator marginVertical={"$2"}/>
            <Text textAlign={"center"} marginBottom={"$2"}>{desc}</Text>
        </Card>
    </>;
}