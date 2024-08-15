// "use strict";
// Step 1 -- ERROR in base64 encoded
// const pbkdf2Password = require('pbkdf2-password')
// const hasher = pbkdf2Password();
// endof Step 1
// Step 2 -- ERROR in pbkdf2
// const crypto = require('crypto');
// const HASH_ALGORITHM = 'sha512';  // Hashing algorithm
// const ITERATIONS = 888;         // Number of iterations
// const KEY_LENGTH = 32;            // Length of the derived key (in bytes)
// const SALT_LENGTH = 16;           // Length of the salt (in bytes)
// let {pbkdf2} = crypto
// endof Step 2
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const utils = {

// Step 2
    // async hashPasswordUtils(password) {
    //     return new Promise((resolve, reject) => {
    //         crypto.randomBytes(SALT_LENGTH, (err, salt) => {
    //             if (err) return reject(err);

    //             pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, HASH_ALGORITHM, (err, derivedKey) => {
    //                 if (err) return reject(err);
    //                 resolve({
    //                     salt: salt.toString('hex'),
    //                     hash: derivedKey.toString('hex')
    //                 });
    //             });
    //         });
    //     });
    // }, 
    // async verifyPassword(password, salt, storedHash) {
    //     return new Promise((resolve, reject) => {
    //         pbkdf2(password, Buffer.from(salt, 'hex'), ITERATIONS, KEY_LENGTH, HASH_ALGORITHM, (err, derivedKey) => {
    //             if (err) return reject(err);
    //             resolve(derivedKey.toString('hex') === storedHash);
    //         });
    //     });
    // }

// endof Step 2

// Step 1
//    async hashPasswordUtils(password) {
//         return new Promise((resolve, reject) => {
//             hasher({ password }, (err, pass, salt, hash) => {
//                 if (err) reject(err);
//                 else resolve({hash, salt});
//             });
//         });
//     },
    
//     async authenticateUserUtils(providedPassword, storedPasswordHash, storedSalt, callback) {
//         return new Promise((resolve, reject) => {
//             hasher(providedPassword, { hash: storedPasswordHash, salt: storedSalt}, (err, isValid) => {
//                 if (err) reject(err)
//                 else resolve(isValid)
//             })
//         })
//     }
// endof Step 1
}

module.exports = {...utils}