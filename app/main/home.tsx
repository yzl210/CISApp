import MachineOverview from "../../components/card/MachineOverview";
import {getMaintenanceNeeded, getPins, Machine} from "../../api/API";
import React from "react";
import {ScrollView, SizableText, Tabs, View} from "tamagui";
import {AlertTriangle, Pin} from "@tamagui/lucide-icons";

export default function HomeScreen() {

    return (
        <Tabs
            defaultValue={"pinned"}
            orientation={"horizontal"}
            flexDirection={"column"}
            height={"94%"}
        >
            <Tabs.List>
                <Tabs.Tab flex={1} value={"pinned"} bordered={false}>
                    <Pin scale={0.8} marginRight={"$0.5"}/>
                    <SizableText>Pinned</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value={"maintenance-needed"} bordered={false}>
                    <AlertTriangle scale={0.8} marginRight={"$1"}/>
                    <SizableText>Maintenance Needed</SizableText>
                </Tabs.Tab>
            </Tabs.List>

            <MachineCategory value={"pinned"} machines={getPins()}/>
            <MachineCategory value={"maintenance-needed"} machines={getMaintenanceNeeded()}/>

        </Tabs>
    );
}

function MachineCategory({value, machines}: { value: string, machines: Machine[] }) {
    return <Tabs.Content height={"100%"} value={value} alignItems={"center"}>
        <ScrollView>
            <View gap={"$3"} flex={1} flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"}>
                {machines.map(machine => <MachineOverview key={machine.id} machine={machine}/>)}
            </View>
        </ScrollView>
    </Tabs.Content>
}
