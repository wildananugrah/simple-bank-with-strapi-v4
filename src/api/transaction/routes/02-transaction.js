module.exports = {
    routes: [
        { // Path defined with an URL parameter
            method: 'POST',
            path: '/transactions/debit',
            handler: 'custom-transaction.debit',
        },
        { // Path defined with an URL parameter
            method: 'POST',
            path: '/transactions/credit',
            handler: 'custom-transaction.credit',
        },
    ]
}