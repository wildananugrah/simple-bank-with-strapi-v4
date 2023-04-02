// src/api/content-types/account/lifecycles.js

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

module.exports = {
    beforeCreate: async (event) => {

        const generate_account_number = async (length) => {
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

        const get_account_number = async () => {

            let account_number = ""
            let account = []
            do {
                account_number = await generate_account_number(10)
                account = await strapi.entityService.findMany("api::account.account", {
                    filters: {
                        number: account_number
                    }
                })
                console.log(`account: ${account}`)
                console.log(`account_number: ${account_number}`)
            } while (account.length != 0)

            return account_number
        }

        const { data } = event.params;

        const customer = await strapi.entityService.findMany("api::customer.customer", {
            filters: {
                cif: data.cif_number
            }
        })

        if(customer.length == 0)
        {
            throw new ApplicationError('Invalid cif number', { message: `can not find '${data.cif_number}' cif number` }); 
        }
        else
        {
            data.number = await get_account_number()
            data.balance = 0
        }
    },
};