const config = require('../../config');

const mongoose = require('mongoose');
const Item = require('../models/item');

module.exports = (router) => {
    //Add new item

    router.route('/items').post(function (req, res) {
        Item.find({ item_id: req.body.item_id }, function (err, items) {
          if (!items.length) {
            var item = new Item(req.body)

            item.save(function (err) {
              if (err) {
                res.send(err)
              } else {
                res.json({ status: true, message: 'Item created!' }).end()
              }
            })
          } else {
            // Already exists, Update
            var item = items[0]
            item = Object.assign(item, req.body)

            item.save(function (err) {
              if (err) {
                res.send(err)
              } else {
                res.json({ status: true, message: 'Item already exists! Updated!!!' }).end()
              }
            })
          }
        })
    })

//Post manually added item
router.route('/items/manual').post(function (req, res) {
  Item.find({ stock_number: req.body.stock_number }, function (err, items) {
    if (!items.length) {
      Item.create(req.body, function(err){
        if(err){
          res.send(err)
        }else{
          res.json(req.body)
        }
      })
    } else {
      // Already exists, Update
      // var item = items[0]
      // item = Object.assign(item, req.body)
      res.send(err);

      // item.save(function (err) {
      //   if (err) {
      //     res.send(err)
      //   } else {
      //     res.json({ status: true, message: 'Item already exists! Updated!!!' }).end()
      //   }
      // })
    }
  })
})
//GET all items
//     router.route('/items').get(async function(req, res){
//       try{
//           const items = await Item.find()
//           console.log(items)
//           res.json(items)
//       }
//       catch (err){
//           res.send('Error ' + err)
//       }
// })
router.route('/items/search').get(async function(req, res){



  try{

       
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        
      
        const itemsCount = await Item.find(req.query).count();
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const search = {}
        let searchField = req.query.keyword;
        const searchCount = await Item.find({$and:[{make:{'$regex': searchField, '$options': '$i'}}, req.query]}).limit(limit).skip(startIndex).count




       //Search
       if(endIndex < itemsCount){
        search.next = {
          page: page + 1,
          limit: limit
        }
      }
        if(startIndex > 0){
        search.previous = {
          page: page - 1,
        
          limit: limit
        }
      }
         search.total_size = searchCount;
         search.search =await Item.find({$and:[{make:{'$regex': searchField, '$options': '$i'}}, req.query]}).limit(limit).skip(startIndex).exec()
          res.status(200).json(search);

 }  

       
  catch (err){
      res.send('Error message' + err)
  }
})


  // Get item by id
    router.route('/items/:_id').get(async function(req, res){
            try{
                const items = await Item.findById(req.params._id)
                //console.log(items)
                res.json(items)
            }
            catch (err){
                res.send('Error ' + err)
            }
    })

// Get specific items

router.route('/items').get(async function(req, res){



  try{

       
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        
        //const searches = await Item.find({make:{$regex: req.query.keyword, '$options': '$i'}})
        const itemsCount = await Item.find(req.query).count();

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const search = {}
        
        

//Use below method to find distinct fields with number of occurrences

Add code to sort the results into descending
if(req.query.distinct === '1'){
const field = "make";
 const distinct_query = req.query.distinct
var map ={}
const Distinct = await Item.aggregate([
  { $match: {}},
  { $group: { _id: '$make' , c: { $sum: 1 } } },
  { $sort: { _id: -1 } },
]).then((items) => {
    items.forEach((items)=>{
      map[items._id] = items.c
    })
    return map;
})
res.json(map);
}
  
  Item.aggregate([
    { $match: req.query || {} },
    { $group: { _id: '$' + field, c: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]).forEach(async function (g) {
    map[g._id] = g.c
  })
  return map

console.log(distinct("make", ""));


// Eg: 
// distinct(""items"", ""make"", """");


        const results = {}
        
        //Pagination
        if(endIndex < itemsCount){
         results.next = {
           page: page + 1,
           limit: limit
         }
       }
         if(startIndex > 0){
         results.previous = {
           page: page - 1,
         
           limit: limit
         }
       }


       //await Item.find(req.query).sort(req.query.sort).limit(limit).skip(startIndex).populate(

       

         results.total_size = itemsCount;
 
           results.results = await Item.find(req.query).sort(req.query.sort).limit(limit).skip(startIndex).exec()
      
          res.status(200).json(results)

 }  

       
  catch (err){
      res.send('Error message' + err)
  }
})



router.route('/items').put(async function(req, res){
    
})
    // clean items
    router.route('/items/clean').post(async function (req, res) {
        await Item.updateMany(
            { 
                site: 1, 
                status:'enabled',
            }, 
            { 
                $set:{status:'deleted'} 
            }
        );

        return res.send({ success: 'Item Cleaned Successfully' })
    })
}