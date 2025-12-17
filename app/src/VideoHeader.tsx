import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Info } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.7;

interface VideoHeaderProps {
    title: string;
    description: string;
    onPlay: () => void;
    onMoreInfo: () => void;
    videoUri: string;
}

export function VideoHeader({ title, description, onPlay, onMoreInfo, videoUri }: VideoHeaderProps) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            (async () => {
                await videoRef.current.playAsync();
                await videoRef.current.setIsLoopingAsync(true);
            })();
        }
        return () => {
            if (videoRef.current) {
                videoRef.current.unloadAsync();
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.video}
                isMuted={true}
                shouldPlay
                videoStyle={styles.video}
            />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {description}
                    </Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={onPlay}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Play size={20} color="#000" />
                            <Text style={styles.playText}>Play</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.infoButton}
                            onPress={onMoreInfo}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Info size={20} color="#fff" />
                            <Text style={styles.infoText}>More Info</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: HEADER_HEIGHT,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
    },
    video: {
        height: '100%',
        width: '100%',
        minWidth: '100%',
        minHeight: '100%',
        objectFit: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    content: {
        paddingHorizontal: 16,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 16,
        opacity: 0.8,
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    playButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 4,
        gap: 8,
    },
    playText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    infoButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 4,
        gap: 8,
    },
    infoText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});