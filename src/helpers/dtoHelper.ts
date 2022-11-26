interface GetPagination {
    limit: number | 10,
    offset: number | 0,
    page: number | 0,
}

interface GetDataPagination {
    total_data: number | 10,
    total_pages: number | 0,
    current_page: number | 0,
    data: any
}

const getPagination = (req: any): GetPagination => {
    const {size, page} = req;
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return {limit, offset, page};
};

const getPagingData = (dataSQL: any, page: number | 0, limit: number): GetDataPagination => {
    const {count: total_data, rows: data} = dataSQL;
    const current_page = page ? +page : 0;
    const total_pages = Math.ceil(total_data / limit);

    return {total_data, total_pages, current_page, data};
};

export default {getPagination, getPagingData}