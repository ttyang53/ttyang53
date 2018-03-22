/**
 * Created by Administrator on 2018/1/8.
 */
(function(){
   angular.module('app.services',[])
       .constant('ROOT_URL','http://101.200.58.3/librarywebapi/')

       .service('bookInfoService',function($http,ROOT_URL){
           this.getNewBookList=function(){
               return $http.get(ROOT_URL + 'book/list');
           }
       })

       .service('lbImgService',function($http,ROOT_URL){
          this.getlbImg=function(){
            return $http.get(ROOT_URL + 'advert/list')
          }
       })

       .service('bookLanmuService',function($http,ROOT_URL){
          this.getBooklanmu=function(){
             return $http.get(ROOT_URL + 'section/list')
          }
       })

       //图书类别
       .service('bookClassService',function($http,ROOT_URL){
          this.getBookClass=function(){
             return $http.get(ROOT_URL + 'category/list')
         }
       })

       //根据栏目ID查询对应的图书信息
       .service('bookListService',function($http,ROOT_URL){
           //根据栏目查询图书信息
           this.getBookList=function(sectionId){
               return $http.get(ROOT_URL + 'book/GetBooksBySection',{params:{sectionId:sectionId}})
           }
        //根据类别（根据图书类别id，查询图书页）
           this.getBookClassQuery=function(parameter){
               return $http.get(ROOT_URL + 'book/list',{params:parameter})
           }
       })

        //详情
       .service('detailsService',function($http,ROOT_URL){
           this.getDetails=function(detailsId){
               return $http.get(ROOT_URL + 'book/single',{params:{id:detailsId}})
           }

           this.getBookRack=function(readerId,bookId){
               return $http.get(ROOT_URL + 'Transaction/AddBookShelf',{params:{readerId:readerId,bookId:bookId}})
           }



       })

    //---------------------------------------------------------------
         // 获取验证码
       .service('resetService',function($scope,$http,ROOT_URL){
           $scope.account={
               textPhone:'',
               textReset:'',
           }
           this.getReset=function(phone){
               return $http.get(ROOT_URL + 'member/SendCodeForReset',{params:{phone:phone}})
           }
       })

        //提交账号和验证码
       .service('submitNextService',function($http,ROOT_URL){
           this.postReset = function(phone , code){
               return $http({
                   method:'post',
                   url: ROOT_URL + 'member/VerifyCodeForReset',
                   params:{
                       phone:phone,
                       code:code
                   }
               });
           }
       })

        //提交重置密码
       .service('submitService',function($http,ROOT_URL){
           this.postSubmit=function(id,password){
               return $http({
                   method:'post',
                   url:ROOT_URL + 'member/reset',
                   params:{
                       id:id,
                       password:password
                   }
               })
           }
       })

       //我的借书架 （提交订单）
       .service('bookRackService',function($http,ROOT_URL){
           //我的借书架内容
           this.getMyBookRack=function(readerId){
               return $http.get(ROOT_URL + 'Transaction/GetMyShelf',{params:{readerId:readerId}})
           }

            //删除借书架内容（单个）
           this.getDeleteMyBookRack=function(readerId,bookId){
               return $http.get(ROOT_URL + 'Transaction/RemoveBookFromShelf',{params:{readerId:readerId,bookId:bookId}})
           }

           //单击提交订单，实现借阅
           this.postSubmitOrder=function(readerId){
               return $http({
                   method:'post',
                   url:ROOT_URL + 'Transaction/SubmitOrder',
                   params:{
                       readerId:readerId
                   }
               })
               //return $http.post(ROOT_URL + 'Transaction/SubmitOrder',{params:{readerId:readerId}})
           }



       })

        //我的订单
       .service('bookOrderService',function($http,ROOT_URL){
            //查询所有借阅记录
           this.getHistory=function(readerId){
               return $http.get(ROOT_URL + 'Transaction/GetBorrowRecords',{params:{readerId:readerId}})
           }

           //确认收货
           this.postconfirmRreceipt=function(orderId,readerId){
               return $http({
                   method:'post',
                   url:ROOT_URL + 'Transaction/ConfirmOrder',
                   params:{
                       orderId:orderId,
                       readerId:readerId
                   }
               })
           }

           //取消订单
           this.postCancelOrder=function(orderId,readerId){
               return $http({
                   method:'post',
                   url:ROOT_URL + 'Transaction/CancelOrder',
                   params:{
                       orderId:orderId,
                       readerId:readerId
                   }
               })
           }

       })
























})()