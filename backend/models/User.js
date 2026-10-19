const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Only meaningful for role: "admin". Controls what an admin can see in
    // getAllIssues (and single-complaint routes):
    //   - mandal set (+ district)  -> scoped to that ONE mandal only (most specific)
    //   - district set, no mandal  -> scoped to that whole district
    //   - neither set              -> super admin, sees every complaint everywhere
    district: {
      type: String,
      default: null,
    },
    mandal: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash the password before saving (only if it was changed)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method used during login
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Never send the password hash back in API responses
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
