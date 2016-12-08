const util = {
    isFunction(fn) {
        return typeof fn === 'function';
    },
    isArray(arr) {
        return arr instanceof Array;
    },
    /**
    * invoke function only if exist and function
    * created to avoid using if statements 
    */
    invoke(object, fnName, data) {
        if (!object || !fnName) {
            return;
        }

        var fn = object[fnName];  

        if (this.isFunction(fn)) {
            data = data && this.isArray(data) ? data : [data];
            return fn.apply(object, data);
        }
    }
};

export default util;