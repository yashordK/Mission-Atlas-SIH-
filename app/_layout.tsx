// app/_layout.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FooterTabs from '../components/FooterTabs';

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FooterTabs />
    </GestureHandlerRootView>
  );
};

export default Layout;
