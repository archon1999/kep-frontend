export interface ProjectAttemptTaskLog {
  log: string;
  tasks: Array<{
    taskNumber: number;
    taskTitle: string;
    log: string;
    done: boolean;
  }>;
}
