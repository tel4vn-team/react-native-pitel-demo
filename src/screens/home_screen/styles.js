import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCall: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRegister: {
    height: 50,
    width: 100,
    marginTop: 20,
    backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnPermissionBluetooth: {
    backgroundColor: 'orange',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  btnPermission: {
    backgroundColor: 'orange',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default styles;
