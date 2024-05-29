import { getBundleId } from "react-native-device-info";
import { appIds, shortCodes } from "../../utils/constants/DynamicAppKeys";

export const getAppCode = () => {
    switch (getBundleId()) {
        case appIds.royoorder: return shortCodes.royoorder;
        case appIds.ace: return shortCodes.ace;
        case appIds.grub: return shortCodes.grub;
        case appIds.gusto: return shortCodes.gusto;
        case appIds.gokab: return shortCodes.gokab;
        case appIds.punnet: return shortCodes.punnet;
        case appIds.homeric: return shortCodes.homeric;
        case appIds.voltaic: return shortCodes.voltaic;
        case appIds.zest: return shortCodes.zest;
        case appIds.peerPulse: return shortCodes.peerPulse;
        case appIds.rentzGo: return shortCodes.rentzGo;
        case appIds.suel: return shortCodes.suel;
        case appIds.elixir: return shortCodes.elixir;
        case appIds.spa: return shortCodes.spa;
        case appIds.emart: return shortCodes.emart;
        case appIds.rentzy: return shortCodes.rentzy;
        default: return '2d98b5'
    }
}