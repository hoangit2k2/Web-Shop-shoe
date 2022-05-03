
const app = angular.module('appModule', ["ngRoute"]);

app.controller('appController', function ($scope, $rootScope) {   
    $rootScope.cart = localStorage.getItem('cart') || [];

    

});

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./index.html"
        })
        // .when("/products", {
        //     templateUrl: "./components/products/products.html"
        // })
        .when("/:productId", {
            templateUrl: "./product-detail.html"
        })
        // .when("/products/new", {
        //     templateUrl: "./components/products/product_form.html"
        // })
        // .when("/login", {
        //     templateUrl: "./components/login/login.html"
        // })
        // .when("/register", {
        //     templateUrl: "./components/register/register.html"
        // })
        .when("/cart/cart", {
            templateUrl: "./shoping-cart.html"
        })
        .when("/blog/blog", {
            templateUrl: "./blog.html"
        })
        .when("/contact/contact", {
            templateUrl: "./contact.html"
        })
        .when("/about/about", {
            templateUrl: "./about.html"
        })
        // .otherwise({
        //     templateUrl: "./components/error/404.html"
        // });
});
