class form {

    /**
     * Validate Login
     * @param str 
     * @returns 
     */
    static validEmail(str) {
        let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:noc\.softcell\.com|softcell\.com)$/;
        
        return regex.test(str);
    }

    /**
     * Minimum length of string
     * @param str 
     * @param length 
     * @returns 
     */
    static minLength(str, length) {
        let isInvalid = false;

        if (str.length < length) {
            isInvalid = true;
        }

        return isInvalid;
    }

    /**
     * Form Validator
     * @param  obj 
     * @returns 
     */
    static validator(obj) {
        let keys = Object.entries(obj);
        let results = [];
        let validations = null;

        keys.map((key) => {
            if ('isRequired' in key[1] && key[1].isRequired) {
                if (key[1].value.length === 0) {
                    results.push({
                        [key[0]]: [`The ${key[0]} is required.`]
                    });
                } else {
                    if ('isEmail' in key[1] && key[1].isEmail) {
                        let isValidEmail = form.validEmail(key[1].value);

                        if (!isValidEmail) {
                            results.push({
                                [key[0]]: [`The ${key[0]} must be valid .`]
                            });
                        }
                    }

                    if ('minLength' in key[1] && form.minLength(key[1].value, key[1].minLength)) {
                        results.push({
                            [key[0]]: [`The ${key[0]} must at least ${key[1].minLength} characters.`]
                        });
                    }
                }
            } else if ('isEmail' in key[1]) {
                let isValidEmail = form.validEmail(key[1].value);

                if (!isValidEmail) {
                    results.push({
                        [key[0]]: [`The ${key[0]} must be valid `]
                    });
                }
            } else if ('minLength' in key[1] && form.minLength(key[1].value, key[1].minLength)) {
                results.push({
                    [key[0]]: [`The ${key[0]} must be at least ${key[1].minLength} characters.`]
                });
            }
            return results
        })

        results = Object.assign({}, ...results.map((result) => result))

        if (Object.keys(results).length > 0) {
            validations = {
                errors: results
            }
        } else {
            validations = null
        }

        return validations;
    }
}

export default form