/**
 * Created by Administrator on 2018/1/8.
 */
(function(){


    var app=angular.module('app',['ngRoute','app.controllers'])

    app.config(function($routeProvider , $locationProvider){
    //    去除 ！方法
        $locationProvider.hashPrefix('');

        $routeProvider
            .when('/home',{
                templateUrl:'templates/home.html',
                controller:'homeController'
            })
            .when('/class',{
                templateUrl:'templates/class.html',
                controller:'classController'
            })
            .when('/find',{
                templateUrl:'templates/find.html',
                controller:'findController'
            })
            .when('/mine',{
                templateUrl:'templates/mine.html',
                controller:'mineController'
            })
            //图书页
            .when('/bookList',{
                templateUrl:'templates/bookList.html',
                controller:'bookListController'
            })
            //详情页
            .when('/details',{
                templateUrl:'templates/details.html',
                controller:'detailsController'
            })
            //登录页
            .when('/login',{
                templateUrl:'templates/login.html',
                controller:'loginController'
            })
            //重置密码页1
            .when('/resetPassword',{
                templateUrl:'templates/resetPassword.html',
                controller:'resetController'
            })
            //提交密码重置2
            .when('/submit',{
                templateUrl:'templates/submit.html',
                controller:'submitController'
            })
            //查询搜索页
            .when('/search',{
                templateUrl:'templates/search.html',
                controller:'searchController'
            })
            //书架页
            .when('/bookRack',{
                templateUrl:'templates/bookRack.html',
                controller:'bookRackController'
            })
            //我的订单
            .when('/bookOrder',{
                templateUrl:'templates/bookOrder.html',
                controller:'bookOrderController'
            })
            .when('/loginOut',{
                templateUrl:'templates/loginOut.html',
                controller:'loginOutController'
            })

            .otherwise({
                redirectTo:'/home'
            })




    })

})()