import Card from "@/components/ui/card";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type productType = {
  id: number;
  title: string;
  price: string;
  description: string;
  category: string;
  image: string;
};

type usersType = {
  id: number;
  username: string;
  email: string;
  phone: string;
};

export default function HomeScreen(users: usersType) {
  const [data, setData] = useState<usersType[]>([]);
  const [products, setProducts] = useState<productType[]>([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/users")
      .then((response) => response.json())
      .then((result) => setData(result));
  }, []);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((result) => setProducts(result));
  }, []);

  return (
    <View className="bg-background flex-1 gap-4">
      {/* header */}
      <SafeAreaView edges={["top"]} className="bg-primary p-4 gap-4">
        <View className="w-full bg-primary flex-row gap-4 justify-end items-center">
          <View className="flex-row gap-4">
            <MaterialIcons name="settings" size={24} color="white" />
            <MaterialIcons name="shopping-cart" size={24} color="white" />
            <MaterialIcons name="chat" size={24} color="white" />
          </View>
        </View>
        {data.slice(0, 1).map((user) => (
          <View className="flex-row gap-4">
            {/* avatar placeholder */}
            <View className="w-14 h-14 rounded-full bg-background items-center justify-center border-2 border-border">
              <Text className="text-primary text-2xl font-bold font-serif">
                {user.username?.charAt(0)}
              </Text>
            </View>
            {/* user info */}
            <View key={user.id} className="gap-2">
              <View>
                <Text className="text-2xl text-primary-foreground font-medium font-serif">
                  {user.username}
                </Text>
              </View>
              <View>
                <View className="flex-row gap-1 items-center">
                  <MaterialIcons name="email" size={14} color="white" />
                  <Text className="text-primary-foreground text-sm">
                    {user.email}
                  </Text>
                </View>
                <View className="flex-row gap-1 items-center">
                  <MaterialIcons name="contact-phone" size={14} color="white" />
                  <Text className="text-primary-foreground text-sm">
                    {user.phone}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </SafeAreaView>

      {/* main content */}
      <ScrollView className="flex-1">
        <View className="flex-1 bg-background p-2 gap-2">
          {/* order history */}
          <Card>
            <View className="flex-row justify-between items-center">
              <Text className="text-foreground font-serif">My order</Text>
              <Text className="text-sm text-muted">Order history</Text>
            </View>
            <View className="flex-row justify-evenly items-center">
              <View className="gap-2 items-center">
                <View className="flex justify-center items-center px-3 py-2 border-2 border-primary-foreground/25 rounded-lg">
                  {/* <FontAwesome6 name="plus" size={24} color="white" /> */}
                </View>
                <Text className="text-foreground font-semibold">Unpaid</Text>
              </View>

              <View className="gap-2 items-center">
                <View className="flex justify-center items-center px-3 py-2 border-2 border-primary-foreground/25 rounded-lg">
                  {/* <Ionicons
                    name="arrow-redo-sharp"
                    size={24}
                    color="white"
                    className="rotate-180"
                  /> */}
                </View>
                <Text className="text-foreground font-semibold">
                  In-process
                </Text>
              </View>

              <View className="gap-2 items-center">
                <View className="flex justify-center items-center px-3 py-2 border-2 border-primary-foreground/25 rounded-lg">
                  {/* <FontAwesome6 name="paper-plane" size={24} color="white" /> */}
                </View>
                <Text className="text-foreground font-semibold">Shipped</Text>
              </View>

              <View className="gap-2 items-center">
                <View className="flex justify-center items-center px-3 py-2 border-2 border-primary-foreground/25 rounded-lg">
                  {/* <Ionicons name="mail" size={24} color="white" /> */}
                </View>
                <Text className="text-foreground font-semibold">
                  Give rating
                </Text>
              </View>
            </View>
          </Card>

          {/* product recommendations */}
          {products.length > 0 && (
            <Card>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-foreground font-serif">
                  Recommended for you
                </Text>
                <Text className="text-sm text-muted">
                  Based on popular items
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {products.slice(0, 6).map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() =>
                      router.push({
                        pathname: "/productDetail",
                        params: { product: JSON.stringify(p) },
                      })
                    }
                    className="mr-3"
                  >
                    <View className="w-28 h-28 rounded-xl overflow-hidden bg-primary-foreground border-2 border-border">
                      <Image
                        source={{ uri: p.image }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </View>
                    <Text numberOfLines={1} className="text-sm w-28">
                      {p.title}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Card>
          )}
        </View>

        {/* disclaimer */}
        <SafeAreaView edges={["bottom"]} className="px-4 py-6">
          <Text className="text-center text-muted text-sm">
            Project by Mozarist.
          </Text>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
