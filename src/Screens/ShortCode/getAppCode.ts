import { getBundleId } from "react-native-device-info";
import { appIds, shortCodes } from "../../utils/constants/DynamicAppKeys";

export const getAppCode = () => {
    switch (getBundleId()) {
        case appIds.gusto: return shortCodes.gusto;
        case appIds.gokab: return shortCodes.gokab;
        case appIds.grub: return shortCodes.grub;
        case appIds.ace: return shortCodes.ace;
        default: return 'd1b1a0'
    }
}