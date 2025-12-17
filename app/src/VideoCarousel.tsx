import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { VideoHeader } from './VideoHeader';

const { width } = Dimensions.get('window');
const AUTO_SCROLL_INTERVAL = 10000; // 10 seconds

const FEATURED_DATA = [
    {
        id: '1',
        title: 'Wednesday',
        description: 'Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.',
        videoUri: 'https://videos.pexels.com/video-files/4907625/4907625-sd_338_640_25fps.mp4'
    },
    {
        id: '2',
        title: 'Stranger Things',
        description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
        videoUri: 'https://videos.pexels.com/video-files/30562583/13089052_360_640_30fps.mp4'
    },
    {
        id: '3',
        title: 'The Witcher',
        description: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
        videoUri: 'https://videos.pexels.com/video-files/3444528/3444528-sd_360_640_25fps.mp4'
    }
];

export function VideoCarousel({ navigation }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            if (currentIndex < FEATURED_DATA.length - 1) {
                flatListRef.current?.scrollToIndex({
                    index: currentIndex + 1,
                    animated: true
                });
            } else {
                flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true
                });
            }
        }, AUTO_SCROLL_INTERVAL);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const handlePlay = () => {
        if (FEATURED_DATA[currentIndex]) {
            navigation.navigate('VideoPlayer', {
                id: FEATURED_DATA[currentIndex].id,
                title: FEATURED_DATA[currentIndex].title,
                videoUri: FEATURED_DATA[currentIndex].videoUri
            });
        }
    };

    const handleMoreInfo = () => {
        navigation.navigate('Details', {
            id: FEATURED_DATA[currentIndex].id,
            title: FEATURED_DATA[currentIndex].title,
            description: FEATURED_DATA[currentIndex].description,
            imageUri: 'https://images.pexels.com/photos/14861662/pexels-photo-14861662.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <VideoHeader
                title={item.title}
                description={item.description}
                onPlay={handlePlay}
                onMoreInfo={handleMoreInfo}
                videoUri={item.videoUri}
            />
        </View>
    );

    const getItemLayout = (_, index) => ({
        length: width,
        offset: width * index,
        index,
    });

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={FEATURED_DATA}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(newIndex);
                }}
                keyExtractor={(item) => item.id}
                getItemLayout={getItemLayout}
                initialScrollIndex={0}
                onScrollToIndexFailed={() => {}}
            />
            <View style={styles.pagination}>
                {FEATURED_DATA.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            currentIndex === index && styles.paginationDotActive,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    slide: {
        width: width,
    },
    pagination: {
        position: 'absolute',
        bottom: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 8,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    paginationDotActive: {
        backgroundColor: '#fff',
    },
});