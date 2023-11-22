import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, } from 'react-native';
import TaskItem from './TaskItem';

const { width, height } = Dimensions.get('window');

const TaskList = ({
  tasks,
  handleToggleCompletion,
  response,
  openTaskDetails
}) => {

  const completedTasks = tasks.filter((task) => task.status === 'Completed');
  const pendingTasks = tasks.filter((task) => task.status !== 'Completed');

  const arrangedTasks = pendingTasks.concat(completedTasks);

  return (
    <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
      {arrangedTasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          handleToggleCompletion={handleToggleCompletion}
          response={response}
          openTaskDetails={openTaskDetails}
        />
      ))}
    </ScrollView>
  );
};
export default TaskList;

const styles = StyleSheet.create({

  taskList: {
    flex: 1,
    height: height * 0.59,
  },

});