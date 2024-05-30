import {Card, Spinner, View} from "tamagui";

export default function Loading() {
    return <View height={"100%"} alignItems={"center"} justifyContent={"center"}>
        <Spinner size={"large"}/>
    </View>
}

export function LoadingCard() {
    return <Card bordered elevate>
        <Card.Header>
            <Loading/>
        </Card.Header>
    </Card>
}