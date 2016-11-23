/**
 * Created by zouxiang on 2016/10/13.
 */
'use strict';
var express = require('express');
var path = require('path');
var _ = require('underscore');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var port = process.env.PORT || 3000; //也可以启动到时候手动输入端口号
var app = express();

mongoose.connect('mongodb://localhost/movie');

app.set('views', './views/pages');
app.set('view engine', 'jade');
// app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'bower_components')));
app.listen(port);

console.log('start on port' + port);

//index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) console.log(err);
        res.render('index', {
            title: '首页',
            movies: movies
        })
    });
});

//detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movies) {
        if (err) console.log(err);
        res.render('detail', {
            title: movie.title,
            movies: movies
        })
    });
});
//admin page
app.get('/admin/movie',function (req,res) {
    res.render('admin',{
        title:'后台录入页',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }
    })
});
//admin update movie
app.get('/admin/update/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function (err,movie) {
            res.render('admin',{
                title:'后台更新页',
                movie:movie
            })
        })
    }

});

//admin post movie
app.post('/admin/movie/new',function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movies;
    var _movie;

    if(id !== 'undefined'){
        Movie.findById(id,function (err, movie) {
            if(err) console.log(err);

            _movie = _.extend(movie,movieObj);
            _movie.save(function (err,movie) {
                if(err) console.log(err);
                res.redirect('/movie/' + movie._id);//重定向
            })
        })
    }else {
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        });
        _movie.save(function (err,movie) {
            if(err) console.log(err);
            res.redirect('/movie/' + movie._id);//重定向
        })
    }
});

//index page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) console.log(err);
        res.render('list', {
            title: '列表页',
            movies: movies
        })
    });
});