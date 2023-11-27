import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import TaskItem from './TaskItem';

const { width, height } = Dimensions.get('window');

const TaskList = ({
  tasks,
  handleToggleCompletion,
  response,
  openTaskDetails,
  token,
  username,
  handleDeleteTask,
  onEdit,
}) => {
  const taskItemHeight = 150; 

  const completedTasks = tasks.filter((task) => task.status === 'Completed');
  const pendingTasks = tasks.filter((task) => task.status !== 'Completed');

  const arrangedTasks = pendingTasks.concat(completedTasks);

  const scrollViewHeight = arrangedTasks.length * taskItemHeight;

  return (
    <ScrollView style={{ ...styles.taskList, height: scrollViewHeight }} showsVerticalScrollIndicator={false}>
      {arrangedTasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          handleToggleCompletion={handleToggleCompletion}
          response={response}
          openTaskDetails={openTaskDetails}
          token={token}
          username={username}
          handleDeleteTask={handleDeleteTask}
          onEdit={onEdit}
        />
      ))}
    </ScrollView>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  taskList: {
    flex: 1,
    marginBottom: height * -0.001,
  },
});
