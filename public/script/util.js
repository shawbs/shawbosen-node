

/**
 * 过滤数组中指定key的项
 * 
 * @param {array} Arr 说明：数组只能是一级数组和一级对象数组
 * @param {string/array} key 
 * @return array
 */
const ArrFilter = function(Arr,key){
    let result = [];
    for(let item of Arr){
        if(Object.prototype.toString.call(item) == "[object Object]"){
            let o = {};
            for(let k in item){
                if(Array.isArray(key)){
                    if(key.indexOf(k) == -1) o[k] = item[k];
                }else{
                    if(k != key) o[k] = item[k];
                }

            }
            result.push(o);
        }else{
            if(Array.isArray(key)){
                if(key.indexOf(item) == -1) result.push(item);
            }else{
                if(item != key) result.push(item);
            }
        }
    }
    return result;
    
}


const OFilter = function(o,...key){
    let result = Object.assign({},o._doc)
    // console.log(result)
    for(let i of key){
        delete result[i]   
    }
    return result
}

// console.log('---',OFilter({"a":1,"b":2}, 'a','b'))

module.exports = {
    ArrFilter,
    OFilter
}