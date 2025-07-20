export const get = (key) => {
    const data = localStorage.getItem(key);
    try {
        return data ? JSON.parse(data) : null;
    } catch {
        return data;
    }
};

// set
export const set = (key, value) => {
    localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value)
    );
};

// remove
export const remove = (key) => {
    localStorage.removeItem(key);
};
