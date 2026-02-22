import Card from "@/components/ui/card";
import { useTailwindColor } from "@/hooks/use-tailwind-color";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
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

export default function HomeScreen(users: usersType, products: productType) {
  const primary = useTailwindColor("primary");
  const primaryForeground = useTailwindColor("primary-foreground");
  const muted = useTailwindColor("muted");
  const accentOrange = useTailwindColor("accent-orange");

  const [data, setData] = useState<usersType[]>([]);
  const [productsData, setProductsData] = useState<productType[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const loading = loadingUsers || loadingProducts;

  useEffect(() => {
    fetch("https://fakestoreapi.com/users")
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch(() => setData([]))
      .finally(() => setLoadingUsers(false));
  }, []);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((result) => setProductsData(result))
      .catch(() => setProductsData([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  return (
    <ScrollView className="bg-background flex-1 gap-4">

      {/* header */}
      <SafeAreaView edges={["top"]} className="bg-primary">
        <View className="w-full gap-4">
          <View className="w-full px-4 py-2 flex-row gap-4 justify-between items-center">
            <Text className="text-xl text-primary-foreground font-medium">
              My Profile
            </Text>
            <View className="flex-row gap-4">
              <MaterialIcons name="settings" size={24} color="white" />
              <MaterialIcons name="shopping-cart" size={24} color="white" />
              <MaterialIcons name="chat" size={24} color="white" />
            </View>
          </View>
          {data.slice(0, 1).map((user) => (
            <LinearGradient colors={[primary, accentOrange]} key={user.id} className="flex-row gap-4 px-4 pb-2">
              {/* avatar placeholder */}
              <View className="w-14 h-14 rounded-full bg-background items-center justify-center border-2 border-border">
                <Text className="text-primary text-2xl font-bold">
                  {user.username?.charAt(0)}
                </Text>
              </View>
              {/* user info */}
              <View key={user.id}>
                <View>
                  <Text className="text-2xl text-primary-foreground font-medium">
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
                  <View className="flex-row gap-1 items-center pb-2">
                    <MaterialIcons name="contact-phone" size={14} color="white" />
                    <Text className="text-primary-foreground text-sm">
                      {user.phone}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>
      </SafeAreaView>

      {/* main content */}
      <ScrollView className="flex-1">
        <View className="flex-1 bg-background p-2 gap-2">
          {/* order history */}
          <Card>
            <View className="flex-row justify-between items-center">
              <Text className="text-foreground">My order</Text>
              <Text className="text-sm text-muted">Order history</Text>
            </View>
            <View className="flex-row justify-evenly items-center">
              <View className="gap-2 items-center">
                <View className="p-1 flex justify-center items-center border border-border rounded-md">
                  <MaterialIcons name="wallet" size={32} color={primary} />
                </View>
                <Text className="text-foreground font-semibold">Unpaid</Text>
              </View>

              <View className="gap-2 items-center">
                <View className="p-1 flex justify-center items-center border border-border rounded-md">
                  <MaterialCommunityIcons name="package-variant" size={32} color={primary} />
                </View>
                <Text className="text-foreground font-semibold">
                  In-process
                </Text>
              </View>

              <View className="gap-2 items-center">
                <View className="p-1 flex justify-center items-center border border-border rounded-md">
                  <MaterialCommunityIcons name="truck-cargo-container" size={32} color={primary} />
                </View>
                <Text className="text-foreground font-semibold">Shipped</Text>
              </View>

              <View className="gap-2 items-center">
                <View className="p-1 flex justify-center items-center border border-border rounded-md">
                  <MaterialIcons name="stars" size={32} color={primary} />
                </View>
                <Text className="text-foreground font-semibold">
                  Give rating
                </Text>
              </View>
            </View>
          </Card>

          {/* liked items */}
          <Card>
            <View className="flex-row justify-between items-center">
              <View className="flex-row gap-3 items-center">
                <View className="bg-primary p-1 rounded-md">
                  <MaterialCommunityIcons name="notebook-heart-outline" size={24} color={primaryForeground} />
                </View>
                <Text className="text-foreground">Liked items</Text>
              </View>
              <Text className="text-sm text-muted">See all</Text>
            </View>
          </Card>

          {/* customer service */}
          <Card>
            <View className="flex-row justify-between items-center">
              <Text className="text-foreground">
                Need help?
              </Text>
              <Text className="text-sm text-muted">Contact us</Text>
            </View>
            <View className="gap-2">
              <View className="flex-row gap-3 items-center pb-2 border-b border-border">
                <MaterialIcons name="help-outline" size={32} color={primary} />
                <Text className="text-muted font-semibold">
                  Help Center
                </Text>
              </View>
              <View className="flex-row gap-3 items-center">
                <MaterialIcons name="quick-contacts-dialer" size={32} color={primary} />
                <Text className="text-muted font-semibold">
                  Call Customer Service
                </Text>
              </View>
            </View>
          </Card>
        </View>


        {/* product recommendations */}
        <View className="gap-2">
          <View className="flex-row justify-center items-center">
            <Text className="text-foreground">
              -- You may like these products --
            </Text>
          </View>
          <View className="flex flex-wrap flex-row px-1">
            {productsData.slice(0, 8).map((product) => (
              <Pressable
                key={product.id}
                onPress={() =>
                  router.push({
                    pathname: "/productDetail",
                    params: { product: JSON.stringify(product) },
                  })
                }
                className="w-1/2"
              >
                <View className="w-full p-1">
                  <Card key={product.id}>
                    <View className="bg-background w-full rounded-lg overflow-hidden">
                      <Image
                        source={{ uri: product.image }}
                        style={{
                          width: "100%",
                          height: 125,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <View className="gap-2">
                      <View>
                        <Text
                          numberOfLines={1}
                          className="text-xl text-foreground font-medium"
                        >
                          {product.title}
                        </Text>
                      </View>
                      <View>
                        <View className="flex-row gap-1 items-center">
                          <Text
                            numberOfLines={2}
                            className="text-muted text-sm"
                          >
                            {product.description}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-foreground text-base">
                        #{product.category}
                      </Text>
                      <Text className="text-xl text-primary font-bold">
                        ${product.price},00
                      </Text>
                    </View>
                  </Card>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* disclaimer */}
        <SafeAreaView edges={["bottom"]} className="px-4 py-6">
          <Text className="text-center text-muted text-sm">
            Project by Mozarist.
          </Text>
        </SafeAreaView>
      </ScrollView>
    </ScrollView>
  );
}
