import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const TaskDetails = ({ route }) => {
  const BASE_URL = 'https://taskapp-service.onrender.com';

  const [highlightedDates, setHighlightedDates] = useState({});
  const [task, setTask] = useState({ ...route.params.task, status: 'Pending' });
  const { token } = route.params;
  const { deadline, createdAt } = task;
  const [comments, setComments] = useState(task.comments || []);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComments(task.comments || []);

    const updatedHighlightedDates = {};
    let currentDate = new Date(task.createdAt);

    try {
      while (currentDate <= endDate) {
        const date = currentDate.toISOString().split('T')[0];
        updatedHighlightedDates[date] = { color: '#43BE31' };

        if (date === task.createdAt.split('T')[0]) {
          updatedHighlightedDates[date].startingDay = true;
        } else if (date === task.deadline.split('T')[0]) {
          updatedHighlightedDates[date].endingDay = true;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    } catch (error) {
      console.error('Error processing date:', error);
    }

    setHighlightedDates(updatedHighlightedDates);
  }, [task.comments, task.createdAt, task.deadline]);

  useEffect(() => {
    setComments(task.comments || []);
  }, [task.comments, task.status]);

  const handleCommentChange = text => {
    setComment(text);
  };

  const handleCommentSubmit = () => {
    const commentData = {
      taskId: task._id,
      comments: [comment],
    };

    axios
      .post(`${BASE_URL}/save-comment`, commentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log('Comment saved:', response.data);
        setComments(response.data.comments || []);
        setComment('');
      })
      .catch(error => {
        console.error('Error saving comment:', error);
      });
  };

  const handleToggleCompletion = taskId => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';

    console.log('Current task status:', task.status);
    console.log('New status to be sent:', newStatus);

    axios
      .put(
        `${BASE_URL}/update/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(response => {
        console.log('Task status updated:', response.data);
        setTask(response.data);

        if (route.params.handleUpdateTaskStatus) {
          route.params.handleUpdateTaskStatus(response.data);
        }
      })
      .catch(error => {
        console.error('Error updating task status:', error);
      });
  };

  const rangeDates = {};
  let currentDate, endDate;

  try {
    currentDate = new Date(createdAt);
    endDate = new Date(deadline);
  } catch (error) {
    console.error('Error parsing date strings:', error);
    return null;
  }

  LocaleConfig.locales['en'] = {
    monthNames: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    monthNamesShort: [
      'Jan.',
      'Feb.',
      'Mar.',
      'Apr.',
      'May.',
      'Jun.',
      'Jul.',
      'Aug.',
      'Sep.',
      'Oct.',
      'Nov.',
      'Dec.',
    ],
    dayNames: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  };

  LocaleConfig.defaultLocale = 'en';
  while (currentDate <= endDate) {
    const date = currentDate.toISOString().split('T')[0];
    rangeDates[date] = { color: '#43BE31' };
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  const formatDeadline = deadline => {
    const date = new Date(deadline);
    const day = date.getDate().toString().padStart(2, '0');
    const options = { month: 'short' };
    const monthName = new Intl.DateTimeFormat('en-US', options).format(date);
    const formattedDeadline = `${day} ${monthName}`;
    return { day, monthName, formattedDeadline };
  };

  const formatCreatedAt = createdAt => {
    const date = new Date(createdAt);
    const day = date.getDate().toString().padStart(2, '0');
    const options = { month: 'short' };
    const dayName = new Intl.DateTimeFormat('en-US', options).format(date);
    return { day, dayName };
  };

  const customDayRenderer = (date, item) => {
    const dateString = date.dateString;

    if (dateString) {
      try {
        const isStartingDay = highlightedDates[dateString]?.startingDay;
        const isEndingDay = highlightedDates[dateString]?.endingDay;
        const isDeadline = dateString === deadline.split('T')[0];

        const cornerStyle = {
          borderTopLeftRadius: (isStartingDay || isDeadline) ? 17.5 : 0,
          borderBottomLeftRadius: (isStartingDay || isDeadline) ? 17.5 : 0,
          borderTopRightRadius: (isEndingDay || isDeadline) ? 17.5 : 0,
          borderBottomRightRadius: (isEndingDay || isDeadline) ? 17.5 : 0,
        };

        return (
          <View style={[styles.customDayContainer, cornerStyle]}>
            <Text style={styles.customDayText}>{date.day}</Text>
          </View>
        );
      } catch (error) {
        console.error('Error processing date:', error);
      }
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : null}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={[styles.Tasktitle]}>Task: {task.title}</Text>

          <Text style={styles.Taskdecription}>Description: {task.description}</Text>

          <View style={styles.divider} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={styles.Prioritybox}>
              <Text style={styles.TaskPriorityText}>
                Priority: {task.priority}{' '}
              </Text>
            </View>
            <View style={styles.Deadlinebox}>
              <Text style={styles.DeadlineText}>
                Deadline: {formatDeadline(task.deadline).formattedDeadline}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.StatusBox,
                task.status === 'Completed' && styles.completedButton,
              ]}
              onPress={() => handleToggleCompletion(task._id)}>
              <Text style={styles.buttonText}>
                {task.status === 'Pending' ? 'Completed' : 'Pending'}
              </Text>
            </TouchableOpacity>
          </View>
          <Calendar
            style={styles.datePicker}
            current={deadline}
            markingType={'period'}
            markedDates={{
              ...rangeDates,
              ...highlightedDates,
              [deadline.split('T')[0]]: { color: 'red', endingDay: true },
            }}
            renderDay={(date, item) => customDayRenderer(date, item)}
          />

          <ScrollView
            style={styles.commentContainer}
            showsVerticalScrollIndicator={false}>
            {comments.map((comment, index) => (
              <View key={index} style={styles.commentBox}>
                <Text style={styles.commentText}>{comment.message}</Text>
              </View>
            ))}
          </ScrollView>

          <TextInput
            style={[
              styles.input,
              { color: '#000', backgroundColor: '#fff', ...styles.shadow },
            ]}
            placeholderTextColor="#999"
            placeholder="  Comment"
            onChangeText={handleCommentChange}
            value={comment}
          />

          <TouchableOpacity
            style={styles.CommentSendBtn}
            onPress={handleCommentSubmit}>
            <Image style={styles.SendIcon} source={require('../assets/Send.png')} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    // backgroundColor: '#f7f7f7',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
       backgroundColor: '#f7f7f7',
  },
  commentContainer:{
    height: width * 0.08,
    marginTop: height * 0.03,
  },
  completedButton: {
    backgroundColor: '#808080',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  taskStatus: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#666',
  },
  CommentSendBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.02,
    borderRadius: width * 1,
    marginTop: height * -0.078,
    marginBottom: height * 0.03,
    width: width * 0.1,
    height: height * 0.046,
    marginLeft: width * 0.78,
  },
  SendIcon: {
    width: width * 0.06,
    height: width * 0.06,
  },
  UserProfileImage: {
    marginLeft: width * 0.001,
    width: width * 0.08,
    height: width * 0.08,
    marginTop: height * -0.033,
  },
  divider: {
    marginTop: height * 0.02,
    backgroundColor: '#007BFF',
    height: 2,
  },
  DeadlineText: {
    fontSize: width * 0.03,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'right',
  },
  TaskPriorityText: {
    fontSize: width * 0.03,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'left',
  },
  Deadlinebox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    paddingVertical: height * 0.01,
    borderRadius: width * 0.015,
    width: width * 0.28,
    height: height * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  Prioritybox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9500',
    paddingVertical: height * 0.01,
    borderRadius: width * 0.015,
    width: width * 0.28,
    height: height * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  StatusBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.01,
    borderRadius: width * 0.015,
    width: width * 0.28,
    height: height * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    backgroundColor: '#007BFF',
    alignSelf: 'flex-end',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: width * 0.025,
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
    borderRadius: width * 1,
    fontSize: width * 0.04,
    height: height * 0.07,
  },
  Taskdecription: {
    fontSize: width * 0.03,
    color: '#333',
    textAlign: 'left',
  },
  Tasktitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 7,
    marginTop: 2,
    color: '#333',
    textAlign: 'left',
  },
  customDayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: '#007BFF',
    borderRadius: 17.5,
  },
  customDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.02,
    width: width * 0.9,
    height: height * 0.07,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    padding: width * 0.04,
    borderRadius: width * 1,
    elevation: 0,
  },
  commentText: {
    fontSize: width * 0.04,
  },
  shadow: {
    shadowOffset: {
      width: width * 0,
      height: height * 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    elevation: 20,
  },
  datePicker: {
    backgroundColor: '#fff',
    marginTop: height * 0.015,
    marginBottom: height * 0.006,
    borderRadius: width * 0.03,
    elevation: 20,
    shadowColor: '#000000',
    overflow: 'hidden',
  },
});
