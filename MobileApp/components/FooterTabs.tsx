import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from '../app/index';
import MapScreen from '../app/map';
import SOScreen from '../app/sos';
import ProfileScreen from '../app/profile';
import InfoScreen from '../app/info';

const Tab = createBottomTabNavigator();

const FooterTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ccc',
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ccc',
        }}
      />
      <Tab.Screen
        name="SOS"
        component={SOScreen}
        options={{
          tabBarButton: (props) => <SOSButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-alt" size={size} color={color} />,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ccc',
        }}
      />
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" size={size} color={color} />,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ccc',
        }}
      />
    </Tab.Navigator>
  );
};

export default FooterTabs;

// Custom SOS Button
const SOSButton = ({ children, onPress }: any) => (
  <TouchableOpacity style={styles.sosButton} onPress={onPress} activeOpacity={0.8}>
    <MaterialIcons name="warning" size={35} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#121212',   // dark background
    height: Platform.OS === 'ios' ? 70 : 90,
    borderTopWidth: 0,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sosButton: {
    position: 'absolute',       // makes it float above the tab bar
    bottom: 0,                 // distance from tab bar bottom
    alignSelf: 'center',        // center horizontally
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3B30', // red circle
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5,
  },
});
