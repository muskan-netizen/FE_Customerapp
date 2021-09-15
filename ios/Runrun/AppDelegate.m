#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <TwitterKit/TWTRKit.h>
#import "RNSplashScreen.h"  // here
#import <React/RCTLinkingManager.h> //deeplinking
@import GooglePlaces;
@import GoogleMaps;
// AppDelegate.m
 
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //Pick xconfig values into Objective C files
  NSString *googlePlacesKey = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"PROJECT_GOOGLE_PLACE_KEY"];
  [GMSPlacesClient provideAPIKey:googlePlacesKey];
  [GMSServices provideAPIKey:googlePlacesKey];
  

  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Runrun"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  

  [RNSplashScreen show];
//  
//    for (NSString* family in [UIFont familyNames])
//    {
//        NSLog(@"%@", family);
//  
//        for (NSString* name in [UIFont fontNamesForFamilyName: family])
//        {
//            NSLog(@"  %@", name);
//        }
//    }
  return YES;
}

 - (BOOL)application:(UIApplication *)application
             openURL:(NSURL *)url
             options:(nonnull NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
 {
   [[FBSDKApplicationDelegate sharedInstance] application:application
                                                  openURL:url
                                                  options:options] || [[Twitter sharedInstance] application:application openURL:url options:options]
   || [RCTLinkingManager application:application openURL:url options:options];
   return YES;
 }

- (void)applicationWillEnterForeground:(UIApplication *)application{
  UIPasteboard *pb = [UIPasteboard generalPasteboard];
  [pb setValue:@"" forPasteboardType:UIPasteboardNameGeneral];
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


//deeplinking

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
@end
