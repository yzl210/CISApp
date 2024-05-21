import MachineOverview from "../../components/machine/MachineOverview";
import React from "react";
import {ScrollView, SizableText, Tabs} from "tamagui";
import {AlertTriangle, Pin} from "@tamagui/lucide-icons";
import {getMaintenanceNeeded, getPins, Machine} from "../../api/machine";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";
import Loading from "../../components/Loading";
import {LmGrid} from "@tamagui-extras/core";

export default function HomeScreen() {
    const {data: pins} = useQuery(getPins());
    const {data: maintenanceNeeded} = useQuery(getMaintenanceNeeded());

    if (!pins || !maintenanceNeeded) {
        return <Loading/>
    }

    return (
        <Tabs
            defaultValue={"pinned"}
            orientation={"horizontal"}
            flexDirection={"column"}
            height={"95%"}
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
            <MachineCategory value={"pinned"} machines={pins}/>
            <MachineCategory value={"maintenance-needed"} machines={maintenanceNeeded}/>

        </Tabs>
    );
}

function MachineCategory({value, machines}: { value: string, machines: Machine[] }) {
    return <Tabs.Content marginTop={"$3"} height={"100%"} value={value} alignItems={"center"}>
        <ScrollView>
            <LmGrid row flexWrap={"wrap"} gap={"$3"} justifyContent={"center"}>
                {machines.map(machine => <LmGrid key={machine.id}><MachineOverview machine={machine}/></LmGrid>)}
            </LmGrid>
        </ScrollView>
    </Tabs.Content>
}
