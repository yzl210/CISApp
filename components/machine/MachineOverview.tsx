import {router} from "expo-router";
import {Card, H3, H5, Separator, Spinner, Text, View, XStack} from "tamagui";
import {Dot} from "@tamagui/lucide-icons";
import {Machine, useTags} from "../../api/machine";
import {FlatList} from "react-native";
import TagComponent from "../TagComponent";
import {Image} from "expo-image";
import {useTasks} from "../../api/tasks";


export default function MachineOverview({machine}: { machine: Machine }) {
    const {tasks} = useTasks(machine.id, false);
    const {tags} = useTags(machine.id);

    let openMachine = () => {
        router.push({pathname: '/machine', params: {id: machine.id}});
    }

    return (
        <Card elevate bordered onPress={openMachine} hoverStyle={{scale: 0.975}} pressStyle={{scale: 0.95}}
              animation={"quick"}>
            <Card.Header padded>
                <XStack alignSelf={machine.image ? undefined : "center"}>
                    <View alignSelf={"center"}>
                        <H3 alignSelf={"center"}>{machine.name}</H3>
                        {machine.model ? <H5 color={"grey"} alignSelf={"center"}>{machine.model}</H5> : null}
                    </View>
                    {machine.image ? <>
                        <Separator vertical marginHorizontal={"$3"}/>
                        <Image source={machine.image} style={{width: 100, height: 100}} contentFit={"contain"}/>
                    </> : null}
                </XStack>
                {tags && tags.length > 0 ? <Separator marginVertical={"$2"}/> : null}
                {tags ? <XStack gap={"$2"} flexWrap={"wrap"}>
                    {tags.map(tag => <TagComponent tag={tag} key={tag.id}/>)}
                </XStack> : null}
                {tasks && tasks.length > 0 ? <Separator marginVertical={"$2"}/> : null}
                {tasks ? <FlatList data={tasks} renderItem={({item: task}) => (
                    <XStack marginVertical={"$1"}>
                        <Dot scale={2}/>
                        <Text alignSelf={"center"}>{task.name}</Text>
                    </XStack>
                )} scrollEnabled={false} keyExtractor={item => item.id}/> : <Spinner/>}
            </Card.Header>
        </Card>
    );
}

export function SimpleMachineOverview({machine}: { machine: Machine }) {
    let openMachine = () => {
        router.push({pathname: '/machine', params: {id: machine.id}});
    }

    return (
        <Card elevate bordered onPress={openMachine} hoverStyle={{scale: 0.975}} pressStyle={{scale: 0.95}}
              animation={"quick"}>
            <Card.Header padded>
                <XStack alignSelf={machine.image ? undefined : "center"}>
                    <View alignSelf={"center"}>
                        <H3 alignSelf={"center"}>{machine.name}</H3>
                    </View>
                    {machine.image ? <>
                        <Separator vertical marginHorizontal={"$3"}/>
                        <Image source={machine.image} style={{width: 50, height: 50}} contentFit={"contain"}/>
                    </> : null}
                </XStack>
            </Card.Header>
        </Card>
    );
}