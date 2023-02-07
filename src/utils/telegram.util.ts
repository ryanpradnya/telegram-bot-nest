import { Context } from 'telegraf';
import { MessageEntity } from 'telegraf/typings/core/types/typegram';

export function generateAction(actions: string[]): RegExp {
  return new RegExp(`a[\\:"]+(${actions.join('|')})`);
}

export function isCommand(ctx: Context, commands?: string[]): boolean {
  const message: any = ctx.message;

  if (!message || !message.entities) return false;

  const command = getCommand(ctx);

  return commands
    ? command && commands.includes(command)
    : command
    ? true
    : false;
}

export function getCommand(ctx: Context): string {
  const message: any = ctx.message;

  if (!message || !message.entities) return '';

  const cmdEntity: MessageEntity = message.entities.find(
    (entity: MessageEntity) => entity.type === 'bot_command',
  );

  if (!cmdEntity) {
    return '';
  } else {
    return message.text.substring(cmdEntity.offset + 1, cmdEntity.length);
  }
}

export function removeCommand(entities: MessageEntity[]) {
  const command = entities.find((entity) => entity.type === 'bot_command');
  if (command) {
    return entities.reduce((val, curr) => {
      const { offset, type } = curr;
      if (type !== 'bot_command') {
        val.push({
          ...curr,
          offset: offset - command.length,
        });
      }
      return val;
    }, new Array<MessageEntity>());
  } else {
    return entities;
  }
}

export function getOnlyMessage(ctx: Context) {
  const command = getCommand(ctx);
  const text = getText(ctx);
  return command ? text.replace(new RegExp(`/${command}( ?)`), '') : text;
}

export function getOnlyMessageFromReply(ctx: Context) {
  const message = getMessageFromReply(ctx);
  const command = getCommand(ctx);
  const text: string = message.text ? message.text : message.caption;
  return command && text
    ? text.replace(new RegExp(`/${command}( ?)`), '')
    : text;
}

export function getCallbackQuery(ctx: Context) {
  return ctx.callbackQuery;
}

export function getQueryData(ctx: Context): string {
  const cbQuery: any = getCallbackQuery(ctx);
  return cbQuery.data;
}

export function getMessage(ctx: Context) {
  return ctx.callbackQuery ? ctx.callbackQuery.message : ctx.message;
}

export function getMessageFromReply(ctx: Context): any {
  const reply = getReply(ctx);
  return reply ? reply : getMessage(ctx);
}

export function getChat(ctx: Context) {
  return getMessage(ctx).chat;
}

export function getChatType(ctx: Context) {
  return getMessage(ctx).chat.type;
}

export function getChatId(ctx: Context) {
  return getMessage(ctx).chat.id;
}

export function getMessageId(ctx: Context) {
  return getMessage(ctx).message_id;
}

export function getUsername(ctx: Context): string {
  const message: any = getMessage(ctx);
  return message.from.is_bot ? message.chat.username : message.from.username;
}

export function getText(ctx: Context): string {
  const message: any = getMessage(ctx);
  return message.text;
}

export function getReply(ctx: Context) {
  const message: any = getMessage(ctx);
  return message.reply_to_message;
}

export function getNewChatMember(ctx: Context) {
  const update: any = ctx.update;
  return update.message.new_chat_member;
}

export function getMessageEntities(ctx: Context): MessageEntity[] {
  const message: any = getMessage(ctx);
  return message.entities ? message.entities : [];
}

export function getReplayMessageEntities(ctx: Context): MessageEntity[] {
  const message: any = getMessageFromReply(ctx);
  return message.entities ? message.entities : [];
}
