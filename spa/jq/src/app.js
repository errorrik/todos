define(function () {
    var defaultPath = '/';
    var ActionContainer = [];
    var currentActionContext;
    var currentPath;

    /**
     * 获取URL中的hash值
     *
     * @return {string} 当前URL中的hash值
     * @ignore
     */
    function getLocation() {
        // Firefox下`location.hash`存在自动解码的情况，
        // 比如hash的值是**abc%3def**，
        // 在Firefox下获取会成为**abc=def**
        // 为了避免这一情况，需要从`location.href`中分解
        var index = location.href.indexOf('#');
        var url = index === -1 ? '' : location.href.slice(index + 1);

        return url;
    }

    /**
     * 执行hash变更的相关逻辑
     * @ignore
     */
    function forwardHash() {
        var beforePath = currentPath || defaultPath;
        if (currentActionContext) {
            currentActionContext.dispose && currentActionContext.dispose();
            currentActionContext = null;
        }

        var url = getLocation();
        currentPath = url;
        for (var i = 0; i < ActionContainer.length; i++) {
            var item = ActionContainer[i];
            var rule = item.rule;
            var isMatch = false;
            var params = [];
            if (typeof rule === 'string') {
                isMatch = (rule === url);
            }
            else if (rule instanceof RegExp) {
                params = rule.exec(url);
                isMatch = !!params;
            }

            if (isMatch) {
                currentActionContext = new item.Action({
                    url: url,
                    params: params,
                    referrer: beforePath
                });
                break;
            }
        }
    }

    return {
        route: function (rule, Action) {
            ActionContainer.push({rule: rule, Action: Action});
        },

        start: function () {
            window.addEventListener('hashchange', forwardHash, false);
            if (!getLocation()) {
                location.hash = '#' + defaultPath;
            }
            else {
                forwardHash();
            }
        }
    };
});
