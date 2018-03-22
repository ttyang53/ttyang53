/**
 * Created by Administrator on 2018/1/8.
 */
(function(){

    angular.module('app.controllers',['app.services'])
        .directive('ttyNavs',function(){
            return{
                restrict:'EA',
                replace:true,
                templateUrl:'directives/main.html'
            }
        })

        .directive('ttyDialog' , function(){
        return {
            restrict:'EA',
            replace:true,
            templateUrl:'directives/dialog.html',
            scope:{
                title:'@',
                content:'@',
                state:'='
            },
            controller:function($scope , $timeout){

                $scope.$watch('state' , function(){
                    if($scope.state){
                        $timeout(function(){
                            console.log($scope.state);
                            $scope.state = false;
                            console.log($scope.state);
                        } , 3000);
                    }
                });

                $scope.btnClose_onclick = function(){
                    $scope.state = false;
                }
            }

        };
    })

        //首页
        .controller('homeController',function($scope,$interval,bookInfoService,lbImgService,bookLanmuService){
            $scope.list=[]
            //首页
            bookInfoService.getNewBookList().then(function(response){
                //console.log(response);
                if(response.data.Code==100){
                    $scope.list=response.data.Data;
                    //console.log($scope.list)
                }
            })
            //轮播图
            $scope.carousel=[]
            lbImgService.getlbImg().then(function(response){
                if(response.data.Code==100){
                    $scope.carousel=response.data.Data;
                    //console.log($scope.carousel)
                    $scope.$watch($scope.carousel,function(){
                        var imgs=document.querySelectorAll('.lbCarouselDiv>div');
                        var buoy=document.querySelectorAll('.buoyDiv>div')
                        var index=0;
                        if($scope.carousel){
                            $interval(function () {
                                angular.element(document).ready(function(){
                                    imgs[index].className='left-out';
                                    //buoy[index].className='buoyActivied';
                                    index++;
                                    if(index>=imgs.length){
                                        index=0;
                                    }
                                    imgs[index].className='right-in';
                                })

                            },5000)
                        }
                    })


                }
            })

            //图书栏目
            $scope.bookLanmuList=[]
            $scope.booksList=[]
            $scope.booksList2=[]
            bookLanmuService.getBooklanmu().then(function(response){
                if(response.data.Code==100){
                    $scope.bookLanmuList=response.data.Data;
                    $scope.booksList=$scope.bookLanmuList[0].Books
                    $scope.booksList2=$scope.bookLanmuList[1].Books
                }
            })


        })

        //查询搜索页
        .controller('searchController',function($scope,$window,$location){
            $scope.keyword = '';
            $scope.keywordArray = [];

            if($window.localStorage.getItem('History')){
                $scope.keywordArray = JSON.parse($window.localStorage.getItem('History'));
            }
            $scope.search = function(){
                // 保存查询记录
                $scope.keywordArray.push($scope.keyword);
                $window.localStorage.setItem('History' , JSON.stringify($scope.keywordArray));

                $location.url('/bookList?keyword=' + $scope.keyword);
                console.log($scope.keyword)

            }
            $scope.clear = function(){
                $scope.keywordArray = [];
                $window.localStorage.removeItem('History');
            }

        })

        //图书页
        .controller('bookListController',function($scope,bookListService,$routeParams){
            if($routeParams.sectionId){
                //根据栏目查询图书信息
                bookListService.getBookList($routeParams.sectionId).then(function(response){
                    console.log(response)
                    if(response.data.Code==100){
                        $scope.bookInfoList=response.data.Data;
                    }
                })
            }
            else{
                var categoryId = $routeParams.categoryId || '';
                var keyword = $routeParams.keyword || '';
                var parameter = {
                    categoryId : categoryId,
                    keyword:keyword
                };
                //console.log(parameter.keyword)
                bookListService.getBookClassQuery(parameter).then(function(response){
                    if(response.data.Code==100){
                        $scope.bookInfoList=response.data.Data;
                        console.log($scope.bookInfoList)

                        if($scope.bookInfoList.length==0){
                            $scope.kongbai=true

                        }else{

                        }

                    }
                })


            }


        })

        //详情页
        .controller('detailsController',function($scope,$rootScope,detailsService,$routeParams,$window,$location){
            //console.log($routeParams)
            $scope.detailsList=[]
            detailsService.getDetails($routeParams.id).then(function(response){
                if(response.data.Code==100){
                    $scope.detailsList=response.data.Data;
                    //console.log($scope.detailsList)
                }
            })

            $rootScope.currentUserData=JSON.parse($window.localStorage.getItem('userData'))
            //点击加入借书架
            $scope.addBookRack=function(){
                if($scope.currentUserData){
                    detailsService.getBookRack($scope.currentUserData.Id,$scope.detailsList.Book.Id)
                        .then(function(response){
                            console.log(response)
                            if(response.data.Code==100){
                                $scope.state = true;
                            }
                        })

                }else{
                    $location.url('/login')
                }
            }
            //点击借书架，判断是否登录
            $scope.btnBookRack=function(){
                if($scope.currentUserData){
                    $location.url('/bookRack')
                }else{
                    $location.url('/login')
                }
            }



        })

        //分类页
        .controller('classController',function($scope,bookClassService){
            $scope.bookClassList=[]
            bookClassService.getBookClass().then(function(response){
                if(response.data.Code==100){
                    $scope.bookClassList=response.data.Data;
                    //console.log($scope.bookClassList)
                }
            })

        })

        //登录页
        .controller('loginController',function($scope,$http,$window,$location){
            $scope.account={
                userPhone:'',
                userPassword:'',
            }
            $scope.btnLogin=function(){
                $http({
                    method:'post',
                    url:'http://192.168.12.100/librarywebapi/member/login',
                    params:{
                        phone:$scope.account.userPhone,
                        password:$scope.account.userPassword
                    }

                }).then(function(response){
                    console.log(response)
                    if(response.data.Code==100){
                        //把用户数据存储在本地中

                        $window.localStorage.setItem('userData',JSON.stringify(response.data.Data))
                        $window.history.back()
                    }
                    else{
                        $scope.state = true;
                    }
                })

            }
        })

        //发现  （未完成）
        .controller('findController',function($scope){

        })

        //我的
        .controller('mineController',function($scope,$window,$location){
            $scope.isLogin=false;
            $scope.img=true;
            $scope.header={};
            $scope.currentUserData=JSON.parse($window.localStorage.getItem('userData'))
            if($window.localStorage.getItem('userData')){
                $scope.header=JSON.parse($window.localStorage.getItem('userData'))
                $scope.isLogin=true;
                //console.log($scope.header)
            }



            $scope.loginGo=function(){
                if($scope.currentUserData){
                    $location.url('/loginOut')
                }else{
                    $location.url('/login')
                }
            }

            //单击我的借书架跳转
            $scope.mineMyBookRack=function(){
                if($scope.currentUserData){
                    $location.url('/bookRack')
                }else{
                    $location.url('/login')
                }
            }

            //单击我的借阅跳转
            $scope.minMyBookOrder=function(){
                if($scope.currentUserData){
                    $location.url('/bookOrder')
                }else{
                    $location.url('/login')
                }
            }
        })

        //获取验证码
        .controller('resetController',function($scope,$http,$rootScope,$window,resetService,submitNextService,$location){

            $scope.yanzhengma=function(){
                console.log($scope.account.textPhone)
                    resetService.getReset($scope.account.textPhone)
                        .then(function(response){
                            console.log(response)
                            if(response.status == 200 && response.data.Code == 100){
                                alert('获取验证码成功')
                                //定义全局变量
                                $rootScope.currentuserId=response.data
                            }
                        })
            }

            //提交账号，验证码
            $scope.nextStep=function(){
                submitNextService.postReset($scope.account.textPhone,$scope.account.textReset,$window)
                    .then(function(response){
                        console.log(response)
                        if(response.status == 200 && response.data.Code == 100){
                            $location.url('/submit');
                            $scope.userId=response.data.Data
                            $window.sessionStorage.setItem('userId',JSON.stringify($scope.userId))
                        }
                    });
            }
        })

        //提交修改密码
        .controller('submitController',function($scope,submitService,$window,$location){
            //引用全局变量
            //console.log($rootScope.currentuserId)
            $scope.btnSubmit=function(){
                $scope.UserId=JSON.parse($window.sessionStorage.getItem('userId'))
                submitService.postSubmit($scope.UserId.Id,$scope.newPassword)
                    .then(function(response){
                        console.log(response)
                        if(response.status == 200 && response.data.Code == 100){
                            $location.url('/login')
                        }
                    })
            }
        })

        //借书架页面  （总计未完成）
        .controller('bookRackController',function($scope,bookRackService,$window,$location){
            //读者标示
            $scope.currentUserData=JSON.parse($window.localStorage.getItem('userData'))
            //获取借书架图书
            $scope.myBookRack=[]
            bookRackService.getMyBookRack($scope.currentUserData.Id)
                .then(function(response){
                    //console.log(response)
                    if(response.data.Code==100){
                        $scope.myBookRack=response.data.Data
                        console.log($scope.myBookRack)
                    }
                })

            //提交订单
            $scope.submitOrder=function(){
                bookRackService.postSubmitOrder($scope.currentUserData.Id)
                    .then(function(response){
                        console.log(response)
                        if(response.data.Code==100){
                        $scope.state=true
                        }
                    })
            }

            //点击删除，删除当前书架的图书
            $scope.deleteBookRack=function(item){
                bookRackService.getDeleteMyBookRack($scope.currentUserData.Id,item)
                    .then(function(response){
                        console.log(response)
                        if(response.data.Code==100){
                            $scope.myBookRack=[]
                            bookRackService.getMyBookRack($scope.currentUserData.Id)
                                .then(function(response){
                                    //console.log(response)
                                    if(response.data.Code==100){
                                        $scope.myBookRack=response.data.Data
                                        //console.log($scope.myBookRack)
                                    }
                                })
                        }
                    })
            }

            $scope.bookRackUrl=function(item,$event){
                $event.stopPropagation()
                console.log(item)
                $location.url('/details?id='+item)
            }


        })

        //我的订单页面
        .controller('bookOrderController',function($scope,bookOrderService,$window){
            $scope.allOrder=function(){
                $scope.show=false
                $scope.show2=false
                $scope.show3=false
                $scope.show4=false
            }
            $scope.daishouhuo=function(){
                $scope.show2=true
                $scope.show=true
                $scope.show3=false
                $scope.show4=false
            }
            $scope.yishouhuo=function(){
                $scope.show3=true
                $scope.show=true
                $scope.show2=false
                $scope.show4=false
            }
            $scope.orderHistory=function(){
                $scope.show4=true
                $scope.show=true
                $scope.show2=false
                $scope.show3=false
            }


            //查询所有借阅记录
            $scope.currentUserData=JSON.parse($window.localStorage.getItem('userData'))

            $scope.allOrderData=[]
            bookOrderService.getHistory($scope.currentUserData.Id)
                .then(function(response){
                    $scope.allOrderData=response.data.Data
                    //console.log($scope.allOrderData)

                    $scope.allBookOrder=[]
                    $scope.daishouhuoBookOrder=[]
                    $scope.yishouhuoBookOrder=[]
                    $scope.BookHistoryOrder=[]

                    for(var i=0;i<$scope.allOrderData.length;i++){
                       if($scope.allOrderData[i].State==4 || $scope.allOrderData[i].State==0){
                           $scope.BookHistoryOrder.push($scope.allOrderData[i])
                       }
                        if($scope.allOrderData[i].State==1 || $scope.allOrderData[i].State==2){
                            $scope.daishouhuoBookOrder.push($scope.allOrderData[i])
                        }
                        if($scope.allOrderData[i].State==3){
                            $scope.yishouhuoBookOrder.push($scope.allOrderData[i])
                        }
                    }


                })

            $scope.state = false;
            $scope.getzhuangtai=function(State){
                if(State==0){
                    return'已取消'
                }
                if(State==1){
                    return'待配送'
                }
                if(State==2){
                    return'配送中'
                }
                if(State==3){
                    return'已收货'
                }
                if(State==4){
                    return'已归还'
                }
            }
            $scope.getzhuangtai2=function(State){
                if(State==0){
                    return'已取消'
                }
                if(State==1){
                    $scope.aa=true
                    $scope.confirmRreceipt=function(){
                        $scope.state2 = true;
                    }
                    //取消订单postCancelOrder
                    $scope.btncancelOrder=function(itemId){
                        bookOrderService.postCancelOrder(itemId,$scope.currentUserData.Id)
                            .then(function(response){
                                console.log(response)
                                if(response.data.Code==100){
                                    $scope.state3 = true;
                                    $scope.getzhuangtai=function(State){
                                    }
                                }
                            })
                    }

                    return'确认收货'
                }
                if(State==2){
                    $scope.aa=true
                    $scope.confirmRreceipt=function(itemId){
                        bookOrderService.postconfirmRreceipt(itemId,$scope.currentUserData.Id)
                            .then(function(response){
                                console.log(response)
                                if(response.data.Code==100){
                                    $scope.state = true;
                                }
                            })
                    }
                    return'确认收货'
                }
                if(State==3){
                    $scope.aa=false
                    return'已收货'
                }
                if(State==4){
                    $scope.aa=false
                    return'已归还'
                }
            }

            var orderNav=document.querySelectorAll('.order-top a')


        })

        //注销
        .controller('loginOutController',function($scope,$location,$window){
            $scope.logout = function(){
                $window.localStorage.removeItem('userData');
                $scope.img=false
                $scope.isLogin = false;
                $location.url('/mine');
            }
        })










})()