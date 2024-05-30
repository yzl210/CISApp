import {TaskTemplate} from "../../api/tasks";
import {Card, Separator, Text, XStack} from "tamagui";
import React from "react";

export default function TaskTemplateOverview({template}: { template: TaskTemplate }) {

    return (
        <Card elevate bordered hoverStyle={{scale: 0.975}} animation={"quick"}>
            <Card.Header>
                <XStack alignSelf={"flex-start"}>
                    <Text alignSelf={"center"} numberOfLines={1}>{template.name}</Text>
                </XStack>
                {template.description ? <Separator marginVertical={"$3"}/> : null}
                {template.description ?
                    <Text alignSelf={"flex-start"} numberOfLines={3}>{template.description}</Text> : null}
            </Card.Header>
            <Card.Footer/>
            <Card.Background/>
        </Card>
    );
}