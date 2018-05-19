# login-storage
Auto create your own login (or other) form, memorize and manage data into localStorage

## methods
* LoginStorage                    => returns all: class, methods, properties and data 
* LoginStorage.show()             => shows login input form
* LoginStorage.hide()             => hides login input form
* LoginStorage.onclick(callback)  => returns data

## html example
```html
<!doctype html>
<html>
  <head>
    <title>Login Storage</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <script src='login-storage/login-storage.js'></script>
  </head>
  <body>
  </body>
  <script>
    var timeout = 1000*60*60;
    var loginData = {
      title: "Login",
      inputs: [
                {
                    text: "Username",
                    storeName: "username",
                    placeholder: "placeholder text",
                    validate: /^(\w+\.\w+)$/,
                    message: "3 characters, 1 dot"
                },
                {
                    text: "Password",
                    type: "password",
                    store: false,
                    placeholder: "placeholder text",
                    encoder: md5, //it's just an example (md5.js can be downloaded on github)
                    validate: /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*.])[\w!@#$%^&*.]{8,}$/,
                    message: "Strong password: 8 characters"
                }
            ],
        button: {
            text: "Submit"
        }
      }
      //Instantiate new LoginStorage
      var login = new LoginStorage(loginData, timeout);
        //Get data from localStorage if exists, otherwise returns false
        console.log(login.data);
        //Listen if sumbit button is pressed
        login.onclick(function(data){
          //Get data from input form
          console.log(data);
          //Hide login form
          login.hide();
        })

  </script>
</html>
```

That's it.
