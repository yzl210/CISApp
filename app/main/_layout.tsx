import {Tabs} from "expo-router";
import {Home, List, Settings} from "@tamagui/lucide-icons";

export default function MainLayout() {
    return <Tabs>
        <Tabs.Screen name="home" options={{
            title: "Home",
            href: "main/home",
            tabBarIcon: props => <Home {...props}/>
        }}/>
        <Tabs.Screen name="browse" options={{
            title: "Browse",
            href: "main/browse",
            tabBarIcon: props => <List {...props}/>
        }}/>
        <Tabs.Screen name="manage" options={{
            title: "Manage",
            href: "main/manage",
            tabBarIcon: props => <Settings {...props}/>
        }}/>
    </Tabs>;
}