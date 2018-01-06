(function () {
    
    var html = `<div class="u-modal">
                        <div class="modal-cnt">
                               <div class="modal-tt">
                                    <strong>欢迎回来 </strong>
                                    <i class="modal-cancel"></i>
                                    <span>还没有账号？ <a class="u-link" id="goregister">立即注册</a></span>
                                </div>
                                <form class="m-form">
                                    <div class="u-formitem"><input id="username" type="text" placeholder="手机号" class="u-input"> </div>
                                    <div class="u-formitem u-formitem1"><input id="password" autocomplete="off" type="password" placeholder="密码" class="u-input"> </div>
                                    <div class="u-formitem u-formitem2">
                                        <div class="u-check">
                                            <input type="checkbox" id="remember" class="u-checkbox">
                                            <label for="remember"></label>
                                            <span class="keep-login">保持登录</span>
                                        </div>
                                        <span class="f-forget"><a class="u-link">忘记密码？</a></span>
                                    </div>
                                    <div class="u-error f-dn">
                                        <span class="u-icon-error"></span>
                                        <span class="errorMsg"></span>
                                    </div>
                                    <button class="u-btn-primary" type="submit">登&nbsp;&nbsp;录</button>
                                </form>
                            </div>
                        </div>`;
    
    function LoginModal(opt) {
        opt = opt || {};
        _.extend(this, opt);

        this.container = this._layout.cloneNode(true);

        // 标题

        this.userName = this.container.querySelector('#username');
        this.password = this.container.querySelector('#password');
        this.logins = document.querySelector('.m-login');
        this.registers = document.querySelector('.m-register');
        this.loginInfo = document.querySelector('.m-login-info');
        this.close = this.container.querySelector('.modal-tt .modal-cancel');
        this.submit = this.container.querySelector('.u-btn-primary');
        this.remember = this.container.querySelector('.u-check');
        this.ErrorParent = this.container.querySelector('.u-error');
        this.nError = this.container.querySelector('.errorMsg');
        this.goregister = this.container.querySelector('#goregister');




        this.initLoginEvent();

    }

    // 事件注册
    _.extend( LoginModal.prototype, _.emitter);

    _.extend(LoginModal.prototype,{

        _layout: _.html2node(html),

        show: function() {
            // 给html的body节点增加整个窗体节点
            document.body.appendChild(this.container);
        },

        hide: function() {
            var container  = this.container;
            document.body.removeChild(container);
            _.addClassName(this.ErrorParent, 'f-dn');
            _.delClassName(this.userName, 'error');
            _.delClassName(this.password, 'error');
            this.userName.value = '';
            this.password.value = '';
        },

        register: function () {
            this.emit('showRegisterModal');
            this.hide();
        },

        lastSuc: function () {
            this.logins.style.display = 'none';
            this.registers.style.display = 'none';
            _.delClassName(this.loginInfo, 'f-dn');
        },

        onCancel: function() {
            this.emit("cancel");
            this.hide();
        },

        check: function () {
            var isValid = true,
                flag = true;

            // 验证用户名
            flag = _.isPhone(this.userName.value) && flag;
            flag = !_.isNotEmpty(this.userName.value) && flag;
            flag ? _.delClassName(this.userName, 'error') : _.addClassName(this.userName, 'error');
            isValid = isValid && flag;

            // 验证密码
            flag = true;
            flag = !_.isNotEmpty(this.password.value) && flag;
            flag = _.pwdLength(this.password.value) && flag;
            flag ? _.delClassName(this.password, 'error') : _.addClassName(this.password, 'error');
            isValid = isValid && flag;

            isValid || (this.nError.innerText = '账号或密码不正常，请重新输入');

            this.showError();

            isValid ? _.addClassName(this.ErrorParent, 'f-dn'): this.showError();

            return isValid;
        },

        showError: function () {
            _.delClassName(this.ErrorParent, 'f-dn');
        },

        _submit: function (event) {
            var that = this;
            event.preventDefault();
            var data = {
                username: this.userName.value.trim(),
                password: hex_md5(this.password.value),
                remember: !!this.remember.checked
            };
            if (this.check()) {
                _.ajax({
                    url: '/api/login',
                    method: 'POST',
                    data: data,
                    success: function (data) {
                       var dataOrz = JSON.parse(data);
                        if (dataOrz.code === 200) {
                            console.log(this)
                            that.hide();
                            that.emit('ok', data.result);
                            that.lastSuc();

                        } else {
                            switch (dataOrz.code) {
                                case 400:
                                    this.nError.innerText = '密码错误，请重新输入';
                                    break;
                                case 404:
                                    this.nError.innerText = '用户不存在，请重新输入';
                                    break;
                            }
                            // this.showError();
                        }
                    },
                    fail: function () {}
                })
            }
        },

        initLoginEvent: function () {
            //    绑定提交事件
            //    绑定跳转注册事件
            this.on('showLoginModal', this.show.bind(this));
            _.addEvent(this.close, 'click' ,this.onCancel.bind(this));
            _.addEvent(this.goregister, 'click', this.register.bind(this));
            _.addEvent(this.submit, 'click', this._submit.bind(this));
            // _.addEvent(this.submit, 'submit', this.onCancel.bind(this));
        },
    });

    window.LoginModal = LoginModal;

})();