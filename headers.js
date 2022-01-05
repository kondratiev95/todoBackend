export const setHeaders = (response) => {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    response.setHeader("Access-Control-Allow-Credentials", true);
}