const faker = require('faker')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'faker'
});

const possibleFields = [ 'nome', 'email', 'telefone', 'endereco', 'cidade', 'empresa', 'valor', 'preco', 'data' ]

const fakerValues = () => [
    faker.phone.phoneNumberFormat(),
    faker.internet.email(),
    faker.phone.phoneNumberFormat(),
    faker.address.streetAddress(),
    faker.address.country(),
    faker.company.companyName(),
    faker.commerce.price(),
    faker.commerce.price(),
    faker.date.past()
]

connection.connect( ( err ) =>  {
    if ( err ) throw err;
    
    const select = connection.query( 'SHOW COLUMNS FROM faker')

    select.on('result', (columns) => {
        for( let a = 0; a < 10; a++ ){
            setTimeout( () => {
                for( let i = 0; i < columns.length - 1; i++ ){
                    let currentQuery = {}
                    for( let c = 0; c < possibleFields.length; c++ ) {
                        if( columns[ i ]['Field'].includes( possibleFields[ c ] ) ){
                            // console.log(possibleFields[ c ], fakerValues()[ c ])
                            currentQuery[possibleFields[ c ]] = fakerValues()[ c ]
                        }
                    }

                    const query = connection.query('INSERT INTO faker SET ?', currentQuery);
                    console.log(query.sql);
                    query.on('end', () => connection.end())
                }
            }, 100)
        }
    })

    select.on('end', () => connection.end())
});

 //   let dateMonth = date.getMonth()
    //   if( dateMonth < 9 ) dateMonth = '0' + dateMonth
    //   console.log(date.getYear() + '-' + dateMonth + '-' + date.getDay())