import {Input, Popover, Spinner, Text, XStack, YStack} from "tamagui";
import {Machine, Tag, useAllTags, useInsertMachineTags} from "../../../api/machine";
import React, {useState} from "react";
import Loading from "../../Loading";
import {FlatList} from "react-native";
import {TouchableTagComponent} from "../../TagComponent";
import {search} from "../../../api/utils";

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
        return <Content trigger={children} open={open} setOpen={setOpen}>
            <Loading/>
        </Content>
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

    return <Content trigger={children} open={open} setOpen={setOpen}>
        <YStack gap={"$2.5"}>
            <XStack gap={"$2"}>
                <Text>Add Tag</Text>
                {loading ? <Spinner/> : null}
            </XStack>
            <Input value={filter} onChangeText={setFilter} height={"$2"} placeholder={"Search Tag"} borderRadius={5}/>
            <FlatList data={filteredTags} contentContainerStyle={{gap: 5}}
                      renderItem={item => <TouchableTagComponent tag={item.item} onPress={select}/>}
                      keyExtractor={item => item.id}/>
        </YStack>
    </Content>
}


function Content({trigger, children, open, setOpen}: {
    trigger: React.ReactNode,
    children: React.ReactNode,
    open: boolean,
    setOpen: (open: boolean) => void
}) {
    return <Popover allowFlip placement={"bottom"} size={"$5"} open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
            {trigger}
        </Popover.Trigger>
        <Popover.Content elevate>
            <Popover.Arrow/>
            {children}
        </Popover.Content>
    </Popover>;
}