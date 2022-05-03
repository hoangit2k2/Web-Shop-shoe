

app.controller('productController', function ($scope, $rootScope,
    $routeParams, $http) {
    $scope.products = [];
    $rootScope.cart = JSON.parse(localStorage.getItem('cart')) || [];
    $scope.keyword = '';

    $scope.currentPage = 1;
    $scope.totalPerPage = 10;

    $scope.next = () => {
        if ($scope.currentPage < ($scope.products.length / $scope.totalPerPage)) {
            $scope.currentPage++;
        }
    }

    $scope.previous = () => {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
    }

    $scope.getProductsForPage = () => {
        return $scope.products.slice(
            ($scope.currentPage - 1) * $scope.totalPerPage, 
            $scope.totalPerPage * $scope.currentPage);
    }

    /**
     * pagination: client <---- hạn chế
     * server: skip take <------ hạn chế
     * database: <---- nhanh nhất
     */

    // dùng http service
    $http.get('https://623ede7adf20a75d53cc494b.mockapi.io/products')
    .then(function (response) {
        $scope.products = response.data;
    });
    

    $scope.deleteProduct = function (id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    $http({
                        url: `https://623ede7adf20a75d53cc494b.mockapi.io/products/${id}`,
                        method: "DELETE",
                    })
                        .then(function (response) {
                            // chuyen sang man hinh danh sach                
                            $scope.products = $scope.products.filter(item => item.id != id);
                        },
                            function (response) {
                            });
                } else {
                    swal("Your imaginary file is safe!");
                }
            });
    }
    
    $scope.addToCart = (product, quantity = 1) => {
        const item = $rootScope.cart.filter(item => item.product.id == product.id)[0];
        if (item) {
            $rootScope.cart = $rootScope.cart.map(item => {
                if (item.product.id == product.id) {
                    item.quantity += quantity
                }
                return item;
            })
        } else {
            $rootScope.cart = [...$rootScope.cart, { product, quantity, checked: false }]
        }
        localStorage.setItem('cart', JSON.stringify($rootScope.cart));
    }
});

app.filter('formatVND', function () {
    return function (value) {
        // tự viết
        return new Intl.NumberFormat().format(value) + ' VNĐ'
    }
})


app.controller('productFormController', function ($scope, $rootScope, $location,
    $routeParams, $http) {
    $scope.productId = $routeParams.productId;
    $scope.product = {
        name: '', price: 0, quantity: 0, description: ''
    };
    if ($scope.productId) {
        $http.get(`https://623ede7adf20a75d53cc494b.mockapi.io/products/${$scope.productId}`)
            .then(function (response) {
                $scope.product = response.data;
            });
    }
    $scope.addToCart = (product, quantity = 1) => {
        const item = $rootScope.cart.filter(item => item.product.id == product.id)[0];
        if (item) {
            $rootScope.cart = $rootScope.cart.map(item => {
                if (item.product.id == product.id) {
                    item.quantity += quantity
                }
                return item;
            })
        } else {
            $rootScope.cart = [...$rootScope.cart, { product, quantity, checked: false }]
        }
        localStorage.setItem('cart', JSON.stringify($rootScope.cart));
    }
    $scope.submitForm = function () {
          

        const { id, name, price, quantity, description } = $scope.product;
        const image = document.getElementById('image-url').value;
        if ($scope.productId) {
            $http({
                url: `https://623ede7adf20a75d53cc494b.mockapi.io/products/${id}`,
                method: "PUT",
                data: { name, price, quantity, description, image }
            })
                .then(function (response) {
                    // chuyen sang man hinh danh sach
                    window.location.href = '/index.html#!/';

                },
                    function (response) {
                    });
        } else {
            $http({
                url: `https://623ede7adf20a75d53cc494b.mockapi.io/products`,
                method: "POST",
                data: { name, price, quantity, description, image }
            })
                .then(function (response) {
                    // chuyen sang man hinh danh sach
                    window.location.href = '/index.html#!/';

                },
                    function (response) {
                    });
        }

    }
});
// $location

const onChangeFile = function (event) {
    var output = document.getElementById('image-view');
    output.src = URL.createObjectURL(event.target.files[0]);

    uploadToFirebase();
};

const firebaseConfig = {
    apiKey: "AIzaSyB0GIULYZqhrZggsj76yZtspH1O56VAZVg",
    authDomain: "my21may21project.firebaseapp.com",
    projectId: "my21may21project",
    storageBucket: "my21may21project.appspot.com",
    messagingSenderId: "550765995121",
    appId: "1:550765995121:web:8fe5316f35c29ceebae7d0",
    measurementId: "G-366L3N7HH0"
};
firebase.initializeApp(firebaseConfig);

const uploadToFirebase = () => {
    const file = document.getElementById('image').files[0];
    // upload
    const ref = firebase.storage().ref(uuid());
    const uploadTask = ref.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => { },
        (error) => { console.log('firebase error: ', error) },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                document.getElementById('image-view').src = url;
                document.getElementById('image-url').value = url;
            })
        }
    );
}

const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

