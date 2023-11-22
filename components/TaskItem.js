import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const TaskItem = ({ task, response, openTaskDetails }) => {

  const navigation = useNavigation();

  const formatDeadline = deadline => {
  try {
    if (!deadline) {
      console.warn('Invalid Deadline:', deadline);
      return { formattedDeadline: 'Invalid Deadline' };
    }

    const dateParts = deadline.split('/');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const day = parseInt(dateParts[2]);
      const date = new Date(year, month, day);

      if (isNaN(date.getTime())) {
        console.warn('Invalid Deadline:', deadline);
        return { formattedDeadline: 'Invalid Deadline' };
      }

      const options = { month: 'short' };
      const monthName = new Intl.DateTimeFormat('en-US', options).format(date);
      const formattedDeadline = `${day.toString().padStart(2, '0')} ${monthName}`;

      return { day, monthName, formattedDeadline };
    } else {
      const date = new Date(deadline);

      if (isNaN(date.getTime())) {
        console.warn('Invalid Deadline:', deadline);
        return { formattedDeadline: 'Invalid Deadline' };
      }

      const day = date.getDate().toString().padStart(2, '0');
      const options = { month: 'short' };
      const monthName = new Intl.DateTimeFormat('en-US', options).format(date);
      const formattedDeadline = `${day} ${monthName}`;

      return { day, monthName, formattedDeadline };
    }
  } catch (error) {
    console.error('Error formatting deadline:', error);
    return { formattedDeadline: 'Error Formatting Deadline' };
  }
};
const trimDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return `${description.substring(0, maxLength)}...`;
  }
  return description;
};
  return (
    <View style={styles.taskItem}>
      <View style={styles.taskTextContainer}>
      <View
  style={[
    styles.taskCompleteView,
    { backgroundColor: task.status === 'Completed' ? '#4CAF50' : '#FF9500' },
  ]}
>
  <Text style={styles.taskCompleteTag}>{task.status}</Text>
</View>

        <Text style={styles.responseData}>{JSON.stringify(response)}</Text>
        <Text
          style={[
            styles.taskText,
            task.status === 'Completed' && styles.completedTaskText,
          ]}
        >
          {task.title}
        </Text>
        <Text style={styles.taskDescription}>
          Description:  {trimDescription(task.description, 20)}
        </Text>
        {/* <Text style={styles.taskStatus}>Status: {task.status}</Text> */}
        <Text style={styles.taskDeadline}>
          Deadline: {formatDeadline(task.deadline).formattedDeadline}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => openTaskDetails(task)}
          style={[styles.ViewTaskButton]}
        >
          <Text style={styles.buttonText}>View Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f7f7',
  },
  responseData: {
    marginTop: height * -0.019,
  },
  taskItem: {
    marginLeft: width * 0.015,
    width: width * 0.87,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: width * 0.03,
    borderRadius: width * 0.03,
    elevation: 10,
    marginTop: height * 0.01,
    marginBottom: height * 0.013,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.003,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  taskDescription: {
    fontSize: width * 0.03,
    color: '#666',
    marginBottom: height * 0.03,
  },
  taskStatus: {
    fontSize: width * 0.03,
    color: '#666',
  },
  taskDeadline: {
    color: '#FF3B12',
    fontSize: width * 0.03,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: width * 0.015,
    padding: width * 0.022,
    marginBottom: height * 0.01,
    marginRight: width * 0.03,
    alignItems: 'center',
    width: width * 0.25,
  },
  completedButton: {
    backgroundColor: '#808080',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  deleteButton: {
    backgroundColor: '#FF9500',
    borderRadius: width * 0.015,
    padding: width * 0.022,
    alignItems: 'center',
    width: width * 0.25,
  },
  taskList: {
    flex: 1,
    // height: height * 0.67,
  },
  taskTime: {
    fontSize: width * 0.04,
    color: '#666',
  },
  button: {
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginTop: height * 0.01,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  ViewTaskButton: {
    backgroundColor: '#007BFF',
    borderRadius: width * 0.015,
    padding: width * 0.022,
    alignItems: 'center',
    width: width * 0.25,
  },
  taskCompleteTag: {
    fontSize: width * 0.025,
    color: '#000',
    marginBottom: height * 0.001,
    marginTop: height * 0.001,
  },
  taskCompleteView: {
    alignItems: 'center',
    width: width * 0.2,
    marginTop: height * -0.014,
    marginLeft: width * 0.58,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  
});
