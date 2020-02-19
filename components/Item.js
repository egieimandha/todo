import React from 'react';
import {StyleSheet, View} from 'react-native';

export default function Item(props) {
  const {
    children,
    style,
    header,
    flex,
    small,
    start,
    center,
    end,
    width,
    height,
    plain,
    spaceBetween,
    spaceAround,
    verticalCenter,
    row,
    column,
    backgroundColor,
    borderRadius,
    horizontal,
  } = props;

  return (
    <View
      style={[
        header ? styles.containerHeader : styles.container,
        style,
        {
          ...(flex ? {flex: 1} : null),
          ...(small ? {paddingVertical: 5} : null),
          ...(width ? {width: width} : null),
          ...(height ? {height: height} : null),
          ...(start ? {alignItems: 'flex-start'} : null),
          ...(end ? {alignItems: 'flex-end'} : null),
          ...(center ? {alignItems: 'center'} : null),
          ...(verticalCenter ? {justifyContent: 'center'} : null),
          ...(horizontal ? {paddingHorizontal: 10} : null),
          ...(plain ? {paddingVertical: 0, paddingHorizontal: 0} : null),
          ...(spaceBetween ? {justifyContent: 'space-between'} : null),
          ...(spaceAround ? {justifyContent: 'space-around'} : null),
          ...(row ? {flexDirection: 'row'} : null),
          ...(column ? {flexDirection: 'column'} : null),
          ...(backgroundColor ? {backgroundColor} : null),
          ...(borderRadius ? {borderRadius} : null),
        },
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  containerHeader: {
    paddingVertical: 20,
    backgroundColor: '#FFF',
    paddingLeft: 50,
  },
});
