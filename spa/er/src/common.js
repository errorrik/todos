define(function () {
    var SERVICE_HOST = 'http://localhost:8222';
    return {
        getServiceUrl: function (relateUrl) {
            return SERVICE_HOST + relateUrl;
        }
    };
});
