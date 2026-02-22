import Card from "@/components/ui/card";
import { useTailwindColor } from "@/hooks/use-tailwind-color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
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
};

export default function HomeScreen() {
  const background = useTailwindColor("background");
  const primary = useTailwindColor("primary");
  const primaryForeground = useTailwindColor("primary-foreground");
  const accentOrange = useTailwindColor("accent-orange");

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const [data, setData] = useState<productType[]>([]);
  const [user, setUser] = useState<usersType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("https://fakestoreapi.com/users")
      .then((response) => response.json())
      .then((result) => setUser(result));
  }, []);

  const width = Dimensions.get("window").width;
  const CARD_WIDTH = width * 0.41 - 1;

  const [timeLeft, setTimeLeft] = useState("");
  const [flashSaleItems, setFlashSaleItems] = useState<productType[]>([]);

  const getPeriod = (hours: number) => {
    if (hours < 8) return 0;
    if (hours < 16) return 1;
    return 2;
  };

  const pickRandomItems = useCallback(
    (items: productType[], count: number) => {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    },
    [],
  );

  const lastPeriodRef = useRef<number>(getPeriod(new Date().getHours()));

  // Pick initial flash sale items once data is loaded
  useEffect(() => {
    if (data.length > 0 && flashSaleItems.length === 0) {
      setFlashSaleItems(pickRandomItems(data, 5));
    }
  }, [data, flashSaleItems.length, pickRandomItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const currentPeriod = getPeriod(hours);

      // Reshuffle flash sale items when the period changes
      if (currentPeriod !== lastPeriodRef.current) {
        lastPeriodRef.current = currentPeriod;
        if (data.length > 0) {
          setFlashSaleItems(pickRandomItems(data, 5));
        }
      }

      let target = new Date(now);

      if (hours < 8) {
        target.setHours(8, 0, 0, 0);
      } else if (hours < 16) {
        target.setHours(16, 0, 0, 0);
      } else {
        target.setHours(24, 0, 0, 0);
      }

      const diff = target.getTime() - now.getTime();

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [data, pickRandomItems]);


  return (
    <View className="bg-background flex-1">
      {/* header */}
      <SafeAreaView edges={["top"]} className="bg-primary px-4 py-2 gap-4">
        <View className="w-full bg-primary flex-row gap-4 justify-between items-center">
          <TextInput
            placeholder="What to buy today?"
            className="flex-1 bg-primary-foreground px-2 rounded-lg text-lg text-muted font-semibold"
          />
          <View className="flex-row gap-4">
            <MaterialIcons name="shopping-cart" size={24} color="white" />
            <MaterialIcons name="chat" size={24} color="white" />
          </View>
        </View>
      </SafeAreaView>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <ScrollView className="flex-1">
          {/* categories */}
          <LinearGradient colors={[primary, accentOrange]} className="w-full p-4">
            {/* greeting (based on time) */}
              {user.slice(0, 1).map((user) => (
                <Text key={user.id} className="text-xl text-primary-foreground font-semibold">
                  {getGreeting()}, {user.username} 👋
                </Text>
              ))}
              <Text className="text-sm text-primary-foreground/85 font-semibold">
                What are you looking for today?
              </Text>
          </LinearGradient>
          {/* main content */}

          <View className="p-3">
            <Card>
              {data.length > 0 && (
                <>
                  {(() => {
                    const categories = Array.from(
                      new Set(data.map((p) => p.category).filter(Boolean)),
                    );

                    return (
                      <View className="w-full flex-row flex-wrap">
                        {categories.map((category) => {
                          const product = data.find((p) => p.category === category);
                          const imageUri = product?.image;

                          return (
                            <Pressable
                              key={category}
                              className="w-1/2 p-1"
                              onPress={() =>
                                router.push({
                                  pathname: "/",
                                  params: { category },
                                })
                              }
                            >
                              <View
                                className="bg-primary rounded-lg overflow-hidden relative"
                                style={{ height: 60 }}
                              >
                                {imageUri ? (
                                  <Image
                                    source={{ uri: imageUri }}
                                    style={{ width: "100%", height: "100%" }}
                                    contentFit="cover"
                                  />
                                ) : (
                                  <View className="bg-primary-foreground w-full h-full" />
                                )}

                                <View
                                  style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  className="bg-primary/25"
                                >
                                  <Text className="text-primary-foreground font-semibold text-center px-2">
                                    {category}
                                  </Text>
                                </View>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    );
                  })()}
                </>
              )}
            </Card>
          </View>

          <View className="flex-1">
            <LinearGradient colors={[primaryForeground, background]} className="flex-1 rounded-xl overflow-hidden w-full p-2">
              <View className="w-full h-full flex-1 flex-row flex-wrap rounded-lg">
                <View className="w-1/2 p-1">
                  <Card>
                    <View className="gap-3">
                      <View className="gap-1">
                        <Text className="text-xl text-primary font-medium">
                          Flash Sale!
                        </Text>
                        <View className="bg-primary items-center rounded-sm">
                          <Text className="text-2xl text-center text-primary-foreground font-medium">
                            {timeLeft}
                          </Text>
                        </View>
                      </View>
                      <Carousel
                        width={CARD_WIDTH}
                        height={200}
                        style={{ width: CARD_WIDTH }}
                        loop
                        autoPlay={true}
                        autoPlayInterval={1000}
                        scrollAnimationDuration={800}
                        data={flashSaleItems}
                        renderItem={({ item }) => (
                          <Pressable
                            key={item.id}
                            onPress={() =>
                              router.push({
                                pathname: "/productDetail",
                                params: { product: JSON.stringify(item) },
                              })
                            }
                          >
                            <View
                              key={item.id}
                              style={{ width: CARD_WIDTH, height: 200 }}
                              className="bg-background overflow-hidden items-center justify-center"
                            >
                              <Image
                                source={{ uri: item.image }}
                                style={{ width: "100%", height: "100%" }}
                                contentFit="contain"
                              />
                            </View>
                          </Pressable>
                        )}
                      />
                    </View>
                  </Card>
                </View>

                {data.map((products) => (
                  <Pressable
                    key={products.id}
                    onPress={() =>
                      router.push({
                        pathname: "/productDetail",
                        params: { product: JSON.stringify(products) },
                      })
                    }
                    className="w-1/2"
                  >
                    <View className="w-full p-1">
                      <Card key={products.id}>
                        <View className="bg-background w-full rounded-lg overflow-hidden">
                          <Image
                            source={{ uri: products.image }}
                            style={{
                              width: "100%",
                              height: 125,
                            }}
                            contentFit="contain"
                          />
                        </View>
                        <View className="gap-2">
                          <View>
                            <Text
                              numberOfLines={1}
                              className="text-xl text-foreground font-medium"
                            >
                              {products.title}
                            </Text>
                          </View>
                          <View>
                            <View className="flex-row gap-1 items-center">
                              <Text
                                numberOfLines={2}
                                className="text-muted text-sm"
                              >
                                {products.description}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-foreground text-base">
                            #{products.category}
                          </Text>
                          <Text className="text-xl text-primary font-bold">
                            ${products.price},00
                          </Text>
                        </View>
                      </Card>
                    </View>
                  </Pressable>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* disclaimer */}
          <SafeAreaView edges={["bottom"]} className="px-4 py-6">
            <Text className="text-center text-muted text-sm">
              You have viewed all products available in the store.
            </Text>
          </SafeAreaView>
        </ScrollView>
      )}
    </View>
  );
}
