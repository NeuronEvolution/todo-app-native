import { TextStyle } from 'react-native';
import { TodoStatus } from './api/todo-private/gen';
import { commonStyles } from './commonStyles';

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

export function getTodoStatusTextColor(p?: TodoStatus): TextStyle {
    switch (p) {
        case TodoStatus.Ongoing:
            return {color: '#007AFF'};
        case TodoStatus.Completed:
            return {color: 'darkgoldenrod'};
        case TodoStatus.Discard:
            return {color: 'red'};
        default:
            return commonStyles.textColor;
    }
}