export function rowTemplate(ip = "", load = "") {
    return `
        <tr">
            <td>${!ip ? `<input type="text" class="ip-input" value="${ip}" placeholder="Введите IP">` : ip}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="th_service">
                <div class="buttons disable_interaction">
                    ${!load ? 
                            `<div class="tr_button add">Добавить</div>
                            <div class="tr_button delete">Удалить</div>`
                            :
                            "Загрузка..."
                    }
                </div>
            </td>
        </tr>
    `;
}