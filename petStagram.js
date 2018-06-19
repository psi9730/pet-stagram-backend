const express = require('express');
const app = express();
const bodyParser = require("body-parser");
require('date-utils');
var multer = require('multer');
var _ = require('lodash-node');
var storage = multer.diskStorage({
    // 서버에 저장할 폴더
    destination: function (req, file, cb) {
    	console.log(file,"file");
      cb(null, './database/cardPicture');
    },

    // 서버에 저장할 파일 명
    filename: function (req, file, cb) {
      file.uploadedFile = {
        name: card_count,
        ext: file.mimetype.split('/')[1]
      };
      cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
    }
  });
app.use(express.static('database'));

var upload = multer({storage : storage});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

var headerContent = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'  ,'Content-Type': 'text/html', 'Access-Control-Allow-Headers' : 'Content-Type, Access-Control-Allow-Headers, authorization, X-Requested-With'};

app.use(bodyParser.json());

var http = require('http');
var url = require('url');
var querystring = require('querystring');


// Port Setting
var port = 8000;


// Debug mode ON/OFF
var debug = true;
var localDB = true;
var sampleDB = true;


// Local database for dev
var user_count = 0;
var users = [];

var pet_count = 0;
var pets = [];

var card_count = 0;
var cards = [];

var tag_count = 0;
var tags = [];

var like_count = 0;
var likes = [];

var comment_count = 0;
var comments = [];

var picture_count = 0;
var pictures = [];

var video_count = 0;
var videos = [];

var memo_count = 0;
var memos = [];


// Class & function for User
function user(){

	this.user_id = user_count++;
	this.login_id = "";
	this.login_password = "";
	this.user_nickname = "";
	this.profile_pic_url = "";
	this.sign_in_date = "";
	this.pet_id = [];
	this.following_id = [];
	this.followed_id = [];
	this.memo_id = [];
	this.intro = "";
	this.like_id=[];

};

function addUser(user){

	if(localDB){
		users.push(user);
	}
	else{

	}
};

function modifyUser(userEmail, login_id, login_password, user_nickname, profile_pic_url, intro){

	if(localDB){
		var userWillModified = users.find((u) => u.login_id == userEmail);

		if(login_id)
			userWillModified.login_id = login_id;
		if(login_password)
			userWillModified.login_password = login_password;
		if(user_nickname)
			userWillModified.user_nickname = user_nickname;
		if(profile_pic_url)
			userWillModified.profile_pic_url = profile_pic_url;
		if(intro)
			userWillModified.intro = intro;
	}
	else{

	}

}

function deleteUser(userEmail){

	if(localDB){

		var userWillDeleted = users.find((u) => u.login_id == userEmail);

		var userWillDeleted_id = userWillDeleted.user_id;

		userWillDeleted.pet_id.forEach((p_i) =>{

			var userPet = pets.filter((p) => p.pet_id == p_i);
			userPet.forEach((p) => {
				if(p.owners.length == 1){
					deletePet(p.pet_id);
				}
				else{
					petOwnerDelete(p.pet_id, userEmail);
				}
			});

		});

		comments.filter((c) => c.user_email == userEmail).forEach((c) => {
			deleteComment(c.comment_id);
		});

		likes.filter((l) => l.user_email == userEmail).forEach((l) => {
			deleteLike(l.like_id);
		});

		var followedUsers = users.filter((u) => (u.followed_id.find((f_i) => f_i == userEmail)));

		followedUsers.forEach((u) => {
			unfollow(userEmail, u.login_id);
		});

		users = users.filter((u) => u.user_id != userEmail);
	}
	else{

	}

}

function follow(userEmail1, userEmail2){

	var user1 = users.find((u) => u.login_id == userEmail1);
	var user2 = users.find((u) => u.login_id == userEmail2);

	user1.following_id.push(userEmail2);
	user2.followed_id.push(userEmail1);

}

function unfollow(userEmail1, userEmail2){

	var user1 = users.find((u) => u.login_id == userEmail1);
	var user2 = users.find((u) => u.login_id == userEmail2);

	user1.following_id = user1.following_id.filter((u_i) => u_i != userEmail2);
	user2.followed_id = user2.followed_id.filter((u_i) => u_i != userEmail1);

}

function userFindByEmail(login_id){

	if(localDB){
		return users.find((user) => user.login_id == login_id);
	}
	else{

	}

};

function userEmailFilter(userEmail){

	if(localDB){
		return users.filter((user) => user.login_id.includes(userEmail));
	}
	else{

	}
};

function searchFollowing(u){

	if(localDB){
		return users.filter((user) => (u.following_id.find((usertemp) => usertemp.login_id == user.login_id)));
	}
	else{

	}

};

function isFollowing(userEmail1, userEmail2){

	if(localDB){
		return userEmail1.following_id.find((user) => userEmail2 == user.login_id);
	}
	else{

	}

};


// Class & function for Pet
function pet(){

	this.pet_id = pet_count++;
	this.owners = [];
	this.pet_name = "";
	this.profile_pic_url = "";
	this.card_id = [];
	this.intro = "";
	this.pet_birthday = "";

};

function addPet(owner_email, pet){

	if(localDB){
		var owner = userFindByEmail(owner_email);
		owner.pet_id.push(pet.pet_id);
		pets.push(pet);
	}
	else{

	}
};

function modifyPet(pet_id, pet_name, profile_pic_url, intro, pet_birthday){

	if(localDB){

		var petWillBeModified = pets.find((p) => p.pet_id == pet_id);

		if(pet_name)
			petWillBeModified.pet_name = pet_name;
		if(profile_pic_url)
			petWillBeModified.profile_pic_url = profile_pic_url;
		if(intro)
			petWillBeModified.intro = intro;
		if(pet_birthday)
			petWillBeModified.pet_birthday = pet_birthday;
	}
	else{

	}

};

function petOwnerAdd(pet_id, newOwnerEmail){

	if(localDB){
		var thePet = pets.find((p) => p.pet_id == pet_id);
		thePet.owners.push(newOwnerEmail);
	}
	else{

	}

};

function petOwnerDelete(pet_id, ownerWillBeDeleted){

	if(localDB){
		var thePet = pets.find((p) => p.pet_id == pet_id);
		thePet.owners = thePet.owners.filter((u) => u != newOwnerEmail);
	}

};

function deletePet(pet_id){

	if(localDB){

		var petWillDeleted = pets.find((p) => p.pet_id == pet_id);

		petWillDeleted.card_id.forEach((c) =>
			deleteCard(c)
		);

		var owners = users.filter((u) => (u.pet_id.find((p) => p == pet_id)));

		owners.forEach((u) =>
			u.pet_id = u.pet_id.filter((p) => p != pet_id)
		);

		pets = pets.filter((p) => p.pet_id != pet_id);
	}
	else{

	}

};

function isPetExist(pet_id){

	if(localDB){
		var e = pets.find((p) => p.pet_id == pet_id);
		if(e)
			return true;
		else
			return false;
	}
	else{

	}

}

function petFindById(pet_id){

	if(localDB){
		return pets.find((p) => p.pet_id == pet_id);
	}
	else{

	}

};

function ownerExist(owner){

	if(localDB){
		return users.find((user) => user.login_id == owner);
	}
	else{

	}

};

function userPetArray(user){

	if(localDB){
		return pets.filter((pet) => (user.pet_id.find((id) => pet.pet_id == id)));
	}
	else{

	}

}


// Class & function for Card
function card(pet_id){

	this.card_id = card_count++;
	this.date = Date.now();
	this.location = "";
	this.title = "";
	this.text = "";
	this.tag_id = [];
	this.like_id = [];
	this.comment_id = [];
	this.video_id = [];
	this.picture_id = [];
	this.pet_id = pet_id;
	this.writer = "";

}

function addCard(card){

	if(localDB){
		cards.push(card);
	}
	else{

	}
}

function modifyCard(card_id, location, title, text, tag_id, picture_id, video_id){

	if(localDB){
		var theCard = cards.find((c) => c.card_id == card_id);

		if(location)
			theCard.location = location;
		if(title)
			theCard.title = title;
		if(text)
			theCard.text = text;
		if(tag_id)
			theCard.tag_id = tag_id;
		if(picture_id)
			theCard.picture_id = picture_id;
		if(video_id)
			theCard.video_id = video_id;

	}
	else{

	}

}

function deleteCard(card_id){

	if(localDB){

		var cardWillDeleted = cards.find((c) => c.card_id == card_id);

		cardWillDeleted.tag_id.forEach((t) =>
			deleteTag(t)
		);

		cardWillDeleted.comment_id.forEach((c) =>
			deleteComment(c)
		);

		cardWillDeleted.like_id.forEach((l) =>
			deleteLike(l)
		);

		cardWillDeleted.picture_id.forEach((p) =>
			deletePicture(p)
		);

		cardWillDeleted.video_id.forEach((v) =>
			deleteVideo(v)
		);

		var thePet = pets.find((p) => p.pet_id == cardWillDeleted.pet_id);

		thePet.card_id = thePet.card_id.filter((c) => c.card_id != card_id);

		cards = cards.filter((c) => c.card_id != card_id);
	}
	else{

	}

}

function cardFindById(card_id){

	if(localDB){
		return cards.find((p) => p.card_id == card_id);
	}
	else{

	}

}


// Class & function for Tag
function tag(){

	this.tag_id = tag_count++;
	this.used_number = 0;
	this.tag_text = "";

}

function addTag(tag){
	if(localDB){
		tags.push(tag);
	}
	else{

	}
}

function deleteTag(tag_id){

	if(localDB){
		tags.splice(tag_id,1);
	}
	else{

	}

}


// Class & function for Like
function like(card_id){

	this.like_id = like_count++;
	this.date = Date.now();
	this.user_email = 0;
	this.card_id = card_id;

}

function addLike(like){
	if(localDB){
		likes.push(like);
		cards.find((c) => c.card_id == like.card_id).like_id.push(like.like_id);
	}
	else{

	}
}

function deleteLike(like_id){

	if(localDB){

		var card_id = likes.find((l) => l.like_id == like_id).card_id;

		likes = likes.filter((l) => l.like_id != like_id);
        var card = cards.find((c) => c.card_id == card_id)
		var cardLikes = cards.find((c) => c.card_id == card_id).like_id
		cardLikes = cardLikes.filter((l) => l.like_id != like_id);
     	card.like_id = card.like_id.filter((m_i) => m_i != like_id);
		likes = likes.filter((l) => l.like_id != like_id);
	}
	else{

	}

}

function likeFindById(like_id){

	if(localDB){
		return likes.find((l) => l.like_id == like_id);
	}
	else{

	}

}


// Class & function for Comment
function comment(card_id){
	this.comment_id = comment_count++;
	this.text = "";
	var dt= new Date();
	var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
	this.date = d ;
	this.user_email = '';
	this.card_id = card_id;
}

function addComment(comment){
	if(localDB){
		comments.push(comment);
		cards.find((c) => c.card_id == comment.card_id).comment_id.push(comment.comment_id);
	}
	else{

	}
}

function modifyComment(comment_id, text){

	if(localDB){
		var theCard = cards.find((c) => c.card_id == card_id);

		if(text)
			theCard.text = text;

	}
	else{

	}

}

function deleteComment(comment_id){

	if(localDB){
		var card_id = comments.find((c) => c.comment_id == comment_id).card_id;
		comments = comments.filter((c) => c.comment_id != comment_id);
        var card = cards.find((c) => c.card_id == card_id)
        card.comment_id = card.comment_id.filter((m_i) => m_i != comment_id);
		comments = comments.filter((c) => c.comment_id != comment_id);
	}
	else{

	}

}

function commentFindById(comment_id){

	if(localDB){
		return comments.find((c) => c.comment_id == comment_id);
	}
	else{

	}

}


// Class & function for Picture
function picture(card_id){
	this.picture_id = picture_count++;
	this.picture_url = "";
	this.size = 0;
	this.card_id = card_id;
}

function addPicture(picture){
	if(localDB){
		pictures.push(picture);
		cards.find((c) => c.card_id == picture.card_id).picture_id.push(picture.picture_id);
	}
	else{

	}
}

function deletePicture(picture_id){

	if(localDB){
		var card_id = pictures.find((p) => p.picture_id == picture_id).card_id;

		pictures = pictures.filter((p) => p.picture_id != picture_id);

		var cardPictures = pictures.find((p) => p.picture_id == card_id).picture_id
		cardComments = cardComments.filter((c) => c.picture_id != picture_id);

		pictures = pictures.filter((p) => p.picture_id != picture_id);
	}
	else{

	}

}

function pictureFindById(picture_id){

	if(localDB){
		return pictures.find((p) => p.picture_id == picture_id);
	}
	else{

	}

}



// Class & function for Video
function video(card_id){
	this.video_id = video_count++;
	this.video_url = "";
	this.size = 0;
	this.card_id = card_id;
}

function addVideo(video){
	if(localDB){
		videos.push(video);
		cards.find((c) => c.card_id == video.card_id).video_id.push(video.video_id);
	}
	else{

	}
}

function deleteVideo(video_id){

	if(localDB){
		var card_id = videos.find((v) => v.video_id == video_id).card_id;

		videos = videos.filter((v) => v.video_id != video_id);

		var cardVideos = videos.find((v) => v.video_id == card_id).video_id
		cardVideos = cardVideos.filter((c) => c.video_id != video_id);

		videos = videos.filter((v) => v.video_id != video_id);
	}
	else{

	}

}

// Class & function for Memo
function memo(user_email){
	this.memo_id = memo_count++;
	this.text = "";
	this.date = "";
	this.user_email = user_email;
}

function addMemo(memo){
	if(localDB){
		memos.push(memo);
		var theUser = users.find((u) => u.login_id == memo.user_email)
		theUser.memo_id.push(memo.memo_id);
	}
	else{

	}
}

function modifyMemo(memo_id, text, date){

	if(localDB){

		var theMemo = memos.find((m) => m.memo_id == memo_id);

		if(text)
			theMemo.text = text;
		if(date)
			theMemo.date = date;

	}
	else{

	}

}

function deleteMemo(memo_id){

	if(localDB){

		var theMemo = memos.find((m) => m.memo_id == memo_id);

		var theUser = users.find((u) => u.login_id = theMemo.user_email);

		theUser.memo_id = theUser.memo_id.filter((m_i) => m_i != memo_id);

		memos = memos.filter((m) => m.memo_id != memo_id);
	}
	else{

	}

}

function memoFindById(memo_id){

	if(localDB){
		return memos.find((m) => m.memo_id == memo_id);
	}
	else{

	}

}


// Sample database creation
function dev_init(){

	for(var i=0; i<10; i++){
		var u = new user();
		u.login_id = 'test' + i;
		u.login_password = SHA256("" + i);
		users.push(u);
	}

	var u = new user();

	u.login_id = "sarcr@naver.com";
    u.login_password = SHA256("asdf");
    u.user_nickname = "sadfasdf";

   	users.push(u);

	u = new user();

	u.login_id = "psi9730@naver.com";
    u.login_password = SHA256("tmtmtmtm");
    u.user_nickname = "sadfasdf";

   	users.push(u);
}


// URLs
app.get('/', function (req, res) {
    res.writeHead(200, headerContent);
    res.end('Hello World!');
});

app.post('/login', function (req, res) {

	var login_id = req.body.email;
	var login_password = SHA256(req.body.password);

	if(debug){
		console.log('***********************' +
			        '[/login] POST\n' +
			        'email = ' + login_id + '\n' +
			        'password = ' + req.body.password);
	}

	var idFound = userFindByEmail(login_id);

	if(idFound){

		if(idFound.login_password == login_password){

			var accessToken = Buffer.from(login_id).toString('base64');

			if(debug){
				console.log('<Login Success>');
				console.log('{\"token\" : \"' + accessToken + '\.' + SHA256(login_id + login_password) + '\"}');
				console.log('***********************');
			}

			res.writeHead(200, headerContent);
    		res.write('{\"token\" : \"' + accessToken + '\.' + SHA256(login_id + login_password) + '\"}');
    		res.end();
		}
		else{

			if(debug){
				console.log('Login Failed(Password not match');
				console.log('***********************');
			}

			res.writeHead(404, headerContent);
    		res.write('Password doesn\'t match');
    		res.end();
		}

	}
	else{

		if(debug){
			console.log('Login Failed(E-mail not found)');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('User e-mail not found');
    	res.end();
	}


});

app.post('/register', function (req, res) {

	var user_id = user_count;
	var login_id = req.body.email;

	var login_password = SHA256(req.body.password);
	var user_nickname = req.body.username;
	var profile_pic_url = req.body.userProfileImage;
	var sign_in_date = Date.now();
	var intro = req.body.userIntroduceText;

	if(debug){
		console.log('***********************');
		console.log('[/register] POST');
		console.log('<USER>');
		console.log('user_id = ' + user_id);
		console.log('login_id = ' + login_id);
		console.log('login_password = ' + login_password);
		console.log('user_nickname = ' + user_nickname);
		console.log('profile_pic_url = ' + profile_pic_url);
		console.log('sign_in_date = ' + sign_in_date);
		console.log('intro = ' + intro);
	}

	var pet_name = req.body.petName;
	var pet_id = pet_count;
	var profile_pic_url = req.body.petProfileImage;
	var intro = req.body.petIntroduceText;

	if(debug){
		console.log('<PET>');
		console.log('pet_id = ' + pet_id);
		console.log('pet_name = ' + pet_name);
		console.log('profile_pic_url = ' + profile_pic_url);
		console.log('intro = ' + intro);
	}

	var idExist = userFindByEmail(login_id);

	if(login_id && user_nickname && login_password && pet_name){

		if(!idExist){

			if(login_id.includes('@')){

				var u = new user();
				u.user_id = user_id;
				u.login_id = login_id;
				u.login_password = login_password;
				u.sign_in_date = sign_in_date;

				addUser(u);

				var p = new pet();
				p.pet_name = pet_name;
				p.profile_pic_url = profile_pic_url;
				p.intro = intro;

				addPet(login_id, p);

				if(debug){
					console.log('<Register SUCCESS>');
					console.log('***********************');
				}

				res.writeHead(200, headerContent);
		    	res.write('{\"user_id\" : ' + user_id  + ', \"pet_id\" : ' + pet_id + ', \"success\" : true}');
		    	res.end();
	    	}
	    	else{

	    		if(debug){
					console.log('Register FAILED(Email form error)');
					console.log('***********************');
				}

	    		res.writeHead(404, headerContent);
	    		res.write('User ID is not email-form');
	    		res.end();
	    	}
    	}
    	else{

    		if(debug){
				console.log('Register FAILED(Email already exists)');
				console.log('***********************');
			}

    		res.writeHead(404, headerContent);
    		res.write('Email Address already exists');
    		res.end();

    	}

	}
	else{

		if(debug){
			console.log('Register FAILED(Insufficient datum)');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('Mandatory datum are not provided');
    	res.end();
	}

});

app.get('/user/:user_email', function (req, res) {

	var user_email = req.params.user_email;

	var u = userFindByEmail(user_email);

	if(debug){
		console.log('***********************');
		console.log('[/user/:user_email] GET');
		console.log('user_email = ' + user_email);
	}

	if(u){

		var following = searchFollowing(u);
		var followingNames = '[';

		following.forEach((f) =>

			followingNames = followingNames + '\"' + f.user_nickname + '\",'

		);

		if(following.length > 0){
			followingNames = followingNames.substring(0, json.length-1) + ']';
		}
		else{
			followingNames = followingNames + ']';
		}

		var totalPost = 0;
		var petsJson = '[';

		u.pet_id.forEach((p_i) => {

			var p = petFindById(p_i);

			totalPost = totalPost + p.card_id.length;

			var cardsJson = '[';

			p.card_id.forEach((c_i) => {

				var c = cardFindById(c_i);

				cardsJson = cardsJson + '{\"id\" : ' + c.card_id + ', ' +
	    			   '\"title\" : \"' + c.title + '\", ' +
	    			   '\"text\" : \"' + c.text + '\", ' +
	    			   '\"date\" : \"' + c.date + '\", ' +
	    			   '\"tag_id\" : \"' + arrayToString(c.tag_id) + '\", ' +
	    			   '\"comment_id\" : \"' + arrayToString(c.comment_id) + '\", ' +
	    			   '\"video_id\" : \"' + arrayToString(c.video_id) + '\", ' +
	    			   '\"picture_id\" : \"' + arrayToString(c.picture_id) + '\", ' +
	    			   '\"pet_id\" : \"' + arrayToString(c.pet_id) + '\", ' +
	    			   '\"location\" : \"' + c.location + '\"},';


			});

			if(p.card_id.length > 0){
				cardsJson = cardsJson.substring(0,cardsJson.length-1) + ']';
			}
			else{
				cardsJson = '[]';
			}

			petsJson = petsJson + '{\"id\" : ' + p.pet_id + ', ' +
    			   '\"petName\" : \"' + p.pet_name + '\", ' +
    			   '\"petProfileImage\" : \"' + p.profile_pic_url + '\", ' +
    			   '\"petBirthDay\" : \"' + p.pet_birthday + '\", ' +
    			   '\"introduceText\" : \"' + p.intro + '\", ' +
    			   '\"cards\" : ' + cardsJson + ', ' +
    			   '\"owner\" : \"' + arrayToString(p.owners) + '\"},';

		});

		if(u.pet_id.length > 0){
			petsJson = petsJson.substring(0, petsJson.length-1) + ']';

		}
		else{
			petsJson = '[]';
		}


		if(debug){
			console.log('<FOLLOWING FOUND>');
			console.log('{\"user_id\" : ' + u.user_id + ', ' +
	    		'\"email\" : \"' + u.login_id + '\", ' +
	    		'\"username\" : \"' + u.user_nickname + '\", ' +
	    		'\"userProfileImage\" : \"' + u.profile_pic_url + '\", ' +
				'\"introduceText\" : \"' + u.intro + '\", ' +
				'\"pets\" : ' + petsJson + ', ' +
				'\"userBirthDay\" : \"' + u.userBirthDay + '\", ' +
				'\"totalPost\" : ' + totalPost + ', ' +
				'\"totalFollowing\" : ' + u.following_id.length + ', ' +
				'\"totalFollowed\" : ' + u.followed_id.length + ', ' +
				'\"followingNames\" : ' + followingNames + '}');
			console.log('***********************');
		}

	    res.writeHead(200, headerContent);
	    res.write('{\"user_id\" : ' + u.user_id + ', ' +
	    		'\"email\" : \"' + u.login_id + '\", ' +
	    		'\"username\" : \"' + u.user_nickname + '\", ' +
	    		'\"userProfileImage\" : \"' + u.profile_pic_url + '\", ' +
				'\"introduceText\" : \"' + u.intro + '\", ' +
				'\"pets\" : ' + petsJson + ', ' +
				'\"userBirthDay\" : \"' + u.userBirthDay + '\", ' +
				'\"totalPost\" : ' + totalPost + ', ' +
				'\"totalFollowing\" : ' + u.following_id.length + ', ' +
				'\"totalFollowed\" : ' + u.followed_id.length + ', ' +
				'\"followingNames\" : ' + followingNames + '}');
	    res.end();
	}
	else{

		if(debug){
			console.log('USER NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No user is found');
    	res.end();
	}

});

app.put('/user/:user_email', upload.single('userProfileImage'), function (req, res) {

	var user_email = req.params.user_email;

	var u = userFindByEmail(user_email);

	var picture = req.file;

	if(debug){
		console.log('***********************');
		console.log('[/user/:user_email] PUT');
		console.log('user_email = ' + user_email);
		console.log('picture = ' + picture);
	}

	if(u){

		var login_id = req.body.userEmail;
		var login_password = req.body.password;
		var user_nickname = req.body.username;
		var profile_pic_url = req.body.userProfileImage;
		var intro = req.body.introduceText;

		modifyUser(user_email, login_id, login_password, user_nickname, profile_pic_url, intro);

		if(debug){
			console.log('<USER INFO MODIFIED>');
			console.log('{\"userEmail\" : ' + login_id + ', ' +
	    		'\"password\" : \"' + login_password + '\", ' +
	    		'\"userProfileImage\" : \"' + user_nickname + '\", ' +
	    		'\"introduceText\" : \"' + intro + '\"}');
			console.log('***********************');
		}

	    res.writeHead(200, headerContent);
	    res.write('{\"success\" : true}');
	    res.end();
	}
	else{

		if(debug){
			console.log('USER NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No user is found');
    	res.end();
	}

});

app.delete('/user/:user_email', function (req, res) {

	var user_email = req.params.userEmail;

	var u = userFindByEmail(user_email);

	if(debug){
		console.log('***********************');
		console.log('[/user/:user_email] DELETE');
		console.log('user_email = ' + user_email);
	}

	if(u){

		deleteUser(user_email);

		if(debug){
			console.log('<USER DELETED>');
			console.log('***********************');
		}

	    res.writeHead(200, headerContent);
	    res.write('{\"success\" : true}');
	    res.end();
	}
	else{

		if(debug){
			console.log('USER NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No user is found');
    	res.end();
	}

});

app.get('/user', function (req, res) {

	var parsedUrl = url.parse(req.url);
	var parsedQuery = querystring.parse(parsedUrl.query,'&','=');

	var userEmail = parsedQuery.userEmail;
	var userEmail2 = parsedQuery.userEmail2;

	if(debug){
		console.log('***********************');
		console.log('[/user] GET');
		console.log('userEmail = ' + userEmail);
		console.log('userEmail2 = ' + userEmail2);
	}

	if(!userEmail2){

		var idFound = userFindByEmail(userEmail);

		if(idFound){
			if(debug){
				console.log('<USER FOUND>');
				console.log('{\"userProfileImage\" : \"' + idFound.profile_pic_url + '\", \"userEmail\" : \"' + userEmail + '\", \"introduceText\" : \"' + idFound.intro + '\"}');
				console.log('***********************');
			}

			res.writeHead(200, headerContent);
	    	res.write('{\"userProfileImage\" : \"' + idFound.profile_pic_url + '\", \"userEmail\" : \"' + userEmail + '\", \"introduceText\" : \"' + idFound.intro + '\"}');
	    	res.end();
		}
		else{

			if(debug){
				console.log('USER E-MAIL NOT FOUND');
				console.log('***********************');
			}

			res.writeHead(404, headerContent);
	    	res.write('User e-mail not found');
	    	res.end();
		}
	}
	else{
		var idFound = userFindByEmail(userEmail);

		if(idFound){

			var following = isFollowing(idFound, userEmail2);

			if(following){

				if(debug){
					console.log('<Following True>');
					console.log('***********************');
				}

				res.writeHead(200, headerContent);
	    		res.write('{ \"isFollow\" : true }');
	    		res.end();

			}
			else{

				if(debug){
					console.log('<Following False>');
					console.log('***********************');
				}

				res.writeHead(200, headerContent);
	    		res.write('{ \"isFollow\" : false }');
	    		res.end();

			}

		}
		else{

			if(debug){
				console.log('USER E-MAIL NOT FOUND');
				console.log('***********************');
			}

			res.writeHead(404, headerContent);
	    	res.write('userEmail is not found');
	    	res.end();
		}

	}


});

app.get('/userFilter', function (req, res) {

	var parsedUrl = url.parse(req.url);
	var parsedQuery = querystring.parse(parsedUrl.query,'&','=');

	var userEmail = parsedQuery.userEmail;

	if(debug){
		console.log('***********************');
		console.log('[/userFilter] GET');
		console.log('userEmail = ' + userEmail);
	}

	var idFound = userEmailFilter(userEmail);

	if(idFound && userEmail.length > 0){

		var json = '{\"num\":' + idFound.length + ', \"result\" : [';

		idFound.forEach((u) =>
			json = json + '\"' + u.login_id + '\", '
    	)

		if(idFound.length > 0){
    		json = json.substring(0, json.length-2) + ']}';
    	}
    	else{
    		json = json + ']}';
    	}

    	if(debug){
    		console.log('<FILTER SUCCESS>');
    		console.log(json);
    		console.log('***********************');
    	}

    	res.writeHead(200, headerContent);
	    res.write(json);
	    res.end();

	}
	else{

		if(debug){
			console.log('USER E-MAIL NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
    	res.write('[]');
    	res.end();
	}


});

app.post('/follow', function (req, res) {

	var userEmail1 = req.body.userEmail1;
	var userEmail2 = req.body.userEmail2;

	if(debug){
		console.log('***********************');
		console.log('[/follow] POST');
		console.log('userEmail1 = ' + userEmail1);
		console.log('userEmail2 = ' + userEmail2);
	}

	if(!isFollowing(userEmail1, userEmail2)){

		follow(userEmail1, userEmail2);

		if(debug){
			console.log('<Following SUCCESS>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();


	}
	else{

		if(debug){
			console.log('user1 is already following user2');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('user1 is already following user2');
    	res.end();
	}

});

app.post('/unfollow', function (req, res) {

	var userEmail1 = req.body.userEmail1;
	var userEmail2 = req.body.userEmail2;

	if(debug){
		console.log('***********************');
		console.log('[/unfollow] POST');
		console.log('userEmail1 = ' + userEmail1);
		console.log('userEmail2 = ' + userEmail2);
	}

	if(isFollowing(userEmail1, userEmail2)){

		unfollow(userEmail1, userEmail2);

		if(debug){
			console.log('<Unfollowing SUCCESS>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();


	}
	else{

		if(debug){
			console.log('user1 is not following user2');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('user1 is not following user2');
    	res.end();
	}

});

app.get('/pet', function (req, res) {

	var parsedUrl = url.parse(req.url);
	var parsedQuery = querystring.parse(parsedUrl.query,'&','=');

	var pet_id = parsedQuery.id;

	if(debug){
		console.log('***********************');
		console.log('[/pet] GET');
		console.log('id = ' + pet_id);
	}

	var idFound = petFindById(pet_id);

	if(idFound){

		if(debug){
			console.log('<PET FOUND>');
			console.log('{\"petProfileImage\" : \"' + idFound.profile_pic_url + '\", \"petName\" : \"' + idFound.pet_name + '\"}');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
    	res.write('{\"petProfileImage\" : \"' + idFound.profile_pic_url + '\", \"petName\" : \"' + idFound.pet_name + '\"}');
    	res.end();
	}
	else{

		if(debug){
			console.log('PET NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('The pet is not found');
    	res.end();
	}


});

app.post('/pet', upload.single('petProfileImage'),function (req, res) {

	var petName = req.body.petName;
	var petProfileImage = req.file;
	var petBirthDay = req.body.petBirthDay;
	var introduceText = req.body.introduceText;
	var owner = req.body.owner;

	if(debug){
		console.log('***********************');
		console.log('[/pet] POST');
		console.log('petName = ' + petName);
		console.log('owner = ' + owner);
		console.log('petProfileImage = ' + petProfileImage);
		console.log('petBirthDay = ' + petBirthDay);
		console.log('introduceText = ' + introduceText);
	}

	if(petName && owner){

		var u = ownerExist(owner);

		if(u){

			var p = new pet();
			p.pet_name = petName;
			p.owners.push(owner);

			if(petProfileImage)
				p.profile_pic_url = petProfileImage;
			if(petBirthDay)
				p.pet_birthday = petBirthDay;
			if(introduceText)
				p.intro = introduceText;

			addPet(owner, p);

			if(debug){
				console.log('<PET CREATED>');
				console.log('{\"pet_id\" : ' + p.pet_id + ', \"success\" : true }');
				console.log('***********************');
			}

			res.writeHead(200, headerContent);
		    res.write('{\"pet_id\" : ' + p.pet_id + ', \"success\" : true }');
		    res.end();
		}
		else{

			if(debug){
				console.log('PET NOT FOUND(Invalid owner email)');
				console.log('***********************');
			}

			res.writeHead(404, headerContent);
	    	res.write('Invalid owner e-mail');
	    	res.end();
		}

	}
	else{

		if(debug){
			console.log('PET NOT FOUND(Insufficent datum provided(petName & owner))');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('Insufficent datum provided(petName & owner)');
    	res.end();
	}

});

app.get('/pet/:pet_id', function (req, res) {

	var pet_id = req.params.pet_id;

	if(debug){
		console.log('***********************');
		console.log('[/pet/:pet_id] GET');
		console.log('pet_id = ' + pet_id);
	}

	if(isPetExist(pet_id)){

		var thePet = petFindById(pet_id);

		if(debug){
			console.log('<PET FOUND>');
			console.log('{\"id\" : ' + thePet.pet_id + ', ' +
    			   '\"petName\" : \"' + thePet.pet_name + '\", ' +
    			   '\"petProfileImage\" : \"' + thePet.profile_pic_url + '\", ' +
    			   '\"petBirthDay\" : \"' + thePet.pet_birthday + '\", ' +
    			   '\"introduceText\" : \"' + thePet.intro + '\", ' +
    			   '\"owner\" : \"' + arrayToString(thePet.owners) + '\"}');
			console.log('***********************');
		}


		res.writeHead(200, headerContent);
    	res.write('{\"id\" : ' + thePet.pet_id + ', ' +
    			   '\"petName\" : \"' + thePet.pet_name + '\", ' +
    			   '\"petProfileImage\" : \"' + thePet.profile_pic_url + '\", ' +
    			   '\"petBirthDay\" : \"' + thePet.pet_birthday + '\", ' +
    			   '\"introduceText\" : \"' + thePet.intro + '\", ' +
    			   '\"owner\" : \"' + arrayToString(thePet.owners) + '\"}');
    	res.end();
	}
	else{

		if(debug){
			console.log('PET NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No pet is found');
    	res.end();
	}


});

app.put('/pet/:pet_id', function (req, res) {

	var pet_id = req.params.pet_id;

	if(debug){
		console.log('***********************');
		console.log('[/pet/:pet_id] PUT');
		console.log('pet_id = ' + pet_id);
	}

	if(isPetExist(pet_id)){

		var pet_name = req.body.petName;
		var profile_pic_url = req.body.petProfileImage;
		var intro = req.body.introduceText;
		var pet_birthday = req.body.petBirthDay;

		modifyPet(pet_id, pet_name, profile_pic_url, intro, pet_birthday);

		if(debug){
			console.log('<PET MODIFIED>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();
	}
	else{

		if(debug){
			console.log('PET NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No pet is found');
    	res.end();
	}


});

app.post('/pet/addOwner/:pet_id', function (req, res) {

	var pet_id = req.params.pet_id;

	if(debug){
		console.log('***********************');
		console.log('[/pet/addOwner/:pet_id] POST');
		console.log('pet_id = ' + pet_id);
	}

	if(isPetExist(pet_id)){

		var newOwnerEmail = req.body.newOwner;

		if(userFindByEmail(newOwnerEmail)){

			petOwnerAdd(pet_id, newOwnerEmail);

			if(debug){
				console.log('newOwner = ' + newOwnerEmail);
				console.log('<PET OWNER ADDED>');
				console.log('***********************');
			}

			res.writeHead(200, headerContent);
		    res.write('{ \"success\" : true }');
		    res.end();
		}
		else{

			if(debug){
				console.log('newOwner= = ' + newOwnerEmail);
				console.log('NEW OWNER NOT FOUND');
				console.log('***********************');
			}

			res.writeHead(404, headerContent);
	    	res.write('New owner is not found');
	    	res.end();

		}
	}
	else{

		if(debug){
			console.log('PET NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No pet is found');
    	res.end();
	}


});

app.delete('/pet/deleteOwner/:pet_id', function (req, res) {

	var pet_id = req.params.pet_id;

	if(debug){
		console.log('***********************');
		console.log('[/pet/addOwner/:pet_id] POST');
		console.log('pet_id = ' + pet_id);
	}

	if(isPetExist(pet_id)){

		var oldOwnerEmail = req.body.oldOwner;

		if(userFindByEmail(oldOwnerEmail)){

			petOwnerDelete(pet_id, oldOwnerEmail);

			if(debug){
				console.log('oldOwner = ' + oldOwnerEmail);
				console.log('<PET OWNER DELETED>');
				console.log('***********************');
			}

			res.writeHead(200, headerContent);
		    res.write('{ \"success\" : true }');
		    res.end();
		}
		else{

			if(debug){
				console.log('oldOwner = ' + oldOwnerEmail);
				console.log('OLD OWNER NOT FOUND');
				console.log('***********************');
			}

			res.writeHead(404, headerContent);
	    	res.write('Old owner is not found');
	    	res.end();

		}
	}
	else{

		if(debug){
			console.log('PET NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No pet is found');
    	res.end();
	}


});

app.delete('/pet/:pet_id', function (req, res) {

	var pet_id = req.params.pet_id;

	var u = petFindById(pet_id);

	if(debug){
		console.log('***********************');
		console.log('[/pet/:pet_id] DELETE');
		console.log('pet_id = ' + pet_id);
	}

	if(u){

		deletePet(pet_id);

		if(debug){
			console.log('<PET DELETED>');
			console.log('***********************');
		}

	    res.writeHead(200, headerContent);
	    res.write('{\"success\" : true}');
	    res.end();
	}
	else{

		if(debug){
			console.log('PET NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No pet is found');
    	res.end();
	}

});

app.get('/userPet/:userEmail', function (req, res) {

	var login_id = req.params.userEmail;

	if(debug){
		console.log('***********************');
		console.log('[/userPet/:userEmail] POST');
		console.log('userEmail = ' + login_id);
	}

	var idFound = userFindByEmail(login_id);

	if(idFound){

		var json = '{\"pets\" : [';

		var petFound = userPetArray(idFound);

		petFound.forEach((p) =>

			json = json + '{ \"petProfileImage\" : \"' + p.profile_pic_url + '\",' +
							'\"petName\" : \"' +  p.pet_name + '\", ' +
							'\"id\" : ' +  p.pet_id + ', ' +
							'\"petBirthDay\" : \"' +  p.pet_birthday + '\", ' +
							'\"introduceText\" : \"' +  p.intro + '\", ' +
							'\"owners\" : \"' +  arrayToString(p.owners) + '\" },'
    	)

		if(petFound.length > 0){
    		json = json.substring(0, json.length-1) + ']}';
    	}
    	else{
    		json = json + ']}';
    	}

    	if(debug){
			console.log('<USER\'S PET FOUND>');
			console.log(json);
			console.log('***********************');
		}

    	res.writeHead(200, headerContent);
	    res.write(json);
	    res.end();

	}
	else{

		if(debug){
			console.log('NO USER FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No user is found');
    	res.end();
	}

});

app.post('/card', upload.array('file',3), function (req, res) {

	var videos = req.body.video;
	var tags = req.body.tag;
	var title = req.body.title;
	var text = req.body.text;
	var location = req.body.location;
	var pet_id = req.body.pet_id;
	var date = req.body.date;
	var writer = authToEmail(req.headers.authorization);

	var pictures = req.files;
	console.log(pictures,'pictures');
	if(debug){
		console.log('***********************');
		console.log('[/card] POST');
		console.log('title = ' + title);
		console.log('pet_id = ' + pet_id);
		console.log('text = ' + text);
		console.log('pictures = ' + pictures);
		console.log('video = ' + videos);
		console.log('tag = ' + tags);
		console.log('writer = ' + writer);
	}

	if(title){

		var c = new card(pet_id);
		c.title = title;
		c.text = text;
		c.location = location;
		c.date = date;
		c.writer = writer;
		c.picture_id = pictures;

		//TODO tag & picture & video save

		addCard(c);

		if(debug){
			console.log('<CARD CREATED>');
			console.log('{\"card_id\" : ' + c.card_id + ', \"success\" : true }');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{\"card_id\" : ' + c.card_id + ', \"success\" : true }');
	    res.end();

	}
	else{

		if(debug){
			console.log('TITLE NOT PROVIDED');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('Title is not provided');
    	res.end();
	}

});

app.get('/card', function (req, res) {

	if(debug){
		console.log('***********************');
		console.log('[/card] GET');
	}

	var cardsJson = '[';

	cards.forEach((c) => {


		var commentjson = '[';

		c.comment_id.forEach((c_i) => {

			var theComment = comments.find((cc) => cc.comment_id == c_i);

			commentjson = commentjson + '{\"id\" : ' + theComment.comment_id + ', ' +
    			   '\"text\" : \"' + theComment.text + '\", ' +
    			   '\"date\" : \"' + theComment.date + '\", ' +
    			   '\"userEmail\" : \"' + theComment.user_email + '\", ' +
    			   '\"card_id\" : \"' + theComment.card_id + '\"}, ';

		});

		if(c.comment_id > 0){
			commentjson = commentjson.substring(0, commentjson.length-2) + ']';
		}
		else{
			commentjson = '[]';
		}


		var picturejson = '[';

		c.picture_id.forEach((p_i) => {
            console.log(p_i.path, "p_i.path");
    picturejson = picturejson + '{\"picture_url\" : \"' + p_i.destination.substring(11,22)+"/"+p_i.filename + '\", ' +
        '\"card_id\" : \"' + c.card_id + '\"}, ';
    	console.log(p_i.path, "p_i.path");
		});
		console.log(picturejson,"picturejson");
		if(c.picture_id.length>0){
			picturejson = picturejson.substring(0, picturejson.length-2) + ']';
		}
		else{
			picturejson = '[]';
		}


		var thePet = pets.find((p) => p.pet_id = c.pet_id);

		var petjson = '{\"id\" : ' + thePet.pet_id + ', ' +
    			   '\"petName\" : \"' + thePet.pet_name + '\", ' +
    			   '\"petProfileImage\" : \"' + thePet.profile_pic_url + '\", ' +
    			   '\"petBirthDay\" : \"' + thePet.pet_birthday + '\", ' +
    			   '\"introduceText\" : \"' + thePet.intro + '\", ' +
    			   '\"owner\" : \"' + arrayToString(thePet.owners) + '\"}';
		if(debug){
			console.log('{\"id\" : ' + c.card_id + ', ' +
	    			   '\"title\" : \"' + c.title + '\", ' +
	    			   '\"text\" : \"' + c.text + '\", ' +
	    			   '\"date\" : \"' + c.date + '\", ' +
	    			   '\"tag_id\" : ' + arrayToString(c.tag_id) + ', ' +
	    			   '\"comments\" : ' + commentjson + ', ' +
	    			   '\"video_id\" : ' + arrayToString(c.video_id) + ', ' +
	    			   '\"pictures\" : ' + picturejson + ', ' +
	    			   '\"pet_id\" : ' + petjson + ', ' +
	    			   '\"writer\" : \"' + c.writer + '\", ' +
	    			   '\"date\" : \"' + c.date + '\", ' +
	    			   '\"location\" : \"' + c.location + '\"}');
			console.log('***********************');
		}

		cardsJson = cardsJson + '{\"id\" : ' + c.card_id + ', ' +
	    			   '\"title\" : \"' + c.title + '\", ' +
	    			   '\"text\" : \"' + c.text + '\", ' +
	    			   '\"date\" : \"' + c.date + '\", ' +
	    			   '\"tag_id\" : ' + arrayToString(c.tag_id) + ', ' +
	    			   '\"comments\" : ' + commentjson + ', ' +
	    			   '\"video_id\" : ' + arrayToString(c.video_id) + ', ' +
	    			   '\"pictures\" : ' + picturejson + ', ' +
	    			   '\"pet_id\" : ' + petjson + ', ' +
	    			   '\"writer\" : \"' + c.writer + '\", ' +
	    			   '\"date\" : \"' + c.date + '\", ' +
	    			   '\"location\" : \"' + c.location + '\"},';

	});

	if(cards.length > 0){

		cardsJson = cardsJson.substring(0, cardsJson.length-1) + ']';

		res.writeHead(200, headerContent);
		res.write(cardsJson);
		res.end();
	}
	else{
		res.writeHead(200, headerContent);
		res.write('[]');
		res.end();
	}

});

app.get('/card/:card_id', function (req, res) {

	var card_id = req.params.card_id;

	if(debug){
		console.log('***********************');
		console.log('[/card/:card_id] GET');
		console.log('card_id = ' + card_id);
	}

	var theCard = cardFindById(card_id);

	if(theCard){

		var commentjson = '[';
		console.log(theCard.comment_id,"comment_ids");
		theCard.comment_id.forEach((c_i) => {

			var theComment = comments.find((cc) => cc.comment_id == c_i);
			console.log(theComment, "theComment");
			commentjson = commentjson + '{\"id\" : ' + theComment.comment_id + ', ' +
    			   '\"text\" : \"' + theComment.text + '\", ' +
    			   '\"date\" : \"' + theComment.date + '\", ' +
    			   '\"userEmail\" : \"' + theComment.user_email + '\", ' +
    			   '\"card_id\" : \"' + theComment.card_id + '\"}, ';
        console.log(commentjson,'commentjson');
    });


		if(theCard.comment_id.length!==0){
			commentjson = commentjson.substring(0, commentjson.length-2) + ']';
			console.log(commentjson,'commentjsonfinal');
		}
		else{
			commentjson = '[]';
		}
        var picturejson = '[';

        theCard.picture_id.forEach((p_i) => {
            picturejson = picturejson + '{\"picture_url\" : \"' + p_i.destination.substring(11,22)+"/"+p_i.filename + '\", ' +
            '\"card_id\" : \"' + theCard.card_id + '\"}, ';
    });

        if(theCard.picture_id.length>0){
            picturejson = picturejson.substring(0, picturejson.length-2) + ']';
        }
        else{
            picturejson = '[]';
        }

        var likejson = [];
        theCard.like_id.forEach((p_i) => {
			console.log("add like",p_i);
            var theLike = likes.find((p) => p.like_id == p_i);
            console.log("like",theLike.user_email);
            likejson.push(theLike.user_email);
    });
        console.log(likejson,"likejson");

		var thePet = pets.find((p) => p.pet_id = theCard.pet_id);

		var petjson = '{\"id\" : ' + thePet.pet_id + ', ' +
    			   '\"petName\" : \"' + thePet.pet_name + '\", ' +
    			   '\"petProfileImage\" : \"' + thePet.profile_pic_url + '\", ' +
    			   '\"petBirthDay\" : \"' + thePet.pet_birthday + '\", ' +
    			   '\"introduceText\" : \"' + thePet.intro + '\", ' +
    			   '\"owner\" : ' + arrayToString(thePet.owners) + '}';
		if(debug){
			console.log('<CARD FOUND>');
			console.log('{\"id\" : ' + theCard.card_id + ', ' +
    			   '\"title\" : \"' + theCard.title + '\", ' +
    			   '\"text\" : \"' + theCard.text + '\", ' +
    			   '\"date\" : \"' + theCard.date + '\", ' +
    			   '\"tag_id\" : ' + arrayToString(theCard.tag_id) + ', ' +
    			   '\"comments\" : ' + commentjson + ', ' +
    			   '\"video_id\" : ' + arrayToString(theCard.video_id) + ', ' +
    			   '\"pictures\" : ' + picturejson + ', ' +
    			   '\"pet_id\" : ' + petjson + ', ' +
                	'\"like_id\" : ' + arrayToString(likejson)+ ', ' +
    			   '\"writer\" : \"' + theCard.writer + '\", ' +
    			   '\"date\" : \"' + theCard.date + '\", ' +
    			   '\"location\" : \"' + theCard.location + '\"}');
			console.log('***********************');
		}


		res.writeHead(200, headerContent);
    	res.write('{\"id\" : ' + theCard.card_id + ', ' +
    			   '\"title\" : \"' + theCard.title + '\", ' +
    			   '\"text\" : \"' + theCard.text + '\", ' +
    			   '\"date\" : \"' + theCard.date + '\", ' +
    			   '\"tag_id\" : ' + arrayToString(theCard.tag_id) + ', ' +
    			   '\"comments\" : ' + commentjson + ', ' +
    			   '\"video_id\" : ' + arrayToString(theCard.video_id) + ', ' +
    			   '\"pictures\" : ' + picturejson + ', ' +
         		   '\"like_id\" : ' + arrayToString(likejson)+ ', ' +
    			   '\"pet_id\" : ' + petjson + ', ' +
    			   '\"writer\" : \"' + theCard.writer + '\", ' +
    			   '\"date\" : \"' + theCard.date + '\", ' +
    			   '\"location\" : \"' + theCard.location + '\"}');
    	res.end();
	}
	else{

		if(debug){
			console.log('CARD NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No card is found');
    	res.end();
	}


});

app.put('/card/:card_id', function (req, res) {

	var card_id = req.params.card_id;

	if(debug){
		console.log('***********************');
		console.log('[/card/:card_id] PUT');
		console.log('card_id = ' + card_id);
	}

	var theCard = cardFindById(card_id);

	if(theCard){

		var title = req.body.title;
		var text = req.body.text;
		var tag_id = req.body.tag;
		var picture_id = req.body.picture;
		var video_id = req.body.video;
		var location = req.body.location;

		//TODO tag & picture & video modifying

		modifyCard(card_id, location, title, text, tag_id, picture_id, video_id);

		if(debug){
			console.log('<CARD MODIFIED>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();
	}
	else{

		if(debug){
			console.log('CARD NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No card is found');
    	res.end();
	}


});

app.delete('/card/:card_id', function (req, res) {

	var card_id = req.params.card_id;

	if(debug){
		console.log('***********************');
		console.log('[/card/:card_id] DELETE');
		console.log('card_id = ' + card_id);
	}

	var theCard = cardFindById(card_id);

	if(theCard){

		deleteCard(card_id);

		if(debug){
			console.log('<CARD DELETED>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();
	}
	else{

		if(debug){
			console.log('CARD NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No card is found');
    	res.end();
	}


});

app.post('/comment', function (req, res) {

	var text = req.body.text;
    console.log(req.headers.authorization,"author");
	var user_email = authToEmail(req.headers.authorization);
	var card_id = req.body.cardId;

	if(debug){
		console.log('***********************');
		console.log('[/comment] POST');
		console.log('text = ' + text);
		console.log('userEmail = ' + user_email);
		console.log('cardId = ' + card_id);
	}

	if(user_email && card_id!==undefined && text){

		var c = new comment(card_id);
		c.text = text;
		c.user_email = user_email;

		addComment(c);

		if(debug){
			console.log('<COMMENT CREATED>');
			console.log('{\"comment_id\" : ' + c.comment_id + ', \"success\" : true }');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{\"comment_id\" : ' + c.comment_id + ', \"success\" : true }');
	    res.end();

	}
	else{

		if(debug){
			console.log('Insufficent datum provided');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('Insufficent datum provided');
    	res.end();
	}

});

app.get('/comment/:comment_id', function (req, res) {

	var comment_id = req.params.comment_id;

	if(debug){
		console.log('***********************');
		console.log('[/comment/:comment_id] GET');
		console.log('comment_id = ' + comment_id);
	}

	var theComment = commentFindById(comment_id);

	if(theComment){

		if(debug){
			console.log('<COMMENT FOUND>');
			console.log('{\"id\" : ' + theComment.comment_id + ', ' +
    			   '\"text\" : \"' + theComment.text + '\", ' +
    			   '\"date\" : \"' + theComment.date + '\", ' +
    			   '\"userEmail\" : \"' + theComment.user_email + '\", ' +
    			   '\"card_id\" : \"' + theComment.card_id + '\"}');
			console.log('***********************');
		}


		res.writeHead(200, headerContent);
    	res.write('{\"id\" : ' + theComment.comment_id + ', ' +
    			   '\"text\" : \"' + theComment.text + '\", ' +
    			   '\"date\" : \"' + theComment.date + '\", ' +
    			   '\"userEmail\" : \"' + theComment.user_email + '\", ' +
    			   '\"card_id\" : \"' + theComment.card_id + '\"}');
    	res.end();
	}
	else{

		if(debug){
			console.log('COMMENT NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No comment is found');
    	res.end();
	}


});

app.put('/comment/:comment_id', function (req, res) {

	var comment_id = req.params.comment_id;

	if(debug){
		console.log('***********************');
		console.log('[/comment/:comment_id] PUT');
		console.log('comment_id = ' + comment_id);
	}

	var theComment = commentFindById(comment_id);

	if(theComment){

		var text = req.body.text;
		var userEmail = req.body.userEmail;
		var card_id = req.body.card_id;

		modifyComment(card_id, text);

		if(debug){
			console.log('<COMMENT MODIFIED>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();
	}
	else{

		if(debug){
			console.log('COMMENT NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No comment is found');
    	res.end();
	}


});

app.delete('/comment/:comment_id', function (req, res) {

	var comment_id = req.params.comment_id;

	if(debug){
		console.log('***********************');
		console.log('[/comment/:comment_id] DELETE');
		console.log('comment_id = ' + comment_id);
	}

	var theComment = commentFindById(comment_id);

	if(theComment){

		deleteComment(comment_id);

		if(debug){
			console.log('<COMMENT DELETED>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();
	}
	else{

		if(debug){
			console.log('COMMENT NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No comment is found');
    	res.end();
	}


});


app.post('/memo', function (req, res) {

	var text = req.body.text;
	console.log("aasdfasdf");
    console.log(req.headers.authorization,"author");
	var user_email = authToEmail(req.headers.authorization);
	var date = req.body.date;

	if(debug){
		console.log('***********************');
		console.log('[/memo] POST');
		console.log('text = ' + text);
		console.log('userEmail = ' + user_email);
		console.log('date = ' + date);
	}

	if(user_email && text){

		var m = new memo(user_email);
		m.text = text;
		m.date = date;

		addMemo(m);

		if(debug){
			console.log('<MEMO CREATED>');
			console.log('{\"memo_id\" : ' + m.memo_id + ', \"success\" : true }');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{\"memo_id\" : ' + m.memo_id + ', \"success\" : true }');
	    res.end();

	}
	else{

		if(debug){
			console.log('Insufficent datum provided');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('Insufficent datum provided');
    	res.end();
	}

});

app.get('/memo', function (req, res) {

	var auth = req.headers.authorization;

	if(debug){
		console.log('***********************');
		console.log('[/memo] GET');
		console.log('auth = ' + auth);
	}

	var userEmail = authToEmail(auth);

	if(userEmail){

		if(debug){
			console.log('<Authorization SUCCESS>');
			console.log('userEmail = ' + userEmail);
		}

		var u = userFindByEmail(userEmail);
		var m;

		var memosJson = '[';

		u.memo_id.forEach((m_i) => {

			m = memoFindById(m_i);

			memosJson = memosJson + '{\"id\" : ' + m.memo_id + ', ' +
    			   '\"text\" : \"' + m.text + '\", ' +
    			   '\"date\" : \"' + m.date + '\", ' +
    			   '\"userEmail\" : \"' + m.user_email + '\"}, ';

		});

		if(u.memo_id.length > 0){
			memosJson = memosJson.substring(0,memosJson.length-2) +']';
		}
		else{
			memosJson = '[]';
		}

		if(debug){
			console.log('<MEMO FOUND>');
			console.log(memosJson);
			console.log('***********************');
		}

		if(u.memo_id.length > 0){

			memosJson = memosJson.substring(0, memosJson.length-1) + ']';

			res.writeHead(200, headerContent);
	    	res.write(memosJson);
	    	res.end();
	    }
	    else{

	    	res.writeHead(200, headerContent);
	    	res.write('[]');
	    	res.end();
	    }
	}
	else{

		if(debug){
			console.log('Authorization error');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('Authorization error');
    	res.end();
	}


});

app.get('/memo/:memo_id', function (req, res) {

	var memo_id = req.params.memo_id;

	if(debug){
		console.log('***********************');
		console.log('[/memo/:comment_id] GET');
		console.log('memo_id = ' + memo_id);
	}

	var theMemo = memoFindById(memo_id);

	if(theMemo){

		if(debug){
			console.log('<MEMO FOUND>');
			console.log('{\"id\" : ' + theMemo.memo_id + ', ' +
    			   '\"text\" : \"' + theMemo.text + '\", ' +
    			   '\"date\" : \"' + theMemo.date + '\", ' +
    			   '\"userEmail\" : \"' + theMemo.user_email + '\"}');
			console.log('***********************');
		}


		res.writeHead(200, headerContent);
    	res.write('{\"id\" : ' + theMemo.memo_id + ', ' +
    			   '\"text\" : \"' + theMemo.text + '\", ' +
    			   '\"date\" : \"' + theMemo.date + '\", ' +
    			   '\"userEmail\" : \"' + theMemo.user_email + '\", ' +
    			   '\"pet_id\" : \"' + theMemo.pet_id + '\"}');
    	res.end();
	}
	else{

		if(debug){
			console.log('MEMO NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No memo is found');
    	res.end();
	}


});

app.put('/memo/:memo_id', function (req, res) {

	var memo_id = req.params.memo_id;

	if(debug){
		console.log('***********************');
		console.log('[/memo/:memo_id] PUT');
		console.log('memo_id = ' + memo_id);
	}

	var theMemo = memoFindById(memo_id);

	if(theComment){

		var text = req.body.text;
		var date = req.body.date;

		modifyMemo(memo_id, text, date);

		if(debug){
			console.log('<MEMO MODIFIED>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();
	}
	else{

		if(debug){
			console.log('MEMO NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No memo is found');
    	res.end();
	}


});

app.delete('/memo/:memo_id', function (req, res) {

	var memo_id = req.params.memo_id;

	if(debug){
		console.log('***********************');
		console.log('[/memo/:memo_id] DELETE');
		console.log('memo_id = ' + memo_id);
	}

	var theMemo = memoFindById(memo_id);

	if(theMemo){

		deleteMemo(memo_id);

		if(debug){
			console.log('<MEMO DELETED>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();
	}
	else{

		if(debug){
			console.log('memo NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No memo is found');
    	res.end();
	}


});

app.post('/like', function (req, res) {

	var card_id = req.body.card_id;
	var user_email = authToEmail(req.headers.authorization);

	if(debug){
		console.log('***********************');
		console.log('[/like] POST');
		console.log('userEmail = ' + user_email);
	}

	if(user_email && card_id!==undefined){

		var l = new like(card_id);
		l.user_email = user_email;
        var User = users.find((c) => c.login_id == l.user_email)
		User.like_id.push(l.like_id);
		addLike(l);

		if(debug){
			console.log('<LIKE CREATED>');
			console.log('{\"like_id\" : ' + l.like_id + ', \"success\" : true }');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{\"like_id\" : ' + l.like_id + ', \"success\" : true }');
	    res.end();

	}
	else{

		if(debug){
			console.log('Insufficent datum provided');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('Insufficent datum provided');
    	res.end();
	}

});

app.delete('/like/:card_id', function (req, res) {

	var card_id = req.params.card_id;
	var user_email = authToEmail(req.headers.authorization);

	if(debug){
		console.log('***********************');
		console.log('[/like/:card_id] DELETE');
		console.log('card_id = ' + card_id);
	}

	var theCard = cardFindById(card_id)
	var theUser = userFindByEmail(user_email);

	var like_id = _.intersection(theCard.like_id,theUser.like_id);;
	console.log(like_id,"like_id");
    console.log(theCard.like_id,"like_id");
    console.log(theUser.like_id,"like_id");
	var theLike = likeFindById(like_id[0]);

	if(theLike){

		deleteLike(like_id);

		if(debug){
			console.log('<LIKE DELETED>');
			console.log('***********************');
		}

		res.writeHead(200, headerContent);
	    res.write('{ \"success\" : true }');
	    res.end();
	}
	else{

		if(debug){
			console.log('LIKE NOT FOUND');
			console.log('***********************');
		}

		res.writeHead(404, headerContent);
    	res.write('No like is found');
    	res.end();
	}


});

app.listen(port, function (){
	console.log('PetStagram listening on port ' + port);
	if(sampleDB){
		dev_init();
	}
});



// Password Encryption
function SHA256(s){

        var chrsz   = 8;
        var hexcase = 0;

        function safe_add (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
        function R (X, n) { return ( X >>> n ); }
        function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
        function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
        function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
        function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
        function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
        function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

        function core_sha256 (m, l) {

            var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
                0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
                0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
                0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
                0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
                0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
                0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
                0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
                0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
                0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
                0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

            var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

            var W = new Array(64);
            var a, b, c, d, e, f, g, h, i, j;
            var T1, T2;

            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;

            for ( var i = 0; i<m.length; i+=16 ) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];

                for ( var j = 0; j<64; j++) {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }

                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }

        function str2binb (str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for(var i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
            }
            return bin;
        }

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }

        function binb2hex (binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for(var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
            }
            return str;
        }

        s = Utf8Encode(s);
        return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

}

function arrayToString(arr){

	if(arr.length > 0){

		var str = '[';

		arr.forEach((e) => {
			str = str + '\"' + e + '\",';
		});

		return str.substring(0, str.length-1) + ']';
	}
	else{
		return '[]';
	}

}

function authToEmail(auth){

	var emailAuth = auth.substring(6).split('.')[0];

	return Buffer.from(emailAuth, 'base64').toString('ascii');

}

function isSaved(upFile) {

    var savedFile = upFile;
    var count = 0;
    if(savedFile != null) {
        for (var i = 0; i < savedFile.length; i++) {
            if(fs.statSync(getDirname(1) + savedFile[i].path).isFile()){
            	if(debug){
            		console.log(getDirname(1) + savedFile[i].path);
            	}
                count ++;
            };
        }
        if(count == savedFile.length){
            return true;
        }else{
            return false;
        }
    }else{
        return true;
    }
}

function getDirname(num){
    var order = num;
    var dirname = __dirname.split('/');
    var result = '';
    for(var i=0;i<dirname.length-order;i++){
        result += dirname[i] + '/';
    }
    return result;
}

 function renameUploadFile(itemId,upFile){
    var renameForUpload = {};
    var newFile = upFile; // 새로 들어 온 파일
    var tmpPath = [];
    var tmpType = [];
    var index = [];
    var rename = [];
    var fileName = [];
    var fullName = []; // 다운로드 시 보여줄 이름 필요하니까 원래 이름까지 같이 저장하자!
    var fsName = [];
    for (var i = 0; i < newFile.length; i++) {
        tmpPath[i] = newFile[i].path;
        tmpType[i] = newFile[i].mimetype.split('/')[1]; // 확장자 저장해주려고!
        index[i] = tmpPath[i].split('/').length;
        rename[i] = tmpPath[i].split('/')[index[i] - 1];
        fileName [i] = itemId + "_" + getFileDate(new Date()) + "_" + rename[i] + "." + tmpType[i]; // 파일 확장자 명까지 같이 가는 이름 "글아이디_날짜_파일명.확장자"
        fullName [i] = fileName[i] + ":" + newFile[i].originalname.split('.')[0]; // 원래 이름까지 같이 가는 이름 "글아이디_날짜_파일명.확장자:보여줄 이름"
        fsName [i] = getDirname(1)+"upload/"+fileName[i]; // fs.rename 용 이름 "./upload/글아이디_날짜_파일명.확장자"
    }
    renameForUpload.tmpname = tmpPath;
    renameForUpload.filename = fileName;
    renameForUpload.fullname = fullName;
    renameForUpload.fsname = fsName;
    return renameForUpload;
}

