require("dotenv").config();
console.log(process.env);

const { Sequelize, DataTypes, Op } = require("sequelize");
// const connection = new Sequelize(
//   process.env.DB_DATABASE,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//   }
// );

const connection = new Sequelize(process.env.DB_URI);

const Card = connection.define(
  "Card",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
  },
  {
    indexed: [{ unique: true, fields: ["name"] }],
  }
);

const main = async () => {
  try {
    await connection.authenticate();
    await Card.sync({ alter: true });

    //create then save in 2 steps

    // const stuffy_doll = Card.build({
    //   name: "Stuffy Doll",
    //   cost: 5,
    //   description:
    //     "Indestructible As Stuffy Doll enters the battle, choose aplayer. Whenever Stuffy Doll is dealt damage, ",
    // });
    // await stuffy_doll.save();

    // // create and save in 1 step

    // await Card.create({
    //   name: "Meteor Golem",
    //   cost: 7,
    //   description:
    //     "When this enters the battlefield destroy target nonland permanent an opponent controls",
    // });
    const results = await Card.findAll({
      attributes: ["name", "description"],
      where: {
        [Op.or]: [{ name: "Stuffy Doll" }, { cost: 7 }],
      },
    });

    for (let card of results) {
      //{ where: { name: "Stuffy Doll" } }))
      console.log(`Card: ${card.name} -> ${card.description}`);
    }
    await Card.update(
      { name: "Precursor Golem" },
      {
        where: {
          name: "Meteor Golem",
        },
      }
    );

    await Card.destroy({
      where: {
        [Op.or]: [{ name: "Stuffy Doll" }, { name: "Precursor Golem" }],
      },
    });

    for (let card of await Card.findAll()) {
      console.log(`Card: ${card.name} -> ${card.description}`);
    }

    console.log("Connection has been successfully established");
  } catch (error) {
    console.error("unable to connect to the database:", error);
  }

  await connection.close();
  process.exit();
};

main();
// console.log(Sequelize);
