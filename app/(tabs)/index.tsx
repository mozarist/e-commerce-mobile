import { Image } from "expo-image";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import Card from "@/components/ui/card";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

export default function HomeScreen() {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const [data, setData] = useState<productType[]>([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((result) => setData(result));
  }, []);

  const width = Dimensions.get("window").width;
  const CARD_WIDTH = width * 0.41 - 1;

  return (
    <View className="bg-background flex-1">
      {/* header */}
      <SafeAreaView edges={["top"]} className="bg-primary p-4 gap-4">
        <View className="w-full bg-primary flex-row gap-4 justify-between items-center">
          <TextInput
            placeholder="What to buy today?"
            className="flex-1 bg-primary-foreground px-2 rounded-lg text-lg text-muted font-semibold font-serif"
          />

          <View className="flex-row gap-4">
            <MaterialIcons name="shopping-cart" size={24} color="white" />
            <MaterialIcons name="chat" size={24} color="white" />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1">
        {/* categories */}
        <View className="bg-primary w-full p-3 gap-4">
          {/* greeting (based on time) */}
          <View>
            <Text className="text-xl text-primary-foreground font-semibold font-serif">
              {getGreeting()}, johnd 👋
            </Text>
            <Text className="text-sm text-primary-foreground/85 font-semibold font-serif">
              What are you looking for today?
            </Text>
          </View>

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
                            className="rounded-lg overflow-hidden relative"
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
                              className="bg-primary-foreground/25"
                            >
                              <Text className="text-primary-foreground font-semibold font-serif text-center px-2">
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
        </View>
        {/* main content */}
        <View className="flex-1 bg-background p-2 py-6 gap-2">
          <Text className="text-2xl text-primary text-center font medium font-serif">
            Featured Products
          </Text>
          <View className="w-full h-full flex-1 flex-row flex-wrap rounded-lg">
            <View className="w-1/2 p-1">
              <Card>
                <View>
                  <Text className="text-xl text-primary font-medium font-serif">
                    Best Seller
                  </Text>
                  <Text className="text-sm text-muted font-medium font-serif">
                    Top selling products this week
                  </Text>
                </View>
                <Carousel
                  width={CARD_WIDTH}
                  // match the mapped card image height
                  height={200}
                  // make carousel container match the item width so layout is consistent
                  style={{ width: CARD_WIDTH }}
                  loop
                  autoPlay
                  autoPlayInterval={2900}
                  scrollAnimationDuration={800}
                  data={data.slice(0, 4)}
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
                        // give the item container an explicit size matching the carousel
                        style={{ width: CARD_WIDTH, height: 200 }}
                        className="bg-background rounded-md overflow-hidden items-center justify-center"
                      >
                        <Image
                          source={{ uri: item.image }}
                          // numeric style ensures the image fills the container
                          style={{ width: "100%", height: "100%" }}
                          contentFit="contain"
                        />
                      </View>
                    </Pressable>
                  )}
                />
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
                          className="text-xl text-foreground font-medium font-serif"
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
                      <Text className="text-xl text-primary font-bold font-serif px-2 py-1 rounded-md w-fit">
                        ${products.price},00
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
            You've viewed all products available in the store.
          </Text>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
