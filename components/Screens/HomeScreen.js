import React, { useState, useEffect, useReducer } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Button } from 'react-native';
import TaskModal from '../TaskModal';
import TaskList from '../TaskList';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Alert, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();

  const [token, setToken] = useState('');
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'Pending',
    deadline: '',
    createdAt: '',
    priority: '',
    assignedUser: '',
  });

  const [assignedUser, setAssignedUser] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? "#000" : "#FFF",
    },
    input: {
      color: isDarkTheme ? '#FFF' : '#000',
      backgroundColor: isDarkTheme ? '#333' : '#FFF',
      borderColor: isDarkTheme ? '#555' : '#ccc',
    },
    Text: {
      color: isDarkTheme ? '#FFFFFF' : '#333'
    }
  };

  const BASE_URL = 'https://taskapp-service.onrender.com';

  useEffect(() => {
    const retrieveAuthToken = async () => {
      try {
        const retrievedToken = await AsyncStorage.getItem('authToken');
        if (retrievedToken) {
          setToken(retrievedToken);
          console.log('Retrieved token:', retrievedToken);
          fetchTasks(retrievedToken);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    retrieveAuthToken();
  
    const fetchInterval = setInterval(() => {
      fetchTasks(token);
    }, 2000);    
    return () => clearInterval(fetchInterval);
  }, [route.params, token]);


  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Quit App', 'Are you sure you want to quit?', [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const { username } = route.params;

  const fetchTasks = (token) => {
    axios
      .get(`${BASE_URL}/send-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const { assignedTasks, userTasks } = response.data;
          const markedDates = assignedTasks.concat(userTasks).reduce((dates, task) => {
            try {
              const createdDate = new Date(task.createdAt).toISOString().split('T')[0];
              const deadlineDate = new Date(task.deadline).toISOString().split('T')[0];
              dates[createdDate] = { selected: true, selectedColor: "#0A79DF" };
              dates[deadlineDate] = { selected: true, selectedColor: "#0A79DF" };
            } catch (error) {
              // console.error('Error processing date:', error);
              // console.error('Task with problematic dates:', task);
            }
            return dates;
          }, {});

          setTasks(assignedTasks.concat(userTasks));
          setMarkedDates(markedDates);
        } else {
          console.error('Error fetching tasks:', response.data.message);
        }
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  const handleAddTask = () => {
    if (!task.title || !task.deadline || !task.priority) {
      setValidationError(true);
      return;
    }

    const updatedTask = {
      ...task,
      createdAt: new Date().toLocaleString(),
      ...route.params,
      assignedUser: assignedUser,
    };

    if (task._id) {
      // If task has an ID, it's an edit
      handleEditTask(updatedTask);
    } else {
      // If task doesn't have an ID, it's an add
      handleCreateTask(updatedTask);
    }
  };

  const handleCreateTask = (updatedTask) => {
    axios
      .post(`${BASE_URL}/send-data`, updatedTask, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log('API Response after adding task:', response.data);
        setModalVisible(false);
        setTask({
          title: "",
          description: "",
          status: "Pending",
          deadline: "",
          priority: "",
          createdAt: "",
          assignedUser: "",
        });
        setTasks([...tasks, response.data]);
        forceUpdate();
        console.log('Updated Tasks:', tasks);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          console.log('Error in API request:', error);
        } else {
          console.error('Error adding data:', error);
        }
      });
  };

  const handleEditTask = (updatedTask) => {
    axios
      .put(`${BASE_URL}/update/${task._id}`, updatedTask, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log('API Response after updating task:', response.data);
        setModalVisible(false);
        setTask({
          title: "",
          description: "",
          status: "Pending",
          deadline: "",
          priority: "",
          createdAt: "",
          assignedUser: "",
        });
        const updatedTasks = tasks.map((t) =>
          t._id === task._id ? response.data : t
        );
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const handleToggleCompletion = (taskId) => {
    axios
      .put(
        `${BASE_URL}/update/${task._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log('Task status updated:', response.data);
        const updatedTasks = tasks.map((t) =>
          t._id === taskId ? { ...t, status: response.data.status } : t
        );
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error('Error updating task status:', error);
      });
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`${BASE_URL}/delete/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log('Deleting task with ID:', taskId, response.data);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    }).catch((error) => {
      console.error('Error deleting task:', error);
    });
  };

  const handleEdit = (task) => {
    setTask(task);
    setModalVisible(true);
    console.log('Edit Task', task)
  };

  const handleCancel = () => {
    if (task._id) {
      setTask({
        title: '',
        description: '',
        status: 'Pending',
        deadline: '',
        createdAt: '',
        priority: '',
        assignedUser: '',
      });
    } else {
      setModalVisible(false);
      setValidationError(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const openEditModal = (task) => {
    setTask(task);
    setModalVisible(true);
  };

  const openTaskDetails = (task) => {
    navigation.navigate('TaskDetails', {
      task: task,
      handleToggleCompletion: handleToggleCompletion,
      token: token,
      username: username
    });
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.WelcomeText, dynamicStyles.Text]}>Welcome,</Text>
      <Text style={[styles.UserName, dynamicStyles.Text]}>{username}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} >
        <Image style={styles.UserProfileImage} source={require('../../assets/profile.png')} />
      </TouchableOpacity>
      <View style={styles.divider} />
      <ScrollView showsVerticalScrollIndicator={false} >
        <View style={{ marginBottom: width * 0.03 }}></View>
        {tasks.length === 0 ? (
          <Image source={require('../../assets/NoTaskDark.png')} style={styles.noTasksImage} />
        ) : (
          <TaskList
            tasks={tasks}
            handleToggleCompletion={handleToggleCompletion}
            openTaskDetails={openTaskDetails}
            token={token}
            username={username}
            handleDeleteTask={handleDeleteTask}
            onEdit={openEditModal}
          />
        )}
      </ScrollView>
      {modalVisible && (
        <TaskModal
          modalVisible={modalVisible}
          task={task}
          setTask={setTask}
          handleAddTask={handleAddTask}
          handleCancel={handleCancel}
          validationError={validationError}
          assignedUser={assignedUser}
          setAssignedUser={setAssignedUser}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={openModal}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  WelcomeText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginTop: height * -0.01,
    marginBottom: -10,
    color: "#333",
    textAlign: "left",
  },
  UserName: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginTop: height * 0.01,
    marginBottom: -10,
    color: "#333",
    textAlign: "left",
  },
  divider: {
    marginTop: height * 0.04,
    backgroundColor: "#007BFF",
    height: 2,
  },
  addButton: {
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    marginTop: height * 0.01,
    marginBottom: height * 0.12,
    width: width * 0.3,
    height: height * 0.056,
    marginLeft: width * 0.32,
  },
  addButtonText: {
    color: "#fff",
    fontSize: width * 0.03,
    fontWeight: "bold",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: width * 0.04,
    borderRadius: width * 0.03,
    elevation: 5,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.003,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  taskDescription: {
    fontSize: width * 0.03,
    color: "#666",
    marginBottom: height * 0.03,
  },
  taskStatus: {
    fontSize: width * 0.03,
    color: "#666",
  },
  taskDeadline: {
    color: "#FF3B12",
    fontSize: width * 0.03,
  },
  taskCreatedAt: {
    color: "#007BFF",
    fontSize: width * 0.028,
    marginBottom: height * 0.02,
  },
  buttonContainer: {
    flexDirection: "column",
    marginVertical: height * 0.001,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    borderRadius: width * 0.015,
    padding: width * 0.022,
    marginBottom: height * 0.01,
    marginRight: width * 0.03,
    alignItems: "center",
    width: width * 0.25,
  },
  completedButton: {
    backgroundColor: "#808080",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.035,
  },
  deleteButton: {
    backgroundColor: "#FF9500",
    borderRadius: width * 0.015,
    padding: width * 0.022,
    alignItems: "center",
    width: width * 0.25,
  },
  taskTime: {
    fontSize: width * 0.04,
    color: "#666",
  },
  button: {
    padding: width * 0.040,
    borderRadius: width * 0.03,
    marginTop: height * 0.01,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.035,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: width * 0.03,
    marginBottom: height * 0.02,
    borderRadius: width * 0.02,
    fontSize: width * 0.04,
  },
  inputLabel: {
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
  },
  taskDay: {
    color: "#FFFFFF",
    fontSize: width * 0.03,
    alignSelf: "center",
    fontWeight: "600",
  },
  taskDate: {
    color: "#0A79DF",
    marginBottom: height * 0.003,
    fontSize: width * 0.08,
    fontWeight: "600",
    alignSelf: "center",
  },
  taskdaystyle: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    height: height * 0.03,
    borderTopLeftRadius: width * 0.03,
    borderTopRightRadius: width * 0.03,
  },
  taskDeadlinebottom: {
    color: "#707070",
    marginBottom: height * 0.008,
    fontSize: width * 0.021,
    fontWeight: "600",
    alignSelf: "center",
  },
  UserProfileImage: {
    alignSelf: "flex-end",
    width: width * 0.11,
    height: width * 0.11,
    marginBottom: height * -0.012,
    marginTop: height * -0.04,
  },
  ViewTaskButton: {
    backgroundColor: "#007BFF",
    borderRadius: width * 0.015,
    padding: width * 0.022,
    alignItems: "center",
    width: width * 0.25,
  },
  swipeoutContainer: {
    backgroundColor: 'lightgray',
    height: width * 0.37,
  },
  noTasksImage: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
    width: width * 0.75,
    height: width * 0.75,
    marginTop: height * 0.02,
  }
});