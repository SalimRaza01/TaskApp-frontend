import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function CalenderModal() {

    const CalendarModal = ({ visible, markedDates, onClose }) => {
        return (
          <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.calendarModalContainer}>
              <Calendar
                    current={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
              />
              <TouchableOpacity onPress={onClose}>
                <Text>Close Calendar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        );
      };
      
}

const styles = StyleSheet.create({})