import React from "react";
import {Button, Card, H2, Image, Separator, Text, View} from "tamagui";
import {Machine} from "../../api/machine";
import {Autolink} from "react-native-autolink";
import {Edit3} from "@tamagui/lucide-icons";
import MachineInfoEditDialog from "./MachineInfoEditDialog";
import {useRole} from "../../api/API";
import Loading from "../Loading";
import {canEditMachineInfo} from "../../api/users";

export default function MachineInfo({machine}: { machine: Machine }) {
    const {role} = useRole();

    if (!role) {
        return <Loading/>;
    }

    let editMachine = () => {
    }

    let info = machine.brand + "  " + machine.model + "  " + machine.serial + "  " + machine.location;

    return <>
        <Card elevate bordered onPress={editMachine}>
            <Card.Header>
                <H2 textAlign={"center"}>{machine.name}</H2>
                <Text textAlign={"center"} fontSize={15} color={"gray"}>{machine.id}</Text>
                {canEditMachineInfo(role) ? <MachineInfoEditDialog machine={machine}>
                    <Button alignSelf={"flex-end"} position={"absolute"} icon={Edit3}/>
                </MachineInfoEditDialog> : null}
            </Card.Header>
            <Separator marginBottom={"$2.5"}/>
            <View alignSelf={"center"}>
                <Image source={{uri: machine.image, width: 300, height: 300}}/>
            </View>
            <Separator marginVertical={"$2"}/>
            <View alignSelf={"center"}>
                <Text>{info}</Text>
                <Autolink text={machine.description ?? ""}
                          renderText={text => <Text fontSize={18} color={"gray"} textAlign={"center"}
                                                    marginBottom={"$2"}>{text}</Text>}/>
            </View>
        </Card>
    </>;
}