if [ "$APPCENTER_BRANCH" == "main" ];
then
VERSION_CODE=$((VERSION_CODE_SHIFT + APPCENTER_BUILD_ID)) plutil -replace CFBundleVersion -string "$VERSION_CODE" $APPCENTER_SOURCE_DIRECTORY/ios/Runrun/Plists/$((PROJECT_PLIST)).plist
fi