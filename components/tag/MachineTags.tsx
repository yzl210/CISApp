import React from "react";
import {Button, Card, XStack} from "tamagui";
import {Machine, Tag} from "../../api/machine";
import TagComponent from "../TagComponent";
import {useRole} from "../../api/API";
import Loading from "../Loading";
import {canEditTags} from "../../api/users";
import {Plus} from "@tamagui/lucide-icons";
import AddTagPopover from "./AddTagPopover";
import {TouchableOpacity} from "react-native";
import TagDetailsPopover from "./TagDetailsPopover";

export default function MachineTags({machine, tags}: { machine: Machine, tags: Tag[] }) {
    const {role} = useRole();

    if (!role) {
        return <Loading/>;
    }
    let canEdit = canEditTags(role);

    return <>
        <Card elevate bordered>
            <XStack flexWrap={"wrap"} margin={"$3"} gap={"$2"}>
                {tags ? tags.map(tag => <PopoverTag key={tag.id} machine={machine} tag={tag}/>) : null}
                {canEdit ? <AddTagPopover machine={machine} tags={tags}>
                    <Button variant={"outlined"} size={"$2"} icon={Plus} scaleIcon={1}/>
                </AddTagPopover> : null}
            </XStack>
        </Card>
    </>;
}

function PopoverTag({machine, tag}: { machine: Machine, tag: Tag }) {
    return <TagDetailsPopover key={tag.id} machine={machine} tag={tag}>
        <TouchableOpacity>
            <TagComponent tag={tag}/>
        </TouchableOpacity>
    </TagDetailsPopover>
}