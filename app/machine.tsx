import {Redirect, Stack, useLocalSearchParams} from "expo-router";
import {ScrollView} from "react-native";
import {getMachine} from "../api/API";
import MachineInfo from "../components/box/MachineInfo";
import MachineTask from "../components/box/MachineTask";

export default function Machine() {
    const {id} = useLocalSearchParams<{ id: string }>();

    if (id === undefined || id === "") {
        return <Redirect href={"/"}/>;
    }

    let machine = getMachine(id);

    return <ScrollView>
        <Stack.Screen
            options={{
                title: machine.name,
                headerBackTitle: 'Back',
            }}
        />
        <MachineInfo machine={machine}/>
        <MachineTask machine={machine}/>
    </ScrollView>;
}