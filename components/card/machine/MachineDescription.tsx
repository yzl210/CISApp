import React from "react";
import {Button, Card, View} from "tamagui";
import {Machine} from "../../../api/machine";
import {Edit3} from "@tamagui/lucide-icons";
import {useRole} from "../../../api/API";
import Loading from "../../Loading";
import {canEditMachineInfo} from "../../../api/users";
import MachineDescriptionEditDialog from "./MachineDescriptionEditDialog";
import Markdown from "react-native-markdown-display";

export default function MachineDescription({machine}: { machine: Machine }) {
    const {role} = useRole();

    if (!role) {
        return <Loading/>;
    }

    return <>
        <Card elevate bordered minHeight={"$7"}>
            <View margin={"$3"}>
                <Markdown style={{link: {color: 'blue'}}}>
                    {machine.description ?? ""}
                </Markdown>
            </View>
            {canEditMachineInfo(role) ? <MachineDescriptionEditDialog machine={machine}>
                <Button top={"$3"} right={"$3"} position={"absolute"} icon={Edit3}/>
            </MachineDescriptionEditDialog> : null}
        </Card>
    </>;
}