import { TodoStatus } from './api/todo-private/gen';

export function getTodoStatusName(p?: TodoStatus): string {
    switch (p) {
        case TodoStatus.Ongoing:
            return '进行中';
        case TodoStatus.Completed:
            return '已完成';
        case TodoStatus.Discard:
            return '已放弃';
        default:
            return '未知的';
    }
}