import {Tabs} from "expo-router";
import {Camera, Home, List, Settings} from "@tamagui/lucide-icons";
import {useIsLandscape, useIsWeb} from "../../api/utils";
import {Drawer} from "expo-router/drawer";
import {useWindowDimensions} from "react-native";
import {H4} from "tamagui";
import {DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function MainLayout() {
    const isWeb = useIsWeb();
    const isLandscape = useIsLandscape();
    const {width} = useWindowDimensions();


    if (isWeb) {
        return <GestureHandlerRootView>
            <Drawer drawerContent={(props) => <CustomDrawerContent props={props}/>} initialRouteName={"home"}
                    screenOptions={{
                        headerLeft: !isLandscape ? undefined : (props) => null,
                        drawerType: isLandscape ? 'permanent' : 'front',
                        drawerStyle: {width: 200}
                    }}>
                <Drawer.Screen name="home" options={{
                    drawerLabel: "Home",
                    title: "Home",
                    drawerIcon: ({size, color}) => <Home size={size} color={color}/>
                }}/>
                <Drawer.Screen name="browse" options={{
                    drawerLabel: "Browse",
                    title: "Browse",
                    drawerIcon: ({size, color}) => <List size={size} color={color}/>
                }}/>
                <Drawer.Screen name="scan" options={{
                    drawerLabel: "Scan",
                    title: "Scan",
                    drawerIcon: ({size, color}) => <Camera size={size} color={color}/>
                }}/>
                <Drawer.Screen name="manage" options={{
                    drawerLabel: "Manage",
                    title: "Manage",
                    drawerIcon: ({size, color}) => <Settings size={size} color={color}/>
                }}/>
            </Drawer>
        </GestureHandlerRootView>
    }


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
        <Tabs.Screen name="scan" options={{
            title: "Scan",
            href: "main/scan",
            tabBarIcon: ({size, color}) => <Camera size={size} color={color}/>
        }}/>
        <Tabs.Screen name="manage" options={{
            title: "Manage",
            href: "main/manage",
            tabBarIcon: ({size, color}) => <Settings size={size} color={color}/>
        }}/>
    </Tabs>;
}

function CustomDrawerContent({props}: { props: DrawerContentComponentProps }) {
    return <DrawerContentScrollView scrollEnabled={false}>
        <H4 marginVertical={"$3"} textAlign={"center"}>CIS App</H4>
        <DrawerItemList {...props}/>
    </DrawerContentScrollView>
}