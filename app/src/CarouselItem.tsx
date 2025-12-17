import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CarouselItemProps {
    id: string;
    title: string;
    imageUri: string;
    onPress: () => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28;

export function CarouselItem({ id, title, imageUri, onPress }: CarouselItemProps) {
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.container}
            activeOpacity={0.9}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Animated.View style={[styles.imageContainer, { transform: [{ scale }] }]}>
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                />
            </Animated.View>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: ITEM_WIDTH,
        marginRight: 12,
    },
    imageContainer: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH * 1.5,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    title: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
        opacity: 0.9,
        marginTop: 4,
    },
});