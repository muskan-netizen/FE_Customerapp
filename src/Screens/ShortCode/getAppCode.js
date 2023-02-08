import { getBundleId } from "react-native-device-info";
import { appIds, shortCodes } from "../../utils/constants/DynamicAppKeys";


export const getAppCode = () => {

    switch (getBundleId()) {

        case appIds.tranzit: return shortCodes.tranzit

        case appIds.runrun: return shortCodes.runrun;

        case appIds.hmoobhub: return shortCodes.hmoobhub;

        case appIds.capcorp: return shortCodes.capcorp;

        case appIds.masa: return shortCodes.masa;

        case appIds.yogofood: return shortCodes.yogofood;

        case appIds.spidbi: return shortCodes.spidbi;

        case appIds.clicktoeat: return shortCodes.clicktoeat;

        case appIds.instamobile: return shortCodes.instamobile;

        case appIds.bottomsup: return shortCodes.bottomsup;

        case appIds.helpnowrightnow: return shortCodes.helpnowrightnow;

        case appIds.africanvillagemarket: return shortCodes.africanvillagemarket;

        case appIds.ufood: return shortCodes.ufood;

        case appIds.martinionwheels: return shortCodes.martinionwheels;

        case appIds.blip: return shortCodes.blip;

        case appIds.cannabus:return shortCodes.cannabus;

        case appIds.govachow: return shortCodes.govachow;

        case appIds.bustanfakieh: return shortCodes.bustanfakieh;

        case appIds.shariff: return shortCodes.shariff;

        case appIds.gajamove: return shortCodes.gajamove;

        case appIds.getme: return shortCodes.getme;

        case appIds.orbit: return shortCodes.orbit;

        case appIds.carlitoo: return shortCodes.carlitoo;

        case appIds.specialhalal: return shortCodes.specialhalal;

        case appIds.thehouse: return shortCodes.thehouse;

        case appIds.tasmeem: return shortCodes.tasmeem;

        case appIds.snabbhem:return shortCodes.snabbhem;

        case appIds.lastminutedress: return shortCodes.lastminutedress;

        case appIds.rerak: return shortCodes.rerak;

        case appIds.yummiidash: return shortCodes.yummiidash;

        case appIds.yoho: return shortCodes.yoho;

        case appIds.glamsouq: return shortCodes.glamsouq;

        case appIds.doctatransportation: return shortCodes.doctatransportation;

        case appIds.washvalley: return shortCodes.washvalley;

        case appIds.equamd: return shortCodes.equamd;

        case appIds.hellodeliver: return shortCodes.hellodeliver;

        case appIds.hoganchef: return shortCodes.hoganchef;

        case appIds.servze: return shortCodes.servze;

        case appIds.travo: return shortCodes.travo;

        case appIds.cabdelivr: return  shortCodes.cabdelivr;

        case appIds.drus: return shortCodes.drus;

        case appIds.yahu: return shortCodes.yahu;

        case appIds.zuzuclean: return shortCodes.zuzuclean;

        case appIds.towtrek: return shortCodes.towtrek;

        case appIds.arenagrub: return shortCodes.arenagrub;

        case appIds.jet: return shortCodes.jet;

        case appIds.africanize: return shortCodes.africanize;

        case appIds.markita: return shortCodes.markita;

        case appIds.sirvu: return shortCodes.sirvu;

        case appIds.ublue: return shortCodes.ublue;

        case appIds.mstechy: return shortCodes.mstechy;

        case appIds.senshive: return shortCodes.senshive;

        case appIds.ridemate: return shortCodes.ridemate;

        case appIds.codiner: return shortCodes.codiner;

        case appIds.housekeeper: return shortCodes.housekeeper;

        case appIds.hairstonexpress: return shortCodes.hairstonexpress;

        case appIds.diamonddashers: return shortCodes.diamonddashers;

        case appIds.destinationOps: return shortCodes.destinationOps;

        case appIds.loopwhole: return shortCodes.loopwhole;

        case appIds.vici: return shortCodes.vici;

        case appIds.carhop: return shortCodes.carhop;

        case appIds.yogolift: return shortCodes.yogolift;

        case appIds.fleety: return shortCodes.fleety;

        case appIds.flyinghorse: return shortCodes.flyinghorse;

        case appIds.errand: return shortCodes.errand;

        case appIds.partnerproject: return shortCodes.partnerproject;

        case appIds.menus: return shortCodes.menus;

        case appIds.doorstep: return shortCodes.doorstep;

        case appIds.sunshinerideshare: return shortCodes.sunshinerideshare;

        case appIds.autotek: return shortCodes.autotek;

        case appIds.wegotit: return shortCodes.wegotit;

        case appIds.survuhs: return shortCodes.survuhs;

        case appIds.igolux: return shortCodes.igolux;

        case appIds.toda: return shortCodes.toda;

        case appIds.mobi: return shortCodes.mobi;

        case appIds.yourlaundryapp: return shortCodes.yourlaundryapp;

        case appIds.hemptyfy: return shortCodes.hemptyfy;

        case appIds.sharu: return shortCodes.sharu;

        case appIds.smcompany: return shortCodes.smcompany;

        case appIds.totum4U: return shortCodes.totum4U;

        case appIds.hmc: return shortCodes.hmc;

        case appIds.groupy: return shortCodes.groupy;

        case appIds.weeat: return shortCodes.weeat;

        case appIds.gorillas: return shortCodes.gorillas;

        case appIds.baytukom: return shortCodes.baytukom;

        case appIds.eboyo: return shortCodes.eboyo;

        case appIds.vecto: return shortCodes.vecto;

        case appIds.share: return shortCodes.share;

        case appIds.pickmeup: return shortCodes.pickmeup;

        case appIds.taquick: return shortCodes.taquick;

        case appIds.goody:  return shortCodes.goody;

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

        case appIds.empire: return shortCodes.empire;

        case appIds.expressdelivery: return shortCodes.expressdelivery;

        case appIds.booziedoozie:  return shortCodes.booziedoozie;

        case appIds.zestyclickz: return shortCodes.zestyclickz;

        case appIds.bakesale: return shortCodes.bakesale;

        case appIds.elcheregio: return shortCodes.elcheregio;

        case appIds.yaawi: return shortCodes.yaawi;

        case appIds.hosta: return shortCodes.hosta;

        case appIds.somame: return shortCodes.somame;

        case appIds.goodwheelz: return shortCodes.goodwheelz;

        case appIds.tranznet: return shortCodes.tranznet;

        case appIds.sambiga: return shortCodes.sambiga;

        case appIds.agrionline: return shortCodes.agrionline;

        case appIds.quickquick: return shortCodes.quickquick;

        case appIds.caribeclean: return shortCodes.caribeclean;

        case appIds.stonses: return shortCodes.stonses;

        case appIds.agbdeliveries: return shortCodes.agbdeliveries;

        case appIds.bookem: return shortCodes.bookem;

        case appIds.twofinder: return shortCodes.twofinder;

        case appIds.zip: return shortCodes.zip;

        case appIds.ridetci: return shortCodes.ridetci;

        case appIds.noki: return shortCodes.noki;

        case appIds.driveree: return shortCodes.driveree;

        case appIds.rxnow: return shortCodes.rxnow;

        case appIds.seachangevending: return shortCodes.seachangevending;

        case appIds.ored: return shortCodes.ored;

        case appIds.orderchekout: return shortCodes.orderchekout;

        case appIds.maxisdelivery: return shortCodes.maxisdelivery;

        case appIds.donepacked: return shortCodes.donepacked;

        case appIds.careworks: return shortCodes.careworks; 

        case appIds.thubaerides: return shortCodes.thubaerides;

        case appIds.pinkjet: return shortCodes.pinkjet;

        case appIds.mokabfix: return shortCodes.mokabfix;

        case appIds.botseats: return shortCodes.botseats;

        case appIds.gumastas: return shortCodes.gumastas;

        case appIds.dishefs: return shortCodes.dishefs;

        case appIds.bilionza: return shortCodes.bilionza;

        case appIds.doleypharmacy: return shortCodes.doleypharmacy;

        case appIds.bezalio: return shortCodes.bezalio;

        case appIds.youchillax: return shortCodes.youchillax;

        case appIds.instashop: return shortCodes.instashop;

        case appIds.shoorafresh: return shortCodes.shoorafresh;

        case appIds.click2deliver: return shortCodes.click2deliver;

        case appIds.trucktirenow: return shortCodes.trucktirenow;

        case appIds.yeboy: return shortCodes.yeboy;

        case appIds.kel360: return shortCodes.kel360;

        case appIds.moboserrandsservice: return shortCodes.moboserrandsservice;

        case appIds.cabway: return shortCodes.cabway;

        case appIds.tajammul: return shortCodes.tajammul;

        case appIds.carroai: return shortCodes.carroai;

        case appIds.ssuum: return shortCodes.ssuum;

        case appIds.blacnetwork: return shortCodes.blacnetwork;

        case appIds.threadagain: return shortCodes.threadagain;

        case appIds.ezmobilefuel: return shortCodes.ezmobilefuel;

        case appIds.runaround: return shortCodes.runaround;

        case appIds.swiftandvalu: return shortCodes.swiftandvalu;

        case appIds.trucxi: return shortCodes.trucxi;

        case appIds.paysic: return shortCodes.paysic;

        case appIds.chipetaxi: return shortCodes.chipetaxi;

        case appIds.laundryorders: return shortCodes.laundryorders; 

        case appIds.ineed: return shortCodes.ineed;

        case appIds.nadelivery: return shortCodes.nadelivery;

        case appIds.marasym: return shortCodes.marasym;

        case appIds.silvestre: return shortCodes.silvestre;

        case appIds.samakeemart: return shortCodes.samakeemart;

        case appIds.seaeats: return shortCodes.seaeats;

        case appIds.enext: return shortCodes.enext;

        case appIds.hokitch: return shortCodes.hokitch;

        case appIds.foodnests: return shortCodes.foodnests;

        case appIds.sponge: return shortCodes.sponge;

        case appIds.gomeat: return shortCodes.gomeat;

        case appIds.shopcentral: return shortCodes.shopcentral;

        case appIds.skidoo: return shortCodes.skidoo;

        case appIds.admCourier: return shortCodes.admCourier;

        case appIds.kurbsidekings: return shortCodes.kurbsidekings;

        case appIds.movingwheelsdelivery: return shortCodes.movingwheelsdelivery;

        case appIds.safewalks: return shortCodes.safewalks;

        case appIds.dimavega: return shortCodes.dimavega;

        case appIds.skoop: return shortCodes.skoop;

        case appIds.kudhyo: return shortCodes.kudhyo;

        case appIds.bharatMove: return shortCodes.bharatMove;

        case appIds.sofia: shortCodes.sofia;

        case appIds.mml: return shortCodes.mml;

        case appIds.bimol: return shortCodes.bimol;

        case appIds.vendorspot: return shortCodes.vendorspot;

        case appIds.sxm2go: return shortCodes.sxm2go;

        case appIds.pinkydeli: return shortCodes.pinkydeli;

        case appIds.gasgiant: return shortCodes.gasgiant;

        case appIds.releezer: return shortCodes.releezer;

        case appIds.vendoor: return shortCodes.vendoor;

        case appIds.farmersouq: return shortCodes.farmersouq;

        case appIds.tmgShops: return shortCodes.tmgShops;

        case appIds.stitchesonsite: return shortCodes.stitchesonsite;

        case appIds.easyu: return shortCodes.easyu;

        case appIds.mozmarcas: return shortCodes.mozmarcas;

        case appIds.myfiji: return shortCodes.myfiji;

        case appIds.fastmikes: return shortCodes.fastmikes;

        case appIds.citysuds: return shortCodes.citysuds;
            
        case appIds.homeTownDelivery: return shortCodes.homeTownDelivery;

        case appIds.ritenow: return shortCodes.ritenow;
            
        case appIds.flit: return shortCodes.flit;

        case appIds.ihelp: return  shortCodes.ihelp;

        case appIds.ullaz: return shortCodes.ullaz;

        case appIds.privatepremiumpickups: return shortCodes.privatepremiumpickups;

        case appIds.fidesDelivery: return shortCodes.fidesDelivery;

        case appIds.bksTaxi:  return shortCodes.bksTaxi;

        case appIds.oxo: return shortCodes.oxo;

        case appIds.sijang:  return shortCodes.sijang;

        case appIds.fairex: return shortCodes.fairex;

        case appIds.everywhere: return shortCodes.everywhere;

        case appIds.cannabisClubSF: return shortCodes.cannabisClubSF;

        case appIds.halaTalabat: return shortCodes.halaTalabat;

        // case appIds.palmettoplus:
        //     updateState({
        //         shortCode: shortCodes.palmettoplus,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.allotaxi:
        //     updateState({
        //         shortCode: shortCodes.allotaxi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.jadorDrive:
        //     updateState({
        //         shortCode: shortCodes.jadorDrive,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.ubercann:
        //     updateState({
        //         shortCode: shortCodes.ubercann,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.kongafood:
        //     updateState({
        //         shortCode: shortCodes.kongafood,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.launch:
        //     updateState({
        //         shortCode: shortCodes.launch,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.kampick:
        //     updateState({
        //         shortCode: shortCodes.kampick,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.cabio:
        //     updateState({
        //         shortCode: shortCodes.cabio,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.tumbak:
        //     updateState({
        //         shortCode: shortCodes.tumbak,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.iPicknDrop:
        //     updateState({
        //         shortCode: shortCodes.iPicknDrop,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.bluebolt:
        //     updateState({
        //         shortCode: shortCodes.bluebolt,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.onthego:
        //     updateState({
        //         shortCode: shortCodes.onthego,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.mylaglobal:
        //     updateState({
        //         shortCode: shortCodes.mylaglobal,
        //         isShortcodePrefilled: true,
        //     });
        //     return;
        // case appIds.ambutap:
        //     updateState({
        //         shortCode: shortCodes.ambutap,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.sabroson:
        //     updateState({
        //         shortCode: shortCodes.sabroson,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.swiffyllc:
        //     updateState({
        //         shortCode: shortCodes.swiffyllc,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.meatEasy:
        //     updateState({
        //         shortCode: shortCodes.meatEasy,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.boltDelivery:
        //     updateState({
        //         shortCode: shortCodes.boltDelivery,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.gamaDelivery:
        //     updateState({
        //         shortCode: shortCodes.gamaDelivery,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.hivefair:
        //     updateState({
        //         shortCode: shortCodes.hivefair,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.localdropoff:
        //     updateState({
        //         shortCode: shortCodes.localdropoff,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.ubi:
        //     updateState({
        //         shortCode: shortCodes.ubi,
        //         isShortcodePrefilled: true,
        //     });

        //     return;
        // case appIds.beakme:
        //     updateState({
        //         shortCode: shortCodes.beakme,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.onscart:
        //     updateState({
        //         shortCode: shortCodes.onscart,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.mandaExpress:
        //     updateState({
        //         shortCode: shortCodes.mandaExpress,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.foodies:
        //     updateState({
        //         shortCode: shortCodes.foodies,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.gO:
        //     updateState({
        //         shortCode: shortCodes.gO,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.bauBau:
        //     updateState({
        //         shortCode: shortCodes.bauBau,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.bookARyde:
        //     updateState({
        //         shortCode: shortCodes.bookARyde,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.petsChoice:
        //     updateState({
        //         shortCode: shortCodes.petsChoice,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.heyBuddy:
        //     updateState({
        //         shortCode: shortCodes.heyBuddy,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.yoloSonic:
        //     updateState({
        //         shortCode: shortCodes.yoloSonic,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.mrHealth:
        //     updateState({
        //         shortCode: shortCodes.mrHealth,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.lopht:
        //     updateState({
        //         shortCode: shortCodes.lopht,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.yalary:
        //     updateState({
        //         shortCode: shortCodes.yalary,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.seratho:
        //     updateState({
        //         shortCode: shortCodes.seratho,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.xborne:
        //     updateState({
        //         shortCode: shortCodes.xborne,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.fawaz:
        //     updateState({
        //         shortCode: shortCodes.fawaz,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.grn:
        //     updateState({
        //         shortCode: shortCodes.grn,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.delivadrinks:
        //     updateState({
        //         shortCode: shortCodes.delivadrinks,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.myRide:
        //     updateState({
        //         shortCode: shortCodes.myRide,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.getfix:
        //     updateState({
        //         shortCode: shortCodes.getfix,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.scoopaTechnologies:
        //     updateState({
        //         shortCode: shortCodes.scoopaTechnologies,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.dbairro:
        //     updateState({
        //         shortCode: shortCodes.dbairro,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.knockknock:
        //     updateState({
        //         shortCode: shortCodes.knockknock,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.qrider:
        //     updateState({
        //         shortCode: shortCodes.qrider,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.dlvrd:
        //     updateState({
        //         shortCode: shortCodes.dlvrd,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.delivery:
        //     updateState({
        //         shortCode: shortCodes.delivery,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.timHomeServices:
        //     updateState({
        //         shortCode: shortCodes.timHomeServices,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.slider:
        //     updateState({
        //         shortCode: shortCodes.slider,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.ICare:
        //     updateState({
        //         shortCode: shortCodes.ICare,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.viversbox:
        //     updateState({
        //         shortCode: shortCodes.viversbox,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.scootz:
        //     updateState({
        //         shortCode: shortCodes.scootz,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.ola:
        //     updateState({
        //         shortCode: shortCodes.ola,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.spliffnation:
        //     updateState({
        //         shortCode: shortCodes.spliffnation,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.sourcesServices:
        //     updateState({
        //         shortCode: shortCodes.sourcesServices,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.wer:
        //     updateState({
        //         shortCode: shortCodes.wer,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.beachhop:
        //     updateState({
        //         shortCode: shortCodes.beachhop,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.qseek:
        //     updateState({
        //         shortCode: shortCodes.qseek,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.delvento:
        //     updateState({
        //         shortCode: shortCodes.delvento,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.rideshare:
        //     updateState({
        //         shortCode: shortCodes.rideshare,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.bua:
        //     updateState({
        //         shortCode: shortCodes.bua,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.upstreet:
        //     updateState({
        //         shortCode: shortCodes.upstreet,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.newYorkMiniMart:
        //     updateState({
        //         shortCode: shortCodes.newYorkMiniMart,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.airlinesRecruiter:
        //     updateState({
        //         shortCode: shortCodes.airlinesRecruiter,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.nineOneTwo:
        //     updateState({
        //         shortCode: shortCodes.nineOneTwo,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.trip:
        //     updateState({
        //         shortCode: shortCodes.trip,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.aauJau:
        //     updateState({
        //         shortCode: shortCodes.aauJau,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.mediPick:
        //     updateState({
        //         shortCode: shortCodes.mediPick,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.meltivers:
        //     updateState({
        //         shortCode: shortCodes.meltivers,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.ensoDigitalAgency:
        //     updateState({
        //         shortCode: shortCodes.ensoDigitalAgency,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.hiperAbasto:
        //     updateState({
        //         shortCode: shortCodes.hiperAbasto,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.redglee:
        //     updateState({
        //         shortCode: shortCodes.redglee,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.dropItOffUsa:
        //     updateState({
        //         shortCode: shortCodes.dropItOffUsa,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.handyPickup:
        //     updateState({
        //         shortCode: shortCodes.handyPickup,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.TJJHub:
        //     updateState({
        //         shortCode: shortCodes.TJJHub,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.curblerLLC:
        //     updateState({
        //         shortCode: shortCodes.curblerLLC,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.cartnar:
        //     updateState({
        //         shortCode: shortCodes.cartnar,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.uven:
        //     updateState({
        //         shortCode: shortCodes.uven,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.pAS41:
        //     updateState({
        //         shortCode: shortCodes.pAS41,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.freshFarmz:
        //     updateState({
        //         shortCode: shortCodes.freshFarmz,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.ryde:
        //     updateState({
        //         shortCode: shortCodes.ryde,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.waterTaxi:
        //     updateState({
        //         shortCode: shortCodes.waterTaxi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.muvpod:
        //     updateState({
        //         shortCode: shortCodes.muvpod,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.smile:
        //     updateState({
        //         shortCode: shortCodes.smile,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.caronaTaxi:
        //     updateState({
        //         shortCode: shortCodes.caronaTaxi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.arwin:
        //     updateState({
        //         shortCode: shortCodes.arwin,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.marjMarketplace:
        //     updateState({
        //         shortCode: shortCodes.marjMarketplace,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.eVSOnTheGo:
        //     updateState({
        //         shortCode: shortCodes.eVSOnTheGo,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.kazakazi:
        //     updateState({
        //         shortCode: shortCodes.kazakazi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.papiruki:
        //     updateState({
        //         shortCode: shortCodes.papiruki,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.markSoublet:
        //     updateState({
        //         shortCode: shortCodes.markSoublet,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.amstaFood:
        //     updateState({
        //         shortCode: shortCodes.amstaFood,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.toor:
        //     updateState({
        //         shortCode: shortCodes.toor,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.peerDeliveries:
        //     updateState({
        //         shortCode: shortCodes.peerDeliveries,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.swan:
        //     updateState({
        //         shortCode: shortCodes.swan,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.SCOOTUP:
        //     updateState({
        //         shortCode: shortCodes.SCOOTUP,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.patrolNow:
        //     updateState({
        //         shortCode: shortCodes.patrolNow,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.butlerDelivery:
        //     updateState({
        //         shortCode: shortCodes.butlerDelivery,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.swatiRX:
        //     updateState({
        //         shortCode: shortCodes.swatiRX,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.chowHub:
        //     updateState({
        //         shortCode: shortCodes.chowHub,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.ginDeliver:
        //     updateState({
        //         shortCode: shortCodes.ginDeliver,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.orderFirst:
        //     updateState({
        //         shortCode: shortCodes.orderFirst,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.maiz:
        //     updateState({
        //         shortCode: shortCodes.maiz,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.dingDongEat:
        //     updateState({
        //         shortCode: shortCodes.dingDongEat,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.medicab:
        //     updateState({
        //         shortCode: shortCodes.medicab,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.fazeiTeam:
        //     updateState({
        //         shortCode: shortCodes.fazeiTeam,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.weTogether:
        //     updateState({
        //         shortCode: shortCodes.weTogether,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.jiffex:
        //     updateState({
        //         shortCode: shortCodes.jiffex,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.clickService:
        //     updateState({
        //         shortCode: shortCodes.clickService,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.amazingTaxi:
        //     updateState({
        //         shortCode: shortCodes.amazingTaxi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.jazzyBug:
        //     updateState({
        //         shortCode: shortCodes.jazzyBug,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.myfarma:
        //     updateState({
        //         shortCode: shortCodes.myfarma,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.valley:
        //     updateState({
        //         shortCode: shortCodes.valley,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.kartAndKarry:
        //     updateState({
        //         shortCode: shortCodes.kartAndKarry,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.quickLube:
        //     updateState({
        //         shortCode: shortCodes.quickLube,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.keystoneDelivery:
        //     updateState({
        //         shortCode: shortCodes.keystoneDelivery,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.blueBundles:
        //     updateState({
        //         shortCode: shortCodes.blueBundles,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.busTaMove:
        //     updateState({
        //         shortCode: shortCodes.busTaMove,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.atasktt:
        //     updateState({
        //         shortCode: shortCodes.atasktt,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.lunchboxSpecials:
        //     updateState({
        //         shortCode: shortCodes.lunchboxSpecials,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.sorDelivery:
        //     updateState({
        //         shortCode: shortCodes.sorDelivery,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.grubHouse:
        //     updateState({
        //         shortCode: shortCodes.grubHouse,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.hitchDelivery:
        //     updateState({
        //         shortCode: shortCodes.hitchDelivery,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.zoodMarket:
        //     updateState({
        //         shortCode: shortCodes.zoodMarket,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.meow:
        //     updateState({
        //         shortCode: shortCodes.meow,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.dingDongDelivers:
        //     updateState({
        //         shortCode: shortCodes.dingDongDelivers,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.torunz:
        //     updateState({
        //         shortCode: shortCodes.torunz,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        case appIds.kurs: return shortCodes.kurs;

        // case appIds.spa:
        //     updateState({
        //         shortCode: shortCodes.spa,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.capitalDiagnostic:
        //     updateState({
        //         shortCode: shortCodes.capitalDiagnostic,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.abbeRides:
        //     updateState({
        //         shortCode: shortCodes.abbeRides,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.nrsa:
        //     updateState({
        //         shortCode: shortCodes.nrsa,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.sadia:
        //     updateState({
        //         shortCode: shortCodes.sadia,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.elentaMart:
        //     updateState({
        //         shortCode: shortCodes.elentaMart,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.exprexPro:
        //     updateState({
        //         shortCode: shortCodes.exprexPro,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.fresHest:
        //     updateState({
        //         shortCode: shortCodes.fresHest,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.servern:
        //     updateState({
        //         shortCode: shortCodes.servern,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.smokeRun:
        //     updateState({
        //         shortCode: shortCodes.smokeRun,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.myEvPlus:
        //     updateState({
        //         shortCode: shortCodes.myEvPlus,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.qdelo:
        //     updateState({
        //         shortCode: shortCodes.qdelo,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.pawsee:
        //     updateState({
        //         shortCode: shortCodes.pawsee,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.hairRun:
        //     updateState({
        //         shortCode: shortCodes.hairRun,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.zuriRide:
        //     updateState({
        //         shortCode: shortCodes.zuriRide,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.americanLuxury:
        //     updateState({
        //         shortCode: shortCodes.americanLuxury,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.smartMur:
        //     updateState({
        //         shortCode: shortCodes.smartMur,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.ouiSpeed:
        //     updateState({
        //         shortCode: shortCodes.ouiSpeed,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.getItSent:
        //     updateState({
        //         shortCode: shortCodes.getItSent,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.easyDrink:
        //     updateState({
        //         shortCode: shortCodes.easyDrink,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.iAmSelling:
        //     updateState({
        //         shortCode: shortCodes.iAmSelling,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.fifteenP:
        //     updateState({
        //         shortCode: shortCodes.fifteenP,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.euodooTechnologies:
        //     updateState({
        //         shortCode: shortCodes.euodooTechnologies,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.rota:
        //     updateState({
        //         shortCode: shortCodes.rota,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.farmMeat:
        //     updateState({
        //         shortCode: shortCodes.farmMeat,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.danielleBejjani:
        //     updateState({
        //         shortCode: shortCodes.danielleBejjani,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.yallaEat:
        //     updateState({
        //         shortCode: shortCodes.yallaEat,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.choizez:
        //     updateState({
        //         shortCode: shortCodes.choizez,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.otto:
        //     updateState({
        //         shortCode: shortCodes.otto,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.rescueRoadsideAssistance:
        //     updateState({
        //         shortCode: shortCodes.rescueRoadsideAssistance,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.tax_E:
        //     updateState({
        //         shortCode: shortCodes.tax_E,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.baggageTaxi:
        //     updateState({
        //         shortCode: shortCodes.baggageTaxi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.mersi:
        //     updateState({
        //         shortCode: shortCodes.mersi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.foodSpot:
        //     updateState({
        //         shortCode: shortCodes.foodSpot,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.karibaMart:
        //     updateState({
        //         shortCode: shortCodes.karibaMart,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.sourceWith:
        //     updateState({
        //         shortCode: shortCodes.sourceWith,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.apptFindr:
        //     updateState({
        //         shortCode: shortCodes.apptFindr,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.vdu:
        //     updateState({
        //         shortCode: shortCodes.vdu,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.laundroZone:
        //     updateState({
        //         shortCode: shortCodes.laundroZone,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.taxiolgy:
        //     updateState({
        //         shortCode: shortCodes.taxiolgy,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.swipe:
        //     updateState({
        //         shortCode: shortCodes.swipe,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.sheRyders:
        //     updateState({
        //         shortCode: shortCodes.sheRyders,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.kurrix:
        //     updateState({
        //         shortCode: shortCodes.kurrix,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.mrVeloz:
        //     updateState({
        //         shortCode: shortCodes.mrVeloz,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.greenCab:
        //     updateState({
        //         shortCode: shortCodes.greenCab,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.axxi:
        //     updateState({
        //         shortCode: shortCodes.axxi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.pets:
        //     updateState({
        //         shortCode: shortCodes.pets,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.getDress:
        //     updateState({
        //         shortCode: shortCodes.getDress,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.shelf:
        //     updateState({
        //         shortCode: shortCodes.shelf,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.baly:
        //     updateState({
        //         shortCode: shortCodes.baly,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.nuvoni:
        //     updateState({
        //         shortCode: shortCodes.nuvoni,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.syloMart:
        //     updateState({
        //         shortCode: shortCodes.syloMart,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.fairDeal:
        //     updateState({
        //         shortCode: shortCodes.fairDeal,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.hezniTaxi:
        //     updateState({
        //         shortCode: shortCodes.hezniTaxi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.onTheWheel:
        //     updateState({
        //         shortCode: shortCodes.onTheWheel,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.valleyMeats:
        //     updateState({
        //         shortCode: shortCodes.valleyMeats,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.perucabs:
        //     updateState({
        //         shortCode: shortCodes.perucabs,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.hafizjwlry:
        //     updateState({
        //         shortCode: shortCodes.hafizjwlry,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.jana:
        //     updateState({
        //         shortCode: shortCodes.jana,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.myWayBill:
        //     updateState({
        //         shortCode: shortCodes.myWayBill,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.cattch:
        //     updateState({
        //         shortCode: shortCodes.cattch,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.tezras:
        //     updateState({
        //         shortCode: shortCodes.tezras,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.eureka:
        //     updateState({
        //         shortCode: shortCodes.eureka,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.kaypee:
        //     updateState({
        //         shortCode: shortCodes.kaypee,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.hitaxi:
        //     updateState({
        //         shortCode: shortCodes.hitaxi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.kwivar:
        //     updateState({
        //         shortCode: shortCodes.kwivar,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.parcel:
        //     updateState({
        //         shortCode: shortCodes.parcel,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.lex:
        //     updateState({
        //         shortCode: shortCodes.lex,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.smokyKitchen:
        //     updateState({
        //         shortCode: shortCodes.smokyKitchen,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.flank:
        //     updateState({
        //         shortCode: shortCodes.flank,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.zynoride:
        //     updateState({
        //         shortCode: shortCodes.zynoride,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.mealsarehere:
        //     updateState({
        //         shortCode: shortCodes.mealsarehere,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.loamscape:
        //     updateState({
        //         shortCode: shortCodes.loamscape,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.delcolink:
        //     updateState({
        //         shortCode: shortCodes.delcolink,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.youSmokeShops:
        //     updateState({
        //         shortCode: shortCodes.youSmokeShops,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.doober:
        //     updateState({
        //         shortCode: shortCodes.doober,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.inmotion:
        //     updateState({
        //         shortCode: shortCodes.inmotion,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.eatHalal:
        //     updateState({
        //         shortCode: shortCodes.eatHalal,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.jeevann:
        //     updateState({
        //         shortCode: shortCodes.jeevann,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.novamed:
        //     updateState({
        //         shortCode: shortCodes.novamed,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.awamer:
        //     updateState({
        //         shortCode: shortCodes.awamer,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.goTech:
        //     updateState({
        //         shortCode: shortCodes.goTech,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.idrv:
        //     updateState({
        //         shortCode: shortCodes.idrv,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.qwiker:
        //     updateState({
        //         shortCode: shortCodes.qwiker,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.spryton:
        //     updateState({
        //         shortCode: shortCodes.spryton,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.nittosadai:
        //     updateState({
        //         shortCode: shortCodes.nittosadai,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.clickokart:
        //     updateState({
        //         shortCode: shortCodes.clickokart,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.tiimo:
        //     updateState({
        //         shortCode: shortCodes.tiimo,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.verz:
        //     updateState({
        //         shortCode: shortCodes.verz,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.ragiomigo:
        //     updateState({
        //         shortCode: shortCodes.ragiomigo,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.jimsAutoRescue:
        //     updateState({
        //         shortCode: shortCodes.jimsAutoRescue,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.carryfood:
        //     updateState({
        //         shortCode: shortCodes.carryfood,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.nhazi:
        //     updateState({
        //         shortCode: shortCodes.nhazi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.petverse:
        //     updateState({
        //         shortCode: shortCodes.petverse,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.clickndrop:
        //     updateState({
        //         shortCode: shortCodes.clickndrop,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.lifehomefit:
        //     updateState({
        //         shortCode: shortCodes.lifehomefit,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.appi:
        //     updateState({
        //         shortCode: shortCodes.appi,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.dbairro_:
        //     updateState({
        //         shortCode: shortCodes.dbairro_,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.genee:
        //     updateState({
        //         shortCode: shortCodes.genee,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.speedyDelivery:
        //     updateState({
        //         shortCode: shortCodes.speedyDelivery,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.holla:
        //     updateState({
        //         shortCode: shortCodes.holla,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.stabex:
        //     updateState({
        //         shortCode: shortCodes.stabex,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.uberWeeds:
        //     updateState({
        //         shortCode: shortCodes.uberWeeds,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.cabPro:
        //     updateState({
        //         shortCode: shortCodes.cabPro,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.pointoneExpediteDelivery:
        //     updateState({
        //         shortCode: shortCodes.pointoneExpediteDelivery,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.saamanshop:
        //     updateState({
        //         shortCode: shortCodes.saamanshop,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.tdc:
        //     updateState({
        //         shortCode: shortCodes.tdc,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.giftyLeaf:
        //     updateState({
        //         shortCode: shortCodes.giftyLeaf,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.flyCommerce:
        //     updateState({
        //         shortCode: shortCodes.flyCommerce,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.pik:
        //     updateState({
        //         shortCode: shortCodes.pik,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.motina:
        //     updateState({
        //         shortCode: shortCodes.motina,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.hungry:
        //     updateState({
        //         shortCode: shortCodes.hungry,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.greenhippo:
        //     updateState({
        //         shortCode: shortCodes.greenhippo,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.mymeddy:
        //     updateState({
        //         shortCode: shortCodes.mymeddy,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.uryd:
        //     updateState({
        //         shortCode: shortCodes.uryd,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.happySingh:
        //     updateState({
        //         shortCode: shortCodes.happySingh,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.vital:
        //     updateState({
        //         shortCode: shortCodes.vital,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.parcelworks:
        //     updateState({
        //         shortCode: shortCodes.parcelworks,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.usVetsDeliver:
        //     updateState({
        //         shortCode: shortCodes.usVetsDeliver,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        // case appIds.flybuilder:
        //     updateState({
        //         shortCode: shortCodes.flybuilder,
        //         isShortcodePrefilled: true,
        //     });
        //     return;

        case appIds.konectame: return shortCodes.konectame;

        case appIds.skyline: return shortCodes.skyline;

        case appIds.bliss: return shortCodes.bliss;

        case appIds.rentzy: return shortCodes.rentzy;

        case appIds.todaysDeliverys: return shortCodes.todaysDeliverys;

        case appIds.locate: return shortCodes.locate;

        case appIds.georgiacollective: return shortCodes.georgiacollective;

        case appIds.otgWeeds: return shortCodes.otgWeeds;

        case appIds.rumbella: return shortCodes.rumbella;

        case appIds.lincshare: return shortCodes.lincshare; 

        case appIds.lvlup: return shortCodes.lvlup;

        case appIds.glavour: return shortCodes.glavour;

        case appIds.shipmoe: return shortCodes.shipmoe;

        case appIds.bigBayong: return shortCodes.bigBayong;

        case appIds.efectibo: return shortCodes.efectibo;

        case appIds.sooq: return shortCodes.sooq;

        case appIds.hectoHomes: return shortCodes.hectoHomes;

        case appIds.zynoBidandRide: return shortCodes.zynoBidandRide;

        case appIds.glamguide: return shortCodes.glamguide;

        case appIds.solace: return shortCodes.solace;

        case appIds.superpana: return shortCodes.superpana;

        case appIds.kero: return shortCodes.kero;

        case appIds.godamPAY: return shortCodes.godamPAY;

        case appIds.housingSubsidies: return shortCodes.housingSubsidies;

        case appIds.bocch: return shortCodes.bocch;

        case appIds.potolo: return shortCodes.potolo;

        case appIds.earnApp: return shortCodes.earnApp;

        case appIds.aredoo: return shortCodes.aredoo;

        case appIds.bukam: return shortCodes.bukam;

        case appIds.dot: return shortCodes.dot; 

        case appIds.wizSonic: return shortCodes.wizSonic;

        case appIds.udkay: return shortCodes.udkay;

        case appIds.hattaFoodHub: return shortCodes.hattaFoodHub;

        case appIds.ondgoo: return shortCodes.ondgoo;

        case appIds.zonesso: return shortCodes.zonesso;

        case appIds.junkerz: return shortCodes.junkerz;

        case appIds.shopcart: return shortCodes.shopcart;

        case appIds.viralClean: return shortCodes.viralClean;

        case appIds.stargaze: return shortCodes.stargaze;

        case appIds.messiaa: return shortCodes.messiaa;

        case appIds.superApp: return shortCodes.superApp;

        case appIds.laith: return shortCodes.laith;

        case appIds.nounou: return shortCodes.nounou;

        case appIds.nannyAfrica: return shortCodes.nannyAfrica;

        case appIds.whatchaGotPickUp: return shortCodes.whatchaGotPickUp;

        case appIds.etaim: return shortCodes.etaim;

        case appIds.liverpoolEats: return shortCodes.liverpoolEats;

        case appIds.oaks: return shortCodes.oaks;

        case appIds.buzy: return shortCodes.buzy;

        case appIds.dotTaxiApp: return shortCodes.dotTaxiApp;

        case appIds.airvoltTaxi: return shortCodes.airvoltTaxi;

        case appIds.melakPharmacy: return shortCodes.melakPharmacy;

        case appIds.wiEnergi: return shortCodes.wiEnergi;

        default: return ''

    }
}