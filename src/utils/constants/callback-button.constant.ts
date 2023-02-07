import {
  ADMIN_ACTION,
  BROADCAST_GAME_MAINTENANCE_SEND,
  BROADCAST_LIST_ACTION,
  BROADCAST_MAINTENANCE_COMPLETE,
  BROADCAST_MENU_SEND,
  BROADCAST_SEND,
  BROADCAST_URGENT_MAINTENANCE,
  COMMAND_LIST_ACTION,
  GENERAL_MESSAGE_CLOSE,
  GROUP_ACTION,
  MAIN_MENU,
} from './action.constant';

export const GENERAL_MESSAGE_CLOSE_BUTTON = {
  label: '❌ Close',
  value: '',
  dinamic: false,
  main: true,
  action: GENERAL_MESSAGE_CLOSE,
};

export const BROADCAST_LIST_BUTTON = [
  {
    label: 'Urgent Maintenance',
    value: '',
    dinamic: false,
    action: BROADCAST_URGENT_MAINTENANCE,
  },
  {
    label: 'Maintenance Complete',
    value: '',
    dinamic: false,
    action: BROADCAST_MAINTENANCE_COMPLETE,
  },
  {
    label: '📜 Main Menu',
    value: '',
    dinamic: false,
    main: true,
    action: MAIN_MENU,
  },
  GENERAL_MESSAGE_CLOSE_BUTTON,
];

export const BROADCAST_BUTTON = [
  {
    label: '🚀 Send Broadcast',
    value: '',
    dinamic: false,
    main: true,
    action: BROADCAST_SEND,
  },
  GENERAL_MESSAGE_CLOSE_BUTTON,
];

export const BROADCAST_MENU_BUTTON = [
  {
    label: '🚀 Send Broadcast',
    value: '',
    dinamic: false,
    main: true,
    action: BROADCAST_MENU_SEND,
  },
  GENERAL_MESSAGE_CLOSE_BUTTON,
];

export const GAME_MAINTENANCE_CONFIRM_BUTTON = [
  {
    label: '🚀 Send Broadcast',
    value: '',
    dinamic: false,
    main: true,
    action: BROADCAST_GAME_MAINTENANCE_SEND,
  },
  GENERAL_MESSAGE_CLOSE_BUTTON,
];

export const MENU_BUTTON = [
  {
    label: 'Group',
    value: '',
    dinamic: true,
    action: GROUP_ACTION,
  },
  {
    label: 'Admin',
    value: '',
    dinamic: true,
    action: ADMIN_ACTION,
  },
  {
    label: 'Command List',
    value: '',
    dinamic: true,
    action: COMMAND_LIST_ACTION,
  },
  {
    label: 'Broadcast List',
    value: '',
    dinamic: true,
    action: BROADCAST_LIST_ACTION,
  },
  GENERAL_MESSAGE_CLOSE_BUTTON,
];
