// "use strict";
const pbkdf2Password = require('pbkdf2-password')
const assert = require("assert")
const connection = require("./database");
const sampleEmployee = require("./employees.json")
const crypto = require('crypto');

let hasher = pbkdf2Password();

// Default values for hashing parameters
const DEFAULT_SALT_SIZE = 16;
const DEFAULT_ITERATIONS = 100000;
const DEFAULT_KEY_LENGTH = 64;
const DEFAULT_DIGEST = 'sha256';

let userDatabase = new Map()

// CRYPTO
const generateSalt = () => {
    return crypto.randomBytes(DEFAULT_SALT_SIZE)
}

const hashPasswordCrypto2 = (password, salt) => {
    const hash = crypto.createHmac(DEFAULT_DIGEST, salt)
                       .update(password)
                       .digest('hex');
    return hash;
}

const hashPasswordCrypto = (password, salt, callback) => {
    crypto.pbkdf2(password, salt, DEFAULT_ITERATIONS, DEFAULT_KEY_LENGTH, DEFAULT_DIGEST, callback)
}

const registerUserCrypto = (password, callback) => {
    const salt = generateSalt()
    hashPasswordCrypto(password, salt, (err, derivedKey) => {
        if (err) return callback(err)
        callback(null, salt.toString('hex'), derivedKey.toString('hex'))
    })
}

const verifyPasswordCrypto = (storedHash, salt, providedPassword, callback) => {
    const saltBuffer = Buffer.from(salt, 'hex')
    hashPasswordCrypto(providedPassword, saltBuffer, (err, derivedKey) => {
        if (err) return callback(err)
            callback(null, storedHash === derivedKey.toString('hex'))
    })
}

const comparePasswordCrypto = (plainPassword, salt, storedHash) => {
    const hash = hashPasswordCrypto(plainPassword, salt, (err, key)=>{
        console.log('err', err)
        console.log('key', key.toString('hex'))
    });
    return hash === storedHash;
}
// // Example usage
// const password = 'securepassword';

// // Register user
// registerUser(password, (err, salt, passwordHash) => {
//   if (err) throw err;
//   console.log(`Salt: ${salt}`);
//   console.log(`Password Hash: ${passwordHash}`);

//   // Simulate user login
//   verifyPassword(passwordHash, salt, 'securepassword', (err, isCorrect) => {
//     if (err) throw err;
//     console.log(`Password is correct: ${isCorrect}`);
//   });
// });
// endof CRYPTO

 // Function to handle password hashing
 const hashPassword = async (username, password) => {
    return new Promise((resolve, reject) => {
        hasher({ password }, (err, pass, salt, hash) => {
            userDatabase.set(username, { hash, salt, pass })
            // console.log('misc > hashPassword')
            // console.log(userDatabase)
            if (err) reject(err);
            else resolve({hash, salt});
        });
    });
};

// Function to authenticate a user (check provided password against stored hash)
const authenticateUser =  (providedPassword, storedPasswordHash, storedSalt, callback) => {
    hasher.verify(providedPassword, { hash: storedPasswordHash, salt: storedSalt }, (err, isValid) => {
        if (err) return callback(err);

        // `isValid` will be true if the password matches the stored hash
        callback(null, isValid);
    });
}

const hashing = async (data) => {
    data = JSON.parse(data)
    let {set, where} = data
    set.password = await hashPassword(set.username, set.password)
    set.password = JSON.stringify(set.password)
    // delete set.confirmPassword
    data = { set, where }
    return data
}

const registerUser = async (username, password) => {
    return new Promise((resolve, reject) => {
        hasher({ password }, (err, res) => {
            if (err) return reject(err);
            
            // Store hashed password and salt in the simulated database
            userDatabase.set(username, {
                hash: res.hash,
                salt: res.salt,
                iterations: res.iterations,
                keyLength: res.keyLength,
                digest: res.digest
            });
            // console.log(userDatabase)
            // 
           
            resolve('User registered successfully');
        });
    });
}

const loginUser = async (userDetails, password) => {
    return new Promise((resolve, reject) => {
        if (!userDetails) return resolve('User not found');

        const {password} = JSON.parse(userDetails)
        let {hash, salt} = JSON.parse(password)

        // if (!userDetails) return resolve('User not found');

        // Verify password using the stored hash and salt
        hasher({password}, {
            hash, salt,
            iterations: DEFAULT_ITERATIONS,
            keyLength: DEFAULT_KEY_LENGTH,
            digest: DEFAULT_DIGEST
        }, (err, res) => {
            if (err) {
                console.log(err)
                return reject(err);
            }
            
            if (res.valid) {
                console.log('Login successful')
                resolve('Login successful');
            } else {
                console.log('Invalid password')
                resolve('Invalid password');
            }
        });
        // hasher({password}, {
        //     hash, salt,
        //     iterations: DEFAULT_ITERATIONS,
        //     keyLength: DEFAULT_KEY_LENGTH,
        //     digest: DEFAULT_DIGEST
        // }, (err, res) => {
        //     if (err) return reject(err);
        //     if (res.valid) {
        //         console.log('Login Successful')
        //         resolve('Login Successful')
        //     } else {
        //         console.log('Invalid Password')
        //         resolve('Invalid Password')
        //     }
        //     // // hasher({password}, {
        //     // //     hash, salt,
        //     // //     iterations: DEFAULT_ITERATIONS,
        //     // //     keyLength: DEFAULT_KEY_LENGTH,
        //     // //     digest: DEFAULT_DIGEST
        //     // // }, (err, res) => {
        //     // //     if (err) return reject(err);
                
        //     // //     if (res.valid) {
        //     // //         resolve('Login successful');
        //     // //     } else {
        //     // //         resolve('Invalid password');
        //     // //     }
        //     // // });
        //     // let sss = assert.notDeepEqual(hash2, hash)
        //     // console.log(sss)
        //     // console.log('OK')
        // })
    });
}

const comparePassword = async (incomingPassword, storedHash) => {
    try {
        const isMatch = await crypto.compare(incomingPassword, storedHash);
        if (isMatch) {
            console.log('Password match');
        } else {
            console.log('Password does not match');
        }
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
    }
}

const confirmPassword = (passwords) => {

    const allSame = password.every(value => value === password[0]);
    if(!allSame) {
        return reject('Password is not same')
    }
    return true
}

module.exports = { sampleEmployee, hashPassword, registerUser, loginUser, hashing, authenticateUser, hashPasswordCrypto,registerUserCrypto,verifyPasswordCrypto,comparePasswordCrypto }

