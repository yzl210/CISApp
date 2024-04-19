import {Tabs} from "expo-router";
import {Home, List, Settings} from "@tamagui/lucide-icons";

export default function MainLayout() {
    return <Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen name="home" options={{
            title: "Home",
            href: "main/home",
            tabBarIcon: ({size, color}) => <Home size={size} color={color}/>
        }}/>
        <Tabs.Screen name="browse" options={{
            title: "Browse",
            href: "main/browse",
            tabBarIcon: ({size, color}) => <List size={size} color={color}/>
        }}/>
        <Tabs.Screen name="manage" options={{
            title: "Manage",
            href: "main/manage",
            tabBarIcon: ({size, color}) => <Settings size={size} color={color}/>
        }}/>
    </Tabs>;
}