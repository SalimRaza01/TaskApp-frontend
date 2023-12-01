import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import axios from 'axios';
import {useColorScheme} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

const TaskDetails = ({route, navigation}) => {
  const BASE_URL = 'https://taskapp-service.onrender.com';

  const [highlightedDates, setHighlightedDates] = useState({});
  const [task, setTask] = useState({...route.params.task, status: 'Pending'});
  const {token} = route.params;
  const {username} = route.params;
  const {deadline, createdAt} = task;
  const [comments, setComments] = useState(task.comments || []);
  const [comment, setComment] = useState('');
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(true);
  const [isSendButtonVisible, setIsSendButtonVisible] = useState(false);

  useEffect(() => {
    setIsSendButtonVisible(!!comment.trim());
  }, [comment]);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const scrollViewRef = useRef();

  const dynamicStyles = {
    container: {
      backgroundColor: isDarkTheme ? '#000' : '#f7f7f7',
    },
    input: {
      color: isDarkTheme ? '#FFF' : '#000',
      backgroundColor: isDarkTheme ? '#333' : '#FFF',
      borderColor: isDarkTheme ? '#555' : '#ccc',
    },
    Textdark: {
      color: isDarkTheme ? '#FFFFFF' : '#333',
    },
    descDark: {
      color: isDarkTheme ? '#FFFFFF' : '#333',
    },
    dateDark: {
      backgroundColor: isDarkTheme ? '#222' : '#fff',
      shadowColor: isDarkTheme ? '#000' : '#ccc',
    },
  };

  useEffect(() => {
    fetchTasks();
    fetchComments();

    const commentFetchInterval = setInterval(fetchComments, 500);
    const fetchInterval = setInterval(fetchTasks, 500);
    return () => {
      clearInterval(fetchInterval);
      clearInterval(commentFetchInterval);
    };
  }, []);

  useEffect(() => {
    setComments(route.params.task.comments || []);

    const updatedHighlightedDates = {};
    let currentDate = new Date(task.createdAt);

    try {
      while (currentDate <= endDate) {
        const date = currentDate.toISOString().split('T')[0];
        updatedHighlightedDates[date] = {color: '#43BE31'};

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
  }, [route.params.task.comments, task.createdAt, task.deadline]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/send-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const {assignedTasks, userTasks} = response.data;
      } else {
        console.error('Error fetching tasks:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/fetch-comments/${task._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const updatedComments = response.data.comments || [];
        setComments(updatedComments);
      } else {
        console.error('Error fetching comments:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    setComments(task.comments || []);
  }, [task.comments, task.status]);

  const handleCommentChange = text => {
    setComment(text);
  };

  const [loading, setLoading] = useState(false);

  const handleCommentSubmit = async () => {
    setLoading(true);
  
    try {
      if (validateComment()) {
        const commentData = {
          taskId: task._id,
          comment,
        };
  
        const response = await axios.post(
          `${BASE_URL}/save-comment`,
          commentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
  
        console.log('Comment saved:', response.data);
        setComment('');
        fetchComments();
  
        setTimeout(() => {
          scrollViewRef.current.scrollToEnd({animated: true});
        }, 100);
      }
    } catch (error) {
      console.error('Error saving comment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleCompletion = async () => {
    try {
      if (task.status === 'Completed') {
        Alert.alert(
          'Task Completed',
          'This task is already completed. You cannot change its status.',
        );
        return;
      }
  
      Alert.alert(
        'Confirm Completion',
        'Are you sure you want to mark this task as completed?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Mark Completed',
            onPress: async () => {
              if (validateComment()) {
                const newStatus = 'Completed';
  
                setTask(prevTask => ({...prevTask, status: newStatus}));
  
                try {
                  const response = await axios.put(
                    `${BASE_URL}/update/${task._id}`,
                    {status: newStatus},
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    },
                  );
  
                  console.log('Task status updated:', response.data);
  
                  setTask(prevTask => ({
                    ...prevTask,
                    status: response.data.status,
                  }));
                  setIsTaskCompleted(response.data.status === 'Completed');
  
                  if (route.params.handleUpdateTaskStatus) {
                    route.params.handleUpdateTaskStatus(response.data);
                  }
                } catch (error) {
                  console.error('Error updating task status:', error);
                }
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
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
    rangeDates[date] = {color: '#43BE31'};
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  const formatDeadline = deadline => {
    const date = new Date(deadline);
    const day = date.getDate().toString().padStart(2, '0');
    const options = {month: 'short'};
    const monthName = new Intl.DateTimeFormat('en-US', options).format(date);
    const formattedDeadline = `${day} ${monthName}`;
    return {day, monthName, formattedDeadline};
  };

  const formatCreatedAt = createdAt => {
    const date = new Date(createdAt);
    const day = date.getDate().toString().padStart(2, '0');
    const options = {month: 'short'};
    const dayName = new Intl.DateTimeFormat('en-US', options).format(date);
    return {day, dayName};
  };

  const customDayRenderer = (date, item) => {
    const dateString = date.dateString;

    if (dateString) {
      try {
        const isStartingDay = highlightedDates[dateString]?.startingDay;
        const isEndingDay = highlightedDates[dateString]?.endingDay;
        const isDeadline = dateString === deadline.split('T')[0];

        const cornerStyle = {
          borderTopLeftRadius: isStartingDay || isDeadline ? 17.5 : 0,
          borderBottomLeftRadius: isStartingDay || isDeadline ? 17.5 : 0,
          borderTopRightRadius: isEndingDay || isDeadline ? 17.5 : 0,
          borderBottomRightRadius: isEndingDay || isDeadline ? 17.5 : 0,
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

  const isOwnComment = commentUsername => {
    return commentUsername === route.params.username;
  };
  
  const validateComment = () => {
    if (!comment.trim()) {
      // Alert.alert('Validation Error', 'Comment cannot be empty.');
      return false;
    }
    return true;
  };

  useEffect(() => {
    setIsSendButtonVisible(!!comment.trim());
  }, [comment]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, dynamicStyles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          dynamicStyles.container,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.container, dynamicStyles.container]}>
          <Text style={[styles.Tasktitle, dynamicStyles.Textdark]}>
            Task: {task.title}
          </Text>
          <Text style={[styles.Taskdecription, dynamicStyles.descDark]}>
            Description: {task.description}
          </Text>

          <View style={styles.divider} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <LinearGradient
                colors={['#FFD500', '#FCA500']}
                style={styles.Prioritybox}>
                <Text style={styles.TaskPriorityText}>
                  Priority: {task.priority}
                </Text>
              </LinearGradient>
            </View>

            <View>
              <LinearGradient
                colors={['#FF6347', '#FC0000']}
                style={styles.Deadlinebox}>
                <Text style={styles.DeadlineText}>
                  Deadline: {formatDeadline(task.deadline).formattedDeadline}
                </Text>
              </LinearGradient>
            </View>

            <TouchableOpacity
              style={[
                styles.StatusBox,
                isTaskCompleted ? styles.completedButton : styles.pendingButton,
                isTaskCompleted && styles.disabledButton,
              ]}
              onPress={() => handleToggleCompletion(task._id)}
              disabled={isTaskCompleted}>
              <LinearGradient
                colors={
                  isTaskCompleted
                    ? ['#808080', '#808080']
                    : ['#3498db', '#007BFF']
                }
                style={styles.StatusBox}>
                <Text style={styles.buttonText}>
                  {isTaskCompleted ? 'Completed' : 'Mark Done'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => setCalendarVisible(!isCalendarVisible)}>
              <Text style={styles.toggleButton}>
                {isCalendarVisible ? 'Hide Calendar' : 'Show Calendar'}
              </Text>
            </TouchableOpacity>

            {isCalendarVisible && (
              <Calendar
                style={styles.datePicker}
                current={deadline}
                markingType={'period'}
                markedDates={{
                  ...rangeDates,
                  ...highlightedDates,
                  [deadline.split('T')[0]]: {color: 'red', endingDay: true},
                }}
                renderDay={(date, item) => customDayRenderer(date, item)}
              />
            )}
          </View>

          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollViewRef.current.scrollToEnd({animated: true});
            }}
            style={styles.commentContainer}
            showsVerticalScrollIndicator={false}>
            {comments.map((comment, index) => (
              <View
                key={index}
                style={[
                  styles.commentBox,
                  {
                    alignSelf: isOwnComment(comment.username)
                      ? 'flex-end'
                      : 'flex-start',
                    marginLeft: isOwnComment(comment.username)
                      ? width * 0.02
                      : 0.05,
                    marginRight: isOwnComment(comment.username)
                      ? 0.05
                      : width * 0.02,
                    height: 'auto',
                    width: 'auto',
                    backgroundColor: isOwnComment(comment.username)
                      ? '#007BFF'
                      : '#777',
                  },
                ]}>
                <Text style={styles.commentor}>{comment.username}</Text>
                <Text style={styles.commentText}>{comment.message}</Text>
              </View>
            ))}
          </ScrollView>

          <TextInput
        style={[
          styles.input,
          {
            color: '#000',
            backgroundColor: '#fff',
            ...styles.shadow,
            paddingTop: Platform.OS === 'ios' ? 13 : 0,
            paddingBottom: Platform.OS === 'ios' ? 10 : 0,
            width: isSendButtonVisible ? width * 0.75 : width * 0.9,
          },
          dynamicStyles.input,
          {
            height:
              Platform.OS === 'android'
                ? Math.max(40, height * 0.07)
                : Math.max(40, height * 0.06),
          },
        ]}
        placeholderTextColor="#999"
        placeholder="Comment"
        onChangeText={handleCommentChange}
        value={comment}
        multiline={true}
      />

      {isSendButtonVisible && (
        <TouchableOpacity
          style={[{ ...styles.shadow }]}
          onPress={handleCommentSubmit}
        >
          <LinearGradient
            colors={['#3498db', '#007BFF']}
            style={styles.CommentSendBtn}
          >
            <Image
              style={styles.SendIcon}
              source={require('../assets/Send.png')}
            />
          </LinearGradient>
        </TouchableOpacity>
      )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  commentContainer: {
    height: width * 0.2,
    marginTop: height * 0.02,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  completedButton: {
    backgroundColor: '#808080',
  },
  pendingButton: {
    backgroundColor: '#3498db',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  EditText: {
    color: '#222',
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
    marginTop: height * -0.085,
    marginBottom: height * 0.03,
    width: width * 0.12,
    height: height * 0.06,
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
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
    borderRadius: width * 0.06,
    fontSize: width * 0.04,
    height: height * 0.07,
    width: width * 0.75,
    paddingLeft: width * 0.04,
    paddingRight: width * 0.04,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 10,
      },
      android: {
        shadowOffset: {
          width: width * 0,
          height: height * 1,
        },
        shadowOpacity: 0.8,
        shadowRadius: 3.5,
        elevation: 20,
      },
    }),
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
    backgroundColor: '#007BFF',
    borderRadius: width * 0.03,
    width: width * 0.7,
    height: height * 0.07,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    padding: width * 0.04,
  },
  datePicker: {
    backgroundColor: '#fff',
    marginTop: height * 0.015,
    borderRadius: width * 0.03,
    elevation: Platform.OS === 'android' ? 3 : 0,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    overflow: 'hidden',
  },
  commentor: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
    marginTop: -7,
    color: '#EEE',
    marginLeft: width * 0.02,
    marginRight: width * 0.02,
  },
  commentText: {
    color: '#FFF',
    fontSize: width * 0.04,
    marginLeft: width * 0.02,
    marginRight: width * 0.02,
  },
  toggleButton: {
    alignSelf: 'center',
    fontSize: width * 0.04,
    marginLeft: width * 0.02,
    marginRight: width * 0.02,
  },
});
