import {FlatList} from "react-native";
import React, {useState} from "react";
import {Image, Input, Separator, Text, View, XStack} from "tamagui";
import {router} from "expo-router";
import {Machine, Tag, useAllMachines, useTags} from "../../api/machine";
import Loading from "../../components/Loading";
import TagComponent from "../../components/TagComponent";

export default function Browse() {
    const [query, setQuery] = useState('');
    const {machines} = useAllMachines();


    return (
        <View height={"100%"} backgroundColor={"white"}>
            <View>
                <Input
                    placeholder={"Search..."}
                    value={query}
                    onChangeText={setQuery}
                />
            </View>
            <Separator marginVertical={"$1"}/>
            {machines ? <MachineList query={query}
                                     machines={machines}/> :
                <Loading/>}
        </View>
    );
}

function search(string: string, query: string) {
    const mainLength: number = string.length;
    let searchIndex: number = 0;

    for (let i = 0; i < mainLength && searchIndex < query.length; i++) {
        if (query[searchIndex] === ' ' || query[searchIndex].toLowerCase() === string[i].toLowerCase()) {
            searchIndex++;
        }
    }
    return searchIndex === query.length;
}

function MachineList({query, machines}: { query: string, machines: Machine[] }) {

    if (machines.length < 1) {
        return <Text color={"gray"} alignSelf={"center"} marginVertical={"$2"}>No result</Text>;
    }

    let tagMap = new Map<string, Tag[]>();

    machines.forEach(machine => {
        const {tags} = useTags(machine.id);
        if (tags)
            tagMap.set(machine.id, tags);
    });

    let tagComponents = new Map<string, React.JSX.Element[]>();
    tagMap.forEach((tags, id) =>
        tagComponents.set(id, tags.map(tag => <TagComponent key={tag.id} tag={tag}/>)));

    let filtered = machines ? query.length < 1 ? machines : machines
        .filter((m, i) => search(m.name, query) || tagMap.get(m.id)?.some(tag => search(tag.name, query))) : []

    let openMachine = (machine: Machine) => {
        router.navigate({pathname: '/machine', params: {id: machine.id}});
    }

    return <FlatList data={filtered} renderItem={(item) => {
        return <View key={item.item.id} onPress={() => openMachine(item.item)}>
            <XStack alignItems={"center"}>
                <Image source={{uri: item.item.image, width: 50, height: 50}}/>
                <Separator backgroundColor={"darkgray"} marginHorizontal={"$2"} vertical/>
                <Text fontSize={20}>{item.item.name}</Text>
                <Separator backgroundColor={"darkgray"} marginHorizontal={"$2"} vertical/>
                {tagComponents.get(item.item.id)}
            </XStack>
            <Separator backgroundColor={"darkgray"} marginVertical={"$2"}/>
        </View>
    }}/>;
}

function Section({text}: { text: string | undefined }) {

    if (!text) {
        return null;
    }

    return <>
        <Separator backgroundColor={"darkgray"} marginHorizontal={"$2"} vertical/>
        <Text alignSelf={"center"} fontSize={16} color={"gray"}>{text}</Text>
    </>
}