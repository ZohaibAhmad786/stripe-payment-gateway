import React from 'react';
import {
  AccessibilityProps,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';



export default  Button = ({
  title,
  variant = 'default',
  disabled,
  loading,
  onPress,
  ...props
}) => {
  const titleElement = React.isValidElement(title) ? (
    title
  ) : (
    <Text style={[styles.text, variant === 'primary' && styles.textPrimary]} >
      {title}
      </Text>
      );
      return (
      <View style={disabled && styles.disabled
      }>
        <TouchableOpacity
          disabled={disabled}
          style={
            [
              styles.container,
              variant === 'primary' && styles.primaryContainer,
            ]}
          onPress={onPress}
          {...props}
        >
          {
            loading ? (
              <ActivityIndicator color={"white"} size="small" />
            ) : (
              titleElement
            )
          }
          </TouchableOpacity>
          </View>
          );
}

          const styles = StyleSheet.create({
            container: {
            marginVertical: 4,
          paddingVertical: 12,
          borderRadius: 12,
  },
          primaryContainer: {
            backgroundColor: "blue",
          alignItems: 'center',
  },
          text: {
            color: "blue",
          fontWeight: '600',
          fontSize: 16,
  },
          textPrimary: {
            color: "white",
  },
          disabled: {
            opacity: 0.3,
  },
});
