import Card from "@/components/ui/card";
import { useTailwindColor } from "@/hooks/use-tailwind-color";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const primary = useTailwindColor("primary");
  const accentOrange = useTailwindColor("accent-orange");
  const accentBlue = useTailwindColor("accent-blue");
  const accentGreen = useTailwindColor("accent-green");


  return (

    <SafeAreaView edges={['top']} className="flex-1 bg-primary-foreground">
      <View className="px-4 py-2 flex-row justify-between">
        <Text className="text-foreground text-xl font-medium">Notifications</Text>
        <View className="flex-row gap-4">
          <MaterialIcons name="shopping-cart" size={24} color={primary} />
          <MaterialIcons name="chat" size={24} color={primary} />
        </View>
      </View>

      <ScrollView className="bg-background flex-1 px-4 pt-4">
        <View className="gap-3">
          <Card>
            <View className="gap-3">
              <View className="flex-row gap-3 items-center pb-3 border-b border-border">
                <View className="p-2 rounded-full border border-border">
                  <FontAwesome6 name="tags" size={24} color={accentOrange} />
                </View>
                <Text className="text-muted font-semibold">
                  Promo & Voucher
                </Text>
              </View>
              <View className="flex-row gap-3 items-center pb-3 border-b border-border">
                <View className="p-2 rounded-full border border-border">
                  <MaterialIcons name="live-tv" size={24} color={accentGreen} />
                </View>
                <Text className="text-muted font-semibold">
                  Live & Feed Notifications
                </Text>
              </View>
              <View className="flex-row gap-3 items-center">
                <View className="p-2 rounded-full border border-border">
                  <MaterialCommunityIcons name="information-slab-circle-outline" size={24} color={accentBlue} />
                </View>
                <Text className="text-muted font-semibold">
                  Informations
                </Text>
              </View>
            </View>
          </Card>

          <View className="flex-row justify-between items-center">
            <Text className="text-foreground font-semibold">Order Status</Text>
            <Text className="text-muted/50">Mark all as read</Text>
          </View>
          
          <Card>
            <Text className="text-sm text-muted text-center">
              Your order updates will appear here.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
