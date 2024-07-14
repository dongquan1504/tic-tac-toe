import { Image, StyleSheet, TouchableOpacity, Button, View } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import GameScreen from '@/components/game';

export default function HomeScreen() {
  const [currentView, setCurrentView] = useState('home');

  const renderContent = () => {
    switch (currentView) {
      case 'rules':
        return <><ThemedText>
          The game is played on a grid that's 3 squares by 3 squares.
          You are X, your friend (or the computer in this case) is O.
          Players take turns putting their marks in empty squares.
          The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner.
          When all 9 squares are full, the game is over.
          If no player has 3 marks in a row, the game ends in a tie.
        </ThemedText>
          <ThemedText>
            <ThemedText type="defaultSemiBold">Note</ThemedText>: When three pieces have been placed on the board, the fourth piece will replace the first one, meaning the first piece will disappear to make room for the fourth.
          </ThemedText></>;
      case 'playGame':
        return <GameScreen />;
      default:
        // The default view is 'home'
        return (
          <>
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Welcome to tic-tac-toe!</ThemedText>
              {/* <HelloWave /> */}
            </ThemedView>
            <Button
              title="Play Game"
              onPress={() => setCurrentView('playGame')}
            />
            <Button
              title="Rules"
              onPress={() => setCurrentView('rules')}
            />
          </>
        );
    }
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#737373' }}
      headerImage={
        <>
          {currentView !== 'home' && (
            <TouchableOpacity
              style={styles.backIconContainer}
              onPress={() => setCurrentView('home')}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          )}
          <View style={styles.imageCropContainer}>
            <Image
              source={require('@/assets/images/partial-react-logo.png')}
              style={styles.reactLogoCropped}
            />
          </View>
        </>
      }>
      {renderContent()}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  backIconContainer: {
    position: 'absolute', // Adjust positioning as needed
    top: 40, // Adjust according to your header's layout
    left: 10, // Adjust according to your header's layout
    zIndex: 10, // Ensure it's above other elements
  },
  backIcon: {
    width: 24, // Adjust size as needed
    height: 24, // Adjust size as needed
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  imageCropContainer: {
    position: 'absolute',
    width: 200, // Desired crop width
    height: 200, // Desired crop height
    overflow: 'hidden',
    bottom: 0,
  },
  reactLogoCropped: {
    width: "100%", // Actual image width after cropping
    height: "100%", // Actual image height after cropping
    position: 'relative',
    bottom: -50,
  },
});
