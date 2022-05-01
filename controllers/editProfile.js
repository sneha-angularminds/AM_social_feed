const User = require('./../models/register');
const EditUser = require('./../models/editProfile');


exports.editUser = async (req, res, next) => {
    // console.log(req.params.editId)
    // console.log(req.user.id)
    const {name, bio, gender, dob, email, mobile} = req.body;
    const profileId = await EditUser.findOne({email})
    console.log(profileId)
    console.log(req.file)
    console.log(req.file.path)
    const current_user = req.user;
    if(current_user.id === req.params.editId)
    {
        const profile = new EditUser({name, bio, gender, dob, email, mobile, photo: req.file.path})
        console.log(profile)
        try{
            await profile.save()
            res.status(200).json({ profile });
        }catch(err) {
            err.status = 400;
            next(err);
          }
    }
}

//2022-04-25T12:18:05.229+00:00