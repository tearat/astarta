var app = new Vue({
    el: "#app",
    data: {
        blog: "main",
        posts: [{
                title: "not",
                text: "loaded"
            }
        ],
        visibility: [true],
        confirmations: true,
        filter: ""
    },
    methods: {
        condition: function (title, text, filter) {
            if ( title.toLowerCase().indexOf(filter.toLowerCase()) != -1 )
            { return -1; }
            else if ( text.toLowerCase().indexOf(filter.toLowerCase()) != -1 )
            { return -1; }
        },
        _add: function () {
            this.filter = "";
            this.posts.push({
                title: "new post",
                text: "text"
            });
            this.visibility.push(true);
            this.save_json();
        },
        _edit: function (index, pos) {
            this.visibility = new Array(this.visibility.length).fill(true);
            this.visibility[index] = false;
            var temp = this.visibility;
            this.visibility = [];
            this.visibility = temp;
            Vue.nextTick(function () {
                $('input').eq(pos).focus();
            })
        },
        _edited: function (index) {
            this.visibility[index] = true;
            var temp = this.visibility;
            this.visibility = [];
            this.visibility = temp;
            this.save_json();
        },
        _delete: function (index) {
            if ( this.confirmations ) {
                var question = confirm("Delete post?");
                if (question == true) {
                    this.posts.splice(index, 1);
                    this.save_json();
                }
            } else {
                this.posts.splice(index, 1);
                this.save_json();
            }
        },
        _confirmations: function (arg) {
            this.confirmations = arg;
        },
//        refresh: function () {
//            this.posts = [];
//            this.posts = this.load_json();
//        },
        load_json: function () {
            var loaded;
            $.ajax({
                url: "/posts/" + this.blog + ".json",
                cache: false,
                async: false,
            }).done(function (data) {
                loaded = data;
            });
            this.visibility = [];
            for (i = 0; i < loaded.length; i++) {
                this.visibility.push(true);
            }
            this.posts = loaded;
//            return loaded;
        },
        save_json: function () {
            $.ajax({
                type: "POST",
                url: "/app/saver.php",
                cache: false,
                async: false,
                data: {
                    blog: this.blog,
                    data: JSON.stringify(this.posts)
                }
            });
        }
    },
    mounted: function () {
//        this.refresh();
        this.load_json();
    }
})