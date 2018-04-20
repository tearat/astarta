Vue.component('par', {
    props: ['par'],
    template: '<div><p>{{par}} </p></div>'
})

var app = new Vue({
    el: "#app",
    data: {
        filter: "",
        error: "",
        info: "",
        //
        posts: [],
        posts_visibility: [true],
        confirmations: true,
        //
        databases: [],
        link: "main",
        adding_db: false,
        new_db: "",
    },
    methods: {
        condition: function (title, text, filter) {
            if (title.toLowerCase().indexOf(filter.toLowerCase()) != -1) {
                return -1;
            } else if (text.toLowerCase().indexOf(filter.toLowerCase()) != -1) {
                return -1;
            }
        },
        _date_now: function (date_now) {
            var date_now = undefined;
            date_now = new Date();
            var day = date_now.getDate();
            var month = ""+date_now.getMonth();
                month = month.length < 2 ? "0"+month : month;
            var year = date_now.getYear();
            var hours = date_now.getHours();
            var minutes = ""+date_now.getMinutes();
                minutes = minutes.length < 2 ? "0"+minutes : minutes;
            var seconds = ""+date_now.getSeconds();
                seconds = seconds.length < 2 ? "0"+seconds : seconds;
            return day + "." + month + "." + year + " | " + hours + ":" + minutes + ":" + seconds;
        },
        _close_error: function () {
            this.error = false;
        },
        _close_info: function () {
            this.info = false;
        },
        // ==============================================
        // POSTS
        //
        _add_post: function () {
            var date_now = undefined;
            date_now = new Date();
            this.filter = "";
            this.posts.push({
                title: "new post",
                text: "text",
                date: this._date_now(date_now)
            });
            this.posts_visibility.push(true);
            this._save_posts();
        },
        _edit_post: function (index, input) {
            this.posts_visibility = new Array(this.posts_visibility.length).fill(true);
            this.posts_visibility[index] = false;
            var temp = this.posts_visibility;
            this.posts_visibility = [];
            this.posts_visibility = temp;
            if ( input ) {
                Vue.nextTick(function () {
                    $('input').eq(2).focus();
                })
            }
            else {
                Vue.nextTick(function () {
                    $('textarea').eq(0).focus();
                })
            }
        },
        _edited_post: function (index) {
            var date_now = undefined;
            date_now = new Date();
            this.posts[index].date = "upd: " + this._date_now(date_now);
            this.posts_visibility[index] = true;
            var temp = this.posts_visibility;
            this.posts_visibility = [];
            this.posts_visibility = temp;
            this._save_posts();
        },
        _delete_post: function (index) {
            if (this.confirmations) {
                var question = confirm("Удалить этот пост?");
                if (question == true) {
                    this.posts.splice(index, 1);
                    this._save_posts();
                }
            } else {
                this.posts.splice(index, 1);
                this._save_posts();
            }
        },
        _change_confirmations: function (arg) {
            this.confirmations = arg;
        },
        _load_posts: function () {
            this.error = "";
            this.info = "";
            var loaded;
//            this.posts = [];
            $.ajax({
                url: "/json/" + this.link + ".json",
                cache: false,
                async: false,
            }).done(function (data) {
                loaded = data;
            });
            this.posts_visibility = [];
            if ( loaded != undefined ) {
                for (i = 0; i < loaded.length; i++) {
                    this.posts_visibility.push(true);
                }
                this.posts = loaded;
            }
            else {
                this._close_info();
                this.error = "Database not loaded";
            }
        },
        _save_posts: function () {
            $.ajax({
                type: "POST",
                url: "/app/app.php",
                cache: false,
                async: false,
                data: {
                    action: "save_db",
                    link: this.link,
                    data: JSON.stringify(this.posts)
                }
            });
        },
        // ======================================
        // Databases
        //
        _load_databases: function () {
            var loaded = false;
            this.databases = [];
            $.ajax({
                type: "POST",
                url: "/app/app.php",
                cache: false,
                async: false,
                data: { action: "load_db" }
            }).done(function (data) {
                loaded = JSON.parse(data);
            });
            this.databases = loaded;
        },
        _show_adding_db_input: function () {
            this.adding_db = true;
            Vue.nextTick(function () {
                $("#input_add_db").focus();
            })
        },
        _hide_adding_db_input: function () {
            this.adding_db = false;
        },
        _add_db: function (db) {
            if ( db == "main" || this.databases.includes(db) ) { this.error = "Такая база данных уже есть"; return false; }
            
            if ( this.new_db == "" ) { this.error = "Нужно указать название базы данных"; return false; }
            
            if ( db.search( /[a-zA-Z0-9]+/ ) == -1 ) {
                this.error = "Название может содержать только латинские буквы и цифры";
                return false;
            }
            
            this.link = db;
            this.posts = [{ title: "New Database "+db, text: "is created", date: this.date }];
            this.new_db = "";
            this.adding_db = false;
            this._save_posts();
            this._load_databases();
            this._close_error();
            this.info = "База данных " + db + " создана";
        },
        _delete_db: function () {
            if ( this.link == "main" ) {
                alert("Нельзя удалить главную базу данных");
                return false;
            }
            var question = confirm("Удалить эту базу данных?");
            if (question == true) {
                $.ajax({
                    type: "POST",
                    url: "/app/app.php",
                    cache: false,
                    async: false,
                    data: { action: "delete_db", link: this.link }
                });
                this._load_databases();
                this.link = "main";
                this._load_posts();
                this.info = "База данных удалена";
            }
        },
    },
    mounted: function () {
        this._load_databases();
        this._load_posts();
    }
})
