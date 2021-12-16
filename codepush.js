import React from 'react';
import codePush from "react-native-code-push";

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START }

const withCodePush = WrappedComponent => {
    class WrappedApp extends React.PureComponent {
        componentDidMount() {
            codePush.sync({ installMode: codePush.InstallMode.IMMEDIATE }, this.syncWithCodePush)
        }
        syncWithCodePush = (status) => {
            console.log("status code push", status)

        }
        render() {
            return (
                <WrappedComponent />
            );
        }
    }
    return codePush(codePushOptions)(WrappedApp)
}

export default withCodePush