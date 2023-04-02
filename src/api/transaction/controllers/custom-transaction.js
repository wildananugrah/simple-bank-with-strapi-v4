// src/api/transaction/controllers/custom-transaction.js

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

const get_account = async (account_number) => {
    const accountResponse = await strapi.entityService.findMany("api::account.account",
        {
            filters: {
                number: account_number
            }
        }
    )

    return accountResponse[0]
}

const generate_journal = async (length) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const get_journal = async () => {

    let journal = ""
    let transaction = []
    do {
        journal = await generate_journal(10)
        transaction = await strapi.entityService.findMany("api::transaction.transaction", {
            filters: {
                journal: journal
            }
        })
        console.log(`journal: ${journal}`)
    } while (transaction.length != 0)

    return journal
}

module.exports = {
    async debit(ctx, next) {

        const requestBody = ctx.request.body.data
        const account = await get_account(requestBody.account_number)

        if (account.length == 0) {
            throw new ApplicationError('Invalid account number', { message: `Can not find ${requestBody.account_number} account number` });
        }
        else {
            const new_balance = account.balance - requestBody.amount
            const transaction = {
                data: {
                    journal: await get_journal(),
                    account_number: requestBody.account_number,
                    payment_type: requestBody.payment_type,
                    status: "SUCCEED",
                    action: "DEBIT",
                    amount: requestBody.amount,
                    publishedAt: new Date()
                }
            }
            
            await strapi.entityService.create("api::transaction.transaction", transaction)

            await strapi.entityService.update("api::account.account", account.id, {
                data: {
                    balance: new_balance
                }
            })

            return transaction
        }
        
    },
    async credit(ctx, next) {

        const requestBody = ctx.request.body.data

        const account = await get_account(requestBody.account_number)
        console.log(account)

        if (account.length == 0) {
            throw new ApplicationError('Invalid account number', { message: `Can not find ${requestBody.account_number} account number` });
        }
        else {
            const new_balance = account.balance + requestBody.amount
            const transaction = {
                data: {
                    journal: await get_journal(),
                    account_number: requestBody.account_number,
                    payment_type: requestBody.payment_type,
                    status: "SUCCEED",
                    action: "CREDIT",
                    amount: requestBody.amount,
                    publishedAt: new Date()
                }
            }

            await strapi.entityService.create("api::transaction.transaction", transaction)

            await strapi.entityService.update("api::account.account", account.id, {
                data: {
                    balance: new_balance
                }
            })

            return transaction

        }
    }
}