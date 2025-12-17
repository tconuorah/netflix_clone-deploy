import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Animated } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Maximize2, Minimize2, SkipBack, SkipForward, Play, Pause } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface VideoPlayerScreenProps {
    route: {
        params: {
            id: string;
            title: string;
            videoUri: string;
        };
    };
    navigation: any;
}

export function VideoPlayerScreen({ route, navigation }: VideoPlayerScreenProps) {
    const { title, videoUri } = route.params;
    const videoRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [status, setStatus] = useState<any>({});
    const [showControls, setShowControls] = useState(true);
    const controlsOpacity = useRef(new Animated.Value(1)).current;
    const controlsTimeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (showControls) {
            // Clear any existing timeout
            if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
            }
            // Set new timeout to hide controls
            controlsTimeout.current = setTimeout(() => {
                hideControls();
            }, 3000);
        }
        return () => {
            if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
            }
        };
    }, [showControls]);

    const toggleControls = () => {
        if (showControls) {
            hideControls();
        } else {
            showControlsWithTimeout();
        }
    };

    const showControlsWithTimeout = () => {
        setShowControls(true);
        Animated.timing(controlsOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const hideControls = () => {
        Animated.timing(controlsOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setShowControls(false));
    };

    const toggleFullscreen = async () => {
        if (videoRef.current) {
            if (isFullscreen) {
                await videoRef.current.dismissFullscreenPlayer();
            } else {
                await videoRef.current.presentFullscreenPlayer();
            }
            setIsFullscreen(!isFullscreen);
        }
    };

    const togglePlayPause = async () => {
        if (videoRef.current) {
            if (status.isPlaying) {
                await videoRef.current.pauseAsync();
            } else {
                await videoRef.current.playAsync();
            }
        }
    };

    const skipBackward = async () => {
        if (videoRef.current && status.positionMillis) {
            await videoRef.current.setPositionAsync(
                Math.max(0, status.positionMillis - 10000)
            );
        }
    };

    const skipForward = async () => {
        if (videoRef.current && status.positionMillis && status.durationMillis) {
            await videoRef.current.setPositionAsync(
                Math.min(status.durationMillis, status.positionMillis + 10000)
            );
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.videoWrapper}
                onPress={toggleControls}
                activeOpacity={1}
            >
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{ uri: videoUri }}
                    useNativeControls={false}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                    shouldPlay
                />

                {showControls && (
                    <Animated.View style={[styles.controls, { opacity: controlsOpacity }]}>
                        <SafeAreaView style={styles.header}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={styles.backButton}
                            >
                                <ArrowLeft color="#fff" size={24} />
                            </TouchableOpacity>
                            <Text style={styles.title} numberOfLines={1}>{title}</Text>
                            <TouchableOpacity
                                onPress={toggleFullscreen}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={styles.fullscreenButton}
                            >
                                {isFullscreen ? (
                                    <Minimize2 color="#fff" size={24} />
                                ) : (
                                    <Maximize2 color="#fff" size={24} />
                                )}
                            </TouchableOpacity>
                        </SafeAreaView>

                        <View style={styles.centerControls}>
                            <TouchableOpacity
                                onPress={skipBackward}
                                style={styles.controlButton}
                                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                            >
                                <SkipBack color="#fff" size={32} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={togglePlayPause}
                                style={[styles.controlButton, styles.playPauseButton]}
                                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                            >
                                {status.isPlaying ? (
                                    <Pause color="#fff" size={32} />
                                ) : (
                                    <Play color="#fff" size={32} />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={skipForward}
                                style={styles.controlButton}
                                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                            >
                                <SkipForward color="#fff" size={32} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.progressBar}>
                            <View style={[styles.progress, {
                                width: `${status.positionMillis && status.durationMillis ?
                                    (status.positionMillis / status.durationMillis) * 100 : 0}%`
                            }]} />
                        </View>
                    </Animated.View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    video: {
        width: width,
        height: height,
    },
    controls: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backButton: {
        padding: 8,
    },
    title: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 16,
    },
    fullscreenButton: {
        padding: 8,
    },
    centerControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },
    controlButton: {
        padding: 12,
    },
    playPauseButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 40,
        padding: 20,
    },
    progressBar: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginBottom: 20,
    },
    progress: {
        height: '100%',
        backgroundColor: '#E50914',
    },
});