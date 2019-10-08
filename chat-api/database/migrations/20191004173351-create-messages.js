module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING
      },
      senderUsername: {
        allowNull: false,
        type: DataTypes.STRING
      },
      receiverUsername: {
        allowNull: false,
        type: DataTypes.STRING
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('Messages');
  }
};
