import { useState, useEffect } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { EventEmitter } from "expo-modules-core";

import { icons } from "../constants";

// Create a global event emitter
const videoEventEmitter = new EventEmitter();

const VideoCard = ({ title, creator, avatar, thumbnail, video, id }) => {
  const [play, setPlay] = useState(false);

  const videoSource =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const player = useVideoPlayer(video, (player) => {
    player.loop = false;
    player.volume = 1.0;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    const subscription = videoEventEmitter.addListener(
      "videoStateChange",
      (data) => {
        if (data.id === id && data.action === "pause") {
          handlePause();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [id]);

  const handlePlayPress = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handlePlay = () => {
    // Emit event to pause other videos
    videoEventEmitter.emit("videoStateChange", {
      id: id,
      action: "pause",
    });

    player.play();
    setPlay(true);
  };

  const handlePause = () => {
    player.pause();
    setPlay(false);
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <View style={styles.videoContainer}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePlayPress}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    height: 240,
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default VideoCard;
