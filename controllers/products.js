const Product = require('../models/product')

const getAllProductsStatic = async(req,res) =>{
    const search = 'ab'
    const products = await Product.find({price:{$gt: 30}})
    .sort('price').
    select('name price')
    //.limit(10) //hardcoded for testing
    //.skip(1) //goal in dynamic getall is to use skip and limit to set up a pagination functionality
    res.status(200).json({products, nbHits:products.length})
}

const getAllProducts = async(req,res) =>{
    const {featured, company, name, sort, fields, numericFilters } = req.query //only the items/properties extracted here would be searched for, no matter how many are passed in thru the query; these values are the ones we already have in the model.
    const queryObject = {} //better approach than passing the query thru .find(), if query param doesnt exist will simply return an empty object hence, all the objects
    if (featured) {
        queryObject.featured = featured === "true"? true : false //ternary operator
    } 
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if(numericFilters){
        const operatorMap = {
            '>':'$gt',    //user-friendly options vs mongoose syntax
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
    
        }
        const regEx = /\b(>|>=|=|<=|<)\b/g
        let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)   //replace method used here to call numericFilters and pass regEx, if there is a match the callback function will convert(replace) the user-friendly option from operatorMap(key) to mongoose understood syntax(value).
        const options = ['price','rating']; //filter can only be used on options included here, should be specified in API documentation.
        filters = filters.split(',').forEach((item)=>{
            const [field,operator,value] = item.split('-') //array destructuring, each item split by '-' added in reGex i.e split into price (field), $gt(operator) and 40(value)
            if(options.includes(field)){
                queryObject[field] = {[operator] : Number(value)} //dynamically change the query object according to the operator and value being passed through
            }
        })
    }

    console.log(queryObject)
    let result = Product.find(queryObject)
    //sort
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    }else{   //default sorting value
        result = result.sort('createdAt')
    }
    if(fields){
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1 //passed in by user as a string so we need to turn it into a number
    const limit = Number(req.query.limit) || 10

    const skip = (page -1) * limit; //pagination logic, you are skipping the page number minus one times the limit i.e if you want to see page two and the limit is 7 items per page, you will skip (2-1) * 7: 7 items, to see 'page 2'
    result = result.skip(skip).limit(limit)

    const products = await result //this should always sit below all the conditions, at the very end since we are awaiting 'result'
    res.status(200).json({products, nbHits:products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}