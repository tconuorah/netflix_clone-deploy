import React from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoCarousel } from './VideoCarousel';
import { CarouselItem } from './CarouselItem';

const { width } = Dimensions.get('window');

const SECTIONS = [
    {
        title: "Trending Now",
        data: [
            { id: '1', title: 'Stranger Things', imageUri: 'https://images.pexels.com/photos/3371382/pexels-photo-3371382.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '2', title: 'The Crown', imageUri: 'https://images.pexels.com/photos/3520333/pexels-photo-3520333.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '3', title: 'Bridgerton', imageUri: 'https://images.pexels.com/photos/6842313/pexels-photo-6842313.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '4', title: 'Squid Game', imageUri: 'https://images.pexels.com/photos/6896324/pexels-photo-6896324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '5', title: 'Dark', imageUri: 'https://images.pexels.com/photos/1828307/pexels-photo-1828307.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' }
        ]
    },
    {
        title: "Popular on Netflix",
        data: [
            { id: '6', title: 'The Witcher', imageUri: 'https://images.pexels.com/photos/11937140/pexels-photo-11937140.png?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '7', title: 'Money Heist', imageUri: 'https://images.pexels.com/photos/6624302/pexels-photo-6624302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '8', title: 'Black Mirror', imageUri: 'https://images.pexels.com/photos/1083807/pexels-photo-1083807.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '9', title: 'Ozark', imageUri: 'https://images.pexels.com/photos/18024344/pexels-photo-18024344.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '10', title: 'The Queen\'s Gambit', imageUri: 'https://images.pexels.com/photos/15109309/pexels-photo-15109309.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' }
        ]
    },
    {
        title: "Watch It Again",
        data: [
            { id: '11', title: 'Breaking Bad', imageUri: 'https://images.pexels.com/photos/28580456/pexels-photo-28580456.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '12', title: 'Peaky Blinders', imageUri: 'https://images.pexels.com/photos/30599829/pexels-photo-30599829.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '13', title: 'Narcos', imageUri: 'https://images.pexels.com/photos/25798553/pexels-photo-25798553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '14', title: 'Better Call Saul', imageUri: 'https://images.pexels.com/photos/3030689/pexels-photo-3030689.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { id: '15', title: 'The Crown', imageUri: 'https://images.pexels.com/photos/30625555/pexels-photo-30625555.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' }
        ]
    }
];

export function HomeScreen({ navigation }) {
    const handleItemPress = (id: string, item: any) => {
        navigation.push('Details', {
            id,
            title: item.title,
            imageUri: item.imageUri,
            description: item.description
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <VideoCarousel navigation={navigation} />

                <View style={styles.content}>
                    {SECTIONS.map((section) => (
                        <View key={section.title} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.carousel}
                            >
                                {section.data.map((item) => (
                                    <CarouselItem
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        imageUri={item.imageUri}
                                        onPress={() => handleItemPress(item.id, item)}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    ))}
                </View>
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
    content: {
        paddingTop: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    carousel: {
        paddingHorizontal: 16,
    }
});