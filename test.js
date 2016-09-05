var name = 'Aravind Radha Krishna';
console.log('Name :' + name);

var trimName = (name.replace(/ /g, '').toLowerCase());
console.log('\nName after trim: ' + trimName);

var lowerCaseName = trimName.toLowerCase();
console.log('\nName to lowercase: ' + lowerCaseName);

// // var jsonData = {
// //    "version": "1.1",
// //    "devices": [
// //       {
// //          "mac": "000D6F0000758858",
// //          "model": "SG3010-T2"
// //       },
// //       {
// //          "mac": "00124B0007306285",
// //          "model": "SG110-A"
// //       },
// //       {
// //          "mac": "00124B00094E89B3",
// //          "model": "SG110-TSA"
// //       },
// //       {
// //          "mac": "000D6F0003E69466",
// //          "model": "SG3030"
// //       }
// //    ]
// // }

// // console.log(jsonData);

// // jsonDevices = jsonData.devices;

// // console.log(jsonDevices);

// // jsonDevicesFirst = jsonDevices[0];

// // console.log(jsonDevicesFirst);

// // time = { "time" : "14013243" }
// // jsonDevicesFirst.time = time;

// // console.log(jsonDevicesFirst);

// var moment = require('moment');

// var timeInMs = Date.now();
// var timeInS = Date.now() / 1000;
// var convert = parseInt(timeInS);

// console.log(timeInMs);
// console.log(convert);

// module.exports = function(sequelize, DataTypes) {

//     var Author = sequelize.define('Author', {

//         id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         firstName: {
//             type: DataTypes.STRING
//         },
//         lastName: {
//             type: DataTypes.STRING
//         }

//     });

//     var Book = sequelize.define('Book', {

//         id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         title: {
//             type: DataTypes.STRING
//         }

//     });

//     var firstAuthor;
//     var secondAuthor;

//     Author.hasMany(Book)
//     Book.belongsTo(Author)

//     Author.sync({ 
//     	force: true 
//     }).then(function() {
//             return Book.sync({ 
//             	force: true 
//             });
//         }).then(function() {
//             return Author.create({
//             	firstName: 'Aravind', 
//             	lastName: 'Krishna'
//             });
//         }).then(function(author1) {
//             firstAuthor = author1;
//             return Author.create({
//             	firstName: 'Hsien', 
//             	lastName: 'Kun'
//             });
//         }).then(function(author2) {
//             secondAuthor = author2
//             return Book.create({
//             	AuthorId: firstAuthor.id, 
//             	title: 'A simple book'
//             });
//         }).then(function() {
//             return Book.create({
//             	AuthorId: firstAuthor.id, 
//             	title: 'Another book'
//             });
//         }).then(function() {
//             return Book.create({
//             	AuthorId: secondAuthor.id, 
//             	title: 'Some other book'
//             });
//         }).then(function() {
//             // This is the part you're after.
//             return Book.findAll({
//                 where: {
//                    'Authors.lastName': 'Krishna'
//                 },
//                 include: [
//                     {
//                     	model: Author, 
//                     	as: Author.tableName
//                     }
//                 ]
//             });
//         }).then(function(books) { 
//             console.log('There are ' + books.length + ' books by Aravind Krishna')
//         });
//     }

