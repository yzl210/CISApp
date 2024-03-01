import {FlatList} from "react-native";

import {Machine, Task} from "../../api/API";
import {ListRenderItemInfo} from "@react-native/virtualized-lists/Lists/VirtualizedList";
import {router} from "expo-router";
import {Card, H3, Image, Separator, Text, View, XStack} from "tamagui";
import {Dot} from "@tamagui/lucide-icons";

export default function MachineOverview({machine}: { machine: Machine }) {
    let done = machine.tasks.filter(task => task.done).length + "/" + machine.tasks.length;

    let tasks = machine.tasks.filter(task => !task.done);

    let taskRenderer = ({item}: ListRenderItemInfo<Task>) => (
        <XStack marginVertical={"$1"}>
            <Dot scale={2}/>
            <Text alignSelf={"center"}>{item.title}</Text>
        </XStack>
    );

    let openMachine = () => {
        router.navigate({pathname: '/machine', params: {id: machine.id}});
    }

    return (
        <Card elevate bordered onPress={openMachine} hoverStyle={{scale: 0.975}} pressStyle={{scale: 0.95}}
              animation={"quick"}>
            <Card.Header padded>
                <XStack>
                    <View alignSelf={"center"} maxWidth={"$19"}>
                        <H3 alignSelf={"center"}>{machine.name}</H3>
                    </View>
                    <Separator vertical marginHorizontal={"$3"}/>
                    <Image source={{uri: machine.image, width: 100, height: 100}}></Image>
                </XStack>
                <Separator marginVertical={"$2"}/>
                <FlatList data={tasks} renderItem={taskRenderer} scrollEnabled={false}/>
            </Card.Header>
        </Card>
    );
}