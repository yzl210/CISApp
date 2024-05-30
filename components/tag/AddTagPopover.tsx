import {Button, Input, Separator, Spinner, Text, XStack, YStack} from "tamagui";
import {Machine, Tag, useAllTags, useInsertMachineTags} from "../../api/machine";
import React, {useState} from "react";
import Loading from "../Loading";
import {TouchableTagComponent} from "../TagComponent";
import {search} from "../../api/utils";
import {FlashList} from "@shopify/flash-list";
import SimplePopover from "../SimplePopover";
import {Plus} from "@tamagui/lucide-icons";
import TagEditDialog from "./TagEditDialog";

export default function AddTagPopover({machine, tags: currentTags, children}: {
    machine: Machine,
    tags: Tag[],
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('')

    const {tags} = useAllTags();
    const {mutateAsync: insertMachineTags} = useInsertMachineTags();

    if (!tags) {
        return <SimplePopover trigger={children} open={open} setOpen={setOpen}>
            <Loading/>
        </SimplePopover>
    }

    let select = (tag: Tag) => {
        if (loading) return;
        setLoading(true);
        insertMachineTags([{machine: machine.id, tag: tag.id}])
            .then(() => setOpen(false))
            .catch(e => alert(e))
            .finally(() => setLoading(false));
    }

    let filteredTags = tags.filter(tag => !currentTags.find(t => t.id === tag.id));
    if (filter.length > 0)
        filteredTags = filteredTags.filter(tag => search(tag.name, filter));

    return <SimplePopover trigger={children} open={open} setOpen={setOpen}>
        <YStack gap={"$2.5"} maxWidth={"$20"}>
            <XStack gap={"$2"} alignItems={"center"}>
                <Text>Add Tag</Text>
                {loading ? <Spinner/> : null}
                <TagEditDialog create>
                    <Button size={"$2.5"} icon={Plus}/>
                </TagEditDialog>
            </XStack>
            <Input value={filter} onChangeText={setFilter} height={"$2"} placeholder={"Search Tag"} borderRadius={5}/>
            <FlashList data={filteredTags}
                       renderItem={item => <>
                           <TouchableTagComponent tag={item.item} onPress={select}/>
                           <Separator marginVertical={"$1"}/>
                       </>}
                       keyExtractor={item => item.id}
                       estimatedItemSize={10}
            />
        </YStack>
    </SimplePopover>
}