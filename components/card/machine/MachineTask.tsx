import React from "react";
import {Card, Separator, Text, XStack} from "tamagui";
import {AlertCircle, CheckCircle2} from "@tamagui/lucide-icons";
import {Task} from "../../../api/machine";

export default function MachineTask({task}: { task: Task }) {

    let icon = task.completed_at ? <CheckCircle2 marginHorizontal={"$2"} color={"green"}/> :
        <AlertCircle marginHorizontal={"$2"} color={"red"}/>;

    return (
        <Card elevate bordered hoverStyle={{scale: 0.975}} animation={"quick"}>
            <Card.Header>
                <XStack alignSelf={"flex-start"}>
                    {icon}
                    <Text alignSelf={"center"} numberOfLines={1}>{task.name}</Text>
                </XStack>
                {task.description ? <Separator marginVertical={"$3"}/> : null}
                {task.description ? <Text alignSelf={"flex-start"} numberOfLines={3}>{task.description}</Text> : null}
            </Card.Header>
            <Card.Footer/>
            <Card.Background/>
        </Card>
    );
}

