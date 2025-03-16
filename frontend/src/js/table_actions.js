import {rowTemplate} from "./row_template.js";
import {serverRequest} from "./server_actions.js";
import {checkIP} from "./ip_reg.js";


export class TableActions{
    static getRow(element){
        return element.closest("tr")
    }

    static deleteRow(element){
        const row = TableActions.getRow(element);
        if (row) {
            row.remove();
        }
        else {
            alert("Строка не найдена")
        }
    }

    static editRow(element){
        const row = TableActions.getRow(element);
        if (row) {
                const inputIP = row.querySelector("td:first-child");
                const buttonBlock = row.querySelector(".buttons");
                buttonBlock.classList.remove('message');

                const value = inputIP.textContent.trim();
                inputIP.innerHTML = `<input type="text" class="ip-input" value="${value}">`;

                buttonBlock.innerHTML = `
                    <div class="tr_button add">Изменить</div>
                    <div class="tr_button delete">Удалить</div>
                `;

                const addButton = buttonBlock.querySelector('.tr_button.add');
                const deleteButton = buttonBlock.querySelector('.tr_button.delete');

                addButton.addEventListener("click", function () {
                    TableActions.requestExecutor(inputIP, inputIP.querySelector("input").value.trim());
                });

                deleteButton.addEventListener('click', function() {
                    TableActions.deleteRow(this);
                });
        }
        else {
            alert("Строка не найдена")
        }
    }

    static addRow(real_new){
        const tableBody = document.querySelector("tbody");
        tableBody.insertAdjacentHTML("beforeend", rowTemplate());

        const newRow = tableBody.querySelector(`tr:last-child`);
        const inputIP = newRow.querySelector(".ip-input");

        if(real_new){
             tableBody.scrollTop = tableBody.scrollHeight;
        }

        newRow.querySelector(".add").addEventListener("click", function () {
            TableActions.requestExecutor(inputIP, inputIP.value.trim());
        });

        newRow.querySelector(".delete").addEventListener("click", function () {
            newRow.remove();
        });
    }

    static requestExecutor(element, ip) {
        if (checkIP(ip)) {
            serverRequest(element, ip);
        }
    }

    static loadView(row, ip){
        row.classList.remove('tr_success', 'tr_error');
        row.cells[0].textContent = `${ip}`;
        row.cells[1].textContent = "";
        row.cells[2].textContent = "";
        row.cells[3].textContent = "";
        row.cells[4].textContent = "";
        row.querySelector(".buttons").innerHTML = "Загрузка..."
    }

    static responseSuccessView(row ,data){
        row.classList.add('tr_success');
        TableActions.responseGeneral(row, data);
    }

    static responseErrorView(row, data){
        row.classList.add('tr_error');
        TableActions.responseGeneral(row, data);
    }

    static responseGeneral(row, data){
        row.cells[0].textContent = data.ip;
        row.cells[1].textContent = data.ping_ms;
        row.cells[2].textContent = data.success_rate;
        row.cells[3].textContent = data.fail_rate;
        row.cells[4].textContent = data.last_success_ping;

        const buttonBlock = row.querySelector(".buttons");
        buttonBlock.classList.remove('message');
        buttonBlock.innerHTML = `
            <div class="tr_button delete">Удалить</div>
            <div class="tr_button edit">Редактировать</div>
        `;

        const deleteButton = buttonBlock.querySelector('.tr_button.delete');
        const editButton = buttonBlock.querySelector('.tr_button.edit');

        deleteButton.addEventListener('click', function() {
            TableActions.deleteRow(this);
        });

        editButton.addEventListener('click', function() {
            TableActions.editRow(this);
        });
    }

    static serverErrorView(row, ip){
        row.classList.add('tr_error');
        const inputIp = row.cells[0]
        inputIp.textContent = `${ip}`;
        row.cells[1].textContent = 'n/a';
        row.cells[2].textContent = 'n/a';
        row.cells[3].textContent = 'n/a';
        row.cells[4].textContent = 'n/a';
        const buttonBlock = row.querySelector(".buttons")
        buttonBlock.classList.add('message');

        buttonBlock.innerHTML = `
            <div>Ошибка на стороне backend.</div>
            <div class="tr_button update">Обновить</div>
        `;

        const updateButton = row.querySelector(".buttons").querySelector('.tr_button.update');

        updateButton.addEventListener("click", function () {
            TableActions.requestExecutor(inputIp, ip);
        });
    }
}

window.TableActions = TableActions;