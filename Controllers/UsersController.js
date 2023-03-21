const asyncHandler = require("express-async-handler");
const uniqid = require('uniqid');
// this file to make contact with data and to ضغط وتقليل المساحه
//to get all users
const fs = require("fs");

const getUsers = asyncHandler(async (req, res) => {
    const Users = fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8");
    console.log(Users);
    res.status(200).end(Users);
});

//find Users

const findUser = (req, res) => {
    const Users = fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8");
    const user = JSON.parse(Users).find((el) => el.id.toString() === req?.params.id);
    return user;
}

// get one users
const getOneUser = async (req, res,) => {

    const user = findUser(req, res);

    if (user) {
        res.status(200).end(JSON.stringify(user));
        return;
    }

    res.status(404).json({ massege: "User Not Found" })
};

//Check Email
const checkEmail = (req, res) => {
    const { name, age, email, phone, address } = req?.body;
    const Users = JSON.parse(fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8"));
    const isEmail = Users.find((user) => user.email === email);
    return isEmail;
}

// add users
const addUser = asyncHandler(async (req, res) => {
    console.log(req?.body);
    const { name, age, email, phone, address } = req?.body;

    if (!name || !age || !email || !phone || !address.street || !address.city || !address.state || !address.country) {
        res.status(400).json({ "massege": "Please Fild all Inputs" });
        return;
    }
    if (checkEmail(req, res)) {
        res.status(400).json({ "massege": "Please change email" });
        return;
    }
    const Users = JSON.parse(fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8"));
    Users.push({
        id: uniqid(),
        name: name,
        age: age,
        email: email,
        phone: phone,
        address: {
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country
        }
    })
    fs.writeFileSync(__dirname + "/../Database/Users.json", JSON.stringify(Users));
    res.status(201).json({ massege: "add Users" })

});

// delete users
const deleteUser = asyncHandler(async (req, res) => {
    const Users = fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8");
    const newUsers = JSON.parse(Users).filter((el) => el.id.toString() !== req?.params.id);
    fs.writeFileSync(__dirname + "/../Database/Users.json", JSON.stringify(newUsers));
    res.status(200).json({ massege: "delete Users" })
});

// update users
const updateUser = asyncHandler(async (req, res) => {
    const { name, age, email, phone, address } = req?.body;

    if (!name || !age || !email || !phone || !address.street || !address.city || !address.state || !address.country) {
        res.status(400).json({ "massege": "Please Fild all Inputs" });
        return;
    }

    const user = findUser(req, res);
    console.log(name);
    if (user) {
        user.name = name ?? user.name;
        user.age = age ?? user.age;
        user.email = email ?? user.email;
        user.phone = phone ?? user.phone;
        user.address.street = address.street ?? user.address.street;
        user.address.city = address.city ?? user.address.city;
        user.address.state = address.state ?? user.address.state;
        user.address.country = address.country ?? user.address.country;
        console.log("after", user);
        const Users = JSON.parse(fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8"));
        const index = Users.findIndex((user) => user.id.toString() === req.params.id);
        console.log("index", index);
        Users[index] = user;
        fs.writeFileSync(__dirname + "/../Database/Users.json", JSON.stringify(Users));
        res.status(200).json({ massege: "update Users" })
        return;
    }
    res.status(404).json({ massege: "the user not found" });

});

module.exports = { getUsers, getOneUser, addUser, deleteUser, updateUser }