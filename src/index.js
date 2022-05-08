const express= require("express")
const bodyParser= require("body-parser")
const route= require("./route/route")
const mongoose= require("mongoose")
const app= express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://Swetarun:lBf6gTedHw2tfPtQ@cluster0.ebg8a.mongodb.net/personalProject", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDB is Connected!"))
.catch( err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 3000, function(){
    console.log('Express app running on PORT' + (process.env.PORT || 3000))
})