import {Platform, useWindowDimensions} from "react-native"

export const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function useIsLandscape() {
    const {height, width} = useWindowDimensions()
    return width > height
}

export function useIsWeb() {
    return Platform.OS === 'web';
}

export function search(string: string, query: string) {
    const mainLength: number = string.length;
    let searchIndex: number = 0;

    for (let i = 0; i < mainLength && searchIndex < query.length; i++) {
        if (query[searchIndex] === ' ' || query[searchIndex].toLowerCase() === string[i].toLowerCase()) {
            searchIndex++;
        }
    }
    return searchIndex === query.length;
}

export function newShade(hexColor: string, magnitude: number) {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
}