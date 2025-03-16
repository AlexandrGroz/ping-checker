import {TableActions} from "./table_actions.js";


export function serverRequest(element, ip){
    const row = element.tagName === "TR" ? element : element.closest("tr");
    TableActions.loadView(row, ip)

    fetch(`/ping?ip=${ip}`)
    .then(response => response.json())
    .then(data => {
        if(data.status === "success"){
            TableActions.responseSuccessView(row, data)
        }
        else {
            TableActions.responseErrorView(row, data)
        }
    })
    .catch(err => {
        TableActions.serverErrorView(row, ip)
        console.error(err);
    });
}