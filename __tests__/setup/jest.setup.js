import {NativeModules} from 'react-native';
import RNCNetInfoMock from './netinfo-mock.js';
import RNCAsyncStorageMock from './async-storage-mock';

NativeModules.RNCNetInfo = RNCNetInfoMock;
NativeModules.RNCAsyncStorage = RNCAsyncStorageMock;

// jest
//   .mock('@react-native-community/async-storage', () => {})
//   .mock('@react-native-community/netinfo', () => {});
