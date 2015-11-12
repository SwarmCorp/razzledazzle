(function() {
    window.daDebug = {
        firebase: "dazzle-staging"
    }
}).call(this),
    function() {
        window.app = angular.module("Dazzle", ["ngRoute", "ngAnimate", "ngSanitize", "restangular", "firebase", "ja.qr", "angularytics", "ui.bootstrap.modal", "ui.bootstrap.datepicker", "ui.bootstrap.timepicker", "ui.bootstrap.tpls", "angular-redactor"]).constant("discourseUrl", "//discourse.swarm.fund/").constant("counterpartyUrl", "//counterwallet.io/_api/").constant("s3bucket", "//s3.amazonaws.com/swarm.shandro/").constant("firebaseUrl", window.daDebug ? "https://" + window.daDebug.firebase + ".firebaseio.com" : "https://blinding-fire-1884.firebaseio.com").constant("chainAPIKey", "aa8318ad204b105287ef578fe9d42966").constant("mandrillAPIKey", "J0ab-AhedE5pUR1BbbZ7OA").constant("mailchimpAPIKey", "491e9da46f71ad07bb3d3e1e982c8cf9-us8").constant("dazzleUrl", "https://swarm.fund").constant("iOS", navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1).config(["$animateProvider", function(a) {
            return a.classNameFilter(/da-animate/)
        }]).config(["RestangularProvider", function(a) {
            return a.setDefaultHeaders({
                "Content-type": "text/plain"
            })
        }]).config(["AngularyticsProvider", function(a) {
            return a.setEventHandlers(["GoogleUniversal"])
        }]).config(["datepickerConfig", function(a) {
            return a.showWeeks = !1
        }]).config(["redactorOptions", function(a) {
            return a.buttons = ["formatting", "|", "bold", "italic", "deleted", "|", "unorderedlist", "orderedlist", "|", "link"], a.formatting = [], a.formattingAdd = [{
                tag: "p",
                title: "Normal text",
                "class": "text-paragraph"
            }, {
                tag: "h3",
                title: "Title",
                "class": "text-title"
            }]
        }]).factory("RestRome", ["Restangular", function(a) {
            return a.withConfig(function(a) {
                return a.setBaseUrl("https://swarm-rome.herokuapp.com"), a.setDefaultHeaders({
                    "Content-type": "application/json"
                })
            })
        }]).factory("RestChain", ["Restangular", function(a) {
            return a.withConfig(function(a) {
                return a.setBaseUrl("https://api.chain.com/v2/")
            })
        }]).factory("RestSoChain", ["Restangular", function(a) {
            return a.withConfig(function(a) {
                return a.setBaseUrl("https://chain.so/api/v2/")
            })
        }]).factory("RestBlockscan", ["Restangular", function(a) {
            return a.withConfig(function(a) {
                return a.setBaseUrl("https://xcp.blockscan.com/")
            })
        }]).factory("RestBlockchain", ["Restangular", function(a) {
            return a.withConfig(function(a) {
                return a.setBaseUrl("https://blockchain.info/q")
            })
        }]).factory("RestRazzle", ["Restangular", function(a) {
            return a.withConfig(function(a) {
                return a.setBaseUrl("https://razzle.herokuapp.com/api/")
            })
        }]).factory("RestDiscourse", ["Restangular", "discourseUrl", function(a, b) {
            return a.withConfig(function(a) {
                return a.setBaseUrl(b)
            })
        }]).factory("RestCounterparty", ["Restangular", function(a) {
            return a.withConfig(function(a) {
                return a.setBaseUrl("https://counterparty.swarm.fund/")
            })
        }]).factory("RestMandrill", ["Restangular", function(a) {
            return a.withConfig(function(a) {
                return a.setBaseUrl("https://us8.api.mailchimp.com/2.0/")
            })
        }]).run(["$rootScope", "$location", "$window", "$interval", "Angularytics", "User", "Checkout", function(a, b, c, d, e, f, g) {
            return e.init(), filepicker.setKey("A6ijVqCLZQoO9LlNEFGxQz"), Stripe.setPublishableKey("pk_live_mJW1pNhkZnFJXsmEXzfFPojV"), a.$on("$routeChangeStart", function(a, c) {
                var d, e, f;
                return "checkout" !== (null != c ? c.screenName : void 0) || (e = null != c ? c.params.project : void 0, d = null != c ? c.params.bundle : void 0, f = null != c ? c.stepName : void 0, g.set({
                    project: e,
                    bundle: d
                }), f) ? void 0 : b.path("projects/" + e + "/" + d + "/checkout/user").replace()
            }), a.$watch(function() {
                return f.info.loaded
            }, function() {
                return f.isLoggedIn() || f.info.votingWallet || "/voting-signup" !== b.$$url ? void 0 : window.location.href = "/"
            })
        }])
    }.call(this),
    function() {
        window.app.config(["$routeProvider", "$locationProvider", function(a, b) {
            return a.when("/", {
                controller: "HomeController",
                templateUrl: "partials/app/home.html",
                screenName: "home"
            }).when("/login", {
                controller: "LoginController",
                templateUrl: "partials/app/login.html",
                screenName: "home"
            }).when("/projects", {
                controller: "PortfolioController",
                templateUrl: "partials/app/portfolio.html",
                screenName: "portfolio"
            }).when("/projects/:projectName?", {
                controller: "ProjectController",
                templateUrl: "partials/app/project.html",
                screenName: "project",
                resolve: {
                    route: ["$q", "$route", "$location", "Project", function(a, b, c, d) {
                        var e, f;
                        return e = a.defer(), f = b.current.params.projectName, d.get(f).then(function(a) {
                            return !a.project_name || "DCO" === a.project_type && !a.project_published ? (c.path("/projects").replace(), e.reject()) : e.resolve(), e.promise
                        })
                    }]
                }
            }).when("/projects/:project/:bundle/checkout", {
                controller: "CheckoutController",
                templateUrl: "partials/app/components/checkout/user.html",
                screenName: "checkout",
                mainHeaderHidden: !0
            }).when("/projects/:project/:bundle/checkout/user", {
                controller: "CheckoutController",
                templateUrl: "partials/app/components/checkout/user.html",
                screenName: "checkout",
                mainHeaderHidden: !0,
                stepName: "user",
                resolve: {
                    route: ["CheckoutRoute", "Checkout", function(a, b) {
                        return a(), b.resetFlow()
                    }]
                }
            }).when("/projects/:project/:bundle/checkout/wallet", {
                controller: "CheckoutController",
                templateUrl: "partials/app/components/checkout/wallet.html",
                screenName: "checkout",
                mainHeaderHidden: !0,
                stepName: "wallet",
                resolve: {
                    route: ["CheckoutRoute", function(a) {
                        return a()
                    }]
                }
            }).when("/projects/:project/:bundle/checkout/payment", {
                controller: "CheckoutController",
                templateUrl: "partials/app/components/checkout/payment.html",
                screenName: "checkout",
                mainHeaderHidden: !0,
                stepName: "payment",
                resolve: {
                    route: ["CheckoutRoute", function(a) {
                        return a()
                    }]
                }
            }).when("/projects/:project/:bundle/checkout/done", {
                controller: "CheckoutController",
                templateUrl: "partials/app/components/checkout/done.html",
                screenName: "checkout",
                mainHeaderHidden: !0,
                stepName: "done",
                resolve: {
                    route: ["CheckoutRoute", function(a) {
                        return a()
                    }]
                }
            }).when("/terms", {
                controller: "TermsController",
                templateUrl: "partials/app/terms.html",
                screenName: "legal"
            }).when("/privacy-policy", {
                controller: "PrivacyPolicyController",
                templateUrl: "partials/app/privacy-policy.html",
                screenName: "legal"
            }).otherwise({
                redirectTo: "/"
            }), b.html5Mode(!0).hashPrefix("!")
        }])
    }.call(this),
    function() {
        window.app.controller("CheckoutController", ["$scope", "Checkout", "Project", function(a, b, c) {
            return a.backStepAvailable = !0, a.buttonNext = function() {
                return "Next"
            }, a.buttonNextDisabled = !0, a.enableNextButton = function() {
                return a.buttonNextDisabled = !1
            }, a.disableNextButton = function() {
                return a.buttonNextDisabled = !0
            }, a.buttonLoading = !1, a.setButtonLoading = function() {
                return a.buttonLoading = !0
            }, a.unsetButtonLoading = function() {
                return a.buttonLoading = !1
            }, a.checkoutFlow = function() {
                return b.flow
            }, c.bundle(b.project, b.bundle).then(function(b) {
                return a.bundle = b
            }), a.step = function() {
                return b.step
            }, a.nextStep = function(c) {
                var d, e;
                return e = b.flow, d = function() {
                    switch (a.step()) {
                        case "wallet-new":
                        case "wallet-existing":
                            return "wallet";
                        case "payment-bitcoin":
                        case "payment-fiat":
                            return "payment";
                        default:
                            return a.step()
                    }
                }(), e.step = c, e[d].passed = !0, b.set(e, !0)
            }
        }])
    }.call(this),
    function() {
        window.app.controller("HomeController", ["$rootScope", "$scope", "$modal", "$timeout", "$sce", "$firebase", "firebaseUrl", "Pledge", "User", "Sidebar", "Project", "RestRome", function(a, b, c, d, e, f, g, h, i, j, k, l) {
            var m;
            return b.slideImages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], b.slideImagesLoaded = !1, b.slidesLoaded = 0, b.slideImageLoaded = function() {
                return b.slidesLoaded++, b.slidesLoaded / 2 === b.slideImages.length ? b.slideImagesLoaded = !0 : void 0
            }, b.pledgeSent = !1, k.getProjectsCounter().then(function(a) {
                return a.$bindTo(b, "projectsCounter")
            }), b.submitPledge = function() {
                var a;
                return a = b.form.pledge, a.$setSubmitted(), a.$valid ? (b.loading = !0, h.create(b.pledge).then(function() {
                    return b.pledgeSent = !0, b.loading = !1
                })) : void 0
            }, b.createDCO = function() {
                return i.isLoggedIn() ? (j.switchSection("DCO"), j.show(), d(function() {
                    return a.$broadcast("newDCOProject")
                }, 0)) : c.open({
                    templateUrl: "partials/app/modal/login.html",
                    controller: "modalLoginController",
                    scope: b
                })
            }, b.loginCallback = b.createDCO, m = new Firebase(g + "/faq"), f(m).$asObject().$loaded().then(function(a) {
                return a.$bindTo(b, "faqs")
            }), b.toggleFaq = function(a) {
                return b.activeFaqIndex = b.activeFaqIndex === a ? null : a
            }, b.subscribe = function() {
                var a;
                return a = b.form.subscribe, a.email.$setValidity("mailchimp", !0), a.email.errorMessage = null, a.$setSubmitted(), a.$valid ? (a.loading = !0, l.one("newsletter/subscribers").post("add", {
                    email: a.email.$viewValue
                }).then(function() {
                    return b.userSubscribed = !0, a.loading = !1
                }).then(null, function(b) {
                    return a.email.errorMessage = b.data.message, a.email.$setValidity("mailchimp", !1), a.loading = !1
                })) : void 0
            }
        }])
    }.call(this),
    function() {
        window.app.controller("LoginController", ["$rootScope", "$scope", "$timeout", "$location", "$modal", "User", function(a, b, c, d, e, f) {
            return b.loading = !1, b.$watchCollection(function() {
                return [b.form.login.email.$viewValue, b.form.login.password.$viewValue]
            }, function() {
                return b.$broadcast("autofill:update")
            }), b.userIsLoggedIn = function() {
                return f.isLoggedIn()
            }, b.userIsLoggedIn() && d.path("/"), b.form = {}, b.formSubmitted = !1, b.hasError = function(a) {
                var c, d;
                return c = b.form.login.email, d = b.form.login.password, a.$touched && a.$invalid || b.formSubmitted && a.$invalid ? (c.errorMessage = c.$invalid && !c.customError ? "Valid email is required." : c.errorMessage, d.errorMessage = d.$invalid && !d.customError ? "Password is required." : d.errorMessage, !0) : void 0
            }, b.login = function() {
                var a, c, g;
                return b.formSubmitted = !0, c = b.form.login, a = c.email, g = c.password, a.$valid && g.$dirty ? (b.loading = !0, b.formSubmitted = !1, f.login(a.$viewValue, g.$viewValue).then(function() {
                    return f.isLoggedIn() ? f.info.newPasswordRequired ? (b.loading = !1, e.open({
                        templateUrl: "partials/app/modal/update-password.html",
                        controller: "updatePasswordController",
                        resolve: {
                            data: function() {
                                return g.$viewValue
                            }
                        }
                    })) : (b.loading = !1, d.path("/")) : void 0
                }).then(null, function(c) {
                    switch (b.loading = !1, c.code) {
                        case "INVALID_EMAIL":
                            return a.$setValidity("email", !1), a.customError = !0, a.errorMessage = "Invalid email.";
                        case "INVALID_USER":
                            return a.$setValidity("email", !1), a.customError = !0, a.errorMessage = "User does not exist.";
                        case "INVALID_PASSWORD":
                            return g.$setValidity("password", !1), g.customError = !0, g.errorMessage = "Invalid password."
                    }
                })) : void 0
            }, b.forgotPassword = function() {
                return e.open({
                    templateUrl: "partials/app/modal/password-reminder.html",
                    controller: "passwordReminderController"
                })
            }
        }])
    }.call(this),
    function() {
        window.app.controller("MainController", ["$scope", "$route", "Sidebar", function(a, b, c) {
            return a.toggleSidebar = function() {
                return c.toggle()
            }, a.bodyClass = function() {
                var c, d;
                return c = [], (null != (d = b.current) ? d.screenName : void 0) && c.push("screen-" + b.current.screenName), a.additionalClass && c.push(a.additionalClass), c
            }, a.$on("additionalBodyClass", function(b, c) {
                return a.additionalClass = c["class"]
            })
        }])
    }.call(this),
    function() {
        window.app.controller("modalLoginController", ["$scope", "$timeout", "$location", "$modal", "$modalInstance", "User", function(a, b, c, d, e, f) {
            return a.loading = !1, a.$watchCollection(function() {
                return [a.form.login.email.$viewValue, a.form.login.password.$viewValue]
            }, function() {
                return a.$broadcast("autofill:update")
            }), a.form = {}, a.formSubmitted = !1, a.hasError = function(b) {
                var c, d;
                return c = a.form.login.email, d = a.form.login.password, b.$touched && b.$invalid || a.formSubmitted && b.$invalid ? (c.errorMessage = c.$invalid && !c.customError ? "Valid email is required." : c.errorMessage, d.errorMessage = d.$invalid && !d.customError ? "Password is required." : d.errorMessage, !0) : void 0
            }, a.login = function() {
                var b, g, h;
                return a.formSubmitted = !0, g = a.form.login, b = g.email, h = g.password, b.$valid && h.$dirty ? (a.loading = !0, a.formSubmitted = !1, f.login(b.$viewValue, h.$viewValue).then(function() {
                    return f.isLoggedIn() ? f.info.newPasswordRequired ? (a.loading = !1, e.close(), d.open({
                        templateUrl: "partials/app/modal/update-password.html",
                        controller: "updatePasswordController",
                        resolve: {
                            data: function() {
                                return h.$viewValue
                            }
                        }
                    })) : (a.loading = !1, c.path("/"), angular.isDefined(a.loginCallback) && a.loginCallback(), e.close()) : void 0
                }).then(null, function(c) {
                    switch (a.loading = !1, c.code) {
                        case "INVALID_EMAIL":
                            return b.$setValidity("email", !1), b.customError = !0, b.errorMessage = "Invalid email.";
                        case "INVALID_USER":
                            return b.$setValidity("email", !1), b.customError = !0, b.errorMessage = "User does not exist.";
                        case "INVALID_PASSWORD":
                            return h.$setValidity("password", !1), h.customError = !0, h.errorMessage = "Invalid password."
                    }
                })) : void 0
            }, a.forgotPassword = function() {
                return e.close(), d.open({
                    templateUrl: "partials/app/modal/password-reminder.html",
                    controller: "passwordReminderController"
                })
            }, a.signUp = function() {
                return e.close(), d.open({
                    templateUrl: "partials/app/modal/signup.html",
                    controller: "modalSignupController"
                })
            }, a.loginWithFacebook = function() {
                return f.facebookLogin().then(function() {
                    return e.close()
                })
            }
        }])
    }.call(this),
    function() {
        window.app.controller("modalNotificationController", ["$scope", "$sce", "$modalInstance", "notificationData", function(a, b, c, d) {
            return a.notificationText = d.text
        }])
    }.call(this),
    function() {
        window.app.controller("passwordReminderController", ["$scope", "$modal", "$modalInstance", "User", function(a, b, c, d) {
            return a.loading = !1, a.form = {}, a.formSubmitted = !1, a.hasError = function(b) {
                var c;
                return c = a.form.reminder.email, b.$touched && b.$invalid || a.formSubmitted && b.$invalid ? (c.errorMessage = c.$invalid && !c.customError ? "Valid email is required." : c.errorMessage, !0) : void 0
            }, a.remind = function() {
                return a.formSubmitted = !0, a.form.reminder.$valid ? (a.loading = !0, a.email = a.form.reminder.email, a.emailValue = a.email.$viewValue, d.resetPassword(a.emailValue).then(function() {
                    return a.formSubmitted = !1, a.loading = !1, c.close(), b.open({
                        templateUrl: "partials/app/modal/notification.html",
                        controller: "modalNotificationController",
                        resolve: {
                            notificationData: function() {
                                return {
                                    text: "Instructions to reset your password have been sent to " + a.emailValue + "."
                                }
                            }
                        }
                    })
                }).then(null, function(b) {
                    switch (a.formSubmitted = !1, a.loading = !1, b.code) {
                        case "INVALID_EMAIL":
                            return a.email.$setValidity("email", !1), a.email.customError = !0, a.email.errorMessage = "Invalid email.";
                        case "INVALID_USER":
                            return a.email.$setValidity("email", !1), a.email.customError = !0, a.email.errorMessage = "User does not exist."
                    }
                })) : void 0
            }
        }])
    }.call(this),
    function() {
        window.app.controller("modalSignupController", ["$scope", "$modal", "$modalInstance", "User", function(a, b, c, d) {
            return a.loading = !1, a.form = {}, a.formSubmitted = !1, a.signup = function() {
                var b, e, f, g, h;
                return a.formSubmitted = !0, f = a.form.signup, e = f.firstName, g = f.lastName, b = f.email, h = f.password, f.$valid || e.$valid && g.$valid && b.$valid && a.passwordsMatch() ? (a.formSubmitted = !1, a.loading = !0, d.create(b.$viewValue, h.$viewValue).then(function() {
                    return b = b.$viewValue, h = h.$viewValue, e = e.$viewValue, g = g.$viewValue, d.login(b, h, !0).then(function() {
                        return d.update({
                            first_name: e,
                            last_name: g,
                            email: b,
                            wallet: null
                        }).then(function() {
                            return a.loading = !1, c.close()
                        })
                    })
                }).then(null, function(c) {
                    switch (a.loading = !1, c.code) {
                        case "INVALID_EMAIL":
                            return b.$setValidity("email", !1), b.customError = !0, b.errorMessage = "Invalid email.";
                        case "EMAIL_TAKEN":
                            return b.$setValidity("email", !1), b.customError = !0, b.errorMessage = "Email address is already in use."
                    }
                })) : void 0
            }, a.hasError = function(b) {
                var c, d, e, f, g;
                return e = a.form.signup, d = e.firstName, f = e.lastName, c = e.email, g = e.password, b.$dirty && b.$invalid || (a.formSubmitted || a.formSubmitted) && b.$invalid ? (c.errorMessage = c.$invalid && !c.customError ? "Valid email is required." : c.errorMessage, g.errorMessage = g.$invalid && !g.customError ? "Password is required." : g.errorMessage, d.errorMessage = d.$invalid && !d.customError ? "First name is required." : d.errorMessage, f.errorMessage = f.$invalid && !f.customError ? "Last name is required." : f.errorMessage, c.errorMessage = c.$invalid && !c.customError ? "Valid email is required." : c.errorMessage, g.errorMessage = g.$invalid && !g.customError ? "Password is required." : g.errorMessage, !0) : void 0
            }, a.passwordsMatch = function() {
                var b, c;
                return b = a.form.signup.password, c = a.form.signup.passwordConfirm, b.$setValidity("password", !0), c.$setValidity("passwordConfirmation", !0), a.formSubmitted ? b.$pristine || c.$pristine || b.$viewValue !== c.$viewValue ? (b.$pristine && b.$setValidity("password", !1), c.$setValidity("incorrect", !1), b.$dirty && b.$viewValue !== c.$viewValue && (b.$setValidity("incorrect", !0), c.errorMessage = "Passwords must match."), !1) : !0 : b.$dirty && c.$dirty && b.$viewValue !== c.$viewValue ? (b.$pristine && b.$setValidity("incorrect", !1), c.$setValidity("incorrect", !1), c.errorMessage = "Passwords must match.", !1) : !0
            }, a.resetPasswordValidity = function() {
                return a.form.signup.password.$setValidity("incorrect", !0), a.form.signup.password.customError = !1
            }, a.login = function() {
                return c.close(), b.open({
                    templateUrl: "partials/app/modal/login.html",
                    controller: "modalLoginController"
                })
            }, a.loginWithFacebook = function() {
                return d.facebookLogin().then(function() {
                    return c.close()
                })
            }
        }])
    }.call(this),
    function() {
        window.app.controller("updatePasswordController", ["$scope", "$modalInstance", "User", "data", function(a, b, c, d) {
            return a.loading = !1, a.form = {}, a.formSubmitted = !1, a.oldPassword = d, a.hasError = function(b) {
                var c;
                return c = a.form.update.newPassword, b.$touched && b.$invalid || a.formSubmitted && b.$invalid ? (c.errorMessage = c.$invalid && !c.customError ? "New password is required." : c.errorMessage, !0) : void 0
            }, a.update = function() {
                return a.formSubmitted = !0, a.form.update.$valid ? (a.loading = !0, c.updatePassword(a.oldPassword, a.form.update.newPassword.$viewValue).then(function() {
                    return a.formSubmitted = !1, a.loading = !1, b.close()
                })) : void 0
            }
        }])
    }.call(this),
    function() {
        window.app.controller("WalletDownloadConfirmController", ["$rootScope", "$scope", "$timeout", "$modalInstance", "User", function(a, b, c, d, e) {
            return b.loading = !1, b.walletDownloadConfirmed = !1, b.walletDownloadConfirm = function() {
                return b.loading = !0, e.isLoggedIn() ? e.update({
                    wallet: b.userWallet["public"]
                }).then(function() {
                    return b.loading = !1, d.close(), a.$broadcast("paperWalletDownloaded", b.service)
                }) : (b.loading = !1, d.close(), a.$broadcast("paperWalletDownloaded", b.service))
            }, b.getPaperWallet = function() {
                return b.downloadWallet(), b.walletDownloadConfirm()
            }
        }])
    }.call(this),
    function() {
        window.app.controller("PortfolioController", ["$scope", "$interval", "$filter", "$location", "Project", "User", function(a, b, c, d, e, f) {
            return a.loading = !0, a.activeFilter = "visibleProjects", e.getAll().then(function(b) {
                return b.$bindTo(a, "projects").then(function() {
                    return a.loading = !1
                })
            }), a.goToProject = function(a) {
                return d.path("projects/" + a.project_id)
            }, a.projectMetrics = function(a) {
                var b, d;
                return a.project_coin && a.metrics ? (b = a.project_coin.toUpperCase(), d = {
                    btc_raised: c("satoshiToBTC")(a.metrics.btc_raised, 2, !0),
                    price_increase_date: a.assets[b].pricing,
                    number_of_backers: a.metrics.number_of_backers
                }) : !1
            }, a.isSaleCompleted = function(a) {
                var b, c;
                return a.sale_dates ? (c = moment(), a.sale_dates.mainsale_end_date ? (b = moment(a.sale_dates.mainsale_end_date), b && b.diff(c) < 0) : void 0) : !1
            }, a.completedSaleResult = function(a) {
                var b;
                return a.sale_dates ? (b = moment(a.sale_dates.mainsale_end_date), {
                    date: b.format("DD MMMM YYYY"),
                    raised: c("satoshiToBTC")(a.metrics.btc_raised, 2)
                }) : !1
            }, a.isPresale = function(a) {
                var b, c;
                return a.sale_dates ? (b = moment(), a.sale_dates.presale_end_date ? (c = moment(a.sale_dates.presale_end_date), c && c.diff(b) > 0) : void 0) : !1
            }, a.presaleData = function(a) {
                var b, c, d;
                return a.sale_dates ? (c = moment(), d = moment(a.sale_dates.presale_end_date), b = d.diff(c), moment.duration(b, "ms").format("d [days] h [hours]")) : !1
            }, a.starProject = function(a) {
                return a.project_starred = !a.project_starred
            }, a.projectCover = function(a) {
                var b;
                return b = a.project_cover ? a.project_cover + "/convert?h=340&fit=scale&quality=100" : "../images/projects/projectThumbnailPlaceholder.png", {
                    "background-image": "url(" + b + ")"
                }
            }, a.$watch(function() {
                return f.info.loaded
            }, function(b) {
                return b ? a.starAvailable = "super-admin" === f.info.role : void 0
            })
        }])
    }.call(this),
    function() {
        window.app.controller("PrivacyPolicyController", function() {})
    }.call(this),
    function() {
        window.app.controller("ProjectController", ["$scope", "$location", "$route", "$sce", "$timeout", "$interval", "$filter", "Project", "Discourse", "Payment", "User", "Sidebar", function(a, b, c, d, e, f, g, h, i, j) {
            var k, l, m, n;
            return a.projectName = null != (n = c.current) ? n.params.projectName : void 0, l = function(a) {
                return a.project_type && "DCO" === a.project_type ? !0 : void 0
            }, h.get(a.projectName).then(function(b) {
                return b.$bindTo(a, "project").then(function() {
                    return a.projectName = g("firstUpperCase")(a.project.project_name), l(a.project) ? a.isDCO = !0 : (a.isDCO = !1, a.updateMetrics(), m(), f(m, 1e3), j.getBitcoinExchangeRate().then(function(b) {
                        var c, d, e, f;
                        return f = b.USD["24h_avg"], c = a.project.bundles.BUNDLE.assets[0].quantity, d = a.project.bundles.BUNDLE.price, e = g("satoshiToBTC")(d / c, void 0, !0), a.coinsForDollar = e * f
                    }))
                })
            }), a.projectMetrics = {
                coins_per_btc: "",
                days_remaining: "",
                goal: "",
                number_of_backers: "",
                price_increase_date: ""
            }, m = function() {
                var b, c, d, e, f, g, h, i, j;
                if (l(a.project)) return !1;
                if (g = new Date, b = a.project.assets[a.project.project_coin].pricing, !b) return !1;
                for (j = [], e = h = 0, i = b.length; i > h; e = ++h) {
                    if (f = b[e], d = moment(f.start_date), c = d.diff(g), c > 0) {
                        a.projectMetrics.price_increase_date = moment.duration(c, "ms").format("dd:hh:mm:ss");
                        break
                    }
                    j.push(void 0)
                }
                return j
            }, k = function() {
                var b, c, d;
                return c = new Date, d = moment(a.project.sale_dates.mainsale_end_date), b = d.diff(c), a.projectMetrics.days_remaining = moment.duration(b, "ms").format("d")
            }, a.updateMetrics = function() {
                return l(a.project) ? !1 : (a.projectMetrics.number_of_backers = a.project.metrics.number_of_backers, k())
            }, a.toggleSocial = function() {
                return a.socialVisible = !a.socialVisible
            }, a.projectSection = "description", a.setSection = function(b) {
                return "discussion" === b && (a.projectDiscussion = i.getProjectDiscussion(a.project.company.forum)), a.projectSection = b
            }, a.projectCover = function(a) {
                var b;
                return a ? (b = a.project_cover ? a.project_cover : "../images/projects/projectCoverPlaceholder.png", {
                    "background-image": "url(" + b + ")"
                }) : void 0
            }, a.fund = function() {
                return b.path("/projects/" + a.project.$id + "/BUNDLE/checkout")
            }, a.trust = function(a) {
                return d.trustAsHtml(a)
            }, a.trustSrc = function(a) {
                return d.trustAsResourceUrl(a)
            }, a.toggleFaq = function(b) {
                return a.activeFaqIndex = a.activeFaqIndex === b ? null : b
            }
        }])
    }.call(this),
    function() {
        window.app.controller("TermsController", function() {})
    }.call(this),
    function() {
        window.app.directive("daCheckoutAmount", ["Checkout", function(a) {
            return {
                restrict: "A",
                link: function(b) {
                    return b.enableNextButton(), b.substractionDisabled = !0, b.amount = function() {
                        return a.flow.amount.value
                    }, b.addAmount = function() {
                        var a;
                        return a = b.amount(), b.amount = function() {
                            return a + 1
                        }, b.updateAmount()
                    }, b.subtractAmount = function() {
                        var a;
                        return a = b.amount(), b.substractionDisabled ? void 0 : (b.substractionDisabled = !1, b.amount = function() {
                            return a - 1
                        }, b.updateAmount())
                    }, b.updateAmount = function() {
                        var c;
                        return b.substractionDisabled = b.amount() <= 1 ? !0 : !1, c = a.flow, c.amount.value = b.amount(), a.set(a[c])
                    }, b.nextStep = function() {
                        var c;
                        if (!b.buttonNextDisabled) return c = a.flow, c.amount.passed = !0, a.set(a[c], !0)
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daCheckoutHeader", ["$window", "Checkout", "Project", function(a, b, c) {
            return {
                restrict: "A",
                templateUrl: "partials/app/components/checkout/checkout-header.html",
                replace: !0,
                link: function(d) {
                    return $("body").addClass("checkout"), d.goBack = function() {
                        return a.history.back()
                    }, c.get(b.project).then(function(a) {
                        return a.$bindTo(d, "project")
                    }), d.projectId = b.project
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daCheckoutDone", ["$interval", "$location", "$timeout", "$filter", "Checkout", "Project", function(a, b, c, d, e, f) {
            return {
                restrict: "A",
                link: function(g) {
                    var h;
                    return h = e.project, g.backStepAvailable = !1, g.redirectTimeout = 15, window.redirectTimeout = a(function() {
                            return g.redirectTimeout--, g.redirectTimeout ? void 0 : (a.cancel(window.redirectTimeout), b.path("projects/" + g.project.$id).replace(), c(function() {
                                return location.reload()
                            }, 10))
                        }, 1e3), window.fbAsyncInit = function() {
                            return FB.init({
                                appId: "1462959267300367",
                                xfbml: !0,
                                version: "v2.1"
                            })
                        },
                        function(a, b, c) {
                            var d, e;
                            return e = a.getElementsByTagName(b)[0], a.getElementById(c) ? void 0 : (d = a.createElement(b), d.id = c, d.src = "//connect.facebook.net/en_US/sdk.js", e.parentNode.insertBefore(d, e))
                        }(document, "script", "facebook-jssdk"), f.get(h).then(function(a) {
                            return a.$bindTo(g, "project").then(function() {
                                return g.shareVisible = !0, g.projectName = d("firstUpperCase")(g.project.project_name), g.projectDaysremaining = g.project.metrics.days_remaining, g.daysLeft = g.projectDaysremaining + " day" + (g.projectDaysremaining > 2 ? "s left" : " left")
                            })
                        }), g.share = {
                            facebook: function() {
                                return FB.ui({
                                    method: "feed",
                                    name: " I just backed " + g.projectName,
                                    link: "https://www.swarm.fund/projects/" + g.project.$id,
                                    picture: g.project.project_thumbnail,
                                    caption: g.daysLeft,
                                    description: "I just backed " + g.projectName + " on Swarm. There are " + g.daysLeft + " in the crowdsale. Make sure you don't miss it! #Swarmcorp " + g.project.project_hashtag,
                                    message: ""
                                })
                            },
                            twitter: function() {
                                var a, b, c, d, e, f;
                                return c = encodeURIComponent("https://www.swarm.fund/projects/" + g.project.$id), d = "I just backed " + g.projectName + " on Swarm. " + g.daysLeft + " to go!", f = 580, a = 300, b = screen.width / 2 - f / 2, e = screen.height / 2 - a / 2, window.open("http://twitter.com/share?text=" + d + "&url=" + c + "&hashtags=Swarmcorp, " + g.project.project_hashtag, "", "height=" + a + ", width=" + f + ", top=" + e + ", left=" + b + ", toolbar=0, location=0, menubar=0, directories=0, scrollbars=0")
                            }
                        }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daCheckoutPayment", ["$interval", "$timeout", "$location", "$filter", "Checkout", "Payment", "Order", "User", function(a, b, c, d, e, f, g) {
            return {
                restrict: "A",
                scope: !0,
                link: function(c) {
                    var h, i, j;
                    return c.projectName = e.project, f.getBitcoinExchangeRate().then(function(a) {
                        return c.exchangeRate = a.USD["24h_avg"]
                    }), c.paymentMethod = null, c.useFiat = function() {
                        return h(), c.paymentMethod = "fiat"
                    }, c.useBitcoin = function() {
                        return h(), c.paymentMethod = "bitcoin", i(), c.orderInProgress = !0
                    }, i = function() {
                        return g.create(e.project, e.bundle, {
                            user_id: e.flow.user.email,
                            currency: "BTC",
                            receiving_address: e.flow.wallet.value,
                            quantity: c.bundlesAmount,
                            payment_type: "bitcoin",
                            exchange_rate: c.exchangeRate
                        }).then(function(a) {
                            return c.paymentAddress = a.payment_id, e.flow.payment.orderId = a.order_id, c.orderInProgress = !1
                        })
                    }, j = function(a) {
                        return g.create(e.project, e.bundle, {
                            user_id: e.flow.user.email,
                            currency: "USD",
                            receiving_address: e.flow.wallet.value,
                            quantity: c.bundlesAmount,
                            payment_type: "stripe",
                            stripe_token_id: a.id,
                            exchange_rate: c.exchangeRate
                        }).then(function(a) {
                            return e.flow.payment.orderId = a.order_id
                        })
                    }, h = function() {
                        return e.flow.payment.orderId ? (c.paymentAddress = null, g.cancel(e.flow.payment.orderId).then(function() {
                            return c.$broadcast("orderCancelled"), e.flow.payment.orderId = null
                        })) : void 0
                    }, c.bundlesAmount = e.flow.payment.amount, c.addAmount = function() {
                        return c.bundlesAmount++, c.updateAmount()
                    }, c.subtractAmount = function() {
                        return c.substractionDisabled ? void 0 : (c.substractionDisabled = !1, c.bundlesAmount--, c.updateAmount())
                    }, c.updateAmount = function() {
                        var a;
                        return c.substractionDisabled = c.bundlesAmount <= 1 ? !0 : !1, a = e.flow, a.payment.amount = c.bundlesAmount, e.set(e[a]), h(), b.cancel(c.updateOrderTimeout), c.updateOrderTimeout = b(function() {
                            return "bitcoin" !== c.paymentMethod || c.orderInProgress ? void 0 : i()
                        }, 1e3)
                    }, c.$watch("bundlesAmount", function(a, b) {
                        return isNaN(a) || 1 > a ? (c.bundlesAmount = b, c.updateAmount()) : (c.bundlesAmount = a, c.updateAmount())
                    }), c.$watch("payment.cardNumber", function(a, b) {
                        return a && (a.length > 16 || !/^[0-9]+$/.test(a)) ? c.payment.cardNumber = b : void 0
                    }), c.doPayment = function() {
                        var a, b, d, e, f, g;
                        return d = c.paymentForm, f = d.firstName.$viewValue + "" + d.lastName.$viewValue, a = d.cardNumber.$viewValue, e = d.cardExpirationMM.$viewValue, g = d.cardExpirationYY.$viewValue, b = d.cardCVC.$viewValue, c.paymentDeclined = !1, d.$valid && !c.paymentInProgress ? (c.paymentInProgress = !0, Stripe.card.createToken({
                            name: f,
                            number: a,
                            cvc: b,
                            exp_month: e,
                            exp_year: g
                        }, function(a, b) {
                            return b.error ? c.paymentInProgress = !1 : j(b).then(null, function(a) {
                                return 400 === a.status ? (c.paymentDeclined = !0, c.paymentInProgress = !1) : void 0
                            })
                        })) : void 0
                    }, c.hasError = function(a) {
                        var b;
                        if (b = function() {
                                var a, b;
                                return a = c.paymentForm.cardExpirationMM.$viewValue, b = c.paymentForm.cardExpirationYY.$viewValue, !Stripe.card.validateExpiry(a, b)
                            }, a.$dirty) switch (a.$name) {
                            case "cardNumber":
                                return !Stripe.card.validateCardNumber(a.$viewValue);
                            case "cardExpirationMM":
                                return b();
                            case "cardExpirationYY":
                                return b();
                            case "cardCVC":
                                return !Stripe.card.validateCVC(a.$viewValue)
                        }
                        return a.$dirty && a.$invalid || (c.loginSubmitted || c.signupSubmitted) && a.$invalid ? !0 : void 0
                    }, c.$watch("order", function(b) {
                        var h, i, j, k;
                        if (b) {
                            if (i = d("satoshiToBTC")((null != (j = c.bundle) ? j.price : void 0) * c.bundlesAmount), c.expectedTransaction = d("btcToSatoshi")(i), c.confirmationInterval && (a.cancel(c.confirmationInterval), delete c.confirmationInterval), "Paid" === (null != b ? b.status : void 0)) return h = e.flow, h.payment.passed = !0, h.payment.received = !0, e.set(h, !0, !0);
                            if ((null != b ? b.order_id : void 0) && "canceled" !== (null != (k = c.confirmationInterval) ? k.$$state.value : void 0)) return c.confirmationInterval = a(function() {
                                return f.confirm(b.order_id).then(function(a) {
                                    return a >= c.expectedTransaction ? g.update(b.order_id, {
                                        status: "Paid"
                                    }) : void 0
                                })
                            }, 5e3)
                        }
                    }), c.$on("orderCancelled", function() {
                        return a.cancel(c.confirmationInterval)
                    }), c.$on("$destroy", function() {
                        return a.cancel(c.confirmationInterval)
                    }), c.$watch(function() {
                        return e.flow.payment.orderId
                    }, function(a) {
                        return a ? g.get(a).then(function(a) {
                            return a.$bindTo(c, "order").then(function(a) {
                                return c.$watch(function() {
                                    return e.flow.payment.orderId
                                }, function(b) {
                                    return b ? void 0 : a()
                                })
                            })
                        }) : void 0
                    }), c.thousandths = function(a) {
                        var b, c;
                        return c = a ? a / 1e8 : 0, b = (c.toString().split(".")[1] || []).length, 3 === b ? 3 : 2
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daCheckoutUser", ["$timeout", "$modal", "Checkout", "User", function(a, b, c, d) {
            return {
                restrict: "A",
                link: function(a) {
                    return a.termsConfirmed = !1, a.showLoginForm = function() {
                        return b.open({
                            templateUrl: "partials/app/modal/login.html",
                            controller: "modalLoginController"
                        })
                    }, a.showSignupForm = function() {
                        return b.open({
                            templateUrl: "partials/app/modal/signup.html",
                            controller: "modalSignupController"
                        })
                    }, a.$watch(function() {
                        return d.info.email
                    }, function(a) {
                        var b;
                        return a ? (b = c.flow, b.user.firstName = d.info.firstName, b.user.lastName = d.info.lastName, b.user.email = d.info.email, b.user.passed = !0, c.set(b, !0, !0), !1) : void 0
                    }), a.user = c.flow.user, a.backStepAvailable = !1, a.extendedForm = !1, a.passwordRequired = !1, a.submitted = !1, a.$watch("extendedForm", function(b) {
                        return a.passwordRequired = b
                    }), a.saveUserInfo = function() {
                        var b, d;
                        return a.submitted = !0, d = a.userForm, d.$valid ? (b = c.flow, b.user.firstName = d.firstName.$viewValue, b.user.lastName = d.lastName.$viewValue, b.user.email = d.email.$viewValue, c.set(c[b])) : void 0
                    }, a.hasError = function(b) {
                        var c, d, e;
                        return d = a.userForm.firstName, e = a.userForm.lastName, c = a.userForm.email, b.$dirty && b.$invalid || (a.loginSubmitted || a.signupSubmitted) && b.$invalid ? (b.customError || (c.errorMessage = c.$invalid ? "Valid email is required." : null, d.errorMessage = d.$invalid ? "First name is required." : null, e.errorMessage = e.$invalid ? "Last name is required." : null), !0) : void 0
                    }, a.$watch("termsConfirmed", function(b) {
                        return b ? a.userForm.$valid ? a.enableNextButton() : a.disableNextButton() : void 0
                    }), a.$watch("userForm.$valid", function(b) {
                        return b ? a.termsConfirmed ? a.enableNextButton() : a.disableNextButton() : void 0
                    }), a.nextStep = function() {
                        var b;
                        if (!a.buttonNextDisabled) return a.extendedForm || a.saveUserInfo(), b = c.flow, b.user.firstName && b.user.lastName && b.user.email ? (b.user.passed = !0, c.set(c[b], !0)) : void 0
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daCheckoutWalletExisting", ["Checkout", "Wallet", function(a, b) {
            return {
                restrict: "A",
                templateUrl: "partials/app/components/checkout/wallet-existing.html",
                link: function(c) {
                    return c.controlConfirmed = !1, c.addressValid = !1, c.publicKey = a.flow.wallet.existing ? a.flow.wallet.value : null, c.$watch("publicKey", function(a) {
                        return b.check(a) ? (c.addressValid = !0, c.controlConfirmed = !1) : (c.addressValid = !1, c.controlConfirmed = !1)
                    }), c.$watch("controlConfirmed", function(b) {
                        var d;
                        return d = a.flow, b && c.addressValid ? (d.wallet.value = c.publicKey, a.set(a[d]), c.enableNextButton()) : (d.wallet.value = null, a.set(a[d]), c.disableNextButton())
                    })
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daCheckoutWalletNew", ["$rootScope", "$timeout", "$modal", "Checkout", "Wallet", function(a, b, c, d, e) {
            return {
                restrict: "A",
                templateUrl: "partials/app/components/checkout/wallet-new.html",
                link: function(a) {
                    return a.downloadWallet = function() {
                        return e.pdf(a.userWallet), a.downloadConfirmed ? void 0 : a.confirmDownload()
                    }, a.confirmDownload = function() {
                        return a.downloadConfirmed = !0, b(function() {
                            return a.service = "checkout", c.open({
                                scope: a,
                                templateUrl: "partials/app/modal/wallet-download-confirmation.html",
                                controller: "WalletDownloadConfirmController"
                            })
                        }, 500)
                    }, a.$on("paperWalletDownloaded", function(b, c) {
                        var e;
                        return "checkout" === c ? (a.downloadConfirmed = !0, e = d.flow, e.wallet.value = a.userWallet["public"], e.wallet.keys = {
                            "public": a.userWallet["public"],
                            "private": a.userWallet["private"],
                            passphrase: a.userWallet.passphrase
                        }, d.set(d[e]), a.enableNextButton(), a.nextStep()) : void 0
                    })
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daCheckoutWallet", ["User", "Checkout", "Wallet", function(a, b, c) {
            return {
                restrict: "A",
                link: function(d) {
                    return d.$watch(function() {
                        return a.info.wallet
                    }, function(c) {
                        var d;
                        return c ? (d = b.flow, d.wallet.value = a.info.wallet, d.wallet.passed = !0, b.set(d, !0, !0, "wallet"), !1) : void 0
                    }), d.userWallet = b.flow.wallet.keys ? b.flow.wallet.keys : c["new"](), d.hasWallet = b.flow.wallet.existing ? b.flow.wallet.existing : !1, d.useExisting = function() {
                        return d.hasWallet = !0, d.disableNextButton()
                    }, d.createNew = function() {
                        return d.hasWallet = !1, d.disableNextButton()
                    }, d.nextStep = function() {
                        var a;
                        if (!d.buttonNextDisabled) return a = b.flow, a.wallet.value ? (a.wallet.passed = !0, a.wallet.existing = d.hasWallet, b.set(b[a], !0)) : void 0
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daAutofill", ["$timeout", function(a) {
            return {
                restrict: "A",
                require: "ngModel",
                link: function(b, c, d, e) {
                    return b.$on("autofill:update", function() {
                        return a(function() {
                            return e.$setViewValue(c[0].value)
                        }, 0)
                    })
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daCopyLink", ["$timeout", function(a) {
            return {
                restrict: "A",
                scope: !1,
                link: function(b, c) {
                    var d;
                    return b.copyLinkText = "Copy", b.linkVisible = !1, ZeroClipboard.config({
                        swfPath: "/assets/ZeroClipboard.swf"
                    }), d = new ZeroClipboard(c), d.on("ready", function() {
                        return b.linkVisible = !0, b.$apply(), d.on("copy", function(a) {
                            return a.clipboardData.setData("text/plain", b.paymentAddress), b.copyLinkText = "Copied", b.$apply()
                        }), d.on("aftercopy", function() {
                            return a(function() {
                                return b.copyLinkText = "Copy", b.$apply()
                            }, 2e3)
                        }), d.on("error", function() {
                            return b.$parent.linkHidden = !0, ZeroClipboard.destroy()
                        })
                    })
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daDepriciationCountdown", ["$interval", function(a) {
            return {
                restrict: "A",
                link: function(b, c, d) {
                    var e, f;
                    return b.depreciation = b.$eval(d.depreciation), b.depreciation ? (f = a(function() {
                        return e()
                    }, 1e3), (e = function() {
                        var a, c, d, e, f, g, h, i, j;
                        for (f = moment(), i = b.depreciation, j = [], d = g = 0, h = i.length; h > g; d = ++g) e = i[d], c = moment(e.start_date), a = c.diff(f), j.push(a > 0 ? b.countdown = moment.duration(a, "ms").format("dd:hh:mm:ss") : void 0);
                        return j
                    })(), b.$on("$destroy", function() {
                        return a.cancel(f)
                    })) : !1
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daDiscourseCompile", ["$compile", function(a) {
            return {
                restrict: "A",
                link: function(b, c, d) {
                    return b.$watch(function(a) {
                        return a.$eval(d.daDiscourseCompile)
                    }, function(d) {
                        return c.html(d), a(c.contents())(b)
                    })
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("filepicker", function() {
            return {
                restrict: "A",
                template: '<a href ng-transclude class="{{pickerclass}}" ng-click="pickFiles()"></a>',
                transclude: !0,
                replace: !0,
                scope: {
                    callback: "&",
                    pickerclass: "@"
                },
                link: function(scope, element, attrs) {
                    return scope.pickFiles = function() {
                        var container, path, picker_options, store_options;
                        return picker_options = {
                            container: "modal",
                            access: "public",
                            mimetype: attrs.mimetypes ? eval(attrs.mimetype) : "image/*",
                            multiple: !1
                        }, path = attrs.path ? attrs.path : "/uploads/", container = attrs.container ? attrs.container : "swarm.shandro", store_options = {
                            location: "S3",
                            path: path,
                            container: container
                        }, filepicker.pickAndStore(picker_options, store_options, function(a) {
                            return scope.$apply(function() {
                                return scope.callback({
                                    file: a
                                })
                            })
                        })
                    }
                }
            }
        })
    }.call(this),
    function() {
        window.app.directive("daHomeActionNavbar", ["$window", function(a) {
            return {
                restrict: "A",
                scope: !0,
                link: function(b, c) {
                    var d, e;
                    return e = $(a), e.on("resize", b.$apply.bind(b, d)), (d = function() {
                        var d, f, g, h, i, j;
                        return j = a.innerHeight, f = c.outerHeight(), g = c.offset().top, h = g + f, b.$parent.actionNavbar = {}, b.$parent.actionNavbar.height = f + "px", i = function(a, c) {
                            var d, e;
                            return d = a && c, e = null, d || (e = a ? c ? !1 : "bottom" : "top"), b.$parent.actionNavbar.stuck = !d, b.navbar = {
                                visible: d,
                                stickTo: e
                            }
                        }, (d = function() {
                            var b, c, d;
                            return b = a.scrollY, c = j + b >= h, d = g >= b, i(d, c)
                        })(), e.on("scroll", b.$apply.bind(b, d))
                    })()
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daImageOnLoad", function() {
            return {
                restrict: "A",
                link: function(a, b, c) {
                    return b.bind("load", function() {
                        return a.$apply(c.loadCallback)
                    })
                }
            }
        })
    }.call(this),
    function() {
        window.app.directive("daMainFooter", function() {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/footer.html",
                replace: !0,
                transclude: !0
            }
        })
    }.call(this),
    function() {
        window.app.directive("daMainHeader", ["$modal", "$route", "User", function(a, b, c) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/header.html",
                replace: !0,
                scope: !1,
                link: function(d) {
                    return d.userIsLoggedIn = function() {
                        return c.isLoggedIn()
                    }, d.$watch(function() {
                        return c.info.loaded
                    }, function(a) {
                        return a ? d.user = c : void 0
                    }), d.headerHidden = function() {
                        var a;
                        return null != (a = b.current) ? a.mainHeaderHidden : void 0
                    }, d.screenName = function() {
                        var a;
                        return null != (a = b.current) ? a.screenName : void 0
                    }, d.showLoginForm = function() {
                        return a.open({
                            templateUrl: "partials/app/modal/login.html",
                            controller: "modalLoginController"
                        })
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daMelotic", ["$timeout", function(a) {
            return {
                restrict: "A",
                scope: {
                    market: "=tradingMarket"
                },
                link: function(b, c, d) {
                    return function(a, b, c, d, e, f, g) {
                        a.MeloticAPIObject = e, a[e] = a[e] || function() {
                            (a[e].q = a[e].q || []).push(arguments)
                        }, a[e].l = 1 * new Date, f = b.createElement(c), g = b.getElementsByTagName(c)[0], f.async = 1, f.src = d, g.parentNode.insertBefore(f, g)
                    }(window, document, "script", "https://www.melotic.com/statics/api/v1.1.js", "melotic"), a(function() {
                        return melotic("embed", {
                            type: "trade",
                            market: b.market,
                            marketsSelect: !1,
                            container: d.id,
                            theme: "light"
                        })
                    }, 0)
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daModal", ["$document", "$timeout", "$window", "$modalStack", function(a, b, c, d) {
            return {
                restrict: "A",
                link: function(e, f) {
                    var g;
                    return (g = function() {
                        return b(function() {
                            return f.css({
                                "margin-top": -f.outerHeight() / 2,
                                "margin-left": -f.outerWidth() / 2
                            })
                        }, 0)
                    })(), b(function() {
                        return f.addClass("ready")
                    }, 200), $(a).on("click", ".modal.backdrop", function() {
                        return f.removeClass("ready")
                    }), e.$on("$destroy", function() {
                        return $([c, f]).off("resize", g)
                    }), $([c, f]).on("resize", g), e.$on("modal-center", g), e.fade = function(a) {
                        var c;
                        return c = d.getTop(), $(".modal.backdrop").removeClass("ready"), f.removeClass("ready"), b(function() {
                            return c && c.value.backdrop && "static" !== c.value.backdrop ? (a.preventDefault(), a.stopPropagation(), d.dismissAll()) : void 0
                        }, 200)
                    }
                }
            }
        }]), window.app.directive("daModalBackdrop", ["$timeout", "$modalStack", function(a, b) {
            return {
                restrict: "A",
                link: function(c, d) {
                    var e;
                    return e = b.getTop(), a(function() {
                        return d.addClass("ready")
                    }), c.fade = function(c) {
                        return d.removeClass("ready"), a(function() {
                            return e && e.value.backdrop && "static" !== e.value.backdrop ? (c.preventDefault(), c.stopPropagation(), b.dismissAll()) : void 0
                        }, 300)
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSocialShare", ["$timeout", function() {
            return {
                restrict: "A",
                scope: {
                    type: "=",
                    name: "=",
                    link: "=",
                    picture: "=",
                    caption: "=",
                    description: "=",
                    tags: "="
                },
                link: function(a, b) {
                    var c;
                    return b.on("click", function() {
                            return c[a.type]()
                        }), window.fbAsyncInit = function() {
                            return FB.init({
                                appId: "1462959267300367",
                                xfbml: !0,
                                version: "v2.1"
                            })
                        },
                        function(a, b, c) {
                            var d, e;
                            return e = a.getElementsByTagName(b)[0], a.getElementById(c) ? void 0 : (d = a.createElement(b), d.id = c, d.src = "//connect.facebook.net/en_US/sdk.js", e.parentNode.insertBefore(d, e))
                        }(document, "script", "facebook-jssdk"), c = {
                            facebook: function() {
                                var b, c, d, e, f, g;
                                if (d = "", a.tags.length > 1)
                                    for (g = a.tags, c = e = 0, f = g.length; f > e; c = ++e) b = g[c], d += c > 0 ? " #" + b : " #" + b;
                                else d = "#" + a.tags[0];
                                return FB.ui({
                                    method: "feed",
                                    name: a.name,
                                    link: a.link,
                                    picture: a.picture,
                                    caption: a.caption,
                                    description: a.description + d,
                                    message: ""
                                })
                            },
                            twitter: function() {
                                var b, c, d, e, f, g;
                                return e = "", d = encodeURIComponent(a.link), g = 580, b = 300, c = screen.width / 2 - g / 2, f = screen.height / 2 - b / 2, window.open("http://twitter.com/share?text=" + a.description + "&url=" + d + "&hashtags=" + a.tags, "", "height=" + b + ", width=" + g + ", top=" + f + ", left=" + c + ", toolbar=0, location=0, menubar=0, directories=0, scrollbars=0")
                            },
                            googleplus: function() {
                                var b, c, d, e, f;
                                return d = encodeURIComponent(a.link), f = 580, b = 300, c = screen.width / 2 - f / 2, e = screen.height / 2 - b / 2, window.open("https://plus.google.com/share?url=" + d, a.description, "height=" + b + ", width=" + f + ", top=" + e + ", left=" + c + ", toolbar=0, location=0, menubar=0, directories=0, scrollbars=0")
                            }
                        }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSpinner", ["$timeout", function(a) {
            return {
                restrict: "A",
                templateUrl: "partials/app/components/spinner.html",
                replace: !0,
                link: function(b, c) {
                    return a(function() {
                        return c.addClass("ready")
                    }, 200)
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSwitch", function() {
            return {
                restrict: "A",
                templateUrl: "partials/app/components/switch.html",
                replace: !0,
                scope: {
                    state: "=",
                    label: "=",
                    trigger: "="
                }
            }
        })
    }.call(this),
    function() {
        window.app.directive("daValidateWalletInput", ["Wallet", function(a) {
            return {
                restrict: "A",
                require: "ngModel",
                link: function(b, c, d, e) {
                    return e.$parsers.unshift(function(b) {
                        var c;
                        return c = b ? a.check(b) : !1, e.$setValidity("address", c), null != c ? c : {
                            value: void 0
                        }
                    }), e.$formatters.unshift(function(b) {
                        var c;
                        return c = b ? a.check(b) : !1, e.$setValidity("address", c), b
                    })
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("youtubeId", ["$sce", function(a) {
            return {
                restrict: "A",
                templateUrl: "partials/app/components/youtube.html",
                replace: !0,
                scope: {},
                link: function(b, c, d) {
                    return b.id = d.youtubeId, b.width = d.width, b.height = d.height, b.trustSrc = function(b) {
                        return a.trustAsResourceUrl(b)
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daProductCompany", function() {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/cms/product-company.html",
                replace: !0
            }
        })
    }.call(this),
    function() {
        window.app.directive("daProductDescription", ["$timeout", "$sce", "$filter", "s3bucket", function(a, b, c, d) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/cms/product-description.html",
                replace: !0,
                link: function(a) {
                    var e, f;
                    return e = {
                        name: 0,
                        type: "",
                        value: ""
                    }, a.$watch(function() {
                        return a.projectLoaded
                    }, function(b) {
                        return b ? a.projectDescription = [] : void 0
                    }), a.trustSrc = function(a) {
                        return b.trustAsResourceUrl(a)
                    }, a.addDescriptionVideo = function() {
                        var b, c;
                        return a.descriptionNotFilledIn = !0, b = a.projectDescription.length, c = angular.copy(e), c.name += b, c.type = "video", a.projectDescription.push(c), f(b)
                    }, a.addDescriptionImage = function(b) {
                        var c;
                        return c = {}, c.type = "image", c.value = b[0].url, c.s3 = d + b[0].key, a.projectData.description.push(c), a.$broadcast("projectDataUpdated")
                    }, a.addDescriptionText = function() {
                        var b, c;
                        return a.descriptionNotFilledIn = !0, b = a.projectDescription.length, c = angular.copy(e), c.name += b, c.type = "text", a.projectDescription.push(c)
                    }, a.saveParagraph = function(b, d) {
                        var e, f;
                        return e = a.form["projectDescription_" + d], e.$setSubmitted(), f = {}, f.type = b.type, f.value = b.value, "video" === b.type && (f.value = c("youtubeEmbedURL")(b.value) || c("vimeoEmbedURL")(b.value)), e.$valid ? (a.projectDescription[d].filledIn = !0, a.projectData.description.push(f), a.descriptionNotFilledIn = !1, a.$broadcast("projectDataUpdated")) : void 0
                    }, a.deleteParagraph = function(b) {
                        return a.projectData.description.splice(b, 1)
                    }, f = function(b) {
                        return a.$watch(function() {
                            return a.form["projectDescription_" + b]
                        }, function(a) {
                            return a ? (a["descriptionVideo_" + b].$parsers.unshift(function(d) {
                                var e;
                                return e = d ? c("youtubeVideoURL")(d) || c("vimeoVideoURL")(d) : void 0, a["descriptionVideo_" + b].$setValidity("video", e), e ? d : void 0
                            }), a["descriptionVideo_" + b].$formatters.unshift(function(d) {
                                var e;
                                return e = d ? c("youtubeVideoURL")(d) || c("vimeoVideoURL")(d) : void 0, a["descriptionVideo_" + b].$setValidity("video", e), d
                            })) : void 0
                        })
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daProductFaq", ["$timeout", function() {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/cms/product-faq.html",
                replace: !0,
                link: function(a) {
                    var b;
                    return b = {
                        name: 0,
                        question: "",
                        answer: ""
                    }, a.$watch(function() {
                        return a.projectData.faq
                    }, function(b) {
                        return b && !a.faqs ? a.faqs = [] : void 0
                    }), a.addFaq = function() {
                        var c, d;
                        return a.faqNotFilledIn = !0, c = a.faqs.length, d = angular.copy(b), d.name += c, a.faqs.push(d)
                    }, a.saveFaq = function(b, c) {
                        var d, e;
                        return d = a.form["projectFaq_" + c], d.$setSubmitted(), e = {}, e.question = b.question, e.answer = b.answer, d.$valid ? (a.faqs[c].filledIn = !0, angular.isDefined(b.editModeIndex) ? a.projectData.faq[b.editModeIndex] = b : a.projectData.faq.push(e), a.faqNotFilledIn = !1) : void 0
                    }, a.editFaq = function(c) {
                        var d, e;
                        return a.faqNotFilledIn = !0, d = a.projectData.faq[c], e = angular.copy(b), e.name = a.faqs.length, e.question = d.question, e.answer = d.answer, e.editModeIndex = c, a.faqs.push(e)
                    }, a.cancelFaqEdit = function(b) {
                        return a.faqs.splice(b, 1), a.faqNotFilledIn = !1
                    }, a.deleteFaq = function(b) {
                        return a.projectData.faq.splice(b, 1)
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSalePhases", ["$timeout", "$filter", function(a, b) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/cms/sale-phases.html",
                replace: !0,
                scope: "=",
                link: function(c) {
                    var d, e, f;
                    return c.salePhases = [], f = {
                        name: 0,
                        phaseName: "",
                        startDate: "",
                        startTime: "",
                        endDate: "",
                        endTime: "",
                        startPrice: "",
                        endPrice: ""
                    }, c.today = new Date, c.$watchCollection(function() {
                        return c.projectData.assets
                    }, function(a) {
                        var b;
                        return a ? (b = c.projectData.project_coin, c.projectData.assets[b].pricing || (c.projectData.assets[b].pricing = []), c.phasesOnline = c.projectData.assets[b].pricing) : void 0
                    }), c.addSalePhase = function() {
                        var a, b;
                        return c.saleNotFilledIn = !0, b = c.salePhases.length, a = angular.copy(f), a.name += b, c.salePhases.push(a), d(a.name)
                    }, c.saveSalePhase = function(a, d) {
                        var e, f, g, h, i, j, k, l;
                        if (f = c.form["salePhases_" + d], f.$setSubmitted(), f["startDate_" + a.name].$validate(), f["endDate_" + a.name].$validate(), f["startPrice_" + a.name].$validate(), f["endPrice_" + a.name].$validate(), i = moment(a.startDate), e = moment(a.endDate), h = {}, h.name = a.phaseName, h.start_date = i.toISOString(), h.end_date = e.toISOString(), h.start_rate = b("btcToSatoshi")(a.startPrice), h.end_rate = b("btcToSatoshi")(a.endPrice), f.$valid) {
                            for (c.salePhases[d].filledIn = !0, angular.isDefined(a.editModeIndex) ? c.phasesOnline[a.editModeIndex] = h : c.phasesOnline.push(h), l = c.phasesOnline, g = j = 0, k = l.length; k > j; g = ++j) {
                                a = l[g], "initial" === a.type && c.deleteSalePhase(g);
                                break
                            }
                            return c.saleNotFilledIn = !1, c.editModeSaleStartDate = null
                        }
                    }, c.editSalePhase = function(a) {
                        var e, g;
                        return c.saleNotFilledIn = !0, e = c.phasesOnline[a], c.editModeSaleStartDate = e.start_date, g = angular.copy(f), g.name = c.salePhases.length, g.phaseName = e.name, g.startDate = e.start_date, g.startTime = e.start_date, g.endDate = e.end_date, g.endTime = e.end_date, g.startPrice = b("satoshiToBTC")(e.start_rate), g.endPrice = b("satoshiToBTC")(e.end_rate), g.editModeIndex = a, c.salePhases.push(g), d(g.name)
                    }, c.cancelSalePhaseEdit = function(a) {
                        return c.salePhases.splice(a, 1), c.saleNotFilledIn = !1, c.editModeSaleStartDate = null
                    }, c.deleteSalePhase = function(a) {
                        var b;
                        return c.phasesOnline.splice(a, 1), c.phasesOnline.length ? void 0 : (b = {}, b.start_date = c.projectData.sale_dates.mainsale_start_date, b.end_date = c.projectData.sale_dates.mainsale_end_date, b.start_rate = c.projectData.project_initial_coin_price, b.end_rate = c.projectData.project_initial_coin_price, b.type = "initial", c.phasesOnline.push(b))
                    }, c.phaseDates = function(a) {
                        var b, c;
                        return c = moment(a.start_date).format("MM.DD"), b = moment(a.end_date).format("MM.DD"), "(" + c + " - " + b + ")"
                    }, d = function(b) {
                        return a(function() {
                            var a;
                            return a = c.form["salePhases_" + b], a["startDate_" + b].$validate(), a["endDate_" + b].$validate(), a["startPrice_" + b].$parsers.unshift(function(c) {
                                var d;
                                return d = c ? e(c) : void 0, a["startPrice_" + b].$setValidity("price", d), d ? c : void 0
                            }), a["startPrice_" + b].$formatters.unshift(function(c) {
                                var d;
                                return d = c ? e(c) : void 0, a["startPrice_" + b].$setValidity("price", d), c
                            }), a["endPrice_" + b].$parsers.unshift(function(c) {
                                var d;
                                return d = c ? e(c) : void 0, a["endPrice_" + b].$setValidity("price", d), d ? c : void 0
                            }), a["endPrice_" + b].$formatters.unshift(function(c) {
                                var d;
                                return d = c ? e(c) : void 0, a["endPrice_" + b].$setValidity("price", d), c
                            })
                        }, 0)
                    }, e = function(a) {
                        return !isNaN(parseFloat(a)) && isFinite(a)
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSidebarAddProject", ["$timeout", "$location", "Sidebar", "Wallet", "Project", "User", function(a, b, c, d, e, f) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/sidebar-add-project.html",
                replace: !0,
                link: function(c) {
                    var g, h;
                    return c.loading = !0, c.today = new Date, e.getList().then(function(a) {
                        return c.loading = !1, c.projects = a
                    }), c.projectData = {}, c.receivingAddress = d["new"](), c.vendingAddress = d["new"](), c.projectData.payment_address = c.receivingAddress, c.projectData.vending_address = c.vendingAddress, c.updateLogo = function(a) {
                        return c.projectData.project_logo = a[0].url, c.$broadcast("projectDataUpdated")
                    }, c.updateCover = function(a) {
                        return c.projectData.project_cover = a[0].url, c.$broadcast("projectDataUpdated")
                    }, c.createProject = function() {
                        var d;
                        return d = c.form.cms.projectBasics, d.$setSubmitted(), d.$valid ? (c.projectData.project_owner = f.info.id, e.create(c.projectData.project_name, c.projectData).then(function() {
                            return c.$parent.project = c.projectData.project_name, f.update({
                                project: c.projectData.project_name
                            }).then(function() {
                                return a(function() {
                                    return b.path("/projects/" + c.$parent.project), c.$parent.sidebar.hide(), a(function() {
                                        return location.reload()
                                    }, 500)
                                }, 100)
                            })
                        })) : void 0
                    }, (g = function() {
                        var a;
                        return a = c.form.cms.projectBasics, a.projectName.$parsers.unshift(function(b) {
                            var c;
                            return c = b ? h(b) : !1, a.projectName.$setValidity("name", c), c ? b : void 0
                        }), a.projectName.$formatters.unshift(function(b) {
                            var c;
                            return c = b ? h(b) : !1, a.projectName.$setValidity("name", c), b
                        })
                    })(), h = function(a) {
                        return a = a.trim().toLowerCase(), a.split(" ").length > 1 ? !1 : -1 === c.projects.indexOf(a)
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSidebarCms", ["$timeout", "$location", "$route", "User", "Wallet", "Project", function(a, b, c, d, e, f) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/sidebar-cms.html",
                replace: !0,
                link: function(a) {
                    return b.path("/projects/" + d.info.project), a.projectLoaded = !1, a.projectData || (a.projectData = {}, f.get(a.$parent.project || d.info.project).then(function(b) {
                        return b.$bindTo(a, "projectData").then(function() {
                            return a.projectLoaded = !0, a.projectData.description || (a.projectData.description = []), a.projectData.faq ? void 0 : a.projectData.faq = []
                        })
                    })), a.updateSalePhases = function(b) {
                        return a.projectData.assets[assetName].pricing = b
                    }, a.updateLogo = function(b) {
                        return a.projectData.project_logo = b[0].url, a.$broadcast("projectDataUpdated")
                    }, a.updateCover = function(b) {
                        return a.projectData.project_cover = b[0].url, a.$broadcast("projectDataUpdated")
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSidebarDco", ["$q", "$timeout", "$compile", "Project", function(a, b, c, d) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/sidebar-dco.html",
                replace: !0,
                link: function(b) {
                    return b.loading = b.userDCO ? !1 : !0, b.project = null, b.editMode = !1, b.createMode = !1, b.projectData = {}, b.projectPublished = !1, b.getDCO = function(c) {
                        var e;
                        return e = a.defer(), d.getUserDCO().then(function(a) {
                            return b.userDCO = a, b.loaderTrigger(!1), e.resolve()
                        }), c ? e.promise : void 0
                    }, b.createProject = function() {
                        return b.createModeTrigger(!0)
                    }, b.selectProject = function(a) {
                        return b.loaderTrigger(!0), d.getDCO(a.$value).then(function(a) {
                            return a.$bindTo(b, "project").then(function(a) {
                                return angular.copy(b.project, b.projectData), b.unbindProject = a, b.loaderTrigger(!1)
                            })
                        })
                    }, b.editModeTrigger = function(a) {
                        return b.editMode = a
                    }, b.createModeTrigger = function(a) {
                        return b.createMode = a
                    }, b.loaderTrigger = function(a) {
                        return b.loading = a
                    }, b.projectCleanup = function() {
                        return angular.isDefined(b.unbindProject) && b.unbindProject(), b.project = null, b.projectData = null
                    }, b.updateProjectData = function(a) {
                        return b.projectData = a
                    }, b.getDCO(), b.$on("newDCOProject", function() {
                        return b.createProject()
                    })
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSidebarUser", ["$rootScope", "$timeout", "$modal", "User", "Wallet", "Sidebar", "Voting", function(a, b, c, d, e, f, g) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/sidebar-user.html",
                replace: !0,
                link: function(a) {
                    var h;
                    return h = function() {
                        return a.userInfo = angular.copy(d.info), a.haveToSignUp = a.userInfo.votingWallet, a.$watch(function() {
                            return a.form
                        }, function(b) {
                            var c, d, e, f, g;
                            return b ? (a.userInfoForm = a.form.userInfo, a.userSignupForm = a.form.userSignup, a.userForm = a.haveToSignUp ? a.userSignupForm : a.userInfoForm, a.userForm.$setPristine(), a.formFields = {
                                firstName: null != (c = a.userForm) ? c.firstName : void 0,
                                lastName: null != (d = a.userForm) ? d.lastName : void 0,
                                email: null != (e = a.userForm) ? e.email : void 0,
                                password: null != (f = a.userForm) ? f.password : void 0,
                                newPassword: null != (g = a.userForm) ? g.newPassword : void 0
                            }) : void 0
                        })
                    }, a.$watch(function() {
                        return d.info.loaded
                    }, function(b) {
                        return a.userInfo = angular.copy(d.info), b ? h() : void 0
                    }), a.haveToSignUp = !1, a.loading = !1, a.formSubmitted = !1, a.editMode = !1, a.changePasswordMode = !1, a.walletDownloaded = !1, a.userWallet = e["new"](), a.userForm = {}, a.formFields = {}, a.$watch(function() {
                        return d.info.votingWallet
                    }, function(b) {
                        return a.haveToSignUp = b
                    }), a.toggleEditMode = function() {
                        return a.editMode = !a.editMode, a.changePasswordMode = !1, a.userForm.$setPristine()
                    }, a.cancelEdit = function() {
                        return a.toggleEditMode(), a.userInfo = angular.copy(d.info)
                    }, a.changePassword = function() {
                        return a.changePasswordMode = !a.changePasswordMode
                    }, a.formSubmit = function() {
                        return "form.userSignup" === a.userForm.$name ? a.userSignupFormSubmit() : a.editMode ? a.changePasswordMode ? a.newPasswordFormSubmit() : a.userInfoFormSubmit() : a.toggleEditMode()
                    }, a.userInfoFormSubmit = function() {
                        return a.userInfoForm.$pristine ? a.toggleEditMode() : (a.formSubmitted = !0, a.userForm.$valid ? (a.loading = !0, d.login(a.formFields.email.$viewValue, a.formFields.password.$viewValue).then(function() {
                            var b;
                            return b = {
                                first_name: a.formFields.firstName.$viewValue,
                                last_name: a.formFields.lastName.$viewValue,
                                email: a.formFields.email.$viewValue
                            }, d.update(b).then(function() {
                                return a.toggleEditMode(), a.formSubmitted = !1, a.loading = !1
                            })
                        }).then(null, function(b) {
                            return "INVALID_PASSWORD" === b.code && (a.formFields.password.$setValidity("incorrect", !1), a.formFields.password.customError = !0, a.formFields.password.errorMessage = "Invalid password."), a.loading = !1, a.formSubmitted = !1
                        })) : void 0)
                    }, a.userSignupFormSubmit = function() {
                        return a.formSubmitted = !0, a.userForm.$valid ? (a.loading = !0, a.submittedFormFields = angular.copy(a.formFields), a.confirmWalletDownload()) : void 0
                    }, a.newPasswordFormSubmit = function() {
                        return a.formSubmitted = !0, a.userForm.$valid ? (a.loading = !0, d.updatePassword(a.formFields.password.$viewValue, a.formFields.newPassword.$viewValue).then(function() {
                            return a.toggleEditMode(), a.formSubmitted = !1, a.loading = !1
                        }).then(null, function(b) {
                            return "INVALID_PASSWORD" === b.code && (a.formFields.password.$setValidity("incorrect", !1), a.formFields.password.customError = !0, a.formFields.password.errorMessage = "Invalid password."), a.loading = !1, a.formSubmitted = !1
                        })) : void 0
                    }, a.hasError = function(b) {
                        var c, d, e, f, g;
                        return (null != b ? b.$touched : void 0) && (null != b ? b.$invalid : void 0) || a.formSubmitted && (null != b ? b.$invalid : void 0) ? ((null != b ? b.customError : void 0) || (null != (c = a.formFields.firstName) && (c.errorMessage = a.formFields.firstName.$invalid ? "First name is required." : null), null != (d = a.formFields.lastName) && (d.errorMessage = a.formFields.lastName.$invalid ? "Last name is required." : null), null != (e = a.formFields.email) && (e.errorMessage = a.formFields.email.$invalid ? "Valid email is required." : null), null != (f = a.formFields.password) && (f.errorMessage = a.formFields.password.$invalid ? "Password is required." : null), null != (g = a.formFields.newPassword) && (g.errorMessage = a.formFields.newPassword.$invalid ? "New password is required." : null)), !0) : void 0
                    }, a.resetPasswordValidity = function() {
                        return a.formFields.password.$setValidity("incorrect", !0), a.formFields.password.customError = !1
                    }, a.downloadWallet = function() {
                        return e.pdf(a.userWallet), b(function() {
                            return a.walletDownloaded = !0
                        }, 500)
                    }, a.confirmWalletDownload = function() {
                        return a.service = "sidebarUser", c.open({
                            scope: a,
                            templateUrl: "partials/app/modal/wallet-download-confirmation.html",
                            controller: "WalletDownloadConfirmController"
                        })
                    }, a.$on("paperWalletDownloaded", function(b, e) {
                        return "sidebarUser" === e ? d.updatePassword(d.info.temporaryPassword, a.formFields.password.$viewValue).then(function() {
                            return d.update({
                                first_name: a.submittedFormFields.firstName.$viewValue,
                                last_name: a.submittedFormFields.lastName.$viewValue,
                                temporaryPassword: null,
                                votingWallet: null
                            }).then(function() {
                                return g.userVotings().then(function(a) {
                                    var b, c, e, f;
                                    for (f = [], c = 0, e = a.length; e > c; c++) b = a[c], f.push(g.signUser(d.info.id, b.$value));
                                    return f
                                })
                            }).then(function() {
                                return a.loading = !1, a.formSubmitted = !1, f.switchSection("User"), d.info.votings ? c.open({
                                    templateUrl: "partials/app/modal/notification.html",
                                    controller: "modalNotificationController",
                                    resolve: {
                                        notificationData: function() {
                                            return {
                                                text: "Thank you for registering. We will contact you by email when you are able to vote."
                                            }
                                        }
                                    }
                                }) : void 0
                            })
                        }) : void 0
                    })
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSidebarVotingAdmin", ["$q", "$sce", "$timeout", "Voting", "User", "Wallet", "Counterparty", function(a, b, c, d, e, f, g) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/sidebar-voting-admin.html",
                replace: !0,
                link: function(b) {
                    var c, h, i, j;
                    return b.voting = "", b.newVoting = null || (null != (j = window.daDebug) ? j.createNewVotingMode : void 0), b.loading = !1, b.votingOptions = [{
                        name: "option1",
                        value: ""
                    }, {
                        name: "option2",
                        value: ""
                    }], b.today = new Date, b.votingOptionsView = !0, b.votingInviteesView = !1, b.expectingPayment = !1, b.paymentReceived = !1, b.votingCreated = !1, b.$watch(function() {
                        return e.info
                    }, function(a) {
                        return a.loaded ? b.userInfo = e.info : void 0
                    }), b.parseEmails = function(a) {
                        var c, d, e, f, g, h, i, j, k, l, m, n;
                        for (e = (null != a ? a.split("\n") : void 0) || "", c = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, h = [], j = function(a, b) {
                                var d;
                                return d = b.split(","), d.length > 1 ? h = h.concat(d.filter(function(a) {
                                    return c.test(a.trim())
                                })) : c.test(b.trim()) ? h.push(b.trim()) : void 0
                            }, d = k = 0, m = e.length; m > k; d = ++k) i = e[d], j(d, i);
                        for (g = [], l = 0, n = h.length; n > l; l++) f = h[l], f = f.trim(), g.indexOf(f) < 0 && g.push(f);
                        return b.inviteesCount = g.length, g
                    }, i = function(a) {
                        var b, c;
                        return b = new Date, c = Date.parse(b) / 1e3, a = a.replace(/[^a-zA-Z ]/g, ""), a = a.replace(RegExp(" ", "g"), "_"), a += c
                    }, c = function() {
                        var c, d;
                        return c = a.defer(), d = b.parseEmails(b.form.addVoting.votingInvitees.$viewValue), b.voting.votingInvitees = d.join(), d.length < 2 ? (b.form.addVoting.votingInvitees.$setValidity("incorrect", !1), b.form.addVoting.votingInvitees.customError = !0, b.form.addVoting.votingInvitees.errorMessage = "At least two invitees required.", b.formSubmitted = !1, c.reject()) : d.length > 25 ? (b.form.addVoting.votingInvitees.$setValidity("incorrect", !1), b.form.addVoting.votingInvitees.customError = !0, b.form.addVoting.votingInvitees.errorMessage = 'The public version of Swarm vote only allows for 25 invitees on a vote. Contact <a href="mailto:support@swarm.fund">support@swarm.fund</a> if you require more than this.', b.formSubmitted = !1, c.reject()) : c.resolve(d), c.promise
                    }, h = function(f) {
                        var g;
                        return b.tmpInviteesObj = {}, b.tmpInvitees = [], g = a.defer(), b.tmpInviteesCount = 0, e.getAllUsers().then(function() {
                            return c().then(function(a) {
                                return b.tmpInvitees = a, angular.forEach(a, function(a) {
                                    var c, g, h, i;
                                    return c = a.trim().toLowerCase(), h = e.generatePassphrase(6), g = e.encodePassword(h), i = {
                                        votingWallet: !0,
                                        email: c,
                                        temporaryPassword: g
                                    }, e.create(c, h, i).then(function(a) {
                                        var c;
                                        return c = a.uid, b.tmpInviteesObj[c] = {
                                            email: a.email,
                                            signed: !1,
                                            voted: !1
                                        }, e.emailNotification({
                                            login: a.email,
                                            password: a.passphrase
                                        }, "votingwalletinvite"), b.tmpInviteesCount = b.tmpInviteesCount + 1, d.inviteUser(c, f)
                                    }).then(null, function(a) {
                                        return "EMAIL_TAKEN" === a.code ? (c = a.userData.email.toLowerCase(), e.emailNotification({
                                            login: c,
                                            voting: f
                                        }, "invite-existing-user-to-vote"), e.allUsers.forEach(function(a, g) {
                                            return a.email === c ? (a.wallet ? d.signUser(g, f) : (i = {
                                                votingWallet: !0
                                            }, e.update(i, g)), b.tmpInviteesObj[g] = {
                                                email: a.email,
                                                signed: !0,
                                                voted: !1
                                            }, b.tmpInviteesCount = b.tmpInviteesCount + 1, d.inviteUser(g, f), !1) : void 0
                                        })) : void 0
                                    })
                                })
                            }), b.$watch(function() {
                                return b.tmpInviteesCount
                            }, function(a) {
                                return a === b.tmpInvitees.length ? g.resolve(b.tmpInviteesObj) : void 0
                            })
                        }), g.promise
                    }, d.getVotings(!0).then(function(a) {
                        return b.votings = a, b.loading = !1
                    }).then(null, function() {
                        return b.votings = null, b.loading = !1
                    }), b.switchOptionsAndUsersView = function() {
                        return b.votingOptionsView = !b.votingOptionsView, b.votingInviteesView = !b.votingInviteesView
                    }, b.selectVoting = function(a) {
                        var c, e, f, g, h, i, j;
                        g = 0, j = a.invitees;
                        for (e in j) f = j[e], f && g++;
                        c = a.asset, i = a.options;
                        for (h in i) d.getVotesCount(h, c, !0).then(function(a) {
                            var b;
                            return a.balance ? (b = a.balance / g * 100, i[a.address].votesCount = Math.round(100 * b) / 100) : i[a.address].votesCount = 0
                        });
                        return b.title = a.title, b.voting = a
                    }, b.backToVotes = function() {
                        return b.voting = null, b.title = null
                    }, b.addNewVoting = function() {
                        return b.newVoting = !0
                    }, b.cancelAddingVoting = function() {
                        return b.newVoting = !1
                    }, b.createVoting = function() {
                        var a, j, k;
                        return a = b.form.addVoting, b.formSubmitted = !0, j = function() {
                            var a, c, d, e, g;
                            e = {}, g = b.votingOptions;
                            for (a in g) c = g[a], d = f["new"]()["public"], e[d] = {
                                address: d,
                                bio: c.value
                            };
                            return e
                        }, a.$valid ? (k = i(a.votingName.$viewValue), b.votingWallet = f["new"](), c().then(function(c) {
                            var f, i, l;
                            return i = {
                                paid: !1,
                                description: a.votingDescription.$viewValue,
                                multiple: (null != (l = a.votingMultiple) ? l.$viewValue : void 0) || 1,
                                end_date: moment.utc(a.votingEndDate.$viewValue).format(),
                                id: k,
                                invitees: c,
                                options: j(),
                                owner: e.info.id,
                                start_date: moment.utc(a.votingStartDate.$viewValue).format(),
                                title: a.votingName.$viewValue,
                                wallet: b.votingWallet
                            }, f = c.length, d.create(i).then(function() {
                                var c, i;
                                return d.inviteUser(e.info.id, k), b.expectingPayment = !0, c = (null != (i = a.votingMultiple) ? i.$viewValue : void 0) || 1, b.payForUsers = 3e5 * b.inviteesCount * c + 1e5, b.paymentValue = b.payForUsers + 1e5, d.getPayment(b.votingWallet["public"], b.paymentValue).then(function() {
                                    var a, e;
                                    return b.paymentReceived = !0, b.expectingPayment = !1, b.loading = !0, e = new g(b.votingWallet["private"]), a = e.generateFreeAssetName(), e.issueAsset(f * c, a).then(function() {
                                        return h(k).then(function(c) {
                                            return d.create({
                                                paid: !0,
                                                id: k,
                                                asset: a,
                                                invitees: c
                                            }).then(function() {
                                                return d.getVotings().then(function(a) {
                                                    return b.votings = a, b.voting = null, b.loading = !1, b.newVoting = !1, b.formSubmitted = !1
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })) : void 0
                    }, b.removeOption = function(a) {
                        var c;
                        return a > 1 ? (c = b.votingOptions, c.splice(a, 1), b.votingOptions = c) : void 0
                    }, b.addOption = function() {
                        var a;
                        return a = b.votingOptions, a.push({
                            name: "option" + (a.length + 1),
                            value: ""
                        }), b.votingOptions = a
                    }, b.hasError = function(a) {
                        var c, d, e, f, g, h;
                        return c = b.form.addVoting, (null != a ? a.$touched : void 0) && (null != a ? a.$invalid : void 0) || b.formSubmitted && (null != a ? a.$invalid : void 0) ? ((null != a ? a.customError : void 0) || (null != (d = c.votingName) && (d.errorMessage = c.votingName.$invalid ? "Title is required." : null), null != (e = c.votingDescription) && (e.errorMessage = c.votingDescription.$invalid ? "Description is required." : null), null != (f = c.votingInvitees) && (f.errorMessage = c.votingInvitees.$invalid ? "Invitees are required." : null), null != (g = c.votingStartDate) && (g.errorMessage = c.votingStartDate.$invalid ? "Start date is required." : null), null != (h = c.votingEndDate) && (h.errorMessage = c.votingEndDate.$invalid ? "End date is required." : null), a.$name.indexOf("option") > -1 && (a.errorMessage = a.$invalid ? "Option is required." : null)), !0) : void 0
                    }, b.resetInvitesValidity = function() {
                        return b.form.addVoting.votingInvitees.$setValidity("incorrect", !0), b.form.addVoting.votingInvitees.customError = !1
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSidebarVoting", ["$modal", "Wallet", "User", "Voting", "Counterparty", function(a, b, c, d, e) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/sidebar-voting.html",
                replace: !0,
                link: function(f) {
                    var g, h;
                    return g = require("bitcore"), f.secredAccepted = !1 || (null != (h = window.daDebug) ? h.votingSecretAccepted : void 0), f.voting = null, f.$watch(function() {
                        return c.info
                    }, function(a) {
                        return a.loaded ? f.userInfo = c.info : void 0
                    }), f.$watch(function() {
                        return c.info.privateKey
                    }, function(a) {
                        return a ? f.secredAccepted = c.info.privateKey : void 0
                    }), f.$watch(function() {
                        return f.secredAccepted
                    }, function(a) {
                        return a ? d.getVotings().then(function(a) {
                            return f.votings = a
                        }).then(null, function() {
                            return f.votings = null, f.loading = !1
                        }) : void 0
                    }), f.checkSecret = function() {
                        var a, d, e, h, i, j, k;
                        return i = f.form.secret.accessSecret, h = i.$viewValue || "", h.indexOf(" ") >= 0 ? (e = null != (j = b.fromPassphrase(h)) ? j["public"] : void 0, d = null != (k = b.fromPassphrase(h)) ? k["private"] : void 0) : (52 === h.length && (a = g.PrivateKey.fromWIF(h)), e = null != a ? a.toAddress().toString() : void 0, d = h), e ? (i.$setValidity("incorrect", !0), e !== c.info.wallet ? (i.$setValidity("incorrect", !1), i.errorMessage = "Private key or passphrase is correct, but isn't paired with current user account. Please contact support.") : angular.extend(c.info, {
                            privateKey: d
                        })) : (i.$setValidity("incorrect", !1), i.customError = !0, i.errorMessage = "Invalid private key or passphrase.")
                    }, f.backToVotes = function() {
                        return f.voting = null
                    }, f.selectVoting = function(a) {
                        var b, e, g, h, i;
                        return f.loading = !0, h = a.multiple, g = function() {
                            var b, c, d, e;
                            d = 0, e = a.invitees;
                            for (b in e) c = e[b], d++;
                            return d
                        }, b = a.asset, i = a.options, (e = function() {
                            var e, j, k;
                            j = 0, f.$watch(function() {
                                return 1 === h && a.invitees[c.info.id].voted || j >= h
                            }, function(b) {
                                return a.votingDone = b ? !0 : !1
                            });
                            for (e in i)(null != (k = i[e].votes) ? k[c.info.id] : void 0) && (a.options[e].voted = !0, j++), d.getVotesCount(e, b, !0).then(function(a) {
                                var b;
                                return a.balance ? h > 1 ? (b = 100 * a.balance / (h * g()), i[a.address].votesCount = Math.round(100 * b) / 100) : (b = a.balance / g() * 100, i[a.address].votesCount = Math.round(100 * b) / 100) : i[a.address].votesCount = 0
                            });
                            return 1 === h && a.invitees[c.info.id].voted || j >= h ? (a.votingDone = !0, f.title = a.title, f.voting = a, f.loading = !1) : c.getAsset(a.asset).then(function(b) {
                                return f.title = a.title, f.voting = a, f.canVote = b > 0, f.loading = !1
                            }).then(null, function() {
                                return f.canVote = !1, f.loading = !1
                            })
                        })(), a.$watch(function(a) {
                            return a ? e() : void 0
                        })
                    }, f.vote = function(b) {
                        var g, h;
                        if (b.voted || f.voting.votingDone) return !1;
                        if (b.confirmVote) return f.loading = !0, d.markUserAsVoted(c.info.id, f.voting.$id), new e(c.info.privateKey).sendAsset({
                            destination: b.address,
                            asset: f.voting.asset,
                            quantity: 1
                        }).then(function() {
                            return d.markOptionAsVoted(c.info.id, f.voting.$id, b.address).then(function() {
                                return d.markUserAsVoted(c.info.id, f.voting.$id).then(function() {
                                    return f.selectVoting(f.voting), f.loading = !1
                                })
                            })
                        }).then(null, function() {
                            return d.markUserAsNotVoted(c.info.id, f.voting.$id), a.open({
                                templateUrl: "partials/app/modal/notification.html",
                                controller: "modalNotificationController",
                                resolve: {
                                    notificationData: function() {
                                        return {
                                            text: 'Something went wrong. Please contact our <a href="mailto:support@swarmcorp.com">support team</a>.'
                                        }
                                    }
                                }
                            }), b.confirmVote = !1, b.voted = !0
                        });
                        h = f.voting.options;
                        for (g in h) h[g].confirmVote = !1;
                        return b.confirmVote = !0
                    }, f.toggleOptionAddress = function(a) {
                        return a.addressVisible = !a.addressVisible
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSidebarWallet", ["$rootScope", "$timeout", "$modal", "User", "Wallet", function(a, b, c, d, e) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/sidebar-wallet.html",
                replace: !0,
                link: function(a) {
                    return a.editMode = !1, a.$watchCollection(function() {
                        return d.info
                    }, function(b) {
                        return b.loaded ? (a.userInfoLoaded = !0, a.userInfo = d.info, a.userWallet = angular.copy(d.info.wallet)) : void 0
                    }), a.$watch("userWallet", function(c) {
                        return c ? (a.editMode = !1, a.loading = !0, e.getAssets(c).then(function(c) {
                            return b(function() {
                                return a.assets = c, a.loading = !1
                            }, 0)
                        })) : void 0
                    }), a.isAddressValid = function() {
                        return e.check(a.form.userWallet.wallet.$viewValue)
                    }, a.createWallet = function() {
                        return a.newUserWallet = e["new"](), e.pdf(a.newUserWallet), b(function() {
                            var b;
                            return b = a.$new(), b.userWallet = a.newUserWallet, c.open({
                                scope: b,
                                templateUrl: "partials/app/modal/wallet-download-confirmation.html",
                                controller: "WalletDownloadConfirmController"
                            })
                        }, 500)
                    }, a.formSubmit = function() {
                        var b;
                        return b = a.form.userWallet, b.$valid ? (a.loading = !0, d.update({
                            wallet: b.wallet.$viewValue
                        }).then(function() {
                            return a.editMode = !1, a.form.userWallet.$pristine ? a.loading = !1 : void 0
                        })) : void 0
                    }, a.$on("paperWalletDownloaded", function() {
                        return a.userWallet = a.newUserWallet["public"]
                    }), a.toggleEditMode = function() {
                        return a.editMode = !a.editMode
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSidebar", ["User", "Sidebar", function(a, b) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/sidebar.html",
                replace: !0,
                scope: !1,
                link: function(c) {
                    return c.sidebar = b, c.section = b.section, c.switchSection = b.switchSection, c.$watch(function() {
                        return b.section
                    }, function(a) {
                        return a ? c.section = a : void 0
                    }), c.$watch(function() {
                        return a.info.loaded
                    }, function(b) {
                        return b ? c.user = a : void 0
                    }), c.logout = function() {
                        return a.logout()
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daDcoCompany", function() {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/cms/product-company.html",
                replace: !0
            }
        })
    }.call(this),
    function() {
        window.app.directive("daDcoDescription", ["$timeout", "$sce", "$filter", "s3bucket", function(a, b, c, d) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/cms/product-description.html",
                replace: !0,
                link: function(e) {
                    var f, g;
                    return f = {
                        name: 0,
                        type: "",
                        value: ""
                    }, e.projectData.description = e.projectData.description ? e.projectData.description : [], e.projectDescription = e.projectDescription ? e.projectDescription : [], e.trustSrc = function(a) {
                        return b.trustAsResourceUrl(a)
                    }, e.addDescriptionVideo = function() {
                        var a, b;
                        return e.descriptionNotFilledIn = !0, a = e.projectDescription.length, b = angular.copy(f), b.name += a, b.type = "video", e.projectDescription.push(b), g(a)
                    }, e.addDescriptionImage = function(b, c) {
                        var f;
                        return f = {}, f.type = "image", f.value = b[0].url, f.s3 = d + b[0].key, c ? a(function() {
                            return e.projectData.description[c] = f
                        }, 0) : e.projectData.description.push(f)
                    }, e.addDescriptionText = function() {
                        var a, b;
                        return e.descriptionNotFilledIn = !0, a = e.projectDescription.length, b = angular.copy(f), b.name += a, b.type = "text", e.projectDescription.push(b)
                    }, e.editParagraph = function(a) {
                        return e.projectData.description[a].editMode = !0
                    }, e.saveEditedParagraph = function(a) {
                        return e.projectData.description[a].editMode = null
                    }, e.cancelParagraphEdit = function(a) {
                        return e.projectData.description[a].editMode = null
                    }, e.cancelParagraphCreation = function(a, b) {
                        return a.filledIn = !0, e.descriptionNotFilledIn = !1, e.projectDescription.splice(b, 1)
                    }, e.saveParagraph = function(a, b) {
                        var d, f;
                        return d = e.form["projectDescription_" + b], d.$setSubmitted(), f = {}, f.type = a.type, f.value = a.value, "video" === a.type && (f.value = c("youtubeEmbedURL")(a.value) || c("vimeoEmbedURL")(a.value)), d.$valid ? (e.projectDescription[b].filledIn = !0, e.projectData.description.push(f), e.descriptionNotFilledIn = !1) : void 0
                    }, e.deleteParagraph = function(a) {
                        return e.projectData.description.splice(a, 1)
                    }, g = function(a) {
                        return e.$watch(function() {
                            return e.form["projectDescription_" + a]
                        }, function(b) {
                            var d, e;
                            return b ? (null != (d = b["descriptionVideo_" + a]) && d.$parsers.unshift(function(d) {
                                var e;
                                return e = d ? c("youtubeVideoURL")(d) || c("vimeoVideoURL")(d) : void 0, b["descriptionVideo_" + a].$setValidity("video", e), e ? d : void 0
                            }), null != (e = b["descriptionVideo_" + a]) ? e.$formatters.unshift(function(d) {
                                var e;
                                return e = d ? c("youtubeVideoURL")(d) || c("vimeoVideoURL")(d) : void 0, b["descriptionVideo_" + a].$setValidity("video", e), d
                            }) : void 0) : void 0
                        })
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daDcoFaq", function() {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/cms/product-faq.html",
                replace: !0,
                link: function(a) {
                    var b;
                    return b = {
                        name: 0,
                        question: "",
                        answer: ""
                    }, a.projectData.faq = a.projectData.faq ? a.projectData.faq : [], a.faqs = a.faqs ? a.faqs : [], a.addFaq = function() {
                        var c, d;
                        return a.faqNotFilledIn = !0, c = a.faqs.length, d = angular.copy(b), d.name += c, a.faqs.push(d)
                    }, a.saveFaq = function(b, c) {
                        var d, e;
                        return d = a.form["projectFaq_" + c], d.$setSubmitted(), e = {}, e.question = b.question, e.answer = b.answer, d.$valid ? (a.faqs[c].filledIn = !0, angular.isDefined(b.editModeIndex) ? a.projectData.faq[b.editModeIndex] = e : a.projectData.faq.push(e), a.faqNotFilledIn = !1) : void 0
                    }, a.editFaq = function(c) {
                        var d, e;
                        return a.faqNotFilledIn = !0, d = a.projectData.faq[c], e = angular.copy(b), e.name = a.faqs.length, e.question = d.question, e.answer = d.answer, e.editModeIndex = c, a.faqs.push(e)
                    }, a.cancelFaqEdit = function(b) {
                        return a.faqs.splice(b, 1), a.faqNotFilledIn = !1
                    }, a.deleteFaq = function(b) {
                        return a.projectData.faq.splice(b, 1)
                    }
                }
            }
        })
    }.call(this),
    function() {
        window.app.directive("daSidebarDcoManage", ["$timeout", "$location", "Project", "User", function(a, b, c, d) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/dco/sidebar-dco-manage.html",
                replace: !0,
                link: function(a) {
                    var e, f;
                    return a.activeSection = "basic", a.editMode || c.getList().then(function(b) {
                        return a.loaderTrigger(!1), a.projects = b
                    }), a.projectData = a.projectData ? a.projectData : {}, a.projectData.project_contract = "https://docs.google.com/a/swarmcorp.com/document/d/1JoLaDf7jRAxYNwhG6avmKvD5euTWAesSyb8g8xuzHLI/edit", f = {
                        name: 1,
                        firstName: "",
                        lastName: "",
                        email: ""
                    }, a.delegates = a.projectData.delegates ? a.projectData.delegates : [angular.copy(f)], a.addDelegate = function() {
                        var b, c;
                        return b = a.delegates.length, c = angular.copy(f), c.name += b, a.delegates.push(c)
                    }, a.removeDelegate = function(b) {
                        return a.delegates.splice(b, 1)
                    }, a.createProject = function() {
                        var f, g, h, i, j, k, l;
                        if (f = a.form.dco.basic, i = a.form.dco["public"], f.$setSubmitted(), i.$setSubmitted(), f.$valid) {
                            for (a.loaderTrigger(!0), a.projectData.project_id = a.projectData.project_name, a.projectData.project_owner = d.info.id, a.projectData.project_delegates = [], a.projectData.project_contract = e(a.projectData.project_contract), a.projectData.project_budget = e(a.projectData.project_budget), l = a.delegates, j = 0, k = l.length; k > j; j++) g = l[j], h = {}, h.first_name = g.firstName, h.last_name = g.lastName, h.email = g.email, a.projectData.project_delegates.push(h);
                            return c.createDCO(a.projectData.project_id, a.projectData).then(function() {
                                return a.getDCO(!0).then(function() {
                                    return a.loaderTrigger(!1), a.cancelProjectCreation(), b.path("projects/" + a.projectData.project_id)
                                })
                            })
                        }
                    }, a.saveProject = function() {
                        var d, f, g, h, i, j;
                        if (d = a.form.dco.basic, d.$setSubmitted(), d.$valid) {
                            for (a.loaderTrigger(!0), a.projectData.project_contract = e(a.projectData.project_contract), a.projectData.project_budget = e(a.projectData.project_budget), a.projectData.project_delegates = [], j = a.delegates, h = 0, i = j.length; i > h; h++) f = j[h], g = {}, g.first_name = f.firstName, g.last_name = f.lastName, g.email = f.email, a.projectData.project_delegates.push(g);
                            return c.updateDCO(a.projectData.$id, a.projectData).then(function() {
                                return a.loaderTrigger(!1), a.cancelProjectEdit(), b.path("projects/" + a.projectData.project_id)
                            })
                        }
                    }, a.updateLogo = function(b) {
                        return a.projectData.project_logo = b[0].url
                    }, a.updateCover = function(b) {
                        return a.projectData.project_cover = b[0].url
                    }, a.cancelProjectEdit = function() {
                        return a.editModeTrigger(!1), a.projectCleanup()
                    }, a.cancelProjectCreation = function() {
                        return a.createModeTrigger(!1), a.projectCleanup()
                    }, a.switchSection = function(b) {
                        return a.activeSection = b
                    }, a.switchPublishedState = function() {
                        return a.publicInfoFormValid ? (angular.isDefined(a.projectData.project_published) || (a.projectData.project_published = !1), a.projectData.project_published = !a.projectData.project_published) : a.projectData.project_published = !1
                    }, a.$watch(function() {
                        return a.form.dco.basic.$valid
                    }, function(b) {
                        return a.basicInfoFormValid = b
                    }), a.$watch(function() {
                        return a.form.dco["public"].$valid
                    }, function(b) {
                        return a.publicInfoFormValid = b
                    }), e = function(a) {
                        return a ? (-1 === a.search(/^http[s]?\:\/\//) && (a = "http://" + a), a) : null
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.directive("daSidebarDcoView", ["$timeout", "Project", function(a, b) {
            return {
                restrict: "A",
                templateUrl: "partials/app/blocks/dco/sidebar-dco-view.html",
                replace: !0,
                link: function(c) {
                    return c.removeConfirmed = !1, c.editDCO = function() {
                        var a, b, d, e, f, g, h, i;
                        for (c.editModeTrigger(!0), f = c.project, c.unbindProject(), d = [], i = c.project.project_delegates, e = g = 0, h = i.length; h > g; e = ++g) a = i[e], b = {}, b.name = e, b.firstName = a.first_name, b.lastName = a.last_name, b.email = a.email, d.push(b);
                        return f.delegates = d, c.updateProjectData(f)
                    }, c.deleteDCO = function() {
                        return c.removeConfirmed ? (c.loaderTrigger(!0), c.unbindProject(), b.deleteDCO(c.project).then(function() {
                            return c.getDCO(!0).then(function() {
                                return c.loaderTrigger(!1), c.projectCleanup()
                            })
                        })) : (c.removeConfirmed = !0, a(function() {
                            return c.removeConfirmed = null
                        }, 3e3))
                    }, c.backToDCOs = function() {
                        return c.projectCleanup()
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.filter("btcToSatoshi", function() {
            return function(a) {
                return Math.ceil(1e8 * a)
            }
        })
    }.call(this),
    function() {
        window.app.filter("discourseLike", ["discourseUrl", function() {
            return function(a) {
                switch (a) {
                    case 0:
                        return "Nobody liked yet";
                    case 1:
                        return "1 person liked this";
                    default:
                        return a + " people liked this"
                }
            }
        }])
    }.call(this),
    function() {
        window.app.filter("discourseUserAvatar", ["discourseUrl", function(a) {
            return function(b, c) {
                return b = b.substring(1), b = b.replace("{size}", c), a + b
            }
        }])
    }.call(this),
    function() {
        window.app.filter("firstUpperCase", function() {
            return function(a) {
                return a.charAt(0).toUpperCase() + a.slice(1)
            }
        })
    }.call(this),
    function() {
        window.app.filter("completedProjects", function() {
            return function(a) {
                var b, c, d, e, f, g, h;
                if (f = [], g = 0, angular.isDefined(a)) {
                    d = moment();
                    for (b in a) e = a[b], e && "object" == typeof e && !e.project_hidden && (null != (h = e.sale_dates) ? h.mainsale_end_date : void 0) && e.project_published && (c = moment(e.sale_dates.mainsale_end_date), c && c.diff(d) < 0 && (e.project_starred ? (f.splice(g, 0, e), g++) : f.push(e)))
                }
                return f
            }
        })
    }.call(this),
    function() {
        window.app.filter("openSaleProjects", function() {
            return function(a) {
                var b, c, d, e, f, g, h;
                if (f = [], g = 0, angular.isDefined(a)) {
                    d = moment();
                    for (b in a) e = a[b], e && "object" == typeof e && !e.project_hidden && (null != (h = e.sale_dates) ? h.mainsale_end_date : void 0) && e.project_published && (c = moment(e.sale_dates.mainsale_end_date), c && c.diff(d) > 0 && (e.project_starred ? (f.splice(g, 0, e), g++) : f.push(e)))
                }
                return f
            }
        })
    }.call(this),
    function() {
        window.app.filter("preSaleProjects", function() {
            return function(a) {
                var b, c, d, e, f, g, h;
                if (f = [], g = 0, angular.isDefined(a)) {
                    c = moment();
                    for (b in a) d = a[b], d && "object" == typeof d && !d.project_hidden && (null != (h = d.sale_dates) ? h.presale_end_date : void 0) && d.project_published && (e = moment(d.sale_dates.presale_end_date), e && e.diff(c) > 0 && (d.project_starred ? (f.splice(g, 0, d), g++) : f.push(d)))
                }
                return f
            }
        })
    }.call(this),
    function() {
        window.app.filter("projectsFilter", ["$filter", function(a) {
            return function(b, c) {
                return _.uniq(a(c)(b), function(a) {
                    return a.project_id
                })
            }
        }])
    }.call(this),
    function() {
        window.app.filter("visibleProjects", ["$filter", function(a) {
            return function(b) {
                var c, d, e, f, g;
                f = [], f = f.concat(a("openSaleProjects")(b)), c = a("completedProjects")(b), g = 0;
                for (d in b) e = b[d], e && "object" == typeof e && e && "object" == typeof e && !e.project_hidden && e.project_published && (e.project_starred ? (f.splice(g, 0, e), g++) : -1 === f.indexOf(e) && -1 === c.indexOf(e) && f.push(e));
                return f = f.concat(c), _.uniq(f, function(a) {
                    return a.project_id
                })
            }
        }])
    }.call(this),
    function() {
        window.app.filter("range", function() {
            return function(a, b) {
                var c;
                for (b = parseInt(b), c = 0; b > c;) a.push(c), c++;
                return a
            }
        })
    }.call(this),
    function() {
        window.app.filter("relativeDate", function() {
            return function(a) {
                return a = moment(a).fromNow()
            }
        })
    }.call(this),
    function() {
        window.app.filter("satoshiToBTC", ["$filter", function(a) {
            return function(b, c, d) {
                var e;
                return e = b / 1e8, angular.isDefined(d) ? e : (55e-6 > e && (e = 55e-6), e = a("number")(e, c || 5), e = e.replace(/,/g, ""), e = parseFloat(e), e.toString())
            }
        }])
    }.call(this),
    function() {
        window.app.filter("vimeoEmbedURL", function() {
            return function(a) {
                var b, c;
                return c = /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/, b = a.match(c), b ? "https://player.vimeo.com/video/" + b[4] : !1
            }
        })
    }.call(this),
    function() {
        window.app.filter("vimeoVideoURL", function() {
            return function(a) {
                var b;
                return b = /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/, a.match(b) ? RegExp.$1 : !1
            }
        })
    }.call(this),
    function() {
        window.app.filter("youtubeEmbedURL", function() {
            return function(a) {
                var b, c;
                return c = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/, b = a.match(c), b ? "https://www.youtube.com/embed/" + b[1] : !1
            }
        })
    }.call(this),
    function() {
        window.app.filter("youtubeVideoURL", function() {
            return function(a) {
                var b;
                return b = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/, a.match(b) ? RegExp.$1 : !1
            }
        })
    }.call(this),
    function() {
        window.app.service("Checkout", ["$location", function(a) {
            var b;
            return b = {
                project: null,
                bundle: null,
                order: null,
                flow: {
                    user: {
                        isInitial: !0,
                        passed: !1,
                        firstName: null,
                        lastName: null,
                        email: null,
                        password: null
                    },
                    wallet: {
                        passed: !1,
                        value: null,
                        keys: null
                    },
                    payment: {
                        passed: !1,
                        amount: 1,
                        bitcoin: !1,
                        fiat: !1,
                        value: null,
                        received: !1,
                        orderId: null
                    },
                    done: !1
                }
            }, angular.extend({
                set: function(a, b, c) {
                    return angular.extend(this, a), b ? this.nextStep(c) : void 0
                },
                isRouteValid: function(a) {
                    var b, c, d, e;
                    c = null, e = this.flow;
                    for (d in e) {
                        if (b = e[d], d === a) break;
                        c = d
                    }
                    return this.flow[a].isInitial || this.flow[a].passed || this.flow[c].passed
                },
                nextValidRoute: function() {
                    var a, b, c, d;
                    b = null, d = this.flow;
                    for (c in d)
                        if (a = d[c], a.passed && (b = c), c !== b) return c
                },
                nextStep: function(b) {
                    var c, d, e;
                    e = this.flow;
                    for (d in e)
                        if (c = e[d], !c.passed) return void(b ? a.path("projects/" + this.project + "/" + this.bundle + "/checkout/" + d).replace() : a.path("projects/" + this.project + "/" + this.bundle + "/checkout/" + d))
                },
                resetFlow: function() {
                    var a, c;
                    return c = {
                        firstName: this.flow.user.firstName,
                        lastName: this.flow.user.lastName,
                        email: this.flow.user.email
                    }, a = angular.copy(b.flow), angular.extend(a.user, c), angular.extend(this.flow, a)
                }
            }, b)
        }])
    }.call(this),
    function() {
        window.app.service("CheckoutRoute", ["$q", "$route", "$location", "Checkout", function(a, b, c, d) {
            return function() {
                var e, f, g, h;
                return f = a.defer(), h = b.current.stepName, d.isRouteValid(h) ? f.resolve() : (g = b.current.params.project, e = b.current.params.bundle, c.path("projects/" + g + "/" + e + "/checkout/user").replace()), f.promise
            }
        }])
    }.call(this),
    function() {
        "use strict";
        window.app.factory("Counterparty", ["$http", "$q", "$timeout", "RestCounterparty", "counterpartyUrl", function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v;
            return m = require("bitcoreOld"), f = require("bitcore"), u = "multisig", r = e, v = !0, n = {
                jsonrpc: "2.0",
                id: 0
            }, p = null, o = null, j = null, h = function() {
                return a.get("https://counterwallet.io/counterwallet.conf.json").success(function(a) {
                    var b;
                    b = a.servers || [], b.length && (r = b[0])
                })
            }, i = function() {
                var a;
                return a = b.defer(), j ? a.resolve(j) : RestRazzle.one("counterparty/live-server").get().then(function(b) {
                    return b.success ? (j = b.server, a.resolve(j)) : a.reject(b)
                }).then(null, function(b) {
                    return a.reject(b)
                }), a.promise
            }, t = function(a) {
                var b, c, d, e, f, g, h, i, j, k, l, n, p, q;
                for (n = new m.WalletKey, n.fromObj({
                        priv: o
                    }), q = n.storeObj(), b = q.addr, c = {}, c[m.Script.TX_PUBKEYHASH] = m.TransactionBuilder.prototype._signPubKeyHash, c[m.Script.TX_PUBKEY] = m.TransactionBuilder.prototype._signPubKey, c[m.Script.TX_MULTISIG] = m.TransactionBuilder.prototype._signMultiSig, c[m.Script.TX_SCRIPTHASH] = m.TransactionBuilder.prototype._signScriptHash, p = {}, p[b] = new m.WalletKey({
                        privKey: n.privKey
                    }), f = new m.Buffer(a, "hex"), l = new m.Transaction, l.parse(f), i = new m.TransactionBuilder, i.tx = l, d = 0; d < l.ins.length;) k = l.ins[d], h = new m.Script(k.s), e = {
                    address: b,
                    scriptPubKey: h,
                    scriptType: h.classify(),
                    i: d
                }, j = l.hashForSignature(h, d, m.Transaction.SIGHASH_ALL), i.tx.ins[d].s = m.util.EMPTY_BUFFER, g = c[e.scriptType].call(i, p, e, j), g && g.script && (i.tx.ins[d].s = g.script, g.inputFullySigned && i.inputsSigned++, g.signaturesAdded && (i.signaturesAdded += g.signaturesAdded)), d++;
                return i.tx.serialize().toString("hex")
            }, k = function(c, d) {
                var e, f;
                return f = {
                    method: c,
                    params: d
                }, v && (f = {
                    method: "proxy_to_counterpartyd",
                    params: f
                }), angular.extend(f, n), (e = function() {
                    var c;
                    return c = b.defer(), a.post(r, f).success(function(a) {
                        var b;
                        return a.code < 0 ? b = a.message + " " + a.data : a.error && (b = a.error.data.message), b ? c.reject(new Error(b)) : c.resolve(a && a.result)
                    }).error(c.reject), c.promise
                })()
            }, l = function(c, d) {
                var e, f;
                return v && (f = {
                    method: c,
                    params: d
                }), angular.extend(f, n), (e = function() {
                    var c;
                    return c = b.defer(), a.post(r, f).success(function(a) {
                        var b;
                        return a.code < 0 ? b = a.message + " " + a.data : a.error && (b = a.error.message), b ? c.reject(new Error(b)) : c.resolve(a && a.result)
                    }).error(c.reject), c.promise
                })()
            }, s = function(a) {
                return l("broadcast_tx", {
                    signed_tx_hex: t(a)
                })
            }, q = function() {
                var a;
                return a = b.defer(), d.one("_api").get().then(function(b) {
                    return console.log(b), a.resolve(b)
                }).then(null, function(b) {
                    return console.log(b), a.reject(b)
                }), a.promise
            }, g = function(a) {
                var d, e;
                if ("boolean" != typeof a) {
                    if (!a) throw new Error("All counterparty actions require wallet's private key.");
                    o = a, d = new f.PrivateKey(a), p = d.toPublicKey().toString(), e = d.toAddress().toString()
                }
                return {
                    isServerAlive: q,
                    generateFreeAssetName: function() {
                        var a, b, c;
                        return b = Math.pow(26, 12) + 1, a = Math.pow(256, 8), c = function() {
                            return Math.floor(Math.random() * (a - b + 1) + b)
                        }, "A" + c()
                    },
                    createAsset: function(a, b, c) {
                        var d;
                        return d = {
                            source: e,
                            encoding: u,
                            asset: c,
                            divisible: !1,
                            allow_unconfirmed_inputs: !0,
                            pubkey: p,
                            quantity: a
                        }, k("create_issuance", d).then(s)
                    },
                    sendAsset: function(a) {
                        return a.encoding = u, a.source = p, a.allow_unconfirmed_inputs = !0, k("create_send", a).then(s)
                    },
                    getAssets: function(a) {
                        return l("get_normalized_balances", {
                            addresses: [a || e]
                        })
                    },
                    issueAsset: function(a, d) {
                        var e, f, g;
                        return g = this, e = b.defer(), f = function(a, b) {
                            return g.createAsset(a, "LOCK", b).then(function(d) {
                                return d.error ? c(function() {
                                    return f(a, b)
                                }, 5e3) : e.resolve()
                            }).then(null, function() {
                                return c(function() {
                                    return f(a, b)
                                }, 5e3)
                            })
                        }, f(a, d), e.promise
                    }
                }
            }
        }])
    }.call(this),
    function() {
        window.app.service("Discourse", ["$q", "RestDiscourse", function(a, b) {
            return {
                getProjectDiscussion: function(a) {
                    var b, c, d;
                    return c = this, b = [], a = window.daDebug.projectDiscussion ? window.daDebug.projectDiscussion : a, this.getTopics("c/swarm-projects/" + a + ".json").then(function(a) {
                        var e, f, g, h, i, j, k;
                        for (h = a.users, g = a.topic_list.topics, k = [], e = i = 0, j = g.length; j > i; e = ++i) f = g[e], k.push(c.getTopicPosts(f.id, e).then(function(a) {
                            return f = g[a.topicIndex], f.posts = a.topicData.post_stream.posts, f.user = d(f.posters, h), f.pinned ? b.unshift(f) : b.push(f)
                        }));
                        return k
                    }), d = function(a, b) {
                        var c, d, e, f, g, h, i, j, k, l;
                        for (g = 0, j = a.length; j > g; g++)
                            for (d = a[g], c = d.description.split(","), h = 0, k = c.length; k > h; h++)
                                if (e = c[h], "Original Poster" === e)
                                    for (i = 0, l = b.length; l > i; i++)
                                        if (f = b[i], f.id === d.user_id) return f
                    }, b
                },
                getTopics: function(c) {
                    var d;
                    return d = a.defer(), b.one(c).get().then(function(a) {
                        return d.resolve(a)
                    }).then(null, function(a) {
                        return d.reject(a)
                    }), d.promise
                },
                getTopicPosts: function(c, d) {
                    var e;
                    return e = a.defer(), b.one("t/" + c + ".json").get().then(function(a) {
                        return e.resolve({
                            topicData: a,
                            topicIndex: d
                        })
                    }).then(null, function(a) {
                        return e.reject(a)
                    }), e.promise
                }
            }
        }])
    }.call(this),
    function() {
        window.app.service("mandrill", ["$http", "$log", "mandrillAPIKey", function(a, b, c) {
            var d, e, f;
            return d = "https://mandrillapp.com/api/1.0/", this.onerror = function(a) {
                throw {
                    source: "mandrill",
                    name: a.name,
                    message: a.message,
                    toString: function() {
                        return "" + a.name + ": " + a.message
                    }
                }
            }, e = function(e, f, g, h) {
                var i;
                return null == f && (f = {}), f.key = c, f = JSON.stringify(f), b.info("Mandrill:", "Opening request to " + d + e + ".json"), i = {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }, a.post("" + d + e + ".json", f, i).success(function(a, c) {
                    return 200 !== c ? (b.error("Mandrill error sending:", a), h ? h(a) : this.onerror(a)) : g ? g(a) : void 0
                }).error(function(a) {
                    return b.error("Mandrill error sending:", a), h ? h(a) : this.onerror(a)
                })
            }, f = {
                parseEmails: function(a, b) {
                    var c, d, e, f, g, h, i, j, k, l;
                    if (null == b && (b = "to"), !a) return [];
                    for (d = a.split("\n"), f = [], h = function(a, b) {
                            var c;
                            c = b.split(","), c.length > 1 ? f = f.concat(c) : f.push(b)
                        }, c = i = 0, k = d.length; k > i; c = ++i) g = d[c], h(c, g);
                    for (c = j = 0, l = f.length; l > j; c = ++j) e = f[c], f[c] = {
                        email: e,
                        type: b
                    };
                    return f
                },
                send: function(a, b, c) {
                    return null == a && (a = {}), "function" == typeof a && (c = b, b = a, a = {}), null == a.async && (a.async = !1), null == a.ip_pool && (a.ip_pool = null), null == a.send_at && (a.send_at = null), e("messages/send", a, b, c)
                },
                sendTemplate: function(a, b, c) {
                    return null == a && (a = {}), "function" == typeof a && (c = b, b = a, a = {}), null == a.async && (a.async = !1), null == a.ip_pool && (a.ip_pool = null), null == a.send_at && (a.send_at = null), e("messages/send-template", a, b, c)
                }
            }
        }])
    }.call(this),
    function() {
        window.app.service("Message", ["$q", "RestRome", function(a, b) {
            return {
                sendTemplate: function(c) {
                    var d;
                    return d = a.defer(), b.one("messages").post("send-template", c).then(function() {
                        return d.resolve()
                    }).then(null, function() {
                        return d.reject()
                    }), d.promise
                }
            }
        }])
    }.call(this),
    function() {
        window.app.service("Order", ["$firebase", "firebaseUrl", "RestRome", function(a, b, c) {
            return {
                get: function(c) {
                    var d;
                    return d = new Firebase(b + "/orders/").child(c), a(d).$asObject().$loaded()
                },
                create: function(a, b, d) {
                    return c.one("projects", a).one("bundles", b).post("buy", d)
                },
                update: function(c, d) {
                    var e;
                    return e = new Firebase(b + "/orders/").child(c), a(e).$update(d)
                },
                cancel: function(a) {
                    return c.one("orders", a).post("cancel")
                }
            }
        }])
    }.call(this),
    function() {
        window.app.service("Payment", ["RestRome", "RestBlockchain", function(a, b) {
            return {
                getBitcoinExchangeRate: function() {
                    return a.one("rates/fiat").get()
                },
                confirm: function(a) {
                    return b.one("addressbalance/" + a).get()
                }
            }
        }])
    }.call(this),
    function() {
        window.app.service("Pledge", ["$q", "$firebase", "firebaseUrl", "Message", function(a, b, c, d) {
            return {
                create: function(e) {
                    var f, g;
                    return f = a.defer(), g = b(new Firebase(c + "/pledges/")), g.$push(e).then(function(a) {
                        return d.sendTemplate({
                            to: [{
                                email: "andrew@swarmcorp.com"
                            }, {
                                email: "joel@swarmcorp.com"
                            }, {
                                email: "pavlo@swarmcorp.com"
                            }],
                            template: "pledgetoadmin",
                            templateContent: [{
                                name: "firstName",
                                content: e.firstName
                            }, {
                                name: "lastName",
                                content: e.lastName
                            }, {
                                name: "email",
                                content: e.email
                            }, {
                                name: "organization",
                                content: e.organization
                            }, {
                                name: "pledgeId",
                                content: a.key()
                            }]
                        }).then(function() {
                            return f.resolve()
                        }).then(null, function(a) {
                            return f.reject(a)
                        })
                    }).then(null, function(a) {
                        return f.reject(a)
                    }), f.promise
                }
            }
        }])
    }.call(this),
    function() {
        window.app.service("Project", ["$q", "$firebase", "$filter", "firebaseUrl", "User", function(a, b, c, d, e) {
            return {
                get: function(c) {
                    var e, f;
                    return e = a.defer(), f = new Firebase(d + "/projects/").child(c), b(f).$asObject().$loaded().then(function(a) {
                        return e.resolve(a)
                    }).then(null, function(a) {
                        return e.reject(a)
                    }), e.promise
                },
                getAll: function() {
                    var c, e;
                    return c = a.defer(), e = new Firebase(d + "/projects/"), b(e).$asObject().$loaded().then(function(a) {
                        return c.resolve(a)
                    }).then(null, function(a) {
                        return c.reject(a)
                    }), c.promise
                },
                getList: function() {
                    var c, e, f;
                    return c = a.defer(), e = [], f = new Firebase(d + "/projects/"), b(f).$asObject().$loaded().then(function(a) {
                        return a.forEach(function(a, b) {
                            return e.push(b)
                        }), c.resolve(e)
                    }).then(null, function(a) {
                        return c.reject(a)
                    }), c.promise
                },
                create: function(e, f) {
                    var g, h, i, j, k;
                    return h = a.defer(), j = new Firebase(d + "/projects/" + e), f.project_coin = f.project_coin.toUpperCase(), f.project_published = !0, f.assets = {}, f.assets[f.project_coin] = {
                        name: f.project_coin,
                        pricing: []
                    }, i = {}, i.start_date = f.sale_dates.mainsale_start_date, i.end_date = f.sale_dates.mainsale_end_date, i.start_rate = c("btcToSatoshi")(f.project_initial_coin_price), i.end_rate = c("btcToSatoshi")(f.project_initial_coin_price), i.type = "initial", f.assets[f.project_coin].pricing.push(i), k = {}, k.project_name = f.project_name, k.payment_wallet = f.payment_address, k.vending_wallets = f.vending_address, f.payment_address = f.payment_address["public"], f.vending_address = f.vending_address["public"], g = {}, g.name = f.project_coin, g.quantity = 1, f.bundles = {
                        BUNDLE: {
                            assets: [g],
                            name: "BUNDLE",
                            type: "coin",
                            price: c("btcToSatoshi")(f.project_initial_coin_price)
                        }
                    }, f.project_goal = c("btcToSatoshi")(f.project_goal), f.metrics = {
                        btc_raised: "",
                        number_of_backers: ""
                    }, b(j).$update(f).then(function() {
                        return j = new Firebase(d + "/project-adresses/" + e), b(j).$update(k).then(function() {
                            return h.resolve()
                        })
                    }).then(null, function(a) {
                        return h.reject(a)
                    }), h.promise
                },
                bundle: function(b, c) {
                    var d;
                    return d = a.defer(), this.get(b).then(function(a) {
                        return a.bundles[c] ? d.resolve(a.bundles[c]) : d.reject("No bundle " + c + " found in " + b + ".")
                    }).then(null, function(a) {
                        return d.reject(a)
                    }), d.promise
                },
                createDCO: function(c, f) {
                    var g, h, i, j, k;
                    return i = this, j = moment().unix(), c = c.replace(/[^\w\s]/g, "_"), c = c.split(" ").join("_") + "_" + j, k = e.info.dco || [], k.push(c), f.project_id = c, f.project_type = "DCO", g = a.defer(), h = new Firebase(d + "/projects/" + c), b(h).$update(f).then(function() {
                        return i.addDcoCount(), e.update({
                            dco: k
                        }).then(function() {
                            return g.resolve()
                        })
                    }).then(null, function(a) {
                        return g.reject(a)
                    }), g.promise
                },
                updateDCO: function(c, e) {
                    var f, g, h;
                    return h = e, delete h.$id, delete h.$priority, delete h.delegates, f = a.defer(), g = new Firebase(d + "/projects/" + c), b(g).$update(h).then(function() {
                        return f.resolve()
                    }).then(null, function(a) {
                        return f.reject(a)
                    }), f.promise
                },
                deleteDCO: function(c) {
                    var f, g, h, i, j;
                    return i = this, f = a.defer(), h = new Firebase(d + "/projects/" + c.$id), j = e.info.dco, g = j.indexOf(c.$id), j.splice(g, 1), b(h).$remove().then(function() {
                        return i.subtractDcoCount(), e.update({
                            dco: j
                        }).then(function() {
                            return f.resolve()
                        })
                    }).then(null, function(a) {
                        return f.reject(a)
                    }), f.promise
                },
                getDCO: function(c) {
                    var e, f;
                    return e = a.defer(), f = new Firebase(d + "/projects/" + c), b(f).$asObject().$loaded().then(function(a) {
                        return e.resolve(a)
                    }).then(null, function(a) {
                        return e.reject(a)
                    }), e.promise
                },
                getUserDCO: function() {
                    var c, f, g, h, i;
                    return h = this, f = a.defer(), i = e.info.id, g = new Firebase(d + "/users/" + i + "/dco"), c = [], b(g).$asArray().$loaded().then(function(a) {
                        var b;
                        return b = a.length, 0 === b && f.resolve(c), a.forEach(function(a, d) {
                            return h.getDCO(a.$value).then(function(e) {
                                return a.display_name = e.project_name, c.push(a), d + 1 === b ? f.resolve(c) : void 0
                            })
                        })
                    }).then(null, function(a) {
                        return f.reject(a)
                    }), f.promise
                },
                getProjectsCounter: function() {
                    var c, e;
                    return c = a.defer(), e = new Firebase(d + "/counters/projects"), b(e).$asObject().$loaded().then(function(a) {
                        return c.resolve(a)
                    }).then(null, function(a) {
                        return c.reject(a)
                    }), c.promise
                },
                addDcoCount: function() {
                    var c, e;
                    return c = a.defer(), e = new Firebase(d + "/counters/projects/dco"), b(e).$asObject().$loaded().then(function(a) {
                        return a.$value += 1, a.$save(), c.resolve()
                    }).then(null, function() {
                        return c.reject()
                    }), c.promise
                },
                subtractDcoCount: function() {
                    var c, e;
                    return c = a.defer(), e = new Firebase(d + "/counters/projects/dco"), b(e).$asObject().$loaded().then(function(a) {
                        return a.$value > 0 && (a.$value -= 1, a.$save()), c.resolve()
                    }).then(null, function() {
                        return c.reject()
                    }), c.promise
                }
            }
        }])
    }.call(this),
    function() {
        window.app.factory("Sidebar", ["$injector", "$location", "$timeout", "Counterparty", function(a) {
            var b;
            return new(b = function() {
                var b, c;
                return {
                    visible: !1 || (null != (b = window.daDebug) ? b.sidebarVisible : void 0),
                    section: (null != (c = window.daDebug) ? c.sidebarActiveSection : void 0) || "User",
                    counterpartyAlive: !1,
                    toggle: function() {
                        return this.visible = !this.visible
                    },
                    show: function() {
                        return this.visible = !0
                    },
                    hide: function() {
                        return this.visible = !1
                    },
                    switchSection: function(a) {
                        return this.section = a
                    },
                    availableSections: function() {
                        var b;
                        return b = a.get("User"), {
                            user: !0,
                            voteAdmin: this.counterpartyAlive,
                            vote: this.counterpartyAlive,
                            wallet: !0,
                            addProject: "project-admin" === b.info.role && !b.info.project,
                            cms: b.info.project,
                            DCO: !0
                        }
                    }
                }
            })
        }])
    }.call(this),
    function() {
        window.app.service("User", ["$rootScope", "$q", "$route", "$firebase", "$firebaseAuth", "firebaseUrl", "Firebase", "Sidebar", "mandrill", "dazzleUrl", "Counterparty", function(a, b, c, d, e, f, g, h, i, j, k) {
            var l, m, n, o;
            return m = new g(f), l = e(m), o = {
                isLoggedIn: function() {
                    return null != l.$getAuth()
                },
                info: {
                    id: null,
                    firstName: null,
                    lastName: null,
                    email: null,
                    wallet: null,
                    facebook: null,
                    newPasswordRequired: null,
                    votingWallet: null,
                    temporaryPassword: null,
                    role: null,
                    avatar: null,
                    votings: null,
                    project: null,
                    dco: null,
                    loaded: !1,
                    allowMultiOptionsVote: !1
                },
                allUsers: null,
                login: function(a, c, d) {
                    var e, f;
                    return g.goOnline(), f = this.encodePassword(c), e = b.defer(), l.$authWithPassword({
                        email: a,
                        password: f
                    }, {
                        remember: d
                    }).then(function() {
                        return n().then(function() {
                            return e.resolve()
                        })
                    }).then(null, function(b) {
                        return "INVALID_PASSWORD" === b.code ? l.$authWithPassword({
                            email: a,
                            password: c
                        }, {
                            remember: d
                        }).then(function() {
                            return n({
                                newPasswordRequired: !0
                            }).then(function() {
                                return e.resolve()
                            })
                        }).then(null, function(a) {
                            return e.reject(a)
                        }) : e.reject(b)
                    }), e.promise
                },
                facebookLogin: function() {
                    var a, c;
                    return c = this, a = b.defer(), l.$authWithOAuthPopup("facebook", {
                        scope: "email"
                    }).then(function(b) {
                        var d;
                        return d = {
                            first_name: b.facebook.cachedUserProfile.first_name,
                            last_name: b.facebook.cachedUserProfile.last_name,
                            email: b.facebook.cachedUserProfile.email,
                            facebook: !0
                        }, c.update(d).then(function() {
                            return a.resolve()
                        })
                    }), a.promise
                },
                logout: function() {
                    return l.$unauth(), angular.extend(o.info, {
                        firstName: null,
                        lastName: null,
                        email: null,
                        wallet: null,
                        facebook: null,
                        newPasswordRequired: null,
                        role: null,
                        avatar: null,
                        votingWallet: null,
                        temporaryPassword: null,
                        votings: null,
                        project: null,
                        dco: null,
                        loaded: null,
                        allowMultiOptionsVote: !1
                    }), h.hide(), h.switchSection("User"), location.reload()
                },
                generatePassphrase: function(a) {
                    var b;
                    switch (null == a && (a = 12), a) {
                        case 3:
                            b = 32;
                            break;
                        case 6:
                            b = 64;
                            break;
                        case 9:
                            b = 92;
                            break;
                        case 12:
                            b = 128;
                            break;
                        default:
                            b = 128
                    }
                    return new Mnemonic(b).toWords().join(" ")
                },
                getAsset: function(a) {
                    var c, d, e;
                    return e = this, d = b.defer(), c = 0, new k(e.info.privateKey).getAssets().then(function(b) {
                        var e, f, g;
                        if (0 === b.length) d.resolve(c);
                        else
                            for (f = 0, g = b.length; g > f; f++) e = b[f], e.asset === a && (c = e.quantity);
                        return d.resolve(c)
                    }).then(null, function() {
                        return d.resolve(0)
                    }), d.promise
                },
                getUserDataByEmail: function(a) {
                    var c;
                    return c = b.defer(), this.allUsers.forEach(function(b, d) {
                        return b.email === a ? c.resolve({
                            uid: d,
                            userData: b
                        }) : void 0
                    }), c.promise
                },
                getAllUsers: function() {
                    var a, c;
                    return c = this, a = b.defer(), m = new g(f).child("users"), d(m).$asObject().$loaded().then(function(b) {
                        return c.allUsers = b, a.resolve()
                    }), a.promise
                },
                getUidByEmail: function(a) {
                    var c;
                    return c = b.defer(), this.allUsers.forEach(function(b, d) {
                        return b.email === a ? c.resolve(d) : void 0
                    }), c.promise
                },
                emailNotification: function(a, c) {
                    var d, e;
                    return null == c && (c = "votingwalletinvite"), d = b.defer(), e = {
                        template_name: c,
                        template_content: [{
                            name: "registrationLink",
                            content: '<a href="' + j + '/login" target="_blank">here</a>'
                        }, {
                            name: "signupLink",
                            content: '<a href="' + j + '/login" target="_blank">here</a>'
                        }, {
                            name: "loginLink",
                            content: 'Click <a href="' + j + '/login" target="_blank">here</a> to login and vote.'
                        }, {
                            name: "password",
                            content: a.password
                        }, {
                            name: "email",
                            content: a.login
                        }],
                        message: {
                            to: [{
                                email: a.login,
                                name: a.userName || ""
                            }]
                        }
                    }, i.sendTemplate(e, d.resolve, d.reject)
                },
                encodePassword: function(a) {
                    var b, c, d, e;
                    return b = require("bitcore"), c = b.util.buffer, e = new c.EMPTY_BUFFER.constructor(a), d = b.crypto.Hash.sha256(e), c.bufferToHex(d)
                },
                create: function(a, c, d) {
                    var e, f, g;
                    return g = this, e = b.defer(), f = c, c = this.encodePassword(c), l.$createUser(a, c).then(function(b) {
                        return b.email = a, b.passphrase = f, e.resolve(b), d ? g.update(d, b.uid) : void 0
                    }).then(null, function(b) {
                        return b.userData = {
                            email: a
                        }, e.reject(b)
                    }), e.promise
                },
                update: function(a, c) {
                    var e, h;
                    return e = b.defer(), h = c || l.$getAuth().uid, m = new g(f + "/users/" + h), d(m).$update(a).then(function() {
                        return n(), e.resolve()
                    }).then(null, function(a) {
                        return e.reject(a)
                    }), e.promise
                },
                updatePassword: function(a, c) {
                    var d, e, f, g;
                    return g = this, d = b.defer(), e = this.encodePassword(c), f = this.encodePassword(a), l.$changePassword(g.info.email, a, e).then(function() {
                        return g.info.temporaryPassword && g.update({
                            temporaryPassword: e
                        }), g.update({
                            newPasswordRequired: null
                        }).then(function() {
                            return d.resolve()
                        })
                    }).then(null, function() {
                        return l.$changePassword(g.info.email, f, e).then(function() {
                            return g.info.temporaryPassword && g.update({
                                temporaryPassword: e
                            }), g.update({
                                newPasswordRequired: null
                            }).then(function() {
                                return d.resolve()
                            })
                        }).then(null, function(a) {
                            return d.reject(a)
                        })
                    }), d.promise
                },
                resetPassword: function(a) {
                    return l.$resetPassword(a)
                },
                remove: function(a, b, c) {
                    var e;
                    return e = this, l.$getAuth().then(function(a) {
                        var b;
                        return a.uid === c && e.logout(), b = d(m.child("users/")), b.$remove(a.uid).then(null, function(a) {
                            return console.error("User.remove.sync.$remove", a)
                        })
                    }), l.$removeUser(a, b).then(null, function(a) {
                        return console.error("User.remove", a)
                    })
                }
            }, (n = function(a) {
                var c, e, i, j;
                return e = b.defer(), c = l.$getAuth(), c && (i = {
                    id: c.uid,
                    email: null != (j = c.password) ? j.email : void 0,
                    loaded: !1
                }, angular.extend(o.info, i), m = new g(f + "/users/" + c.uid), d(m).$asObject().$loaded().then(function(b) {
                    return i = {
                        firstName: b.first_name,
                        lastName: b.last_name,
                        email: i.email ? i.email : b.email,
                        wallet: b.wallet,
                        facebook: i.id.indexOf("facebook:") > -1,
                        newPasswordRequired: b.newPasswordRequired || (null != a ? a.newPasswordRequired : void 0),
                        role: b.role,
                        avatar: b.avatar,
                        votingWallet: b.votingWallet,
                        temporaryPassword: b.temporaryPassword,
                        votings: b.votings,
                        allowMultiOptionsVote: b.allowMultiOptionsVote,
                        project: b.project,
                        dco: b.dco,
                        loaded: !0
                    }, angular.extend(o.info, i), b.votingWallet && h.show(), e.resolve()
                })), e.promise
            })({}), o
        }])
    }.call(this),
    function() {
        window.app.service("Voting", ["$q", "$firebase", "$interval", "firebaseUrl", "RestBlockscan", "RestChain", "chainAPIKey", "User", "Counterparty", function(a, b, c, d, e, f, g, h, i) {
            return {
                create: function(c) {
                    var e, f;
                    return e = a.defer(), f = new Firebase(d).child("votings/" + c.id), b(f).$update(c).then(function(a) {
                        return h.update({
                            role: "voting-admin"
                        }).then(function() {
                            return e.resolve(a)
                        })
                    }).then(null, function(a) {
                        return e.reject(a)
                    }), e.promise
                },
                inviteUser: function(a, c) {
                    var e, f;
                    return e = new Firebase(d + "/users/" + a + "/votings"), f = b(e).$asArray(), f.$loaded().then(function(a) {
                        var b, d, e, g;
                        for (d = !1, e = 0, g = a.length; g > e; e++)
                            if (b = a[e], b.$value === c) {
                                d = !0;
                                break
                            }
                        return d ? void 0 : f.$add(c)
                    })
                },
                signUser: function(a, c) {
                    var e;
                    return e = new Firebase(d + "/votings/" + c + "/invitees/" + a), b(e).$update({
                        signed: !0
                    })
                },
                markUserAsVoted: function(a, c) {
                    var e;
                    return e = new Firebase(d + "/votings/" + c + "/invitees/" + a), b(e).$update({
                        voted: !0
                    })
                },
                markUserAsNotVoted: function(a, c) {
                    var e;
                    return e = new Firebase(d + "/votings/" + c + "/invitees/" + a), b(e).$update({
                        voted: !1
                    })
                },
                markOptionAsVoted: function(a, c, e) {
                    var f, g;
                    return g = new Firebase(d + "/votings/" + c + "/options/" + e + "/votes"), f = {}, f[a] = !0, b(g).$update(f)
                },
                userVotings: function() {
                    var a, c;
                    return c = h.info.id, a = new Firebase(d + "/users/" + c + "/votings"), b(a).$asArray().$loaded()
                },
                getVoting: function(a) {
                    var c;
                    return c = new Firebase(d).child("votings/" + a), b(c).$asObject().$loaded()
                },
                isUserVoted: function(c, e) {
                    var f, g;
                    return f = a.defer(), g = new Firebase(d).child("votings/" + c), b(g).$asObject().$loaded().then(function(a) {
                        return f.resolve(a.invitees[e].voted), a.$watch(function() {
                            return f.resolve(a.invitees[e].voted)
                        })
                    }), f.promise
                },
                getVotings: function(c) {
                    var e, f, g, i, j;
                    return i = this, f = a.defer(), j = 0, e = [], g = function(a, g) {
                        var i;
                        return i = new Firebase(d).child("votings/" + a), b(i).$asObject().$loaded().then(function(a) {
                            return a.paid && (c ? h.info.id === a.owner && e.push(a) : e.push(a)), g ? f.resolve(e) : void 0
                        }).then(null, function() {
                            return g ? f.resolve(e) : void 0
                        })
                    }, i.userVotings().then(function(a) {
                        var b, c, d, e, h;
                        if (a.length) {
                            for (j = a.length, h = [], b = d = 0, e = a.length; e > d; b = ++d) c = a[b], h.push(g(c.$value, b + 1 === a.length));
                            return h
                        }
                        return f.reject()
                    }).then(null, f.reject), f.promise
                },
                getVotesCount: function(b, c, d) {
                    var e, f;
                    return f = a.defer(), e = {
                        address: b,
                        balance: 0
                    }, new i(d).getAssets(b).then(function(a) {
                        var b, d, g;
                        for (d = 0, g = a.length; g > d; d++) b = a[d], b.asset === c && (e.balance = b.quantity);
                        return f.resolve(e)
                    }).then(null, function() {
                        return f.resolve(e)
                    }), f.promise
                },
                getPayment: function(b, d) {
                    var e, h;
                    return h = a.defer(), e = c(function() {
                        return f.one("bitcoin/addresses/").customGET(b, {
                            "api-key-id": g
                        }).then(function(a) {
                            var b;
                            return b = a[0].total.balance, b >= d || window.daDebug.votingPaid ? (c.cancel(e), h.resolve()) : void 0
                        })
                    }, 3e3), h.promise
                }
            }
        }])
    }.call(this),
    function() {
        window.app.service("Wallet", ["$q", "$http", "$filter", "Counterparty", "RestChain", "chainAPIKey", "RestBlockscan", function(a, b, c, d, e, f, g) {
            var h;
            return h = require("bitcore"), {
                "new": function() {
                    var a, b, c, d, e, f;
                    return a = "m/0'/0/0", d = new Mnemonic(128), f = d.toWords(), e = new Mnemonic(f).toHex(), c = h.HDPrivateKey.fromSeed(e), b = c.derive(a), {
                        passphrase: f.join(" "),
                        "public": b.publicKey.toAddress().toString(),
                        "private": b.privateKey.toWIF()
                    }
                },
                fromPassphrase: function(a) {
                    var b, c, d, e, f;
                    return f = a.trim().toLowerCase().split(" "), 12 === f.length ? (b = "m/0'/0/0", e = new Mnemonic(f).toHex(), d = h.HDPrivateKey.fromSeed(e), c = d.derive(b), {
                        passphrase: f.join(" "),
                        "public": c.publicKey.toAddress().toString(),
                        "private": c.privateKey.toWIF()
                    }) : void 0
                },
                getAssets: function(b) {
                    var d, e;
                    return e = this, d = a.defer(), g.one("api2").customGET("", {
                        module: "address",
                        action: "balance",
                        btc_address: b
                    }).then(function(a) {
                        return a = a.data, e.getBtcBalance(b).then(function(b) {
                            var e;
                            return e = b[0].total.balance, a.unshift({
                                asset: "BTC",
                                balance: c("satoshiToBTC")(e, 3, !1)
                            }), d.resolve(a)
                        }).then(null, function() {
                            return d.resolve(a)
                        })
                    }).then(null, function(a) {
                        return d.reject(a)
                    }), d.promise
                },
                getBtcBalance: function(b) {
                    var c;
                    return c = a.defer(), e.one("bitcoin/addresses").customGET(b, {
                        "api-key-id": f
                    }).then(function(a) {
                        return c.resolve(a)
                    }).then(null, function(a) {
                        return c.reject(a)
                    }), c.promise
                },
                check: function(a) {
                    return h.Address.isValid(a)
                },
                pdf: function(a) {
                    var b, c, d, e;
                    return c = function(a, b) {
                        var c, d, e, f, g, h, i, j, k;
                        for (h = new QRCode(5, 0, "8bit"), h.addData(a), h.make(), c = document.createElement("canvas"), c.width = c.height = b, g = h.getModuleCount(), j = b / g, e = c.getContext("2d"), i = 0; g > i;) {
                            for (d = 0; g > d;) k = Math.ceil((d + 1) * j) - Math.floor(d * j), f = Math.ceil((i + 1) * j) - Math.floor(i * j), e.fillStyle = h.isDark(i, d) ? "#000" : "#fff", e.fillRect(Math.round(d * j), Math.round(i * j), k, f), d++;
                            i++
                        }
                        return c.toDataURL()
                    }, e = c(a["public"], 150), d = c(a["private"], 150), b = new jsPDF, b.setFillColor(248, 248, 248), b.rect(0, 0, 220, 300, "F"), b.setFillColor(255, 255, 255), b.rect(0, 0, 220, 30, "F"), b.setLineWidth(1), b.circle(25, 15, 5, "D"), b.setFont("helvetica", "normal"), b.setFontSize(12), b.text(35, 17, "Swarm.co"), b.setLineWidth(.4), b.line(56, 13, 56, 18), b.text(59, 17, "Revolutionizing Crowdfunding"), b.setDrawColor(198, 198, 198), b.line(0, 30, 220, 30), b.setFontSize(22), b.text(80, 50, "Paper Wallet"), b.setFillColor(255, 255, 255), b.rect(0, 62, 220, 17, "F"), b.setFontSize(14), b.setFont("helvetica", "bold"), b.text(15, 70, "Secret 12 word passphrase."), b.setFontSize(9), b.setFont("helvetica", "normal"), b.text(15, 75, a.passphrase), b.setFontSize(14), b.setFont("helvetica", "bold"), b.text(28, 92, "PUBLIC key"), b.setFontSize(9), b.setFont("helvetica", "normal"), b.text(30, 96, "(Load & Verify)"), b.addImage(e, "JPEG", 15, 100, 50, 50), b.text(68, 120, a["public"]), b.setFontSize(14), b.setFont("helvetica", "bold"), b.text(157, 92, "PRIVATE key"), b.setFontSize(9), b.setFont("helvetica", "normal"), b.text(165, 96, "(Redeem)"), b.setFontSize(6), b.addImage(d, "JPEG", 145, 100, 50, 50), b.text(68, 125, a["private"]), b.setDrawColor(198, 198, 198), b.line(0, 160, 220, 160), b.setFillColor(248, 248, 248), b.rect(0, 160, 220, 180, "F"), b.setFontSize(10), b.setFont("helvetica", "bold"), b.text(15, 170, "In order to access or exchange the assets contained in this address,"), b.text(15, 175, "you should go to https://counterwallet.io/ and enter your 12 word passphrase."), b.save("PaperWallet.pdf")
                }
            }
        }])
    }.call(this), angular.module("Dazzle").run(["$templateCache", function(a) {
        "use strict";
        a.put("partials/app/blocks/cms/product-company.html", '<div class="cms-company cms-section"><h5>Company</h5><div ng-form=form.cms.projectCompany><label>Description<textarea redactor name=projectCompanyDescription ng-model=projectData.company.description></textarea></label><label>Phone number <input name=projectCompanyPhone ng-model="projectData.company.phone"></label><label>Email <input name=projectCompanyEmail ng-model="projectData.company.email"></label><label>Website <input name=projectCompanyWebsite ng-model="projectData.company.website"></label><label>Forum <input name=projectCompanyForum ng-model="projectData.company.forum"></label><label>Facebook <input name=projectCompanyFacebook ng-model="projectData.company.facebook"></label><label>Twitter <input name=projectCompanyTwitter ng-model="projectData.company.twitter"></label><label>Youtube <input name=projectCompanyYoutube ng-model="projectData.company.youtube"></label><label>Hashtag <input name=projectHashtag ng-model="projectData.project_hashtag"></label></div></div>'), a.put("partials/app/blocks/cms/product-description.html", '<div class="cms-product-description cms-section"><h5>Project description</h5><ul class=project-description ng-if=projectData.description><li class=project-description-paragraph ng-repeat="paragraph in projectData.description track by $index"><div class=project-description-content ng-class="{\'content-text\': paragraph.type == \'text\', \'edit-mode\': paragraph.editMode}"><div ng-if=!paragraph.editMode><div ng-if="paragraph.type == \'text\'" ng-bind-html=paragraph.value></div><img alt="" ng-if="paragraph.type == \'image\'" ng-src="{{paragraph.value}}"><div ng-if="paragraph.type == \'video\'"><iframe style="width: 248px; height: 140px" ng-src={{trustSrc(paragraph.value)}} frameborder=0 allowfullscreen></iframe></div></div><div ng-if=paragraph.editMode><textarea redactor ng-if="paragraph.type == \'text\'" ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model=paragraph.value></textarea><div class=video-link-edit ng-if="paragraph.type == \'video\'">Youtube or Vimeo video URL <input ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model="paragraph.value"> <span>Only links like <b>https://www.youtube.com/embed/XQu8TTBmGhA</b> or <b>https://player.vimeo.com/video/87110435</b> are allowed</span></div><a href class="five centered columns green button" ng-click=saveEditedParagraph($index)>Save {{paragraph.type}}</a> <a href class=edit-cancel ng-click=cancelParagraphEdit($index)>Cancel</a></div></div><div filepicker ng-if="paragraph.type == \'image\'" path="/projectsFiles/" container=swarm.shandro callback="addDescriptionImage(file, $index)" mimetype="\'image/*\'" multiple ng-if=!descriptionNotFilledIn><a href class=paragraph-edit></a></div><a href class=paragraph-edit ng-if="paragraph.type !== \'image\' && !paragraph.editMode" ng-click=editParagraph($index)></a> <a href class=paragraph-delete ng-click=deleteParagraph($index)></a></li></ul><nav class=new-paragraph-actions><a href class="blue button" ng-if=!descriptionNotFilledIn ng-click=addDescriptionVideo()>Add video</a><div filepicker path="/projectsFiles/" pickerclass="blue button" container=swarm.shandro callback=addDescriptionImage(file) mimetype="\'image/*\'" multiple ng-if=!descriptionNotFilledIn>Add image</div><a href class="blue button" ng-if=!descriptionNotFilledIn ng-click=addDescriptionText()>Add text</a></nav><div class=new-paragraph ng-form=form.projectDescription_{{$index}} ng-if=!paragraph.filledIn ng-repeat="paragraph in projectDescription track by $index"><label ng-if="paragraph.type == \'video\'">Youtube or Vimeo video URL <input name=descriptionVideo_{{paragraph.name}} ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model="paragraph.value"> <span>Only links like <b>https://www.youtube.com/embed/XQu8TTBmGhA</b> or <b>https://player.vimeo.com/video/87110435</b> are allowed</span></label><label ng-if="paragraph.type == \'text\'">Paragraph of text<textarea redactor name=descriptionText_{{paragraph.name}} ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model=paragraph.value></textarea></label><a href class="new-save five centered columns green button" ng-click="saveParagraph(paragraph, $index)">Save {{paragraph.type}}</a> <a href class=edit-cancel ng-click="cancelParagraphCreation(paragraph, $index)">Cancel</a></div></div>'), a.put("partials/app/blocks/cms/product-faq.html", '<div class="cms-product-faq cms-section"><h5>FAQ</h5><ul ng-if=projectData.faq><li class=filled-faq ng-repeat="faq in projectData.faq track by $index" ng-hide=faqNotFilledIn><p class=faq-question>{{faq.question}}</p><p class=faq-answer>{{faq.answer}}</p><a href class=faq-edit ng-click=editFaq($index)></a> <a href class=faq-delete ng-click=deleteFaq($index)></a></li></ul><div ng-form=form.projectFaq_{{$index}} ng-if=!faq.filledIn ng-repeat="faq in faqs track by $index"><label>This is the question<textarea name=projectFaqQuestion_{{faq.name}} ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model=faq.question></textarea></label><label>This is the answer<textarea type=text name=projectFaqAnswer_{{faq.name}} ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model=faq.answer></textarea></label><a href class="five centered columns green button" ng-click="saveFaq(faq, $index)">Save FAQ</a></div><a href class="five centered columns blue button" ng-if=!faqNotFilledIn ng-click=addFaq()>Add FAQ</a></div>'), a.put("partials/app/blocks/cms/sale-phases.html", '<div class="cms-sale-phases cms-section"><h3>Sales phases</h3><ul class=filled-sale-phases ng-if=phasesOnline ng-hide=saleNotFilledIn><li ng-repeat="salePhase in phasesOnline track by $index" ng-hide="salePhase.type == \'initial\'"><span>{{salePhase.name}}</span> <a href ng-click=editSalePhase($index)>Edit</a> <a href ng-click=deleteSalePhase($index)>Delete</a> <span class=phase-dates>{{phaseDates(salePhase)}}</span></li></ul><div ng-form=form.salePhases_{{$index}} ng-if=!salePhase.filledIn ng-class="{\'form-submitted\': form.salePhases_{{$index}}.$submitted}" ng-repeat="salePhase in salePhases track by $index"><label>Phase name <input name=phaseName_{{salePhase.name}} ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model="salePhase.phaseName"></label><label>Start date <input datepicker-popup name=startDate_{{salePhase.name}} ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model=salePhase.startDate ng-focus="salePhaseStartDateDatePicker = true" is-open=salePhaseStartDateDatePicker min-date="editModeSaleStartDate || today"></label><label>End date <input datepicker-popup name=endDate_{{salePhase.name}} ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model=salePhase.endDate ng-focus="salePhaseEndDateDatePicker = true" is-open=salePhaseEndDateDatePicker min-date="salePhase.startDate"></label><label class="two alpha columns">Start price <input name=startPrice_{{salePhase.name}} ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model="salePhase.startPrice"></label><label class="three omega columns">End price <input name=endPrice_{{salePhase.name}} ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model="salePhase.endPrice"></label><a href class="edit-save button" ng-click="saveSalePhase(salePhase, $index)">Save</a> <a href class="edit-cancel red button" ng-click=cancelSalePhaseEdit($index)>Cancel</a></div><a href class="gray button" ng-if=!saleNotFilledIn ng-click=addSalePhase()>Add sale phase</a></div>'), a.put("partials/app/blocks/dco/sidebar-dco-manage.html", '<div class=sidebar-dco-manage><form name=form.dco novalidate><h4>{{editMode ? projectData.project_name : \'New DCO project\'}}</h4><section class=sidebar-dco-section-nav><nav class=section-switch><a href ng-class="{\'active\': activeSection == \'basic\'}" ng-click="switchSection(\'basic\')">Basic Info</a> <a href ng-class="{\'active\': activeSection == \'public\'}" ng-click="switchSection(\'public\')">Public Info</a></nav></section><section class="project-basic-info nested-form sidebar-cms" ng-show="activeSection == \'basic\'" ng-form=form.dco.basic><div class=cms-section><h5>DCO basic info</h5><label>Project name <input name=projectName ng-required=true ng-model="projectData.project_name"></label><label>Statement of intent<textarea name=projectStatement ng-required=true ng-model=projectData.project_statement></textarea></label><div class=delegates for=""><span>Delegates</span><div ng-repeat="delegate in delegates track by $index" ng-class="{even: $even, odd: $odd}"><label class="three alpha columns"><input placeholder="First Name" ng-class="{small: $index > 1}" name=delegate_{{delegate.name}}_firstName ng-model=delegate.firstName ng-required="true"></label><label class="three omega columns"><input placeholder="Last Name" ng-class="{small: $index > 1}" name=delegate_{{delegate.name}}_lastName ng-model=delegate.lastName ng-required="true"></label><label><input placeholder=Email ng-class="{small: $index > 1}" name=delegate_{{delegate.name}}_email ng-pattern="/^((([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))$/i" ng-model=delegate.email ng-required="true"></label><a href class=remove-delegate ng-if="$index > 0" ng-click=removeDelegate($index)><i class="icon icon-close"></i></a></div><a href class="add-delegate five centered columns blue button" ng-click=addDelegate()>Add delegate</a></div><label>Delegate responsibilities<textarea name=delegateResponsibilities ng-required=true ng-model=projectData.project_delegate_responsibilities></textarea></label><label>Link to DCO contract <input name=projectContract ng-required=true ng-model="projectData.project_contract"></label><label>Link to budget <input name=projectBudget ng-model="projectData.project_budget"></label></div></section><section class="project-public-info nested-form sidebar-cms" ng-show="activeSection == \'public\'" ng-form=form.dco.public><div class=cms-section><h5>Main project info</h5><label>Project title <input name=projectTitle ng-required=true ng-model="projectData.project_title"></label><label>Project description <input name=projectDescription ng-required=true ng-model="projectData.project_description"></label><label class=project-logo><div class=project-logo-holder ng-if=projectData.project_logo><img ng-src="{{projectData.project_logo}}/convert?w=108&h=108&fit=crop&quality=100" alt=""></div><div filepicker path="/projectsFiles/" pickerclass="blue button" container=swarm.shandro callback=updateLogo(file) mimetype="\'image/*\'" multiple>Upload project logo</div>Picture will be resized to 108x108px</label><label class=project-banner><img ng-if=projectData.project_cover ng-src="{{projectData.project_cover}}/convert?w=280&fit=scale&quality=100" alt=""><div filepicker path="/projectsFiles/" pickerclass="blue button" container=swarm.shandro callback=updateCover(file) mimetype="\'image/*\'" multiple>Upload project cover</div>Picture will be resized to 3840x992px</label></div><div da-dco-description></div><div da-dco-faq></div><div da-dco-company></div><div class=project-join-url><label>Project \'Join\' URL <input type=url name=projectJoinUrl ng-model="projectData.project_join_url"></label></div></section><div class=actions><div class=dco-publish-switch ng-class="{\'switch-disabled\': !publicInfoFormValid || !basicInfoFormValid}"><div da-switch state=projectData.project_published label="\'Publish project\'" trigger="publicInfoFormValid ? switchPublishedState : null"></div><p ng-if="publicInfoFormValid === false || basicInfoFormValid === false"><span ng-if=!basicInfoFormValid ng-click="switchSection(\'basic\')">Please fill-in correctly \'Basic Info\' form.</span> <span ng-if=!basicInfoFormValid ng-click="switchSection(\'public\')">Please fill-in correctly \'Public Info\' form.</span></p></div><input type=submit class="five centered columns" value="{{editMode ? \'Save\' : \'Create project\'}}" ng-click="editMode ? saveProject() : createProject()"> <a href ng-click="editMode ? cancelProjectEdit() : cancelProjectCreation()">Cancel</a></div></form></div>'), a.put("partials/app/blocks/dco/sidebar-dco-view.html", '<div class=sidebar-dco-view><a href class=back-to-projects ng-click=backToDCOs()>Back to projects list</a><h4>{{project.project_name}}</h4><h5>Statement of intent</h5><p>{{project.project_statement}}</p><h5>Delegates</h5><ul class=delegates><li ng-repeat="delegate in project.project_delegates track by $index"><p><span>{{delegate.first_name}} {{delegate.last_name}}</span> <a ng-href=mailto:{{delegate.email}}>({{delegate.email}})</a></p></li></ul><h5>Delegate responsibilities</h5><p>{{project.project_delegate_responsibilities}}</p><h5>Link to DCO contract</h5><a class=short-link ng-href={{project.project_contract}} target=_blank>{{project.project_contract}}</a><div ng-if=project.project_budget><h5>Link to budget</h5><a class=short-link ng-href={{project.project_budget}} target=_blank>{{project.project_budget}}</a></div><div class="actions five centered columns"><a href class=button ng-click=editDCO()>Edit Project</a> <a href ng-click=deleteDCO() ng-class="{confirm: removeConfirmed}">{{removeConfirmed ? \'Are you sure?\' : \'Delete DCO project\'}}</a></div></div>'), a.put("partials/app/blocks/footer.html", '<footer class=main-footer><div class=container><a href="/" class="pull-left swarm-logo icon icon-logo"></a><nav class="footer-nav pull-right"><a href=/terms target=_blank>Terms of use</a> <a href=/privacy-policy target=_blank>Privacy policy</a> <a href=https://medium.com/@Swarm target=_blank>Blog</a> <a href=https://discourse.swarm.fund target=_blank>Forum</a> <a href=http://eepurl.com/WPUZ9 target=_blank>Newsletter</a></nav></div></footer>'), a.put("partials/app/blocks/header.html", '<header class=main-header ng-hide=headerHidden()><div class=container><a href="/" ng-if="screenName() !== \'home\'" class="pull-left swarm-logo icon icon-logo"></a>  <a href class=pull-right ng-click=showLoginForm() ng-if=!userIsLoggedIn()>Login</a> <a href class=pull-right ng-class="{active: userNavigation}" ng-click=toggleSidebar() ng-if=userIsLoggedIn()>{{user.info.firstName}} {{user.info.lastName}}<i class="icon icon-user"></i></a></div></header>'), a.put("partials/app/blocks/sidebar-add-project.html", '<div class="sidebar-content sidebar-cms"><div da-spinner ng-show=loading></div><form name=form.cms ng-submit=formSubmit() novalidate><div da-spinner ng-show=loading></div><h4>Project basic info</h4><div class=project-basic-info ng-form=form.cms.projectBasics ng-class="{\'form-submitted\': form.cms.projectBasics.$submitted}"><label>Project name <input name=projectName ng-required=true ng-model="projectData.project_name"></label><label>Project title <input name=projectTitle ng-required=true ng-model="projectData.project_title"></label><label>Project description <input name=projectDescription ng-required=true ng-model="projectData.project_description"></label><label class=project-logo><div class=project-logo-holder ng-if=projectData.project_logo><img ng-src="{{projectData.project_logo}}/convert?w=108&h=108&fit=crop&quality=100" alt=""></div><div filepicker path="/projectsFiles/" pickerclass="blue button" container=swarm.shandro callback=updateLogo(file) mimetype="\'image/*\'" multiple>Upload project logo</div>Picture will be resized to 108x108px</label><label class=project-banner><img ng-if=projectData.project_cover ng-src="{{projectData.project_cover}}/convert?w=280&fit=scale&quality=100" alt=""><div filepicker path="/projectsFiles/" pickerclass="blue button" container=swarm.shandro callback=updateCover(file) mimetype="\'image/*\'" multiple>Upload project cover</div>Picture will be resized to 3840x992px</label><label>Coin name <input name=projectCoin ng-required=true ng-model="projectData.project_coin"></label><label>Initial coin price (in BTC) <input name=projectCoinPrice ng-required=true ng-model="projectData.project_initial_coin_price"></label><label>BTC Goal <input name=projectGoal ng-required=true ng-model="projectData.project_goal"></label><label>Sale start date <input datepicker-popup name=saleStartDate ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model=projectData.sale_dates.mainsale_start_date ng-focus="mainsaleStartDateDatePicker = true" is-open=mainsaleStartDateDatePicker min-date=today max-date="projectData.sale_dates.mainsale_end_date"></label><label>Sale end date <input datepicker-popup name=saleEndDate ng-class="{\'invalid\': $invalid && $touched}" ng-required=true ng-model=projectData.sale_dates.mainsale_end_date ng-focus="mainsaleEndDateDatePicker = true" is-open=mainsaleEndDateDatePicker min-date="projectData.sale_dates.mainsale_start_date"></label><label>Bank account details<textarea name=projectBankAccount ng-required=true ng-model=projectData.payment_bank></textarea></label><label>Receiving BTC address <input name=projectReceivingAddress ng-disabled=true ng-model="projectData.payment_address.public"></label><label>Vending machine address <input name=projectVendingAddress ng-disabled=true ng-model="projectData.vending_address.public"></label><input type=submit value="Create project" ng-click=createProject()></div></form></div>'), a.put("partials/app/blocks/sidebar-cms.html", '<div class="sidebar-content sidebar-cms"><form name=form.cms ng-submit=formSubmit() novalidate><div da-spinner ng-show=loading></div><h4>CMS</h4><div ng-form=form.cms><div class="project-basic-info cms-section" ng-form=form.cms.projectBasics><h3>Project basic info</h3><label>Project name <input name=projectName ng-disabled=true ng-model="projectData.project_name"></label><label>Project title <input name=projectTitle ng-required=true ng-model="projectData.project_title"></label><label>Project description <input name=projectDescription ng-required=true ng-model="projectData.project_description"></label><label class=project-logo><div class=project-logo-holder ng-if=projectData.project_logo><img ng-src="{{projectData.project_logo}}/convert?w=108&h=108&fit=crop&quality=100" alt=""></div><div filepicker path="/projectsFiles/" pickerclass="blue button" container=swarm.shandro callback=updateLogo(file) mimetype="\'image/*\'" multiple>Upload project logo</div>Picture will be resized to 108x108px</label><label class=project-banner><img ng-if=projectData.project_cover ng-src="{{projectData.project_cover}}/convert?w=280&fit=scale&quality=100" alt=""><div filepicker path="/projectsFiles/" pickerclass="blue button" container=swarm.shandro callback=updateCover(file) mimetype="\'image/*\'" multiple>Upload project cover</div>Picture will be resized to 3840x992px</label><label>Coin name <input name=projectCoin ng-disabled=true ng-model="projectData.project_coin"></label><label>Initial coin price (in BTC) <input name=projectCoinPrice ng-disabled=true ng-model="projectData.project_initial_coin_price"></label><label>Goal <input name=projectGoal ng-disabled=true ng-model="projectData.project_goal"></label><label>Sale start date <input name=saleStartDate ng-disabled=true ng-model="projectData.sale_dates.mainsale_start_date"></label><label>Sale end date <input name=saleEndDate ng-disabled=true ng-model="projectData.sale_dates.mainsale_end_date"></label><label>Bank account details<textarea name=projectBankAccount ng-required=true ng-model=projectData.payment_bank></textarea></label><label>Receiving BTC address <input name=projectReceivingAddress ng-disabled=true ng-model="projectData.payment_address"></label><label class=field-last>Vending machine address <input name=projectVendingAddress ng-disabled=true ng-model="projectData.vending_address"></label></div><div da-sale-phases></div><div da-product-description></div><div da-product-faq></div><div da-product-company></div></div></form></div>'), a.put("partials/app/blocks/sidebar-dco.html", '<div class=sidebar-dco><div da-spinner ng-show=loading></div><h4 ng-if="userDCO.length && !project && !createMode">Your DCO projects</h4><div ng-if="!createMode && !editMode"><p class=dco-list-empty ng-if=!userDCO.length>You don\'t have any DCO projects.</p><ul class=dco-list ng-if="!project && userDCO.length"><li ng-repeat="dco in userDCO track by $index"><a href ng-click=selectProject(dco)>{{dco.display_name}}</a></li></ul><a href class="button five centered columns" ng-if=!project ng-click=createProject()>Create a new one</a></div><div da-sidebar-dco-view ng-if="project && !editMode"></div><div da-sidebar-dco-manage ng-if="editMode || createMode"></div></div>'), a.put("partials/app/blocks/sidebar-user.html", '<div class="sidebar-content sidebar-user"><form name=form.user ng-submit=formSubmit() novalidate><div da-spinner ng-show=loading></div><div ng-form=form.userInfo ng-if=!haveToSignUp><h4>Account details</h4><label ng-show=!changePasswordMode><span>First name</span> <input name=firstName ng-model=userInfo.firstName ng-disabled=!editMode ng-required="true"> <span class=error ng-show=hasError(userInfoForm.firstName)>{{userInfoForm.firstName.errorMessage}}</span></label><label ng-show=!changePasswordMode><span>Last name</span> <input name=lastName ng-model=userInfo.lastName ng-disabled=!editMode ng-required="true"> <span class=error ng-show=hasError(userInfoForm.lastName)>{{userInfoForm.lastName.errorMessage}}</span></label><label ng-class="{\'last-field\': !editMode}" ng-show=!changePasswordMode><span>Email</span> <input type=email name=email ng-model=userInfo.email ng-disabled=!editMode ng-pattern="/^((([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))$/i" ng-required="true"> <span class=error ng-show=hasError(userInfoForm.email)>{{userInfoForm.email.errorMessage}}</span></label><label ng-show="userInfoForm.$dirty || changePasswordMode" ng-class="{\'label-wide\': changePasswordMode}"><span>{{changePasswordMode ? \'Old Password\' : \'Password\'}}</span> <input type=password name=password ng-model=userInfo.password ng-value="editMode ? \'\': \'someLongPassword\'" ng-disabled=!editMode ng-change="userInfoForm.password.$invalid ? resetPasswordValidity() : null" ng-required="userInfoForm.$dirty || changePasswordMode"> <span class=error ng-show=hasError(userInfoForm.password)>{{userInfoForm.password.errorMessage}}</span></label><label class=label-wide ng-show=changePasswordMode><span>New Password</span> <input type=password name=newPassword ng-model=userInfo.newPassword ng-required="changePasswordMode"> <span class=error ng-show=hasError(userInfoForm.newPassword)>{{userInfoForm.newPassword.errorMessage}}</span></label><a href ng-if=editMode ng-click=changePassword()>{{changePasswordMode ? \'Cancel password change\' : \'Change password\'}}</a> <input type=submit value=Save ng-if=!userInfo.facebook ng-value="editMode ? \'Save\' : \'Edit\'"> <a href ng-if=editMode ng-click=cancelEdit()>Cancel</a></div><div ng-form=form.userSignup ng-if=haveToSignUp><h4>Account details</h4><label><span>First name</span> <input name=firstName ng-class="{ invalid: hasError(userSignupForm.firstName) }" ng-model=userInfo.firstName ng-required="true"> <span class=error ng-show=hasError(userSignupForm.firstName)>{{userSignupForm.firstName.errorMessage}}</span></label><label><span>Last name</span> <input name=lastName ng-class="{ invalid: hasError(userSignupForm.lastName) }" ng-model=userInfo.lastName ng-required="true"> <span class=error ng-show=hasError(userSignupForm.lastName)>{{userSignupForm.lastName.errorMessage}}</span></label><label><span>Email</span> <input type=email name=email ng-class="{ invalid: hasError(userSignupForm.email) }" ng-model=userInfo.email disabled> <span class=error ng-show=hasError(userSignupForm.email)>{{userSignupForm.email.errorMessage}}</span></label><label class=two-lines><span>New Password</span> <input type=password name=password ng-class="{ invalid: hasError(userSignupForm.password) }" ng-model=userInfo.password ng-required="true"> <span class=error ng-show=hasError(userSignupForm.password)>{{userSignupForm.password.errorMessage}}</span></label><label class=address><span>Wallet</span> <input name=wallet ng-model=userWallet.public disabled></label><p class=wallet-download ng-if=!walletDownloaded>Click <a href ng-click=downloadWallet()>here</a> to download and securely save your wallet to continue.</p><div ng-if=walletDownloaded><input type=submit value="Sign up"><p class=terms>By signing up, I agree to Swarm\'s <a href=/terms target=_blank>Terms of Service</a> and <a href=/privacy-policy target=_blank>Privacy Policy</a>.</p></div></div></form></div>'), a.put("partials/app/blocks/sidebar-voting-admin.html", '<div class="sidebar-content sidebar-voting-admin"><div da-spinner ng-hide=!loading></div><div ng-if=!newVoting><a href class=back-to-votes ng-if=voting ng-click=backToVotes()>Back to all votes</a><h4 ng-class="{\'voting\': title}">{{title ? title : \'Votes\'}}</h4><span class=address>{{voting.wallet.public}}</span><div class=votings ng-if="votings && !voting"><ul><li class=voting-item ng-repeat="voting in votings track by $index" ng-class="{last: $last}"><h5>{{voting.title}}</h5><p>{{voting.description}}</p><a href class="gray button" ng-click=selectVoting(voting)>Details</a></li></ul></div><div class=voting ng-if=voting><p>{{voting.description}}</p><ul ng-show=votingOptionsView><li class="voting-item option" ng-repeat="option in voting.options track by $index" ng-class="{last: $last}"><h5>{{option.bio}} <span class=option-votes>{{(option.votesCount ? option.votesCount + \'%\' : \'\')}}</span></h5><span class=option-address>{{option.address}}</span></li></ul><div class=voting-invitees ng-show=votingInviteesView><ul><li ng-repeat="(key, invitee) in voting.invitees track by $index"><a ng-href=mailto:{{invitee.email}} title="{{ (!invitee.signed && !invitee.voted) ? \'Invite sent.\' : ( (invitee.signed && !invitee.voted) ? \'User is signed in, but not voted yet.\' : \'User voted.\') }}" ng-class="{\'signed\': invitee.signed, \'voted\': invitee.voted}">{{invitee.email}}</a></li></ul></div><a href class="options-trigger button" ng-click=switchOptionsAndUsersView()>Show {{ votingOptionsView ? \'invitees\' : \'voting options\' }}</a></div><a class="add-voting button" ng-show="!loading && !voting" ng-click=addNewVoting()>Create new vote</a></div><form novalidate name=form.addVoting ng-show=newVoting ng-submit=createVoting()><h4>Create new vote</h4><label><span>Title</span> <input name=votingName ng-model=voting.votingName ng-required="true"> <span class=error ng-show=hasError(form.addVoting.votingName)>{{form.addVoting.votingName.errorMessage}}</span></label><label><span>Description</span> <input name=votingDescription ng-model=voting.votingDescription ng-required="true"> <span class=error ng-show=hasError(form.addVoting.votingDescription)>{{form.addVoting.votingDescription.errorMessage}}</span></label><label class=options ng-repeat="option in votingOptions track by $index"><span>{{$index ? \'\' : \'Options\'}}</span> <input ng-class="{small: $index > 1}" name={{option.name}} ng-model=option.value ng-required="true"> <a href class=option-remove ng-if="$index > 1" ng-click=removeOption($index)><i class="icon icon-close"></i></a> <span class=error ng-show=hasError(form.addVoting[option.name])>{{form.addVoting[option.name].errorMessage}}</span></label><span class=add-option><a href ng-click=addOption()>Add option</a></span><label class=multiple ng-if=userInfo.allowMultiOptionsVote><span>Multiple?</span> <input type=number name=votingMultiple min=1 ng-model=voting.votingMultiple max={{votingOptions.length-1}} ng-required="true"></label><label class=invitees><span>Invitees</span><textarea name=votingInvitees ng-model=voting.votingInvitees ng-required=true ng-change="form.addVoting.votingInvitees.$invalid ? resetInvitesValidity() : parseEmails(form.addVoting.votingInvitees.$viewValue)"></textarea><span class=field-label>Please separate emails by comma</span> <span class=error ng-show=hasError(form.addVoting.votingInvitees) ng-bind-html=form.addVoting.votingInvitees.errorMessage></span></label><label><span>Start date</span> <input name=votingStartDate ng-model=voting.votingStartDate ng-focus="votingStartDatePicker = true" ng-required=true datepicker-popup={{format}} min-date=today is-open="votingStartDatePicker"> <span class=error ng-show=hasError(form.addVoting.votingStartDate)>{{form.addVoting.votingStartDate.errorMessage}}</span></label><label><span>End date</span> <input name=votingEndDate ng-model=voting.votingEndDate ng-required=true ng-focus="votingEndDatePicker = true" datepicker-popup={{format}} is-open=votingEndDatePicker min-date="voting.votingStartDate"> <span class=error ng-show=hasError(form.addVoting.votingEndDate)>{{form.addVoting.votingEndDate.errorMessage}}</span></label><p class=voting-price ng-if="inviteesCount >= 2 && expectingPayment">Estimated voting price: <b>{{paymentValue | satoshiToBTC}} BTC</b>.<br>Vote asset issuance: <b>{{100000 | satoshiToBTC}} BTC</b>;<br>Fees to send asset for {{inviteesCount}} users: <b>{{payForUsers | satoshiToBTC }} BTC</b>.<br><br>Please send <b>{{paymentValue | satoshiToBTC}} BTC</b> to address:<br>{{votingWallet.public}}</p><input type=submit ng-if=!expectingPayment value="Create voting"> <span class="waiting-for-payment button" ng-if=expectingPayment>Waiting for payment <i class="icon icon-spinner"></i></span> <span class=cancel-adding-voting ng-if=!expectingPayment><a href ng-click=cancelAddingVoting()>Cancel</a></span></form></div>'), a.put("partials/app/blocks/sidebar-voting.html", '<div class="sidebar-content sidebar-voting"><div da-spinner ng-hide=!loading></div><a href class=back-to-votes ng-if=voting ng-click=backToVotes()>Back to all votes</a><h4>{{voting ? voting.title : \'Votes\'}}</h4><form novalidate name=form.secret ng-submit=checkSecret() ng-show=!secredAccepted><p class=passphrase-pitch>Please enter your secret 12-word passphrase below (from the Paper Wallet you downloaded earlier), or private key. We don’t store it and are not able to resend it.</p><label><input type=password name=accessSecret ng-model=accessSecret ng-change="checkSecret()"> <span class=error ng-show=form.secret.accessSecret.$invalid>{{form.secret.accessSecret.errorMessage}}</span></label></form><p ng-if="secredAccepted && !votings">Sorry, there are no votes available for you at this time.</p><div class=votings ng-if=!voting><ul><li class=voting-item ng-repeat="voting in votings track by $index" ng-class="{last: $last}"><h5>{{voting.title}}</h5><p>{{voting.description}}</p><a href class="gray button" ng-if=!votingDone ng-click=selectVoting(voting)>Details</a></li></ul></div><div class=voting ng-if=voting><p ng-class="{\'no-vote\': ((!canVote && !voting.votingDone) || voting.votingDone)}">{{voting.description}}</p><span class="cant-vote blue button" ng-if="!canVote && !voting.votingDone">Voting is unavailable at the moment. You will receive an email as soon as the next round opens up.</span> <span class="cant-vote blue button" ng-if=voting.votingDone>Thanks for your vote!</span><ul><li class="voting-item option" ng-repeat="option in voting.options track by $index" ng-class="{last: $last, \'no-vote\': ((!canVote && !voting.votingDone) || voting.votingDone)}"><h5>{{option.bio}} <span class=option-votes>{{(option.votesCount ? option.votesCount + \'%\' : \'\')}}</span></h5><a href class=button ng-if="canVote && !voting.votingDone" ng-class="{\'gray\': !option.confirmVote && !option.voted, \'blue\': option.voted, \'voting-done\': voting.votingDone}" ng-click=vote(option)>{{(option.confirmVote && !option.voted) ? \'Confirm\' : (option.voted ? \'Your vote\' : \'Vote\')}}</a> <span class=option-address ng-if=canVote ng-click=toggleOptionAddress(option)>{{option.addressVisible ? option.address : \'See voting address\'}}</span></li></ul></div></div>'), a.put("partials/app/blocks/sidebar-wallet.html", '<div class="sidebar-content sidebar-wallet"><form name=form.wallet ng-submit=formSubmit() novalidate><div da-spinner ng-show=loading></div><h4>Wallet</h4><div ng-form=form.userWallet ng-if="(userInfoLoaded && !userInfo.wallet) || editMode"><label class=field-wallet>Wallet address <input da-validate-wallet-input class=input-address name=wallet ng-required=true ng-model="userWallet"> <i class="icon icon-check" ng-if=isAddressValid()></i> <span class=error ng-if="form.userWallet.wallet.$touched && form.userWallet.wallet.$invalid">Valid wallet address is required</span></label><p ng-if=isAddressValid()>Watch out. This address will be used to send assets to, bought on Swarm.</p><a href class="wallet-create blue button" ng-show=!isAddressValid() ng-click=createWallet()>I need a new wallet</a> <input ng-if=isAddressValid() type=submit value="Save changes"> <a href class=edit-cancel ng-if=editMode ng-click=toggleEditMode()>Cancel</a></div><div ng-if="userInfo.wallet && !editMode"><div class=holdings ng-if=assets><ul><li class=asset ng-repeat="asset in assets track by $index"><span class=asset-name>{{asset.asset}}</span> <span class=asset-quantity>{{asset.balance}}</span></li></ul></div><input da-validate-wallet-input class=input-address name=wallet ng-readonly=true ng-model="userWallet"> <a href class=edit ng-click=toggleEditMode()>Change address</a></div></form><div da-melotic trading-market="\'swarm-btc\'" id=melotic-widget class=melotic-widget ng-if=assets></div></div>'), a.put("partials/app/blocks/sidebar.html", '<aside class="main-sidebar container da-animate" ng-show=sidebar.visible><div class="seven columns"><a href class="sidebar-trigger icon icon-angle-right" ng-click=sidebar.hide()></a><div da-spinner class="six columns" ng-show=loading></div><div class="six columns"><div da-sidebar-user ng-if="section == \'User\'"></div><div da-sidebar-voting class=sidebar-content ng-if="section == \'Voting\'"></div><div da-sidebar-voting-admin class=sidebar-content ng-if="section == \'VotingAdmin\'"></div><div da-sidebar-wallet class=sidebar-content ng-if="section == \'Wallet\'"></div><div da-sidebar-add-project class=sidebar-content ng-if="section == \'AddProject\'"></div><div da-sidebar-cms class=sidebar-content ng-if="section == \'Cms\'"></div><div da-sidebar-dco class=sidebar-content ng-if="section == \'DCO\'"></div></div><nav class="sidebar-nav one omega column"><a href class="icon icon-user" title="User Info" ng-class="{active: section == \'User\'}" ng-show=sidebar.availableSections().user ng-click="switchSection(\'User\')"></a> <a href class="icon icon-voting-add" title="Create new vote" ng-class="{active: section == \'VotingAdmin\'}" ng-show=sidebar.availableSections().voteAdmin ng-click="switchSection(\'VotingAdmin\')"></a> <a href class="icon icon-voting" title=Vote ng-class="{active: section == \'Voting\'}" ng-show="user.info.votings && user.info.wallet && sidebar.availableSections().vote" ng-click="switchSection(\'Voting\')"></a> <a href class="icon icon-case" title=Wallet ng-class="{active: section == \'Wallet\'}" ng-show=sidebar.availableSections().wallet ng-click="switchSection(\'Wallet\')"></a> <a href class="icon icon-pencil-add" title="Add new project" ng-class="{active: section == \'AddProject\'}" ng-show=sidebar.availableSections().addProject ng-click="switchSection(\'AddProject\')"></a> <a href class="icon icon-pencil" title="Edit project" ng-class="{active: section == \'Cms\'}" ng-show=sidebar.availableSections().cms ng-click="switchSection(\'Cms\')"></a> <a href class="icon icon-dco" title=DCO ng-class="{active: section == \'DCO\'}" ng-show=sidebar.availableSections().DCO ng-click="switchSection(\'DCO\')"></a> <a href class="icon icon-quit" title="Log out" ng-click=logout()></a></nav></div></aside>'), a.put("partials/app/components/checkout/amount.html", '<header da-checkout-header></header><section da-checkout-amount class=container><h2 class=screen-title>Select amount</h2><div class="checkout-bundles eight columns offset-by-four"><ul><li ng-repeat="asset in bundle.assets" ng-class="{last: $last}"><h5><span>{{asset.quantity * amount()}}</span> {{asset.name}} coin{{ asset.quantity * amount() > 1 ? \'s\': \'\' }}</h5><p>{{asset.description}}</p></li></ul><h3 class=total-amount><i class="icon icon-bitcoin"></i>{{ ((bundle.price || 0) / 100000000) * amount() | number : 2 }}</h3></div><div class="amount-buttons one column"><a href class=amount-add ng-click=addAmount()><i class="icon icon-plus"></i></a> <a href class=amount-subtract ng-class="{disabled: substractionDisabled}" ng-click=subtractAmount()><i class="icon icon-minus"></i></a></div><footer class="mobile-footer standard-hide mobile-show"><a href class="button green" ng-class="{disabled: buttonNextDisabled, loading: buttonLoading}" ng-disabled=buttonNextDisabled ng-click=nextStep()>{{buttonNext()}}</a></footer></section>'), a.put("partials/app/components/checkout/checkout-header.html", '<header class=checkout-header><div class=container><a href ng-href=/projects/{{projectId}} class="pull-left swarm-logo icon icon-logo"></a><h3 class=pull-left><a href=/projects/{{projectId}}>{{project.project_title}}</a></h3><nav class="pull-right header-nav"><a href class="step-back pull-left" ng-if=backStepAvailable ng-click=goBack()>Back</a> <a href class="three columns green button" ng-class="{disabled: buttonNextDisabled, loading: buttonLoading}" ng-disabled=buttonNextDisabled ng-click=nextStep()>{{buttonNext()}}</a></nav></div></header>'), a.put("partials/app/components/checkout/done.html", '<header da-checkout-header></header><section da-checkout-done class=container><div class="done eight columns offset-by-four"><h2 class=screen-title>Done!</h2><p class=step-description>Thank you! We received your payment.<br>We will send the coins to your wallet<br>(the one you downloaded or entered) after the sale ends. The project owner will contact you if additional information to fulfill your order is needed.</p><img src=/images/checkout/check-big.png alt=""><div class="share-block da-animate" ng-hide=!shareVisible><div class=social-links><a href ng-click=share.twitter() class="button twitter">Tweet</a><a href ng-click=share.facebook() class="button facebook">Share on FB</a></div>Redirects to homepage in {{redirectTimeout}}</div></div></section>'), a.put("partials/app/components/checkout/modal/wallet-confirmation.html", '<div class="wallet-confirmation container"><h1>Confirm!</h1><div class="six centered columns"><p>I confirm that I’ve saved my passphrase somewhere very safe and that I will be able to access it again. I also confirm i realize that if I ever lose this passphrase I will completely lose access to all my Bits. I also confirm that if I let anyone else have this passphrase I may lose access to all my Bits.</p><a class="simple green button" ng-click=walletDownloadConfirm()>I saved my passphrase</a> <a href ng-click=getPaperWallet()>Download</a></div></div>'), a.put("partials/app/components/checkout/payment.html", '<header da-checkout-header></header><section da-checkout-payment class=container><div class="payment eight columns centered"><h2 class=screen-title>Payment</h2><p class=step-description>Please choose the amount you want to purchase</p><div class=amount><form novalidate class="four centered columns"><input type=number ng-model="bundlesAmount"><div class=amount-buttons><a href class=amount-add ng-click=addAmount()><i class="icon icon-plus"></i></a> <a href class=amount-subtract ng-class="{disabled: substractionDisabled}" ng-click=subtractAmount()><i class="icon icon-minus"></i></a></div></form><p>You\'ll receive {{bundle.assets[0].quantity * bundlesAmount}} {{project.project_coin}} coin{{ bundle.assets[0].quantity * bundlesAmount > 1 ? \'s\' : \'\'}}.</p><p>1 {{project.project_coin}} = {{bundle.price | satoshiToBTC}}BTC (${{ (bundle.price * exchangeRate) | satoshiToBTC | number : 2}})</p></div><div class="payment-method six centered columns"><span ng-class="{active: paymentMethod==\'bitcoin\'}">{{ bundle.price * bundlesAmount | satoshiToBTC }}BTC</span><span ng-class="{active: paymentMethod==\'fiat\'}">{{ (bundle.price * exchangeRate * bundlesAmount | satoshiToBTC) | number : 2 }}USD</span> <a href class="simple button" ng-class="paymentMethod==\'bitcoin\' || !paymentMethod ? \'yellow\': \'gray\'" ng-click=useBitcoin()>Pay with Bitcoin</a><a href class="simple button fiat" ng-class="paymentMethod==\'fiat\' || !paymentMethod ? \'green\': \'gray\' " ng-click=useFiat()>Pay with Dollars</a></div><div class=method-bitcoin ng-show="paymentMethod==\'bitcoin\'"><div class="payment-qr-holder eight centered columns"><div da-spinner ng-hide=paymentAddress></div><div class="total three alpha columns" ng-show=paymentAddress><span><i class="icon icon-bitcoin"></i>{{ bundle.price * bundlesAmount | satoshiToBTC }}</span></div><div class="address-pointer one column" ng-show=paymentAddress>&nbsp;<i class="angle icon icon-angle-right"></i></div><div class="address-holder three omega columns"><qr ng-if=paymentAddress text=paymentAddress type-number=4 correction-level=Q size=160 image="true"></div></div><div class="eight centered columns"><div class=address-field ng-show=paymentAddress><span>{{paymentAddress}}</span> <a href da-copy-link class=link-copy ng-show=linkVisible><i class="icon icon-copy"></i>{{copyLinkText}}</a></div></div></div><div class=method-fiat ng-show="paymentMethod==\'fiat\'"><form novalidate name=paymentForm class="six centered columns" ng-submit=doPayment()><label class="three columns alpha">First name <input name=firstName ng-class="{ invalid: hasError(paymentForm.firstName) }" ng-model=payment.firstName ng-required="true"></label><label class="three columns omega">Last name <input name=lastName ng-class="{ invalid: hasError(paymentForm.lastName) }" ng-model=payment.lastName ng-required="true"></label><label>Credit card number <input name=cardNumber ng-class="{ invalid: hasError(paymentForm.cardNumber) }" ng-model=payment.cardNumber ng-trim=false ng-required="true"></label><div class="expiration-date three alpha columns"><label>Expiration date</label><input class=alpha name=cardExpirationMM placeholder=MM ng-class="{ invalid: hasError(paymentForm.cardExpirationMM) }" ng-model=payment.cardExpirationMM ng-required="true"> <input class=omega name=cardExpirationYY placeholder=YYYY ng-class="{ invalid: hasError(paymentForm.cardExpirationYY) }" ng-model=payment.cardExpirationYY ng-required="true"></div><div class="cvc three omega columns"><label>CVC</label><input name=cardCVC ng-class="{ invalid: hasError(paymentForm.cardCVC) }" ng-model=payment.cardCVC ng-required="true"> <img src=images/checkout/cvc.jpg alt=""></div><span class=stripe-error ng-if=paymentDeclined>Your card was declined.</span> <input class="simple green" type=submit value="Submit Payment"></form></div></div></section>'), a.put("partials/app/components/checkout/user.html", '<header da-checkout-header></header><section da-checkout-user class=container><div class="user eight columns centered"><h2 class=screen-title>Log in</h2><p class=step-description>Please log in or sign up before you can continue.</p><div class=user-login><a href class="three centered columns grey button" ng-click=showLoginForm()>Login</a> <a href class=link-signup ng-click=showSignupForm()>Sign up</a></div></div></section>'), a.put("partials/app/components/checkout/wallet-existing.html", '<div class="wallet-existing ten centered columns"><h2 class=screen-title>Your address <small>(Or <a href ng-click=createNew()>create new one</a>)</small></h2><div class=step-description><p>Please <b>enter the bitcoin address</b> you want to use <b>to receive the assets</b>. Make sure you control the private key of the address (<a href ng-click="additionalInfo = !additionalInfo">learn more</a>).</p><p ng-show=additionalInfo>Some wallets (like Coinbase, Bitstamp, Xapo,…) have a particular way of dealing with transactions to and from your wallet. This allows them to offer a great service but isn\'t compatible with the the assets (coins) we\'re about to send you. If you\'re not sure, let us just <a href ng-click=createNew()>create a new wallet for you</a>.</p></div><form class="wallet-address eight centered columns" ng-class="{valid: addressValid}"><input ng-model=publicKey placeholder="Your bitcoin address goes here"> <i class="wallet-key-icon icon icon-check"></i></form><i ng-if=addressValid class="angle icon icon-angle-top"></i><div class=confirmation ng-show=addressValid><span class=checkbox-custom ng-class="{checked: controlConfirmed}" ng-click="controlConfirmed = !controlConfirmed"></span><label><input class=ng-hide type=checkbox da-custom-form-element ng-model=controlConfirmed ng-checked="controlConfirmed"> I have control over the private key of this address.&nbsp;<br>So no Coinbase, Bitstamp, Xapo or similar service.</label></div><footer class="mobile-footer standard-hide mobile-show"><a href class="button green" ng-class="{disabled: buttonNextDisabled, loading: buttonLoading}" ng-disabled=buttonNextDisabled ng-click=nextStep()>{{buttonNext()}}</a></footer></div>'), a.put("partials/app/components/checkout/wallet-new.html", '<div class="wallet-new ten centered columns"><h2 class=screen-title>We’ve created a secret passphrase for you <small>(Or you can <a href ng-click=useExisting()>use an existing one</a>)</small></h2><div class=step-description><p>This passphrase gives you access to all your Bits. We strongly suggest you print it out and put it somewhere very safe, because it’s only with this passphrase that you can access your Bits.</p><p>We strongly recommend printing this immediately and storing paper copies only.</p></div><div class=passphrase-holder><span class=passphrase>{{userWallet.passphrase}}</span></div><i class="angle icon icon-angle-bottom"></i> <a class="ten columns dark-gray alpha button" ng-click=downloadWallet()><b>Download</b> paper wallet</a></div>'), a.put("partials/app/components/checkout/wallet.html", "<header da-checkout-header></header><section da-checkout-wallet class=container><section da-checkout-wallet-new ng-if=!hasWallet></section><section da-checkout-wallet-existing ng-if=hasWallet></section></section>"), a.put("partials/app/components/spinner.html", '<div class=spinner><div class=backdrop></div><span class="icon icon-spinner"></span></div>'), a.put("partials/app/components/switch.html", "<div class=switch><span class=switch-label ng-click=trigger()>{{label}}</span> <span class=\"switch-trigger da-animate\" ng-class=\"state?'on':'off'\" ng-click=trigger()><b></b></span></div>"), a.put("partials/app/components/youtube.html", "<div><iframe width={{width}} height={{height}} ng-src=\"{{trustSrc('https://www.youtube.com/embed/'+id)}}\" frameborder=0 allowfullscreen></iframe></div>"), a.put("partials/app/home.html", '<div class="header-right"> <div class=" banner"> <div class="slider" style="text-align: center;"> <div class="callbacks_container"> <div class="banner1"> <div class="six alpha columns"> <div class="screen-home" > <div class="splash-content inverted ng-scope"> <section class="slider"> <div class="container"> <div class="slide slide-dco"> <div class="six alpha"> <div class="image-holder images-loaded" "> <img ng-repeat-start="slideImage in slideImages track by $index" da-image-on-load load-callback="slideImageLoaded()" ng-src="images/1/{{$index+1}}g.png" alt="" /> <img ng-repeat-end da-image-on-load load-callback="slideImageLoaded()" ng-src="images/1/{{$index+1}}.png" alt="" /> <span class="swarm-logo"></span> </div> </div> </div> </div> </section> </div> </div> </div> <div id="home" class="col-sm-12"> <p> <h2 class="m1-heading">swarm</h2> <h3 class="m1-heading">the future of crowdfunding</h3> </p> </div> <div class="col-sm-12 corwd-btn"> <div class="col-sm-3"> </div> <div class="col-sm-6"> <a href class="hvr-sweep-to-right more fix popup-with-zoom-anim" ng-click="createDCO()">start your project</a> <a class="hvr-sweep-to-right more-transp" href="https://swarm.fund/projects">explore projects</a> </div> </div> </div> </div> </div> </div></div><!--header-bottom--><div class="content"><div class="content-grid"><div class="container"> <div class="col-md-12 resp"> <div class="col-md-1" style="width: 12%"></div> <div class="col-md-3 tighten"> <a href="" class="mask"> <img class="img-responsive zoom-img" src="images/col1.png" alt=""> <span id="home" class="four cp"><h3>crypto-equity</h3></span> </a> <div class="most-1"> <p> Swarm is a new way to fundraise. Rather than issuing merchandise or promising rewards for backing a crowdfund, issue supporters shares of your company/project in the form of tokens. <br/> <a href="#crypto-equity" target="_self"><i>learn more</i></a> </p> </div> </div> <div class="col-md-3 tighten"> <a href="" class="mask"> <img class="img-responsive zoom-img" src="images/col2.png" alt=""> <span id="home" class="four dec"><h3>decentralized</h3></span> </a> <div class="most-1"> <p> Instead of a traditional business structure (like corporations or non-profits), projects on the Swarm platform are "Distributed Collaborative Organizations" (DCOs) where all supporters are entitled to equal sharing opportunities. This is democracy for business of the future.<br/> <a href="#decentralized" target="_self"><i>learn more</i></a> </p> </div> </div> <div class="col-md-3 tighten"> <a href="" class="mask"> <img class="img-responsive zoom-img" src="images/col3.png" alt="" > <span id="home" class="four col"><h3>collaborative</h3></span> </a> <div class="most-1"> <p> Building a successful business can get complicated and finding great business partners can be difficult. The Swarm platform connects you with others who have valuable experience and are interested in collaboration. Working together has never been easier.<br/> <a href="#collaborative" target="_self"><i>learn more</i></a> </p> </div> </div> <div class="clearfix"> </div></div></div></div><!--2nd section--><div class="content-middle"><div class="container"> <div class="col-md-1"></div> <div class="col-md-7"> <div class="embed"> <iframe src="https://player.vimeo.com/video/100726500?title=0&byline=0&portrait=0" width="700" height="300" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> </div> </div> <div class="mid-content"> <!--<h3>our idea started here</h3>--> <p> ideas are better when we can work together. we want everyone who participates to share the benefits of success. </p></div></div></div><!--service--><div class="services" id="crypto-equity"> <div class="col-md-3 crypto"> <div class="col-md-2 circle"></div> </div> <div class="col-md-6" style="padding: 0;"> <div id="home" class="col-md-12 service-top"><h1>what is crypto-equity?</h1></div> <div id="home" class="col-md-12 crypto-p"><h3>we are merging <br/>cryptocurrency + crowdfunding</h3></div> <div class="col-md-12"> <div class="col-md-11 crypto-text"> Issuing traditional equity can be complicated. Crypto-equity is a new form of sharing that simplifies this process. Once you establish your organisation on the Swarm platform, you can create your tokens, dictate their quantitative limits and issue them to participants. All tokens live in your Swarm Wallet which is built on the blockchain, so it&#39;s secure and traceable. </div> </div> </div> <div class="clearfix"> </div> </div><!--//services--><!--features--><div class="content-middle1"><div class="container"><div class="col-md-5"> <div class=" bottom-in1"> <div id="home" class="col-md-12 example"> <h3>we lead by example</h3> <p>This is the breakdown of how Swarm distributes equity tokens.</p> </div> <div class="col-md-12" style="text-align: center;"> <a class="col-md-8 hvr-sweep-to-right more fix-1" href="https://poloniex.com/exchange#btc_swarm">purchase swarm tokens</a> <a class="col-md-8 hvr-sweep-to-right more-transp" href="https://docs.google.com/spreadsheets/d/108ANCcl8fFzdUqD4RA80I4Uj1SLvFr6h6MU_T8wUZ2g/edit?usp=sharing">earn swarm tokens</a> </div> </div> </div> <div class="col-md-7"> <div class=" bottom-in"> <img style="max-width: 100%;" src="images/example.png"> </div> </div></div></div><!--//features--><!--phone--> <div class="color-logo" id="decentralized"> <div class="col-md-4 bg-clr"></div> <div class="col-md-4 lg-clr"><img src="images/logo_clr.png"></div> <div class="col-md-4"></div> </div><div class="phone phone-bg"><div class="container"> <div class="col-md-2"></div><div id="home" class="col-md-8 phone-text" style="text-align: center"><h1 class="cent">why decentralized?</h1><div class="text-1-bottom"> <p>The Distributed Collaborative Organization (DCO) structure helps brilliant ideas come to life. Find the help you need to fuel your idea. In exchange allow others to share equity in your projects. Success for you is success for everyone.</p></div> <div class="text-1-button"> <a href class="hvr-sweep-to-right more fix popup-with-zoom-anim" ng-click="createDCO()">start your project</a> <a href="https://swarm.fund/projects" class="hvr-sweep-to-right more-transp">explore projects</a> </div> <div class="col-md-6"> <div class="text-1"> <h5>freedom from traditional business structure</h5> <p>Creating and distributing tokens on the Swarm platform is free. When you commit to crypto-equity crowdfunding, you share your idea with other interested people who are willing to contribute to make the project a success. All participants are entitled to equal sharing opportunities. It is democracy for businesses of the future. </p> </div> </div> <div class="col-md-6"> <div class="text-1"> <h5>accessibility</h5> <p>The blockchain has allowed us to bring businesses fully into the digital age. You can collaborate with others to turn great ideas into reality.</p> <h5>full transparency</h5> <p>By hosting your project on the blockchain, all activities (transactions, decisions and project milestones) are public and secure.</p> </div> </div></div> <div class="col-md-2"></div></div></div><!--//phone--><div class="phone phone-bg2"><div class="container"> <div class="col-md-2"></div><div id="home" class="col-md-8 phone-text" style="text-align: center"> <h3 style="margin-bottom: 20px;">popular DCO articles</h5> <div class="col-md-6"> <div class="text-1"> <ul> <li><a href="http://www.scribd.com/doc/255347578/SWARM-Working-Paper-Distributed-Networks-and-the-Law#scribd">the white paper</a></li> <li><a href="https://medium.com/@rubenalexander/creating-your-own-distributed-collaborative-organization-f443bc686335">how to create your own DCO</a></li> </ul> </div> </div> <div class="col-md-6"> <div class="text-1"> <ul> <li><a href="https://docs.google.com/document/d/1NbtxiDl624fkv2fkJd2baP33-X2UtxrU8KvUjoS3Bgs/edit">DCO Step by Step guide</a></li> <li><a href="https://docs.google.com/document/d/1QTWyAlgARQqhoyiRxxrqfDvEreSyN4dbm3xO1jyUstg/edit#heading=h.53mqhrqnxgbg">faq</a></li> </ul> </div> </div></div> <div class="col-md-2"></div></div></div> <div class="content-kickstart" id="collaborative"> <div id="home"><h1>kickstart collaboration</h1></div> </div> <div class="phone-work"><div class="container"> <div class="col-md-2"></div><div id="home" class="col-md-8 phone-text" style="text-align: center"><h3 style="margin-bottom: 20px;">get work done more efficiently</h3> <div class="col-md-6"> <div class="text-1"> <h5 style="text-align: center"><img src="images/hands.png"></h5> <p style="text-align: center">Empower the Swarm by donating a percentage of your project tokens to Swarm token owners. We recommend 1-5%. It&#39;s a gesture of good faith that motivates others to contribute to your project. So goes the saying "good ideas attract success".</p> </div> </div> <div class="col-md-6"> <div class="text-1"> <h5 style="text-align: center"><img src="images/right.png"></h5> <p style="text-align: center">The Swarm platform provides you with open-source project management where you can assign tasks and reward contributors for completing them.<br/><br/> As a contributor, apply your skill sets to help propel projects that interest you. Gone are the days of applying for work. </p> </div> </div></div></div></div> <div class="content-yellow"> <div class="container"> <div class="col-md-2"></div><div id="home" class="col-md-8 phone-text" style="text-align: center"> <h3 style="margin-bottom: 20px;">collaborate with Swarm</h3> <a class="hvr-sweep-to-right more fix" href="http://discourse.swarm.fund/">the Swarm forum</a> <a class="hvr-sweep-to-right more fix" href="https://swarmfund.slack.com">swarm on Slack</a> <a class="hvr-sweep-to-right more fix" href="https://docs.google.com/forms/d/15mNeZ9nkakiXAFgDGTWxDOphed1ldxkaGyLsEo-qxOs/viewform">become an Agent</a> <div class="col-md-12 social"> <a href="https://www.facebook.com/swarmcorp"><img src="images/facebook.png"></a> <a href="https://twitter.com/swarmcorp"><img src="images/twitter.png"></a> <a href="https://medium.com/@Swarm"><img src="images/myspace.png"></a> <a href="https://vimeo.com/swarmcorp"><img src="images/vemo.png"></a> <a href="https://www.reddit.com/r/swarm"><img src="images/uk.png"></a> <a href="https://www.youtube.com/channel/UCaibgDrWuPuP92_U8bsWMXA/feed"><img src="images/youtube.png"></a> </div></div> <div class="col-md-2"></div></div> </div><!--project---><div class="project"> <div class="see"> <h4><a href="http://status.swarm.fund/">see what we&#39;re up to</a></h4> </div><div class="container see-content"> <div class="col-md-12"><div class="project-top"> <div id="home" class="col-md-12 space"> <h2>the swarm team</h2> </div> <div class="col-md-12"> <h4 class="space">swarm delegates</h4> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/andrew.png" class="img-responsive zoom-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Andrew Cook</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/ruben.png" class="img-responsive zoom-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Ruben Brito</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/thomas.png" class="img-responsive zoom-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Thomas Olson</h5> </div> </div> </div> </div> </div> <div class="clearfix"> </div> <div class="col-md-12"> <h4 class="space">swarm core team</h4> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/caterina.png" class="img-responsive zoom-img team-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Caterina Rindi</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/kathrine.png" class="img-responsive zoom-img team-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Kathrine Reyes</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/pavlo.png" class="img-responsive zoom-img team-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Pavlo Shandro</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/andy.png" class="img-responsive zoom-img team-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Andy Tudhope</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/zeeshan.png" class="img-responsive zoom-img team-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Zeeshan Arif</h5> </div> </div> </div> </div> </div> <div class="clearfix"> </div> <div class="col-md-12"> <h4 class="space">notable swarm agents</h4> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/joel.png" class="img-responsive zoom-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Joel Dietz<br/> Agent X<br/> Swarm Founder</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/kennedy.png" class="img-responsive zoom-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Scott Kennedy<br/> CEO <br/> Openlabel</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/david.png" class="img-responsive zoom-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>David Bressler<br/> VP Financial Solutions<br/> CA Techonologies</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/michael.png" class="img-responsive zoom-img" alt=""/></a> <div class="col-md1"> <div class="col-md2 grosser"> <h5>Michael Grosser<br/> CEO<br/> SeeTheProgress | OpenSource + Blockchain consultancy</h5> </div> </div> </div> </div> <div class="col-md-2 project-grid pull-left"> <div class="project-grid-top"> <img src="images/ccm.png" class="img-responsive zoom-img" alt=""/></a> <div class="col-md1"> <div class="col-md2"> <h5>Writers<br/> CryptoCurrency Magazine </h5> </div> </div> </div> </div> </div> <div class="clearfix"> </div> <div class="col-md-12"> <h4 class="space-collab">collaborative partners</h4> <div class="col-md-6 project-grid"> <div class="project-grid-top"> <a href="http://whizpool.com/" class="mask"><img src="images/whizpool.png" class="img-responsive zoom-img" alt=""/></a> </div> </div> <div class="col-md-6 project-grid"> <div class="project-grid-top"> <a href="http://www.citizencode.io/" class="mask"><img src="images/citizen.png" class="img-responsive zoom-img" alt=""/></a> </div> </div> </div></div></div> <div class="clearfix"> </div></div></div><!--footer--><div class="footer"><div class="container"><div class="footer-top-at"> <div class="col-md-2"></div><div class="col-md-3 amet-sed"><ul class="nav-bottom"><li><a href="https://swarm.fund/">home</a></li><li><a href="https://medium.com/@Swarm/history-of-the-swarm-83ff0fc80a8">history of swarm</a></li><li><a href="https://discourse.swarm.fund/t/mission-and-core-values/33">mission and core values</a></li><li><a href="https://docs.google.com/spreadsheets/d/1fcQr1pX8b4QwZqX1ruEUDx2S1KOzoLhViRASNJBo5FU/edit#gid=0">financials</a></li> <li><a href="http://www.swarmbot.io">swarmbot</a></li></ul></div><div class="col-md-3 amet-sed "><ul class="nav-bottom"> <li><a href="https://poloniex.com/exchange#btc_swarm">purchase Swarm tokens</a></li> <li><a href="https://docs.google.com/spreadsheets/d/108ANCcl8fFzdUqD4RA80I4Uj1SLvFr6h6MU_T8wUZ2g/edit?usp=sharing">earn Swarm tokens</a></li> <li><a href="https://docs.google.com/document/d/1QTWyAlgARQqhoyiRxxrqfDvEreSyN4dbm3xO1jyUstg/edit#heading=h.53mqhrqnxgbg">DCO faq</a></li> <li><a href="http://discourse.swarm.fund/">the swarm forum</a></li> <li><a href="https://docs.google.com/forms/d/15mNeZ9nkakiXAFgDGTWxDOphed1ldxkaGyLsEo-qxOs/viewform">Swarm Agent application</a></li></ul></div><div class="col-md-3 amet-sed "> <ul class="nav-bottom"> <li><a href="http://status.swarm.fund/">team status</a></li> <li><a href="http://web.archive.org/web/20150610031203/http://a.pomf.se/chmtyp.html">press</a></li> <li><a href="https://docs.google.com/forms/d/15mNeZ9nkakiXAFgDGTWxDOphed1ldxkaGyLsEo-qxOs/viewform">contact</a></li> <li><a href="https://medium.com/@Swarm">blog</a></li> <li><a href="http://swarmcorp.us8.list-manage1.com/subscribe?u=4732a1fb776368d4ae20d1c89&id=0b6d6debd1">newsletter</a></li> <li><a href="https://swarm.fund/terms">terms of use</a></li> <li><a href="https://swarm.fund/privacy-policy">privacy policy</a></li></ul><ul class="social"> <li><a href="https://www.facebook.com/swarmcorp"><img src="images/fb.png" /></a></li> <li><a href="https://twitter.com/swarmcorp"><img src="images/tw.png" /></a></li> <li><a href="https://medium.com/@Swarm"><img src="images/ms.png" /></a></li> <li><a href="https://vimeo.com/swarmcorp"><img src="images/vm.png" /></a></li> <li><a href="https://www.reddit.com/r/swarm"><img src="images/fold.png" /></a></li> <li><a href="https://www.youtube.com/channel/UCaibgDrWuPuP92_U8bsWMXA/feed"><img src="images/yt.png" /></a></li></ul></div><div class="clearfix"> </div></div> </div></div>'), a.put("partials/app/login.html", '<div da-spinner ng-show=loading></div><div class=container><div class=login-form-popup><form class="login-form six centered columns loading" name=form.login ng-submit=login() novalidate><div class="five centered columns"><h4>Login</h4><label><span class=error ng-show=hasError(form.login.email)>{{form.login.email.errorMessage}}</span> <input da-autofill type=email name=email placeholder="Email Address" ng-pattern="/^((([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))$/i" ng-model=login.email ng-required="true"></label><label><span class=error ng-show=hasError(form.login.password)>{{form.login.password.errorMessage}}</span> <input da-autofill type=password name=password placeholder=Password ng-model=login.password ng-required="true"></label><a href class=forgot-password ng-click=forgotPassword()>Forgot password?</a> <input type=submit value="Log in"><p>Don\'t have an account? <a href ng-click=goToSignUp()>Sign up</a></p></div></form></div></div>'), a.put("partials/app/modal/login.html", '<div class=container><div da-spinner ng-show=loading></div><div class=login-form-popup><form class="login-form six columns loading" name=form.login ng-submit=login() novalidate><div class="five centered columns"><h4>Login</h4><label><span class=error ng-show=hasError(form.login.email)>{{form.login.email.errorMessage}}</span> <input da-autofill type=email name=email placeholder="Email Address" ng-pattern="/^((([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))$/i" ng-model=login.email ng-required="true"></label><label><span class=error ng-show=hasError(form.login.password)>{{form.login.password.errorMessage}}</span> <input da-autofill type=password name=password placeholder=Password ng-model=login.password ng-required="true"></label><a href class=forgot-password ng-click=forgotPassword()>Forgot password?</a> <input type=submit value="Log in"><p class=align-center>Don\'t have an account? <a href ng-click=signUp()>Sign up</a></p><span class=divider><b>or</b></span> <a href class="simple facebook button" ng-click=loginWithFacebook()>Log In with Facebook</a></div></form></div></div>'), a.put("partials/app/modal/notification.html", '<div class=container><div class="six columns notification"><p ng-bind-html=notificationText></p></div></div>'), a.put("partials/app/modal/password-reminder.html", '<div class=container><div da-spinner ng-show=loading></div><div class=login-form-popup><form class="login-form remind-password six columns loading" name=form.reminder ng-submit=remind() novalidate><div class="five centered columns"><h4>Password reminder</h4><label><span class=error ng-show=hasError(form.reminder.email)>{{form.reminder.email.errorMessage}}</span> <input da-autofill type=email name=email placeholder="Email Address" ng-pattern="/^((([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))$/i" ng-model=reminder.email ng-required="true"></label><input type=submit value="Remind password"></div></form></div></div>'), a.put("partials/app/modal/signup.html", '<div class=container><div da-spinner ng-show=loading></div><div class=signup-form-popup><form novalidate name=form.signup class="signup-form seven columns" ng-submit=signup()><h4>Sign Up</h4><div class="six centered columns"><label class="three alpha columns"><span class=error-placeholder ng-if="!hasError(form.signup.firstName) && hasError(form.signup.lastName)">&nbsp;</span> <span class=error ng-show=hasError(form.signup.firstName)>{{form.signup.firstName.errorMessage || \'&nbsp;\'}}</span> <input name=firstName placeholder="First name" ng-model=signup.firstName ng-required="true"></label><label class="three omega columns"><span class=error-placeholder ng-if="hasError(form.signup.firstName) && !hasError(form.signup.lastName)">&nbsp;</span> <span class=error ng-show=hasError(form.signup.lastName)>{{form.signup.lastName.errorMessage || \'&nbsp;\'}}</span> <input name=lastName placeholder="Last name" ng-model=signup.lastName ng-required="true"></label><label class="six alpha columns"><span class=error ng-show=hasError(form.signup.email)>{{form.signup.email.errorMessage || \'&nbsp;\'}}</span> <input type=email name=email placeholder=Email ng-model=signup.email ng-pattern="/^[a-z]+[a-z0-9._-]+@[a-z]+\\.[a-z.]{2,5}$/" ng-required="true"></label><label class="three alpha columns"><span class=error-placeholder ng-if="!hasError(form.signup.password) && !passwordsMatch()">&nbsp;</span> <span class=error ng-show=hasError(form.signup.password)>{{form.signup.password.errorMessage || \'&nbsp;\'}}</span> <input type=password name=password placeholder=Password ng-change="form.signup.password.$invalid ? resetPasswordValidity() : null" ng-model=signup.password ng-required="true"></label><label class="three omega columns"><span class=error-placeholder ng-if="hasError(form.signup.password) && passwordsMatch()">&nbsp;</span> <span class=error ng-show=!passwordsMatch()>{{form.signup.passwordConfirm.errorMessage || \'&nbsp;\'}}</span> <input type=password name=passwordConfirm placeholder="Confirm password" ng-model=signup.passwordConfirm ng-required="passwordRequired"></label><input type=submit value="Sign up" class="button green simple"><p class=terms>By signing up, I agree to Swarm\'s <a href=/terms target=_blank>Terms of Service</a> and <a href=/privacy-policy target=_blank>Privacy Policy</a>.</p><p class=align-center>Already registered? <a href ng-click=login()>Log in</a></p><span class=divider><b>or</b></span> <a href class="simple facebook button" ng-click=loginWithFacebook()>Sign Up with Facebook</a></div></form></div></div>'), a.put("partials/app/modal/update-password.html", '<div class=container><div da-spinner ng-show=loading></div><div class=login-form-popup><form class="login-form update-password six columns loading" name=form.update ng-submit=update() novalidate><div class="five centered columns"><h4>Please update your password</h4><label><span class=error ng-show=hasError(form.update.newPassword)>{{form.update.newPassword.errorMessage}}</span> <input type=password name=newPassword placeholder="New password" ng-model=update.newPassword ng-required="true"></label><input type=submit value="Update"></div></form></div></div>'), a.put("partials/app/modal/wallet-download-confirmation.html", '<div class="wallet-confirmation container"><div da-spinner ng-show=loading></div><h1>Confirm!</h1><div class="six centered columns"><p>I confirm that I’ve saved my paper wallet somewhere very safe and that I will be able to access it again. I also confirm I realize that if I ever lose this paper wallet I will completely lose access to all my Bits. I also confirm that if I let anyone else have this paper wallet I may lose access to all my Bits.</p><a class="simple green button" ng-click=walletDownloadConfirm()>I saved my paper wallet</a> <a href ng-click=getPaperWallet()>Download again</a></div></div>'), a.put("partials/app/portfolio.html", '<div class=container><div class=bg-transparent da-spinner ng-show=loading ng-style="{\'min-height\': 150}"></div><div ng-if=projects><nav class=filters><input class="six pull-right columns" ng-model=projectSearchFilter placeholder="Search"> <a href class="three columns button" ng-click="activeFilter = \'visibleProjects\'" ng-class="{\'blue\': activeFilter == \'visibleProjects\'}">All</a> <a href class="three columns button" ng-click="activeFilter = \'openSaleProjects\'" ng-class="{\'blue\': activeFilter == \'openSaleProjects\'}">Open</a> <a href class="three columns button" ng-click="activeFilter = \'completedProjects\'" ng-class="{\'blue\': activeFilter == \'completedProjects\'}">Completed</a></nav><h3 ng-if=!filtered.length class=search-empty>Your search - <b>{{projectSearchFilter}}</b> - did not match any projects.</h3><ul ng-show=filtered.length><li class="project one-third column" ng-class="{\'completed\': isSaleCompleted(project), \'dco\': project.project_type == \'DCO\'}" ng-repeat="project in filtered = (projects | projectsFilter:activeFilter | filter:{project_name: projectSearchFilter}) track by $index"><div class=project-logo ng-style=projectCover(project)><a href class=button ng-if=!isSaleCompleted(project) ng-click=goToProject(project)><b>Join</b> project</a></div><div class=project-content><h3>{{project.project_name}}</h3><p>{{project.project_description}}</p><div ng-if="project.project_type !== \'DCO\'"><ul class=metrics ng-if="!isSaleCompleted(project) && !isPresale(project)"><li>{{projectMetrics(project).number_of_backers || 0}} <span>members</span></li><li>{{projectMetrics(project).btc_raised | number: 2}}BTC <span>raised</span></li><li da-depriciation-countdown depreciation=projectMetrics(project).price_increase_date ng-show=countdown>{{countdown}} <span>next price increase</span></li></ul><div class=completed-sale-info ng-if=isSaleCompleted(project)><h4>Sale completed</h4><p>On {{completedSaleResult(project).date}}, {{completedSaleResult(project).raised}}BTC raised</p></div><div class=presale-info ng-if=isPresale(project)><h4>Presale</h4><p>{{presaleData(project)}} till open sale</p></div><span class=progress ng-style="{\'width\': projectMetrics(project).percentage_of_goal+\'%\'}"></span></div></div><a href class="star icon" title="{{project.project_starred ? \'UnStar project\' : \'Star project\'}}" ng-class="{\'icon-star\': project.project_starred, \'icon-star-o\': !project.project_starred}" ng-if=starAvailable ng-click=starProject(project)></a></li></ul></div></div>'), a.put("partials/app/privacy-policy.html", "<div class=content><div class=container><h1><b>Privacy</b> Policy</h1><h2>(Last updated: October 21, 2014)</h2><div class=legal-block><p>This Privacy Policy, as amended or otherwise changed from time to time (the “Privacy Policy”), explains the manner in which EVRGR (“Swarm”) collects, uses, maintains and discloses user information obtained through the swarm.co website (the “Site”). The terms “we,” “us,” and “our” refer to Swarm. By using the Site, you consent to the data practices prescribed in this Privacy Policy. On occasion, Swarm may revise this Privacy Policy to reflect changes in law, our personal data collection and use practices, the features on the Site, or advances in technology. If material changes are made to this Privacy Policy, the changes will be prominently posted on the Site.</p></div><div class=legal-block><h3>Information collected</h3><p><b>General Information.</b> We collect and store information you enter on our Site. We may collect or receive the following identifying information about you:</p><ul><li><p>First and Last Name</p></li><li><p>Email Address</p></li><li><p>Country of Residence</p></li><li><p>Additional information that may help us validate your identity, including address, date of birth, and phone number.</p></li></ul><p><b>Automatic Information.</b> We automatically collect some information about your computer, tablet or mobile device when you visit the Site, or open a communication from Swarm, including your IP address and browser software (such as Firefox, Safari, Chrome or Internet Explorer).</p><p>In order to help protect you from fraud and misuse of your personal information, we may collect information about your use and interaction with our website or Swarm services. For example, we may evaluate your computer, mobile phone or other access device to identify any malicious software or activity that may affect the availability of Swarm services.</p></div><div class=legal-block><h3>How we use your information</h3><p>We use information about you to provide you with the Swarm services, which may include but is not limited to:</p><ul><li><p>Preventing potentially fraudulent or illegal activities;</p></li><li><p>Personalizing your user experience;</p></li><li><p>Providing customer support services;</p></li><li><p>Improving our Site and services;</p></li><li><p>Marketing, advertising or promotional efforts; and</p></li></ul></div><div class=legal-block><h3>How we share your information</h3><p>We may share your personal information with the following entities:</p><ul><li><p>Project Creators – Each Project will be provided with the name and email address of each Backer, their Pledge Amount, and the corresponding Reward.</p></li><li><p>Third-party vendors who provide services or functions on our behalf, including business analytics, customer service, marketing, and fraud prevention.</p></li><li><p>Business partners with whom we may jointly offer products or services, or whose products or services may be offered on our Site. Please note that we do not control the privacy practices of these business partners.</p></li></ul><p>We also may share your information:</p><ul><li><p>In response to subpoenas, court orders, or other legal process; to establish or exercise our legal rights; to defend against legal claims; or as otherwise required by law. In such cases we reserve the right to raise or waive any legal objection or right available to us.</p></li><li><p>When we believe it is appropriate to investigate, prevent, or take action regarding illegal or suspected illegal activities; to protect and defend the rights, property, or safety of our company or this Site, our users, or others; and in connection with our Platform Services Agreement.</p></li></ul><p>Other than as set out above, you will be notified when personal information about you will be shared with third. We also may share aggregate or anonymous information with third parties, including investors and banking partners. This information does not contain any personal information and is used to develop the Swarm services.</p></div><div class=legal-block><h3>How you can access and update your information</h3><p>You can access and update your contact information logging into your Swarm account and accessing your account dashboard. You can close your account by contacting us at the email address listed below. Please note that after you close an account, you will not be able to sign in or access any of your personal information. However, you can open a new account at any time. Please also note that we may retain certain information associated with your account, including for analytical purposes as well as for record keeping integrity.</p></div><div class=legal-block><h3>Cookies & persistent local data</h3><p>Cookies are small data text files and can be stored on your computer's hard drive (if your Web browser permits). The Site uses cookies for the following purposes:</p><ul><li><p>Analytics/Log Files. Our Site and services gather certain information automatically and store it in log files. This information includes internet protocol (IP) addresses, browser type, internet service provider (ISP), operating system, date/time stamp, and clickstream data;</p></li><li><p>To provider you with a better user experience; and</p></li><li><p>Improve the effectiveness and efficiency of the Swarm services.</p></li></ul></div><div class=legal-block><h3>How we protect your information</h3><p>We want you to feel comfortable using our Site, and we are committed to protecting the information we collect and receive from you. While we cannot guarantee security, we have implemented appropriate administrative, technical, and physical security procedures to help protect the personal information that is collected and stored, and information that you provide to us directly For example, we use encryption when transmitting your sensitive personal information between your system and ours, and we employ firewalls and intrusion detection systems to help prevent unauthorized persons from gaining access to your information.</p></div><div class=legal-block><h3>External links</h3><p>If any part of the Site links you to external websites or applications (each an “External Site”), those External Sites do not operate under this Privacy Policy. We recommend you examine the privacy statements posted on the External Sites to understand their procedures for collecting, using, and disclosing personal information.</p></div><div class=legal-block><h3>Visiting our website from outside the united states</h3><p>If you are visiting our website from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States, where our servers are located and our central database is operated. The data protection and other laws of the United States and other countries might not be as comprehensive as those in your country, but please be assured that we take steps to ensure that your privacy is protected. By using our services, you understand that your information may be transferred to our facilities and those third parties with whom we share it as described in this Policy.</p></div><div class=legal-block><h3>How you can contact us</h3><p>If you have questions about either this Privacy Policy, please email us at <a href=mailto:support@swarmcorp.com>support@swarmcorp.com</a>.</p></div></div></div>"), a.put("partials/app/project.html", '<section class=project-banner><div class=project-cover ng-style=projectCover(project)></div><div class=container><div class="banner-content twelve centered columns"><span class=project-logo ng-style="{\'background-image\': \'url(\'+project.project_logo+\')\'}"></span><h1 ng-bind-html=project.project_name></h1><h2 ng-bind-html=project.project_description></h2><ul class=metrics ng-if=!isDCO><li>{{projectMetrics.days_remaining}} <span>days to go</span></li><li>{{projectMetrics.number_of_backers || 0}} <span>members</span></li><li>{{coinsForDollar | currency:undefined:3}} <span>{{project.project_coin}} fiat price</span></li><li ng-show=projectMetrics.price_increase_date>{{projectMetrics.price_increase_date}} <span>Next price increase</span></li></ul><span class=progress ng-style="{\'width\': projectMetrics.percentage_of_goal+\'%\'}"></span></div></div></section><section class=project-nav><div class=container><nav class="twelve centered columns"><img ng-src="" alt=""> <a href ng-class="{\'active\': projectSection == \'description\'}" ng-click="setSection(\'description\')">Details</a> <a href ng-show=project.company.forum ng-class="{\'active\': projectSection == \'discussion\'}" ng-click="setSection(\'discussion\')">Discussion</a> <a href target=_blank ng-if="!isDCO || isDCO && project.project_join_url" class="pull-right button" ng-hide=socialVisible ng-href="{{isDCO ? project.project_join_url : null}}" ng-click="!isDCO ? fund() : false"><b>Join</b> project</a><ul class="nav-social pull-right"><li><a href da-social-share type="\'facebook\'" link="\'http://swarm.fund/projects/\'+project.$id" picture=project.project_thumbnail caption="projectName+\' on http://swarm.fund/\'" description="\'Check out the crowdsale of \'+projectName+\' on http://swarm.fund/\'" tags="[\'swarmcorp\', \'bitcoin\', project.project_hashtag]"><i class="icon icon-facebook"></i></a></li><li><a href da-social-share type="\'twitter\'" link="\'http://swarm.fund/projects/\'+project.$id" picture=project.project_thumbnail caption="projectName+\'on http://swarm.fund/\'" description="\'Check out the crowdsale of \'+projectName+\' on http://swarm.fund/\'" tags="[\'swarmcorp\', \'bitcoin\', project.project_hashtag]"><i class="icon icon-twitter"></i></a></li><li><a href da-social-share type="\'googleplus\'" link="\'http://swarm.fund/projects/\'+project.$id" picture=project.project_thumbnail caption="projectName+\'on http://swarm.fund/\'" description="\'Check out the crowdsale of \'+projectName+\' on http://swarm.fund/\'" tags="[\'swarmcorp\', \'bitcoin\', project.project_hashtag]"><i class="icon icon-google-plus"></i></a></li></ul></nav></div></section><section class=project-description ng-show="projectSection == \'description\'"><div class=container><div class="twelve centered columns"><div class=description ng-repeat="paragraph in project.description track by $index"><div class=text ng-if="paragraph.type == \'text\'" ng-bind-html=paragraph.value></div><img alt="" ng-if="paragraph.type == \'image\'" ng-src="{{paragraph.value}}/convert?w=700&fit=scale&quality=100"><div class=video ng-if="paragraph.type == \'video\'"><iframe style="width: 700px; height: 525px" ng-src={{trustSrc(paragraph.value)}} frameborder=0 allowfullscreen></iframe></div></div><div class=faq ng-if=project.faq><h3>Faq</h3><ul><li ng-repeat="faq in project.faq track by $index" ng-class="{\'last\': $last, \'active\': activeFaqIndex == $index}"><div class=question ng-click=toggleFaq($index)><p>{{faq.question}}</p></div><div class=answer ng-show="activeFaqIndex == $index"><p>{{faq.answer}}</p></div></li></ul></div><div class=company ng-if=project.company><h3>Company</h3><div class=company-description ng-bind-html=project.company.description></div><ul class=company-contacts><li class="four alpha columns" ng-if=project.company.phone><h5>Phone</h5><span>{{project.company.phone}}</span></li><li class="four columns" ng-if=project.company.email><h5>Email</h5><a target=_blank ng-href=mailto:{{project.company.email}}>{{project.company.email}}</a></li><li class="four omega columns" ng-if=project.company.website><h5>Website</h5><a target=_blank ng-href={{project.company.website}}>{{project.company.website}}</a></li><li class=break></li><li class="four alpha columns" ng-if=project.company.facebook><a href class="facebook button" target=_blank ng-href={{project.company.facebook}}>Facebook</a></li><li class="four columns" ng-if=project.company.twitter><a href class="twitter button" target=_blank ng-href={{project.company.twitter}}>Twitter</a></li><li class="four omega columns" ng-if=project.company.youtube><a href class="youtube button" target=_blank ng-href={{project.company.youtube}}>Youtube</a></li></ul></div></div></div></section><section class=project-discussion ng-show="projectSection == \'discussion\'"><div class=container><div class="twelve centered columns"><div class=project-discussion-topic ng-repeat="projectDiscussionTopic in projectDiscussion track by $index" ng-class="{\'last\': $last}"><ul><li class=project-discussion-post ng-repeat="projectDiscussionPost in projectDiscussionTopic.posts track by $index"><header class=post-header><img class=project-discussion-avatar ng-src="{{projectDiscussionPost.avatar_template | discourseUserAvatar:45}}" alt=""> <span class=project-discussion-username>{{projectDiscussionPost.display_username}}</span> <span class=project-discussion-relative-date>{{projectDiscussionPost.created_at | relativeDate}}</span></header><h4 ng-if=$first>{{projectDiscussionTopic.title}}</h4><div da-discourse-compile=projectDiscussionPost.cooked></div><span class=project-discussion-likes>{{projectDiscussionPost.like_count | discourseLike}}</span></li></ul></div><a class="discuss gray button" href=http://discourse.swarm.fund/c/swarm-projects/{{projectName}} target=_blank>{{projectDiscussion.length ? \'Comment\' : \'Be the first to comment\'}}</a></div></div></section>'), a.put("partials/app/terms.html", '<div class=content><div class=container><h1><b>Terms</b> of Use</h1><h2>(Last updated: October 21, 2014)</h2><div class=legal-block><p>Welcome to Swarm. By using this website (the “Site”) and services (together with the Site, the “Services”) offered by EVRGR Corporation, (“Swarm”), you agree to comply with and be legally bound by these terms (the “Terms”). If you do not agree to any of the terms set forth herein, you may not access or use any of the Services.</p></div><div class=legal-block><h3>1. Definitions.</h3><p>In these Terms, we refer to those raising funds as “Project Creators” and to their fundraising campaigns and the subsequent development of their products or services as “Projects”. We refer to those contributing funds as “Backers” and to the funds they contribute as “Pledges”. Project Creators, Backers and other visitors to the Services are referred to collectively as “Users”.</p></div><div class=legal-block><h3>2. The swarm platform.</h3><p>Swarm provides a funding platform for creative projects. When a Project is approved and posted on the platform, the Project Creator is inviting other people to form a contract with them. By making a Pledge, Backers are accepting the Project Creator’s offer and forming a contract with them. Project Creator’s can offer gifts or rewards to Backer’s in the form of cryptographic tokens, redeemable with the Project Creator at some point in the future for tangible products or intangible services (“Rewards”).</p></div><div class=legal-block><h3>3. Obligations.</h3><p>When a Project receives a Pledge from a Backer, the Project Creator becomes legally obligated to complete the Project and provide each Backer with their Reward. If a Project Creator is unable fulfill any of these obligations, the Project Creator agrees to use every reasonable effort to pursue a compromise with the Backers of the Project. Project Creators are solely responsible for fulfilling the promises made in their Project. If they’re unable to satisfy these Terms, they may be subject to legal action by Backers.</p></div><div class=legal-block><h3>4. Rewards.</h3><p>In consideration for funding a Project, a Project Creator may offer a Reward to a Backer. Rewards will initially come in the form of cryptographic tokens and will be distributed to a Backer shortly after receiving the Pledge, in an amount proportional to the Pledge amount. At some point in the future (e.g. when the Project is completed) the tokens will be redeemable for tangible products or intangible services as specified by the Project Creator. A token may also have additional rights associate with it, such as the right to vote on aspects or the direction of the product or service. Project Creators are not permitted to provide any of the following as a Reward:</p><ul><li><p>a security (as such term is defined in the Securities Act of 1933)</p></li><li><p>any form of financial incentive or profit sharing instrument</p></li><li><p>illegal goods</p></li><li><p>drug or alcohol related paraphernalia</p></li><li><p>illicit or offensive material</p></li><li><p>weapons or related accessories</p></li></ul></div><div class=legal-block><h3>5. Pledges.</h3><p><b>5.1 Bitcoin.</b> Pledges can be made in either US Dollars or bitcoin. Because bitcoin transactions are irreversible, make sure you are using the correct wallet address before you fund a Project. Project Creators will receive all Pledges, minus any fees received Swarm, at the conclusion of the fundraising campaign. Receipt of Pledges is not conditional upon a Project meeting its funding goal. Project Creators are encouraged to store bitcoin in a secure location (e.g. BitGo Enterprise Multi-Signature Wallet). Swarm is not responsible for lost or stolen bitcoin.</p><p><b>5.2 Project Creators.</b> Responsibility for completing a project lies entirely with the Project Creator. Swarm does not hold funds on a Project Creator’s behalf, cannot guarantee Project Creator’s work, and will not offer refunds. Project Creators may, solely at their own discretion, make individual refunds to Backers. If you return a Pledge to the Backer, you have no further obligation to that Backer, and no agreement exists between you.</p><p><b>5.3 Backers.</b> As a Backer, you are solely responsible for doing your research before funding a Project. All Pledges are made voluntarily and at your sole discretion and risk. Swarm does not guarantee that Pledges will be used as promised, that Project Creators will deliver the Rewards, or that the Project will achieve its goals. Swarm does not endorse, guarantee, make representations, or provide warranties for or about the quality, safety, morality or legality of any Project, Reward, Pledge, or the truth or accuracy of the Project Content.</p><p><b>5.4 Taxes.</b> Project Creators shall be responsible for all tax obligations associated with Pledges and Rewards. Because Pledges may be made in bitcoin, we encourage all Project Creators to consult with a licensed tax advisor from their local jurisdiction when planning their Project to understand and prepare for the tax obligations associated raising funds in digital currency.</p></div><div class=legal-block><h3>6. Fees.</h3><p>Swarm shall receive the fees set forth in the Fee Schedule, in addition to any fees from its payments partners. Fees are collected on all Projects, regardless of whether or not the Project meets its funding goal. Pledges made in fiat currency may be collected and processed by payment providers. Swarm is not responsible for the performance of its payment providers. Users are responsible for paying all taxes associated with the use of the Services.</p></div><div class=legal-block><h3>7. Prohibited activities.</h3><p>In connection with your use of the Services, you will not:</p><ul><li><p>Violate or assist any party in violating any law, statute, ordinance, regulation or any rule of any self-regulatory or similar organization of which you are or are required to be a member through your use of the Services;</p></li><li><p>Provide false, inaccurate or misleading information;</p></li><li><p>Infringe upon Swarm’s or any third party’s copyright, patent, trademark, or intellectual property rights;</p></li><li><p>Distribute unsolicited or unauthorized advertising or promotional material, any junk mail, spam or chain letters;</p></li><li><p>Reverse engineer or disassemble any aspect of the Services in an effort to access any source code, underlying ideas and concepts, and algorithms;</p></li><li><p>Take any action that imposes an unreasonable or disproportionately large load on our infrastructure, or detrimentally interfere with, intercept, or expropriate any system, data, or information;</p></li><li><p>Transmit or upload any material to the Site that contains viruses, Trojan horses, worms, or any other harmful or deleterious programs;</p></li><li><p>Otherwise attempt to gain unauthorized access to the Site, other Swarm Project Accounts, computer systems or networks connected to the Site, through password mining or any other means; or</p></li><li><p>Transfer any rights granted to you under these Terms.</p></li></ul></div><div class=legal-block><h3>8. Third party websites.</h3><p><b>8.1 Links to third party websites and resources.</b> The Site may contain links to third party websites and resources (“Third Party Material”) not controlled by us. You acknowledge and agree that Swarm is not responsible or liable for (i) availability or accuracy of such Third Party Material, (ii) the content, products or services on or available from such Third Party Material. Links to such Third Party Material do not imply any endorsement by Swarm of such Third Party Material or the content, products or services available from such Third Party Material. You acknowledge sole responsibility for and assume all risk arising from your use of any such Third Party Material.</p><p><b>8.2 Third Parties are a vital part of our business.</b> We use Third Party services to do many things, from hosting our website, to trading Bitcoins on an open market. In no way do we claim to be a part of/or related to these Third Parties (unless otherwise stated­). Swarm cannot and will not be held responsible for any actions, good or bad, of Third Parties (this includes but is not limited to: delay of funding, loss of data, etc.). To protect our clients and ourselves, we do now and will only use, highly reputable Third Parties to conduct business with.</p><p>Occasionally we may include and/or offer Third Party products, services and/or links. If and when we choose to is completely at our discretion. Each of these Third Party sites have they own separate and independent privacy policies and in no way are related to us, unless otherwise stated. It is completely your choice to click on/use these Third Parties and we hold no responsibility on what happens between you and the Third Parties.</p><p>We use a browser feature known as a “cookie“, which assigns a unique identification to your computer. Cookies are typically stored on your computer’s hard drive. Information collected from cookies is used by us to evaluate the effectiveness of our Site, analysis of trends, and administer the Platform. The information collected from cookies allows us to determine such things as which parts of our Site are most visited and difficulties our visitors may experience in accessing our Site. With this knowledge, we can improve the quality of your experience on the Platform by recognizing and delivering more of the most desired features and information, as well as by resolving access difficulties.</p><p>We use third party service provider(s), to assist us in better understanding the use of our Site. Our service provider(s) will place cookies on the hard drive of your computer and will receive information that we select that will educate us on such things as how visitors navigate around our site, what products are browsed. Our service provider(s) analyses this information and provides us with reports. The information and analysis provided by our service provider(s) will be used to assist us in better understanding our visitors’ interests in our Site and how to better serve those interests. The information collected by our service provider(s) may be linked to and combined with information that we collect about you while you are using the Platform. Our service provider(s) is/are contractually restricted from using information they receive from our Site other than to assist us.</p><p>By using our site or using our services you are agreeing that we may use cookies for the purposes that have been set out above.</p></div><div class=legal-block><h3>9. Licenses.</h3><p><b>9.1 License Granted to Swarm.</b> By submitting an application to raise funds on the Site, you are agreeing to the terms of this Section 9.1. You own any and all content and information you post on the Site, including but not limited to personal information, photographs, videos, descriptions of your product or service, and other information you post or share using the Services (“Project Content”), and may request its deletion at any time, unless you have shared information or content with others and they have not deleted it, or it was copied or stored by other Users. Additionally, you grant Swarm a non-exclusive, irrevocable, worldwide, perpetual, assignable, sublicensable and royalty-free right to use, exercise, commercialize, and exploit the copyright, publicity, trademark, and database rights with respect to your Project Content.</p><p>Any content or information you submit to us is at your own risk. All information submitted to the Site, whether publicly posted or privately transmitted, is the sole responsibility of the person from whom the content originated. Swarm will not be liable for any errors or omissions in any content. By providing content or information to us, you represent and warrant that you are entitled to submit it and that it is not confidential and not in violation of any law, contractual restrictions or other third party rights (including any intellectual property rights).</p><p><b>9.2 License Granted to Users.</b> Swarm grants you a limited, nonexclusive, nontransferable license, subject to these Terms, to access and use the Services, and the content, materials, information and functionality available in connection therewith (collectively, the “Content”) solely for information, transactional, or other approved purposes as permitted by Swarm from time to time. Any other use of the Services or Content is expressly prohibited. All other rights in the Services or Content are reserved by us and our licensors. You will not otherwise copy, transmit, distribute, sell, resell, license, de-compile, reverse engineer, disassemble, modify, publish, participate in the transfer or sale of, create derivative works from, perform, display, incorporate into another website, or in any other way exploit any of the Content or any other part of the Services or any derivative works thereof, in whole or in part for commercial or non-commercial purposes. Without limiting the foregoing, you will not frame or display the Site or Content (or any portion thereof) as part of any other web site or any other work of authorship without the prior written permission of Swarm. If you violate any portion of these Terms, your permission to access and use the Services may be terminated pursuant to these Terms. In addition, we reserve the right to all remedies available at law and in equity for any such violation. “swarm.co”, “Swarm”, and all logos related to the Services or displayed on the Site are either trademarks or registered marks of Swarm or its licensor. You may not copy, imitate or use them without Swarm’s prior written consent.</p></div><div class=legal-block><h3>10. Copyright infringement.</h3><p>The Digital Millennium Copyright Act of 1998 (the "DMCA") provides recourse for copyright owners who believe that material appearing on the Internet infringes their rights under U.S. copyright law. If you believe that any materials on our Site infringe your copyright, you may request that they be removed. This request must bear a signature (or electronic equivalent) of the copyright holder or an authorized representative, and must: (a) identify the allegedly infringing materials; (b) indicate where on the Site the infringing materials are located; (c) provide your name and contact information; (d) state that you have a good faith belief that the materials are infringing; (e) state that the information in your claim is accurate; and (f) indicate that "under penalty of perjury" you are the lawful copyright owner or are authorized to act on the owner\'s behalf. If you believe that someone has wrongly filed a notice of copyright infringement against you, the DMCA permits you to send us a counter-notice. Notices and counter-notices must meet the then-current statutory requirements imposed by the DMCA. See <a href="http://www.copyright.gov/">http://www.copyright.gov/</a> for further information. Our contact for copyright issues relating to the Services (including the notices and counter-notices) is:</p><p>EVRGR<br>Attn: Copyright Agent<br>668 High Street<br>Palo Alto, CA 94301<br><a href=mailto:copyright@swarmcorp.com>copyright@swarmcorp.com</a></p><p>Please note that there are penalties for false claims under the DMCA.</p></div><div class=legal-block><h3>11. Modification to terms.</h3><p>These Terms are subject to revision by Swarm. If we deem any of the revisions to be material changes, we will post a notice of the changes on our Site. Any changes will be effective upon the earlier of the date specified in such notice or that posting of notice of changes, provided that the changes will not apply to your use of the Services prior to the effective date of the changes. If you do not accept the changes, you should not continue to use the Services. If any change is found invalid, void or for any reason unenforceable, that change is severable and does not affect the validity and enforceability of any remaining changes or conditions. You should check for any new notices of changes regularly and stay informed of the Terms of Use. Your continued use of the Services after any change, regardless of whether a change was received by you directly, indicates your acceptance and agreement to any such change.</p></div><div class=legal-block><h3>12. Disputes with swarm.</h3><p><b>12.1 Notice.</b> If you believe Swarm committed an error with respect to a Pledge transaction, please contact us at <a href=mailto:support@swarm.com>support@Swarm.com</a>. Please provide us with information sufficient to identify you and any other information about the transaction that you can provide. You must contact us within 30 days after the transaction occurred. We will use our best efforts to either correct the error or explain to you why we believe that transaction was correct within 30 days of receiving your request. Any claim of an error received after 30 days from the date of the alleged error shall be null and void.</p><p><b>12.2 Arbitration.</b> Except for claims for injunctive or equitable relief or claims regarding intellectual property rights (which may be brought in any competent court without the posting of a bond), any dispute arising under this agreement shall be finally settled on an individual basis through confidential, binding arbitration in accordance with the American Arbitration Association\'s rules for arbitration of consumer-related disputes and you and Swarm hereby expressly waive trial by jury. The arbitration shall take place in San Francisco, California, in the English language and the arbitral decision may be enforced in any court. At your request, hearings may be conducted in person or by telephone and the arbitrator may provide for submitting and determining motions on briefs, without oral hearings. The prevailing party in any action or proceeding to enforce this agreement shall be entitled to costs and attorneys\' fees. Additionally, you hereby waive your right to participate in a class action lawsuit or class-wide arbitration. If for any reason a claim proceeds in court rather than in arbitration, the dispute shall be exclusively brought in a court of competent jurisdiction located in the City and County of San Francisco, California.</p></div><div class=legal-block><h3>13. General terms.</h3><p><b>13.1 No Warranty.</b> You understand and acknowledge that the Swarm Services are being provided to you “AS IS” and “AS AVAILABLE” without warranty of any kind. SWARM SPECIFICALLY DISCLAIMS ANY AND ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, OR NONINFRINGEMENT. SWARM DOES NOT GUARANTEE CONTINUOUS, UNINTERRUPTED OR SECURE ACCESS TO ANY PART OF THE SERVICES. BECAUSE PLEDGES MAY INVOLVE BITCOIN OR OTHER TYPES OF BLOCKCHAIN-BASED DIGITAL CURRENCIES, SWARM CANNOT GUARANTEE THAT PLEDGE TRANSACTIONS WILL BE PROCESSED AND CONFIRMED.</p><p><b>13.2 Limitation of Liability.</b> TO THE MAXIMUM EXTENT PERMITTED BY LAW, SWARM SHALL HAVE NO LIABILITY FOR ANY DAMAGES OF ANY KIND (INCLUDING WITHOUT LIMITATION INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR TORT DAMAGES, OR LOS PROFITS) IN CONNECTION WITH THIS AGREEMENT, EVEN IF SWARM HAS BEEN ADVISED OR IS AWARE OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT WILL SWARM’S LIABILITY FOR MONEY DAMAGES UNDER THESE TERMS EXCEED ONE HUNDRED DOLLARS ($100.00).</p><p><b>13.3 Indemnification.</b> You agree to indemnify, defend and hold Swarm, its affiliates and service providers, and each of their respective officers, directors, agents, joint venturers, employees and representatives, harmless from any claim or demand (including attorneys’ fees and costs and any fines, fees or penalties imposed by any regulatory authority) arising out of or related to (i) your breach of these Terms, (ii) your use of Services, or (iii) your violation of any law, rule or regulation, or the rights of any third party.</p><p><b>13.4 Assignment.</b> These Terms, and any rights and licenses granted hereunder, may not be transferred or assigned by you, but may be assigned by Swarm without restriction, including without limitation to any of its affiliates or subsidiaries, or to any successor in interest of any business associated with the Services. Any attempted transfer or assignment in violation hereof shall be null and void. Subject to the foregoing, these Terms will bind and inure to the benefit of the parties, their successors and permitted assigns.</p><p><b>13.5 Severability.</b> If any provision of these Terms shall be determined to be invalid or unenforceable under the rule, law or regulation or any governmental agency, local, state, or federal, such provision will be changed and interpreted to accomplish the objectives of the provision to the greatest extent possible under any applicable law and the validity of enforceability of any other provision of these Terms shall not be affected.</p><p><b>13.6 Entire Agreement.</b> These Terms set forth the entire understanding and agreement between you and Swarm as to the subject matter hereof, and supersedes any and all prior discussions, agreements and understandings of any kind (including without limitation any prior versions of these Terms), and every nature between and among you and Swarm.</p><p><b>13.7 Governing Law.</b> This Agreement shall be governed by the laws of the State of California, without regard to its conflicts of law principles.</p></div></div></div>'), a.put("partials/app/voting-signup.html", '<div class=content><div class=container><form novalidate name=form.signup class="signup-form twelve centered columns" ng-submit=signup()><h2>Please finish Sign Up process.</h2><h3>It will take less than one minute</h3><div class="eight centered columns"><label class="four alpha columns">First name <span class=error ng-show=hasError(form.signup.firstName)>{{form.signup.firstName.errorMessage}}</span> <input name=firstName ng-class="{ invalid: hasError(form.signup.firstName) }" ng-model=signup.firstName ng-required="true"></label><label class="four omega columns">Last name <span class=error ng-show=hasError(form.signup.lastName)>{{form.signup.lastName.errorMessage}}</span> <input name=lastName ng-class="{ invalid: hasError(form.signup.lastName) }" ng-model=signup.lastName ng-required="true"></label><label class="eight alpha columns">Email <span class=error ng-show=hasError(form.signup.email)>{{form.signup.email.errorMessage}}</span> <input type=email name=email ng-class="{ invalid: hasError(form.signup.email) }" ng-model=userEmail disabled></label><label class="four alpha columns"><span class=error ng-show=hasError(form.signup.password)>{{form.signup.password.errorMessage}}</span> New Password <input type=password name=password ng-class="{ invalid: hasError(form.signup.password) }" ng-model=signup.password ng-required="passwordRequired"></label><label class="four omega columns"><span class=error ng-show=hasError(form.signup.passwordConfirm)>{{form.signup.passwordConfirm.errorMessage}}</span> Confirm new password <input type=password name=passwordConfirm ng-class="{ invalid: !passwordsMatch(form.signup.password, form.signup.passwordConfirm) }" ng-model=signup.passwordConfirm ng-required="passwordRequired"></label><label class="field-input eight alpha columns">Wallet <input name=wallet ng-model=userWallet.public disabled> <span class=wallet-link ng-if=!walletDownloaded>Please <a href ng-click=downloadWallet()>download</a> your paper wallet before you can proceed!</span></label><div ng-if=walletDownloaded><input type=submit value="Sign up" class="button green simple"><p class=terms>By signing up, I agree to Swarm\'s <a href=/terms target=_blank>Terms of Service</a> and <a href=/privacy-policy target=_blank>Privacy Policy</a>.</p></div></div></form></div></div>'), a.put("partials/bootstrap/datepicker/datepicker.html", "<div ng-switch=datepickerMode role=application ng-keydown=keydown($event)><daypicker ng-switch-when=day tabindex=0></daypicker><monthpicker ng-switch-when=month tabindex=0></monthpicker><yearpicker ng-switch-when=year tabindex=0></yearpicker></div>"), a.put("partials/bootstrap/datepicker/day.html", '<table aria-labelledby={{uniqueId}}-title aria-activedescendant={{activeDateId}}><thead><tr class=row-month><th><button type=button ng-click=move(-1) tabindex=-1><i class="icon icon-angle-left"></i></button></th><th colspan="{{5 + showWeeks}}"><button id={{uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button ng-click=toggleMode() tabindex=-1>{{title}}</button></th><th><button type=button ng-click=move(1) tabindex=-1><i class="icon icon-angle-right"></i></button></th></tr><tr class=row-week><th ng-show=showWeeks></th><th ng-repeat="label in labels track by $index">{{label.abbr}}</th></tr></thead><tbody><tr ng-repeat="row in rows track by $index"><td ng-show=showWeeks>{{ weekNumbers[$index] }}</td><td ng-repeat="dt in row track by dt.date" role=gridcell id={{dt.uid}} aria-disabled={{!!dt.disabled}}><button type=button ng-class="{active: isActive(dt), disabled: dt.disabled}" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{dt.label}}</button></td></tr></tbody></table>'), a.put("partials/bootstrap/datepicker/month.html", '<table role=grid aria-labelledby={{uniqueId}}-title aria-activedescendant={{activeDateId}}><thead><tr><th><button type=button ng-click=move(-1) tabindex=-1><i class="icon icon-angle-left"></i></button></th><th><button id={{uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button ng-click=toggleMode() tabindex=-1>{{title}}</button></th><th><button type=button class=pull-right ng-click=move(1) tabindex=-1><i class="icon icon-angle-right"></i></button></th></tr></thead><tbody><tr class=row-months ng-repeat="row in rows track by $index"><td ng-repeat="dt in row track by dt.date" class=text-center role=gridcell id={{dt.uid}} aria-disabled={{!!dt.disabled}}><button type=button ng-class="{active: isActive(dt), disabled: dt.disabled}" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{dt.label}}</button></td></tr></tbody></table>'), a.put("partials/bootstrap/datepicker/popup.html", "<div class=datepicker ng-style=\"{display: (isOpen && 'block') || 'none'}\" ng-keydown=keydown($event)><div class=datepicker-table ng-transclude></div></div>"), a.put("partials/bootstrap/datepicker/year.html", '<table role=grid aria-labelledby={{uniqueId}}-title aria-activedescendant={{activeDateId}}><thead><tr><th><button type=button ng-click=move(-1) tabindex=-1><i class="icon icon-angle-left"></i></button></th><th colspan=3><button id={{uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button ng-click=toggleMode() tabindex=-1>{{title}}</button></th><th><button type=button ng-click=move(1) tabindex=-1><i class="icon icon-angle-left"></i></button></th></tr></thead><tbody><tr ng-repeat="row in rows track by $index"><td ng-repeat="dt in row track by dt.date" class=text-center role=gridcell id={{dt.uid}} aria-disabled={{!!dt.disabled}}><button type=button ng-class="{active: isActive(dt), disabled: dt.disabled}" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{dt.label}}</button></td></tr></tbody></table>'), a.put("partials/bootstrap/modal/backdrop.html", '<div da-modal-backdrop class="modal backdrop" ng-style="{\'z-index\': index+10}" ng-click=fade($event);></div>'), a.put("partials/bootstrap/modal/window.html", '<div da-modal class="modal window" ng-style="{\'z-index\': index+ 11}"><a href class="modal-close icon icon-close" ng-click=fade($event);></a><div ng-transclude></div></div>'), a.put("partials/bootstrap/timepicker/timepicker.html", "<table class=timepicker><tbody><tr><td style=width:50px ng-class=\"{'has-error': invalidHours}\"><input ng-model=hours ng-change=updateHours() ng-mousewheel=incrementHours() ng-readonly=readonlyInput maxlength=2></td><td>:</td><td style=width:50px ng-class=\"{'has-error': invalidMinutes}\"><input ng-model=minutes ng-change=updateMinutes() ng-readonly=readonlyInput maxlength=2></td><td>&nbsp;</td><td ng-show=showMeridian><button class=blue type=button ng-click=toggleMeridian()>{{meridian}}</button></td></tr></tbody></table>")
    }]), angular.module("ui.bootstrap.tpls", []).run(["$templateCache", function(a) {
        "use strict";
        a.put("template/datepicker/datepicker.html", "<div ng-switch=datepickerMode role=application ng-keydown=keydown($event)>\n  <daypicker ng-switch-when=day tabindex=0></daypicker>\n  <monthpicker ng-switch-when=month tabindex=0></monthpicker>\n  <yearpicker ng-switch-when=year tabindex=0></yearpicker>\n</div>"), a.put("template/datepicker/day.html", '<table aria-labelledby={{uniqueId}}-title aria-activedescendant={{activeDateId}}>\n  <thead>\n    <tr class=row-month>\n      <th><button type=button ng-click=move(-1) tabindex=-1><i class="icon icon-angle-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id={{uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button ng-click=toggleMode() tabindex=-1>{{title}}</button></th>\n      <th><button type=button ng-click=move(1) tabindex=-1><i class="icon icon-angle-right"></i></button></th>\n    </tr>\n    <tr class=row-week>\n      <th ng-show=showWeeks></th>\n      <th ng-repeat="label in labels track by $index">{{label.abbr}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show=showWeeks>{{ weekNumbers[$index] }}</td>\n      <td ng-repeat="dt in row track by dt.date" role=gridcell id={{dt.uid}} aria-disabled={{!!dt.disabled}}>\n        <button type=button ng-class="{active: isActive(dt), disabled: dt.disabled}" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{dt.label}}</button>\n      </td>\n    </tr>\n  </tbody>\n</table>'), a.put("template/datepicker/month.html", '<table role=grid aria-labelledby={{uniqueId}}-title aria-activedescendant={{activeDateId}}>\n  <thead>\n    <tr>\n      <th><button type=button ng-click=move(-1) tabindex=-1><i class="icon icon-angle-left"></i></button></th>\n      <th><button id={{uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button ng-click=toggleMode() tabindex=-1>{{title}}</button></th>\n      <th><button type=button class=pull-right ng-click=move(1) tabindex=-1><i class="icon icon-angle-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class=row-months ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class=text-center role=gridcell id={{dt.uid}} aria-disabled={{!!dt.disabled}}>\n        <button type=button ng-class="{active: isActive(dt), disabled: dt.disabled}" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{dt.label}}</button>\n      </td>\n    </tr>\n  </tbody>\n</table>'), a.put("template/datepicker/popup.html", "<div class=datepicker ng-style=\"{display: (isOpen && 'block') || 'none'}\" ng-keydown=keydown($event)>\n	<div class=datepicker-table ng-transclude></div>\n</div>"), a.put("template/datepicker/year.html", '<table role=grid aria-labelledby={{uniqueId}}-title aria-activedescendant={{activeDateId}}>\n  <thead>\n    <tr>\n      <th><button type=button ng-click=move(-1) tabindex=-1><i class="icon icon-angle-left"></i></button></th>\n      <th colspan=3><button id={{uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button ng-click=toggleMode() tabindex=-1>{{title}}</button></th>\n      <th><button type=button ng-click=move(1) tabindex=-1><i class="icon icon-angle-left"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class=text-center role=gridcell id={{dt.uid}} aria-disabled={{!!dt.disabled}}>\n        <button type=button ng-class="{active: isActive(dt), disabled: dt.disabled}" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{dt.label}}</button>\n      </td>\n    </tr>\n  </tbody>\n</table>'), a.put("template/modal/backdrop.html", '<div da-modal-backdrop class="modal backdrop" ng-style="{\'z-index\': index+10}" ng-click=fade($event);></div>'), a.put("template/modal/window.html", '<div da-modal class="modal window" ng-style="{\'z-index\': index+ 11}">\n	<a href class="modal-close icon icon-close" ng-click=fade($event);></a>\n	<div ng-transclude></div>\n</div>'), a.put("template/timepicker/timepicker.html", "<table class=timepicker>\n	<tbody>\n		<tr>\n			<td style=width:50px ng-class=\"{'has-error': invalidHours}\">\n				<input ng-model=hours ng-change=updateHours() ng-mousewheel=incrementHours() ng-readonly=readonlyInput maxlength=2>\n			</td>\n			<td>:</td>\n			<td style=width:50px ng-class=\"{'has-error': invalidMinutes}\">\n				<input ng-model=minutes ng-change=updateMinutes() ng-readonly=readonlyInput maxlength=2>\n			</td>\n			<td>&nbsp;</td>\n			<td ng-show=showMeridian><button class=blue type=button ng-click=toggleMeridian()>{{meridian}}</button></td>\n		</tr>\n	</tbody>\n</table>")
    }]);