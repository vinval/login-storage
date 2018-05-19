/*** 
//  ARGUMENTS ARE OPTIONALS
    formData = {
        instance: "instanceName", //where inputs goes to memorized
        title: "title",
        inputs: [
            {
                text: "label text",
                placeholder: "placeholder text",
                storeName: "inputname", //(name to call input from the store)
                store: true, //(true by defaul)
                encoder: functionName, (that encodes)
                validate: regExp,
                message: "write a string that appears when valdation fails"
            },
            {
                text: "label text",
                placeholder: "placeholder text",
                storeName: "inputname2",
                store: false,
                encoder: functionName, (that encodes)
                validate: regExp
                message: "write a string that appears when valdation fails"
            }
        ],
        button: {
            text: "button text"
        }
    }
    timeout = 1000; //(number in milliseconds that represents account timeout)
***/
function LoginStorage(formData, timeout) {

    //get localStorage
    this.get = function () {
        var storage = localStorage.getItem("loginStorage");
        var obj = {};
        var retObj = {};
        var keys = [];
        if (storage) {
            try {
                obj = JSON.parse(storage);
            } catch (e) {
                console.log(e);
                return false;
            }
            keys = Object.keys(obj);
            keys.forEach(function(key){
                if (!obj[key]) {
                    localStorage.removeItem("loginStorage");
                    return false;
                }
                retObj[key] = obj[key];
            })
            retObj["time"] = obj.time;
            return retObj;
        } else {
            return false;
        }
    }
    
    //clear localStorage
    this.clear = function (instance) {
        if (instance === undefined)
            localStorage.removeItem("loginStorage");
        else
            delete data[instance];
    }
    
    //hide login Box
    this.hide = function () {
        wrapper.style.display = loginBox.style.display = "none";
    }
    
    //show login Box
    this.show = function () {
        wrapper.style.display = loginBox.style.display = "block";
    }

    //listen if button has been press
    this.onclick = function (callback) {
        var interval = setInterval(function(){
            if (inputs) {
                var cb = inputs;
                inputs = false;
                return callback(cb);
            }
        },1)
    }

    var self = this;
    var now = new Date().getTime();
    var data = this.get();
    var form = document.createElement("form");
    var wrapper = document.createElement("div");
    var loginBox = document.createElement("div");
    var inputs, loginBoxTitle, button, subscription, checkformComplete, title, inputBox, submitted = false;
    
    createLoginPage();

    this.data = data;
    this.wrapper = wrapper;
    this.loginBox = loginBox;
    
    if (timeout) {
        if (data.time && now - data.time >= timeout) {
            self.clear();
        }
    }

    return this;
    
    function createLoginPage () {

        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        var inputsTemp  = {};
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = '../../js/login-storage/login-storage-style.css';
        link.media = 'all';
        head.appendChild(link);
        
        title = "LOGIN PAGE";
        button = "Confirm";
        inputBox = "";
        
        if (formData) {
            title = formData.title ? formData.title : title;
            if (formData.inputs) {
                formData.inputs.forEach(function(input){
                    var inputName = input.text.replace(/ /g, '');
                    var message = input.message || "";
                        inputBox += "<label>"+input.text+"</label><input name='"+(inputName)+"' type='"+(input.type||"")+"' placeholder='"+(input.placeholder||"")+"'><div class='loginStorage-message'><span>"+message+"</span></div>";
                })
            }
            if (formData.button) {
                button = formData.button.text ? formData.button.text : button;
            }
        }
        
        loginBoxTitle = "<title>"+title+"</title>";
        button = "<buttons><button>"+button+"</button></buttons>";
        subscription = {};
        subscription[data.instance !== undefined ? data.instance : "global"];
        checkformComplete = true;
        
        wrapper.id = "loginStorage-loginPage-wrapper";
        loginBox.id = "loginStorage-loginPage-loginBox";
        form.name = "loginStorage-loginPage-form";
        wrapper.onclick = function(){
            self.hide();
        }
        document.body.appendChild(wrapper);
        document.body.appendChild(loginBox);
        loginBox.innerHTML = loginBoxTitle;
        loginBox.appendChild(form);
        form.innerHTML = inputBox+button;
        
        form.onsubmit = function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.clear();
            var counter = 0;
            formData.inputs.forEach(function(input){
                var inputName = input.text.replace(/ /g, '');
                var storeName = input.storeName !== undefined ? input.storeName.replace(/ /g, '') : inputName;
                var value = form[inputName].value;
                var validate = input.validate !== undefined ? input.validate.test(value) : true;
                    value = input.encoder !== undefined ? input.encoder(value) : value;
                if (value!=="" && validate) {
                    var inputStore = input.store !== undefined ? input.store : true;
                    if (inputStore) subscription[storeName] = value;
                                    inputsTemp[storeName] = value;
                    form[inputName].style.border = "1px solid rgb(238, 238, 238)";
                    document.querySelectorAll(".loginStorage-message")[counter].style.display = "none";
                } else {
                    checkformComplete = false;
                    form[inputName].style.border = "1px solid red";
                    if (input.message !== undefined) document.querySelectorAll(".loginStorage-message")[counter].style.display = "table";
                }
                counter++;
            })
            subscription["time"] = new Date().getTime();
            if (checkformComplete) {
                localStorage.setItem("loginStorage", JSON.stringify(subscription));
                inputs = inputsTemp;
            }
        }
        
    }
        
}
