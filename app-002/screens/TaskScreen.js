import { ActivityIndicator, FlatList, Text, View, TouchableOpacity } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CardTask } from "../components/CardTask";
import { getTasks, updateTask, addTask, deleteTask } from "../api/task";

export const TaskScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const addMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleAddTask = () => {
    // Navigate to AddTaskScreen
    navigation.navigate("AddTaskScreen");
  };

  const handleDeleteTask = (id) => {
    // Call deleteTask mutation with the task id
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isFetching && <Text>IS FETCHING</Text>}
      <FlatList
        style={{ flex: 1 }}
        data={data.results}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <CardTask
            task={item}
            navigation={navigation}
            taskDoneChange={mutation.mutate}
            onDelete={() => handleDeleteTask(item.objectId)}
          />
        )}
      />
      <TouchableOpacity onPress={handleAddTask} style={{ padding: 10, backgroundColor: "#2196f3", borderRadius: 5, marginTop: 10 }}>
        <Text style={{ color: "#fff" }}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};
