// Utility script used to generate bcrypt hashes for seeded users
// This function is not used as part of the application, but has been kept for reference purposes
const bcrypt = require("bcrypt");

async function hashPasswords() {

    const passwords = [
        "admin123",
        "customer123",
        "technician123"
    ];

    for (const password of passwords) {

        const hash = await bcrypt.hash(password, 10);
        console.log(`${password}:`);
        console.log(hash);
        console.log();
    }
}

hashPasswords();