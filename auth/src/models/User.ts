import mongoose from "mongoose";
// model is what we use to access our actual mongoDb instance
// define schema to tell mongoose all properties that user will have

// an interface that describes the properties that are required to create a new user
interface UserAttrs {
	email: string;
	password: string;
}

// an interface that describes the properties that a user model has
// everything in the mongoose model and additional properties
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties that a User Document has
// extends mongoose document + other properties
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}
const userSchema = new mongoose.Schema({
	email: {
		// when use mongoose need capital on type since referring to a constructor whereas typescript lowercase
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});
// build custom function into a model
// after this can do User.build({properties}) and won't need to export a function and User
userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

const user = User.build({
	email: "test@test.com",
	password: "123",
});
user.email;

// typescript has no information if type key value wrong and cannot check
// new User({
//   email:'a@a.com',
//   pas: '123'
// })

// solution: first create an interface for type checking then after create user model

// need to create a user by calling this function that way typescript will know the types and properties needed
// to create that object
// const buildUser = (attrs: UserAttrs) => {
// 	return new User(attrs);
// };

export { User };
