import {rowTemplate} from "./row_template.js";
import { TableActions } from "./table_actions.js";


export class CSV{
    static exportCSV(){
        const rows = [];
        const tableRows = document.querySelectorAll('table tr');

        tableRows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('td, th');
            for (let i = 0; i < cells.length - 1; i++) {
                rowData.push(cells[i].textContent.trim());
            }
            rows.push(rowData);
        });

        let csvContent = rows.map(row => row.join(';')).join('\n');

        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        link.target = '_blank';
        link.download = 'data.csv';
        link.click();
    }

    static importCSVButton(){
        const fileInput = document.querySelector('input[type="file"]');
        fileInput.click();
    }

    static importCSV(element) {
        const file = element.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const contents = e.target.result;
            console.log(contents);

            const rows = contents.split('\n')
                .map(row => row.split(/[,\t; ]+/).map(cell => cell.trim().replace('\r', '')))
                .filter(row => row.some(cell => cell));

            const tableBody = document.querySelector('table tbody');
            tableBody.innerHTML = '';

            rows.forEach(rowData => {
                const newIP = rowData[0];
                if (newIP) {
                    console.log(rowData);
                    tableBody.insertAdjacentHTML("beforeend", rowTemplate(newIP, true));

                    const newRow = tableBody.querySelector('tr:last-child');
                    TableActions.requestExecutor(newRow, newIP);
                }
            });

            element.value = "";
        };

        reader.readAsText(file);
    }
}

window.CSV = CSV;