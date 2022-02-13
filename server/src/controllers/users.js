const  User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.Register = async (req, res) =>{

        try{

            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.password, salt);

            let result = await new User({
                username: req.username,
                password: password
            });
            await result.save()
            console.log(result)
            res.status(200).json(result);

        }catch(err){
            res.status(500).json({msj: err.message});
        }
}

exports.Login = async (req, res) =>{
    
            try{
    
                const user = await User.findOne({username: req.username});
                if(!user){
                    res.status(404).json({msj: "Usuario no encontrado"});
                }else{
                    const validPass = await bcrypt.compare(req.password, user.password);
                    if(!validPass){
                        res.status(401).json({msj: "Contraseña incorrecta"});
                    }else{

                        const token = jwt.sign({
                            name: user.username,
                            id: user._id
                        }, "secretKey123")

                        user.token = token;
                        await user.save();
                        
                        res.status(200).json({username:user.username,token:token});
                    }
                }
            }catch(err){
                console.log(err);
                res.status(500).json({msj: err.message});
            }
}

exports.CheckToken = async (req, res) =>{
    try{

        const verified = jwt.verify(req.token, "secretKey123")

        const user = await User.findOne({token: req.token});

        if(user.token == req.token){
            res.status(200).json(user);
        }else{
            res.status(404).json({msj: "Token Invalid"});
        }
            
    }catch(err){
        console.log(err);
    }
}
