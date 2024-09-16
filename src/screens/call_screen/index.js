import React, {useState, useContext} from 'react';
import {PitelCallKit, PitelSDKContext} from 'react-native-pitel-voip';

export const CallScreen = ({route, navigation}) => {
  const {pitelSDK} = useContext(PitelSDKContext);

  const {phoneNumber, direction, callState, callID, displayName} = route.params;

  return (
    <PitelCallKit
      pitelSDK={pitelSDK}
      callState={callState}
      phoneNumber={phoneNumber}
      displayName={displayName}
      direction={direction}
      callID={callID}
      textClock={'Connecting...'}
      onHangup={() => {
        pitelSDK.hangup();
      }}
    />
  );
};
