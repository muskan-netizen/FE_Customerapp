import { getBundleId } from "react-native-device-info";
import { appIds, shortCodes } from "../../utils/constants/DynamicAppKeys";

export const getAppCode = () => {
    switch (getBundleId()) {
        case appIds.gusto: return shortCodes.gusto;
        default: return 'd1b1a0'
    }
}