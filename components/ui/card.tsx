import { View } from "react-native";
import React, { Children } from "react";

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <View className="gap-4 bg-card dark:bg-secondary w-full p-3 border border-border dark:border-muted rounded-lg overflow-hidden">
        {children}
    </View>
  );
}
