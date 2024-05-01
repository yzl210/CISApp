import React, {useEffect, useState} from "react";
import {Button, H2, View} from "tamagui";
import {BarcodeScanningResult, Camera, CameraView} from "expo-camera/next";
import {router} from "expo-router";
import Loading from "../../components/Loading";
import {StyleSheet} from "react-native";

export default function Scan() {
    const [status, setStatus] = useState<'granted' | 'undetermined' | 'denied'>('undetermined');
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        Camera.requestCameraPermissionsAsync()
            .then(({status}) => {
                setStatus(status);
            })
    }, []);


    if (status === 'undetermined') {
        return <Loading/>
    }

    if (status === 'denied') {
        return <View justifyContent={"center"} height={"100%"} alignItems={"center"}>
            <H2>Camera access denied</H2>
        </View>
    }

    const handleBarCodeScanned = ({data}: BarcodeScanningResult) => {
        setScanned(true);
        router.navigate({pathname: '/machine', params: {id: data}});
    };

    return (
        <View style={StyleSheet.absoluteFillObject}>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                <Button onPress={() => setScanned(false)}>
                    Tap to Scan Again
                </Button>
            )}
        </View>
    );
}