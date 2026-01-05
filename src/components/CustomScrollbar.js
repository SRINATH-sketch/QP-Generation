import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomScrollbar = ({ contentHeight, containerHeight, scrollOffset, isDarkMode }) => {
    // Only show if content is scrollable
    if (contentHeight <= containerHeight || containerHeight <= 0) return null;

    const scrollIndicatorSize = containerHeight > 0 && contentHeight > 0
        ? (containerHeight / contentHeight) * containerHeight
        : 0;

    // Minimum size for the thumb
    const thumbHeight = Math.max(scrollIndicatorSize, 40);

    const scrollIndicatorPosition = containerHeight > 0 && contentHeight > 0
        ? (scrollOffset / (contentHeight - containerHeight)) * (containerHeight - thumbHeight)
        : 0;

    // Clamp position
    const top = Math.max(0, Math.min(scrollIndicatorPosition, containerHeight - thumbHeight));

    return (
        <View style={styles.track}>
            <View
                style={[
                    styles.thumb,
                    {
                        height: thumbHeight,
                        top: top,
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        position: 'absolute',
        right: 2,
        top: 5,
        bottom: 5,
        width: 6,
        zIndex: 99999, // Keep high z-index for visibility
        backgroundColor: 'transparent',
    },
    thumb: {
        width: 6,
        borderRadius: 3,
        position: 'absolute',
    },
});

export default CustomScrollbar;
