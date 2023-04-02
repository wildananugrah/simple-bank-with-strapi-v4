// src/api/content-types/customer/lifecycles.js

module.exports = {
    beforeCreate: async (event) => {

        const generate_cif = async (length) => {
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

        const get_cif = async () => {
            
            let cif = ""
            let customer = []
            do {
                cif = await generate_cif(10)
                customer = await strapi.entityService.findMany("api::customer.customer", {
                    filters: {
                        cif: cif
                    }
                })
                console.log(`customer: ${customer}`)
                console.log(`cif: ${cif}`)
            } while (customer.length != 0)

            return cif
        }

        const { data } = event.params;
        data.cif = await get_cif()
    },
};