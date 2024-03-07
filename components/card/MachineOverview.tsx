import {ActivityIndicator, FlatList} from "react-native";

import {router} from "expo-router";
import {Card, H3, Image, Separator, Text, View, XStack} from "tamagui";
import {Dot} from "@tamagui/lucide-icons";
import {getMachineTasks, getTasks, Machine} from "../../api/machine";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";

export default function MachineOverview({machine}: { machine: Machine }) {

    const {data: machineTasks} = useQuery(getMachineTasks(machine.id));
    const {data: tasks} = useQuery(getTasks(machineTasks ?? []), {
        enabled: !!machineTasks
    });

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
                {tasks ? <FlatList data={tasks} renderItem={({item: task}) => (
                    <XStack marginVertical={"$1"}>
                        <Dot scale={2}/>
                        <Text alignSelf={"center"}>{task.name}</Text>
                    </XStack>
                )} scrollEnabled={false}/> : <ActivityIndicator/>}
            </Card.Header>
        </Card>
    );
}