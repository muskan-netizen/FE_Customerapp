#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
IOS_DIR="$ROOT_DIR/ios"
WORKSPACE="$IOS_DIR/Runrun.xcworkspace"

SCHEME="${1:-Grub}"
SIMULATOR_NAME="${2:-iPhone 16}"
DERIVED_DATA_PATH="$IOS_DIR/build/$SCHEME"
HOST_ARCH="$(uname -m)"

case "$SCHEME" in
  Ace|GoKab|Grub|Gusto)
    ;;
  *)
    echo "Unsupported iOS scheme: $SCHEME"
    echo "Use one of: Ace, GoKab, Grub, Gusto"
    exit 1
    ;;
esac

SIMULATOR_JSON="$(xcrun simctl list devices available --json)"
SIMULATOR_UDID="$(printf '%s' "$SIMULATOR_JSON" | node -e '
const fs = require("fs");
const targetName = process.argv[1];
const data = JSON.parse(fs.readFileSync(0, "utf8"));
const runtimes = Object.keys(data.devices).sort().reverse();

for (const runtime of runtimes) {
  const match = (data.devices[runtime] || []).find(
    (device) => device.isAvailable && device.name === targetName,
  );
  if (match) {
    process.stdout.write(match.udid);
    process.exit(0);
  }
}

process.exit(1);
' "$SIMULATOR_NAME")"

if [[ -z "$SIMULATOR_UDID" ]]; then
  echo "Unable to find an available simulator named: $SIMULATOR_NAME"
  exit 1
fi

open -a Simulator --args -CurrentDeviceUDID "$SIMULATOR_UDID"
xcrun simctl boot "$SIMULATOR_UDID" >/dev/null 2>&1 || true
xcrun simctl bootstatus "$SIMULATOR_UDID" -b

xcode_destination="platform=iOS Simulator,id=$SIMULATOR_UDID"
if [[ "$HOST_ARCH" == "arm64" ]]; then
  xcode_destination="$xcode_destination,arch=arm64"
elif [[ "$HOST_ARCH" == "x86_64" ]]; then
  xcode_destination="$xcode_destination,arch=x86_64"
fi

xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Debug \
  -destination "$xcode_destination" \
  -derivedDataPath "$DERIVED_DATA_PATH" \
  build

APP_PATH="$(find "$DERIVED_DATA_PATH/Build/Products/Debug-iphonesimulator" -maxdepth 1 -name '*.app' -type d | head -n 1)"

if [[ -z "$APP_PATH" ]]; then
  echo "Unable to find built .app for scheme $SCHEME"
  exit 1
fi

BUNDLE_ID="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$APP_PATH/Info.plist")"

xcrun simctl install "$SIMULATOR_UDID" "$APP_PATH"
xcrun simctl launch "$SIMULATOR_UDID" "$BUNDLE_ID"
