import {Machine} from "../../api/API";
import React from "react";
import {Card, H2, Image, Separator, Text, View} from "tamagui";

export default function MachineInfo({machine}: { machine: Machine }) {

    let editMachine = () => {
    }

    return (
        <Card elevate bordered margin={"$2"} onPress={editMachine}>
            <Card.Header>
                <H2 textAlign={"center"}>{machine.name}</H2>
                <Text textAlign={"center"} fontSize={15} color={"gray"}>{machine.id}</Text>
            </Card.Header>
            <Separator marginBottom={"$2.5"}/>
            <View alignSelf={"center"}>
                <Image source={{uri: machine.image, width: 300, height: 300}}/>
            </View>
            <Separator marginVertical={"$2"}/>
            <Text fontSize={18} color={"gray"} textAlign={"center"} marginBottom={"$2"}>{machine.description}</Text>
        </Card>
    );
}