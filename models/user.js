var mongodb = require('./db');

//定義User物件
function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback) {
    // user data
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };

    //open DB connection
    mongodb.open(function(err, db) {
        if (err) {
            //回傳error
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            //insert User data
            collection.insert(user, {
                safe: true
            }, function(err, user) {
            	mongodb.close();
            	if(err){
            		return callback(err);
            	}
            	//console.log("result[0]:", user);
            	callback(null, user.ops[0]);
            });
        });
    });
};

//讀取User資料
User.get = function(name , callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//查詢user by Name
			collection.findOne({name: name}, function(err, user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, user);
			});
		});
	});
};
