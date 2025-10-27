/**
 * Slantapp code and properties {www.slantapp.io}
 */
//json parser function
const PrintRest = (m, s, d) => ({message: m, status: s, data: d});
//ascii code generator
const AsciiCodes = function generateChar(length) {
    //populate and store ascii codes
    let charArray = [];
    let code = [];
    for (let i = 33; i <= 126; i++) charArray.push(String.fromCharCode(i));
    //do range random here
    for (let i = 0; i <= length; i++) {
        code.push(charArray[Math.floor(Math.random() * charArray.length - 1)]);
    }
    return code.join("");
}

const formatLargeNumber = (number) => {
    if (number >= 1e12) {
        return (number / 1e12).toFixed(1) + 'T';
    } else if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + 'B';
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'M';
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'K';
    } else {
        return number.toLocaleString();
    }
}

const generateReference = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let reference = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        reference += characters.charAt(randomIndex);
    }
    return reference;
}
const Paginated = async (model, page, limit, option = {}) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;


    let results = await model.findAndCountAll({
        ...option,
        limit,
        offset,
        order: [
            ['createdAt', 'DESC']
        ],
    });

    const totalPages = Math.ceil(results.count / limit);

    return {
        page,
        limit,
        total: results.count ?? results.length,
        totalPages,
        data: results.rows,
    };
};

export default {PrintRest, AsciiCodes, formatLargeNumber, Paginated, generateReference}
