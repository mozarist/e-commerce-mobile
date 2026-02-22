import { useTailwindColor } from "@/hooks/use-tailwind-color";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type usersType = {
  id: number;
  username: string;
};

type ReelItem = {
  id: string;
  creator: usersType;
  caption: string;
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

function ReelCard({
  item,
  isActive,
  primary,
  muted,
  accentRed,
  bottomInset,
  reelHeight,
}: {
  item: ReelItem;
  isActive: boolean;
  primary: string;
  muted: string;
  accentRed: string;
  bottomInset: number;
  reelHeight: number;
}) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    if (disliked) return;
    setLiked((prev) => !prev);
  };

  const handleDislike = () => {
    setDisliked((prev) => {
      const next = !prev;
      if (next) setLiked(false);
      return next;
    });
  };

  return (
    <View style={[styles.reel, { height: reelHeight }]}>      
      {/* full-screen image/video placeholder */}
      <View style={styles.imagePlaceholder}>
        <MaterialIcons name="image" size={80} color="#444" />
        <Text style={styles.placeholderText}>Placeholder Content</Text>
      </View>

      {/* right-side action buttons */}
      <View style={[styles.actionsColumn, { bottom: 80 }]}>
        {/* like */}
        <Pressable onPress={handleLike} style={styles.actionButton}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={30}
            color={liked ? accentRed : disliked ? "#555" : "#fff"}
          />
          <Text style={[styles.actionLabel, liked && { color: accentRed }]}>
            Like
          </Text>
        </Pressable>

        {/* dislike */}
        <Pressable onPress={handleDislike} style={styles.actionButton}>
          <Ionicons
            name={disliked ? "thumbs-down" : "thumbs-down-outline"}
            size={26}
            color={disliked ? primary : "#fff"}
          />
          <Text style={[styles.actionLabel, disliked && { color: primary }]}>
            Dislike
          </Text>
        </Pressable>

        {/* comment */}
        <Pressable style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={26} color="#fff" />
          <Text style={styles.actionLabel}>Comment</Text>
        </Pressable>

        {/* share */}
        <Pressable style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={26} color="#fff" />
          <Text style={styles.actionLabel}>Share</Text>
        </Pressable>
      </View>

      {/* bottom overlay: creator + caption */}
      <View style={[styles.bottomOverlay, { bottom: 16 }]}>
        <View style={styles.creatorRow}>
          <View style={[styles.avatar, { backgroundColor: primary }]}>
            <Text style={styles.avatarText}>
              {item.creator.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.creatorName}>{item.creator.username}</Text>
        </View>
        <Text style={styles.caption} numberOfLines={2}>
          {item.caption}
        </Text>
      </View>
    </View>
  );
}

export default function Feed() {
  const primary = useTailwindColor("primary");
  const muted = useTailwindColor("muted");
  const accentRed = useTailwindColor("accent-red");
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const reelHeight = SCREEN_HEIGHT - tabBarHeight;

  const [data, setData] = useState<usersType[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("https://fakestoreapi.com/users")
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch(() => setData([]))
      .finally(() => setLoadingUsers(false));
  }, []);

  const creators = data.slice(1, 6);

  const reels: ReelItem[] = creators.length > 0
    ? creators.map((creator, i) => ({
        id: String(i + 1),
        creator,
        caption: "Insert text here lorem ipsum dolor sit amet",
      }))
    : [];

  const onViewableItemsChanged = React.useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (loadingUsers) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* floating header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Live & Video</Text>
      </View>

      <FlatList
        data={reels}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReelCard
            item={item}
            isActive={index === activeIndex}
            primary={primary}
            muted={muted}
            accentRed={accentRed}
            bottomInset={insets.bottom}
            reelHeight={reelHeight}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={reelHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: reelHeight,
          offset: reelHeight * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  reel: {
    width: SCREEN_WIDTH,
    backgroundColor: "#000",
    position: "relative",
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  placeholderText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 13,
    marginTop: 8,
  },
  actionsColumn: {
    position: "absolute",
    right: 12,
    alignItems: "center",
    gap: 24,
  },
  actionButton: {
    alignItems: "center",
  },
  actionLabel: {
    color: "#fff",
    fontSize: 11,
    marginTop: 4,
  },
  bottomOverlay: {
    position: "absolute",
    left: 0,
    right: 64,
    paddingHorizontal: 16,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  creatorName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  caption: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
  },
});