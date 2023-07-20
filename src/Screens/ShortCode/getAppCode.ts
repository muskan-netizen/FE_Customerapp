import { getBundleId } from "react-native-device-info";
import { appIds, shortCodes } from "../../utils/constants/DynamicAppKeys";

export const getAppCode = () => {
    switch (getBundleId()) {
        case appIds.dropItOffUsa: return shortCodes.dropOff;
        case appIds.royoorder: return shortCodes.royoorder;
        case appIds.grub: return shortCodes.grub;
        case appIds.gusto: return shortCodes.gusto;
        case appIds.punnet: return shortCodes.punnet;
        case appIds.homeric: return shortCodes.homeric;
        case appIds.voltaic: return shortCodes.voltaic;
        case appIds.zest: return shortCodes.zest;
        case appIds.gokab: return shortCodes.gokab;
        case appIds.elixir: return shortCodes.elixir;
        case appIds.ace: return shortCodes.ace;
        case appIds.suel: return shortCodes.suel;
        case appIds.emart: return shortCodes.emart;
        case appIds.spa: return shortCodes.spa;
        case appIds.skyline: return shortCodes.skyline;
        case appIds.rentzy: return shortCodes.rentzy;
        default: return '245bae'
    }
}