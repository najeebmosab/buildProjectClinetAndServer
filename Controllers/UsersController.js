const asyncHandler = require("express-async-handler");
const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenApi = require('../JWT/tokenApi');

// this file to make contact with data and to ضغط وتقليل المساحه
//to get all users
const fs = require("fs");
const { error } = require("console");

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
const addUser = asyncHandler(async (req, res, next) => {
    console.log(req?.body);
    try {

        // throw new Error("Please asdasd")
        const { name, age, email, phone, address, password } = req?.body;

        if (!name || !age || !email || !phone || !address.street || !address.city || !address.state || !address.country || !password) {
            // res.status(400).json({ "massege": "Please Fild all Inputs" });
            res.statusCode = 400;
            throw new Error("Please Fild all Inputs")
        }
        if (checkEmail(req, res)) {
            res.status(400).json({ "massege": "Please change email" });
            return;
        }
        const Users = JSON.parse(fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8"));
        const hash = await bcrypt.hashSync(password, 10);
        Users.push({
            id: uniqid(),
            name: name,
            age: age,
            email: email,
            phone: phone,
            password: hash,
            address: {
                street: address.street,
                city: address.city,
                state: address.state,
                country: address.country
            }
        })
        fs.writeFileSync(__dirname + "/../Database/Users.json", JSON.stringify(Users));
        res.status(201).json({ massege: "add Users" })
    } catch (err) {
        next(err);
    }
});

// delete users
const deleteUser = asyncHandler(async (req, res) => {
    const Users = fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8");
    const newUsers = JSON.parse(Users).filter((el) => el.id.toString() !== req?.params.id);
    fs.writeFileSync(__dirname + "/../Database/Users.json", JSON.stringify(newUsers));
    res.status(200).json({ massege: "delete Users" })
});

// update users
const updateUser = asyncHandler(async (req, res, next) => {
    const { name, age, email, phone, address, password } = req?.body;
    try {

        const user = findUser(req, res);

        const hash = await bcrypt.hashSync(password, 10);


        if (user) {
            user.name = name ?? user.name;
            user.age = age ?? user.age;
            user.email = email ?? user.email;
            user.password = hash ?? user.password;
            user.phone = phone ?? user.phone;
            user.address.street = address?.street ?? user.address.street;
            user.address.city = address?.city ?? user.address.city;
            user.address.state = address?.state ?? user.address.state;
            user.address.country = address?.country ?? user.address.country;

            const Users = JSON.parse(fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8"));
            const index = Users.findIndex((user) => user.id.toString() === req.params.id);


            Users[index] = user;
            console.log(user);
            fs.writeFileSync(__dirname + "/../Database/Users.json", JSON.stringify(Users));
            res.statusCode = 200;
            res.status(200);
            throw new Error("update Users");
        }
        else {
            res.status(404)
            throw new Error("the user not found");
        }
    } catch (err) {
        res.status(404)
        throw new Error("the user not found");
        next()
    }

});

const loginUser = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;
        const Users = JSON.parse(fs.readFileSync(__dirname + "/../Database/Users.json", "utf-8"));
        const isExist = Users.find(async (user) => user.email === email && await bcrypt.compare(password, user.password));
        console.log("isExist", isExist);
        if (isExist) {

            const token = tokenApi.createToken(isExist);

            res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 900000) });

            res.end(JSON.stringify(isExist));
            return;
        }
        res.statusCode = 404;
        throw new Error("User Not Found")
    } catch (err) {

        next();
    }
});

module.exports = { getUsers, getOneUser, addUser, deleteUser, updateUser, loginUser }