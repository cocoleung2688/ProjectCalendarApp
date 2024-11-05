// screens/ProjectCalendarScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProjectCalendarScreen({ route }) {
  const { projectId } = route.params;
  const [markedDates, setMarkedDates] = useState({});

  // Load marked dates when the screen opens
  useEffect(() => {
    const loadMarkedDates = async () => {
      const storedDates = await AsyncStorage.getItem(`markedDates-${projectId}`);
      if (storedDates) setMarkedDates(JSON.parse(storedDates));
    };
    loadMarkedDates();
  }, [projectId]);

  const toggleDate = async (date) => {
    setMarkedDates((prev) => {
      const newMarkedDates = { ...prev };
      if (newMarkedDates[date]) {
        delete newMarkedDates[date]; // Remove stamp if date is already marked
      } else {
        newMarkedDates[date] = { marked: true, dotColor: 'blue' }; // Add stamp to date
      }
      AsyncStorage.setItem(`markedDates-${projectId}`, JSON.stringify(newMarkedDates)); // Save to storage
      return newMarkedDates;
    });
  };

  return (
    <View style={styles.container}>
      <CalendarList
        style={{height: 800}}
        markedDates={markedDates}
        onDayPress={(day) => toggleDate(day.dateString)}
        theme={{
          calendarBackground: 'rgba(255, 255, 255, 0)',
          selectedDayBackgroundColor: 'blue',
          todayTextColor: 'blue',
          textDayFontSize: 20,
          textMonthFontSize: 20,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
