import  Sequelize, { Model }  from "sequelize";
import bcrypt from "bcryptjs";

class Task extends Model{
    static init(sequelize){
        super.init(
            {
                title: Sequelize.STRING,
                status: Sequelize.INTEGER,
                desc: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }


    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
}

export default Task;