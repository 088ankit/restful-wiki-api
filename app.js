const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikidb', {useNewUrlParser:true});

const articleSchema = new mongoose.Schema({
  title : String,
  content : String
});
const Article = mongoose.model('Article', articleSchema);

/* -------------------------------     TARGETTING ALL ARTICLES        -----------------------------------*/


app.route("/articles")

.get(function(req,res){

  Article.find({},function(err,foundArticles){
    if(!err)
    {
      res.send(foundArticles);
    }
    else
    res.send(err);
  })
})

.post(function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
  });

  newArticle.save(function(err){
    if(!err)
    {
      res.send("Successfully done");
    }
    else
    res.send(err);
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err)
      res.send("Successfully done");
    else
    res.send(err);
  });
});

/* -------------------------------     TARGETTING SPECIFIC ARTICLES        -----------------------------------*/

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle} , function(err,found){

  if(found)
   res.send(found);
   else
   res.send("No artcile matching with given title found");
  })
})

 .put(function(req,res){
   Article.updateOne(
     {title : req.params.articleTitle},
     {title : req.body.title,content : req.body.content},
     function(err){
       if(!err)
       {
         res.send("Successfully done");
       }
       else
       res.send(err);
     }
   );
 })

 .patch(function(req,res){
   Article.updateOne(
     {title : req.params.articleTitle},
     {$set : req.body},
     deleteOne
   );
 })

 .delete(function(req,res){
   Article.deleteOne(
     {title : req.params.articleTitle} , 
     function(err){
       if(!err)
       {
         res.send("Successfully done");
       }
       else
       res.send(err);
     }
   );
 });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
