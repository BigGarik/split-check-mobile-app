import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

// Import RootStackParamList to define route types
import  {RootStackParamList} from "@/app/(tabs)/_layout";

// Define the navigation prop type for ProfileScreen
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  // Correctly type the useNavigation hook
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button title="View My History" onPress={() => navigation.navigate('UserHistory')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
