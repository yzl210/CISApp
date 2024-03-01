import {FlatList, TouchableHighlight, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import {Machine, search} from "../../api/API";
import {Image, Input, Separator, Text, View, XStack} from "tamagui";
import {router} from "expo-router";


export default function Browse() {
    const [query, setQuery] = useState('');

    let machines = search(query);

    let openMachine = (machine: Machine) => {
        router.navigate({pathname: '/machine', params: {id: machine.id}});
    }

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
            <FlatList data={machines} renderItem={(item) => {
                return <View key={item.item.id} onPress={() => openMachine(item.item)}>
                    <XStack alignItems={"center"}>
                        <Image source={{uri: item.item.image, width: 50, height: 50}}/>
                        <Separator backgroundColor={"darkgray"} marginHorizontal={"$2"} vertical/>
                        <Text fontSize={20}>{item.item.name}</Text>
                    </XStack>
                    <Separator backgroundColor={"darkgray"} marginVertical={"$2"}/>
                </View>
            }}/>
        </View>
    );
}