import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useTailwindColor } from "@/hooks/use-tailwind-color";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function ProductDetail() {
  const Animated = require("react-native").Animated;
  const primary = useTailwindColor("primary");
  const accentRed = useTailwindColor("accent-red");

  const parameter = useLocalSearchParams();
  const product: productType = JSON.parse(parameter.product as string);

  const [isHidden, setIsHidden] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<productType[]>(
    [],
  );

  const opacityRef = React.useRef(new Animated.Value(isHidden ? 0 : 1));

  const toggle = () =>
    setIsHidden((h) => {
      const next = !h;
      Animated.timing(opacityRef.current, {
        toValue: next ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return next;
    });

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((result: productType[]) => {
        const rec = result
          .filter((p) => p.category === product.category && p.id !== product.id)
          .slice(0, 6);
        setRecommendedProducts(rec);
      });
  }, [product.category, product.id]);

  return (
    <>
      <ScrollView>
        <View className="w-full aspect-square bg-primary-foreground">
          <Image
            source={{ uri: product.image }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </View>
        <ScrollView key={product.id} className="flex-1 bg-background p-4 gap-4">
          <View className="justify-start gap-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="w-20 aspect-square mr-2 bg-primary-foreground rounded-xl overflow-hidden border-2 border-border">
                <Image
                  source={{ uri: product.image }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View className="w-20 aspect-square mr-2 bg-muted/25 rounded-xl overflow-hidden border-2 border-border"></View>
              <View className="w-20 aspect-square mr-2 bg-muted/25 rounded-xl overflow-hidden border-2 border-border"></View>
              <View className="w-20 aspect-square mr-2 bg-muted/25 rounded-xl overflow-hidden border-2 border-border"></View>
              <View className="w-20 aspect-square mr-2 bg-muted/25 rounded-xl overflow-hidden border-2 border-border"></View>
            </ScrollView>

            <View className="gap-2">
              <View className="flex-row justify-between items-center w-full">
                <Text className="text-2xl text-primary font-medium">
                  ${product.price},00
                </Text>
                <Pressable
                  className="flex-row gap-2 items-center"
                  onPress={toggle}
                >
                  <Animated.Text
                    style={{ opacity: opacityRef.current }}
                    className="text-muted text-sm"
                  >
                    {isHidden ? "" : "Added to liked items"}
                  </Animated.Text>
                  <Ionicons
                    name={isHidden ? "heart-outline" : "heart"}
                    size={24}
                    color={isHidden ? primary : accentRed}
                  />
                </Pressable>
              </View>
              <Text className="text-foreground text-2xl font-medium">
                {product.title}
              </Text>
              <Text className="text-sm text-foreground">Category: <Text className="text-muted">{product.category}</Text></Text>

              <View className="py-2">
                <Text className="text-sm text-foreground font-medium">Product Description:</Text>
                <Text className="text-sm text-muted">{product.description}</Text>
              </View>
            </View>

            {/* recommendations based on category */}
            {recommendedProducts.length > 0 && (
              <View className="mt-4">
                <Text className="text-lg font-semibold mb-2 text-foreground">
                  You may also like
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recommendedProducts.map((p) => (
                    <Pressable
                      key={p.id}
                      onPress={() =>
                        router.push({
                          pathname: "/productDetail",
                          params: { product: JSON.stringify(p) },
                        })
                      }
                      className="mr-2"
                    >
                      <Card>
                        <View className="w-40 aspect-square rounded-lg overflow-hidden bg-background">
                          <Image
                            source={{ uri: p.image }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="contain"
                          />
                        </View>
                        <View>
                          <Text numberOfLines={1} className="text-sm text-foreground font-medium w-32">
                            {p.title}
                          </Text>
                          <Text numberOfLines={3} className="text-xs text-muted w-32">
                            {p.description}
                          </Text>
                        </View>
                        <Text className="text-base text-primary font-medium">
                          ${p.price},00
                        </Text>
                      </Card>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>
      </ScrollView>
      <SafeAreaView
        edges={["bottom"]}
        className="bg-primary-foreground px-4 py-2 flex-row gap-2 items-center"
      >
        <View className="flex-1">
          <Button variant="secondary" size="lg">
            <MaterialIcons name="chat" size={24} color="primary" />
          </Button>
        </View>
        <View className="flex-1">
          <Button variant="secondary" size="lg">
            <MaterialIcons
              name="shopping-cart-checkout"
              size={24}
              color="primary"
            />
          </Button>
        </View>
        <View className="flex-2">
          <Button size="lg">
            <Text className="font-bold">
              Buy for ${product.price},00
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
}
