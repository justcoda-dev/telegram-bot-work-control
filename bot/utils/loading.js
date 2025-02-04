export const loading = (ctx) => {
  const loading_text = "⏳ Завантаження";
  const loading_end_text = "✅ Завантаження завершене";
  let messageId;

  const startLoadingMessage = async () => {
    messageId = await ctx.reply(loading_text);
    return loading_text;
  };

  const endLoadingMessage = async (minDelay = 500) => {
    if (messageId) {
      await ctx.telegram.editMessageText(
        messageId.chat.id,
        messageId.message_id,
        null,
        loading_end_text
      );

      await ctx.telegram.deleteMessage(messageId.chat.id, messageId.message_id);
    }
    return loading_end_text;
  };
  return { startLoadingMessage, endLoadingMessage };
};
