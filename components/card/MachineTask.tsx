import {Task} from "../../api/API";
import React from "react";
import {Card, Separator, Text, XStack} from "tamagui";
import {AlertCircle, CheckCircle2} from "@tamagui/lucide-icons";

export default function MachineTask({task}: { task: Task }) {

    let openTask = () => {
        alert("Task Details Page of task " + task.title)
    }

    let icon = task.done ? <CheckCircle2 marginHorizontal={"$2"} color={"green"}/> :
        <AlertCircle marginHorizontal={"$2"} color={"red"}/>;

    return (
        <Card elevate bordered hoverStyle={{scale: 0.975}} onPress={openTask} pressStyle={{scale: 0.95}}
              animation={"quick"}>
            <Card.Header>
                <XStack alignSelf={"center"}>
                    {icon}
                    <Text alignSelf={"center"} numberOfLines={1}>{task.title}</Text>
                </XStack>
                {task.details ? <Separator marginVertical={"$3"}/> : null}
                {task.details ? <Text numberOfLines={3}>{task.details}</Text> : null}
            </Card.Header>
            <Card.Footer/>
            <Card.Background/>
        </Card>
    );
}

