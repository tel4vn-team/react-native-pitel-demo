import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, Text, View, Platform, Button} from 'react-native';
import {
  PitelCallNotif,
  useRegister,
  PitelSDKContext,
} from 'react-native-pitel-voip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {request, PERMISSIONS} from 'react-native-permissions';

import styles from './styles';

// Replace your params in here
const ext = `${EXTENSION}`;
const phone = `${CALL_OUT_PHONE_NUMBER}`;
const iosAppName = `${IOS_APP_NAME}`;

const callkitSetup = {
  ios: {
    appName: iosAppName,
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    foregroundService: {
      channelId: 'com.pitel.pitelconnect.dev',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    },
  },
};

export const HomeScreenComponent = ({
  navigation,
  sdkOptions,
  handleRegisterToken,
  handleRemoveToken,
  setIOSPushToken,
}) => {
  // useState & useRegister
  const {pitelSDK, setPitelSDK, callID, setCallID} =
    useContext(PitelSDKContext);
  const [isCallOut, setIsCallOut] = useState(false);
  const [isLogin, setIsLogin] = useState('FALSE');

  const {
    callState,
    receivedPhoneNumber,
    receivedDisplayName,
    registerState,

    setCallState,
    registerFunc,
  } = useRegister({
    sdkOptions: sdkOptions,
    setPitelSDK: setPitelSDK,
    extension: ext,
  });

  // Input call out phone number
  const phoneNumber = phone;

  useEffect(() => {
    getStorageIsLogin();
  }, []);

  //! Storage login
  const getStorageIsLogin = async () => {
    try {
      const value = await AsyncStorage.getItem('IS_LOGIN');
      if (value !== null) {
        setIsLogin(value);
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  };
  const setStorageIsLogin = async value => {
    try {
      await AsyncStorage.setItem('IS_LOGIN', value);
      setIsLogin(value);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  };

  // Handle function
  const handleReceived = () => {
    navigation.navigate('Call', {
      phoneNumber: receivedPhoneNumber,
      displayName: receivedDisplayName,
      direction: 'Incoming',
      callState,
      callID,
    });
  };

  const handleHangup = () => {
    if (navigation.canGoBack()) {
      navigation.popToTop();
    }
  };

  return (
    <PitelCallNotif
      callkitSetup={callkitSetup}
      pitelSDK={pitelSDK}
      setCallState={setCallState}
      callState={callState}
      isLogin={isLogin}
      isCallOut={isCallOut}
      setCallID={setCallID}
      sdkOptions={sdkOptions}
      registerFunc={registerFunc}
      setIsCallOut={setIsCallOut}
      onReceived={handleReceived}
      onHangup={handleHangup}
      onIOSToken={iosToken => {
        setIOSPushToken(iosToken);
      }}
      // onNativeCall={data => {
      //   console.log('onNativeCall', data);
      // }}
      // onAnswerCallAction={data => {
      //   console.log('onAnswerCallAction', data);
      //   setCallID(data.callUUID);
      // }}
      // onEndCallAction={data => {
      //   console.log('onEndCallAction', data);
      // }}
      // onIncomingCallDisplayed={data => {
      //   console.log('onIncomingCallDisplayed', data);
      // }}
      // onToggleMute={data => {
      //   console.log('onToggleMute', data);
      // }}
      // onDTMF={data => {
      //   console.log('onDTMF', data);
      // }}
    >
      <View style={styles.container}>
        <Text>{registerState}</Text>
        <TouchableOpacity
          style={styles.btnRegister}
          onPress={() => {
            if (registerState === 'UNREGISTER') {
              handleRegisterToken();
              setStorageIsLogin('TRUE');
            }
            if (registerState === 'REGISTER') {
              pitelSDK.unregister();
              handleRemoveToken();
              setStorageIsLogin('FALSE');
            }
          }}>
          <Text>
            {registerState === 'REGISTER' ? 'UNREGISTER' : 'REGISTER'}
          </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[styles.btnRegister, styles.btnPermissionBluetooth]}
            onPress={async () => {
              if (Platform.OS == 'ios') {
                await request(PERMISSIONS.IOS.BLUETOOTH);
              }
              if (Platform.OS == 'android') {
                await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
              }
            }}>
            <Text>Request bluetooth</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnRegister, styles.btnPermission]}
            onPress={async () => {
              if (Platform.OS == 'ios') {
                await request(PERMISSIONS.IOS.MICROPHONE);
              }
              if (Platform.OS == 'android') {
                await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
              }
            }}>
            <Text>Request microphone</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.btnRegister, {backgroundColor: 'yellow'}]}
          onPress={() => {
            navigation.navigate('StartPage', {callState: callState});
          }}>
          <Text>Go to StartPage</Text>
        </TouchableOpacity>
      </View>
    </PitelCallNotif>
  );
};
