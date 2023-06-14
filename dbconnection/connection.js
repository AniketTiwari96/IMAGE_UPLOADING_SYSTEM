
const Knex = require('knex')({
    client:'mysql',
    connection:{
        host:'localhost',
        user:'root',
        database:'crud_operation',
        password:'aniket@123'
    }
});

Knex.schema.createTable('student',(table)=>{
    table.increments('id').primary()
    table.string('name')
    table.string('gmail').unique()
    table.string('password').unique()
    table.string('profile').nullable()
    table.text('proifleImage').nullable()

}).then((result) => {
    console.log('table created successfuly.....');
}).catch((err) => {
    console.log('talble allready exist......');
});

module.exports=Knex