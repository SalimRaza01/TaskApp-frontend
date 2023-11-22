import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const NotifyScreen = (props) => {
  const [taskReminders, setTaskReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'https://taskapp-service.onrender.com';

  const getUpcomingReminders = (tasks) => {
    const now = new Date();
    const twoDaysLater = new Date(now);
    twoDaysLater.setDate(now.getDate() + 2);

    return tasks
      .filter((task) => new Date(task.deadline) <= twoDaysLater)
      .map((task) => {
        const reminderMessage = `Task: ${task.title}
By ${task.assignedUser}`;
        return { ...task, reminderMessage };
      });
  };

  useEffect(() => {
    console.log('Token in NotifyScreen:', props.route.params.token);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/send-data`, {
        headers: {
          Authorization: `Bearer ${props.route.params.token}`,
        },
      });

      const tasks = response.data.assignedTasks.concat(response.data.userTasks);
      const upcomingReminders = getUpcomingReminders(tasks);

      setTaskReminders(upcomingReminders);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch task reminders');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.Header}>Notification</Text> */}
        <Text style={styles.Loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.Header}>Notification</Text> */}
      {error ? (
        <Text style={styles.Error}>{error}</Text>
      ) : taskReminders.length === 0 ? (
        <View style={styles.NoRemindersImageContainer}>
          <Image style={styles.NoRemindersImage} source={require('../../assets/no_reminders.png')} />
        </View>
      ) : (
        taskReminders.map((task, index) => (
          <TouchableOpacity key={index}>
            <View style={styles.textbox}>
              <Image style={styles.Taskremindericon} source={require('../../assets/Reminder.png')} />
              <View>
                <Text style={styles.NotifyTitle}>{task.reminderMessage}</Text>
                <Text style={styles.Timing}>{`Deadline: ${new Date(task.deadline).toLocaleString()}`}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  BackBtn: {
    marginLeft: width * 0.05,
    width: width * 0.07,
    height: width * 0.07,
    marginTop: height * -0.037,
  },
  Header: {
    textAlign: 'center',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginTop: height * 0.025,
  },
  Loading: {
    textAlign: 'center',
    marginTop: height * 0.1,
    fontSize: 18,
  },
  Error: {
    textAlign: 'center',
    marginTop: height * 0.1,
    fontSize: 18,
    color: 'red',
  },
  NoReminders: {
    textAlign: 'center',
    marginTop: height * 0.1,
    fontSize: 18,
  },
  textbox: {
    flexDirection: "row",
    padding: 10,
    marginLeft: width * 0.05,
    marginTop: height * 0.025,
    marginBottom: height * -0.02,
    width: width * 0.90,
    height: height * 0.1,
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.02,
    borderWidth: 0.5,
    borderColor: "#ccc",
    elevation: 50,
  },
  NotifyTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginLeft: width * 0.035,
    marginTop: height * 0.003,
  },
  Timing: {
    fontSize: width * 0.025,
    color: 'red',
    marginLeft: width * 0.035,
    marginTop: height * 0.003,
  },
  Taskremindericon: {
    justifyContent: "flex-start",
    width: width * 0.1,
    height: width * 0.1,
    marginTop: height * 0.006,
  },
  NoRemindersImage: {
    width: width * 0.65,
    height: width * 0.65,
  },
  NoRemindersImageContainer: {
    flex: 1,
    alignContent: "center",
    alignSelf: "center",
    marginTop: height * 0.2,
    alignItems: "center",
  }
});

export default NotifyScreen;
