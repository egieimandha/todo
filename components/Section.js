import React from 'react';
import {StyleSheet, View} from 'react-native';

export default function Section(props) {
  const {children, style, disabled} = props;

  return (
    <View
      style={[styles.container, style]}
      pointerEvents={disabled ? 'none' : 'auto'}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
