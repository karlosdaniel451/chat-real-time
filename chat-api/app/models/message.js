module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      content: DataTypes.STRING,
      senderUsername: DataTypes.STRING,
      receiverUsername: DataTypes.STRING
    },
    { timestamps: false }
  );

  return Message;
};
