import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
	// use static so will not need to create instance of class to call it
	static async toHash(password: string) {
    // generate salt
		const salt = randomBytes(8).toString("hex");
    // create buffer
		const buf = (await scryptAsync(password, salt, 64)) as Buffer;

		return `${buf.toString("hex")}.${salt}`;
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		const [hashedPassword, salt] = storedPassword.split(".");
		const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

		return buf.toString("hex") === hashedPassword;
	}
}
