var express = require('express');
var router = express.Router();

// add model ref
const Artist = require('../models/artist')

//passport for auth
const passport = require('passport')


//auth check next是说，what if we want to do something after we call an express function
//这个function的存在就是当我们想去直接去access artist的相关页面的时候，如果是登录了，就去，如果没登陆，那就直接转去login
function authCheck(req,res,next){
    //use express built-in method to check user identity, if a user is found, continue to the next method
    if(req.isAuthenticated()){
        return next()
    }
    // if no user found, go to login

    res.redirect('/login')

}






//这里res。就是send error to browser
// GET: /artists => show index view
//authCheck,如果这个人login了，那么就进入下一步，不然的话，就直接redirect去login
router.get('/', (req, res) => {
    // use Artist model to fetch all documents from artists collection in mongodb
    Artist.find((err, artists) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            //render这个叫做'artists/index'的view，发送artists list去这个view
            console.log(artists)
            res.render('artists/index', {
                artists: artists,
                title:'Artist',
                user: req.user

            })
        }
    })
})


// GET: /artists/create => show new artist form.  Now call authCheck first
router.get('/create', authCheck,(req, res) => {
    res.render('artists/create', {
        title: 'Add a New Artist',
        user: req.user
    })
})


// POST: /artists/create => process form submission & save new Artist document
router.post('/create', authCheck,(req, res) => {
    // use Mongoose model to create a new Artist document
    Artist.create({
        name: req.body.name
    }, (err, newArtist) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else { // save successful; update artists list view
            res.redirect('/artists')
        }
    })
})

// GET: /artists/delete/abc123 => delete artist with the _id parameter
router.get('/delete/:_id',authCheck,(req, res) => {
    // get document id from url parameter
    let _id = req.params._id

    // use Mongoose to delete the document & redirect
    Artist.remove({ _id: _id }, (err) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/artists')
        }
    })
})

// GET: /artists/edit/abc123 => show pre-populated Edit form
router.get('/edit/:_id', authCheck,(req, res) => {
    // read _id from url param
    let _id = req.params._id

    // query the db for the selected Artist document
    Artist.findById(_id, (err, artist) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            // load the edit view and pass the selected Artist doc to it for display
            res.render('artists/edit', {
                title: 'Artist Details',
                artist: artist,
                user: req.user
            })
        }
    })
})

// POST: /artists/edit/abc123 => update existing Artist doc with values from form submission
router.post('/edit/:_id', authCheck,(req, res) => {
    // get document id from url param
    let _id = req.params._id

    // Use Mongoose findByIdAndUpdate to save changes to existing doc
    Artist.findByIdAndUpdate({ _id: _id}, { 'name': req.body.name }, null,(err, artist) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/artists')
        }
    })
})


// POST: /artists/add-album/abc123 => save new album to existing artist doc in nested albums array
router.post('/add-album/:_id',authCheck,(req,res)=>{
    let _id = req.params._id

    Artist.findById(_id, (err, artist) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            // load the edit view and pass the selected Artist and albums
            artist.albums.push({
                title: req.body.title,
                year: req.body.year,
                rating: req.body.rating
            })


            artist.save((err, artist) => {
                if (err) {
                    res.send(err)
                }
                else {
                    res.redirect('/artists/edit/' + req.params._id)
                }
            })



        }
    })



})


// make public
module.exports = router