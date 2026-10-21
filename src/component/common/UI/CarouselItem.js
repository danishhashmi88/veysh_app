// CarouselItem.js
import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import BannerSkeleton from "../../skeleton/BannerSkeleton";

const CarouselItem = ({ item, style, outsideContainerStyle }) => {
  const [loading, setLoading] = useState(true);

  return (
    <TouchableOpacity disabled={true} style={outsideContainerStyle}>
      {loading && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 1000 }]}>
          <BannerSkeleton />
        </View>
      )}
      <Image
        source={{ uri: item?.image }}
        style={style}
        resizeMode="cover"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </TouchableOpacity>
  );
};

export default CarouselItem;
