import bcrypt from 'bcrypt';
import prisma from '../config/db.config.js';
import jwt from 'jsonwebtoken';
class AuthController {

// static async register(req, res) {
//     try {
//       const payload = req.body;

//       // Email validation
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       if (!emailRegex.test(payload.email)) {
//         return res.status(400).json({ message: 'Invalid email format' });
//       }
//        // Password validation (6-digit)
//     const passwordRegex = /^\d{6}$/;
//     if (!passwordRegex.test(payload.password)) {
//       return res.status(400).json({ message: 'Password must be 6 digits' });
//     }

//       // Check if email already exists
//       const existingUser  = await prisma.user.findUnique({
//         where: {
//           email: payload.email,
//         },
//       });
//       if (existingUser ) {
//         return res.status(400).json({ message: 'Email already exists' });
//       }

//       const slt = bcrypt.genSaltSync(10);
//       payload.password = bcrypt.hashSync(payload.password, slt);
//       const user = await prisma.user.create({
//         data: payload
//       });
//       return res.json({ message: 'Register created successfully', user });
//     } catch (error) {
//       return res.status(400).json({ message: 'Error creating user', error });
//     }
//   }
static async register(req, res) {
    try {
      const payload = req.body;

      // Email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(payload.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Password validation (6-digit)
      const passwordRegex = /^\d{6}$/;
      if (!passwordRegex.test(payload.password)) {
        return res.status(400).json({ message: 'Password must be 6 digits' });
      }

      // Check if email already exists
      const existingUser  = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (existingUser ) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const slt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, slt);
      const user = await prisma.user.create({
        data: payload
      });

      // Generate token after registration
      const tokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });

      return res.json({
        message: 'Register created successfully',
        user,
        access_token: `Bearer ${token}`,
      });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating user', error });
    }
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user) {
        // *Check both password
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ message: "Invalid Password" });
        }

        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "365d",
        });

        return res.json({
          message: "Logged in successfully!",
          access_token: `Bearer ${token}`,
        });
      }

      return res.status(401).json({ message: "Invalid Email" });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
  static async user(req, res) {
    const user = req.user;
    return res.status(200).json({ user: user });
  }

}

export default AuthController;
