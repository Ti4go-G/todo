import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const loginUser = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({message: 'Por favor, forneça email e senha'})
    }


    try {
        const user = await User.findOne({email}).select('+password');
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({message: 'Email ou senha inválidos'})
        }

        const token = jwt.sign({
          id: user._id,
         }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.status(200).json({message: "login realizado com sucesso", token})
    } catch (error) {
        res.status(500).json({message: 'Ocorreu um erro ao buscar o usuário'},error)
        console.log(error)
    }
}
