import { TailwindColors } from "@/constants/tailwindColors";
import { useTailwindColor } from "@/hooks/use-tailwind-color";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "success"
  | "danger"
  | "warning"
  | "info";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl";
type ButtonWeight = "regular" | "semibold" | "bold";

const SIZE_TEXT_STYLES: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
  xl: { fontSize: 20 },
  "2xl": { fontSize: 24 },
};

const WEIGHT_TEXT_STYLES: Record<ButtonWeight, TextStyle> = {
  regular: { fontWeight: "400" },
  semibold: { fontWeight: "600" },
  bold: { fontWeight: "700" },
};

const SIZE_PADDING: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: 8, paddingHorizontal: 12 },
  md: { paddingVertical: 8, paddingHorizontal: 16 },
  lg: { paddingVertical: 12, paddingHorizontal: 18 },
  xl: { paddingVertical: 16, paddingHorizontal: 20 },
  "2xl": { paddingVertical: 18, paddingHorizontal: 22 },
};

const VARIANT_TO_TAILWIND_KEY: Record<
  ButtonVariant,
  keyof typeof TailwindColors | "transparent"
> = {
  primary: "primary",
  secondary: "primary-foreground",
  ghost: "transparent",
  outline: "primary",
  success: "success",
  danger: "danger",
  warning: "warning",
  info: "info",
};

export function Button({
  variant = "primary",
  size = "md",
  weight = "regular",
  style,
  textStyle,
  className,
  children,
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  weight?: ButtonWeight;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  className?: string; // for nativewind / tailwind class overrides
  children: React.ReactNode;
} & PressableProps) {
  // When a className is provided, prefer leaving styling to the className (so callers can fully override)
  const twKey = VARIANT_TO_TAILWIND_KEY[variant];
  const isTransparentBg = twKey === "transparent" || variant === "outline";
  const bgColor = isTransparentBg
    ? "transparent"
    : useTailwindColor(twKey as keyof typeof TailwindColors);
  let borderColor: string | undefined;
  if (variant === "outline") {
    borderColor = useTailwindColor(twKey as keyof typeof TailwindColors);
  } else if (variant === "secondary") {
    // secondary should have a subtle border using the `border` color from TailwindColors
    borderColor = useTailwindColor("border");
  } else {
    borderColor = undefined;
  }

  // determine text color fallback
  let textColor = "#fff";
  if (variant === "secondary") {
    // secondary in TailwindColors is white; use a dark foreground
    textColor = useTailwindColor("primary");
  } else if (variant === "ghost") {
    textColor = useTailwindColor("foreground");
  } else if (variant === "outline") {
    // outline uses the variant color for text
    textColor = useTailwindColor(twKey as keyof typeof TailwindColors);
  } else if (twKey !== "transparent") {
    // some variants may have a dedicated foreground (like primary)
    if (twKey === "primary" && "primaryForeground" in TailwindColors) {
      // primaryForeground exists in constants
      // @ts-ignore access safe by key check above
      textColor = useTailwindColor("primaryForeground");
    } else {
      textColor = "#fff";
    }
  }

  const pressableStyle = className
    ? [{ borderRadius: 5, alignItems: "center" }, style]
    : [
        {
          borderRadius: 5,
          alignItems: "center",
          backgroundColor: bgColor,
          ...(variant === "outline" || variant === "secondary"
            ? { borderWidth: 1, borderColor }
            : {}),
        },
        SIZE_PADDING[size],
        style,
      ];

  const textStyles = className
    ? [SIZE_TEXT_STYLES[size], WEIGHT_TEXT_STYLES[weight], textStyle]
    : [
        { color: textColor },
        SIZE_TEXT_STYLES[size],
        WEIGHT_TEXT_STYLES[weight],
        textStyle,
      ];

  return (
    // pass className down so nativewind can pick it up when used in this project
    <Pressable
      style={pressableStyle as StyleProp<ViewStyle>}
      {...props}
      {...(className ? ({ className } as any) : {})}
    >
      <Text
        style={textStyles as StyleProp<TextStyle>}
        {...(className ? ({ className } as any) : {})}
      >
        {children}
      </Text>
    </Pressable>
  );
}
