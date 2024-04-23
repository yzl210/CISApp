import {router} from "expo-router";
import {Card, H3, H5, Image, Separator, Spinner, Text, View, XStack} from "tamagui";
import {Dot} from "@tamagui/lucide-icons";
import {Machine, useTags, useTasks} from "../../api/machine";
import {FlatList} from "react-native";
import TagComponent from "../TagComponent";


export default function MachineOverview({machine}: { machine: Machine }) {

    const {tasks} = useTasks(machine.id);
    const {tags} = useTags(machine.id);

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
                        {machine.model ? <H5 color={"grey"} alignSelf={"center"}>{machine.model}</H5> : null}
                    </View>
                    <Separator vertical marginHorizontal={"$3"}/>
                    <Image source={{uri: machine.image, width: 100, height: 100}}></Image>
                </XStack>
                {tags && tags.length > 0 ? <Separator marginVertical={"$2"}/> : null}
                {tags ? <XStack>
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