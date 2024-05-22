import {TaskTemplate, useInsertMachineTask, useInsertTask} from "../../api/tasks";
import {Button, Card, H4, Separator, Text, XStack} from "tamagui";
import React from "react";
import {Edit3, Plus} from "@tamagui/lucide-icons";
import cronstrue from "cronstrue";
import TaskTemplateEditDialog from "./TaskTemplateEditDialog";

export default function TaskTemplateOverview({template}: { template: TaskTemplate }) {

    const {mutateAsync: insertTask} = useInsertTask();
    const {mutateAsync: insertMachineTask} = useInsertMachineTask();


    let addTask = () => {
        insertTask({
            // @ts-ignore
            name: template.name,
            description: template.description,
            details: template.details,
            template: template.id,
        }).then((data) => {
            if (data && data.length > 0) {
                insertMachineTask({
                    // @ts-ignore
                    machine: template.machine,
                    task: data[0].id
                }).catch(e => {
                    throw e;
                })
            }
        }).catch(e => {
            alert(e)
        })
    }


    return (
        <Card elevate bordered>
            <Card.Header>
                <XStack justifyContent={"space-between"}>
                    <H4 alignSelf={"center"} numberOfLines={1}>{template.name}</H4>
                    <XStack gap={"$3"}>
                        <Button icon={Plus} theme={"green"} onPress={addTask}/>
                        <TaskTemplateEditDialog machine_id={template.machine} template={template}>
                            <Button icon={Edit3}/>
                        </TaskTemplateEditDialog>
                    </XStack>
                </XStack>
                {template.description ?
                    <Text alignSelf={"flex-start"} numberOfLines={3}>{template.description}</Text> : null}
                {template.cron ? <Separator marginVertical={"$3"}/> : null}
                {template.cron ? <Text>Repeats: {cronstrue.toString(template.cron, {verbose: true})}</Text> : null}
            </Card.Header>
            <Card.Footer>

            </Card.Footer>
            <Card.Background/>
        </Card>
    );
}