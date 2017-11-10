const faker = require('faker')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'faker'
});

const possibleFields = [ 'nome', 'email', 'telefone', 'endereco', 'cidade', 'empresa', 'valor', 'preco', 'data' ]

const pastDateFormated = ( date ) => {
    let dateMonth = date.getMonth()
    if( dateMonth < 9 ) 
        dateMonth = '0' + dateMonth
    return date.getYear() + '-' + dateMonth + '-' + date.getDay()
}

const fakerValues = () => [
    faker.name.findName(),
    faker.internet.email(),
    faker.phone.phoneNumberFormat(),
    faker.address.streetAddress(),
    faker.address.city(),
    faker.company.companyName(),
    faker.commerce.price(),
    faker.commerce.price(),
    pastDateFormated( faker.date.past() )
]

connection.connect( ( err ) =>  {
    connection.on('error', ( err ) => {
        console.log( "[mysql error]", err );
    });
});

connection.query( 'SHOW COLUMNS FROM faker', ( error, columns ) => {
    for( let a = 0; a < 100; a++ ){
        setTimeout( () => {
            let currentQuery = {}
            for( let i = 0; i < columns.length; i++ ){
                for( let c = 0; c < possibleFields.length; c++ ) {
                    if( columns[ i ][ 'Field' ].includes( possibleFields[ c ] ) ){
                        currentQuery[ possibleFields[ c ] ] = fakerValues()[ c ]
                    }
                }
            }
            let query = connection.query( 'INSERT INTO faker SET ?' , currentQuery, () => {
                if( a == 99 )
                    connection.end()
            });
        })
    }
})
 