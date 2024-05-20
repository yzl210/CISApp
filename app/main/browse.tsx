import {FlatList, Pressable} from "react-native";
import React, {useState} from "react";
import {Button, Input, Separator, Text, View, XStack} from "tamagui";
import {router} from "expo-router";
import {Machine, useAllMachines, useTags} from "../../api/machine";
import Loading from "../../components/Loading";
import TagComponent from "../../components/TagComponent";
import {search} from "../../api/utils";
import MachineInfoEditDialog from "../../components/machine/MachineInfoEditDialog";
import {Plus} from "@tamagui/lucide-icons";
import {useRole} from "../../api/API";
import {canCreateMachine} from "../../api/users";
import {Image} from "expo-image";

export default function Browse() {
    const [query, setQuery] = useState('');
    const {machines} = useAllMachines();
    const {role} = useRole();

    if (!role) {
        return <Loading/>
    }

    return (
        <View height={"100%"} backgroundColor={"white"}>
            <XStack marginBottom={"$2"}>
                {canCreateMachine(role) ?
                    <MachineInfoEditDialog create={true}>
                        <Button theme={"green"} borderRadius={0} icon={Plus}/>
                    </MachineInfoEditDialog> : null}
                <Input
                    borderRadius={0}
                    width={"100%"}
                    placeholder={"Search..."}
                    value={query}
                    onChangeText={setQuery}
                />
            </XStack>
            {machines ? <MachineList query={query}
                                     machines={machines}/> :
                <Loading/>}
        </View>
    );
}

function MachineList({query, machines}: { query: string, machines: Machine[] }) {
    if (machines.length < 1) {
        return <Text color={"gray"} alignSelf={"center"} marginVertical={"$2"}>No result</Text>;
    }

    let filtered = machines ? query.length < 1 ? machines : machines
        .filter((m, i) => search(m.name, query)) : []

    return <FlatList data={filtered} renderItem={(item) => <MachineEntry machine={item.item}/>}/>;
}

function MachineEntry({machine}: { machine: Machine }) {
    const {tags} = useTags(machine.id);


    let openMachine = () => {
        router.navigate({pathname: '/machine', params: {id: machine.id}});
    }

    return <Pressable onPress={openMachine}>
        <View key={machine.id}>
            <XStack marginHorizontal={"$2"} alignItems={"center"} gap={"$2"} flexWrap={"wrap"}>
                <Image source={machine.image} style={{width: 50, height: 50}} contentFit={"contain"}/>
                <Separator backgroundColor={"darkgray"} vertical/>
                <Text fontSize={20}>{machine.name}</Text>
                <Separator backgroundColor={"darkgray"} vertical/>
                {tags ? tags.map(tag => <TagComponent key={tag.id} tag={tag}/>) : null}
            </XStack>
            <Separator backgroundColor={"darkgray"} marginVertical={"$2"}/>
        </View>
    </Pressable>
}