import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import Swipeout from 'react-native-swipeout';

const { width, height } = Dimensions.get('window');

const CustomSwipeoutButton = ({ onPress, imageSource, backgroundColor, height }) => (
  <TouchableOpacity onPress={() => onPress()} style={[styles.swipeoutButton, { backgroundColor, height }]}>
    <Image source={require('../assets/Deleteicon.png')} style={styles.swipeoutImage2} />
  </TouchableOpacity>
);
const CustomSwipeoutButton2 = ({ onPress2, imageSource, backgroundColor, height }) => (
  <TouchableOpacity onPress={() => onPress2()} style={[styles.swipeoutButton, { backgroundColor, height }]}>
    <Image source={require('../assets/EditIcon.png')} style={styles.swipeoutImage} />
  </TouchableOpacity>
);

const TaskItem = ({ task, response, openTaskDetails, token, username, handleDeleteTask, onEdit }) => {

  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? "#000" : "#FFF",
    },
    TaskItem: {
      flex: 1,
      backgroundColor: isDarkTheme ? "#222" : "#FFF",
    },
    Black: {
      color: isDarkTheme ? "#FFFFFF" : "#444",
    },
    Grey: {
      color: isDarkTheme ? "#DDDDDD" : "#666",
    }
  };

  const swipeoutBtns = [
    {
      component: <CustomSwipeoutButton2 onPress2={() => onEdit(task)} imageSource={require('../assets/EditIcon.png')} backgroundColor='#FFFFFF' />,
    },
    {
      component: <CustomSwipeoutButton onPress={() => handleDeleteTask(task._id)} imageSource={require('../assets/Deleteicon.png')} backgroundColor='#FFFFFF' />,
    }
  ];

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
    <Swipeout right={swipeoutBtns} autoClose={true} backgroundColor='transparent' >
      <View style={[styles.taskItem, dynamicStyles.TaskItem]}>
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
              task.status === 'Completed' && styles.completedTaskText, dynamicStyles.Black
            ]}
          >
            {task.title}
          </Text>
          <Text style={[styles.taskDescription, dynamicStyles.Grey]}>
            Description:  {trimDescription(task.description, 20)}
          </Text>
          {/* <Text style={styles.taskStatus}>Status: {task.status}</Text> */}
          <Text style={styles.taskDeadline}>
            Deadline: {formatDeadline(task.deadline).formattedDeadline}
          </Text>
        </View>
        <View >
          <TouchableOpacity
            onPress={() => openTaskDetails(task, token, username)}
            style={[styles.ViewTaskButton]}>
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Swipeout>
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
    marginBottom: height * 0.01,
  },
  taskStatus: {
    fontSize: width * 0.03,
    color: '#666',
  },
  taskDeadline: {
    color: '#FF3B12',
    fontSize: width * 0.03,
  },
  taskTime: {
    fontSize: width * 0.04,
    color: '#666',
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
    marginRight: width * 0.01,
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
  swipeoutButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeoutImage: {
    width: width * 0.07,
    height: width * 0.07,
  },
  swipeoutImage2: {
    width: width * 0.087,
    height: width * 0.087,
  },
});
