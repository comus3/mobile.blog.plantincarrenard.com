import { Stack } from 'expo-router';
import { COLORS, TYPOGRAPHY } from '@/constants/config';

export default function ExploreLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontFamily: TYPOGRAPHY.fontFamily.semiBold,
          fontSize: TYPOGRAPHY.fontSize.lg,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Explore',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="post/[id]"
        options={{
          title: 'Post',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="author/[id]"
        options={{
          title: 'Author',
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}