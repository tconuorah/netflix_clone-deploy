import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, ArrowLeft, ChevronDown, Plus } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Episode {
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    description: string;
}

interface Season {
    id: string;
    title: string;
    episodes: Episode[];
}

const SEASONS_DATA: Season[] = [
    {
        id: '1',
        title: 'Season 1',
        episodes: [
            {
                id: '1',
                title: 'Chapter One: The Vanishing',
                duration: '57m',
                thumbnail: 'https://images.pexels.com/photos/20501807/pexels-photo-20501807.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
                description: 'On the way home from a party, a teenager goes missing, prompting a frantic search that reveals dark secrets about the town.'
            },
            {
                id: '2',
                title: 'Chapter Two: The Weirdo',
                duration: '54m',
                thumbnail: 'https://images.pexels.com/photos/27855748/pexels-photo-27855748.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
                description: 'As the investigation continues, strange phenomena begin to occur, leading to unexpected discoveries.'
            },
            // Add more episodes as needed
        ]
    },
    {
        id: '2',
        title: 'Season 2',
        episodes: [
            {
                id: '1',
                title: 'Chapter One: The Return',
                duration: '51m',
                thumbnail: 'https://images.pexels.com/photos/13926939/pexels-photo-13926939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
                description: 'One year later, the town seems to have returned to normal, but new threats emerge from unexpected places.'
            },
            // Add more episodes
        ]
    }
];

interface DetailsScreenProps {
    route: {
        params: {
            id: string;
            title: string;
            imageUri: string;
            description?: string;
        };
    };
    navigation: any;
}

export function DetailsScreen({ route, navigation }: DetailsScreenProps) {
    const { id, title, imageUri, description } = route.params;
    const opacity = new Animated.Value(0);
    const translateY = new Animated.Value(50);
    const [selectedSeason, setSelectedSeason] = useState<Season>(SEASONS_DATA[0]);
    const [showSeasonPicker, setShowSeasonPicker] = useState(false);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handlePlay = () => {
        navigation.navigate('VideoPlayer', {
            id,
            title,
            videoUri: 'https://videos.pexels.com/video-files/3843425/3843425-sd_338_640_25fps.mp4'
        });
    };

    const handleEpisodePress = (episode: Episode) => {
        navigation.navigate('VideoPlayer', {
            id: episode.id,
            title: episode.title,
            videoUri: 'https://videos.pexels.com/video-files/3843425/3843425-sd_338_640_25fps.mp4'
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} bounces={false}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
                        style={styles.gradient}
                    />
                    <SafeAreaView style={styles.headerContent}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={styles.backButton}
                        >
                            <ArrowLeft color="#fff" size={24} />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                <Animated.View
                    style={[styles.content, {
                        opacity,
                        transform: [{ translateY }]
                    }]}
                >
                    <Text style={styles.title}>{title}</Text>

                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={handlePlay}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Play size={20} color="#000" />
                        <Text style={styles.playText}>Play</Text>
                    </TouchableOpacity>

                    <Text style={styles.description}>
                        {description || 'A gripping story that will keep you on the edge of your seat. Watch as the characters navigate through challenges and discover themselves in this compelling narrative.'}
                    </Text>

                    <View style={styles.details}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Cast</Text>
                            <Text style={styles.detailText}>Actor 1, Actor 2, Actor 3</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Genre</Text>
                            <Text style={styles.detailText}>Drama, Thriller</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Release Year</Text>
                            <Text style={styles.detailText}>2024</Text>
                        </View>
                    </View>

                    <View style={styles.seasonHeader}>
                        <TouchableOpacity
                            style={styles.seasonSelector}
                            onPress={() => setShowSeasonPicker(!showSeasonPicker)}
                        >
                            <Text style={styles.seasonTitle}>{selectedSeason.title}</Text>
                            <ChevronDown color="#fff" size={20} />
                        </TouchableOpacity>
                    </View>

                    {showSeasonPicker && (
                        <View style={styles.seasonPicker}>
                            {SEASONS_DATA.map(season => (
                                <TouchableOpacity
                                    key={season.id}
                                    style={styles.seasonOption}
                                    onPress={() => {
                                        setSelectedSeason(season);
                                        setShowSeasonPicker(false);
                                    }}
                                >
                                    <Text style={[styles.seasonOptionText,
                                        selectedSeason.id === season.id && styles.seasonOptionTextActive
                                    ]}>
                                        {season.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={styles.episodesList}>
                        {selectedSeason.episodes.map(episode => (
                            <TouchableOpacity
                                key={episode.id}
                                style={styles.episodeItem}
                                onPress={() => handleEpisodePress(episode)}
                            >
                                <Image
                                    source={{ uri: episode.thumbnail }}
                                    style={styles.episodeThumbnail}
                                />
                                <View style={styles.episodeInfo}>
                                    <View style={styles.episodeHeader}>
                                        <Text style={styles.episodeTitle}>{episode.title}</Text>
                                        <Text style={styles.episodeDuration}>{episode.duration}</Text>
                                    </View>
                                    <Text style={styles.episodeDescription} numberOfLines={2}>
                                        {episode.description}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.downloadButton}>
                                    <Plus color="#fff" size={20} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.recommendationsSection}>
                        <Text style={styles.sectionTitle}>More Like This</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.recommendationsList}
                        >
                            {[1, 2, 3, 4, 5].map(item => (
                                <TouchableOpacity key={item} style={styles.recommendationItem}>
                                    <Image
                                        source={{ uri: `https://images.pexels.com/photos/9807283/pexels-photo-9807283.jpeg?auto=compress&cs=tinysrgb&h=650&w=940}` }}
                                        style={styles.recommendationImage}
                                    />
                                    <Text style={styles.recommendationTitle} numberOfLines={1}>
                                        Similar Show {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        height: height * 0.5,
        width: '100%',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
    },
    headerContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    backButton: {
        padding: 16,
    },
    content: {
        padding: 16,
        marginTop: -60,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    playButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 4,
        gap: 8,
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    playText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 24,
        opacity: 0.8,
        marginBottom: 24,
    },
    details: {
        gap: 16,
        marginBottom: 32,
    },
    detailItem: {
        gap: 4,
    },
    detailLabel: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.6,
    },
    detailText: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.9,
    },
    seasonHeader: {
        marginBottom: 16,
    },
    seasonSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    seasonTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    seasonPicker: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        marginBottom: 16,
        padding: 8,
    },
    seasonOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    seasonOptionText: {
        color: '#fff',
        opacity: 0.7,
        fontSize: 16,
    },
    seasonOptionTextActive: {
        opacity: 1,
        fontWeight: '600',
    },
    episodesList: {
        gap: 16,
        marginBottom: 32,
    },
    episodeItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    episodeThumbnail: {
        width: 120,
        height: 68,
        borderRadius: 4,
        backgroundColor: '#1a1a1a',
    },
    episodeInfo: {
        flex: 1,
        gap: 4,
    },
    episodeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    episodeTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    episodeDuration: {
        color: '#fff',
        opacity: 0.7,
        fontSize: 14,
    },
    episodeDescription: {
        color: '#fff',
        opacity: 0.7,
        fontSize: 13,
        lineHeight: 18,
    },
    downloadButton: {
        padding: 8,
    },
    recommendationsSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    recommendationsList: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    recommendationItem: {
        width: width * 0.35,
        marginRight: 12,
    },
    recommendationImage: {
        width: '100%',
        height: width * 0.5,
        borderRadius: 4,
        backgroundColor: '#1a1a1a',
        marginBottom: 8,
    },
    recommendationTitle: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.9,
    },
});