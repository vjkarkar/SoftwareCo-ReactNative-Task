import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import StoreDetailScreen from '../screens/StoreDetailScreen';
import AudioRecordingScreen from '../screens/AudioRecordingScreen';
import ManageNotificationsScreen from '../screens/ManageNotificationsScreen';
import StoresScreen from '../screens/StoresScreen';
import SubHeader from '../components/SubHeader';

const Stack = createNativeStackNavigator();

const subHeaderScreenOptions = (title: string) => ({
  headerShown: true,
  header: () => <SubHeader title={title} />,
});

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Stores"
        component={StoresScreen}
        options={({ route }: any) =>
          subHeaderScreenOptions(route.params?.title ?? 'Stores')
        }
      />
      <Stack.Screen
        name="StoreDetail"
        component={StoreDetailScreen}
        options={subHeaderScreenOptions('Store Details')}
      />
      <Stack.Screen
        name="AudioRecording"
        component={AudioRecordingScreen}
        options={subHeaderScreenOptions('Audio Recording')}
      />
      <Stack.Screen
        name="ManageNotifications"
        component={ManageNotificationsScreen}
        options={subHeaderScreenOptions('Manage Notifications')}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
