// src/utils/userData.js
export const users = [
    { pin: '1', childName: 'Richie', childAge: '5' },
    { pin: '2', childName: 'CJ', childAge: '7' },
    // Add more users here
];

export const getUserDataByPin = (pin) => {
    return users.find(user => user.pin === pin);
};