import axios from "axios";
import { TaskInput } from "@/chartsyBE-types/";

// lambda api
const api = axios.create({
  baseURL: "https://fd26h64qda.execute-api.eu-west-2.amazonaws.com/api",
});
// const api = axios.create({ baseURL: "http://localhost:4000/api" });

export const getAllTasks = async () => {
  try {
    const tasks = await api.get("tasks");
    console.log("FE tasks: ", tasks);
    return tasks.data.tasks;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(err.response, "error");
    } else {
      console.log("Unexpected error: ", err);
    }
  }
};

export const postTask = async (task: TaskInput) => {
  try {
    const newTask = await api.post("task", task);
    console.log("FE newTask: ", newTask);
    return newTask.data.task;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log(err.response, "error");
    } else {
      console.log("Unexpected error: ", err);
    }
  }
};
