import { TextStyle } from 'react-native';
import { TodoStatus, TodoVisibility } from './api/todo-private/gen';
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
            return {color: '#777'};
        case TodoStatus.Completed:
            return {color: '#ccc'};
        case TodoStatus.Discard:
            return {color: '#ccc'};
        default:
            return commonStyles.textColor;
    }
}

export function getTodoVisibilityName(p?: TodoVisibility): string {
    switch (p) {
        case TodoVisibility.Private:
            return '保密的';
        case TodoVisibility.Friend:
            return '仅朋友可见';
        case TodoVisibility.Public:
            return '公开的';
        default:
            return '未知的';
    }
}